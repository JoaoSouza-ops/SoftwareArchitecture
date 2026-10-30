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
    const nome = requisicao.body?.name || requisicao.body?.nome;
    const categoria = requisicao.body?.category || requisicao.body?.categoria;
    const avaliacao = requisicao.body?.rating !== undefined ? requisicao.body?.rating : requisicao.body?.avaliacao;

    if (!nome || !categoria) {
        return resposta.status(400).json({
            erro: "Nome e categoria são obrigatórios",
            detalhes: "Envie name (ou nome) e category (ou categoria)"
        });
    }

    try {
        const novoRestaurante = await criarRestaurante({
            name: nome,
            category: categoria,
            rating: avaliacao
        });
        return resposta.status(201).json(novoRestaurante);
    } catch (erro) {
        console.error("Erro ao cadastrar restaurante:", erro.message);
        return resposta.status(500).json({ error: "Erro interno no servidor" });
    }
}
