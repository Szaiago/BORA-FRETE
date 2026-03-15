# Resumo Técnico - Sistema de Logística

## Arquivos Principais Entregues

### 1. **SQL de Criação das Tabelas**
📄 `database.sql`

Tabelas criadas:
- `users` - Usuários multi-perfil (Transportadora, Agenciador, Motorista)
- `veiculos` - Cadastro de veículos com lógica de placas
- `ofertas` - Ofertas de carga com campos condicionais
- `propostas` - Sistema de propostas/negociações
- `sessions` - Controle de sessões de usuário

Características:
- Suporte a CPF e CNPJ
- Campos para endereço completo com UF/Cidade
- Sistema de status para ofertas
- Relacionamentos com FOREIGN KEY
- Índices para otimização de consultas

---

### 2. **Arquivo de Configuração**
📄 `config/config.php`

Contém:
- Conexão PDO com MySQL
- Constantes do sistema (BASE_URL, DB_HOST, etc.)
- Funções auxiliares globais:
  - `isLoggedIn()` - Verificar autenticação
  - `requireLogin()` - Proteger páginas
  - `sanitizeInput()` - Sanitização de dados
  - `validaCPF()` e `validaCNPJ()` - Validação de documentos
  - `formatCPF()`, `formatCNPJ()`, `formatPhone()` - Formatação
  - `formatMoney()`, `formatDate()` - Formatação de valores

---

### 3. **Header com Menu Lateral**
📄 `views/layout/header.php`

Características:
- Menu lateral fixo (sidebar) com navegação completa
- Topbar com informações do usuário
- Sistema de menu ativo baseado na página atual
- Ícones Font Awesome
- Responsivo para mobile
- Avatar com iniciais do usuário

Páginas no menu:
- Dashboard
- Meu Perfil
- Cadastrar Veículo
- Cadastrar Oferta
- Meus Veículos
- Minhas Ofertas
- Buscar Fretes
- Propostas
- Sair

---

### 4. **Cadastro de Veículos com Lógica de Placas**
📄 `cadastro-veiculo.php` + `public/js/veiculo-placas.js`

**Lógica Implementada:**

| Tipo de Veículo | Campos de Placa Exibidos |
|----------------|-------------------------|
| Van / Truck / 3-4 / Toco | 1 campo (Cavalo) |
| Carreta / Bitrem | 2 campos (Cavalo + Carreta) |
| Rodotrem | 3 campos (Cavalo + Carreta + Carreta 2) |

**JavaScript (`veiculo-placas.js`):**
```javascript
// Monitora mudança no tipo de veículo
tipoVeiculoSelect.addEventListener('change', atualizarCamposPlaca);

function atualizarCamposPlaca() {
    switch(tipoSelecionado) {
        case 'van':
        case 'truck':
        case '3/4':
        case 'toco':
            // 1 campo
            break;
        case 'carreta':
        case 'bitrem':
            // 2 campos
            placaCarretaContainer.classList.remove('hidden');
            break;
        case 'rodotrem':
            // 3 campos
            placaCarretaContainer.classList.remove('hidden');
            placaCarreta2Container.classList.remove('hidden');
            break;
    }
}
```

Funcionalidades:
- Exibição dinâmica de campos
- Máscara automática de placa (ABC-1234)
- Validação antes do envio
- Campos required dinâmicos
- Suporte a placas Mercosul

---

### 5. **Arquivo de Processamento de Ofertas**
📄 `processamento/salvar-oferta.php`

Características:
- Recebe POST do formulário de cadastro
- Sanitiza todos os inputs
- Valida campos obrigatórios
- Tratamento especial para "Frete a Combinar"
- Conversão de tipos (float, int, date)
- Prepared Statements (proteção SQL Injection)
- Tratamento de erros com try/catch
- Redirecionamento com mensagens de sucesso/erro

Campos processados:
- Informações básicas (título, descrição)
- Origem e destino (UF/Cidade via IBGE)
- Detalhes da carga (tipo, peso, dimensões)
- Valores (frete fixo ou a combinar)
- Datas (coleta e entrega)
- Contato (nome, telefone, email)

---

## Arquivos Adicionais Importantes

### 6. **API do IBGE**
📄 `public/js/ibge-api.js`

Funções principais:
```javascript
IBGEAPI.carregarEstados(selectId)
IBGEAPI.carregarCidades(uf, selectId)
IBGEAPI.inicializarOrigem(ufSelectId, cidadeSelectId)
IBGEAPI.inicializarDestino(ufSelectId, cidadeSelectId)
IBGEAPI.buscarCEP(cep, callback)
```

Uso na página de oferta:
```javascript
IBGEAPI.inicializarOrigem('uf_origem', 'cidade_origem');
IBGEAPI.inicializarDestino('uf_destino', 'cidade_destino');
```

URL da API: `https://servicodados.ibge.gov.br/api/v1/localidades`

---

### 7. **Cadastro Multi-Perfil**
📄 `perfil.php` + `public/js/perfil-form.js`

**Switch CPF/CNPJ:**
```javascript
function atualizarCampoDocumento() {
    if (tipoSelecionado === 'cpf') {
        labelDocumento.textContent = 'CPF *';
        documentoInput.placeholder = '000.000.000-00';
        documentoInput.maxLength = 14;
        razaoSocialContainer.style.display = 'none';
    } else if (tipoSelecionado === 'cnpj') {
        labelDocumento.textContent = 'CNPJ *';
        documentoInput.placeholder = '00.000.000/0000-00';
        documentoInput.maxLength = 18;
        razaoSocialContainer.style.display = 'block';
    }
}
```

