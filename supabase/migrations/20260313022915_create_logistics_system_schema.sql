/*
  # Sistema de Logística - Schema Completo

  ## Tabelas Criadas
  
  ### 1. users
  - `id` (uuid, PK) - ID único do usuário
  - `email` (text) - Email único
  - `password_hash` (text) - Senha criptografada
  - `user_type` (text) - Tipo: transportadora, agenciador, motorista
  - `created_at` (timestamptz) - Data de criação
  
  ### 2. transportadoras
  - `id` (uuid, PK)
  - `user_id` (uuid, FK) - Referência ao usuário
  - `razao_social` (text)
  - `cnpj` (text)
  - `ie` (text) - Inscrição Estadual
  - `telefone` (text)
  
  ### 3. agenciadores
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `nome` (text)
  - `cpf_cnpj` (text)
  - `tipo_documento` (text) - CPF ou CNPJ
  - `telefone` (text)
  
  ### 4. motoristas
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `nome` (text)
  - `cpf_cnpj` (text)
  - `tipo_documento` (text)
  - `telefone` (text)
  - `cnh_c` (boolean) - Habilitação CNH C
  - `cnh_e` (boolean) - Habilitação CNH E
  - `curso_mopp` (boolean) - Curso MOPP
  
  ### 5. veiculos
  - `id` (uuid, PK)
  - `motorista_id` (uuid, FK)
  - `tipo_veiculo` (text) - Van, Fiorino, 3/4, Toco, Truck, Carreta, Rodotrem
  - `marca` (text)
  - `ano` (integer)
  - `foto_url` (text)
  - `peso_ton` (decimal)
  - `volume_m3` (decimal)
  - `qtd_pallets` (integer)
  - `placa_cavalo` (text)
  - `placa_carreta1` (text)
  - `placa_carreta2` (text)
  - `tipo_carroceria` (text) - Baú, Sider, Aberta, etc
  
  ### 6. ofertas_carga
  - `id` (uuid, PK)
  - `transportadora_id` (uuid, FK)
  - `origem_cidade` (text)
  - `origem_uf` (text)
  - `destino_cidade` (text)
  - `destino_uf` (text)
  - `data_carregamento` (date)
  - `hora_carregamento` (time)
  - `data_entrega` (date)
  - `hora_entrega` (time)
  - `tipo_veiculo` (text)
  - `tipo_carroceria` (text)
  - `tipo_carga` (text) - Seca, Refrigerada, Perigosa, Químico
  - `modelo_carga` (text) - Caixas, Maquinário, Sacarias, etc
  - `frete_combinar` (boolean)
  - `valor_ofertado` (decimal)
  - `pedagio_incluso` (boolean)
  - `tipo_pagamento` (text)
  - `fator_adiantamento` (text)
  - `created_at` (timestamptz)

  ## Segurança
  - RLS habilitado em todas as tabelas
  - Políticas para cada perfil de usuário
*/

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('transportadora', 'agenciador', 'motorista')),
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de transportadoras
CREATE TABLE IF NOT EXISTS transportadoras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  razao_social text NOT NULL,
  cnpj text NOT NULL,
  ie text NOT NULL,
  telefone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de agenciadores
CREATE TABLE IF NOT EXISTS agenciadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  cpf_cnpj text NOT NULL,
  tipo_documento text NOT NULL CHECK (tipo_documento IN ('CPF', 'CNPJ')),
  telefone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de motoristas
CREATE TABLE IF NOT EXISTS motoristas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  cpf_cnpj text NOT NULL,
  tipo_documento text NOT NULL CHECK (tipo_documento IN ('CPF', 'CNPJ')),
  telefone text NOT NULL,
  cnh_c boolean DEFAULT false,
  cnh_e boolean DEFAULT false,
  curso_mopp boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de veículos
