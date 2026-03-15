# Documentação Visual do Sistema FreteLog

## Paleta de Cores

- **Azul Marinho**: `#001f3f` - Elementos principais, botões, sidebar
- **Preto**: `#000000` - Textos principais
- **Branco**: `#ffffff` - Backgrounds, textos em áreas escuras
- **Cinza Executivo**: `#4a5568` - Textos secundários, subtítulos

---

## 1. Tela de Login/Cadastro

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║                      FreteLog                            ║
║              Sistema de Logística Integrada              ║
║                                                          ║
║  ┌──────────────┬──────────────┐                        ║
║  │    Login     │   Cadastro   │  <- Tabs                ║
║  └──────────────┴──────────────┘                        ║
║                                                          ║
║  E-mail: [________________________]                      ║
║                                                          ║
║  Senha:  [________________________]                      ║
║                                                          ║
║           [ ENTRAR ]                                     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

### Tab Cadastro

```
╔══════════════════════════════════════════════════════════╗
║  Tipo de Usuário: [Transportadora ▼]                     ║
║                                                          ║
║  E-mail: [________________________]                      ║
║  Senha:  [________________________]                      ║
║                                                          ║
║  --- Campos Dinâmicos (baseado no tipo) ---              ║
║                                                          ║
║  Razão Social: [________________________]                ║
║  CNPJ:         [________________________]                ║
║  IE:           [________________________]                ║
║  Telefone:     [________________________]                ║
║                                                          ║
║           [ CADASTRAR ]                                  ║
╚══════════════════════════════════════════════════════════╝
```

---

## 2. Dashboard Principal

```
╔══════════════════╦════════════════════════════════════════════════╗
║                  ║  Dashboard                                     ║
║   FreteLog       ║  Gerencie suas ofertas de carga               ║
║  usuario@mail    ║                                                ║
║                  ║  ┌─────────────┐ ┌─────────────┐              ║
║ ┌──────────────┐ ║  │ Oferta #1   │ │ Oferta #2   │              ║
║ │ Início       │ ║  │ SP → RJ     │ │ MG → SP     │              ║
║ └──────────────┘ ║  │ R$ 5.000,00 │ │ A Combinar  │              ║
║ ┌──────────────┐ ║  │             │ │             │              ║
║ │ Nova Oferta  │ ║  │ Carreta     │ │ Truck       │              ║
║ └──────────────┘ ║  │ Seca        │ │ Refrigerada │              ║
║ ┌──────────────┐ ║  └─────────────┘ └─────────────┘              ║
║ │ Minhas       │ ║                                                ║
║ │ Ofertas      │ ║  Ofertas de Carga Disponíveis                 ║
║ └──────────────┘ ║  ┌────────┐ ┌────────┐ ┌────────┐            ║
║                  ║  │ SP→RJ  │ │ MG→SP  │ │ RS→SC  │            ║
║                  ║  │ Carreta│ │ Truck  │ │ Toco   │            ║
║ ┌──────────────┐ ║  └────────┘ └────────┘ └────────┘            ║
║ │   SAIR       │ ║                                                ║
║ └──────────────┘ ║                                                ║
╚══════════════════╩════════════════════════════════════════════════╝
```

---

## 3. Cadastro de Veículos (Motorista)

```
╔══════════════════╦════════════════════════════════════════════════╗
║                  ║  Meus Veículos          [ + Adicionar Veículo ]║
║   FreteLog       ║  Gerencie sua frota                           ║
║  motorista@mail  ║                                                ║
║                  ║  ┌─────────────────────────────────────────┐  ║
║ ┌──────────────┐ ║  │ Cadastrar Novo Veículo                  │  ║
║ │ Início       │ ║  │                                         │  ║
║ └──────────────┘ ║  │ Tipo: [Carreta ▼]  Marca: [____]       │  ║
║ ┌──────────────┐ ║  │ Ano:  [____]        Peso:  [____] ton   │  ║
║ │ Meus         │ ║  │                                         │  ║
║ │ Veículos     │ ║  │ Placa Cavalo:    [________]             │  ║
║ └──────────────┘ ║  │ Placa Carreta:   [________]             │  ║
║ ┌──────────────┐ ║  │                                         │  ║
║ │ Buscar       │ ║  │ Carroceria: [Baú ▼]                     │  ║
║ │ Fretes       │ ║  │                                         │  ║
║ └──────────────┘ ║  │ [Salvar] [Cancelar]                     │  ║
║                  ║  └─────────────────────────────────────────┘  ║
║                  ║                                                ║
║                  ║  Veículos Cadastrados:                         ║
║                  ║  ┌───────────┐ ┌───────────┐                  ║
║ ┌──────────────┐ ║  │ [FOTO]    │ │ [FOTO]    │                  ║
║ │   SAIR       │ ║  │ Scania    │ │ Volvo     │                  ║
║ └──────────────┘ ║  │ 2020      │ │ 2019      │                  ║
╚══════════════════╩═│ Carreta   │ │ Truck     │══════════════════╝
                     │ 30t|45m³  │ │ 15t|30m³  │
                     │ [Excluir] │ │ [Excluir] │
                     └───────────┘ └───────────┘
```

