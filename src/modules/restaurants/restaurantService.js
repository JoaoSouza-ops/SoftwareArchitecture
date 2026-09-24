import prisma from '../../lib/prisma.js';

export async function buscarTodosRestaurantes() {
  return await prisma.restaurant.findMany();
}

export async function criarRestaurante(dados) {
  const { name, category, rating } = dados;

  return await prisma.restaurant.create({
    data: {
      name,
      category,
      rating: rating || 0
    }
  });
}