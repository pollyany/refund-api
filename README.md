# Refund API

API REST para gestão de solicitações de reembolso, voltada para empresas que precisam registrar despesas, anexar comprovantes e controlar acesso por perfil de usuário.

## Visão geral

A aplicação foi desenvolvida com Node.js + TypeScript e usa Express para expor endpoints seguros e organizados. O sistema conta com autenticação JWT, validação de dados com Zod, persistência em SQLite via Prisma e envio de arquivos com Multer.

Ela permite:

- cadastro de usuários
- autenticação e geração de token
- criação de solicitações de reembolso
- upload de comprovantes em imagem
- listagem e busca por reembolsos
- controle de acesso por perfil
- armazenamento e leitura de arquivos enviados

---

## Stack principal

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- SQLite

### Autenticação e segurança

- JWT (jsonwebtoken)
- bcrypt para hash de senhas
- CORS para permitir requisições externas

### Validação e upload

- Zod para validação de dados
- Multer para upload de arquivos
- armazenamento local em pasta `uploads`

### Ferramentas de desenvolvimento

- tsx para execução em desenvolvimento
- ts-node
- Prisma Client
- ESLint/TypeScript config (via estrutura do projeto)

---

## Funcionalidades

### 1. Cadastro de usuários

Endpoint responsável por criar usuários com:

- nome
- e-mail único
- senha com hash
- perfil de acesso (`employe` ou `manager`)

A senha não é armazenada em texto puro; ela é criptografada com bcrypt antes de salvar no banco.

### 2. Login e autenticação

O login valida:

- existência do usuário pelo e-mail
- senha correta
- geração de token JWT

O token é enviado ao cliente e usado em rotas protegidas por middleware de autenticação.

### 3. Reembolsos

A API permite o registro de reembolsos contendo:

- nome da solicitação
- categoria
- valor
- nome do arquivo anexado
- usuário responsável

As categorias definidas no Prisma são:

- `food`
- `accommodation`
- `transport`
- `services`
- `others`

### 4. Upload de comprovante

Os arquivos são recebidos com `multer`, validados e salvos localmente. O sistema aceita apenas imagens nos formatos:

- JPEG
- JPG
- PNG

Também valida:

- tamanho máximo de 3MB
- nome do arquivo obrigatório
- tipos MIME válidos

### 5. Listagem e paginação

A rota de listagem retorna:

- registros de reembolsos
- paginação com `page`, `perPage`, `totalRecords` e `totalPages`
- filtro por nome do usuário associado
- ordenação por data de criação decrescente

### 6. Controle de autorização

A API separa permissões por papéis:

- usuários com perfil `employe` podem criar e consultar seus próprios registros
- usuários com perfil `manager` podem visualizar listagem geral

O middleware de autorização verifica o token e a role do usuário antes de permitir acesso às rotas protegidas.

---

## Estrutura do projeto

```text
refund-api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── auth.ts
│   │   └── upload.ts
│   ├── controllers/
│   │   ├── refunds-controller.ts
│   │   ├── sessions-controller.ts
│   │   ├── uploads-controller.ts
│   │   └── users-controller.ts
│   ├── database/
│   │   └── prisma.ts
│   ├── middlewares/
│   │   ├── ensure-authenticated.ts
│   │   ├── error-handling.ts
│   │   └── verify-user-authorization.ts
│   ├── providers/
│   │   └── disk-storage.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── refunds-routes.ts
│   │   ├── sessions-routes.ts
│   │   ├── uploads-routes.ts
│   │   └── users-routes.ts
│   └── utils/
│       └── AppError.ts
├── types/
│   └── express.d.ts
├── package.json
├── tsconfig.json
├── README.md
└── tmp/
```

---

## Banco de dados

O projeto usa Prisma com SQLite para facilitar execução local e desenvolvimento rápido.

Modelo principal:

- `User`
  - id
  - name
  - email
  - password
  - role
  - createdAt
  - updatedAt

- `Refunds`
  - id
  - name
  - amount
  - category
  - filename
  - userId
  - createdAt
  - updatedAt

A relação é de 1 usuário para muitos reembolsos.

---

## Rotas principais

### Usuários

```http
POST /users
```

Cria um novo usuário.

### Sessões

```http
POST /sessions
```

Autentica o usuário e retorna token + dados do usuário.

### Reembolsos

```http
POST /refunds
GET /refunds
GET /refunds/:id
```

Operações relacionadas à criação, consulta e listagem de reembolsos.

### Upload

```http
POST /uploads
```

Faz o envio de comprovante e retorna o nome do arquivo salvo.

> O arquivo enviado fica disponível em `/uploads` a partir da aplicação.

---

## Requisitos

- Node.js 18+
- npm ou yarn
- SQLite local

---

## Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Gere o cliente Prisma e aplique as migrações:

```bash
npx prisma migrate dev
```

4. Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3333
```

---

## Variáveis e configuração

O projeto usa configurações locais em arquivos dentro de `src/config`, como:

- `auth.ts` para configuração de JWT
- `upload.ts` para limite de tamanho, tipos aceitos e pasta de armazenamento

Essas definições facilitam manutenção e ajuste de regras de segurança e upload.

---

## Tratamento de erros

A aplicação centraliza o tratamento de exceções por meio de middleware, retornando respostas padronizadas para erros de:

- autenticação
- autorização
- validação de dados
- arquivo inválido
- recurso inexistente

---

## Observações

Este projeto é uma API backend para fluxo de reembolso com foco em:

- simplicidade de implementação
- organização por camadas
- segurança básica via JWT
- persistência local com SQLite
- fácil extensão para frontend ou painel administrativo

---

## Tecnologias em resumo

- TypeScript
- Express
- Prisma
- SQLite
- JWT
- bcrypt
- Zod
- Multer
- CORS

---

## Futuras melhorias possíveis

- CRUD completo de reembolsos
- aprovação/reprovação por gestores
- filtros por categoria e período
- exportação em PDF/CSV
- dashboard administrativo
- testes automatizados com Vitest/Jest
- migração para PostgreSQL em produção

Se quiser, também posso criar uma versão do README com foco em documentação de API para frontend, incluindo exemplos de requests e responses em cURL/Insomnia.
