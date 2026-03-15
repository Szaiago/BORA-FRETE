<?php
require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Verificar se é modo de edição ou cadastro
    $editMode = isset($_POST['edit_mode']) && $_POST['edit_mode'] == 1;

    if ($editMode) {
        requireLogin();
    }

    // Sanitizar e coletar dados do formulário
    $tipo_perfil = sanitizeInput($_POST['tipo_perfil'] ?? '');
    $tipo_documento = sanitizeInput($_POST['tipo_documento'] ?? '');
    $documento = preg_replace('/[^0-9]/', '', $_POST['documento'] ?? '');
    $nome_completo = sanitizeInput($_POST['nome_completo'] ?? '');
    $razao_social = sanitizeInput($_POST['razao_social'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $telefone = sanitizeInput($_POST['telefone'] ?? '');
    $celular = sanitizeInput($_POST['celular'] ?? '');
    $cep = sanitizeInput($_POST['cep'] ?? '');
    $endereco = sanitizeInput($_POST['endereco'] ?? '');
    $numero = sanitizeInput($_POST['numero'] ?? '');
    $complemento = sanitizeInput($_POST['complemento'] ?? '');
    $bairro = sanitizeInput($_POST['bairro'] ?? '');
    $cidade = sanitizeInput($_POST['cidade'] ?? '');
    $uf = sanitizeInput($_POST['uf'] ?? '');

    // Validações básicas
    if (empty($tipo_perfil) || empty($tipo_documento) || empty($documento) || empty($nome_completo) || empty($email) || empty($telefone)) {
        redirect('perfil.php?erro=campos_obrigatorios');
    }

    // Validar email
    if (!validaEmail($email)) {
        redirect('perfil.php?erro=email_invalido');
    }

    // Validar CPF ou CNPJ
    if ($tipo_documento === 'cpf') {
        if (!validaCPF($documento)) {
            redirect('perfil.php?erro=documento_invalido');
        }
        $documento_formatado = formatCPF($documento);
    } else if ($tipo_documento === 'cnpj') {
        if (!validaCNPJ($documento)) {
            redirect('perfil.php?erro=documento_invalido');
        }
        $documento_formatado = formatCNPJ($documento);
    } else {
        redirect('perfil.php?erro=tipo_documento_invalido');
    }

    try {
        if ($editMode) {
            // MODO EDIÇÃO - Atualizar perfil existente

            // Verificar se o email já existe (exceto o próprio usuário)
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $stmt->execute([$email, $_SESSION['user_id']]);
            if ($stmt->fetch()) {
                redirect('perfil.php?erro=email_existente');
            }

            // Atualizar dados
            $sql = "UPDATE users SET
                nome_completo = ?,
                razao_social = ?,
                email = ?,
                telefone = ?,
                celular = ?,
                cep = ?,
                endereco = ?,
                numero = ?,
                complemento = ?,
                bairro = ?,
                cidade = ?,
                uf = ?,
                ultima_atualizacao = CURRENT_TIMESTAMP
                WHERE id = ?
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $nome_completo,
                $razao_social ?: null,
                $email,
                $telefone,
                $celular ?: null,
                $cep ?: null,
                $endereco ?: null,
                $numero ?: null,
                $complemento ?: null,
                $bairro ?: null,
                $cidade ?: null,
                $uf ?: null,
                $_SESSION['user_id']
            ]);

            // Atualizar sessão
            $_SESSION['nome_completo'] = $nome_completo;
            $_SESSION['email'] = $email;

            redirect('perfil.php?sucesso=1');

        } else {
            // MODO CADASTRO - Criar novo usuário

            $senha = $_POST['senha'] ?? '';
            $confirmar_senha = $_POST['confirmar_senha'] ?? '';

            // Validar senhas
            if (empty($senha) || strlen($senha) < 6) {
                redirect('perfil.php?erro=senha_curta');
            }

            if ($senha !== $confirmar_senha) {
                redirect('perfil.php?erro=senhas_diferentes');
            }

            // Verificar se o email já existe
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                redirect('perfil.php?erro=email_existente');
            }

            // Verificar se o documento já existe
            $stmt = $pdo->prepare("SELECT id FROM users WHERE documento = ?");
            $stmt->execute([$documento]);
            if ($stmt->fetch()) {
                redirect('perfil.php?erro=documento_existente');
            }

            // Hash da senha
            $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

            // Inserir novo usuário
            $sql = "INSERT INTO users (
                tipo_perfil, tipo_documento, documento,
                nome_completo, razao_social, email, telefone, celular,
                cep, endereco, numero, complemento, bairro, cidade, uf,
                senha, ativo
            ) VALUES (
                ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?,
                ?, 1
            )";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $tipo_perfil,
                $tipo_documento,
                $documento_formatado,
                $nome_completo,
                $razao_social ?: null,
                $email,
                $telefone,
                $celular ?: null,
                $cep ?: null,
                $endereco ?: null,
                $numero ?: null,
                $complemento ?: null,
                $bairro ?: null,
                $cidade ?: null,
                $uf ?: null,
                $senha_hash
            ]);

            redirect('perfil.php?sucesso=1');
        }

    } catch (PDOException $e) {
        error_log("Erro ao salvar perfil: " . $e->getMessage());
        redirect('perfil.php?erro=sistema');
    }

} else {
    redirect('perfil.php');
}
