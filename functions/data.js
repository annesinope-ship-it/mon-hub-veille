export async function onRequestGet(context) {
  try {
    const kv = context.env.KV;
    const [newsletters, history] = await Promise.all([
      kv.get('newsletters'),
      kv.get('history')
    ]);
    return new Response(JSON.stringify({
      newsletters: newsletters ? JSON.parse(newsletters) : {},
      history: history ? JSON.parse(history) : []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const kv = context.env.KV;
    const body = await context.request.json();
    await Promise.all(
      Object.entries(body).map(([k, v]) => kv.put(k, JSON.stringify(v)))
    );
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
