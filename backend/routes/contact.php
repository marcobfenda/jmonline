<?php
if ($method === 'POST' && $endpoint === 'contact') {
    require_once '../models/ContactSubmission.php';
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $contact = new ContactSubmission($db);
    $contact->name = trim($data['name'] ?? '');
    $contact->email = trim($data['email'] ?? '');
    $contact->subject = trim($data['subject'] ?? '');
    $contact->message = trim($data['message'] ?? '');
    
    if (empty($contact->name) || empty($contact->email) || empty($contact->subject) || empty($contact->message)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit();
    }
    
    if (!filter_var($contact->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit();
    }
    
    if ($contact->create()) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Thank you for your message. We will get back to you soon.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to submit contact form']);
    }
    exit();
}
?>

