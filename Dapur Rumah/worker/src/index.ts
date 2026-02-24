import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload';
import sellerRoutes from './routes/sellers';
import catalogRoutes from './routes/catalog';
import analyticsRoutes from './routes/analytics';
import adminRoutes from './routes/admin';
import { Env } from './types';

const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
    console.error('Core App Error:', err);
    return c.json({ success: false, error: err.message, stack: err.stack }, 500);
});

app.use('*', logger());
app.use('*', async (c, next) => {
    const corsMiddleware = cors({
        origin: c.env.FRONTEND_URL,
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: true,
    });
    return corsMiddleware(c, next);
});

app.get('/', (c) => c.json({ status: 'ok', message: 'Dapur Rumah API' }));

// Serve R2-stored images publicly (uploaded via /api/upload/image)
app.get('/api/images/:key{.*}', async (c) => {
    try {
        const key = decodeURIComponent(c.req.param('key'));
        const obj = await c.env.R2_BUCKET.get(key);
        if (!obj) return c.json({ error: 'Not found' }, 404);
        const headers = new Headers();
        obj.writeHttpMetadata(headers);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        return new Response(obj.body, { headers });
    } catch (e) {
        return c.json({ error: 'Failed to load image' }, 500);
    }
});

app.route('/api/auth', authRoutes);
app.route('/api/upload', uploadRoutes);
app.route('/api/dashboard', sellerRoutes);
app.route('/api', catalogRoutes);    // /api/products, /api/categories, /api/sellers
app.route('/api', analyticsRoutes);  // /api/track, /api/dashboard/analytics
app.route('/api', adminRoutes);      // /api/admin/*

export default app;
