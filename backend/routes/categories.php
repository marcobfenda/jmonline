<?php
if ($method === 'GET' && $endpoint === 'categories') {
    $category = new Category($db);
    
    if ($id) {
        $result = $category->getById($id);
        if ($result) {
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Category not found']);
        }
    } else {
        $results = $category->getAll();
        echo json_encode($results);
    }
    exit();
}
?>

