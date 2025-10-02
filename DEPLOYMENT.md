# Deployment Guide

This guide will help you deploy the AI Validation Playbook application to Cloudflare.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Already included in the project dependencies
3. **Node.js**: Version 18 or higher

## Architecture

The application consists of two parts:
- **Frontend**: React SPA deployed to Cloudflare Pages
- **Backend API**: Cloudflare Worker with R2 storage

## Step 1: Authenticate with Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

## Step 2: Create R2 Bucket

Create the R2 bucket for storing playbooks:

```bash
npx wrangler r2 bucket create ai-validation-playbooks
```

## Step 3: Deploy the API Worker

Deploy the backend API to Cloudflare Workers:

```bash
npm run deploy:api
```

This will:
- Deploy the worker with the name `ai-validation`
- Bind the R2 bucket `ai-validation-playbooks`
- Provide you with a worker URL (e.g., `https://ai-validation.your-subdomain.workers.dev`)

**Important**: Copy the worker URL - you'll need it for the frontend configuration.

## Step 4: Update Frontend API URL

Update the API URL in your frontend code to point to your deployed worker:

1. Open `src/services/storage.ts`
2. Update the `API_BASE_URL` constant:

```typescript
const API_BASE_URL = 'https://ai-validation.your-subdomain.workers.dev';
```

Or set it as an environment variable in `.env`:

```bash
VITE_API_URL=https://ai-validation.your-subdomain.workers.dev
```

## Step 5: Deploy the Frontend

Deploy the frontend to Cloudflare Pages:

```bash
npm run deploy:pages
```

This will:
- Build the React application
- Deploy to Cloudflare Pages with project name `ai-validation`
- Provide you with a Pages URL (e.g., `https://ai-validation.pages.dev`)

## Step 6: Configure CORS (Optional)

If you want to restrict API access to your frontend domain only:

```bash
npx wrangler secret put CORS_ORIGIN
# Enter: https://ai-validation.pages.dev
```

## One-Command Deployment

After initial setup, you can deploy both API and frontend with:

```bash
npm run deploy
```

## Custom Domain (Optional)

### For the Frontend (Pages)

1. Go to Cloudflare Dashboard → Pages → ai-validation
2. Click "Custom domains"
3. Add your custom domain (e.g., `validation.yourdomain.com`)

### For the API (Worker)

1. Go to Cloudflare Dashboard → Workers & Pages → ai-validation
2. Click "Triggers" → "Custom Domains"
3. Add your custom domain (e.g., `api.validation.yourdomain.com`)

## Environment Variables

The application works with localStorage by default and seamlessly upgrades to R2 when the API is available.

### Frontend Environment Variables

Create a `.env` file (optional):

```bash
VITE_API_URL=https://ai-validation.your-subdomain.workers.dev
```

### Worker Environment Variables

Set via Wrangler secrets:

```bash
# Optional: Restrict CORS to your frontend domain
npx wrangler secret put CORS_ORIGIN
```

## Monitoring & Logs

### View Worker Logs

```bash
npx wrangler tail
```

### View Deployment Status

```bash
# Check worker status
npx wrangler deployments list

# Check Pages status
npx wrangler pages deployment list --project-name=ai-validation
```

## Rollback

### Rollback Worker

```bash
npx wrangler rollback
```

### Rollback Pages

Go to Cloudflare Dashboard → Pages → ai-validation → Deployments, and click "Rollback" on a previous deployment.

## Local Development

### Run API Locally

```bash
npm run dev:api
```

The API will be available at `http://localhost:8787`

### Run Frontend Locally

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Troubleshooting

### Issue: R2 Bucket Not Found

Make sure the bucket is created:
```bash
npx wrangler r2 bucket list
```

### Issue: CORS Errors

Check that your worker URL is correctly set in the frontend and CORS_ORIGIN is configured if needed.

### Issue: Build Fails

Clear cache and rebuild:
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Cost Estimation

Cloudflare offers generous free tiers:

- **Workers**: 100,000 requests/day free
- **R2 Storage**: 10 GB storage free
- **Pages**: Unlimited static requests

For most use cases, this application will run entirely on the free tier.

## Support

For issues with:
- **Cloudflare Workers**: [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- **Cloudflare Pages**: [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- **R2 Storage**: [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
