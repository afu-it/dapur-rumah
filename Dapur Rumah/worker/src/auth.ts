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

export const createAuth = (env: Env) => {
    const db = createDb(env.DB);
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
