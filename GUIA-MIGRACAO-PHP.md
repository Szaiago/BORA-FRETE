# Guia de Migração para PHP + MySQL

Este guia explica como migrar o sistema atual (Supabase) para um ambiente PHP tradicional com MySQL.

## Estrutura de Arquivos PHP Recomendada

```
projeto/
├── config/
│   └── database.php          # Configuração PDO
├── api/
│   ├── cadastro.php          # Endpoint de cadastro
│   ├── login.php             # Endpoint de login
│   ├── logout.php            # Endpoint de logout
│   ├── ofertas.php           # CRUD de ofertas
│   └── veiculos.php          # CRUD de veículos
├── public/
│   ├── css/
│   │   └── style.css         # CSS customizado (opcional)
│   ├── js/
│   │   ├── login.js          # Manter os arquivos JS atuais
│   │   ├── dashboard.js
│   │   ├── veiculos.js
│   │   └── ofertas-carga.js
│   ├── login.html
│   ├── dashboard.html
│   └── ...                   # Demais arquivos HTML
├── database-mysql.sql        # Script de criação do banco
└── index.php                 # Ponto de entrada
```

## 1. Configuração do Banco de Dados

### database.php

```php
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
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            http_response_code(500);
            die(json_encode(['error' => 'Erro de conexão com o banco de dados']));
        }

        return $this->conn;
    }
}
```

## 2. Sistema de Autenticação

### api/cadastro.php

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $database = new Database();
    $db = $database->getConnection();

    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    $password = $data['password'];
    $user_type = $data['user_type'];

    if (!$email || !$password || !$user_type) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos']);
        exit;
    }

    // Hash da senha
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    try {
        $db->beginTransaction();

        // Inserir usuário
        $query = "INSERT INTO users (email, password_hash, user_type)
                  VALUES (:email, :password_hash, :user_type)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password_hash', $password_hash);
        $stmt->bindParam(':user_type', $user_type);
        $stmt->execute();

        $user_id = $db->lastInsertId();

        // Inserir dados específicos
        if ($user_type === 'transportadora') {
            $query = "INSERT INTO transportadoras (user_id, razao_social, cnpj, ie, telefone)
                      VALUES (:user_id, :razao_social, :cnpj, :ie, :telefone)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':razao_social', $data['razao_social']);
            $stmt->bindParam(':cnpj', $data['cnpj']);
            $stmt->bindParam(':ie', $data['ie']);
            $stmt->bindParam(':telefone', $data['telefone']);
            $stmt->execute();

        } elseif ($user_type === 'agenciador') {
            $query = "INSERT INTO agenciadores (user_id, nome, cpf_cnpj, tipo_documento, telefone)
                      VALUES (:user_id, :nome, :cpf_cnpj, :tipo_documento, :telefone)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':nome', $data['nome']);
            $stmt->bindParam(':cpf_cnpj', $data['cpf_cnpj']);
            $stmt->bindParam(':tipo_documento', $data['tipo_documento']);
            $stmt->bindParam(':telefone', $data['telefone']);
            $stmt->execute();

        } elseif ($user_type === 'motorista') {
            $query = "INSERT INTO motoristas (user_id, nome, cpf_cnpj, tipo_documento, telefone, cnh_c, cnh_e, curso_mopp)
                      VALUES (:user_id, :nome, :cpf_cnpj, :tipo_documento, :telefone, :cnh_c, :cnh_e, :curso_mopp)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':nome', $data['nome']);
            $stmt->bindParam(':cpf_cnpj', $data['cpf_cnpj']);
            $stmt->bindParam(':tipo_documento', $data['tipo_documento']);
            $stmt->bindParam(':telefone', $data['telefone']);
            $stmt->bindParam(':cnh_c', $data['cnh_c'] ? 1 : 0);
            $stmt->bindParam(':cnh_e', $data['cnh_e'] ? 1 : 0);
            $stmt->bindParam(':curso_mopp', $data['curso_mopp'] ? 1 : 0);
            $stmt->execute();
        }

        $db->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Cadastro realizado com sucesso',
            'user_id' => $user_id
        ]);

    } catch(PDOException $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
```

### api/login.php

```php
<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $database = new Database();
    $db = $database->getConnection();

    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
    $password = $data['password'];

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Email e senha são obrigatórios']);
        exit;
    }

    $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch();

        if (password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['email'] = $user['email'];

            // Gerar token (opcional, para JWT)
            $token = bin2hex(random_bytes(32));
            $_SESSION['token'] = $token;

            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'user_type' => $user['user_type']
                ],
                'session' => [
                    'token' => $token
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Senha incorreta']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Usuário não encontrado']);
    }
}
```

### api/logout.php

```php
<?php
session_start();
header('Content-Type: application/json');

