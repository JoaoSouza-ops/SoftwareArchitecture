# ADR-006 - Processamento e Otimização de Imagens do Cardápio

## Status
Aprovada

## Data
29/10/2026

## Responsáveis
Equipe EasyFood

## Contexto
A EasyFood evoluiu para permitir o gerenciamento do cardápio dos restaurantes, possibilitando o cadastro de pratos e o envio de fotos ilustrativas. Fotografias originais obtidas de dispositivos móveis ou câmeras modernas possuem dimensões excessivas e arquivos volumosos (frequentemente entre 5 MB e 15 MB), nos formatos mais diversos (JPEG, PNG, HEIC). 

O armazenamento dessas imagens brutas impactaria negativamente a performance da aplicação, elevaria desnecessariamente o consumo de armazenamento em disco e degradaria a experiência do usuário final, aumentando o tempo de carregamento do cardápio e o consumo de dados móveis. Faz-se necessário um mecanismo para recepcionar, validar, redimensionar e compactar as imagens antes de persistir o caminho final no banco de dados.

## Alternativas consideradas
Durante as discussões arquiteturais, foram avaliadas três estratégias principais:

1. **Processamento Síncrono Interno na API (Node.js + Multer + Sharp)**:
   A API recebe o arquivo em memória através do Multer, processa e otimiza a imagem utilizando a biblioteca Sharp na mesma thread de execução (ou worker threads internas do libvips) e salva no sistema de arquivos local.

2. **Serviço Independente / Microsserviço com Fila (Worker Pattern)**:
   A API recebe o arquivo e publica uma mensagem em um broker (ex: RabbitMQ, Redis BullMQ). Um serviço de processamento dedicado consome a fila de forma assíncrona, otimiza o arquivo e notifica a conclusão.

3. **Arquitetura Serverless / FaaS (Cloud Storage + AWS Lambda / Cloud Functions)**:
   O upload é enviado diretamente para um bucket em nuvem (ex: Amazon S3). Um evento de criação de objeto dispara uma função Serverless que executa a transformação e salva a versão otimizada em outro bucket.

## Decisão
Optou-se por **manter o processamento de imagens dentro do próprio servidor da API EasyFood**, de maneira síncrona, utilizando **Multer** (com armazenamento em memória temporária) e **Sharp** (para redimensionamento para até 800px de largura e conversão para o formato moderno WebP com qualidade 80).

## Justificativa
Esta alternativa foi escolhida porque:
- **Simplicidade e foco no valor do negócio:** Evita a sobrecarga de gerenciar infraestruturas adicionais de nuvem ou serviços de mensageria neste estágio do projeto.
- **Contexto acadêmico e MVP:** O volume inicial de requisições e uploads de imagens é baixo e controlado.
- **Aproveitamento da infraestrutura existente:** Reutiliza o próprio container/servidor Node.js já provisionado para a EasyFood.
- **Feedback síncrono imediato:** O cliente da API recebe na própria resposta da requisição HTTP o caminho final da imagem já pronta para exibição (`imageUrl`), simplificando a lógica do frontend.

## Consequências

### Positivas
- Menor complexidade de implantação e manutenção (zero dependência de serviços externos pagos ou em nuvem).
- Código centralizado em um serviço compartilhado reutilizável (`shared/image.service.js`).
- Redução expressiva no tamanho dos arquivos (frequentemente superior a 70% de compressão com WebP).
- Padronização de todas as imagens em resolução máxima de 800px de largura, garantindo uniformidade visual no cardápio.

### Negativas / Limitações
- **Consumo de recursos da API:** O processamento de imagens (redimensionamento e encoding WebP) é uma operação intensiva em CPU e memória RAM.
- **Risco de bloqueio do Event Loop sob alta carga:** Múltiplos uploads simultâneos de imagens pesadas podem aumentar a latência de outros endpoints da aplicação.
- **Armazenamento acoplado ao disco local:** Em caso de escala horizontal da API com múltiplos servidores em balanceamento de carga, as imagens salvas localmente não estariam compartilhadas entre as instâncias sem um volume de rede compartilhado.

## Quando revisar esta decisão
Esta arquitetura deverá ser revista e migrada para uma abordagem assíncrona ou Serverless/S3 quando:
1. O volume simultâneo de uploads começar a degradar o tempo de resposta das rotas transacionais da API.
2. Houver necessidade de escalar a API horizontalmente em múltiplos containers ou servidores sem disco compartilhado.
3. Surgir a demanda por processamento de múltiplos tamanhos/thumbnails e vídeos promocionais.
