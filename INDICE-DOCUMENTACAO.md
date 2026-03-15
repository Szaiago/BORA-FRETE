# Índice da Documentação - Sistema FreteLog

## 📋 Guia Rápido de Navegação

Este índice te ajuda a encontrar rapidamente a informação que você precisa.

---

## 🚀 Começando

### Para usar o sistema agora (Supabase)
1. Leia: **[README.md](README.md)** - Documentação principal
2. Execute: `npm install` e depois `npm run dev`
3. Acesse: `http://localhost:5173/login.html`

### Para migrar para PHP + MySQL
1. Leia: **[GUIA-MIGRACAO-PHP.md](GUIA-MIGRACAO-PHP.md)**
2. Execute: **[database-mysql.sql](database-mysql.sql)** no MySQL
3. Implemente os endpoints PHP conforme o guia

---

## 📚 Documentação por Assunto

### 🎯 Funcionalidades do Sistema

| Documento | O que você encontra |
|-----------|---------------------|
| **[README.md](README.md)** | Visão geral completa, todas as funcionalidades, como usar |
| **[RESUMO-EXECUTIVO.md](RESUMO-EXECUTIVO.md)** | Resumo técnico, estrutura do projeto, checklist |
| **[DOCUMENTACAO-VISUAL.md](DOCUMENTACAO-VISUAL.md)** | Wireframes, layouts, fluxos de navegação |

### 💾 Banco de Dados

| Documento | O que você encontra |
|-----------|---------------------|
| **[database-mysql.sql](database-mysql.sql)** | Schema MySQL completo, exemplos PHP, comentários |
| **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)** | Queries prontas, relatórios, estatísticas, procedures |

### 🔧 Desenvolvimento

| Documento | O que você encontra |
|-----------|---------------------|
| **[GUIA-MIGRACAO-PHP.md](GUIA-MIGRACAO-PHP.md)** | Migração para PHP, código completo, endpoints |
| **[README.md](README.md)** | Instalação, desenvolvimento, build |

---

## 🗂️ Estrutura dos Arquivos

### Páginas HTML (public/)
```
login.html              → Cadastro e login multi-perfil
dashboard.html          → Dashboard principal (todos os perfis)
veiculos.html           → Cadastro de veículos (motorista)
ofertas-carga.html      → Criar oferta de carga (transportadora)
minhas-ofertas.html     → Gerenciar ofertas (transportadora)
ofertas-disponiveis.html → Buscar fretes (motorista/agenciador)
```

### Scripts JavaScript (public/js/)
```
login.js                → Lógica de login/cadastro
dashboard.js            → Dashboard e navegação
veiculos.js             → CRUD de veículos
ofertas-carga.js        → Criar oferta
minhas-ofertas.js       → Listar/deletar ofertas
ofertas-disponiveis.js  → Buscar e filtrar fretes
supabase-config.js      → Configuração Supabase
```

---

## 🎓 Tutoriais por Tarefa

### Quero cadastrar um novo tipo de usuário
1. Abra: `public/login.html`
2. Veja a seção "Tab Cadastro" em: **[DOCUMENTACAO-VISUAL.md](DOCUMENTACAO-VISUAL.md)**
3. Código em: `public/js/login.js` (função `handleCadastro`)

### Quero adicionar um novo campo na oferta de carga
1. Leia estrutura em: **[README.md](README.md)** seção "Sistema de Oferta de Carga"
2. Adicione campo em: `public/ofertas-carga.html`
3. Modifique lógica em: `public/js/ofertas-carga.js`
4. Atualize tabela em: **[database-mysql.sql](database-mysql.sql)**

### Quero criar um relatório
1. Use queries prontas em: **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)**
2. Veja exemplos na seção "3. RELATÓRIOS E ESTATÍSTICAS"

### Quero entender o fluxo de um motorista
1. Veja wireframes em: **[DOCUMENTACAO-VISUAL.md](DOCUMENTACAO-VISUAL.md)**
2. Seção "Fluxos de Navegação" → "Motorista"
3. Ou leia: **[RESUMO-EXECUTIVO.md](RESUMO-EXECUTIVO.md)** seção "Fluxos Principais"

