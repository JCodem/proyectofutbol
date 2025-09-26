<?php
require_once 'config.php';
session_start();

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $match_id = intval($data['match_id'] ?? 0);
    $team_id = $data['team_id'] ?? '';
    $user_ip = $_SERVER['REMOTE_ADDR'];
    
    if ($match_id === 0 || !in_array($team_id, ['A', 'B'])) {
        throw new Exception('Datos inválidos');
    }

    // Verificar si el usuario ya apoyó en los últimos 5 minutos
    $stmt = $pdo->prepare("SELECT created_at 
                          FROM team_support 
                          WHERE user_ip = ? AND match_id = ? 
                          AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
                          ORDER BY created_at DESC 
                          LIMIT 1");
    $stmt->execute([$user_ip, $match_id]);
    $lastSupport = $stmt->fetch();

    if ($lastSupport) {
        $timeLeft = 300 - (time() - strtotime($lastSupport['created_at']));
        echo json_encode([
            'error' => 'Debes esperar antes de volver a apoyar',
            'timeLeft' => max(0, $timeLeft)
        ]);
        exit;
    }

    // Registrar el nuevo apoyo
    $stmt = $pdo->prepare("INSERT INTO team_support (match_id, team_id, user_ip) VALUES (?, ?, ?)");
    $stmt->execute([$match_id, $team_id, $user_ip]);

    // Obtener conteo actualizado
    $stmt = $pdo->prepare("
        SELECT team_id, COUNT(*) as count 
        FROM team_support 
        WHERE match_id = ? 
        GROUP BY team_id
    ");
    $stmt->execute([$match_id]);
    $results = $stmt->fetchAll();
    
    $counts = ['A' => 0, 'B' => 0];
    foreach ($results as $row) {
        $counts[$row['team_id']] = intval($row['count']);
    }

    echo json_encode([
        'success' => true,
        'counts' => $counts
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos']);
}

if (!$match_id || !$team_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

try {
    // Verificar si el usuario ya apoyó en los últimos 5 minutos
    $stmt = $pdo->prepare("SELECT id FROM team_support 
                          WHERE user_ip = ? AND match_id = ? 
                          AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)");
    $stmt->execute([$user_ip, $match_id]);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Debes esperar 5 minutos entre apoyos',
            'waitTime' => 300 // 5 minutos en segundos
        ]);
        exit;
    }
    
    // Registrar el nuevo apoyo
    $stmt = $pdo->prepare("INSERT INTO team_support (match_id, team_id, user_ip) VALUES (?, ?, ?)");
    $stmt->execute([$match_id, $team_id, $user_ip]);
    
    // Obtener el conteo actual de apoyos para ambos equipos
    $stmt = $pdo->prepare("SELECT team_id, COUNT(*) as count 
                          FROM team_support 
                          WHERE match_id = ? 
                          GROUP BY team_id");
    $stmt->execute([$match_id]);
    $support_counts = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    echo json_encode([
        'success' => true,
        'support_counts' => [
            'A' => $support_counts['A'] ?? 0,
            'B' => $support_counts['B'] ?? 0
        ]
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al procesar el apoyo']);
}