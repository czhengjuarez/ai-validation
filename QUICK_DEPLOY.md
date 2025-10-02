# Quick Deployment Guide

Deploy your AI Validation Playbook to Cloudflare Workers in 2 steps!

## 🚀 Quick Start

### Step 1: Login to Cloudflare
```bash
npx wrangler login
```

### Step 2: Run Deployment Script
```bash
./deploy.sh
```

That's it! Your full-stack application is now live on a single Cloudflare Worker.

## 📦 What Gets Deployed

- ✅ **Worker**: `ai-validation` (Serves frontend + API)
- ✅ **R2 Bucket**: `ai-validation-playbooks` (Playbook storage)
- ✅ **Static Assets**: Bundled with the worker

## 🔄 Redeploy

Deploy everything:
```bash
npm run deploy
```

Or use the script:
```bash
./deploy.sh
```

## 🌐 Your URL

After deployment, you'll get a single URL:
- **Application**: `https://ai-validation.YOUR-SUBDOMAIN.workers.dev`

Everything (frontend + API) is served from this one URL!

## 🎯 Custom Domain (Optional)

1. Go to Cloudflare Dashboard
2. Navigate to Pages → ai-validation → Custom domains
3. Add your domain (e.g., `validation.yourdomain.com`)

## 💡 Tips

- The app works offline with localStorage by default
- R2 storage is automatically used when API is available
- All templates are read-only and cannot be deleted
- User-created playbooks are stored in R2

## 📊 Free Tier Limits

- Workers: 100,000 requests/day
- R2: 10 GB storage
- Pages: Unlimited requests

Perfect for most use cases! 🎉

## 🆘 Need Help?

See detailed guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
