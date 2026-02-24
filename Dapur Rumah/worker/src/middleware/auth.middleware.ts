import { createMiddleware } from 'hono/factory';
import { createAuth } from '../auth';
import { withSessionCookieFromAuthorization } from '../utils/auth-cookie';
import { getBearerToken, getSessionFromBearerToken } from '../utils/bearer-session';

export const authMiddleware = createMiddleware(async (c, next) => {
    const auth = createAuth(c.env as any);
    const headers = withSessionCookieFromAuthorization(c.req.raw.headers);
    let session = await auth.api.getSession({
        headers,
    });

    if (!session) {
        const bearerToken = getBearerToken(c.req.raw.headers);
        session = await getSessionFromBearerToken(c.env.DB, bearerToken);
    }

    if (!session) {
        return c.json({ success: false, error: 'Sila log masuk' }, 401);
    }

    c.set('user', session.user);
    c.set('session', session.session);
    await next();
});
