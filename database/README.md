# Database Setup for Render.com

## Important Note

Render.com uses **PostgreSQL** as their managed database service, not MySQL. You have two options:

### Option 1: Use PostgreSQL (Recommended)

1. Adapt your database schema to PostgreSQL
2. Update PDO connection strings in PHP code
3. Use Render's managed PostgreSQL service

### Option 2: Use External MySQL Service

1. Use an external MySQL service like:
   - [PlanetScale](https://planetscale.com/)
   - [Aiven](https://aiven.io/)
   - [DigitalOcean Managed Databases](https://www.digitalocean.com/products/managed-databases)
   - [AWS RDS](https://aws.amazon.com/rds/)

2. Update environment variables to point to external MySQL host

## Migration Steps

If using PostgreSQL, you'll need to:

1. Convert MySQL syntax to PostgreSQL
2. Update `backend/config/database.php` to use PostgreSQL PDO driver
3. Update data types (e.g., `BOOLEAN` in MySQL vs `BOOLEAN` in PostgreSQL)
4. Update AUTO_INCREMENT to SERIAL

## Initial Setup

After creating your database on Render:

1. Connect to your database using the connection string from Render dashboard
2. Run `database/init.sql` to create tables
3. Run any migration files in order:
   - `migrate_add_categories.sql`
   - `migration_add_cancelled_status.sql`
   - `migration_add_featured_and_contact.sql`
4. Run `seed_categories.sql` to populate initial categories

