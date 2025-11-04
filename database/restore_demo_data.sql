-- Restore demo data script
-- This script will restore all demo products and ensure categories are populated
USE jmonline;

-- First, ensure all categories from seed_categories.sql exist
INSERT IGNORE INTO categories (name, description) VALUES
('Furniture', 'Office furniture and seating solutions'),
('Electronics', 'Electronic devices and accessories'),
('Office Supplies', 'Stationery and office consumables'),
('Accessories', 'Computer and desk accessories'),
('Cleaning Supplies', 'Office cleaning and maintenance products'),
('Printing & Paper', 'Printers, paper, ink cartridges, and printing supplies'),
('Storage Solutions', 'Filing cabinets, storage boxes, and organization systems'),
('Lighting', 'Desk lamps, overhead lighting, and LED solutions'),
('Cables & Adapters', 'USB cables, power adapters, and connectivity solutions'),
('Security & Safety', 'Locks, security systems, and safety equipment'),
('Breakroom & Kitchen', 'Coffee makers, water coolers, and kitchen supplies'),
('Presentation Tools', 'Projectors, whiteboards, and presentation equipment'),
('Packaging & Shipping', 'Boxes, envelopes, tape, and shipping supplies'),
('Signage & Display', 'Name plates, signs, and display boards'),
('Tools & Hardware', 'Basic tools, screws, and hardware supplies'),
('Plants & Decor', 'Office plants and decorative items'),
('Meeting Room', 'Conference tables, chairs, and meeting room equipment'),
('Ergonomics', 'Ergonomic accessories and support products'),
('Software & Services', 'Software licenses and office services'),
('Maintenance', 'Maintenance supplies and replacement parts');

-- Delete existing demo products to avoid duplicates
DELETE FROM products WHERE name IN (
    'Office Chair', 'Desk Lamp', 'Filing Cabinet', 'Printer Paper A4',
    'Stapler', 'Whiteboard', 'Paper Clips', 'Monitor Stand',
    'Keyboard', 'Mouse Pad'
);

-- Insert sample products
INSERT INTO products (name, description, price, stock, image_url, category_id, featured) VALUES
('Office Chair', 'Ergonomic office chair with lumbar support', 299.99, 50, NULL, 
    (SELECT id FROM categories WHERE name = 'Furniture' LIMIT 1), TRUE),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 49.99, 100, NULL,
    (SELECT id FROM categories WHERE name = 'Lighting' LIMIT 1), TRUE),
('Filing Cabinet', '4-drawer filing cabinet, lockable', 199.99, 30, NULL,
    (SELECT id FROM categories WHERE name = 'Storage Solutions' LIMIT 1), FALSE),
('Printer Paper A4', 'Premium A4 paper, 500 sheets per pack', 24.99, 200, NULL,
    (SELECT id FROM categories WHERE name = 'Printing & Paper' LIMIT 1), FALSE),
('Stapler', 'Heavy-duty stapler with 500 staples capacity', 19.99, 150, NULL,
    (SELECT id FROM categories WHERE name = 'Office Supplies' LIMIT 1), FALSE),
('Whiteboard', 'Magnetic whiteboard 120x90cm', 89.99, 40, NULL,
    (SELECT id FROM categories WHERE name = 'Presentation Tools' LIMIT 1), FALSE),
('Paper Clips', 'Assorted paper clips box, 1000 pieces', 9.99, 300, NULL,
    (SELECT id FROM categories WHERE name = 'Office Supplies' LIMIT 1), FALSE),
('Monitor Stand', 'Adjustable monitor stand with storage', 79.99, 60, NULL,
    (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1), FALSE),
('Keyboard', 'Wireless mechanical keyboard', 129.99, 80, NULL,
    (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1), TRUE),
('Mouse Pad', 'Large gaming mouse pad with wrist support', 15.99, 120, NULL,
    (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1), FALSE);

-- Ensure site settings exist
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'JM Online'),
('primary_color', '#007bff'),
('secondary_color', '#6c757d'),
('logo_url', NULL);