### Quero migrar para PHP
1. **PASSO 1**: Leia **[GUIA-MIGRACAO-PHP.md](GUIA-MIGRACAO-PHP.md)**
2. **PASSO 2**: Execute **[database-mysql.sql](database-mysql.sql)**
3. **PASSO 3**: Siga o "Checklist de Migração" no guia
4. **PASSO 4**: Use **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)** para testes

---

## 📖 Documentos Detalhados

### README.md
**O que tem:**
- Visão geral do sistema
- Tecnologias utilizadas
- Funcionalidades completas
- Estrutura do banco de dados
- Como usar o sistema
- Máscaras implementadas
- Validações
- Responsividade

**Quando usar:**
- Primeira leitura
- Referência geral
- Entender o sistema como um todo

---

### RESUMO-EXECUTIVO.md
**O que tem:**
- Resumo técnico conciso
- Estrutura do projeto
- Checklist de funcionalidades
- Relacionamentos do banco
- Próximos passos
- Observações importantes

**Quando usar:**
- Apresentação para stakeholders
- Visão rápida do projeto
- Checklist de implementação

---

### GUIA-MIGRACAO-PHP.md
**O que tem:**
- Código PHP completo para:
  - Conexão com banco (PDO)
  - Sistema de autenticação
  - CRUD de ofertas
  - CRUD de veículos
- Modificações nos arquivos JS
- Checklist de migração
- Segurança adicional
- Performance

**Quando usar:**
- Migrar para ambiente PHP tradicional
- Implementar em servidor Apache/Nginx
- Integrar com sistema PHP existente

---

### database-mysql.sql
**O que tem:**
- Schema completo MySQL
- Todas as tabelas com comentários
- Índices para performance
- Exemplos de código PHP
- Notas de segurança

**Quando usar:**
- Criar banco MySQL do zero
- Entender estrutura das tabelas
- Referência para relacionamentos
- Exemplos de código PHP

---

### QUERIES-UTEIS.sql
**O que tem:**
- 50+ queries prontas organizadas em:
  1. Consultas básicas
  2. Ofertas de carga
  3. Relatórios e estatísticas
  4. Filtros avançados
  5. Manutenção e limpeza
  6. Validações e integridade
  7. Performance e índices
  8. Backup e exportação
  9. Auditoria
  10. Procedures úteis

**Quando usar:**
- Criar relatórios
- Análise de dados
- Manutenção do banco
- Validações
- Auditorias

---

### DOCUMENTACAO-VISUAL.md
**O que tem:**
- Wireframes ASCII de todas as telas
- Paleta de cores
- Fluxos de navegação
- Estados visuais (hover, focus, etc)
- Responsividade por dispositivo
- Ícones e símbolos

**Quando usar:**
- Entender visualmente o sistema
- Apresentações
- Design review
- Implementar novas telas

---

## 🔍 Busca Rápida por Palavra-Chave

### Autenticação / Login
→ **[README.md](README.md)** seção "Sistema de Cadastro"
→ **[GUIA-MIGRACAO-PHP.md](GUIA-MIGRACAO-PHP.md)** seção "Sistema de Autenticação"
→ Código: `public/js/login.js`

### Veículos / Motorista
→ **[README.md](README.md)** seção "Perfil do Motorista"
→ **[DOCUMENTACAO-VISUAL.md](DOCUMENTACAO-VISUAL.md)** seção "Cadastro de Veículos"
→ Código: `public/js/veiculos.js`

### Ofertas de Carga / Transportadora
→ **[README.md](README.md)** seção "Módulo de Oferta de Carga"
→ **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)** seção "2. OFERTAS DE CARGA"
→ Código: `public/js/ofertas-carga.js`

