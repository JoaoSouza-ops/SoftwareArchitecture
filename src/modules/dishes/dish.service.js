import prisma from '../../lib/prisma.js';
import * as imageService from '../shared/image.service.js';

/**
 * Service do Módulo de Pratos (Dishes)
 * 
 * Responsabilidade:
 * - Aplicar as regras de negócio de cardápio.
 * - Garantir a integridade relacional entre Restaurante e Prato.
 * - Delegar o processamento de imagens ao serviço compartilhado (image.service.js).
 */

/**
 * Cadastra um novo prato associado a um restaurante existente.
 */
export async function createDish(restaurantId, data) {
  const idRestaurante = Number(restaurantId);

  // 1. Integridade Referencial: Verifica se o restaurante realmente existe
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: idRestaurante }
  });

  if (!restaurant) {
    const error = new Error("Restaurante não encontrado");
    error.statusCode = 404;
    throw error;
  }

  // 2. Extração flexível dos dados (aceita inglês ou português)
  const name = data.name || data.nome;
  const description = data.description || data.descricao || "";
  const price = data.price !== undefined ? data.price : data.preco;

  if (!name || price === undefined) {
    const error = new Error("Nome e preço são obrigatórios para o prato");
    error.statusCode = 400;
    throw error;
  }

  // 3. Persistência do prato no banco com o vínculo (restaurantId)
  const dish = await prisma.dish.create({
    data: {
      name,
      description,
      price,
      restaurantId: idRestaurante
    }
  });

  return dish;
}

/**
 * Lista todos os pratos pertencentes a um determinado restaurante.
 */
export async function listDishes(restaurantId) {
  const idRestaurante = Number(restaurantId);

  return await prisma.dish.findMany({
    where: {
      restaurantId: idRestaurante
    }
  });
}

/**
 * Processa a imagem e associa seu caminho relativo ao prato.
 */
export async function uploadDishImage(dishId, buffer) {
  const idPrato = Number(dishId);

  // 1. Verifica se o prato existe no banco
  const dish = await prisma.dish.findUnique({
    where: { id: idPrato }
  });

  if (!dish) {
    const error = new Error("Prato não encontrado");
    error.statusCode = 404;
    throw error;
  }

  // 2. Otimiza e salva a imagem via serviço compartilhado
  const imageUrl = await imageService.optimizeImage(buffer);

  // 3. Atualiza o registro no banco com o novo caminho da imagem otimizada
  return await prisma.dish.update({
    where: { id: idPrato },
    data: { imageUrl }
  });
}
