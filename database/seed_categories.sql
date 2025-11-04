-- Seed script to populate categories
-- This script can be run multiple times safely (uses INSERT IGNORE)
USE jmonline;

-- Ensure categories table exists (for safety)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert categories (will skip if they already exist due to UNIQUE constraint)
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

