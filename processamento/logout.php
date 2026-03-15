<?php
require_once '../config/config.php';

// Remover sessão do banco de dados
if (isset($_SESSION['session_token'])) {
    try {
        $stmt = $pdo->prepare("DELETE FROM sessions WHERE session_token = ?");
        $stmt->execute([$_SESSION['session_token']]);
    } catch (PDOException $e) {
        error_log("Erro ao remover sessão: " . $e->getMessage());
    }
}

// Destruir sessão
session_unset();
session_destroy();

// Redirecionar para login
redirect('index.php?sucesso=logout');
