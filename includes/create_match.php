<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['teamA']) || !isset($data['teamB'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing team names']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO matches (team_a, team_b) VALUES (?, ?)");
    $stmt->execute([$data['teamA'], $data['teamB']]);
    
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}