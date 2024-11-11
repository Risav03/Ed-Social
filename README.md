# Ed-Social

Ed-Social is a social media platform aimed at fostering community interactions around educational content, discussions, and resources. Built with Next.js, NextAuth, MongoDB, and AWS S3, it leverages both TypeScript and JavaScript to ensure a scalable and user-friendly experience.

## Deployed Link: 
[Ed-Social](https://ed-social.vercel.app/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication (via NextAuth)
- User profiles with customizable bios and profile pictures
- Content posting and media uploads
- Real-time comments and discussions
- Search and explore functionality
- Responsive design for a seamless experience across devices

## Tech Stack

- **Frontend**: Next.js, TypeScript/JavaScript
- **Backend**: Next.js API routes, MongoDB for database
- **Authentication**: NextAuth
- **Storage**: AWS S3 for media uploads
- **Styling**: [Add styling framework or library if used, e.g., Tailwind CSS, Styled-Components]

## Installation

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [AWS S3 Account](https://aws.amazon.com/s3/) for media storage

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Risav03/Ed-Social.git
   cd Ed-Social
   ```

2. Install Dependencies:
    ```bash
   npm install
   ```

3. Setup Environment Variables.

4. Start the development server:
    ```bash 
    npm run dev
    ```

5. Open your browser and go to ```http://localhost:3000``` to view the app

## Usage

### Running in Development

To run the project locally, use:
```bash
npm run dev
```

### Running in Production

To build and run the app in production mode:
```bash
npm run build
npm start
```

## Environment Variables

Create a ```.env.local``` file in the root of the project and add the following variables:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
MONGODB_URI=your_mongodb_uri
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
```
