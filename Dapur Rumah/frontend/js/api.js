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
const AUTH_TOKEN_KEY = 'dapur_auth_token';

function getStoredAuthToken() {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY) || '';
    } catch {
        return '';
    }
}

export async function apiFetch(endpoint, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getStoredAuthToken();
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config = {
        ...options,
        credentials: 'include',
        headers,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
    }

    const url = endpoint.startsWith('http') ? endpoint : API_BASE + endpoint;
    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (isJson) {
        try {
            const data = await res.json();

            // Normalize failed responses so UI can always rely on `error`.
            if (!res.ok) {
                return {
                    success: false,
                    ...data,
                    error: data?.error || data?.message || `HTTP ${res.status}`,
                };
            }

            return data;
        } catch (e) {
            // Fall through and return a normalized parse error below.
        }
    }

    const text = await res.text();

    if (!res.ok) {
        return {
            success: false,
            error: text || `HTTP ${res.status}`,
        };
    }

    // Keep return shape consistent for non-JSON success payloads.
    return {
        success: true,
        data: text,
    };
}

export const api = {
    get: (url) => apiFetch(url, { method: 'GET' }),
    post: (url, body) => apiFetch(url, { method: 'POST', body }),
    put: (url, body) => apiFetch(url, { method: 'PUT', body }),
    delete: (url) => apiFetch(url, { method: 'DELETE' })
};
