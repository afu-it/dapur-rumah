import { Hono } from 'hono';
import { createAuth } from '../auth';
import { Env } from '../types';
import { withRequestSessionCookieFromAuthorization } from '../utils/auth-cookie';
import { getBearerToken, getSessionFromBearerToken } from '../utils/bearer-session';

const authRoutes = new Hono<{ Bindings: Env }>();

authRoutes.on(['POST', 'GET', 'OPTIONS'], '*', async (c) => {
    try {
        // Fallback for browsers that block third-party cookies:
        // allow /get-session via Bearer token from login response.
        const isGetSessionRoute =
            c.req.method === 'GET' &&
            new URL(c.req.url).pathname.endsWith('/get-session');
        if (isGetSessionRoute) {
            const bearerToken = getBearerToken(c.req.raw.headers);
            if (bearerToken) {
                const bearerSession = await getSessionFromBearerToken(c.env.DB, bearerToken);
                if (bearerSession) {
                    return c.json(bearerSession);
                }
            }
        }

        const auth = createAuth(c.env);
        const request = withRequestSessionCookieFromAuthorization(c.req.raw);
        return await auth.handler(request);
    } catch (e: any) {
        console.error("Auth Route Crash:", e);
        const errorMessage = e?.message || e?.toString() || 'Ralat pelayan yang tidak dijangkakan';
        return c.json({ success: false, error: errorMessage, stack: e?.stack }, 500);
    }
});

export default authRoutes;
