const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const API_BASE = isLocalhost ? 'https://dapur-rumah-api.afuitdev.workers.dev' : '';

async function authFetch(path, options = {}) {
    const url = `${API_BASE}/api/auth${path}`;
    const config = {
        credentials: 'include',
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await res.json().catch(() => null) : await res.text();

    if (!res.ok) {
        const message = typeof payload === 'string'
            ? payload
            : (payload?.error || payload?.message || `Auth request failed (${res.status})`);
        throw new Error(message);
    }

    return payload;
}

// Sign up — seller record auto-created via databaseHooks
export async function register(name, email, password) {
    return authFetch('/sign-up/email', {
        method: 'POST',
        body: { name, email, password },
    });
}

// Sign in
export async function login(email, password) {
    return authFetch('/sign-in/email', {
        method: 'POST',
        body: { email, password },
    });
}

// Sign out
export async function logout() {
    return authFetch('/sign-out', { method: 'POST' });
}

// Check session
export async function getSession() {
    return authFetch('/get-session');
}
