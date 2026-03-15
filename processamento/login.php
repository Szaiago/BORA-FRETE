<?php
require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitizeInput($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';

    // Validações básicas
    if (empty($email) || empty($senha)) {
        redirect('index.php?erro=campos_vazios');
    }

    try {
        // Buscar usuário pelo email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch();

        if (!$usuario) {
            redirect('index.php?erro=credenciais_invalidas');
        }

        // Verificar senha
        if (!password_verify($senha, $usuario['senha'])) {
            redirect('index.php?erro=credenciais_invalidas');
        }

        // Verificar se está ativo
        if ($usuario['ativo'] != 1) {
            redirect('index.php?erro=usuario_inativo');
        }

        // Criar sessão
        $_SESSION['user_id'] = $usuario['id'];
        $_SESSION['nome_completo'] = $usuario['nome_completo'];
        $_SESSION['email'] = $usuario['email'];
        $_SESSION['tipo_perfil'] = $usuario['tipo_perfil'];
        $_SESSION['tipo_documento'] = $usuario['tipo_documento'];
        $_SESSION['documento'] = $usuario['documento'];

        // Gerar token de sessão
        $session_token = generateToken(32);
        $_SESSION['session_token'] = $session_token;

        // Registrar sessão no banco
        $stmt = $pdo->prepare("
            INSERT INTO sessions (user_id, session_token, ip_address, user_agent)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $usuario['id'],
            $session_token,
            $_SERVER['REMOTE_ADDR'] ?? null,
            $_SERVER['HTTP_USER_AGENT'] ?? null
        ]);

        // Redirecionar para dashboard
        redirect('dashboard.php');

    } catch (PDOException $e) {
        error_log("Erro no login: " . $e->getMessage());
        redirect('index.php?erro=sistema');
    }

} else {
    redirect('index.php');
}
