<?php
session_start();
if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}
require_once 'includes/config.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - Partidos</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="admin-container">
        <header>

            <a href="logout.php" class="logout-btn">Cerrar Sesión</a>
        </header>
        
        <div class="match-form">
            <h2>Crear Nuevo Partido</h2>
            <form id="newMatchForm">
                <div class="form-group">
                    <label for="teamA">Equipo A:</label>
                    <input type="text" id="teamA" name="teamA" required>
                </div>
                <div class="form-group">
                    <label for="teamB">Equipo B:</label>
                    <input type="text" id="teamB" name="teamB" required>
                </div>
                <button type="submit" class="create-match-btn">Agregar Partido</button>
            </form>
        </div>

        <div class="matches-container">
            <h2>Partidos Actuales</h2>
            <div id="matchesList"></div>
        </div>
    </div>
    <script src="js/admin.js"></script>
</body>
</html>