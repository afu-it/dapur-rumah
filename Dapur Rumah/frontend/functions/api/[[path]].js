/**
 * Cloudflare Pages Function — Proxy all /api/* requests to the Hono Worker.
 *
 * This allows the frontend (hosted on Cloudflare Pages) to call /api/* endpoints
 * via relative paths. Pages routes those requests here, and this function forwards
 * them transparently to the deployed Hono Worker (dapur-rumah-api).
 *
 * The WORKER_URL environment variable must be set in the Pages project settings:
 *   WORKER_URL=https://dapur-rumah-api.<subdomain>.workers.dev
 */
export async function onRequest(context) {
    const { request, env, params } = context;

    const workerUrl = env.WORKER_URL;
    if (!workerUrl) {
        return new Response(JSON.stringify({ error: 'Worker URL not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const path = params.path ? params.path.join('/') : '';
    const url = new URL(request.url);
    const targetUrl = `${workerUrl}/api/${path}${url.search}`;

    // Forward the request to the Worker, preserving method, headers, and body
    const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'follow',
    });

    return fetch(proxyRequest);
}
