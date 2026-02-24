const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
const API_BASE = isLocalhost ? 'https://dapur-rumah-api.afuitdev.workers.dev' : '';
const AUTH_TOKEN_KEY = 'dapur_auth_token';

function getStoredAuthToken() {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY) || '';
    } catch {
        return '';
    }
}

function setStoredAuthToken(token) {
    try {
        if (token) {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
        } else {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
    } catch {
        // Ignore storage access errors (private mode, blocked storage, etc.)
    }
}

async function authFetch(path, options = {}) {
    const url = `${API_BASE}/api/auth${path}`;
    const headers = new Headers(options.headers || {});
    const token = getStoredAuthToken();
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const config = {
        credentials: 'include',
        ...options,
        headers,
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

function persistTokenFromPayload(payload) {
    if (payload && typeof payload === 'object' && payload.token) {
        setStoredAuthToken(payload.token);
    }
}

// Sign up — seller record auto-created via databaseHooks
export async function register(name, email, password) {
    const payload = await authFetch('/sign-up/email', {
        method: 'POST',
        body: { name, email, password },
    });
    persistTokenFromPayload(payload);
    return payload;
}

// Sign in
export async function login(email, password) {
    const payload = await authFetch('/sign-in/email', {
        method: 'POST',
        body: { email, password },
    });
    persistTokenFromPayload(payload);
    return payload;
}

// Sign out
export async function logout() {
    try {
        return await authFetch('/sign-out', { method: 'POST' });
    } finally {
        setStoredAuthToken('');
    }
}

// Check session
export async function getSession() {
    return authFetch('/get-session');
}
