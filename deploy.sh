#!/bin/bash

# AI Validation Playbook - Deployment Script
# This script deploys the full-stack application to a single Cloudflare Worker

set -e

echo "🚀 AI Validation Playbook - Cloudflare Worker Deployment"
echo "========================================================="
echo ""

# Check if wrangler is authenticated
if ! npx wrangler whoami &> /dev/null; then
    echo "❌ Not authenticated with Cloudflare"
    echo "Please run: npx wrangler login"
    exit 1
fi

echo "✅ Authenticated with Cloudflare"
echo ""

# Check if R2 bucket exists
echo "📦 Checking R2 bucket..."
if npx wrangler r2 bucket list | grep -q "ai-validation-playbooks"; then
    echo "✅ R2 bucket 'ai-validation-playbooks' exists"
else
    echo "⚠️  R2 bucket not found. Creating..."
    npx wrangler r2 bucket create ai-validation-playbooks
    echo "✅ R2 bucket created"
fi
echo ""

# Build and deploy
echo "🔨 Building frontend..."
npm run build
echo "✅ Frontend built"
echo ""

echo "🚀 Deploying to Cloudflare Worker..."
npx wrangler deploy
echo "✅ Worker deployed"
echo ""

echo "🎉 Deployment complete!"
echo ""
echo "📍 Your application is live at:"
echo "   https://ai-validation.YOUR-SUBDOMAIN.workers.dev"
echo ""
echo "To find your exact URL:"
echo "   1. Visit: https://dash.cloudflare.com"
echo "   2. Go to: Workers & Pages"
echo "   3. Click on: ai-validation"
echo "   4. Your URL will be shown at the top"
echo ""
echo "Or run: npx wrangler tail --name=ai-validation"
echo "   (The URL will be shown when you make a request)"
echo ""
echo "✨ Features:"
echo "   • Frontend and API served from the same worker"
echo "   • Playbooks stored in R2 bucket"
echo "   • localStorage fallback for offline use"
echo ""
echo "📚 For more details, see DEPLOYMENT.md"
