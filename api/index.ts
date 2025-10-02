/**
 * Cloudflare Worker for AI Validation Playbook
 * This worker serves the static frontend and handles API requests
 * Playbooks are stored in R2
 */

import { getAssetFromKV, MethodNotAllowedError, NotFoundError } from '@cloudflare/kv-asset-handler';

// R2Bucket type definition (provided by Cloudflare Workers runtime)
declare const R2Bucket: any;

export interface Env {
  PLAYBOOKS_BUCKET: any; // R2Bucket type from @cloudflare/workers-types
  CORS_ORIGIN?: string;
  __STATIC_CONTENT: any; // KV namespace for static assets
}

// Manifest for static assets
declare const __STATIC_CONTENT_MANIFEST: string;

interface Playbook {
  id: string;
  title: string;
  description: string;
  escalationPaths: any[];
  createdAt: string;
  updatedAt: string;
  category?: string;
}

// CORS headers
const corsHeaders = (origin?: string) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
});

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(origin || undefined),
      });
    }

    try {
      // Handle API routes
      if (url.pathname.startsWith('/api/')) {
        // Route: GET /api/playbooks - List all playbooks
        if (url.pathname === '/api/playbooks' && request.method === 'GET') {
          return await handleListPlaybooks(env, origin);
        }

        // Route: POST /api/playbooks - Create a new playbook
        if (url.pathname === '/api/playbooks' && request.method === 'POST') {
          return await handleCreatePlaybook(request, env, origin);
        }

        // Route: GET /api/playbooks/:id - Get a specific playbook
        const getMatch = url.pathname.match(/^\/api\/playbooks\/([^/]+)$/);
        if (getMatch && request.method === 'GET') {
          return await handleGetPlaybook(getMatch[1], env, origin);
        }

        // Route: PUT /api/playbooks/:id - Update a playbook
        const putMatch = url.pathname.match(/^\/api\/playbooks\/([^/]+)$/);
        if (putMatch && request.method === 'PUT') {
          return await handleUpdatePlaybook(putMatch[1], request, env, origin);
        }

        // Route: DELETE /api/playbooks/:id - Delete a playbook
        const deleteMatch = url.pathname.match(/^\/api\/playbooks\/([^/]+)$/);
        if (deleteMatch && request.method === 'DELETE') {
          return await handleDeletePlaybook(deleteMatch[1], env, origin);
        }

        return new Response('API endpoint not found', { 
          status: 404,
          headers: corsHeaders(origin || undefined),
        });
      }

      // Serve static assets for non-API routes
      try {
        let options = {};
        
        // Try to use manifest if available
        try {
          const manifest = JSON.parse(__STATIC_CONTENT_MANIFEST);
          options = {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: manifest,
          };
        } catch (e) {
          // Fallback without manifest
          options = {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
          };
        }

        return await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          options
        );
      } catch (e) {
        // If asset not found, serve index.html for SPA routing
        if (e instanceof NotFoundError || e instanceof MethodNotAllowedError) {
          try {
            let options = {};
            
            try {
              const manifest = JSON.parse(__STATIC_CONTENT_MANIFEST);
              options = {
                ASSET_NAMESPACE: env.__STATIC_CONTENT,
                ASSET_MANIFEST: manifest,
              };
            } catch (e) {
              options = {
                ASSET_NAMESPACE: env.__STATIC_CONTENT,
              };
            }

            const indexRequest = new Request(`${url.origin}/index.html`, request);
            return await getAssetFromKV(
              {
                request: indexRequest,
                waitUntil: ctx.waitUntil.bind(ctx),
              },
              options
            );
          } catch (e) {
            return new Response('Application not found. Please ensure the frontend is built.', { 
              status: 404,
              headers: { 'Content-Type': 'text/plain' }
            });
          }
        }
        
        // Log the error for debugging
        console.error('Static asset error:', e);
        return new Response(`Internal Server Error: ${e instanceof Error ? e.message : 'Unknown error'}`, { 
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin || undefined),
        },
      });
    }
  },
};

async function handleListPlaybooks(env: Env, origin: string | null): Promise<Response> {
  const list = await env.PLAYBOOKS_BUCKET.list();
  const playbooks: Playbook[] = [];

  for (const object of list.objects) {
    const data = await env.PLAYBOOKS_BUCKET.get(object.key);
    if (data) {
      const playbook = await data.json() as Playbook;
      playbooks.push(playbook);
    }
  }

  return new Response(JSON.stringify(playbooks), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin || undefined),
    },
  });
}

async function handleCreatePlaybook(
  request: Request,
  env: Env,
  origin: string | null
): Promise<Response> {
  const playbook: Playbook = await request.json();
  
  // Generate ID if not provided
  if (!playbook.id) {
    playbook.id = crypto.randomUUID();
  }

  // Set timestamps
  const now = new Date().toISOString();
  playbook.createdAt = now;
  playbook.updatedAt = now;

  // Save to R2
  await env.PLAYBOOKS_BUCKET.put(
    `playbooks/${playbook.id}.json`,
    JSON.stringify(playbook),
    {
      httpMetadata: {
        contentType: 'application/json',
      },
    }
  );

  return new Response(JSON.stringify(playbook), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin || undefined),
    },
  });
}

async function handleGetPlaybook(
  id: string,
  env: Env,
  origin: string | null
): Promise<Response> {
  const object = await env.PLAYBOOKS_BUCKET.get(`playbooks/${id}.json`);

  if (!object) {
    return new Response(JSON.stringify({ error: 'Playbook not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin || undefined),
      },
    });
  }

  const playbook = await object.json();

  return new Response(JSON.stringify(playbook), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin || undefined),
    },
  });
}

async function handleUpdatePlaybook(
  id: string,
  request: Request,
  env: Env,
  origin: string | null
): Promise<Response> {
  // Get existing playbook
  const existing = await env.PLAYBOOKS_BUCKET.get(`playbooks/${id}.json`);

  if (!existing) {
    return new Response(JSON.stringify({ error: 'Playbook not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin || undefined),
      },
    });
  }

  const existingPlaybook = await existing.json() as Playbook;
  const updates: Partial<Playbook> = await request.json();

  // Merge updates
  const updatedPlaybook: Playbook = {
    ...existingPlaybook,
    ...updates,
    id, // Ensure ID doesn't change
    createdAt: existingPlaybook.createdAt, // Preserve creation date
    updatedAt: new Date().toISOString(),
  };

  // Save to R2
  await env.PLAYBOOKS_BUCKET.put(
    `playbooks/${id}.json`,
    JSON.stringify(updatedPlaybook),
    {
      httpMetadata: {
        contentType: 'application/json',
      },
    }
  );

  return new Response(JSON.stringify(updatedPlaybook), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin || undefined),
    },
  });
}

async function handleDeletePlaybook(
  id: string,
  env: Env,
  origin: string | null
): Promise<Response> {
  await env.PLAYBOOKS_BUCKET.delete(`playbooks/${id}.json`);

  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin || undefined),
  });
}