---

## 4. Criar Oferta de Carga (Transportadora)

```
╔══════════════════╦════════════════════════════════════════════════╗
║                  ║  Criar Oferta de Carga                         ║
║   FreteLog       ║  Preencha os dados da carga                   ║
║  transp@mail.com ║                                                ║
║                  ║  ┌─────────────────────────────────────────┐  ║
║ ┌──────────────┐ ║  │ ROTA                                    │  ║
║ │ Início       │ ║  │                                         │  ║
║ └──────────────┘ ║  │ Origem: [____] UF: [__]                 │  ║
║ ┌──────────────┐ ║  │ Destino:[____] UF: [__]                 │  ║
║ │ Criar Oferta │ ║  └─────────────────────────────────────────┘  ║
║ └──────────────┘ ║                                                ║
║ ┌──────────────┐ ║  ┌─────────────────────────────────────────┐  ║
║ │ Minhas       │ ║  │ DATAS E HORÁRIOS                        │  ║
║ │ Ofertas      │ ║  │                                         │  ║
║ └──────────────┘ ║  │ Carregamento: [__/__/____] [__:__]      │  ║
║                  ║  │ Entrega:      [__/__/____] [__:__]      │  ║
║                  ║  └─────────────────────────────────────────┘  ║
║                  ║                                                ║
║                  ║  ┌─────────────────────────────────────────┐  ║
║                  ║  │ ESPECIFICAÇÕES                          │  ║
║                  ║  │                                         │  ║
║                  ║  │ Veículo: [Carreta ▼]                    │  ║
║ ┌──────────────┐ ║  │ Carroceria: [Baú ▼]                     │  ║
║ │   SAIR       │ ║  │ Tipo Carga: [Seca ▼]                    │  ║
║ └──────────────┘ ║  │ Modelo: [Caixas ▼]                      │  ║
╚══════════════════╩═└─────────────────────────────────────────┘══╝

                     ┌─────────────────────────────────────────┐
                     │ FINANCEIRO                              │
                     │                                         │
                     │ [ ] Frete a Combinar                    │
                     │                                         │
                     │ Valor Ofertado: R$ [________]           │
                     │ [✓] Pedágio Incluso                     │
                     │                                         │
                     │ Pagamento: [Pamcard ▼]                  │
                     │ Adiantamento: [70% saída/30% entrega]   │
                     └─────────────────────────────────────────┘

                     [ PUBLICAR OFERTA ] [ CANCELAR ]
```

---

## 5. Buscar Fretes (Motorista/Agenciador)

```
╔══════════════════╦════════════════════════════════════════════════╗
║                  ║  Ofertas Disponíveis                           ║
║   FreteLog       ║  Encontre fretes disponíveis                  ║
║  motorista@mail  ║                                                ║
║                  ║  ┌─────────────────────────────────────────┐  ║
║ ┌──────────────┐ ║  │ FILTROS                                 │  ║
║ │ Início       │ ║  │                                         │  ║
║ └──────────────┘ ║  │ Origem (UF): [__]  Destino (UF): [__]   │  ║
║ ┌──────────────┐ ║  │ Tipo Veículo: [Todos ▼]    [BUSCAR]     │  ║
║ │ Meus         │ ║  └─────────────────────────────────────────┘  ║
║ │ Veículos     │ ║                                                ║
║ └──────────────┘ ║  ┌──────────────┐ ┌──────────────┐            ║
║ ┌──────────────┐ ║  │ SP → RJ      │ │ MG → SP      │            ║
║ │ Buscar       │ ║  │ R$ 5.000,00  │ │ A Combinar   │            ║
║ │ Fretes       │ ║  │              │ │              │            ║
║ └──────────────┘ ║  │ Transp. ABC  │ │ Transp. XYZ  │            ║
║                  ║  │ 15/03 → 17/03│ │ 20/03 → 22/03│            ║
║                  ║  │ Carreta - Baú│ │ Truck - Sider│            ║
║                  ║  │ Seca - Caixas│ │ Seca - Ração │            ║
║                  ║  │ ✓ Pedagio    │ │              │            ║
║ ┌──────────────┐ ║  │              │ │              │            ║
║ │   SAIR       │ ║  │ [Demonstrar  │ │ [Demonstrar  │            ║
║ └──────────────┘ ║  │  Interesse]  │ │  Interesse]  │            ║
╚══════════════════╩═└──────────────┘ └──────────────┘════════════╝

                     ┌──────────────┐ ┌──────────────┐
                     │ RS → SC      │ │ PR → SP      │
                     │ R$ 3.500,00  │ │ R$ 4.200,00  │
                     │              │ │              │
                     │ Transp. 123  │ │ Transp. 456  │
                     │ 18/03 → 19/03│ │ 25/03 → 27/03│
                     │ Toco - Aberta│ │ Carreta - Baú│
                     │ Seca - Sacas │ │ Refrig. -    │
                     │              │ │ Eletrônicos  │
                     │ [Demonstrar  │ │ [Demonstrar  │
                     │  Interesse]  │ │  Interesse]  │
                     └──────────────┘ └──────────────┘
```

