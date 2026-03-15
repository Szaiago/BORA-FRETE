-- ============================================
-- QUERIES ÚTEIS - SISTEMA FRETELOG
-- ============================================

-- ============================================
-- 1. CONSULTAS BÁSICAS
-- ============================================

-- Listar todas as transportadoras com seus dados de usuário
SELECT
    u.email,
    t.razao_social,
    t.cnpj,
    t.ie,
    t.telefone,
    t.created_at
FROM users u
INNER JOIN transportadoras t ON u.id = t.user_id
WHERE u.user_type = 'transportadora'
ORDER BY t.created_at DESC;

-- Listar todos os motoristas com suas habilitações
SELECT
    u.email,
    m.nome,
    m.cpf_cnpj,
    m.telefone,
    CASE WHEN m.cnh_c THEN 'CNH C' ELSE '' END AS cnh_c,
    CASE WHEN m.cnh_e THEN 'CNH E' ELSE '' END AS cnh_e,
    CASE WHEN m.curso_mopp THEN 'MOPP' ELSE '' END AS mopp
FROM users u
INNER JOIN motoristas m ON u.id = m.user_id
WHERE u.user_type = 'motorista'
ORDER BY m.created_at DESC;

-- Listar veículos de um motorista específico
SELECT
    v.tipo_veiculo,
    v.marca,
    v.ano,
    v.peso_ton,
    v.volume_m3,
    v.qtd_pallets,
    v.tipo_carroceria,
    v.placa_cavalo,
    v.placa_carreta1,
    v.placa_carreta2
FROM veiculos v
INNER JOIN motoristas m ON v.motorista_id = m.id
WHERE m.cpf_cnpj = '000.000.000-00' -- Substituir pelo CPF/CNPJ do motorista
ORDER BY v.created_at DESC;

-- ============================================
-- 2. OFERTAS DE CARGA
-- ============================================

-- Listar todas as ofertas ativas com dados da transportadora
SELECT
    o.id,
    t.razao_social AS transportadora,
    CONCAT(o.origem_cidade, '/', o.origem_uf) AS origem,
    CONCAT(o.destino_cidade, '/', o.destino_uf) AS destino,
    o.data_carregamento,
    o.data_entrega,
    o.tipo_veiculo,
    o.tipo_carroceria,
    o.tipo_carga,
    o.modelo_carga,
    CASE
        WHEN o.frete_combinar THEN 'A Combinar'
        ELSE CONCAT('R$ ', FORMAT(o.valor_ofertado, 2, 'pt_BR'))
    END AS valor,
    o.created_at
FROM ofertas_carga o
INNER JOIN transportadoras t ON o.transportadora_id = t.id
WHERE o.data_carregamento >= CURDATE()
ORDER BY o.created_at DESC;

-- Buscar ofertas por rota
SELECT
    o.id,
    t.razao_social,
    CONCAT(o.origem_cidade, '/', o.origem_uf, ' → ', o.destino_cidade, '/', o.destino_uf) AS rota,
    o.tipo_veiculo,
    o.valor_ofertado,
    o.frete_combinar
FROM ofertas_carga o
INNER JOIN transportadoras t ON o.transportadora_id = t.id
WHERE o.origem_uf = 'SP'
  AND o.destino_uf = 'RJ'
  AND o.data_carregamento >= CURDATE()
ORDER BY o.data_carregamento;

-- Ofertas por tipo de veículo
SELECT
    o.tipo_veiculo,
    COUNT(*) AS total_ofertas,
    AVG(o.valor_ofertado) AS valor_medio,
    MIN(o.valor_ofertado) AS valor_minimo,
    MAX(o.valor_ofertado) AS valor_maximo
FROM ofertas_carga o
WHERE o.frete_combinar = FALSE
  AND o.data_carregamento >= CURDATE()
GROUP BY o.tipo_veiculo
ORDER BY total_ofertas DESC;

-- Ofertas próximas ao vencimento (carregamento em até 3 dias)
SELECT
    t.razao_social,
    CONCAT(o.origem_cidade, '/', o.origem_uf, ' → ', o.destino_cidade, '/', o.destino_uf) AS rota,
    o.data_carregamento,
    DATEDIFF(o.data_carregamento, CURDATE()) AS dias_restantes,
    o.tipo_veiculo,
    o.valor_ofertado
FROM ofertas_carga o
INNER JOIN transportadoras t ON o.transportadora_id = t.id
WHERE o.data_carregamento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
ORDER BY o.data_carregamento;

-- ============================================
-- 3. RELATÓRIOS E ESTATÍSTICAS
-- ============================================

-- Total de usuários por tipo
SELECT
    user_type AS tipo,
    COUNT(*) AS total
FROM users
GROUP BY user_type
ORDER BY total DESC;

-- Transportadoras mais ativas (que mais postaram ofertas)
SELECT
    t.razao_social,
    t.cnpj,
    COUNT(o.id) AS total_ofertas,
    AVG(o.valor_ofertado) AS valor_medio_ofertado
FROM transportadoras t
LEFT JOIN ofertas_carga o ON t.id = o.transportadora_id
GROUP BY t.id
ORDER BY total_ofertas DESC
LIMIT 10;

