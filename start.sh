#!/bin/bash

echo "Starting JM Online Docker containers..."

# Check if docker-compose or docker compose is available
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "Error: docker-compose or docker compose not found"
    exit 1
fi

# Build and start containers
$DOCKER_COMPOSE up -d --build

echo "Waiting for services to start..."
sleep 15

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker exec jmonline_mysql mysqladmin ping -h localhost --silent; then
        echo "MySQL is ready!"
        break
    fi
    attempt=$((attempt + 1))
    sleep 2
done

# Run setup script
echo "Setting up users..."
docker exec jmonline_php php setup_users.php

echo ""
echo "=========================================="
echo "Setup complete!"
echo "=========================================="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8082/api"
echo ""
echo "Test Credentials:"
echo "  Store Owner: username=storeowner, password=store123"
echo "  Admin: username=admin, password=admin123"
echo "=========================================="

