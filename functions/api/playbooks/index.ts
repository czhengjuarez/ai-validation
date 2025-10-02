/**
 * Cloudflare Pages Function - GET /api/playbooks
 * List all playbooks
 */
export const onRequestGet: PagesFunction<{ PLAYBOOKS_BUCKET: R2Bucket }> = async (context) => {
  const { env } = context;
  
  try {
    const list = await env.PLAYBOOKS_BUCKET.list();
    const playbooks = [];

    for (const object of list.objects) {
      const data = await env.PLAYBOOKS_BUCKET.get(object.key);
      if (data) {
        const playbook = await data.json();
        playbooks.push(playbook);
      }
    }

    return new Response(JSON.stringify(playbooks), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error('Error listing playbooks:', error);
    return new Response(JSON.stringify({ error: 'Failed to list playbooks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * POST /api/playbooks
 * Create a new playbook
 */
export const onRequestPost: PagesFunction<{ PLAYBOOKS_BUCKET: R2Bucket }> = async (context) => {
  const { request, env } = context;
  
  try {
    const playbook: any = await request.json();
    
    if (!playbook.id) {
      playbook.id = crypto.randomUUID();
    }

    const now = new Date().toISOString();
    playbook.createdAt = now;
    playbook.updatedAt = now;

    await env.PLAYBOOKS_BUCKET.put(
      `playbooks/${playbook.id}.json`,
      JSON.stringify(playbook),
      { httpMetadata: { contentType: 'application/json' } }
    );

    return new Response(JSON.stringify(playbook), {
      status: 201,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error('Error creating playbook:', error);
    return new Response(JSON.stringify({ error: 'Failed to create playbook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * OPTIONS /api/playbooks
 * CORS preflight
 */
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
