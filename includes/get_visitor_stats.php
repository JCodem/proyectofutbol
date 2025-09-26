<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

try {
    $today = date('Y-m-d');
    
    // Asegurarnos de que existe un registro para hoy
    $stmt = $pdo->prepare("
        INSERT INTO visitors (date, count) 
        VALUES (?, 1)
        ON DUPLICATE KEY UPDATE count = count + 1
    ");
    $stmt->execute([$today]);

    // Obtener estadísticas actualizadas
    $todayStmt = $pdo->prepare("SELECT count FROM visitors WHERE date = ?");
    $todayStmt->execute([$today]);
    $todayCount = $todayStmt->fetch(PDO::FETCH_ASSOC);

    $totalStmt = $pdo->query("SELECT SUM(count) as total FROM visitors");
    $totalCount = $totalStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'today' => $todayCount['count'] ?? 0,
        'total' => $totalCount['total'] ?? 0,
        'lastUpdate' => date('Y-m-d H:i:s')
    ]);

    echo json_encode([
        'today' => $todayVisitors,
        'total' => $totalVisitors,
        'lastUpdate' => $lastUpdate
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener estadísticas']);
}