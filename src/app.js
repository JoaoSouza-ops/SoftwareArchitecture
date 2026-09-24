import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import rotasAutenticacao from './modules/auth/auth.routes.js';
import rotasRestaurantes from './modules/restaurants/restaurantRoutes.js';

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const aplicacao = express();

aplicacao.use(express.json());
aplicacao.use(express.static(path.join(diretorioAtual, '../public')));

aplicacao.use('/auth', rotasAutenticacao);
aplicacao.use(rotasRestaurantes);

export default aplicacao;