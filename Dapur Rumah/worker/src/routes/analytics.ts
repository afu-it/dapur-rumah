import { Hono } from 'hono';
import { Env } from '../types';
import { createDb } from '../db';
import { eq, sql, desc } from 'drizzle-orm';
import { products } from '../schema';
import { authMiddleware } from '../middleware/auth.middleware';

const analyticsRoutes = new Hono<{ Bindings: Env }>();

/**
 * POST /api/track
 * Public, fire-and-forget event tracking.
 * Body: { product_id: string, event: 'view' | 'whatsapp_click' }
 */
analyticsRoutes.post('/track', async (c) => {
    try {
        const body = await c.req.json() as { product_id: string; event: 'view' | 'whatsapp_click' };
        if (!body.product_id || !['view', 'whatsapp_click'].includes(body.event)) {
            return c.json({ success: false, error: 'Invalid event data' }, 400);
        }

        const db = createDb(c.env.DB);

        if (body.event === 'view') {
            await db.update(products)
                .set({ views: sql`COALESCE(${products.views}, 0) + 1` })
                .where(eq(products.id, body.product_id));
        } else {
            await db.update(products)
                .set({ whatsapp_clicks: sql`COALESCE(${products.whatsapp_clicks}, 0) + 1` })
                .where(eq(products.id, body.product_id));
        }

        return c.json({ success: true });
    } catch (error: any) {
        // Silent fail — analytics should never break the user experience
        return c.json({ success: true });
    }
});

/**
 * GET /api/dashboard/analytics
 * Protected — returns analytics for the current seller's products.
 */
analyticsRoutes.get('/dashboard/analytics', authMiddleware, async (c) => {
    try {
        const ctx = c as any;
        const user = ctx.get('user');
        const db = createDb(c.env.DB);

        const productStats = await db.select({
            id: products.id,
            name: products.name,
            status: products.status,
            price: products.price,
            image_url: products.image_url,
            views: products.views,
            whatsapp_clicks: products.whatsapp_clicks,
        })
            .from(products)
            .where(eq(products.seller_id, user.id))
            .orderBy(desc(products.views))
            .all();

        // Aggregate totals
        const totalViews = productStats.reduce((sum, p) => sum + (p.views || 0), 0);
        const totalClicks = productStats.reduce((sum, p) => sum + (p.whatsapp_clicks || 0), 0);

        return c.json({
            success: true,
            data: {
                summary: {
                    total_views: totalViews,
                    total_whatsapp_clicks: totalClicks,
                    total_products: productStats.length,
                },
                products: productStats,
            }
        });
    } catch (error: any) {
        console.error('Analytics Error:', error);
        return c.json({ success: false, error: 'Ralat mengambil analitik' }, 500);
    }
});

export default analyticsRoutes;
