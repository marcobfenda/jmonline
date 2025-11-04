# JM Online - B2B E-commerce Platform

A full-stack B2B e-commerce platform built with React, PHP, and MySQL, containerized with Docker.

## Features

### Store Owners
- Login with unique username and password
- Browse and select products
- Place orders
- View order history
- Make payments via:
  - Bank Transfer
  - Cash on Delivery
  - PayPal

### Admin Panel
- User management (create users, assign roles)
- Order management (view orders, update status)
- Stock management (update stock levels)
- Bulk inventory upload (CSV/XLS)

## Tech Stack

- **Frontend**: React 18 with React Router
- **Backend**: PHP 8.2 with Apache
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker
- Docker Compose

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jmonline
```

2. Start the Docker containers:
```bash
# Option 1: Use the start script (recommended)
./start.sh

# Option 2: Manual setup
docker-compose up -d --build
# Wait for MySQL to be ready, then run:
docker exec jmonline_php php setup_users.php
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8082/api

## Default Login Credentials

### Store Owner
- Username: `storeowner`
- Password: `store123`

### Admin
- Username: `admin`
- Password: `admin123`

## Sample Data

The database is pre-seeded with:
- 2 users (1 admin, 1 store owner)
- 10 sample products

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check authentication status

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders` - Get user orders (requires auth)
- `GET /api/orders/{id}` - Get order details (requires auth)
- `PUT /api/orders/{id}/payment` - Update payment (requires auth)

### Admin
- `GET /api/admin/users` - Get all users (requires admin)
- `POST /api/admin/users` - Create user (requires admin)
- `GET /api/admin/orders` - Get all orders (requires admin)
- `PUT /api/admin/orders/{id}` - Update order status (requires admin)
- `PUT /api/admin/products/{id}/stock` - Update product stock (requires admin)
- `POST /api/admin/products/upload` - Upload inventory CSV (requires admin)

## Order Status Flow

1. **Placed** - Order has been placed, awaiting payment
2. **Paid** - Payment has been received
3. **In Progress** - Order is being processed
4. **For Delivery** - Order is ready for delivery
5. **Completed** - Order has been delivered

## CSV Upload Format

For bulk inventory upload, use a CSV file with the following columns:
- name (required)
- description (optional)
- price (required)
- stock (required)
- image_url (optional)

Example:
```csv
name,description,price,stock,image_url
Product Name,Product Description,29.99,100,https://example.com/image.jpg
```

## Development

### Backend Structure
```
backend/
├── api/           # API entry point
├── config/        # Database configuration
├── models/        # Database models
├── routes/        # Route handlers
└── utils/         # Utility functions
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/  # React components
│   ├── contexts/    # React contexts
│   └── services/    # API service
```

## Troubleshooting

### Containers not starting
- Check Docker logs: `docker-compose logs` or `docker compose logs`
- Ensure ports 3000, 8080, and 3306 are not in use
- Try rebuilding: `docker-compose up -d --build`

### Database connection issues
- Wait for MySQL to fully initialize (can take 30-60 seconds)
- Check MySQL logs: `docker-compose logs mysql`
- Verify users were created: `docker exec jmonline_php php setup_users.php`

### API not responding
- Verify PHP container is running: `docker ps`
- Check Apache logs: `docker-compose logs php`
- Test API endpoint: `curl http://localhost:8082/api/products`

### Frontend not loading
- Check React logs: `docker-compose logs react`
- Verify React container is running: `docker ps`
- Clear browser cache and try again

## License

MIT

