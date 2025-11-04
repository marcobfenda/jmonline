<?php
if ($method === 'GET' && $endpoint === 'products') {
    $product = new Product($db);
    
    if ($id) {
        $result = $product->getById($id);
        if ($result) {
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
    } else {
        // Check for category filter and featured filter in query string
        $categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
        $featuredOnly = isset($_GET['featured']) && $_GET['featured'] === 'true';
        $results = $product->getAll($categoryId, $featuredOnly);
        echo json_encode($results);
    }
    exit();
}
?>

