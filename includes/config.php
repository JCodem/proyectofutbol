<?php
$host = 'localhost';
$dbname = 'futbol_db';
$username = 'u232801632_f8ins';
$password = '&6Q8g8rKl4Mp';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>