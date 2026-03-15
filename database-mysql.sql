-- ============================================
-- SISTEMA DE LOGÍSTICA - SCRIPT MYSQL
-- Equivalente ao schema criado no Supabase
-- ============================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS fretelog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fretelog;

-- ============================================
-- TABELA: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('transportadora', 'agenciador', 'motorista') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: transportadoras
-- ============================================
CREATE TABLE IF NOT EXISTS transportadoras (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    ie VARCHAR(20) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_cnpj (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: agenciadores
-- ============================================
CREATE TABLE IF NOT EXISTS agenciadores (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18) NOT NULL,
    tipo_documento ENUM('CPF', 'CNPJ') NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_cpf_cnpj (cpf_cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: motoristas
-- ============================================
CREATE TABLE IF NOT EXISTS motoristas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18) NOT NULL,
    tipo_documento ENUM('CPF', 'CNPJ') NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    cnh_c BOOLEAN DEFAULT FALSE,
    cnh_e BOOLEAN DEFAULT FALSE,
    curso_mopp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_cpf_cnpj (cpf_cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: veiculos
-- ============================================
CREATE TABLE IF NOT EXISTS veiculos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    motorista_id CHAR(36) NOT NULL,
    tipo_veiculo ENUM('Van', 'Fiorino', '3/4', 'Toco', 'Truck', 'Carreta', 'Rodotrem') NOT NULL,
    marca VARCHAR(100) NOT NULL,
    ano INT NOT NULL,
    foto_url TEXT,
    peso_ton DECIMAL(10,2) NOT NULL,
    volume_m3 DECIMAL(10,2) NOT NULL,
    qtd_pallets INT NOT NULL,
    placa_cavalo VARCHAR(8),
    placa_carreta1 VARCHAR(8),
    placa_carreta2 VARCHAR(8),
    tipo_carroceria ENUM('Baú', 'Sider', 'Aberta', 'Graneleira', 'Container', 'Frigorífica', 'Tanque', 'Plataforma'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (motorista_id) REFERENCES motoristas(id) ON DELETE CASCADE,
    INDEX idx_motorista_id (motorista_id),
    INDEX idx_tipo_veiculo (tipo_veiculo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: ofertas_carga
-- ============================================
CREATE TABLE IF NOT EXISTS ofertas_carga (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    transportadora_id CHAR(36) NOT NULL,
    origem_cidade VARCHAR(100) NOT NULL,
    origem_uf CHAR(2) NOT NULL,
    destino_cidade VARCHAR(100) NOT NULL,
    destino_uf CHAR(2) NOT NULL,
    data_carregamento DATE NOT NULL,
    hora_carregamento TIME,
    data_entrega DATE NOT NULL,
    hora_entrega TIME,
    tipo_veiculo VARCHAR(50) NOT NULL,
    tipo_carroceria VARCHAR(50) NOT NULL,
    tipo_carga ENUM('Seca', 'Refrigerada', 'Perigosa', 'Químico') NOT NULL,
    modelo_carga ENUM('Caixas', 'Maquinário', 'Sacarias', 'Ração', 'Roupa', 'Eletrônicos') NOT NULL,
    frete_combinar BOOLEAN DEFAULT FALSE,
    valor_ofertado DECIMAL(10,2),
    pedagio_incluso BOOLEAN DEFAULT FALSE,
    tipo_pagamento VARCHAR(50),
    fator_adiantamento VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transportadora_id) REFERENCES transportadoras(id) ON DELETE CASCADE,
    INDEX idx_transportadora_id (transportadora_id),
    INDEX idx_origem_uf (origem_uf),
    INDEX idx_destino_uf (destino_uf),
    INDEX idx_tipo_veiculo (tipo_veiculo),
    INDEX idx_data_carregamento (data_carregamento),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- EXEMPLO DE CÓDIGO PHP PARA CONEXÃO PDO
-- ============================================

/*
<?php
// config/database.php

class Database {
    private $host = "localhost";
    private $db_name = "fretelog";
    private $username = "root";
    private $password = "";
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4")
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Erro de conexão: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
*/

-- ============================================
-- EXEMPLO DE CADASTRO DE USUÁRIO (PHP)
-- ============================================

/*
<?php
// cadastro.php

require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();

    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $user_type = $_POST['user_type'];

    // Hash da senha
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    try {
        // Iniciar transação
        $db->beginTransaction();

        // Inserir usuário
        $query = "INSERT INTO users (email, password_hash, user_type) VALUES (:email, :password_hash, :user_type)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password_hash', $password_hash);
        $stmt->bindParam(':user_type', $user_type);
        $stmt->execute();

        $user_id = $db->lastInsertId();

        // Inserir dados específicos do tipo de usuário
        if ($user_type === 'transportadora') {
            $query = "INSERT INTO transportadoras (user_id, razao_social, cnpj, ie, telefone)
                      VALUES (:user_id, :razao_social, :cnpj, :ie, :telefone)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':razao_social', $_POST['razao_social']);
            $stmt->bindParam(':cnpj', $_POST['cnpj']);
            $stmt->bindParam(':ie', $_POST['ie']);
            $stmt->bindParam(':telefone', $_POST['telefone']);
            $stmt->execute();
        }
        // ... adicionar lógica para motorista e agenciador

        $db->commit();
        echo json_encode(['success' => true, 'message' => 'Cadastro realizado com sucesso!']);

    } catch(PDOException $e) {
        $db->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
*/

-- ============================================
-- EXEMPLO DE LOGIN (PHP)
-- ============================================

/*
<?php
// login.php

session_start();
require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();

    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['email'] = $user['email'];

            echo json_encode(['success' => true, 'user_type' => $user['user_type']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Senha incorreta']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    }
}
?>
*/

-- ============================================
-- EXEMPLO DE BUSCA DE OFERTAS (PHP)
-- ============================================

/*
<?php
// api/ofertas.php

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT o.*, t.razao_social
          FROM ofertas_carga o
          INNER JOIN transportadoras t ON o.transportadora_id = t.id
          ORDER BY o.created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$ofertas = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($ofertas);
?>
*/

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. SEMPRE use password_hash() e password_verify() para senhas
-- 2. SEMPRE use prepared statements (PDO) para prevenir SQL Injection
-- 3. SEMPRE valide e sanitize inputs do usuário
-- 4. Use transações para operações que envolvem múltiplas tabelas
-- 5. Configure índices para melhor performance
-- 6. Use HTTPS em produção
-- 7. Configure backup automático do banco de dados
-- 8. Implemente rate limiting nas APIs
-- 9. Use CSRF tokens em formulários
-- 10. Configure logs de erros e auditoria