-- Motoristas com mais veículos cadastrados
SELECT
    m.nome,
    m.telefone,
    COUNT(v.id) AS total_veiculos,
    CASE WHEN m.cnh_c THEN 'Sim' ELSE 'Não' END AS cnh_c,
    CASE WHEN m.cnh_e THEN 'Sim' ELSE 'Não' END AS cnh_e,
    CASE WHEN m.curso_mopp THEN 'Sim' ELSE 'Não' END AS mopp
FROM motoristas m
LEFT JOIN veiculos v ON m.id = v.motorista_id
GROUP BY m.id
ORDER BY total_veiculos DESC;

-- Rotas mais frequentes
SELECT
    CONCAT(origem_uf, ' → ', destino_uf) AS rota,
    COUNT(*) AS total_ofertas,
    AVG(valor_ofertado) AS valor_medio
FROM ofertas_carga
WHERE frete_combinar = FALSE
GROUP BY origem_uf, destino_uf
ORDER BY total_ofertas DESC
LIMIT 20;

-- Tipos de veículos mais demandados
SELECT
    tipo_veiculo,
    tipo_carroceria,
    COUNT(*) AS total_ofertas
FROM ofertas_carga
GROUP BY tipo_veiculo, tipo_carroceria
ORDER BY total_ofertas DESC;

-- Estatísticas mensais de ofertas
SELECT
    DATE_FORMAT(created_at, '%Y-%m') AS mes,
    COUNT(*) AS total_ofertas,
    SUM(CASE WHEN frete_combinar = FALSE THEN 1 ELSE 0 END) AS com_valor,
    SUM(CASE WHEN frete_combinar = TRUE THEN 1 ELSE 0 END) AS a_combinar,
    AVG(CASE WHEN frete_combinar = FALSE THEN valor_ofertado ELSE NULL END) AS valor_medio
FROM ofertas_carga
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY mes DESC;

-- ============================================
-- 4. FILTROS AVANÇADOS
-- ============================================

-- Buscar ofertas compatíveis com veículos de um motorista
SELECT DISTINCT
    o.id,
    t.razao_social,
    CONCAT(o.origem_cidade, '/', o.origem_uf, ' → ', o.destino_cidade, '/', o.destino_uf) AS rota,
    o.tipo_veiculo AS veiculo_necessario,
    o.tipo_carroceria,
    o.valor_ofertado,
    o.data_carregamento
FROM ofertas_carga o
INNER JOIN transportadoras t ON o.transportadora_id = t.id
INNER JOIN (
    SELECT DISTINCT tipo_veiculo, tipo_carroceria
    FROM veiculos v
    INNER JOIN motoristas m ON v.motorista_id = m.id
    WHERE m.cpf_cnpj = '000.000.000-00' -- Substituir pelo CPF/CNPJ
) AS veiculos_motorista
    ON o.tipo_veiculo = veiculos_motorista.tipo_veiculo
    AND (o.tipo_carroceria = veiculos_motorista.tipo_carroceria OR o.tipo_carroceria IS NULL)
WHERE o.data_carregamento >= CURDATE()
ORDER BY o.data_carregamento;

-- Ofertas com valor dentro de uma faixa
SELECT
    t.razao_social,
    CONCAT(o.origem_cidade, '/', o.origem_uf, ' → ', o.destino_cidade, '/', o.destino_uf) AS rota,
    o.tipo_veiculo,
    o.valor_ofertado,
    o.data_carregamento
FROM ofertas_carga o
INNER JOIN transportadoras t ON o.transportadora_id = t.id
WHERE o.frete_combinar = FALSE
  AND o.valor_ofertado BETWEEN 3000 AND 7000
  AND o.data_carregamento >= CURDATE()
ORDER BY o.valor_ofertado;

-- Ofertas de carga refrigerada
SELECT
    t.razao_social,
    CONCAT(o.origem_cidade, '/', o.origem_uf, ' → ', o.destino_cidade, '/', o.destino_uf) AS rota,
    o.tipo_veiculo,
    o.modelo_carga,
    o.valor_ofertado
FROM ofertas_carga o
INNER JOIN transportadoras t ON o.transportadora_id = t.id
WHERE o.tipo_carga = 'Refrigerada'
  AND o.data_carregamento >= CURDATE()
ORDER BY o.created_at DESC;

-- ============================================
-- 5. MANUTENÇÃO E LIMPEZA
-- ============================================

-- Deletar ofertas expiradas (mais de 30 dias após a data de entrega)
DELETE FROM ofertas_carga
WHERE data_entrega < DATE_SUB(CURDATE(), INTERVAL 30 DAY);

-- Encontrar usuários sem dados complementares
SELECT u.id, u.email, u.user_type
FROM users u
LEFT JOIN transportadoras t ON u.id = t.user_id
LEFT JOIN motoristas m ON u.id = m.user_id
LEFT JOIN agenciadores a ON u.id = a.user_id
WHERE t.id IS NULL AND m.id IS NULL AND a.id IS NULL;

