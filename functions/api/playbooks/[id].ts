/**
 * Cloudflare Pages Function - GET /api/playbooks/:id
 * Get a specific playbook
 */
export async function onRequestGet(context: any) {
  const { params, env } = context;
  const id = params.id as string;
  
  try {
    const object = await env.PLAYBOOKS_BUCKET.get(`playbooks/${id}.json`);

    if (!object) {
      return new Response(JSON.stringify({ error: 'Playbook not found' }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    const playbook = await object.json();
    return new Response(JSON.stringify(playbook), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error('Error getting playbook:', error);
    return new Response(JSON.stringify({ error: 'Failed to get playbook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * PUT /api/playbooks/:id
 * Update a playbook
 */
export async function onRequestPut(context: any) {
  const { request, params, env } = context;
  const id = params.id as string;
  
  try {
    const existing = await env.PLAYBOOKS_BUCKET.get(`playbooks/${id}.json`);

    if (!existing) {
      return new Response(JSON.stringify({ error: 'Playbook not found' }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    const existingPlaybook: any = await existing.json();
    const updates: any = await request.json();

    const updatedPlaybook = {
      ...existingPlaybook,
      ...updates,
      id,
      createdAt: existingPlaybook.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await env.PLAYBOOKS_BUCKET.put(
      `playbooks/${id}.json`,
      JSON.stringify(updatedPlaybook),
      { httpMetadata: { contentType: 'application/json' } }
    );

    return new Response(JSON.stringify(updatedPlaybook), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error('Error updating playbook:', error);
    return new Response(JSON.stringify({ error: 'Failed to update playbook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * DELETE /api/playbooks/:id
 * Delete a playbook
 */
export async function onRequestDelete(context: any) {
  const { params, env } = context;
  const id = params.id as string;
  
  try {
    await env.PLAYBOOKS_BUCKET.delete(`playbooks/${id}.json`);

    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error('Error deleting playbook:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete playbook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * OPTIONS /api/playbooks/:id
 * CORS preflight
 */
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
