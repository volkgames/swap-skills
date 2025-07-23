# SwapSkills

A platform for skill exchange and learning built with Next.js.

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables by copying the sample file:
```bash
cp .env.sample .env
```

Required environment variables:
```env
# Database
DATABASE_URL=your_database_url

# Auth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_verified_email@domain.com

# App Config
NODE_ENV=development
HOST_NAME=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- User authentication with GitHub and Google
- Email verification system
- Modern UI with Tailwind CSS
- Type-safe database operations with Drizzle ORM

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Drizzle ORM
- Tailwind CSS
- Resend for email
