import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

/**
 * Serviço Compartilhado de Otimização de Imagens (Shared Module)
 * 
 * Responsabilidade:
 * - Receber o arquivo de imagem bruto em memória (buffer).
 * - Otimizar a imagem no servidor Node.js (sem dependência de serviços externos).
 * - Redimensionar, ajustar orientação EXIF e converter para o formato WebP.
 * - Armazenar localmente na pasta uploads/dishes/.
 */
export async function optimizeImage(buffer) {
  // 1. Gera um UUID único para evitar sobrescrever imagens com o mesmo nome original
  const filename = `${crypto.randomUUID()}.webp`;

  // 2. Resolve o caminho absoluto da pasta de destino na raiz do projeto
  const directory = path.resolve(process.cwd(), "uploads", "dishes");

  // 3. Cria a pasta recursivamente caso ainda não exista no sistema de arquivos
  await fs.mkdir(directory, { recursive: true });

  const filePath = path.join(directory, filename);

  // 4. Pipeline de processamento de imagem com o Sharp:
  // - rotate(): corrige a orientação da câmera com base nos metadados EXIF
  // - resize(): redimensiona para largura máxima de 800px proporcionalmente
  // - withoutEnlargement: true: se a foto for menor que 800px, não amplia (evita pixelização)
  // - webp({ quality: 80 }): converte para WebP (economia de até 70-80% do peso em relação a JPEG/PNG)
  await sharp(buffer)
    .rotate()
    .resize({
      width: 800,
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
    })
    .toFile(filePath);

  // 5. Retorna o caminho relativo da imagem otimizada para ser salvo no banco
  return `/uploads/dishes/${filename}`;
}
