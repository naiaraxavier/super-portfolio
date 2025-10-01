import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "Todos os campos são obrigatórios" }),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Email já cadastrado" }), {
        status: 400,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1] || "",
        username: email.split("@")[0],
      },
    });

    return new Response(
      JSON.stringify({ user: { id: user.id, email: user.email } }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Erro interno ao criar usuário" }),
      { status: 500 }
    );
  }
}
