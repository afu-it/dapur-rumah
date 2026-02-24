import { Hono } from 'hono';
import { Env } from '../types';
import { createDb } from '../db';
import { eq, and, desc, like, or, SQL } from 'drizzle-orm';
import { products, categories, sellers } from '../schema';

const catalogRoutes = new Hono<{ Bindings: Env }>();

/**
 * ============================================================================
 * PUBLIC CATALOG DISCOVERY
 * ============================================================================
 */

// 5.4 GET /api/categories - get all categories
catalogRoutes.get('/categories', async (c) => {
    try {
        const db = createDb(c.env.DB);

        const catList = await db.select()
            .from(categories)
            .orderBy(categories.sort_order)
            .all();

        return c.json({ success: true, data: catList });
    } catch (error: any) {
        console.error('Fetch Categories Error:', error);
        return c.json({ success: false, error: 'Ralat memuatkan kategori' }, 500);
    }
});

// 5.1 GET /api/products - list all products with filters
catalogRoutes.get('/products', async (c) => {
    try {
        const db = createDb(c.env.DB);

        // Extract query params
        const query = c.req.query('q');
        const categoryId = c.req.query('category');
        const stateFilter = c.req.query('state');
        // Pagination
        const limit = parseInt(c.req.query('limit') || '20');
        const offset = parseInt(c.req.query('offset') || '0');

        let conditions: SQL[] = [
            eq(products.is_active, 1),
            eq(sellers.is_active, 1)
        ];

        if (categoryId) conditions.push(eq(products.category_id, categoryId)); // TEXT comparison - no parseInt
        if (stateFilter) conditions.push(eq(sellers.state, stateFilter));
        if (query) {
            const searchFilter = or(
                like(products.name, `%${query}%`),
                like(products.description, `%${query}%`)
            );
            if (searchFilter) conditions.push(searchFilter);
        }

        // We join sellers to filter by state and to return basic shop info along with products
        const productsList = await db.select({
            id: products.id,
            name: products.name,
            price: products.price,
            price_note: products.price_note,
            image_url: products.image_url,
            status: products.status,
            created_at: products.created_at,
            seller: {
                id: sellers.id,
                shop_name: sellers.shop_name,
                state: sellers.state
            }
        })
            .from(products)
            .innerJoin(sellers, eq(products.seller_id, sellers.id))
            .where(and(...conditions))
            .orderBy(desc(products.created_at))
            .limit(limit)
            .offset(offset)
            .all();

        return c.json({ success: true, data: productsList });
    } catch (error: any) {
        console.error('Fetch Products List Error:', error);
        return c.json({ success: false, error: 'Ralat memuatkan produk' }, 500);
    }
});

// 5.2 GET /api/products/:id - get specific product detail
catalogRoutes.get('/products/:id', async (c) => {
    try {
        const db = createDb(c.env.DB);
        const productId = c.req.param('id');

        const productDetail = await db.select({
            id: products.id,
            name: products.name,
            description: products.description,
            price: products.price,
            price_note: products.price_note,
            image_url: products.image_url,
            status: products.status,
            created_at: products.created_at,
            category_id: products.category_id,
            seller: {
                id: sellers.id,
                shop_name: sellers.shop_name,
                description: sellers.description,
                phone_whatsapp: sellers.phone_whatsapp,
                state: sellers.state,
                profile_image: sellers.profile_image
            }
        })
            .from(products)
            .innerJoin(sellers, eq(products.seller_id, sellers.id))
            .where(and(eq(products.id, productId), eq(products.is_active, 1)))
            .get();

        if (!productDetail) {
            return c.json({ success: false, error: 'Produk tidak dijumpai' }, 404);
        }

        return c.json({ success: true, data: productDetail });
    } catch (error: any) {
        console.error('Fetch Product Detail Error:', error);
        return c.json({ success: false, error: 'Ralat memuat turun maklumat produk' }, 500);
    }
});

// 8.1 GET /api/sellers/featured - get featured sellers for homepage carousel
catalogRoutes.get('/sellers/featured', async (c) => {
    try {
        const db = createDb(c.env.DB);

        const featuredSellers = await db.select({
            id: sellers.id,
            shop_name: sellers.shop_name,
            description: sellers.description,
            state: sellers.state,
            profile_image: sellers.profile_image,
            phone_whatsapp: sellers.phone_whatsapp,
        })
            .from(sellers)
            .where(and(eq(sellers.is_active, 1), eq(sellers.is_featured, 1)))
            .limit(10)
            .all();

        return c.json({ success: true, data: featuredSellers });
    } catch (error: any) {
        console.error('Fetch Featured Sellers Error:', error);
        return c.json({ success: false, error: 'Ralat memuatkan peniaga pilihan' }, 500);
    }
});

// 5.3 GET /api/sellers/:id - get specific seller public profile + their products
catalogRoutes.get('/sellers/:id', async (c) => {
    try {
        const db = createDb(c.env.DB);
        const sellerId = c.req.param('id');

        const profileDetail = await db.select({
            id: sellers.id,
            shop_name: sellers.shop_name,
            description: sellers.description,
            state: sellers.state,
            profile_image: sellers.profile_image,
            phone_whatsapp: sellers.phone_whatsapp
        })
            .from(sellers)
            .where(and(eq(sellers.id, sellerId), eq(sellers.is_active, 1)))
            .get();

        if (!profileDetail) {
            return c.json({ success: false, error: 'Peniaga tidak dijumpai' }, 404);
        }

        const sellerProducts = await db.select()
            .from(products)
            .where(and(eq(products.seller_id, sellerId), eq(products.is_active, 1)))
            .orderBy(desc(products.created_at))
            .all();

        return c.json({
            success: true,
            data: {
                profile: profileDetail,
                products: sellerProducts
            }
        });

    } catch (error: any) {
        console.error('Fetch Seller Profile Error:', error);
        return c.json({ success: false, error: 'Ralat memuat turun maklumat peniaga' }, 500);
    }
});

export default catalogRoutes;
