import { Router } from 'express';
import * as dishController from './dish.controller.js';
import { verificarJWT } from '../../middlewares/authMiddleware.js';
import upload from '../shared/upload.middleware.js';

const router = Router();

/**
 * Rotas de Cardápio (Dishes)
 */

// Consulta pública: Qualquer cliente pode visualizar os pratos de um restaurante
router.get(
  '/restaurants/:restaurantId/dishes',
  dishController.list
);

// Cadastro protegido: Exige token JWT para criar pratos no restaurante
router.post(
  '/restaurants/:restaurantId/dishes',
  verificarJWT,
  dishController.create
);

// Upload de imagem protegido: Exige token JWT e intercepta o multipart/form-data no campo "image"
router.post(
  '/dishes/:dishId/image',
  verificarJWT,
  upload.single('image'),
  dishController.uploadImage
);

export default router;