-- Motoristas sem veículos cadastrados
SELECT
    m.nome,
    m.telefone,
    u.email,
    m.created_at
FROM motoristas m
INNER JOIN users u ON m.user_id = u.id
LEFT JOIN veiculos v ON m.id = v.motorista_id
WHERE v.id IS NULL
ORDER BY m.created_at DESC;

-- ============================================
-- 6. VALIDAÇÕES E INTEGRIDADE
-- ============================================

-- Verificar ofertas com datas inconsistentes
SELECT
    o.id,
    t.razao_social,
    o.data_carregamento,
    o.data_entrega,
    DATEDIFF(o.data_entrega, o.data_carregamento) AS dias_transporte
FROM ofertas_carga o
INNER JOIN transportadoras t ON o.transportadora_id = t.id
WHERE o.data_entrega < o.data_carregamento
ORDER BY o.created_at DESC;

-- Verificar ofertas sem valor e sem flag "a combinar"
SELECT
    o.id,
    t.razao_social,
    o.frete_combinar,
    o.valor_ofertado
FROM ofertas_carga o
INNER JOIN transportadoras t ON o.transportadora_id = t.id
WHERE o.frete_combinar = FALSE AND o.valor_ofertado IS NULL;

-- Verificar placas duplicadas
SELECT
    placa_cavalo,
    COUNT(*) AS total
FROM veiculos
WHERE placa_cavalo IS NOT NULL
GROUP BY placa_cavalo
HAVING COUNT(*) > 1;

-- ============================================
-- 7. PERFORMANCE E ÍNDICES
-- ============================================

-- Verificar uso de índices em uma query
EXPLAIN SELECT
    o.*
FROM ofertas_carga o
WHERE o.origem_uf = 'SP'
  AND o.data_carregamento >= CURDATE();

-- Analisar tamanho das tabelas
SELECT
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb,
    table_rows
FROM information_schema.TABLES
WHERE table_schema = 'fretelog'
ORDER BY (data_length + index_length) DESC;

-- ============================================
-- 8. BACKUP E EXPORTAÇÃO
-- ============================================

-- Exportar ofertas de um período específico (usar em linha de comando)
-- mysqldump -u root -p fretelog ofertas_carga --where="created_at >= '2026-01-01'" > ofertas_jan_2026.sql

-- Backup completo do banco (usar em linha de comando)
-- mysqldump -u root -p fretelog > fretelog_backup_$(date +%Y%m%d).sql

-- ============================================
-- 9. AUDITORIA
-- ============================================

-- Atividade recente do sistema (últimas 24 horas)
SELECT
    'Novos Usuários' AS atividade,
    COUNT(*) AS total
FROM users
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
UNION ALL
SELECT
    'Novas Ofertas',
    COUNT(*)
FROM ofertas_carga
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
UNION ALL
SELECT
    'Novos Veículos',
    COUNT(*)
FROM veiculos
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- Usuários que nunca fizeram login após cadastro (implementar tabela de logs)
-- Isso requer uma tabela adicional de logs de acesso

-- ============================================
-- 10. PROCEDURES ÚTEIS (MySQL)
-- ============================================

-- Procedure para limpar ofertas antigas
DELIMITER $$
CREATE PROCEDURE limpar_ofertas_antigas(dias INT)
BEGIN
    DELETE FROM ofertas_carga
    WHERE data_entrega < DATE_SUB(CURDATE(), INTERVAL dias DAY);

    SELECT ROW_COUNT() AS ofertas_deletadas;
END$$
DELIMITER ;

-- Uso: CALL limpar_ofertas_antigas(30);

-- Procedure para buscar ofertas por motorista
DELIMITER $$
CREATE PROCEDURE buscar_ofertas_para_motorista(motorista_cpf_cnpj VARCHAR(18))
BEGIN
    SELECT DISTINCT
        o.id,
        t.razao_social,
        CONCAT(o.origem_cidade, '/', o.origem_uf, ' → ', o.destino_cidade, '/', o.destino_uf) AS rota,
        o.tipo_veiculo,
        o.tipo_carroceria,
        CASE
            WHEN o.frete_combinar THEN 'A Combinar'
            ELSE CONCAT('R$ ', FORMAT(o.valor_ofertado, 2, 'pt_BR'))
        END AS valor,
        o.data_carregamento,
        o.data_entrega
    FROM ofertas_carga o
    INNER JOIN transportadoras t ON o.transportadora_id = t.id
    INNER JOIN (
        SELECT DISTINCT v.tipo_veiculo, v.tipo_carroceria
        FROM veiculos v
        INNER JOIN motoristas m ON v.motorista_id = m.id
        WHERE m.cpf_cnpj = motorista_cpf_cnpj
    ) AS veiculos_motorista
        ON o.tipo_veiculo = veiculos_motorista.tipo_veiculo
        AND (o.tipo_carroceria = veiculos_motorista.tipo_carroceria OR o.tipo_carroceria IS NULL)
    WHERE o.data_carregamento >= CURDATE()
    ORDER BY o.data_carregamento;
END$$
DELIMITER ;

-- Uso: CALL buscar_ofertas_para_motorista('000.000.000-00');