CREATE TABLE IF NOT EXISTS veiculos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motorista_id uuid REFERENCES motoristas(id) ON DELETE CASCADE NOT NULL,
  tipo_veiculo text NOT NULL CHECK (tipo_veiculo IN ('Van', 'Fiorino', '3/4', 'Toco', 'Truck', 'Carreta', 'Rodotrem')),
  marca text NOT NULL,
  ano integer NOT NULL,
  foto_url text,
  peso_ton decimal(10,2) NOT NULL,
  volume_m3 decimal(10,2) NOT NULL,
  qtd_pallets integer NOT NULL,
  placa_cavalo text,
  placa_carreta1 text,
  placa_carreta2 text,
  tipo_carroceria text CHECK (tipo_carroceria IN ('Baú', 'Sider', 'Aberta', 'Graneleira', 'Container', 'Frigorífica', 'Tanque', 'Plataforma')),
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de ofertas de carga
CREATE TABLE IF NOT EXISTS ofertas_carga (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transportadora_id uuid REFERENCES transportadoras(id) ON DELETE CASCADE NOT NULL,
  origem_cidade text NOT NULL,
  origem_uf text NOT NULL,
  destino_cidade text NOT NULL,
  destino_uf text NOT NULL,
  data_carregamento date NOT NULL,
  hora_carregamento time,
  data_entrega date NOT NULL,
  hora_entrega time,
  tipo_veiculo text NOT NULL,
  tipo_carroceria text NOT NULL,
  tipo_carga text NOT NULL CHECK (tipo_carga IN ('Seca', 'Refrigerada', 'Perigosa', 'Químico')),
  modelo_carga text NOT NULL CHECK (modelo_carga IN ('Caixas', 'Maquinário', 'Sacarias', 'Ração', 'Roupa', 'Eletrônicos')),
  frete_combinar boolean DEFAULT false,
  valor_ofertado decimal(10,2),
  pedagio_incluso boolean DEFAULT false,
  tipo_pagamento text,
  fator_adiantamento text,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportadoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenciadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE motoristas ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas_carga ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Usuários podem ver próprio perfil"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas para transportadoras
CREATE POLICY "Transportadoras podem ver próprios dados"
  ON transportadoras FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Transportadoras podem inserir próprios dados"
  ON transportadoras FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Transportadoras podem atualizar próprios dados"
  ON transportadoras FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para agenciadores
CREATE POLICY "Agenciadores podem ver próprios dados"
  ON agenciadores FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Agenciadores podem inserir próprios dados"
  ON agenciadores FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Agenciadores podem atualizar próprios dados"
  ON agenciadores FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para motoristas
CREATE POLICY "Motoristas podem ver próprios dados"
  ON motoristas FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Motoristas podem inserir próprios dados"
  ON motoristas FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Motoristas podem atualizar próprios dados"
  ON motoristas FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para veículos
CREATE POLICY "Motoristas podem ver próprios veículos"
  ON veiculos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM motoristas
      WHERE motoristas.id = veiculos.motorista_id
      AND motoristas.user_id = auth.uid()
    )
  );

CREATE POLICY "Motoristas podem inserir próprios veículos"
  ON veiculos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM motoristas
      WHERE motoristas.id = veiculos.motorista_id
      AND motoristas.user_id = auth.uid()
    )
  );

CREATE POLICY "Motoristas podem atualizar próprios veículos"
  ON veiculos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM motoristas
      WHERE motoristas.id = veiculos.motorista_id
      AND motoristas.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM motoristas
      WHERE motoristas.id = veiculos.motorista_id
      AND motoristas.user_id = auth.uid()
    )
  );

CREATE POLICY "Motoristas podem deletar próprios veículos"
  ON veiculos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM motoristas
      WHERE motoristas.id = veiculos.motorista_id
      AND motoristas.user_id = auth.uid()
    )
  );

-- Políticas para ofertas de carga
CREATE POLICY "Transportadoras podem ver próprias ofertas"
  ON ofertas_carga FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM transportadoras
      WHERE transportadoras.id = ofertas_carga.transportadora_id
      AND transportadoras.user_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem ver ofertas publicadas"
  ON ofertas_carga FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Transportadoras podem inserir ofertas"
  ON ofertas_carga FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM transportadoras
      WHERE transportadoras.id = ofertas_carga.transportadora_id
      AND transportadoras.user_id = auth.uid()
    )
  );

CREATE POLICY "Transportadoras podem atualizar próprias ofertas"
  ON ofertas_carga FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM transportadoras
      WHERE transportadoras.id = ofertas_carga.transportadora_id
      AND transportadoras.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM transportadoras
      WHERE transportadoras.id = ofertas_carga.transportadora_id
      AND transportadoras.user_id = auth.uid()
    )
  );

CREATE POLICY "Transportadoras podem deletar próprias ofertas"
  ON ofertas_carga FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM transportadoras
      WHERE transportadoras.id = ofertas_carga.transportadora_id
      AND transportadoras.user_id = auth.uid()
    )
  );