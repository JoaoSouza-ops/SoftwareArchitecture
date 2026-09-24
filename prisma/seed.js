import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const restaurantes = [
  { name: "Pizzaria Napoli", category: "Pizza", rating: 4.5 },
  { name: "Burger House", category: "Hambúrguer", rating: 4.2 },
  { name: "Sushi Express", category: "Japonesa", rating: 4.8 },
  { name: "Cantina della Nonna", category: "Italiana", rating: 4.6 },
  { name: "Sabor Mineiro", category: "Brasileira", rating: 4.3 },
  { name: "Verde Vida", category: "Vegana", rating: 4.4 },
  { name: "Doce Encanto", category: "Sobremesas", rating: 4.7 },
  { name: "Espeto de Ouro", category: "Churrasco", rating: 4.1 },
  { name: "Sabores do Oriente", category: "Árabe", rating: 4.5 },
  { name: "Fiesta Mexicana", category: "Mexicana", rating: 4.0 }
];

async function limparBancoDeDados() {
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
}

async function criarUsuariosIniciais() {
  const senhaAdminHash = await bcrypt.hash("admin123", 10);
  const senhaUsuarioHash = await bcrypt.hash("usuario123", 10);

  await prisma.user.createMany({
    data: [
      { name: "Administrador EasyFood", email: "admin@easyfood.com", password: senhaAdminHash },
      { name: "Usuário Convidado", email: "usuario@easyfood.com", password: senhaUsuarioHash }
    ]
  });
}

async function popularBancoDeDados() {
  await limparBancoDeDados();
  await prisma.restaurant.createMany({ data: restaurantes });
  await criarUsuariosIniciais();
  console.log("Dados inseridos com sucesso!");
}

popularBancoDeDados()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());