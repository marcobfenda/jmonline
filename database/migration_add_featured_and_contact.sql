-- Migration: Add featured products and contact form support
USE jmonline;

-- Add featured field to products table (if not exists)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE AFTER category_id;

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Set some sample products as featured (only if not already set)
UPDATE products SET featured = TRUE 
WHERE name IN ('Office Chair', 'Desk Lamp', 'Keyboard') 
AND (featured IS NULL OR featured = FALSE)
LIMIT 3;

