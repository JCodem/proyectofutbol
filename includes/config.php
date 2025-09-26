<?php
if (file_exists(__DIR__ . '/config.local.php')) {
    // Usar configuración local para desarrollo
    require_once __DIR__ . '/config.local.php';
} else {
    // Configuración de producción
    $host = '127.0.0.1:3306';
    $dbname = 'u232801632_JiZ7e';
    $username = 'u232801632_f8ins';
    $password = '4at;Ou:m:Oe';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec("SET NAMES 'utf8'");
    } catch(PDOException $e) {
        die("Error de conexión: " . $e->getMessage());
    }
}
?>