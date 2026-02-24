import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
    baseURL: import.meta.env.PROD
        ? '' // Pages Function proxies /api/* to the Worker - same origin
        : 'http://localhost:8787',
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
