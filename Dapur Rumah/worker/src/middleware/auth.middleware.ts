import { createMiddleware } from 'hono/factory';
import { createAuth } from '../auth';

export const authMiddleware = createMiddleware(async (c, next) => {
    const auth = createAuth(c.env as any);
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });

    if (!session) {
        return c.json({ success: false, error: 'Sila log masuk' }, 401);
    }

    c.set('user', session.user);
    c.set('session', session.session);
    await next();
});