---

## 6. Minhas Ofertas (Transportadora)

```
╔══════════════════╦════════════════════════════════════════════════╗
║                  ║  Minhas Ofertas            [ + Nova Oferta ]   ║
║   FreteLog       ║  Gerencie suas ofertas de carga               ║
║  transp@mail.com ║                                                ║
║                  ║  ┌──────────────────────────────────────────┐ ║
║ ┌──────────────┐ ║  │ SÃO PAULO/SP → RIO DE JANEIRO/RJ         │ ║
║ │ Início       │ ║  │                        R$ 5.000,00        │ ║
║ └──────────────┘ ║  │                                          │ ║
║ ┌──────────────┐ ║  │ Carregamento: 15/03/2026 às 08:00        │ ║
║ │ Criar Oferta │ ║  │ Entrega: 17/03/2026 às 18:00             │ ║
║ └──────────────┘ ║  │ Veículo: Carreta - Baú                   │ ║
║ ┌──────────────┐ ║  │ Carga: Seca - Caixas                     │ ║
║ │ Minhas       │ ║  │ ✓ Pedágio Incluso                        │ ║
║ │ Ofertas      │ ║  │ Pagamento: Pamcard                       │ ║
║ └──────────────┘ ║  │ Adiantamento: 70% saída / 30% entrega    │ ║
║                  ║  │                                          │ ║
║                  ║  │ Criada em: 10/03/2026 14:30              │ ║
║                  ║  │                                          │ ║
║                  ║  │           [ EXCLUIR OFERTA ]             │ ║
║                  ║  └──────────────────────────────────────────┘ ║
║                  ║                                                ║
║ ┌──────────────┐ ║  ┌──────────────────────────────────────────┐ ║
║ │   SAIR       │ ║  │ BELO HORIZONTE/MG → SÃO PAULO/SP         │ ║
║ └──────────────┘ ║  │                        A COMBINAR         │ ║
╚══════════════════╩═└──────────────────────────────────────────┘═╝
                     │ Carregamento: 20/03/2026                 │
                     │ Entrega: 22/03/2026                      │
                     │ Veículo: Truck - Sider                   │
                     │ Carga: Seca - Ração                      │
                     │                                          │
                     │ Criada em: 11/03/2026 09:15              │
                     │                                          │
                     │           [ EXCLUIR OFERTA ]             │
                     └──────────────────────────────────────────┘
```

---

## Fluxos de Navegação

### Transportadora
```
Login → Dashboard → Criar Oferta → Minhas Ofertas → Ver Ofertas (geral)
```

### Motorista
```
Login → Dashboard → Meus Veículos → Cadastrar Veículo → Buscar Fretes
```

### Agenciador
```
Login → Dashboard → Ver Ofertas (filtrar e buscar)
```

---

## Responsividade

### Mobile (< 768px)
- Sidebar vira menu hamburger
- Cards empilham em coluna única
- Formulários em coluna única
- Filtros colapsáveis

### Tablet (768px - 1024px)
- Sidebar minimizada (apenas ícones)
- Cards em 2 colunas
- Formulários em 2 colunas

### Desktop (> 1024px)
- Layout completo como mostrado acima
- Cards em 3 colunas
- Formulários em 2 colunas com espaçamento amplo

---

## Estados Visuais

### Botões
- **Normal**: Fundo azul marinho (#001f3f)
- **Hover**: Azul mais escuro (#001830)
- **Disabled**: Cinza claro com opacidade

### Cards
- **Normal**: Fundo branco, sombra leve
- **Hover**: Sombra aumentada, leve elevação
- **Selecionado**: Borda azul marinho

### Inputs
- **Normal**: Borda cinza (#d1d5db)
- **Focus**: Borda azul marinho, ring azul
- **Erro**: Borda vermelha, texto vermelho

### Tags de Status
- **Valor Fixo**: Verde (#10b981)
- **A Combinar**: Amarelo (#f59e0b)
- **Pedágio Incluso**: Verde claro

---

## Ícones e Símbolos

- ✓ - Checkbox marcado
- [ ] - Checkbox desmarcado
- ▼ - Dropdown/Select
- → - Seta de rota (origem → destino)
- + - Adicionar novo item
- × - Fechar/Remover
