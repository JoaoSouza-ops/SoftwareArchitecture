# ADR-002 - Definição do banco de dados da EasyFood

## Status
Aceita

## Data
29/08/2026

## Responsáveis
Equipe EasyFood

## Contexto
Na primeira versão da API, os restaurantes eram mantidos em um array volátil, existente apenas em memória
(conforme ADR-001). Essa abordagem tinha uma limitação clara: qualquer reinicialização do servidor apagava por
completo os dados já cadastrados. Com o avanço do projeto, tornou-se necessário adotar uma forma de persistência
que gravasse as informações em disco de maneira confiável, sem impor à equipe uma carga de infraestrutura
incompatível com o estágio atual da aplicação.

## Alternativas consideradas
1. **PostgreSQL / MySQL** — bancos relacionais no modelo cliente-servidor, com grande robustez. Ficaram de fora
   nesta etapa porque exigiriam provisionar e manter infraestrutura externa (containers Docker ou serviços
   dedicados), algo desproporcional ao momento atual do projeto.
2. **MongoDB** — banco NoSQL orientado a documentos. Não foi escolhido porque os dados da aplicação já se
   organizam bem em um formato tabular/relacional, tornando um modelo de documentos desnecessário.
3. **SQLite** — banco relacional leve, que guarda todas as informações em um único arquivo, sem depender de um
   processo de servidor separado.

## Decisão
O **SQLite** foi definido como o banco de dados oficial da API EasyFood.

## Justificativa
O SQLite combina a robustez de um banco relacional tradicional — com suporte a SQL padrão — com a vantagem de
funcionar em modo serverless, dispensando qualquer instalação ou processo de banco rodando separadamente. Todo o
conteúdo é persistido em um único arquivo local (`dev.db`), o que resolve o problema de perda de dados com
um esforço mínimo de implementação.

## Consequências

### Positivas
- **Dados persistentes:** informações cadastradas via POST deixam de ser perdidas quando o servidor reinicia.
- **Configuração mínima:** dispensa infraestrutura externa ou dependências pesadas.
- **Portabilidade:** o banco inteiro fica contido em um único arquivo, fácil de mover, copiar ou versionar.

### Negativas
- **Concorrência restrita:** não é a escolha ideal para cenários de escrita simultânea em grande escala.
- **Natureza assíncrona:** exige lidar com chamadas assíncronas (callbacks/promises) na comunicação com o banco.

## Critérios de revisão
Esta decisão deve ser reconsiderada se a EasyFood precisar escalar horizontalmente em múltiplos servidores na
nuvem — cenário em que um arquivo local deixa de ser prático — ou se o volume de requisições concorrentes crescer
significativamente. Nessas condições, a migração para um SGBD cliente-servidor, como o PostgreSQL, passaria a ser
avaliada.

## Notas
Esta decisão resolve o problema de persistência descrito na ADR-001, mas não define como a aplicação irá se
comunicar com o SQLite. Essa definição está registrada na ADR-003 - Implementação da persistência no SQLite via
Prisma ORM.