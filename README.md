# AI SaaS Background Remover

A full-stack web app that removes the background from an image using an external AI image-processing service. Users sign in with Clerk, and the app stores its data in MongoDB.

**Live demo:** https://bg-removal-zk.vercel.app/

<!-- Add 2 screenshots here (upload screen, before/after result). Example:
![Upload screen](./screenshots/upload.png)
-->

## Features

- Upload an image and get it back with the background removed
- User authentication with Clerk
- Data stored in MongoDB
- Responsive interface built with Tailwind CSS
- Deployed full-stack

## Tech Stack

- Frontend: Next.js, Tailwind CSS
- Backend: Node.js server in the `Server` folder
- Database: MongoDB
- Authentication: Clerk
- AI: external AI image-processing API

## Project Structure

```
BG-Removal/
├── client/    # frontend app
└── Server/    # backend server
```

## Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/zaidkamran327/BG-Removal.git
   cd BG-Removal
   ```

2. Install dependencies for both parts

   ```bash
   cd Server
   npm install
   cd ../client
   npm install
   ```

3. Create `.env` files

   Use the same variable names your code reads. You will need:

   - your Clerk keys
   - your MongoDB connection string
   - your API key for the AI image-processing service

   Never commit `.env` files to GitHub.

4. Run the backend and the frontend in two terminals

   ```bash
   cd Server
   npm start
   ```

   ```bash
   cd client
   npm run dev
   ```

   Adjust the commands if your `package.json` scripts have different names.

## Author

**Zaid Kamran**: BBIT student at UET Lahore, full stack web developer.

- GitHub: https://github.com/zaidkamran327/
- LinkedIn: https://www.linkedin.com/in/zaid-kamran/
