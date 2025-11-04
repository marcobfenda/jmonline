<?php
if ($method === 'GET' && $endpoint === 'settings') {
    $settings = new SiteSettings($db);
    $allSettings = $settings->getAll();
    echo json_encode($allSettings);
    exit();
}

if ($method === 'PUT' && $endpoint === 'settings') {
    requireAdmin();
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $settings = new SiteSettings($db);
    
    $allowedKeys = ['site_name', 'primary_color', 'secondary_color', 'logo_url', 'meta_title', 'meta_description', 'meta_keywords', 'og_title', 'og_description', 'og_image'];
    $updateData = [];
    
    foreach ($allowedKeys as $key) {
        if (isset($data[$key])) {
            $updateData[$key] = $data[$key];
        }
    }
    
    if (empty($updateData)) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid settings provided']);
        exit();
    }
    
    if ($settings->updateMultiple($updateData)) {
        $updatedSettings = $settings->getAll();
        echo json_encode(['success' => true, 'settings' => $updatedSettings]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update settings']);
    }
    exit();
}

if ($method === 'POST' && $endpoint === 'settings' && isset($pathParts[1]) && $pathParts[1] === 'upload-logo') {
    requireAdmin();
    
    if (!isset($_FILES['logo'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
        exit();
    }
    
    $file = $_FILES['logo'];
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only JPEG, PNG, GIF, and SVG are allowed']);
        exit();
    }
    
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'File size exceeds 5MB limit']);
        exit();
    }
    
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = 'logo_' . time() . '.' . $fileExtension;
    $filePath = $uploadDir . $fileName;
    
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        // Use relative path from web root
        $logoUrl = '/uploads/' . $fileName;
        $settings = new SiteSettings($db);
        $settings->set('logo_url', $logoUrl);
        
        // Return full URL for frontend
        $fullUrl = 'http://' . $_SERVER['HTTP_HOST'] . $logoUrl;
        echo json_encode(['success' => true, 'logo_url' => $logoUrl, 'full_url' => $fullUrl]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload logo']);
    }
    exit();
}
?>

