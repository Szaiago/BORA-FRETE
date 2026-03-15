<?php
require_once '../config/config.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Sanitizar e coletar dados do formulário
    $titulo = sanitizeInput($_POST['titulo'] ?? '');
    $descricao = sanitizeInput($_POST['descricao'] ?? '');
    $uf_origem = sanitizeInput($_POST['uf_origem'] ?? '');
    $cidade_origem = sanitizeInput($_POST['cidade_origem'] ?? '');
    $uf_destino = sanitizeInput($_POST['uf_destino'] ?? '');
    $cidade_destino = sanitizeInput($_POST['cidade_destino'] ?? '');
    $tipo_carga = sanitizeInput($_POST['tipo_carga'] ?? '');
    $tipo_carroceria_necessaria = sanitizeInput($_POST['tipo_carroceria_necessaria'] ?? '');
    $peso_total = !empty($_POST['peso_total']) ? floatval($_POST['peso_total']) : null;
    $valor_mercadoria = !empty($_POST['valor_mercadoria']) ? floatval($_POST['valor_mercadoria']) : null;
    $quantidade_pallets = !empty($_POST['quantidade_pallets']) ? intval($_POST['quantidade_pallets']) : null;
    $cubagem = !empty($_POST['cubagem']) ? floatval($_POST['cubagem']) : null;
    $comprimento = !empty($_POST['comprimento']) ? floatval($_POST['comprimento']) : null;
    $largura = !empty($_POST['largura']) ? floatval($_POST['largura']) : null;
    $altura = !empty($_POST['altura']) ? floatval($_POST['altura']) : null;
    $frete_a_combinar = isset($_POST['frete_a_combinar']) ? 1 : 0;
    $valor_frete = !empty($_POST['valor_frete']) ? floatval($_POST['valor_frete']) : null;
    $data_coleta = !empty($_POST['data_coleta']) ? $_POST['data_coleta'] : null;
    $data_entrega = !empty($_POST['data_entrega']) ? $_POST['data_entrega'] : null;
    $contato_nome = sanitizeInput($_POST['contato_nome'] ?? '');
    $contato_telefone = sanitizeInput($_POST['contato_telefone'] ?? '');
    $contato_email = sanitizeInput($_POST['contato_email'] ?? '');
    $observacoes = sanitizeInput($_POST['observacoes'] ?? '');

    // Validações básicas
    if (empty($titulo) || empty($uf_origem) || empty($cidade_origem) || empty($uf_destino) || empty($cidade_destino) || empty($tipo_carga) || empty($tipo_carroceria_necessaria)) {
        redirect('cadastro-oferta.php?erro=campos_obrigatorios');
    }

    // Validar valor do frete se não for "a combinar"
    if ($frete_a_combinar == 0 && (empty($valor_frete) || $valor_frete <= 0)) {
        redirect('cadastro-oferta.php?erro=valor_frete_invalido');
    }

    // Se for "a combinar", zerar o valor do frete
    if ($frete_a_combinar == 1) {
        $valor_frete = null;
    }

    try {
        // Inserir oferta no banco de dados
        $sql = "INSERT INTO ofertas (
            user_id, tipo_oferta, titulo, descricao,
            cidade_origem, uf_origem, cidade_destino, uf_destino,
            tipo_carga, peso_total, valor_mercadoria,
            quantidade_pallets, comprimento, largura, altura, cubagem,
            tipo_carroceria_necessaria,
            frete_a_combinar, valor_frete,
            data_coleta, data_entrega,
            contato_nome, contato_telefone, contato_email,
            observacoes, status
        ) VALUES (
            ?, 'carga_disponivel', ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?,
            ?, ?,
            ?, ?,
            ?, ?, ?,
            ?, 'ativa'
        )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $_SESSION['user_id'],
            $titulo,
            $descricao ?: null,
            $cidade_origem,
            $uf_origem,
            $cidade_destino,
            $uf_destino,
            $tipo_carga,
            $peso_total,
            $valor_mercadoria,
            $quantidade_pallets,
            $comprimento,
            $largura,
            $altura,
            $cubagem,
            $tipo_carroceria_necessaria,
            $frete_a_combinar,
            $valor_frete,
            $data_coleta,
            $data_entrega,
            $contato_nome ?: null,
            $contato_telefone ?: null,
            $contato_email ?: null,
            $observacoes ?: null
        ]);

        // Redirecionar com sucesso
        redirect('cadastro-oferta.php?sucesso=1');

    } catch (PDOException $e) {
        error_log("Erro ao salvar oferta: " . $e->getMessage());
        redirect('cadastro-oferta.php?erro=sistema');
    }

} else {
    redirect('cadastro-oferta.php');
}
