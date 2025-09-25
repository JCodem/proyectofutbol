-- Create the database
CREATE DATABASE IF NOT EXISTS futbol_db;
USE futbol_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_a VARCHAR(100) NOT NULL,
    team_b VARCHAR(100) NOT NULL,
    score_a INT DEFAULT 0,
    score_b INT DEFAULT 0,
    status ENUM('pending', 'in_progress', 'finished') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin users
INSERT INTO users (username, password) VALUES
('admin', '$2y$10$YourHashedPasswordHere'),
('admin2', '$2y$10$YourHashedPasswordHere');