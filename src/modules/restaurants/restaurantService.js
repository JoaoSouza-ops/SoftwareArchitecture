import prisma from '../../lib/prisma.js';
import * as emailService from '../shared/email.service.js';

export async function buscarTodosRestaurantes() {
  return await prisma.restaurant.findMany();
}

export async function criarRestaurante(dados) {
  const { name, category, rating } = dados;

  // 1. Operação principal
  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      category,
      rating: rating || 0
    }
  });

  const emailDestino = process.env.EMAIL_TO_TEST || "teste@easyfood.com";

  // 2. Ação secundária - E-mail de boas-vindas para o restaurante
  try {
    await emailService.sendEmail({
      to: emailDestino,
      toName: restaurant.name,
      subject: `Bem-vindo à EasyFood, ${restaurant.name}!`,
      header: `Olá, ${restaurant.name}!`,
      body: `
        Seu restaurante foi cadastrado com sucesso
        na EasyFood.<br/>
        Categoria: ${restaurant.category}.
      `,
      footer: "Equipe EasyFood"
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error.message || error.body?.message || error);
  }

  // 3. Ação secundária (Parte 11) - Notificação para a equipe comercial usando a mesma função sendEmail
  try {
    await emailService.sendEmail({
      to: emailDestino,
      toName: "Comercial EasyFood",
      subject: `Novo restaurante cadastrado: ${restaurant.name}`,
      header: "Novo restaurante na plataforma",
      body: `
        Nome: ${restaurant.name}<br/>
        Categoria: ${restaurant.category}<br/>
        Avaliação: ${restaurant.rating}
      `,
      footer: "Notificação automática - EasyFood"
    });
  } catch (error) {
    console.error("Erro ao notificar o comercial:", error.message || error.body?.message || error);
  }

  // 4. Retorno da operação principal
  return restaurant;
}
