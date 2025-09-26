<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("
        SELECT match_id, team_id, COUNT(*) as count 
        FROM team_support 
        GROUP BY match_id, team_id
    ");
    $stmt->execute();
    
    $support_counts = [];
    while ($row = $stmt->fetch()) {
        if (!isset($support_counts[$row['match_id']])) {
            $support_counts[$row['match_id']] = ['A' => 0, 'B' => 0];
        }
        $support_counts[$row['match_id']][$row['team_id']] = (int)$row['count'];
    }
    
    echo json_encode(['success' => true, 'counts' => $support_counts]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener conteos de apoyo']);
}