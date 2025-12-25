# AI Validation Playbook

A  web application for creating and managing validation workflows for AI-generated content. Should you use AI to do the work is the question we hold to answer with this playbook collection. 

This tool aims to help organizations establish clear guidelines for when to verify, consult experts, or avoid using AI-generated content.

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
- Dynamic question generation from playbook conditions
- Smart matching algorithm to find the best escalation path

📥 **Export & Share**
- Print playbooks for offline reference
- Download as JSON for backup or sharing
- Share playbooks with team members

🔧 **Advanced Custom Playbook Creation**
- Create custom validation workflows tailored to your organization
- Define escalation paths with specific conditions
- **NEW:** Visual action/severity selection with 7 predefined options
- **NEW:** Colored badges showing action types (verify, consult, avoid, escalate, review, approve, flag)
- **NEW:** Flexible custom action input for unique workflows
- **NEW:** Optional contributor information (name & email) for questions
- Save playbooks to Cloudflare R2 storage with localStorage fallback

✏️ **Full CRUD Operations**
- **Create** - Build new playbooks with guided editor
- **Read** - View playbooks with interactive decision trees
- **Update** - Edit existing playbooks (user-created only)
- **Delete** - Remove playbooks with confirmation (user-created only)
- Templates are read-only and cannot be edited or deleted

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Recent Updates

### October 2025 - Enhanced Editor & Contributor Features

**🎨 Improved Action/Severity Selection**
- Visual badge display showing current action with icon and color
- Dropdown selector with 7 predefined actions:
  - 🔵 **Verify** - Internal verification required
  - 🟠 **Consult** - Consult with experts
  - 🔴 **Avoid** - Avoid AI content entirely
  - 🔴 **Escalate** - Escalate to higher authority
  - 🔵 **Review** - Manual review needed
  - 🟢 **Approve** - Approve for use
  - 🟡 **Flag** - Flag for attention
- Custom action input for unique workflows
- Clear visual feedback with colored badges
- Helpful tips explaining escalation paths and severity levels

**👤 Contributor Information**
- Optional name and email fields for playbook creators
- Privacy notice ensuring data is only used for app purposes
- Displayed in playbook viewer with mailto link
- Only saved if at least one field is provided

**📚 Architecture Documentation**
- Comprehensive decision record comparing Cloudflare Pages vs Workers
- Detailed rationale for choosing Pages as deployment platform
- Architecture diagrams and file structure documentation
- Performance comparison and lessons learned

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

## Key Features in Detail

### Custom Actions & Severity Levels

The playbook editor provides **7 predefined action types** with visual indicators:

| Action | Color | Icon | Use Case |
|--------|-------|------|----------|
| Verify | Blue | ✓ | Internal team verification needed |
| Consult | Orange | ⚠ | Expert consultation required |
| Avoid | Red | ⊘ | Do not use AI content |
| Escalate | Red | ⚠ | Escalate to higher authority |
| Review | Cyan | 👁 | Manual review required |
| Approve | Green | ✓ | Approved for use |
| Flag | Yellow | 🚩 | Flag for attention |

**Custom Actions:** Users can also create their own action types for unique workflows. Custom actions receive a purple badge with a checkmark icon.

### Contributor Attribution

Playbook creators can optionally provide:
- **Name** - For attribution and recognition
- **Email** - For questions and collaboration (displayed as mailto link)

This feature encourages knowledge sharing while respecting privacy - all information is optional and only used within the application.

### Interactive Decision Trees

Each playbook automatically generates an interactive questionnaire:
1. **Dynamic Questions** - Generated from playbook conditions
2. **Yes/No Responses** - Simple, clear decision points
3. **Smart Matching** - Algorithm finds the best escalation path
4. **Progress Tracking** - Visual feedback on decision progress
5. **Fallback Display** - Shows all paths if no conditions defined

### Full CRUD Workflow

**Create:**
- Guided editor with validation
- Real-time action badge preview
- Helpful tips and descriptions
- Auto-save to R2 or localStorage

**Read:**
- Template library with 5 pre-built workflows
- User-created playbooks list
- Interactive decision tree view
- Contributor information display

**Update:**
- Edit button on user-created playbooks
- Pre-filled form with existing data
- Version tracking with timestamps
- Templates are read-only

**Delete:**
- Confirmation dialog before deletion
- Available on user-created playbooks only
- Removes from both R2 and localStorage
- Success/error notifications

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
