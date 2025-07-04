-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS votaciones_db;
USE votaciones_db;

-- Tabla de votantes
CREATE TABLE Voter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    DNI VARCHAR(255) NOT NULL UNIQUE,
    has_voted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabla de candidatos
CREATE TABLE Candidate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    party VARCHAR(100),
	DNI VARCHAR(255) NOT NULL UNIQUE,
    votes INT NOT NULL DEFAULT 0
);

-- Tabla de votos
CREATE TABLE Vote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voter_id INT NOT NULL,
    candidate_id INT NOT NULL,
    UNIQUE KEY unique_voter (voter_id), -- para que un votante solo vote una vez
    FOREIGN KEY (voter_id) REFERENCES Voter(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES Candidate(id) ON DELETE CASCADE
);

INSERT INTO Voter (name, email, DNI)
VALUES ('prueba', 'prueba@example.com', '123456789');




select * from  voter;


drop database votaciones_db;
