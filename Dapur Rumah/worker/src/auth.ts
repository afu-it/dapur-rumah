import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createDb } from './db';
import * as schema from './schema';
import { Env } from './types';

const DEFAULT_TRUSTED_ORIGINS = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:5173',
    'https://afu-it.github.io',
];

function normalizeOrigin(origin: string) {
    return origin.replace(/\/+$/, '');
}

function buildTrustedOrigins(env: Env) {
    const fromEnv = (env.ALLOWED_ORIGINS || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    return [
        ...new Set(
            [env.FRONTEND_URL, ...DEFAULT_TRUSTED_ORIGINS, ...fromEnv]
                .filter(Boolean)
                .map(normalizeOrigin)
        ),
    ];
}

function shouldUseCrossSiteCookies(env: Env) {
    try {
        const authUrl = new URL(env.BETTER_AUTH_URL);
        const frontendUrl = new URL(env.FRONTEND_URL);
        // Same-site cookies work when protocol + hostname match (port can differ).
        return !(authUrl.protocol === frontendUrl.protocol && authUrl.hostname === frontendUrl.hostname);
    } catch {
        // Safer default for production-style split domains (Pages -> Worker).
        return true;
    }
}

export const createAuth = (env: Env) => {
    const db = createDb(env.DB);
    const useCrossSiteCookies = shouldUseCrossSiteCookies(env);

    return betterAuth({
        logger: {
            level: 'debug'
        },
        database: drizzleAdapter(db, {
            provider: 'sqlite',
            schema
        }),
        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
        },
        // Google OAuth — only loaded if credentials are set
        ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? {
            socialProviders: {
                google: {
                    clientId: env.GOOGLE_CLIENT_ID,
                    clientSecret: env.GOOGLE_CLIENT_SECRET,
                },
            },
        } : {}),
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
        trustedOrigins: buildTrustedOrigins(env),
        advanced: {
            defaultCookieAttributes: useCrossSiteCookies
                ? {
                    sameSite: 'none',
                    secure: true,
                }
                : {
                    sameSite: 'lax',
                    secure: env.BETTER_AUTH_URL.startsWith('https://'),
                },
        },
        databaseHooks: {
            user: {
                create: {
                    after: async (user) => {
                        await env.DB.prepare('INSERT INTO sellers (id, shop_name, phone_whatsapp, state, is_active) VALUES (?, ?, ?, ?, ?)')
                            .bind(user.id, '', '', '', 1)
                            .run();
                    }
                }
            }
        }
    });
};
