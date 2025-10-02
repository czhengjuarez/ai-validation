# Architecture Decision Record

## Deployment Platform: Cloudflare Pages vs Workers

**Date**: October 2, 2025  
**Status**: ✅ Decided - Using Cloudflare Pages  
**Decision Makers**: Development Team

---

## Context

We needed to choose a deployment platform for the AI Validation Playbook application, which consists of:
- React frontend (SPA)
- API endpoints for CRUD operations
- R2 storage for persistent data
- localStorage fallback for offline use

We evaluated two Cloudflare options:
1. **Cloudflare Workers** - Single worker serving both frontend and API
2. **Cloudflare Pages** - Static hosting with Pages Functions for API

---

## Decision

**We chose Cloudflare Pages as the primary deployment platform.**

---

## Evaluation

### Cloudflare Workers

**Pros:**
- ✅ Single deployment unit
- ✅ Full control over routing
- ✅ Potentially lower latency (single edge location)

**Cons:**
- ❌ Manual static asset handling required
- ❌ Need to configure KV namespace for static content
- ❌ Complex setup with `@cloudflare/kv-asset-handler`
- ❌ Manual MIME type configuration
- ❌ No built-in GitHub integration
- ❌ More complex debugging
- ❌ Requires understanding of Workers Sites architecture

**Implementation Challenges Encountered:**
- `__STATIC_CONTENT` KV namespace not automatically created
- Asset manifest configuration issues
- Static assets returning 404 errors
- Need to manually manage asset uploads

### Cloudflare Pages

**Pros:**
- ✅ **Zero-config static asset serving** - Just works out of the box
- ✅ **Built-in Pages Functions** - API routes with simple file-based routing
- ✅ **GitHub Integration** - Auto-deploy on push, preview deployments for PRs
- ✅ **Simpler configuration** - No KV namespaces or manifests to manage
- ✅ **Better developer experience** - Designed for full-stack apps
- ✅ **Automatic CORS handling** - Less boilerplate code
- ✅ **Rollback support** - Easy to revert to previous deployments
- ✅ **Build logs** - Clear visibility into deployment process

**Cons:**
- ❌ Slightly more complex routing (functions in separate directory)
- ❌ Two deployment units (frontend + functions)

**Implementation Success:**
- ✅ Frontend served immediately without configuration
- ✅ API routes working with simple TypeScript functions
- ✅ R2 binding configured in dashboard
- ✅ GitHub auto-deployment working perfectly

---

## Architecture

### Final Architecture (Cloudflare Pages)

```
┌─────────────────────────────────────────────────────┐
│                 GitHub Repository                    │
│              github.com/czhengjuarez/ai-validation   │
└────────────────────┬────────────────────────────────┘
                     │ Push to main
                     ↓
┌─────────────────────────────────────────────────────┐
│            Cloudflare Pages Build                    │
│  - npm run build                                     │
│  - Output: dist/ (frontend) + functions/ (API)      │
└────────────────────┬────────────────────────────────┘
                     │ Deploy
                     ↓
┌─────────────────────────────────────────────────────┐
│         Cloudflare Pages (Production)                │
│         https://ai-validation.pages.dev              │
├─────────────────────────────────────────────────────┤
│  Frontend Layer                                      │
│  ├─ React 19 SPA                                     │
│  ├─ Vite-built assets                                │
│  ├─ Client-side routing                              │
│  └─ localStorage fallback                            │
├─────────────────────────────────────────────────────┤
│  API Layer (Pages Functions)                         │
│  ├─ /functions/api/playbooks/index.ts               │
│  │   └─ GET/POST /api/playbooks                     │
│  └─ /functions/api/playbooks/[id].ts                │
│      └─ GET/PUT/DELETE /api/playbooks/:id           │
├─────────────────────────────────────────────────────┤
│  Storage Layer                                       │
│  └─ Cloudflare R2 Bucket                            │
│      └─ ai-validation-playbooks                     │
│          └─ playbooks/*.json                         │
└─────────────────────────────────────────────────────┘
```

### File Structure

```
ai-validation/
├── src/                          # Frontend source
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── services/                 # API & storage services
│   └── data/                     # Templates & static data
├── functions/                    # Pages Functions (API)
│   └── api/
│       └── playbooks/
│           ├── index.ts          # List & create playbooks
│           └── [id].ts           # Get, update, delete by ID
├── dist/                         # Build output (frontend)
├── public/                       # Static assets
├── package.json                  # Dependencies & scripts
└── wrangler.toml                 # Cloudflare configuration
```

---

## Configuration

### wrangler.toml (Simplified)

```toml
name = "ai-validation"
compatibility_date = "2024-01-01"
```

**Note**: No complex Workers Sites configuration needed. R2 binding is configured in the Cloudflare dashboard under Settings → Functions.

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "dev:pages": "wrangler pages dev dist --binding PLAYBOOKS_BUCKET=ai-validation-playbooks",
    "deploy": "npm run build && wrangler pages deploy dist --project-name=ai-validation --branch=production"
  }
}
```

---

## Deployment Process

### Automatic (Recommended)
1. Push code to `main` branch
2. Cloudflare Pages automatically:
   - Builds the project (`npm run build`)
   - Deploys frontend to CDN
   - Deploys Functions to edge
3. Live at https://ai-validation.pages.dev

### Manual
```bash
npm run deploy
```

---

## Performance Comparison

| Metric | Workers | Pages | Winner |
|--------|---------|-------|--------|
| Setup Time | ~2 hours (debugging) | ~15 minutes | Pages ✅ |
| Build Time | Same | Same | Tie |
| Cold Start | ~5ms | ~10ms | Workers |
| Developer Experience | Complex | Simple | Pages ✅ |
| Maintenance | High | Low | Pages ✅ |
| GitHub Integration | Manual | Built-in | Pages ✅ |

---

## Lessons Learned

### Workers Challenges
1. **Static Asset Serving** - Workers Sites requires manual KV namespace setup
2. **Asset Manifest** - Complex configuration with `__STATIC_CONTENT_MANIFEST`
3. **MIME Types** - Must manually configure for each file type
4. **Debugging** - Harder to debug static asset issues

### Pages Advantages
1. **Just Works** - Static assets served automatically
2. **File-based Routing** - Intuitive API structure
3. **GitHub Integration** - Zero-config CI/CD
4. **Better Errors** - Clear build logs and error messages

---

## Future Considerations

### When to Reconsider Workers
- Need sub-5ms response times
- Require advanced edge computing features
- Want single deployment unit for compliance
- Need custom caching strategies

### Current Recommendation
**Stick with Pages** - It provides the best developer experience and is perfectly suited for full-stack applications like ours.

---

## References

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Workers Sites](https://developers.cloudflare.com/workers/configuration/sites/)

---

## Changelog

- **2025-10-02**: Initial decision to use Cloudflare Pages
- **2025-10-02**: Evaluated Workers, encountered static asset issues
- **2025-10-02**: Rolled back to Pages, documented decision
