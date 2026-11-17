interface Env {
  SIMOPS_STORE?: any;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const supabaseUrl = context.env.SUPABASE_URL?.trim().replace(/\/+$/, '');
    const supabaseKey = (context.env.SUPABASE_SERVICE_ROLE_KEY || context.env.SUPABASE_ANON_KEY)?.trim();

    // 1. Prioritaskan pengambilan dari Supabase jika env dikonfigurasi
    if (supabaseUrl && supabaseKey) {
      try {
        const sbRes = await fetch(`${supabaseUrl}/rest/v1/simops_sync_state?id=eq.main_database&select=*`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Accept': 'application/json'
          }
        });
        if (sbRes.ok) {
          const records: any = await sbRes.json();
          if (Array.isArray(records) && records.length > 0 && records[0].payload) {
            return new Response(JSON.stringify({
              exists: true,
              source: 'supabase',
              data: records[0].payload,
              ...records[0].payload
            }), {
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*'
              }
            });
          }
        }
      } catch (sbErr) {
        console.warn("Supabase fetch failed in Pages Function, falling back to KV", sbErr);
      }
    }

    // 2. Fallback ke Cloudflare KV
    if (!context.env.SIMOPS_STORE) {
      return new Response(JSON.stringify({ exists: false, note: "KV or Supabase binding not configured" }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const raw = await context.env.SIMOPS_STORE.get('main_database', 'json');
    if (!raw) {
      return new Response(JSON.stringify({ exists: false }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({ exists: true, source: 'kv', data: raw, ...raw }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const payload = await context.request.json();
    if (!payload) {
      return new Response(JSON.stringify({ error: "Payload missing" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const timestamp = new Date().toISOString();
    let supabaseSaved = false;

    // 1. Simpan ke Supabase jika kredensial tersedia
    const supabaseUrl = context.env.SUPABASE_URL?.trim().replace(/\/+$/, '');
    const supabaseKey = (context.env.SUPABASE_SERVICE_ROLE_KEY || context.env.SUPABASE_ANON_KEY)?.trim();

    if (supabaseUrl && supabaseKey) {
      try {
        const sbRes = await fetch(`${supabaseUrl}/rest/v1/simops_sync_state`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: 'main_database',
            payload,
            is_cleared: Boolean((payload as any).isCleared),
            version: (payload as any).version || '2.5.0',
            updated_at: timestamp
          })
        });
        if (sbRes.ok) {
          supabaseSaved = true;
        }
      } catch (sbErr) {
        console.warn("Supabase save failed in Pages Function", sbErr);
      }
    }

    // 2. Simpan juga ke KV
    if (context.env.SIMOPS_STORE) {
      await context.env.SIMOPS_STORE.put('main_database', JSON.stringify(payload));
    }

    return new Response(JSON.stringify({
      success: true,
      savedAt: timestamp,
      supabaseSaved,
      kvSaved: Boolean(context.env.SIMOPS_STORE)
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization'
    }
  });
};
