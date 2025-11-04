<?php
$authAction = $pathParts[1] ?? '';

if ($method === 'POST' && $endpoint === 'auth') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($authAction === 'login') {
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required']);
            exit();
        }
        
        $user = new User($db);
        if ($user->login($username, $password)) {
            $_SESSION['user_id'] = $user->id;
            $_SESSION['username'] = $user->username;
            $_SESSION['role'] = $user->role;
            
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } elseif ($authAction === 'logout') {
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
    }
    exit();
}

if ($method === 'GET' && $endpoint === 'auth' && $authAction === 'check') {
    if (isAuthenticated()) {
        echo json_encode([
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'role' => $_SESSION['role']
            ]
        ]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
    exit();
}
?>

