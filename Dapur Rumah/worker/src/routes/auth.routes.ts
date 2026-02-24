import { Hono } from 'hono';
import { createAuth } from '../auth';
import { Env } from '../types';

const authRoutes = new Hono<{ Bindings: Env }>();

authRoutes.on(['POST', 'GET'], '/**', async (c) => {
    try {
        const auth = createAuth(c.env);
        return await auth.handler(c.req.raw);
    } catch (e: any) {
        console.error("Auth Route Crash:", e);
        const errorMessage = e?.message || e?.toString() || 'Ralat pelayan yang tidak dijangkakan';
        return c.json({ success: false, error: errorMessage, stack: e?.stack }, 500);
    }
});

export default authRoutes;
