import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createDb } from './db';
import * as schema from './schema';

export const createAuth = (env: { DB: D1Database; BETTER_AUTH_SECRET: string; BETTER_AUTH_URL: string; FRONTEND_URL: string; GOOGLE_CLIENT_ID?: string; GOOGLE_CLIENT_SECRET?: string }) => {
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
        trustedOrigins: [env.FRONTEND_URL],
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
