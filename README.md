# Sistema de Logística - Estilo Fretebras

Sistema completo de gestão logística desenvolvido em **PHP Puro** com **JavaScript Vanilla**, seguindo arquitetura monolítica tradicional.

## Características Principais

### Tecnologias
- PHP 7.4+ (PDO para banco de dados)
- MySQL 5.7+
- JavaScript Vanilla (sem frameworks)
- Bootstrap 5 (apenas Grid e componentes básicos)
- CSS Customizado (design premium)

### Funcionalidades
- **Multi-Perfil**: Transportadora, Agenciador e Motorista
- **Cadastro de Veículos**: Lógica dinâmica de placas (Van, Truck, Carreta, Rodotrem)
- **Cadastro de Ofertas**: Campos condicionais e integração com API do IBGE
- **Gestão Completa**: Dashboard, listagens, propostas
- **Autenticação Segura**: Sistema de login com sessões
- **Design Premium**: Interface moderna com Azul Marinho, Preto e Branco

## Estrutura de Pastas

```
/
├── config/
│   └── config.php              # Configurações e conexão PDO
├── processamento/
│   ├── login.php               # Processamento de login
│   ├── logout.php              # Processamento de logout
│   ├── salvar-perfil.php       # Processamento de cadastro/edição
│   ├── salvar-veiculo.php      # Processamento de veículos
│   └── salvar-oferta.php       # Processamento de ofertas
├── views/
│   ├── layout/
│   │   ├── header.php          # Header com menu lateral
│   │   └── footer.php          # Footer
│   └── modais/                 # Modais separados (futuro)
├── public/
│   ├── css/
│   │   └── style.css           # Estilos customizados
│   └── js/
│       ├── ibge-api.js         # Integração com API do IBGE
│       ├── veiculo-placas.js   # Lógica de placas dinâmicas
│       ├── oferta-form.js      # Lógica do formulário de oferta
│       └── perfil-form.js      # Lógica do formulário de perfil
├── database.sql                # Script de criação do banco
├── index.php                   # Página de login
├── dashboard.php               # Dashboard principal
├── perfil.php                  # Cadastro/Edição de perfil
├── cadastro-veiculo.php        # Cadastro de veículos
└── cadastro-oferta.php         # Cadastro de ofertas
```

## Instalação

### 1. Requisitos
- Apache 2.4+ ou Nginx
- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Extensões PHP: PDO, PDO_MySQL

### 2. Configuração do Banco de Dados

Crie um banco de dados MySQL:

```sql
CREATE DATABASE logistica_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Importe o arquivo `database.sql`:

```bash
mysql -u root -p logistica_db < database.sql
```

### 3. Configuração do Sistema

Edite o arquivo `config/config.php` e ajuste as configurações:

```php
// Configurações de Banco de Dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'logistica_db');
define('DB_USER', 'root');
define('DB_PASS', 'sua_senha');

// URL Base do Sistema
define('BASE_URL', 'http://localhost:8000');
```

### 4. Permissões

Configure as permissões adequadas:

```bash
chmod -R 755 /caminho/do/projeto
chmod -R 777 /caminho/do/projeto/public
```

### 5. Servidor Web

#### Apache
Configure o VirtualHost ou use o `.htaccess`:

```apache
<VirtualHost *:80>
    DocumentRoot "/caminho/do/projeto"
    ServerName logistica.local

    <Directory "/caminho/do/projeto">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### PHP Built-in Server (Desenvolvimento)
```bash
php -S localhost:8000
```

## Credenciais Padrão

- **Email**: admin@fretebras.com.br
- **Senha**: admin123

## Funcionalidades Detalhadas

### Cadastro Multi-Perfil

O sistema suporta 3 tipos de perfil:
- **Transportadora**: Empresa com frota de veículos
- **Agenciador**: Intermediário de cargas
- **Motorista**: Motorista autônomo

Cada perfil pode ser CPF ou CNPJ, com validações automáticas.

### Cadastro de Veículos

Lógica inteligente de placas baseada no tipo:
- **Van/Truck/3-4/Toco**: 1 campo de placa
- **Carreta/Bitrem**: 2 campos (Cavalo + Carreta)
- **Rodotrem**: 3 campos (Cavalo + Carreta + Carreta 2)

Os campos são exibidos/ocultados automaticamente via JavaScript.

### Cadastro de Ofertas

Integração com API do IBGE:
- Preenchimento automático de UF e Cidades
- Validação de origem e destino
- Campos condicionais:
  - "Frete a Combinar" oculta campo de valor
  - Cálculo automático de cubagem (C x L x A)
  - Validação de datas (entrega >= coleta)

### API do IBGE

Arquivo `public/js/ibge-api.js` fornece:
- `carregarEstados()`: Carrega todos os estados
- `carregarCidades(uf, selectId)`: Carrega cidades por estado
- `buscarCEP()`: Busca endereço por CEP (ViaCEP)

## Segurança

- Senhas criptografadas com `password_hash()`
- Proteção contra SQL Injection (PDO Prepared Statements)
- Sanitização de inputs (`htmlspecialchars`)
- Validação de CPF/CNPJ server-side e client-side
- Sistema de sessões seguro
- Proteção de páginas autenticadas

## Customização

### Cores do Sistema

Edite as variáveis CSS em `public/css/style.css`:

```css
:root {
    --primary-color: #0a2463;
    --primary-dark: #061638;
    --primary-light: #1e3a8a;
    --secondary-color: #1d4ed8;
    --accent-color: #3b82f6;
}
```

### Adicionando Novas Páginas

1. Crie o arquivo PHP na raiz
2. Inclua `config/config.php`
3. Use `requireLogin()` se necessário autenticação
4. Inclua header e footer:

```php
<?php
require_once 'config/config.php';
requireLogin();

$pageTitle = 'Minha Página';
$showSidebar = true;

include 'views/layout/header.php';
?>

<!-- Seu conteúdo aqui -->

<?php include 'views/layout/footer.php'; ?>
```

## Suporte e Desenvolvimento

Sistema desenvolvido como arquitetura monolítica tradicional, focado em:
- Performance
- Simplicidade
- Manutenibilidade
- Escalabilidade vertical

## Próximas Implementações Sugeridas

- [ ] Listagem de veículos (meus-veiculos.php)
- [ ] Listagem de ofertas (minhas-ofertas.php)
- [ ] Busca de fretes (buscar-fretes.php)
- [ ] Sistema de propostas (propostas.php)
- [ ] Upload de documentos
- [ ] Sistema de notificações
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] API RESTful para integração mobile

## Licença

Sistema proprietário - Todos os direitos reservados.
