# Cloud Vault

Cloud Vault is a cloud storage platform similar to Google Drive, built with Next.js 15. It allows users to upload, manage, and share files securely. The platform supports public and private file sharing and includes a payment system powered by Paddle.

## Features

- **Secure Authentication**: Uses BetterAuth with Google OAuth for secure login.
- **Cloud Storage**: Files are stored using Pinata Cloud (IPFS-based storage solution).
- **Access Management**: Users can set files as public or private and share them with specific permissions.
- **Subscriptions & Payments**: Implements Paddle for subscription management.
- **Fast & Scalable Backend**: Uses Hono with Node.js for efficient server-side processing.
- **Database**: Powered by MongoDB for storing user and file metadata.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS & Shadcn UI
- **Backend**: Hono (Node.js)
- **Database**: MongoDB
- **Authentication**: BetterAuth with Google OAuth
- **Storage**: Pinata Cloud
- **Payments**: Paddle
- **Hosting**: Vercel

## Setup & Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/diegovilhalva/cloudvault.git
   cd cloudvault
   ```

2. Install dependencies:
   ```sh
   npm install --legacy-peer-deps
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary credentials:
   ```env
   NEXT_PUBLIC_APP_URL=
   
   BETTER_AUTH_SECRET=
   BETTER_AUTH_URL=
   MONGODB_URI=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   
   NEXT_PUBLIC_GATEWAY_URL=
   PINATA_API_KEY=
   PINATA_API_SECRET=
   PINATA_JWT=
   
   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
   PADDLE_API_KEY=
   PADDLE_SUBSCRIPTION_WEBHOOK_SECRET_KEY=
   PADDLE_PRODUCT_ID=
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```

5. Access the platform at `http://localhost:3000`

## Deployment
Cloud Vault is deployed on Vercel. To deploy your own version, run:
```sh
git push origin main
```
Make sure your environment variables are set up correctly on Vercel.


## License
This project is licensed under the MIT License.

## Live Demo
[CloudVault Live](https://cloudvault-tau.vercel.app)

