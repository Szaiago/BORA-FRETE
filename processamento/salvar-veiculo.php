<?php
require_once '../config/config.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Sanitizar e coletar dados do formulário
    $tipo_veiculo = sanitizeInput($_POST['tipo_veiculo'] ?? '');
    $tipo_carroceria = sanitizeInput($_POST['tipo_carroceria'] ?? '');
    $placa_cavalo = sanitizeInput($_POST['placa_cavalo'] ?? '');
    $placa_carreta = sanitizeInput($_POST['placa_carreta'] ?? '');
    $placa_carreta2 = sanitizeInput($_POST['placa_carreta2'] ?? '');
    $renavam_cavalo = sanitizeInput($_POST['renavam_cavalo'] ?? '');
    $renavam_carreta = sanitizeInput($_POST['renavam_carreta'] ?? '');
    $renavam_carreta2 = sanitizeInput($_POST['renavam_carreta2'] ?? '');
    $marca_cavalo = sanitizeInput($_POST['marca_cavalo'] ?? '');
    $modelo_cavalo = sanitizeInput($_POST['modelo_cavalo'] ?? '');
    $ano_fabricacao_cavalo = !empty($_POST['ano_fabricacao_cavalo']) ? intval($_POST['ano_fabricacao_cavalo']) : null;
    $ano_modelo_cavalo = !empty($_POST['ano_modelo_cavalo']) ? intval($_POST['ano_modelo_cavalo']) : null;
    $capacidade_peso = !empty($_POST['capacidade_peso']) ? floatval($_POST['capacidade_peso']) : null;
    $capacidade_volume = !empty($_POST['capacidade_volume']) ? floatval($_POST['capacidade_volume']) : null;
    $comprimento = !empty($_POST['comprimento']) ? floatval($_POST['comprimento']) : null;
    $largura = !empty($_POST['largura']) ? floatval($_POST['largura']) : null;
    $altura = !empty($_POST['altura']) ? floatval($_POST['altura']) : null;
    $antt = sanitizeInput($_POST['antt'] ?? '');
    $observacoes = sanitizeInput($_POST['observacoes'] ?? '');

    // Validações básicas
    if (empty($tipo_veiculo) || empty($tipo_carroceria) || empty($placa_cavalo)) {
        redirect('cadastro-veiculo.php?erro=campos_obrigatorios');
    }

    // Validação das placas baseado no tipo de veículo
    $requiredPlates = 1;
    if (in_array($tipo_veiculo, ['carreta', 'bitrem'])) {
        $requiredPlates = 2;
        if (empty($placa_carreta)) {
            redirect('cadastro-veiculo.php?erro=placa_carreta_obrigatoria');
        }
    } elseif ($tipo_veiculo === 'rodotrem') {
        $requiredPlates = 3;
        if (empty($placa_carreta) || empty($placa_carreta2)) {
            redirect('cadastro-veiculo.php?erro=placas_carretas_obrigatorias');
        }
    }

    try {
        // Verificar se a placa do cavalo já existe
        $stmt = $pdo->prepare("SELECT id FROM veiculos WHERE placa_cavalo = ? AND ativo = 1");
        $stmt->execute([$placa_cavalo]);
        if ($stmt->fetch()) {
            redirect('cadastro-veiculo.php?erro=placa_cavalo_existente');
        }

        // Verificar se a placa da carreta já existe (se aplicável)
        if (!empty($placa_carreta)) {
            $stmt = $pdo->prepare("SELECT id FROM veiculos WHERE (placa_carreta = ? OR placa_carreta2 = ?) AND ativo = 1");
            $stmt->execute([$placa_carreta, $placa_carreta]);
            if ($stmt->fetch()) {
                redirect('cadastro-veiculo.php?erro=placa_carreta_existente');
            }
        }

        // Inserir veículo no banco de dados
        $sql = "INSERT INTO veiculos (
            user_id, tipo_veiculo, tipo_carroceria,
            placa_cavalo, placa_carreta, placa_carreta2,
            renavam_cavalo, renavam_carreta, renavam_carreta2,
            marca_cavalo, modelo_cavalo,
            ano_fabricacao_cavalo, ano_modelo_cavalo,
            capacidade_peso, capacidade_volume,
            comprimento, largura, altura,
            antt, observacoes, ativo
        ) VALUES (
            ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?, ?,
            ?, ?, 1
        )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $_SESSION['user_id'],
            $tipo_veiculo,
            $tipo_carroceria,
            $placa_cavalo,
            $placa_carreta ?: null,
            $placa_carreta2 ?: null,
            $renavam_cavalo ?: null,
            $renavam_carreta ?: null,
            $renavam_carreta2 ?: null,
            $marca_cavalo ?: null,
            $modelo_cavalo ?: null,
            $ano_fabricacao_cavalo,
            $ano_modelo_cavalo,
            $capacidade_peso,
            $capacidade_volume,
            $comprimento,
            $largura,
            $altura,
            $antt ?: null,
            $observacoes ?: null
        ]);

        // Redirecionar com sucesso
        redirect('cadastro-veiculo.php?sucesso=1');

    } catch (PDOException $e) {
        error_log("Erro ao salvar veículo: " . $e->getMessage());
        redirect('cadastro-veiculo.php?erro=sistema');
    }

} else {
    redirect('cadastro-veiculo.php');
}
