import { Router } from 'express';
import { buscarRestaurantes, cadastrarRestaurante } from './restaurantControler.js';
import { verificarJWT } from '../../middlewares/authMiddleware.js';

const roteador = Router();

// Rota pública: Qualquer um pode listar os restaurantes
roteador.get('/restaurants', buscarRestaurantes);

// Rota protegida: Apenas usuários autenticados (com token JWT válido) podem cadastrar
roteador.post('/restaurants', verificarJWT, cadastrarRestaurante);

export default roteador;