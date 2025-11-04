#!/bin/bash
# Build script for Render.com deployment

echo "Starting build process..."

# Create uploads directory with proper permissions
mkdir -p uploads
chmod 755 uploads

# Install PHP dependencies if using Composer (for future use)
# composer install --no-dev --optimize-autoloader

echo "Build completed successfully!"

