import jwt from 'jsonwebtoken';

export function verificarJWT(requisicao, resposta, proximo) {
  const cabecalhoAutorizacao = requisicao.headers.authorization;

  if (!cabecalhoAutorizacao || !cabecalhoAutorizacao.startsWith('Bearer ')) {
    return resposta.status(401).json({ error: 'Token não fornecido' });
  }

  const token = cabecalhoAutorizacao.split(' ')[1];

  try {
    const dadosToken = jwt.verify(token, process.env.JWT_SECRET);
    requisicao.usuario = { id: dadosToken.sub, email: dadosToken.email };
    return proximo();
  } catch (erro) {
    return resposta.status(401).json({ error: 'Token inválido ou expirado' });
  }
}