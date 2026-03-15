-- ================================================================
-- SISTEMA DE LOGÍSTICA - ESTILO FRETEBRAS
-- Script SQL para criação das tabelas
-- ================================================================

-- Tabela de Usuários (Multi-Perfil)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_perfil ENUM('transportadora', 'agenciador', 'motorista') NOT NULL,
    tipo_documento ENUM('cpf', 'cnpj') NOT NULL,
    documento VARCHAR(18) NOT NULL UNIQUE,
    nome_completo VARCHAR(200) NOT NULL,
    razao_social VARCHAR(200),
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    celular VARCHAR(20),
    cep VARCHAR(10),
    endereco VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2),
    senha VARCHAR(255) NOT NULL,
    ativo TINYINT(1) DEFAULT 1,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_documento (documento),
    INDEX idx_email (email),
    INDEX idx_tipo_perfil (tipo_perfil)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Veículos
CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tipo_veiculo ENUM('van', 'truck', '3/4', 'toco', 'carreta', 'bitrem', 'rodotrem') NOT NULL,
    tipo_carroceria ENUM('bau', 'sider', 'graneleiro', 'cacamba', 'refrigerado', 'porta-container') NOT NULL,
    placa_cavalo VARCHAR(10) NOT NULL,
    placa_carreta VARCHAR(10),
    placa_carreta2 VARCHAR(10),
    renavam_cavalo VARCHAR(20),
    renavam_carreta VARCHAR(20),
    renavam_carreta2 VARCHAR(20),
    ano_fabricacao_cavalo INT,
    ano_modelo_cavalo INT,
    marca_cavalo VARCHAR(50),
    modelo_cavalo VARCHAR(50),
    capacidade_peso DECIMAL(10,2) COMMENT 'Capacidade em toneladas',
    capacidade_volume DECIMAL(10,2) COMMENT 'Capacidade em m³',
    comprimento DECIMAL(10,2) COMMENT 'Comprimento em metros',
    largura DECIMAL(10,2) COMMENT 'Largura em metros',
    altura DECIMAL(10,2) COMMENT 'Altura em metros',
    antt VARCHAR(50),
    observacoes TEXT,
    ativo TINYINT(1) DEFAULT 1,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_tipo_veiculo (tipo_veiculo),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Ofertas de Carga
CREATE TABLE IF NOT EXISTS ofertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tipo_oferta ENUM('carga_disponivel', 'frete_disponivel') NOT NULL DEFAULT 'carga_disponivel',
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,

    -- Origem
    cidade_origem VARCHAR(100) NOT NULL,
    uf_origem CHAR(2) NOT NULL,

    -- Destino
    cidade_destino VARCHAR(100) NOT NULL,
    uf_destino CHAR(2) NOT NULL,

    -- Detalhes da Carga
    tipo_carga VARCHAR(100),
    peso_total DECIMAL(10,2) COMMENT 'Peso em toneladas',
    valor_mercadoria DECIMAL(12,2),

    -- Dimensões
    quantidade_pallets INT,
    comprimento DECIMAL(10,2) COMMENT 'Comprimento em metros',
    largura DECIMAL(10,2) COMMENT 'Largura em metros',
    altura DECIMAL(10,2) COMMENT 'Altura em metros',
    cubagem DECIMAL(10,2) COMMENT 'Cubagem calculada em m³',

    -- Tipo de Carroceria Necessária
    tipo_carroceria_necessaria ENUM('bau', 'sider', 'graneleiro', 'cacamba', 'refrigerado', 'porta-container', 'qualquer'),

    -- Valores
    frete_a_combinar TINYINT(1) DEFAULT 0,
    valor_frete DECIMAL(12,2),

    -- Datas
    data_coleta DATE,
    data_entrega DATE,

    -- Status
    status ENUM('ativa', 'em_negociacao', 'finalizada', 'cancelada') DEFAULT 'ativa',

    -- Contato
    contato_nome VARCHAR(150),
    contato_telefone VARCHAR(20),
    contato_email VARCHAR(150),

    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_cidade_origem (cidade_origem),
    INDEX idx_cidade_destino (cidade_destino),
    INDEX idx_status (status),
    INDEX idx_tipo_oferta (tipo_oferta),
    INDEX idx_data_coleta (data_coleta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Propostas/Negociações
CREATE TABLE IF NOT EXISTS propostas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    oferta_id INT NOT NULL,
    user_id INT NOT NULL COMMENT 'Usuário que fez a proposta',
    veiculo_id INT,
    valor_proposta DECIMAL(12,2),
    mensagem TEXT,
    status ENUM('pendente', 'aceita', 'recusada', 'cancelada') DEFAULT 'pendente',
    data_proposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resposta TIMESTAMP NULL,

    FOREIGN KEY (oferta_id) REFERENCES ofertas(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE SET NULL,
    INDEX idx_oferta_id (oferta_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Sessões (para controle de login)
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir um usuário administrador padrão (senha: admin123)
INSERT INTO users (tipo_perfil, tipo_documento, documento, nome_completo, email, telefone, senha, ativo)
VALUES (
    'transportadora',
    'cnpj',
    '00.000.000/0001-00',
    'Administrador do Sistema',
    'admin@fretebras.com.br',
    '(11) 99999-9999',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    1
);
