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

if (!isset($data['matchId']) || !isset($data['team'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

try {
    $column = $data['team'] === 'A' ? 'score_a' : 'score_b';
    $stmt = $pdo->prepare("UPDATE matches SET $column = $column + 1 WHERE id = ?");
    $stmt->execute([$data['matchId']]);
    
    echo json_encode(['success' => true]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}