Tipos de perfil:
1. **Transportadora** - Empresa com frota
2. **Agenciador** - Intermediário
3. **Motorista** - Autônomo

Funcionalidades:
- Máscara automática CPF/CNPJ
- Validação client-side e server-side
- Campo "Razão Social" aparece apenas para CNPJ
- Busca automática de endereço por CEP
- Integração com API IBGE para UF/Cidade

---

### 8. **Formulário de Oferta com Campos Condicionais**
📄 `cadastro-oferta.php` + `public/js/oferta-form.js`

**Lógica "Frete a Combinar":**
```javascript
function toggleValorFrete() {
    if (freteACombinarCheck.checked) {
        valorFreteContainer.classList.add('hidden');
        valorFreteInput.removeAttribute('required');
        valorFreteInput.value = '';
    } else {
        valorFreteContainer.classList.remove('hidden');
        valorFreteInput.setAttribute('required', 'required');
    }
}
```

**Cálculo Automático de Cubagem:**
```javascript
function calcularCubagem() {
    const comprimento = parseFloat(comprimentoInput.value) || 0;
    const largura = parseFloat(larguraInput.value) || 0;
    const altura = parseFloat(alturaInput.value) || 0;

    if (comprimento > 0 && largura > 0 && altura > 0) {
        const cubagem = (comprimento * largura * altura).toFixed(2);
        cubagemInput.value = cubagem;
    }
}
```

Campos especiais:
- Checkbox "Frete a Combinar" oculta campo de valor
- Cubagem calculada automaticamente (C x L x A)
- Validação de datas (entrega >= coleta)
- Máscara de telefone automática
- Campos de UF/Cidade populados via IBGE

---

## Design Premium

### Paleta de Cores
```css
--primary-color: #0a2463 (Azul Marinho)
--primary-dark: #061638 (Azul Marinho Escuro)
--primary-light: #1e3a8a (Azul Marinho Claro)
--dark-color: #0f172a (Preto)
--white-color: #ffffff (Branco)
```

### Características Visuais
- Sidebar com gradiente azul marinho
- Cards com sombras suaves
- Hover states em todos os elementos interativos
- Animações CSS (fadeInUp, transitions)
- Responsivo (Grid Bootstrap 5)
- Tipografia Inter (Google Fonts)
- Ícones Font Awesome 6

---

## Segurança Implementada

1. **Autenticação:**
   - Senhas com `password_hash()` (bcrypt)
   - Sistema de sessões com tokens
   - Função `requireLogin()` protege páginas

2. **Proteção SQL Injection:**
   - PDO Prepared Statements em todas as queries
   - Binding de parâmetros

3. **Sanitização:**
   - `htmlspecialchars()` em todos os outputs
   - `sanitizeInput()` em todos os inputs
   - Validação server-side de CPF/CNPJ

4. **Headers de Segurança (.htaccess):**
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Referrer-Policy

---

## Estrutura de Arquivos Completa

```
/
├── config/
│   └── config.php
├── processamento/
│   ├── login.php
│   ├── logout.php
│   ├── salvar-perfil.php
│   ├── salvar-veiculo.php
│   └── salvar-oferta.php
├── views/
│   └── layout/
│       ├── header.php
│       └── footer.php
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── ibge-api.js
│       ├── veiculo-placas.js
│       ├── oferta-form.js
│       └── perfil-form.js
├── database.sql
├── .htaccess
├── .gitignore
├── README.md
├── RESUMO_TECNICO.md
├── index.php (Login)
├── dashboard.php
├── perfil.php
├── cadastro-veiculo.php
├── cadastro-oferta.php
├── meus-veiculos.php
└── minhas-ofertas.php
```

---

## Credenciais de Teste

**Usuário Administrador:**
- Email: `admin@fretebras.com.br`
- Senha: `admin123`

---

## Como Testar

1. Importar `database.sql` no MySQL
2. Configurar `config/config.php` com dados do banco
3. Acessar via navegador (PHP 7.4+)
4. Fazer login com credenciais acima
5. Testar fluxos:
   - Cadastro de veículo (testar Van, Carreta, Rodotrem)
   - Cadastro de oferta (testar com/sem frete a combinar)
   - Editar perfil
   - Visualizar listas

---

## Tecnologias Utilizadas

- **Backend:** PHP 7.4+ (Puro, sem frameworks)
- **Banco de Dados:** MySQL 5.7+ com PDO
- **Frontend:** JavaScript Vanilla (sem React/Node)
- **CSS:** Bootstrap 5 Grid + CSS Customizado
- **APIs:** IBGE Localidades + ViaCEP
- **Ícones:** Font Awesome 6
- **Fontes:** Google Fonts (Inter)

---

## Diferenciais Técnicos

✅ Arquitetura monolítica tradicional
✅ Zero dependências de frameworks JS
✅ PHP estruturado com PDO
✅ Separação clara de responsabilidades
✅ Código fatiado em múltiplos arquivos
✅ Validações client-side e server-side
✅ Design responsivo e premium
✅ Integração com APIs públicas
✅ Segurança robusta
✅ Performance otimizada
