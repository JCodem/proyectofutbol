<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    $date = date('Y-m-d');
    $userIp = $_SERVER['REMOTE_ADDR'];
    $sessionId = session_id();

    // Insertar o actualizar el registro del día
    $stmt = $pdo->prepare("INSERT INTO visitors (date, count) 
                          VALUES (?, 1) 
                          ON DUPLICATE KEY UPDATE count = count + 1");
    $stmt->execute([$date]);
    
    // Obtener todos los conteos
    $todayStmt = $pdo->prepare("SELECT count FROM visitors WHERE date = ?");
    $todayStmt->execute([$date]);
    $todayCount = $todayStmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;
    
    $totalStmt = $pdo->query("SELECT SUM(count) as total FROM visitors");
    $totalCount = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    
    echo json_encode([
        'success' => true,
        'today' => $todayCount,
        'total' => $totalCount,
        'lastUpdate' => date('Y-m-d H:i:s')
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al actualizar visitantes',
        'details' => $e->getMessage()
    ]);
}