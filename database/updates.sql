-- Tabla para configuraciones del sistema
CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(50) NOT NULL UNIQUE,
    config_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar configuración inicial
INSERT INTO system_config (config_key, config_value) VALUES 
('enable_new_matches', '1'),
('last_updated', NOW());

-- Tabla para contadores de apoyo
CREATE TABLE IF NOT EXISTS team_support (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    team_id CHAR(1) NOT NULL,  -- 'A' o 'B' para identificar el equipo
    user_ip VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- Tabla para visitantes
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    count INT DEFAULT 0,
    date DATE NOT NULL UNIQUE
);