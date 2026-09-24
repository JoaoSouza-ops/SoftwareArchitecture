import { buscarTodosRestaurantes, criarRestaurante } from './restaurantService.js';

export async function buscarRestaurantes(requisicao, resposta) {
    try {
        const restaurantes = await buscarTodosRestaurantes();
        return resposta.json(restaurantes);
    } catch (erro) {
        console.error("Erro ao buscar restaurantes:", erro.message);
        return resposta.status(500).json({ error: "Erro interno do servidor" });
    }
}

export async function cadastrarRestaurante(requisicao, resposta) {
    const { name: nome, category: categoria } = requisicao.body;

    if (!nome || !categoria) {
        return resposta.status(400).json({ erro: "Nome e categoria são obrigatórios" });
    }

    try {
        const novoRestaurante = await criarRestaurante(requisicao.body);
        return resposta.status(201).json(novoRestaurante);
    } catch (erro) {
        console.error("Erro ao cadastrar restaurante:", erro.message);
        return resposta.status(500).json({ error: "Erro interno no servidor" });
    }
}