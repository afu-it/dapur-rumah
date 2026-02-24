import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { Env } from '../types';

const uploadRoutes = new Hono<{ Bindings: Env }>();

// 3.1 Create POST /api/upload/image endpoint with Hono
uploadRoutes.post('/image', authMiddleware, async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'] as File;

        if (!file) {
            return c.json({ success: false, error: 'Tiada fail dimuat naik' }, 400);
        }

        // 3.2 Implement file validation (type: JPEG, PNG, WebP)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return c.json({ success: false, error: 'Format gambar tidak disokong (hanya JPEG, PNG, WebP dibenarkan)' }, 400);
        }

        // 3.2 Implement file validation (size: max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return c.json({ success: false, error: 'Saiz gambar maksimum 5MB' }, 400);
        }

        // 3.3 Implement R2 upload with unique key generation
        const ext = file.name.split('.').pop() || 'webp';
        // Random UUID equivalent for Cloudflare Workers
        const uuid = crypto.randomUUID();
        const key = `products/${uuid}.${ext}`;

        await c.env.R2_BUCKET.put(key, file.stream(), {
            httpMetadata: { contentType: file.type },
        });

        // Return URL using WORKER_URL env var so it works in all environments
        const baseUrl = c.env.WORKER_URL || 'https://dapur-rumah-api.afuitdev.workers.dev';
        const url = `${baseUrl}/api/images/${key}`;

        return c.json({ success: true, url, key });

    } catch (error) {
        console.error('Image upload crash:', error);
        return c.json({ success: false, error: 'Muat naik gagal' }, 500);
    }
});

// 3.4 Create DELETE /api/upload/image/:key endpoint
uploadRoutes.delete('/image/:key{.*}', authMiddleware, async (c) => {
    try {
        const key = decodeURIComponent(c.req.param('key'));

        await c.env.R2_BUCKET.delete(key);
        return c.json({ success: true, message: 'Gambar berjaya dipadam' });

    } catch (error) {
        console.error('Image delete crash:', error);
        return c.json({ success: false, error: 'Gagal padam gambar' }, 500);
    }
});

export default uploadRoutes;
