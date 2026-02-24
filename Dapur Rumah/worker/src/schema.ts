import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
    image: text("image"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id)
});

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
});

// Categories
export const categories = sqliteTable("categories", {
    id: text("id").primaryKey(), // TEXT in SQL: 'cat_1', 'cat_2', etc.
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    icon: text("icon"),
    sort_order: integer("sort_order").notNull().default(0),
    created_at: text("created_at") // Optional — not in original migration
});

// Sellers
export const sellers = sqliteTable("sellers", {
    id: text("id").primaryKey().references(() => user.id),
    shop_name: text("shop_name").notNull().default(''),
    description: text("description"),
    phone_whatsapp: text("phone_whatsapp").notNull().default(''),
    state: text("state").notNull().default(''),
    city: text("city"),
    profile_image: text("profile_image"),
    is_active: integer("is_active").notNull().default(1),
    is_featured: integer("is_featured").notNull().default(0),
    created_at: text("created_at"),
    updated_at: text("updated_at")
});

// Products
export const products = sqliteTable("products", {
    id: text("id").primaryKey(),
    seller_id: text("seller_id").notNull().references(() => sellers.id),
    category_id: text("category_id").notNull().references(() => categories.id), // TEXT to match SQL
    name: text("name").notNull(),
    description: text("description"),
    price: real("price").notNull(),
    price_note: text("price_note"),
    image_url: text("image_url"),
    status: text("status").notNull().default('ada_stok'),
    is_featured: integer("is_featured").notNull().default(0),
    is_active: integer("is_active").notNull().default(1),
    views: integer("views").default(0),
    whatsapp_clicks: integer("whatsapp_clicks").default(0),
    created_at: text("createdAt"), // Matches actual SQL column 'createdAt'
    updated_at: text("updatedAt")  // Matches actual SQL column 'updatedAt'
});
