import { Hono } from 'hono';
import { Env } from '../types';
import { createDb } from '../db';
import { eq, desc } from 'drizzle-orm';
import { sellers, products } from '../schema';
import { createAuth } from '../auth';

const adminRoutes = new Hono<{ Bindings: Env }>();

/**
 * Admin middleware — checks session AND is_admin flag in the user table
 */
async function adminMiddleware(c: any, next: any) {
    try {
        const auth = createAuth(c.env);
        const session = await auth.api.getSession({ headers: c.req.raw.headers });
        if (!session?.user) {
            return c.json({ success: false, error: 'Tidak ditemukan.' }, 401);
        }

        // Check is_admin from DB
        const result = await c.env.DB.prepare('SELECT is_admin FROM "user" WHERE id = ?')
            .bind(session.user.id)
            .first() as { is_admin: number } | null;

        if (!result || result.is_admin !== 1) {
            return c.json({ success: false, error: 'Akses ditolak.' }, 403);
        }

        c.set('adminUser', session.user);
        await next();
    } catch (e: any) {
        return c.json({ success: false, error: 'Auth error' }, 500);
    }
}

/**
 * GET /api/admin/sellers
 * List all sellers with product counts
 */
adminRoutes.get('/admin/sellers', adminMiddleware, async (c) => {
    try {
        const db = createDb(c.env.DB);

        const allSellers = await db.select({
            id: sellers.id,
            shop_name: sellers.shop_name,
            state: sellers.state,
            phone_whatsapp: sellers.phone_whatsapp,
            is_active: sellers.is_active,
            is_featured: sellers.is_featured,
            profile_image: sellers.profile_image,
            description: sellers.description,
        })
            .from(sellers)
            .orderBy(desc(sellers.is_featured))
            .all();

        // Count products per seller
        const productCounts = await db.select({
            seller_id: products.seller_id,
            count: products.id,
        })
            .from(products)
            .where(eq(products.is_active, 1))
            .all();

        const countMap = productCounts.reduce((m: any, p) => {
            m[p.seller_id] = (m[p.seller_id] || 0) + 1;
            return m;
        }, {});

        const data = allSellers.map(s => ({
            ...s,
            product_count: countMap[s.id] || 0,
        }));

        return c.json({ success: true, data, total: data.length });
    } catch (error: any) {
        console.error('Admin sellers error:', error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

/**
 * POST /api/admin/sellers/:id/feature
 * Toggle is_featured for a seller
 */
adminRoutes.post('/admin/sellers/:id/feature', adminMiddleware, async (c) => {
    try {
        const db = createDb(c.env.DB);
        const sellerId = c.req.param('id');
        const body = await c.req.json() as { featured: boolean };

        await db.update(sellers)
            .set({ is_featured: body.featured ? 1 : 0 })
            .where(eq(sellers.id, sellerId));

        return c.json({ success: true });
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
    }
});

/**
 * POST /api/admin/sellers/:id/activate
 * Toggle is_active for a seller
 */
adminRoutes.post('/admin/sellers/:id/activate', adminMiddleware, async (c) => {
    try {
        const db = createDb(c.env.DB);
        const sellerId = c.req.param('id');
        const body = await c.req.json() as { active: boolean };

        await db.update(sellers)
            .set({ is_active: body.active ? 1 : 0 })
            .where(eq(sellers.id, sellerId));

        return c.json({ success: true });
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
    }
});

/**
 * POST /api/admin/sellers/:id/set-admin
 * Grant or revoke admin rights for a user
 */
adminRoutes.post('/admin/sellers/:id/set-admin', adminMiddleware, async (c) => {
    try {
        const userId = c.req.param('id');
        const body = await c.req.json() as { admin: boolean };

        await c.env.DB.prepare('UPDATE "user" SET is_admin = ? WHERE id = ?')
            .bind(body.admin ? 1 : 0, userId)
            .run();

        return c.json({ success: true });
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
    }
});

export default adminRoutes;
