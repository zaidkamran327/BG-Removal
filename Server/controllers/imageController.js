import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import userModel from '../models/userModel.js';

// Controller function to remove background from image

const removeBgImage = async (req, res) => {
    try {
        const { clerkId } = req.body

        if (!process.env.CLIPDROP_API) {
            return res.status(500).json({
                success: false,
                message: 'Background removal service is not configured. Set CLIPDROP_API on the server.'
            })
        }

        const user = await userModel.findOne({ clerkId })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        
        if (user.creditBalance === 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
        }

        const imagePath = req.file.path

        const formdata = new FormData()
        formdata.append('image_file', fs.createReadStream(imagePath), {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        })

        const { data, headers } = await axios.post('https://clipdrop-api.co/remove-background/v1', formdata, {
            headers: {
                ...formdata.getHeaders(),
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')

        const resultImage = `data:${headers['content-type'] || 'image/png'};base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, {
            creditBalance: user.creditBalance - 1
        })

        res.json({ success: true,resultImage , creditBalance: user.creditBalance-1 , message: 'Background removed successfully' })

    } catch (error) {
        const upstreamStatus = error.response?.status
        const upstreamData = error.response?.data
        let upstreamMessage

        if (upstreamData) {
            const responseText = Buffer.isBuffer(upstreamData)
                ? upstreamData.toString('utf8')
                : String(upstreamData)

            try {
                const responseBody = JSON.parse(responseText)
                upstreamMessage = responseBody.error || responseBody.message
            } catch {
                upstreamMessage = responseText
            }
        }

        if (upstreamStatus === 401 || upstreamStatus === 403) {
            console.error(`Clipdrop rejected the background removal request (${upstreamStatus}): ${upstreamMessage || 'No error details returned.'}`)
            return res.status(502).json({
                success: false,
                message: `Clipdrop rejected the request (${upstreamStatus}). ${upstreamMessage || 'Check the server API key, account access, and available API credits.'}`
            })
        }

        if (upstreamStatus) {
            console.error(`Clipdrop background removal request failed with status ${upstreamStatus}: ${upstreamMessage || 'No error details returned.'}`)
            return res.status(502).json({
                success: false,
                message: upstreamStatus === 429
                    ? 'The background removal service is rate limited. Please try again later.'
                    : `Clipdrop request failed (${upstreamStatus}). ${upstreamMessage || 'Please try again later.'}`
            })
        }

        console.error(`Background removal failed: ${error.message}`)
        return res.status(500).json({
            success: false,
            message: 'Unable to remove the background. Please try again.'
        })
    }
}

export { removeBgImage }