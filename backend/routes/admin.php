<?php
requireAdmin();

require_once '../models/SiteSettings.php';
require_once '../models/Category.php';

$adminEndpoint = $pathParts[1] ?? '';
$adminId = isset($pathParts[2]) && is_numeric($pathParts[2]) ? $pathParts[2] : null;

if ($method === 'GET' && $endpoint === 'admin' && $adminEndpoint === 'users') {
    $user = new User($db);
    $results = $user->getAll();
    echo json_encode($results);
    exit();
}

if ($method === 'POST' && $endpoint === 'admin' && $adminEndpoint === 'users') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $user = new User($db);
    $user->username = $data['username'] ?? '';
    $user->password = $data['password'] ?? '';
    $user->email = $data['email'] ?? '';
    $user->role = $data['role'] ?? 'store_owner';
    
    if (empty($user->username) || empty($user->password) || empty($user->email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username, password, and email are required']);
        exit();
    }
    
    if ($user->create()) {
        http_response_code(201);
        echo json_encode(['success' => true, 'user' => [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role
        ]]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create user']);
    }
    exit();
}

if ($method === 'GET' && $endpoint === 'admin' && $adminEndpoint === 'orders') {
    $order = new Order($db);
    $results = $order->getAll();
    echo json_encode($results);
    exit();
}

if ($method === 'PUT' && $endpoint === 'admin' && $adminEndpoint === 'orders' && $adminId) {
    $data = json_decode(file_get_contents('php://input'), true);
    $status = $data['status'] ?? '';
    
    $validStatuses = ['Placed', 'Paid', 'In Progress', 'For Delivery', 'Completed', 'Cancelled'];
    if (!in_array($status, $validStatuses)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status']);
        exit();
    }
    
    $order = new Order($db);
    if ($order->updateStatus($adminId, $status)) {
        $updatedOrder = $order->getById($adminId);
        echo json_encode(['success' => true, 'order' => $updatedOrder]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update order status']);
    }
    exit();
}

if ($method === 'POST' && $endpoint === 'admin' && $adminEndpoint === 'products') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $product = new Product($db);
    $product->name = $data['name'] ?? '';
    $product->description = $data['description'] ?? '';
    $product->price = $data['price'] ?? 0;
    $product->stock = $data['stock'] ?? 0;
    $product->image_url = $data['image_url'] ?? '';
    $product->category_id = $data['category_id'] ?? null;
    $product->featured = isset($data['featured']) ? (bool)$data['featured'] : false;
    
    if (empty($product->name) || !is_numeric($product->price) || $product->price <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and valid price are required']);
        exit();
    }
    
    if ($product->create()) {
        http_response_code(201);
        echo json_encode(['success' => true, 'product' => [
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'image_url' => $product->image_url,
            'category_id' => $product->category_id,
            'featured' => $product->featured
        ]]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create product']);
    }
    exit();
}

if ($method === 'PUT' && $endpoint === 'admin' && $adminEndpoint === 'products' && $adminId && isset($pathParts[3]) && $pathParts[3] === 'stock') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stock = $data['stock'] ?? null;
    
    if ($stock === null || !is_numeric($stock)) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid stock value is required']);
        exit();
    }
    
    $product = new Product($db);
    if ($product->updateStock($adminId, $stock)) {
        $updatedProduct = $product->getById($adminId);
        echo json_encode(['success' => true, 'product' => $updatedProduct]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update stock']);
    }
    exit();
}

if ($method === 'PUT' && $endpoint === 'admin' && $adminEndpoint === 'products' && $adminId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $product = new Product($db);
    $product->id = $adminId;
    $product->name = $data['name'] ?? '';
    $product->description = $data['description'] ?? '';
    $product->price = $data['price'] ?? 0;
    $product->stock = $data['stock'] ?? 0;
    $product->image_url = $data['image_url'] ?? '';
    $product->category_id = $data['category_id'] ?? null;
    $product->featured = isset($data['featured']) ? (bool)$data['featured'] : false;
    
    if (empty($product->name) || !is_numeric($product->price) || $product->price <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and valid price are required']);
        exit();
    }
    
    if ($product->update()) {
        $updatedProduct = $product->getById($adminId);
        echo json_encode(['success' => true, 'product' => $updatedProduct]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update product']);
    }
    exit();
}

if ($method === 'DELETE' && $endpoint === 'admin' && $adminEndpoint === 'products' && $adminId) {
    $product = new Product($db);
    
    // Check if product exists
    $existingProduct = $product->getById($adminId);
    if (!$existingProduct) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        exit();
    }
    
    if ($product->delete($adminId)) {
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete product']);
    }
    exit();
}

if ($method === 'POST' && $endpoint === 'admin' && $adminEndpoint === 'products' && isset($pathParts[2]) && $pathParts[2] === 'upload') {
    require_once '../utils/csv_parser.php';
    
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
        exit();
    }
    
    $file = $_FILES['file'];
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($fileExtension, ['csv', 'xls', 'xlsx'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only CSV, XLS, and XLSX files are allowed']);
        exit();
    }
    
    try {
        $products = parseInventoryFile($file['tmp_name'], $fileExtension);
        $product = new Product($db);
        
        if ($product->bulkUpsert($products)) {
            echo json_encode(['success' => true, 'message' => 'Inventory updated successfully', 'count' => count($products)]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update inventory']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit();
}

// Category management routes
if ($method === 'GET' && $endpoint === 'admin' && $adminEndpoint === 'categories') {
    $category = new Category($db);
    $results = $category->getAll();
    echo json_encode($results);
    exit();
}

if ($method === 'POST' && $endpoint === 'admin' && $adminEndpoint === 'categories') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $category = new Category($db);
    $category->name = trim($data['name'] ?? '');
    $category->description = trim($data['description'] ?? '');
    
    if (empty($category->name)) {
        http_response_code(400);
        echo json_encode(['error' => 'Category name is required']);
        exit();
    }
    
    if ($category->create()) {
        http_response_code(201);
        echo json_encode(['success' => true, 'category' => [
            'id' => $category->id,
            'name' => $category->name,
            'description' => $category->description
        ]]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create category. Category name may already exist.']);
    }
    exit();
}

if ($method === 'PUT' && $endpoint === 'admin' && $adminEndpoint === 'categories' && $adminId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $category = new Category($db);
    $category->id = $adminId;
    $category->name = trim($data['name'] ?? '');
    $category->description = trim($data['description'] ?? '');
    
    if (empty($category->name)) {
        http_response_code(400);
        echo json_encode(['error' => 'Category name is required']);
        exit();
    }
    
    // Check if category exists
    $existingCategory = $category->getById($adminId);
    if (!$existingCategory) {
        http_response_code(404);
        echo json_encode(['error' => 'Category not found']);
        exit();
    }
    
    if ($category->update()) {
        $updatedCategory = $category->getById($adminId);
        echo json_encode(['success' => true, 'category' => $updatedCategory]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update category. Category name may already exist.']);
    }
    exit();
}

if ($method === 'DELETE' && $endpoint === 'admin' && $adminEndpoint === 'categories' && $adminId) {
    $category = new Category($db);
    
    // Check if category exists
    $existingCategory = $category->getById($adminId);
    if (!$existingCategory) {
        http_response_code(404);
        echo json_encode(['error' => 'Category not found']);
        exit();
    }
    
    if ($category->delete($adminId)) {
        echo json_encode(['success' => true, 'message' => 'Category deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete category']);
    }
    exit();
}
?>

