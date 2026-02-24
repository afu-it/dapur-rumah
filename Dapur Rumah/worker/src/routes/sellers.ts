import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { Env } from '../types';
import { createDb } from '../db';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { User } from 'better-auth';
import { eq, and, desc } from 'drizzle-orm';
import { sellers, products } from '../schema';

// Setup Hono environment specifically with the 'user' payload attached by authMiddleware
const sellerRoutes = new Hono<{ Bindings: Env; Variables: { user: User } }>();

// Ensure all routes under /api/dashboard are protected
sellerRoutes.use('/*', authMiddleware);

/**
 * ============================================================================
 * SELLER PROFILE Management
 * ============================================================================
 */

// 4.1 GET /api/dashboard/profile - get own seller profile
sellerRoutes.get('/profile', async (c) => {
    try {
        const db = createDb(c.env.DB);
        const user = c.get('user');

        const profile = await db.select().from(sellers).where(eq(sellers.id, user.id)).get();

        if (!profile) {
            return c.json({ success: false, error: 'Profil peniaga tidak dijumpai' }, 404);
        }

        return c.json({ success: true, data: profile });
    } catch (error: any) {
        console.error('Fetch Profile Error:', error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

const updateProfileSchema = z.object({
    shop_name: z.string().min(1, 'Nama kedai wajib diisi'),
    description: z.string().optional(),
    phone_whatsapp: z.string().min(1, 'Nombor WhatsApp wajib diisi'),
    state: z.string().min(1, 'Negeri wajib dipilih'),
    city: z.string().optional(),
    profile_image: z.string().optional()
});

// 4.2 PUT /api/dashboard/profile - update profile
sellerRoutes.put('/profile', zValidator('json', updateProfileSchema), async (c) => {
    try {
        const db = createDb(c.env.DB);
        const user = c.get('user');
        const data = c.req.valid('json');

        await db.update(sellers)
            .set({
                ...data,
                updated_at: new Date().toISOString()
            })
            .where(eq(sellers.id, user.id))
            .execute();

        return c.json({ success: true, message: 'Profil berjaya dikemas kini' });
    } catch (error: any) {
        console.error('Update Profile Error:', error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

/**
 * ============================================================================
 * PRODUCTS Management
 * ============================================================================
 */

// 4.3 GET /api/dashboard/products - list own products
sellerRoutes.get('/products', async (c) => {
    try {
        const db = createDb(c.env.DB);
        const user = c.get('user');

        const productsList = await db.select()
            .from(products)
            .where(and(eq(products.seller_id, user.id), eq(products.is_active, 1)))
            .orderBy(desc(products.created_at))
            .execute();

        return c.json({ success: true, data: productsList });
    } catch (error: any) {
        console.error('Fetch Products Error:', error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

const productSchema = z.object({
    category_id: z.string().min(1, 'Kategori wajib dipilih'), // TEXT in DB — e.g. 'cat_1'
    name: z.string().min(1, 'Nama produk wajib diisi'),
    description: z.string().optional(),
    price: z.number().or(z.string().transform(v => parseFloat(v))),
    price_note: z.string().optional(),
    image_url: z.string().url('URL gambar tidak sah').optional().or(z.literal('')),
    status: z.enum(['ada_stok', 'preorder', 'habis']).default('ada_stok')
});

// 4.4 POST /api/dashboard/products - add new product
sellerRoutes.post('/products', zValidator('json', productSchema), async (c) => {
    try {
        const db = createDb(c.env.DB);
        const user = c.get('user');
        const data = c.req.valid('json');

        await db.insert(products)
            .values({
                id: crypto.randomUUID(),
                seller_id: user.id,
                category_id: data.category_id,
                name: data.name,
                description: data.description || null,
                price: data.price,
                price_note: data.price_note || null,
                image_url: data.image_url || null,
                status: data.status,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .execute();

        return c.json({ success: true, message: 'Produk berjaya ditambah' });
    } catch (error: any) {
        console.error('Create Product Error:', error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

// 4.5 PUT /api/dashboard/products/:id - update product
sellerRoutes.put('/products/:id', zValidator('json', productSchema), async (c) => {
    try {
        const db = createDb(c.env.DB);
        const user = c.get('user');
        const productId = c.req.param('id');
        const data = c.req.valid('json');

        // Verify ownership before updating
        const existing = await db.select()
            .from(products)
            .where(and(eq(products.id, productId), eq(products.seller_id, user.id)))
            .get();

        if (!existing) {
            return c.json({ success: false, error: 'Produk tidak dijumpai atau anda tiada kebenaran.' }, 403);
        }

        await db.update(products)
            .set({
                category_id: data.category_id,
                name: data.name,
                description: data.description || null,
                price: data.price,
                price_note: data.price_note || null,
                image_url: data.image_url || null,
                status: data.status,
                updated_at: new Date().toISOString()
            })
            .where(and(eq(products.id, productId), eq(products.seller_id, user.id)))
            .execute();

        return c.json({ success: true, message: 'Produk berjaya dikemas kini' });
    } catch (error: any) {
        console.error('Update Product Error:', error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

// 4.6 DELETE /api/dashboard/products/:id - soft-delete product
sellerRoutes.delete('/products/:id', async (c) => {
    try {
        const db = createDb(c.env.DB);
        const user = c.get('user');
        const productId = c.req.param('id');

        // Soft delete
        await db.update(products)
            .set({
                is_active: 0,
                updated_at: new Date().toISOString()
            })
            .where(and(eq(products.id, productId), eq(products.seller_id, user.id)))
            .execute();

        return c.json({ success: true, message: 'Produk berjaya dipadam' });
    } catch (error: any) {
        console.error('Delete Product Error:', error);
        return c.json({ success: false, error: error.message }, 500);
    }
});

export default sellerRoutes;