session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logout realizado com sucesso']);
```

## 3. CRUD de Ofertas de Carga

### api/ofertas.php

```php
<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// GET - Listar ofertas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT o.*, t.razao_social
              FROM ofertas_carga o
              INNER JOIN transportadoras t ON o.transportadora_id = t.id
              ORDER BY o.created_at DESC";

    // Aplicar filtros se existirem
    if (isset($_GET['origem_uf'])) {
        $query .= " AND o.origem_uf = :origem_uf";
    }
    if (isset($_GET['destino_uf'])) {
        $query .= " AND o.destino_uf = :destino_uf";
    }
    if (isset($_GET['tipo_veiculo'])) {
        $query .= " AND o.tipo_veiculo = :tipo_veiculo";
    }

    $stmt = $db->prepare($query);

    if (isset($_GET['origem_uf'])) {
        $stmt->bindParam(':origem_uf', $_GET['origem_uf']);
    }
    if (isset($_GET['destino_uf'])) {
        $stmt->bindParam(':destino_uf', $_GET['destino_uf']);
    }
    if (isset($_GET['tipo_veiculo'])) {
        $stmt->bindParam(':tipo_veiculo', $_GET['tipo_veiculo']);
    }

    $stmt->execute();
    $ofertas = $stmt->fetchAll();

    echo json_encode($ofertas);
}

// POST - Criar oferta
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    // Buscar transportadora_id do usuário
    $query = "SELECT id FROM transportadoras WHERE user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $_SESSION['user_id']);
    $stmt->execute();
    $transportadora = $stmt->fetch();

    if (!$transportadora) {
        http_response_code(403);
        echo json_encode(['error' => 'Usuário não é uma transportadora']);
        exit;
    }

    $query = "INSERT INTO ofertas_carga (
        transportadora_id, origem_cidade, origem_uf, destino_cidade, destino_uf,
        data_carregamento, hora_carregamento, data_entrega, hora_entrega,
        tipo_veiculo, tipo_carroceria, tipo_carga, modelo_carga,
        frete_combinar, valor_ofertado, pedagio_incluso,
        tipo_pagamento, fator_adiantamento
    ) VALUES (
        :transportadora_id, :origem_cidade, :origem_uf, :destino_cidade, :destino_uf,
        :data_carregamento, :hora_carregamento, :data_entrega, :hora_entrega,
        :tipo_veiculo, :tipo_carroceria, :tipo_carga, :modelo_carga,
        :frete_combinar, :valor_ofertado, :pedagio_incluso,
        :tipo_pagamento, :fator_adiantamento
    )";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':transportadora_id', $transportadora['id']);
    $stmt->bindParam(':origem_cidade', $data['origem_cidade']);
    $stmt->bindParam(':origem_uf', $data['origem_uf']);
    $stmt->bindParam(':destino_cidade', $data['destino_cidade']);
    $stmt->bindParam(':destino_uf', $data['destino_uf']);
    $stmt->bindParam(':data_carregamento', $data['data_carregamento']);
    $stmt->bindParam(':hora_carregamento', $data['hora_carregamento']);
    $stmt->bindParam(':data_entrega', $data['data_entrega']);
    $stmt->bindParam(':hora_entrega', $data['hora_entrega']);
    $stmt->bindParam(':tipo_veiculo', $data['tipo_veiculo']);
    $stmt->bindParam(':tipo_carroceria', $data['tipo_carroceria']);
    $stmt->bindParam(':tipo_carga', $data['tipo_carga']);
    $stmt->bindParam(':modelo_carga', $data['modelo_carga']);
    $stmt->bindParam(':frete_combinar', $data['frete_combinar'] ? 1 : 0);
    $stmt->bindParam(':valor_ofertado', $data['valor_ofertado']);
    $stmt->bindParam(':pedagio_incluso', $data['pedagio_incluso'] ? 1 : 0);
    $stmt->bindParam(':tipo_pagamento', $data['tipo_pagamento']);
    $stmt->bindParam(':fator_adiantamento', $data['fator_adiantamento']);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Oferta criada com sucesso',
            'id' => $db->lastInsertId()
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao criar oferta']);
    }
}

