import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    console.log("[v0] Fetching portfolio data for username:", username);

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        skills: {
          orderBy: { createdAt: "desc" },
        },
        projects: {
          orderBy: { createdAt: "desc" },
        },
        contacts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      console.log("[v0] User not found:", username);
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const { passwordHash, ...userWithoutPassword } = user;

    console.log("[v0] Portfolio data fetched successfully");
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("[v0] Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do portfólio" },
      { status: 500 }
    );
  }
}
