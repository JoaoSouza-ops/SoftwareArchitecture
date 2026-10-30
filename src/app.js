import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import rotasAutenticacao from './modules/auth/auth.routes.js';
import rotasRestaurantes from './modules/restaurants/restaurantRoutes.js';
import rotasPratos from './modules/dishes/dish.routes.js';

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const aplicacao = express();

aplicacao.use(express.json());
aplicacao.use(express.urlencoded({ extended: true }));
aplicacao.use(express.static(path.join(diretorioAtual, '../public')));

// Disponibiliza as imagens otimizadas para acesso estático via navegador
aplicacao.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Registro dos módulos da aplicação
aplicacao.use('/auth', rotasAutenticacao);
aplicacao.use(rotasRestaurantes);
aplicacao.use(rotasPratos);

// Middleware global de tratamento de erros (inclui validações do Multer: limites e formato)
aplicacao.use((erro, requisicao, resposta, proximo) => {
  if (erro instanceof multer.MulterError) {
    // 413 Payload Too Large quando o arquivo ultrapassa o limite de 5MB
    if (erro.code === 'LIMIT_FILE_SIZE') {
      return resposta.status(413).json({ error: 'Arquivo excede o limite permitido de 5 MB' });
    }
    return resposta.status(400).json({ error: erro.message });
  }

  // 400 Bad Request para formatos de imagem não suportados
  if (erro.statusCode === 400 || erro.message === 'Formato de imagem não permitido') {
    return resposta.status(400).json({ error: erro.message });
  }

  console.error('Erro na requisição:', erro);
  return resposta.status(erro.statusCode || 500).json({
    error: erro.message || 'Erro interno do servidor'
  });
});

export default aplicacao;
