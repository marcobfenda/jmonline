<?php
// Start session early, before any output
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Get the origin from the request
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://localhost:3000';

// Allow credentials and set specific origin
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../models/User.php';
require_once '../models/Product.php';
require_once '../models/Category.php';
require_once '../models/Order.php';
require_once '../models/SiteSettings.php';
require_once '../utils/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);
$path = trim($path, '/');
$pathParts = $path ? array_filter(explode('/', $path)) : [];
$pathParts = array_values($pathParts);

$db = (new Database())->getConnection();

// Route handling
$endpoint = $pathParts[0] ?? '';
$id = isset($pathParts[1]) && is_numeric($pathParts[1]) ? $pathParts[1] : null;

try {
    switch ($endpoint) {
        case 'auth':
            require_once '../routes/auth.php';
            break;
        case 'products':
            require_once '../routes/products.php';
            break;
        case 'categories':
            require_once '../routes/categories.php';
            break;
        case 'orders':
            require_once '../routes/orders.php';
            break;
        case 'admin':
            require_once '../routes/admin.php';
            break;
        case 'settings':
            require_once '../routes/settings.php';
            break;
        case 'contact':
            require_once '../routes/contact.php';
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

