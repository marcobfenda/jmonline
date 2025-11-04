-- Migration: Add Cancelled status to orders table
-- Run this if you already have an existing database

ALTER TABLE orders 
MODIFY COLUMN status ENUM('Placed', 'Paid', 'In Progress', 'For Delivery', 'Completed', 'Cancelled') DEFAULT 'Placed';

