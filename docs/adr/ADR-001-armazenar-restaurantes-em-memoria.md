# ADR-001 - Uso de estrutura em memória para armazenar restaurantes

## Status
Superada — ver ADR-002 e ADR-003

## Data
20/08/2026

## Data de superação
19/09/2026

## Responsáveis
Equipe EasyFood

## Contexto
A EasyFood está em sua primeira etapa de desenvolvimento, ainda em caráter de protótipo. Nesta fase, a API
precisa oferecer apenas duas capacidades essenciais sobre restaurantes: listar os já cadastrados e permitir o
cadastro de novos. Como o objetivo central agora é validar rapidamente o comportamento da aplicação — e não
sustentar um ambiente de produção — buscou-se a alternativa que exigisse o menor esforço de configuração possível,
deixando decisões de infraestrutura mais robustas para um momento posterior do projeto.

## Alternativas consideradas
Durante a análise, foram avaliadas as seguintes opções de armazenamento:
- Estrutura de dados em memória (array)
- PostgreSQL
- MongoDB
- SQLite
- Firebase
- Persistência via arquivo JSON

## Decisão
Optou-se por manter os restaurantes em uma estrutura de dados em memória (array), sem qualquer camada de
persistência em disco, durante esta primeira versão da aplicação.

## Justificativa
Essa alternativa foi escolhida porque:
- acelera o ritmo de desenvolvimento nesta fase inicial;
- simplifica a validação dos primeiros endpoints da API;
- dispensa qualquer configuração de infraestrutura de dados;
- mantém a complexidade da solução no menor nível possível;
- não gera custo algum para o projeto neste estágio.

## Consequências

### Positivas
- Ciclo de desenvolvimento mais ágil.
- Testes de GET e POST simplificados.
- Baixa complexidade inicial de arquitetura.
- Validação rápida do conceito do produto.

### Negativas
- Perda total dos dados a cada reinicialização do servidor.
- Ausência de qualquer mecanismo de persistência real.
- Incompatibilidade com cenários de múltiplas instâncias rodando em paralelo.
- Restrições relevantes para consultas mais elaboradas.
- Falta de garantias de integridade equivalentes às de um banco de dados.

## Quando revisar esta decisão
Esta escolha deveria deixar de valer assim que qualquer um dos cenários abaixo se concretizasse:
1. Conclusão da validação do MVP, com decisão de seguir para produção.
2. Necessidade de preservar dados entre deploys e reinicializações.
3. Volume de dados crescendo além do que é seguro manter apenas em memória.
4. Demanda por consultas com maior nível de complexidade.
5. Surgimento de relações entre entidades diferentes dentro da aplicação.

> **Atualização (19/09/2026):** os cenários 2 e 3 se concretizaram, tornando necessário garantir a persistência
> dos dados entre reinicializações. Essa necessidade originou a ADR-002, que definiu o SQLite como banco de
> dados oficial da aplicação, e a ADR-003, que estabeleceu o Prisma como ORM de acesso a esse banco. O array em
> memória não existe mais no código-fonte atual.

## Notas finais
Desde sua concepção, esta decisão já era entendida como provisória, válida apenas para a fase inicial da
EasyFood. A definição do mecanismo de persistência definitivo ficou registrada nas decisões seguintes:
- ADR-002 - Escolha do banco de dados da EasyFood.
- ADR-003 - Implementação da persistência no SQLite via Prisma ORM.