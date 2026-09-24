import { Router } from 'express';
import { registrar, autenticar } from './auth.controller.js';
import { verificarJWT } from '../../middlewares/authMiddleware.js';

const roteador = Router();

roteador.post('/register', registrar);
roteador.post('/login', autenticar);

roteador.get('/me', verificarJWT, (requisicao, resposta) => {
  resposta.json({ message: 'Você está autenticado!', user: requisicao.usuario });
});

export default roteador;