### Banco de Dados / Tabelas
→ **[database-mysql.sql](database-mysql.sql)** - Schema completo
→ **[RESUMO-EXECUTIVO.md](RESUMO-EXECUTIVO.md)** seção "Banco de Dados"
→ **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)** - Queries prontas

### PHP / Migração
→ **[GUIA-MIGRACAO-PHP.md](GUIA-MIGRACAO-PHP.md)** - Guia completo
→ **[database-mysql.sql](database-mysql.sql)** - Schema MySQL

### Relatórios / Estatísticas
→ **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)** seção "3. RELATÓRIOS"

### Segurança / RLS
→ **[README.md](README.md)** seção "Segurança"
→ **[database-mysql.sql](database-mysql.sql)** - Veja comentários sobre segurança

### Responsividade / Design
→ **[DOCUMENTACAO-VISUAL.md](DOCUMENTACAO-VISUAL.md)** seção "Responsividade"
→ **[README.md](README.md)** seção "Visual e UX"

### Máscaras / Validações
→ **[README.md](README.md)** seção "Máscaras de Input Implementadas"
→ Código: `public/js/login.js` - veja final do arquivo

---

## 💡 Dicas

### Para desenvolvedores frontend
Foque em:
- **[DOCUMENTACAO-VISUAL.md](DOCUMENTACAO-VISUAL.md)** - Layouts e fluxos
- Arquivos em `public/` - HTML e JS

### Para desenvolvedores backend
Foque em:
- **[GUIA-MIGRACAO-PHP.md](GUIA-MIGRACAO-PHP.md)** - Código PHP
- **[database-mysql.sql](database-mysql.sql)** - Schema
- **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)** - Queries

### Para analistas de negócio
Foque em:
- **[RESUMO-EXECUTIVO.md](RESUMO-EXECUTIVO.md)** - Visão geral
- **[DOCUMENTACAO-VISUAL.md](DOCUMENTACAO-VISUAL.md)** - Fluxos

### Para DBAs
Foque em:
- **[database-mysql.sql](database-mysql.sql)** - Schema
- **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)** - Todas as seções

---

## 📞 Suporte

Para cada tipo de dúvida, consulte:

| Dúvida sobre... | Consulte... |
|----------------|-------------|
| Como funciona? | **[README.md](README.md)** |
| Como fica visualmente? | **[DOCUMENTACAO-VISUAL.md](DOCUMENTACAO-VISUAL.md)** |
| Como migrar para PHP? | **[GUIA-MIGRACAO-PHP.md](GUIA-MIGRACAO-PHP.md)** |
| Como fazer query X? | **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)** |
| Qual a estrutura? | **[RESUMO-EXECUTIVO.md](RESUMO-EXECUTIVO.md)** |
| Como criar tabelas? | **[database-mysql.sql](database-mysql.sql)** |

---

## ✅ Checklist de Leitura Recomendada

Se você é novo no projeto, siga esta ordem:

1. ☐ **[RESUMO-EXECUTIVO.md](RESUMO-EXECUTIVO.md)** (5 min) - Entenda o que foi criado
2. ☐ **[DOCUMENTACAO-VISUAL.md](DOCUMENTACAO-VISUAL.md)** (10 min) - Veja como funciona visualmente
3. ☐ **[README.md](README.md)** (15 min) - Aprenda todas as funcionalidades
4. ☐ Execute `npm run dev` e teste o sistema
5. ☐ **[database-mysql.sql](database-mysql.sql)** (10 min) - Entenda o banco de dados

Se for migrar para PHP:

6. ☐ **[GUIA-MIGRACAO-PHP.md](GUIA-MIGRACAO-PHP.md)** (30 min) - Migração completa
7. ☐ **[QUERIES-UTEIS.sql](QUERIES-UTEIS.sql)** (15 min) - Queries prontas

**Tempo total estimado: 45-85 minutos**

---

## 🎯 Conclusão

Toda a documentação necessária está aqui. Use este índice como ponto de partida para navegar pelos documentos.

**Boa sorte com seu sistema de logística!**
