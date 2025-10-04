import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Listar todas as habilidades do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    console.log("[v0] GET /api/profile/skills - userId:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    console.log("[v0] Skills encontradas:", skills.length);
    return NextResponse.json(skills);
  } catch (error) {
    console.error("[v0] Erro ao buscar skills:", error);
    return NextResponse.json(
      { error: "Erro ao buscar habilidades" },
      { status: 500 }
    );
  }
}

// POST - Criar nova habilidade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, iconUrl, userId } = body;

    console.log("[v0] POST /api/profile/skills - body:", body);

    if (!name || !userId) {
      return NextResponse.json(
        { error: "name e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        iconUrl: iconUrl || null,
        userId,
      },
    });

    console.log("[v0] Skill criada:", skill);
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("[v0] Erro ao criar skill:", error);
    return NextResponse.json(
      { error: "Erro ao criar habilidade" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar habilidade existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, iconUrl, userId } = body;

    console.log("[v0] PUT /api/profile/skills - body:", body);

    if (!id || !name || !userId) {
      return NextResponse.json(
        { error: "id, name e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.update({
      where: { id, userId },
      data: {
        name,
        iconUrl: iconUrl || null,
      },
    });

    console.log("[v0] Skill atualizada:", skill);
    return NextResponse.json(skill);
  } catch (error) {
    console.error("[v0] Erro ao atualizar skill:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar habilidade" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar habilidade
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    console.log("[v0] DELETE /api/profile/skills - id:", id, "userId:", userId);

    if (!id || !userId) {
      return NextResponse.json(
        { error: "id e userId são obrigatórios" },
        { status: 400 }
      );
    }

    await prisma.skill.delete({
      where: { id, userId },
    });

    console.log("[v0] Skill deletada com sucesso");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Erro ao deletar skill:", error);
    return NextResponse.json(
      { error: "Erro ao deletar habilidade" },
      { status: 500 }
    );
  }
}
