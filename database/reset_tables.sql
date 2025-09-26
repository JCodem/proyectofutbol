-- Borrar tablas si existen para evitar conflictos
DROP TABLE IF EXISTS team_support;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS system_config;

-- Tabla para configuraciones del sistema
CREATE TABLE system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(50) NOT NULL UNIQUE,
    config_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar configuración inicial
INSERT INTO system_config (config_key, config_value) VALUES 
('enable_new_matches', '1'),
('last_updated', NOW());

-- Tabla para visitantes
CREATE TABLE visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    count INT DEFAULT 0,
    INDEX idx_date (date)
);

-- Insertar registro inicial para hoy
INSERT INTO visitors (date, count) VALUES (CURDATE(), 0);

-- Tabla para contadores de apoyo
CREATE TABLE team_support (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    team_id CHAR(1) NOT NULL,
    user_ip VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_match_team (match_id, team_id),
    INDEX idx_user_ip (user_ip),
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);