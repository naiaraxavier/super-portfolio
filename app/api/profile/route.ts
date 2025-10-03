// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // GET: Buscar dados do usuário
// export async function GET(req: NextRequest) {
//   const userId = req.nextUrl.searchParams.get("userId");
//   if (!userId)
//     return NextResponse.json(
//       { error: "userId é obrigatório" },
//       { status: 400 }
//     );

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     include: { skills: true, projects: true, contacts: true },
//   });

//   if (!user)
//     return NextResponse.json(
//       { error: "Usuário não encontrado" },
//       { status: 404 }
//     );
//   return NextResponse.json(user);
// }

// // PUT: Atualizar dados do usuário
// export async function PUT(req: NextRequest) {
//   const body = await req.json();
//   const { userId, username, firstName, lastName, email, bio, avatarUrl } = body;

//   if (!userId)
//     return NextResponse.json(
//       { error: "userId é obrigatório" },
//       { status: 400 }
//     );

//   const updatedUser = await prisma.user.update({
//     where: { id: userId },
//     data: { username, firstName, lastName, email, bio, avatarUrl },
//   });

//   return NextResponse.json(updatedUser);
// }

// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const data = body;

    const allowedFields = [
      "username",
      "firstName",
      "lastName",
      "email",
      "bio",
      "avatarUrl",
    ];
    const updateData: any = {};
    for (const key of allowedFields) {
      if (key in data && data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Nenhum dado válido para atualizar" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

// GET: Buscar dados do usuário
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json(
      { error: "userId é obrigatório" },
      { status: 400 }
    );

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { skills: true, projects: true, contacts: true },
  });

  if (!user)
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  return NextResponse.json(user);
}
