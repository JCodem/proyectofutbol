<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM matches ORDER BY created_at DESC");
    $matches = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($matches);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al cargar los partidos']);
}