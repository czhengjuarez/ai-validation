# AI Validation Playbook

A comprehensive web application for creating and managing validation workflows for AI-generated content. This tool helps organizations establish clear guidelines for when to verify, consult experts, or avoid using AI-generated content.

## Features

✨ **5 Pre-built Templates**
- **Default AI Validation Playbook** - General AI content validation framework
- **Content Moderation Workflow** - User-generated content moderation
- **AI-Assisted Code Review** - Software development code validation
- **AI-Generated Design Review** - Design and visual asset validation
- **Communications & PR Review** - Public communications and messaging

🎯 **Interactive Decision Tree**
- Guide users through validation decisions with an interactive questionnaire
- Get personalized recommendations based on content characteristics

📥 **Export & Share**
- Print playbooks for offline reference
- Download as JSON for backup or sharing
- Share playbooks with team members

🔧 **Custom Playbook Creation**
- Create custom validation workflows tailored to your organization
- Define escalation paths with specific conditions
- Save playbooks to Cloudflare R2 storage

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## What's Included

### 1. Default AI Validation Template

A comprehensive template with three escalation paths:

- **Internal Verification** - For sensitive business information, legal implications, customer-facing content
- **External Expert Review** - For technical domains, high-impact decisions, complex subject matter
- **Avoid AI Content** - For sensitive personal information, legal/medical advice, critical accuracy requirements

### 2. Content Moderation Workflow

A specialized workflow for content moderation teams with four escalation paths:

- **Automated Approval** - Low-risk content that passes automated checks
- **Human Moderator Review** - Borderline content requiring human judgment
- **Immediate Removal & Escalation** - Clear policy violations
- **Appeal Review Process** - User appeals requiring senior review

## Tech Stack

- **React 19** + **TypeScript** - Modern UI development
- **Vite** - Fast build tool and dev server
- **Mantine UI** - Rich component library
- **Tailwind CSS** - Utility-first styling
- **Cloudflare Pages** - Static site hosting with serverless functions
- **Cloudflare R2** - Object storage for playbooks
- **localStorage** - Client-side fallback storage

## Architecture

### Deployment Strategy: Cloudflare Pages

This application uses **Cloudflare Pages** as the primary deployment platform. We evaluated both Cloudflare Workers and Pages, and chose Pages for the following reasons:

**Why Pages over Workers:**
- ✅ **Automatic Static Asset Handling** - Pages natively serves frontend files without manual configuration
- ✅ **Built-in Functions Support** - Pages Functions provide serverless API routes with zero configuration
- ✅ **GitHub Integration** - Automatic deployments on every push with preview deployments for PRs
- ✅ **Simpler Configuration** - No need to manually manage KV namespaces or asset manifests
- ✅ **Better DX** - Designed specifically for full-stack applications with frontend + API

**Architecture Overview:**
```
┌─────────────────────────────────────────────┐
│         Cloudflare Pages                    │
├─────────────────────────────────────────────┤
│  Frontend (React SPA)                       │
│  - Static assets served from /dist          │
│  - Client-side routing                      │
│  - localStorage fallback                    │
├─────────────────────────────────────────────┤
│  Pages Functions (/functions/api/)         │
│  - GET/POST/PUT/DELETE /api/playbooks      │
│  - Serverless TypeScript functions          │
│  - Automatic CORS handling                  │
├─────────────────────────────────────────────┤
│  Cloudflare R2 Storage                      │
│  - Persistent playbook storage              │
│  - Bound via PLAYBOOKS_BUCKET               │
└─────────────────────────────────────────────┘
```

### Storage Strategy

The application uses a **dual-storage approach**:

1. **Primary: Cloudflare R2** - Server-side persistent storage
   - Playbooks stored as JSON objects
   - Accessible across devices and sessions
   - Requires backend deployment

2. **Fallback: localStorage** - Client-side storage
   - Automatic fallback when R2 is unavailable
   - Works immediately without backend
   - Seamlessly upgrades to R2 when deployed

## Documentation

- [Setup Guide](./SETUP.md) - Complete setup and deployment instructions
- [API Documentation](./SETUP.md#api-endpoints) - Backend API reference

## Deployment

### Deploy to Cloudflare Pages (Recommended)

**Option 1: GitHub Integration (Automatic)**
1. Push code to GitHub
2. Connect Cloudflare Pages to your repository
3. Configure build settings:
   - Build command: `npm run build`
   - Build output: `dist`
   - Production branch: `main`
4. Add R2 binding in Settings → Functions:
   - Variable: `PLAYBOOKS_BUCKET`
   - Bucket: `ai-validation-playbooks`

**Option 2: Manual Deployment**
```bash
# Login to Cloudflare
npx wrangler login

# Deploy manually
npm run deploy
```

### Live Demo
🌐 **Production**: https://ai-validation.pages.dev

### Alternative Platforms
- Vercel (frontend only, requires separate API)
- Netlify (frontend only, requires separate API)
- Any static hosting service (localStorage only)

## Development

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
