# ADR-003 - Integração com o SQLite através do Prisma ORM

## Status
Aceita

## Data
05/09/2026

## Responsáveis
Equipe EasyFood

## Contexto
Definido o SQLite como banco de dados oficial da EasyFood (ADR-002), restava decidir de que forma a aplicação
Node.js passaria a se comunicar com ele. Utilizar comandos SQL escritos manualmente dentro das rotas, através de
um driver nativo, deixaria o código mais verboso, mais difícil de manter e mais exposto a erros — além de exigir
que a criação e a evolução das tabelas fossem controladas manualmente pela equipe.

## Alternativas consideradas
1. **Driver nativo (`sqlite3`)** — permite rodar SQL puro diretamente, mas foi descartado por gerar código muito
   verboso, sem tipagem, e por deixar toda a gestão do esquema do banco sob responsabilidade manual da equipe.
2. **Query builders, como o Knex.js** — facilitam a montagem de queries usando sintaxe JavaScript, porém não
   entregam o mesmo nível de automação para geração de tabelas e controle de histórico de migrações.
3. **Prisma ORM** — ferramenta que modela as tabelas de forma declarativa em um arquivo `schema.prisma` e gera
   automaticamente um cliente para acesso ao banco.

## Decisão
O **Prisma ORM** foi escolhido como a ferramenta oficial de integração entre a API Node.js/Express e o banco
SQLite, cobrindo tanto a criação das tabelas quanto a manipulação dos dados.

## Justificativa
O Prisma simplifica esse processo de ponta a ponta: a entidade `Restaurant` é descrita de forma declarativa no
schema, e o próprio ORM se encarrega de gerar o arquivo `.db` e as tabelas correspondentes. Em vez de strings SQL
espalhadas pelo código, o `PrismaClient` expõe funções JavaScript nativas — como `prisma.restaurant.findMany()`
— o que deixa as rotas do Express mais enxutas, mais legíveis e menos vulneráveis a problemas como SQL Injection.

## Consequências

### Positivas
- **Código mais limpo:** a lógica de rota fica desacoplada da complexidade de acesso ao banco.
- **Rastreabilidade das mudanças:** o comando `prisma migrate dev` mantém um versionamento organizado da
  estrutura do banco, o que facilita o trabalho em equipe.
- **Seed facilitado:** o `PrismaClient` tornou simples a criação do script `seed.js`, usado para popular dados
  de teste.

### Negativas / trade-offs
- **Curva de aprendizado:** a equipe precisa investir tempo inicial entendendo a sintaxe do `schema.prisma` e os
  comandos de CLI — investimento que se paga em agilidade e segurança no médio prazo.
- **Aumento de dependências:** os pacotes `prisma` e `@prisma/client` somam-se ao `node_modules`, deixando o
  projeto um pouco mais pesado do que usar apenas um driver nativo.

## Critérios de revisão
Esta decisão deve ser revista caso o projeto venha a migrar para um banco NoSQL — cenário em que bibliotecas como
o Mongoose seriam mais adequadas — ou caso a camada de abstração do ORM se torne um gargalo de desempenho em
consultas analíticas de alta complexidade.

## Notas
Esta ADR encerra a cadeia de decisões iniciada na ADR-001 (armazenamento em memória) e continuada na ADR-002
(escolha do SQLite): juntas, elas documentam a evolução completa da camada de persistência de restaurantes da
EasyFood.