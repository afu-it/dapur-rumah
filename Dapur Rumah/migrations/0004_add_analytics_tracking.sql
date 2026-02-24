-- Phase 8.3: Product event tracking (views + WhatsApp clicks)
ALTER TABLE products ADD COLUMN views INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN whatsapp_clicks INTEGER DEFAULT 0;
