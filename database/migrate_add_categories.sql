-- Migration: Add categories support
USE jmonline;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add category_id to products table
ALTER TABLE products 
ADD COLUMN category_id INT NULL AFTER image_url,
ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Furniture', 'Office furniture and seating'),
('Electronics', 'Electronic devices and accessories'),
('Office Supplies', 'Stationery and office consumables'),
('Accessories', 'Computer and desk accessories');

-- Update existing products with categories (sample mapping)
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Furniture' LIMIT 1) WHERE name IN ('Office Chair', 'Filing Cabinet', 'Monitor Stand');
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1) WHERE name IN ('Desk Lamp', 'Keyboard');
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Office Supplies' LIMIT 1) WHERE name IN ('Printer Paper A4', 'Stapler', 'Paper Clips', 'Whiteboard');
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1) WHERE name IN ('Mouse Pad');

