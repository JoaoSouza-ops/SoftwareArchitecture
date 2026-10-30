import * as dishService from './dish.service.js';

/**
 * Controller do Módulo de Pratos (Dishes)
 * 
 * Responsabilidade:
 * - Receber e validar as requisições HTTP (parâmetros da URL, body e arquivos do Multer).
 * - Invocar os métodos da camada Service.
 * - Retornar as respostas HTTP com os códigos de status adequados (200, 201, 400, 404, 500).
 */

export async function create(req, res) {
  try {
    const { restaurantId } = req.params;

    const dish = await dishService.createDish(
      restaurantId,
      req.body || {}
    );

    return res.status(201).json(dish);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.statusCode
        ? error.message
        : "Erro interno ao cadastrar prato"
    });
  }
}

export async function list(req, res) {
  try {
    const { restaurantId } = req.params;

    const dishes = await dishService.listDishes(restaurantId);

    return res.json(dishes);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao consultar pratos"
    });
  }
}

export async function uploadImage(req, res) {
  try {
    // Validação: Garante que um arquivo multipart foi enviado no campo esperado
    if (!req.file) {
      return res.status(400).json({
        error: "Nenhuma imagem enviada"
      });
    }

    const dish = await dishService.uploadDishImage(
      req.params.dishId,
      req.file.buffer
    );

    return res.json(dish);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.statusCode
        ? error.message
        : "Erro ao processar imagem"
    });
  }
}
