import prisma from '../../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function registrarUsuario({ name, email, password }) {
  const hashSenha = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { name, email, password: hashSenha },
    select: { id: true, name: true, email: true }
  });
}

export async function autenticarUsuario({ email, password }) {
  const usuario = await prisma.user.findUnique({ where: { email } });
  if (!usuario) return null;

  const senhaConfere = await bcrypt.compare(password, usuario.password);
  if (!senhaConfere) return null;

  const token = jwt.sign(
    { sub: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: { id: usuario.id, name: usuario.name, email: usuario.email }
  };
}