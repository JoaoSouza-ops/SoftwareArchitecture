# EasyFood

API para consulta e cadastro de restaurantes, com autenticação de usuários via JWT. Este projeto está em fase de
prototipação/validação — as decisões de arquitetura tomadas até aqui estão documentadas em `docs/adr/`.

## Stack

- **Node.js** + **Express 5**
- **Prisma ORM** + **SQLite** para persistência de dados
- **JWT** (`jsonwebtoken`) para autenticação
- **bcrypt** para hash de senhas

## Estrutura do projeto

```
EASYFOOD/
├── prisma/
│   ├── schema.prisma        # Modelagem das tabelas (Restaurant, User)
│   ├── seed.js               # Script para limpar e popular o banco com dados de teste
│   └── migrations/           # Histórico de migrações do banco
├── public/
│   └── index.html             # Página estática servida pela API
├── src/
│   ├── app.js                 # Configuração do Express e das rotas
│   ├── server.js               # Ponto de entrada da aplicação
│   ├── lib/
│   │   └── prisma.js           # Instância compartilhada do PrismaClient
│   ├── middlewares/
│   │   └── authMiddleware.js   # Middleware de verificação de token JWT
│   └── modules/
│       ├── auth/                # Cadastro, login e rota autenticada de exemplo
│       └── restaurants/         # Consulta e cadastro de restaurantes
├── docs/
│   ├── adr/                     # Registro das decisões arquiteturais (ADRs)
│   └── design/                  # Contexto de produto/UX para o redesign da interface (sugestão de local)
│       ├── CONTEXTO-FRONTEND-EASYFOOD.md   # Funcionalidades, contratos de API e fluxo atual, para guiar o redesign
│       └── easyfood-novo.html               # Protótipo visual da nova interface (dados fictícios, sem integração real com a API)
└── postman/                     # Coleções do Postman para testar a API
```

> A pasta `docs/design/` é uma sugestão de organização para os artefatos de UX gerados durante o trabalho de
> redesign da interface; ajuste o caminho conforme a convenção que o time preferir.

## Pré-requisitos

- Node.js instalado
- npm

## Instalação

```bash
git clone <url-do-repositorio>
cd EASYFOOD
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto (baseado em `.env.exemple`) com as seguintes variáveis:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="uma-chave-secreta-forte-aqui"
```

> `JWT_SECRET` é obrigatório — a aplicação não sobe sem essa variável definida.

## Banco de dados

Rode as migrações para criar o banco SQLite local (`prisma/dev.db`) com as tabelas do projeto:

```bash
npm run migrate
```

Popule o banco com dados de teste:

```bash
node prisma/seed.js
```

> ⚠️ **O `seed.js` é destrutivo.** Antes de inserir os dados novos, ele **apaga todos os registros** das tabelas
> `Restaurant` e `User`. Não rode esse comando em um banco com dados que você queira manter.

O script insere:
- 10 restaurantes fictícios, distribuídos em categorias variadas (Pizza, Japonesa, Brasileira, Street food,
  Sobremesas, entre outras);
- 2 usuários de teste, com senha já em hash via `bcrypt`:
  - `admin@easyfood.com` — chamado de "Administrador EasyFood" só no nome, **sem nenhum efeito real de
    permissão** (o schema ainda não tem um campo de papel/role — ver ADR-005);
  - `usuario@easyfood.com` — usuário comum.

## Executando o projeto

```bash
# modo produção
npm start

# modo desenvolvimento (reinicia sozinho a cada alteração)
npm run dev
```

Por padrão a API sobe em `http://localhost:3000` (ou na porta definida em `PORT`, se houver).

## Endpoints

### Autenticação (`/auth`)

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/auth/register` | Cria um novo usuário (`name`, `email`, `password`) | Não |
| POST | `/auth/login` | Autentica o usuário e retorna um token JWT | Não |
| GET | `/auth/me` | Retorna os dados do usuário autenticado | Sim (Bearer token) |

### Restaurantes

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| GET | `/restaurants` | Lista todos os restaurantes cadastrados | Não |
| POST | `/restaurants` | Cadastra um novo restaurante (`name`, `category`, `rating`) | Sim (Bearer token) |

Para acessar rotas protegidas, envie o token obtido no login no header:

```
Authorization: Bearer <token>
```

Hoje **qualquer usuário autenticado** pode cadastrar restaurantes — não existe distinção de papéis/permissões no
backend (ver ADR-005).

## Testando a API

O projeto inclui coleções do Postman em `postman/collections/`, prontas para importar e testar os endpoints de
autenticação e restaurantes.

## Interface

A interface atual (`public/index.html`) é uma página única em HTML/CSS/JS puro, sem framework. Um trabalho de
redesign está em andamento:

- `docs/design/CONTEXTO-FRONTEND-EASYFOOD.md` documenta o comportamento e os contratos de API da interface atual,
  para orientar quem for desenhar a nova versão sem precisar ler o código.
- `docs/design/easyfood-novo.html` é um protótipo visual da nova interface (linha editorial, paleta "horta
  contemporânea"), com dados fictícios e sem integração real com a API — serve como referência visual e de
  interação, não como implementação final.

## Decisões de arquitetura (ADRs)

As principais decisões técnicas do projeto estão documentadas em `docs/adr/`:

- **ADR-001** — Armazenamento inicial dos restaurantes em memória *(superada)*
- **ADR-002** — Escolha do SQLite como banco de dados
- **ADR-003** — Adoção do Prisma ORM para acesso ao banco
- **ADR-004** — Estratégia de autenticação (JWT + bcrypt)
- **ADR-005** — Estratégia de autorização por papéis (admin/usuário comum) — **proposta, ainda não implementada**

## Notas técnicas conhecidas

Pontos identificados durante uma rodada de refatoração recente, registrados aqui para acompanhamento futuro:

- **Inconsistência de nomenclatura de arquivos**: os módulos de autenticação usam o padrão `auth.controller.js` /
  `auth.routes.js` / `auth.service.js` (com pontos), enquanto os módulos de restaurantes usam uma palavra só,
  em PascalCase, sem separador (`restaurantControler.js`, `restaurantRoutes.js`, `restaurantService.js`) — inclusive
  com um erro de digitação (`Controler`, faltando um "l"). Os nomes foram mantidos como estão; padronizar isso é
  um bom candidato a uma refatoração futura.
- **Sem papéis de usuário**: como já mencionado, não há campo de permissão no model `User`. A ADR-005 documenta as
  alternativas consideradas para quando essa necessidade se tornar real.

## Status do projeto

Protótipo em fase de validação. Antes de um eventual ambiente de produção, os seguintes pontos devem ser
reavaliados:
- revogação de tokens JWT e escalabilidade do banco de dados (ver critérios de revisão nas ADRs correspondentes);
- implementação de papéis/permissões reais de usuário (ADR-005), hoje inexistente;
- consolidação da nova interface visual, hoje em fase de protótipo (`docs/design/`), ainda sem integração com a
  API real.
