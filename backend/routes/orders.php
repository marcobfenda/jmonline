<?php
requireAuth();

$order = new Order($db);

if ($method === 'POST' && $endpoint === 'orders') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $order->user_id = getCurrentUserId();
    $order->total_amount = $data['total_amount'] ?? 0;
    $order->status = 'Placed';
    $order->payment_method = null;
    $order->payment_status = 'pending';
    $order->items = $data['items'] ?? [];
    
    if ($order->create()) {
        $createdOrder = $order->getById($order->id);
        http_response_code(201);
        echo json_encode(['success' => true, 'order' => $createdOrder]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create order']);
    }
    exit();
}

if ($method === 'GET' && $endpoint === 'orders') {
    $userId = getCurrentUserId();
    $results = $order->getAll($userId);
    echo json_encode($results);
    exit();
}

if ($method === 'GET' && $endpoint === 'orders' && $id) {
    $result = $order->getById($id);
    if ($result) {
        // Check if user owns the order or is admin
        if ($result['user_id'] == getCurrentUserId() || isAdmin()) {
            echo json_encode($result);
        } else {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found']);
    }
    exit();
}

if ($method === 'PUT' && $endpoint === 'orders' && $id && isset($pathParts[2]) && $pathParts[2] === 'payment') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $orderObj = $order->getById($id);
    if (!$orderObj) {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found']);
        exit();
    }
    
    // Check if user owns the order
    if ($orderObj['user_id'] != getCurrentUserId()) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit();
    }
    
    $payment_method = $data['payment_method'] ?? '';
    $payment_status = $data['payment_status'] ?? 'paid';
    
    if ($order->updatePayment($id, $payment_method, $payment_status)) {
        $updatedOrder = $order->getById($id);
        echo json_encode(['success' => true, 'order' => $updatedOrder]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update payment']);
    }
    exit();
}
?>

