import { registrarUsuario, autenticarUsuario } from './auth.service.js';

export async function registrar(requisicao, resposta) {
  const nome = requisicao.body?.name || requisicao.body?.nome;
  const email = requisicao.body?.email;
  const senha = requisicao.body?.password || requisicao.body?.senha;

  if (! nome || !email || !senha) {
    return resposta.status(400).json({
      error: 'Nome, e-mail e senha são obrigatórios',
      detalhes: 'Certifique-se de enviar name (ou nome), email e password (ou senha)'
    });
  }

  try {
    const usuario = await registrarUsuario({ name: nome, email, password: senha });
    return resposta.status(201).json(usuario);
  } catch (erro) {
    if (erro.code === 'P2002') {
      return resposta.status(409).json({ error: 'E-mail já cadastrado' });
    }
    console.error(erro);
    return resposta.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function autenticar(requisicao, resposta) {
  const email = requisicao.body?.email;
  const senha = requisicao.body?.password || requisicao.body?.senha;

  if (!email || !senha) {
    return resposta.status(400).json({
      error: 'E-mail e senha são obrigatórios',
      detalhes: 'Certifique-se de enviar o body com email e password (ou senha)'
    });
  }

  try {
    const resultado = await autenticarUsuario({ email, password: senha });
    if (!resultado) {
      return resposta.status(401).json({ error: 'Credenciais inválidas' });
    }
    return resposta.json(resultado);
  } catch (erro) {
    console.error(erro);
    return resposta.status(500).json({ error: 'Erro interno do servidor' });
  }
}
