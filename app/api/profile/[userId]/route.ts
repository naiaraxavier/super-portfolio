import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      firstName: true,
      lastName: true,
      email: true,
      bio: true,
      avatarUrl: true,
    },
  });

  if (!user)
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );

  return NextResponse.json(user);
}
