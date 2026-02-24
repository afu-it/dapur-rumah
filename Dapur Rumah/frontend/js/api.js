/**
 * Core API wrapper.
 * Prepends the base URL if needed and injects `credentials: "include"`
 * so Better Auth cookies are passed to the Worker backend seamlessly.
 *
 * @param {string} endpoint e.g., '/api/upload/image'
 * @param {RequestInit} options Standard fetch options
 */
export async function apiFetch(endpoint, options = {}) {
    // If not absolute URL, prepend /api or proxy handles it.
    // In our vite dev environment, '/api' is proxied to :8787 automatically.

    const config = {
        ...options,
        credentials: 'include', // Extremely important for Better Auth sessions
    };

    // Auto-serialize JSON if plain object is passed
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
        config.headers = {
            'Content-Type': 'application/json',
            ...config.headers
        };
    }

    const res = await fetch(endpoint, config);

    // Try to parse JSON safely, or return text
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }
    return res.text();
}

export const api = {
    get: (url) => apiFetch(url, { method: 'GET' }),
    post: (url, body) => apiFetch(url, { method: 'POST', body }),
    put: (url, body) => apiFetch(url, { method: 'PUT', body }),
    delete: (url) => apiFetch(url, { method: 'DELETE' })
};
