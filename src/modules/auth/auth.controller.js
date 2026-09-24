import { registrarUsuario, autenticarUsuario } from './auth.service.js';

export async function registrar(requisicao, resposta) {
  const { name: nome, email, password: senha } = requisicao.body;

  if (!nome || !email || !senha) {
    return resposta.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
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
  const { email, password: senha } = requisicao.body;

  if (!email || !senha) {
    return resposta.status(400).json({ error: 'E-mail e senha são obrigatórios' });
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