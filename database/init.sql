-- Create database if not exists
CREATE DATABASE IF NOT EXISTS jmonline;
USE jmonline;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin', 'store_owner') DEFAULT 'store_owner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(500),
    category_id INT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Placed', 'Paid', 'In Progress', 'For Delivery', 'Completed', 'Cancelled') DEFAULT 'Placed',
    payment_method ENUM('bank_transfer', 'cash_on_delivery', 'paypal') DEFAULT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'JM Online'),
('primary_color', '#007bff'),
('secondary_color', '#6c757d'),
('logo_url', NULL);

-- Users will be created by setup_users.php script with proper password hashing

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Furniture', 'Office furniture and seating'),
('Electronics', 'Electronic devices and accessories'),
('Office Supplies', 'Stationery and office consumables'),
('Accessories', 'Computer and desk accessories');

-- Insert sample products (using NULL for image_url - will use fallback SVG)
INSERT INTO products (name, description, price, stock, image_url, featured) VALUES
('Office Chair', 'Ergonomic office chair with lumbar support', 299.99, 50, NULL, TRUE),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 49.99, 100, NULL, TRUE),
('Filing Cabinet', '4-drawer filing cabinet, lockable', 199.99, 30, NULL, FALSE),
('Printer Paper A4', 'Premium A4 paper, 500 sheets per pack', 24.99, 200, NULL, FALSE),
('Stapler', 'Heavy-duty stapler with 500 staples capacity', 19.99, 150, NULL, FALSE),
('Whiteboard', 'Magnetic whiteboard 120x90cm', 89.99, 40, NULL, FALSE),
('Paper Clips', 'Assorted paper clips box, 1000 pieces', 9.99, 300, NULL, FALSE),
('Monitor Stand', 'Adjustable monitor stand with storage', 79.99, 60, NULL, FALSE),
('Keyboard', 'Wireless mechanical keyboard', 129.99, 80, NULL, TRUE),
('Mouse Pad', 'Large gaming mouse pad with wrist support', 15.99, 120, NULL, FALSE);

-- Update products with categories
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Furniture' LIMIT 1) WHERE name IN ('Office Chair', 'Filing Cabinet', 'Monitor Stand');
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1) WHERE name IN ('Desk Lamp', 'Keyboard');
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Office Supplies' LIMIT 1) WHERE name IN ('Printer Paper A4', 'Stapler', 'Paper Clips', 'Whiteboard');
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1) WHERE name IN ('Mouse Pad');

