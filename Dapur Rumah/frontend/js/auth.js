import { createAuthClient } from 'better-auth/client';

const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

export const authClient = createAuthClient({
    baseURL: isLocalhost
        ? 'https://dapur-rumah-api.afuitdev.workers.dev'
        : '', // Pages Function proxies /api/* to the Worker - same origin
});

// Sign up — seller record auto-created via databaseHooks
export async function register(name, email, password) {
    const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
    });
    if (error) throw error;
    return data;
}

// Sign in
export async function login(email, password) {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw error;
    return data;
}

// Sign out
export async function logout() {
    await authClient.signOut();
}

// Check session
export async function getSession() {
    const { data } = await authClient.getSession();
    return data;
}
