<?php
require_once 'config/database.php';
require_once 'models/User.php';

// Wait for database to be ready
$maxAttempts = 30;
$attempt = 0;
$db = null;

while ($attempt < $maxAttempts) {
    try {
        $db = (new Database())->getConnection();
        if ($db) {
            break;
        }
    } catch (Exception $e) {
        $attempt++;
        if ($attempt >= $maxAttempts) {
            error_log("Failed to connect to database after $maxAttempts attempts");
            exit(1);
        }
        sleep(2);
    }
}

if (!$db) {
    error_log("Database connection failed");
    exit(1);
}

// Create admin user
$admin = new User($db);
$admin->username = 'admin';
$admin->password = 'admin123';
$admin->email = 'admin@jmonline.com';
$admin->role = 'admin';

// Check if admin exists
$existingAdmin = $admin->getById(1);
if (!$existingAdmin) {
    if ($admin->create()) {
        echo "Admin user created successfully\n";
    } else {
        echo "Failed to create admin user\n";
    }
} else {
    echo "Admin user already exists\n";
}

// Create store owner user
$storeOwner = new User($db);
$storeOwner->username = 'storeowner';
$storeOwner->password = 'store123';
$storeOwner->email = 'store@jmonline.com';
$storeOwner->role = 'store_owner';

// Check if store owner exists (check by username)
$query = "SELECT id FROM users WHERE username = 'storeowner' LIMIT 1";
$stmt = $db->prepare($query);
$stmt->execute();
if ($stmt->rowCount() == 0) {
    if ($storeOwner->create()) {
        echo "Store owner user created successfully\n";
    } else {
        echo "Failed to create store owner user\n";
    }
} else {
    echo "Store owner user already exists\n";
}
?>