// DELETE - Deletar oferta
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        exit;
    }

    $oferta_id = $_GET['id'] ?? null;

    if (!$oferta_id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID da oferta é obrigatório']);
        exit;
    }

    // Verificar se a oferta pertence ao usuário
    $query = "SELECT o.id FROM ofertas_carga o
              INNER JOIN transportadoras t ON o.transportadora_id = t.id
              WHERE o.id = :oferta_id AND t.user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':oferta_id', $oferta_id);
    $stmt->bindParam(':user_id', $_SESSION['user_id']);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(['error' => 'Você não tem permissão para deletar esta oferta']);
        exit;
    }

    $query = "DELETE FROM ofertas_carga WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $oferta_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Oferta deletada com sucesso']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao deletar oferta']);
    }
}
```

## 4. Modificações nos Arquivos JavaScript

### Substituir chamadas Supabase por chamadas fetch

**Exemplo - login.js:**

```javascript
// ANTES (Supabase)
const { data, error } = await window.supabase.auth.signInWithPassword({
  email,
  password
});

// DEPOIS (PHP)
const response = await fetch('/api/login.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
});

const data = await response.json();

if (data.success) {
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('token', data.session.token);
  window.location.href = '/dashboard.html';
} else {
  showMessage(data.error, 'error');
}
```

## 5. Checklist de Migração

- [ ] Instalar MySQL e criar o banco de dados
- [ ] Executar o script `database-mysql.sql`
- [ ] Criar a pasta `api/` e os endpoints PHP
- [ ] Criar `config/database.php` com suas credenciais
- [ ] Configurar servidor PHP (Apache/Nginx)
- [ ] Atualizar todos os arquivos `.js` para usar fetch ao invés de Supabase
- [ ] Implementar sistema de sessões PHP
- [ ] Configurar CORS se necessário
- [ ] Testar todos os fluxos (cadastro, login, CRUD)
- [ ] Implementar validações server-side adicionais
- [ ] Configurar HTTPS em produção
- [ ] Implementar rate limiting
- [ ] Configurar backup do banco de dados

## 6. Segurança Adicional

### .htaccess (Apache)

```apache
# Prevenir acesso direto a arquivos PHP da config
<Files "database.php">
    Order Allow,Deny
    Deny from all
</Files>

# Habilitar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Validações Server-Side

Sempre valide TODOS os dados no servidor, nunca confie apenas em validações client-side.

## 7. Performance

- Use cache (Redis, Memcached)
- Implemente paginação nas listagens
- Otimize queries com EXPLAIN
- Configure índices apropriados
- Use CDN para assets estáticos

## Conclusão

Esta migração mantém toda a funcionalidade do sistema, substituindo apenas a camada de backend Supabase por PHP + MySQL tradicional.
