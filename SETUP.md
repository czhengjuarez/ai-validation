# AI Validation Playbook - Setup Guide

## Overview

This application helps teams create and manage validation workflows for AI-generated content. It includes:

1. **Default AI Validation Template** - A comprehensive guide for validating AI content across various use cases
2. **Content Moderation Workflow** - Specialized workflow for moderating user-generated content with AI assistance
3. **Custom Playbook Creation** - Create and save your own validation playbooks
4. **R2 Storage Integration** - Persist playbooks using Cloudflare R2 storage

## Prerequisites

- Node.js 18+ and npm
- Cloudflare account (for R2 storage and Workers deployment)
- Wrangler CLI (Cloudflare's command-line tool)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Wrangler CLI (for API deployment)

```bash
npm install -g wrangler
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Note:** Without the backend API, the app will work with the built-in templates only. User-created playbooks will not persist.

## Cloudflare R2 Storage Setup

### 1. Create an R2 Bucket

```bash
# Login to Cloudflare
wrangler login

# Create the R2 bucket
wrangler r2 bucket create ai-validation-playbooks
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://your-worker-name.your-subdomain.workers.dev
```

### 3. Deploy the Cloudflare Worker

```bash
# Deploy the API worker
wrangler deploy

# The output will show your worker URL
# Update VITE_API_URL with this URL
```

### 4. Set CORS Origin (Optional)

If you want to restrict API access to your frontend domain:

```bash
wrangler secret put CORS_ORIGIN
# Enter your frontend domain, e.g., https://your-app.com
```

## Production Deployment

### Option 1: Cloudflare Pages (Recommended)

1. **Connect your repository to Cloudflare Pages**
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project"
   - Connect your Git repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

3. **Set environment variables**
   - Add `VITE_API_URL` with your Worker URL

4. **Deploy**
   - Cloudflare Pages will automatically build and deploy your app

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
```

### Option 3: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variable in Netlify dashboard
```

## Features

### 1. View Templates

- **Default AI Validation Playbook**: Comprehensive guide with 3 escalation paths
  - Internal Verification
  - External Expert Review
  - Avoid AI Content

- **Content Moderation Workflow**: Specialized workflow with 4 escalation paths
  - Automated Approval
  - Human Moderator Review
  - Immediate Removal & Escalation
  - Appeal Review Process

### 2. Print/Download Templates

Each playbook can be:
- **Printed** using the Print button (browser print dialog)
- **Downloaded as JSON** for backup or sharing

### 3. Create Custom Playbooks

1. Click "Create New Playbook"
2. Fill in title and description
3. Define escalation paths with:
   - Path name
   - Description
   - Action type (Verify/Consult/Avoid)
   - Conditions (when this path applies)
4. Click "Create Playbook" to save to R2 storage

### 4. Interactive Decision Tree

Each playbook includes an interactive decision tree that guides users through validation decisions based on their specific content.

## Architecture

```
Frontend (React + Vite)
    ↓
Cloudflare Worker (API)
    ↓
Cloudflare R2 (Storage)
```

### Frontend Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Mantine UI** - Component library
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### Backend Stack
- **Cloudflare Workers** - Serverless API
- **Cloudflare R2** - Object storage (S3-compatible)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/playbooks` | List all playbooks |
| POST | `/api/playbooks` | Create a new playbook |
| GET | `/api/playbooks/:id` | Get a specific playbook |
| PUT | `/api/playbooks/:id` | Update a playbook |
| DELETE | `/api/playbooks/:id` | Delete a playbook |

## Troubleshooting

### Templates work but custom playbooks don't save

- Check that the Cloudflare Worker is deployed: `wrangler deployments list`
- Verify `VITE_API_URL` is set correctly in your `.env` file
- Check browser console for API errors

### CORS errors

- Set the `CORS_ORIGIN` secret in your Worker: `wrangler secret put CORS_ORIGIN`
- Or update the CORS headers in `api/index.ts` to allow your domain

### Build errors

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## Cost Estimate

### Cloudflare Free Tier Includes:
- **R2 Storage**: 10 GB storage, 1 million Class A operations/month, 10 million Class B operations/month
- **Workers**: 100,000 requests/day
- **Pages**: Unlimited bandwidth

For most use cases, this application will run entirely on the free tier.

## Security Considerations

1. **API Authentication**: The current implementation doesn't include authentication. For production, consider adding:
   - API keys
   - JWT tokens
   - Cloudflare Access

2. **Input Validation**: The Worker validates playbook structure but consider adding:
   - Rate limiting
   - Content size limits
   - XSS protection

3. **CORS**: Configure `CORS_ORIGIN` to restrict API access to your frontend domain only

## Next Steps

1. Add user authentication
2. Implement playbook versioning
3. Add collaboration features (sharing, comments)
4. Create analytics dashboard
5. Add export to PDF functionality
6. Implement playbook templates marketplace

## Support

For issues or questions, please open an issue on the GitHub repository.
