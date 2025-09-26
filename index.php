<?php
require_once 'includes/config.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partidos en Vivo</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="public-container">
        <header>
            <h1>Partidos en Vivo</h1>
        </header>
        
        <div class="matches-grid" id="publicMatchesList">
            <!-- Matches will be loaded here dynamically -->
        </div>
    </div>
    
    <footer class="site-footer">
        <div class="creator-signature">
            <span class="inverted-text crossed-out">jcodem</span>
        </div>
    </footer>

    <script src="js/public.js"></script>
</body>
</html>