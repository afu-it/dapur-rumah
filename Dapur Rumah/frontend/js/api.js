/**
 * Core API wrapper.
 * Prepends the base URL if needed and injects `credentials: "include"`
 * so Better Auth cookies are passed to the Worker backend seamlessly.
 *
 * @param {string} endpoint e.g., '/api/upload/image'
 * @param {RequestInit} options Standard fetch options
 */
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost');
const API_BASE = isLocalhost ? 'https://dapur-rumah-api.afuitdev.workers.dev' : '';

export async function apiFetch(endpoint, options = {}) {
    const config = {
        ...options,
        credentials: 'include',
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
        config.headers = {
            'Content-Type': 'application/json',
            ...config.headers
        };
    }

    const url = endpoint.startsWith('http') ? endpoint : API_BASE + endpoint;
    const res = await fetch(url, config);

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
