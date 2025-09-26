<?php
$host = '127.0.0.1:3306';
$dbname = 'u232801632_JiZ7e';
$username = 'u232801632_f8ins';
$password = '4at;Ou:m:Oe';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>