import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const projects = await prisma.project.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.log("[v0] Error fetching projects:", error);
    return NextResponse.json(
      { error: "Erro ao buscar projetos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, link, imageUrl, userId } = body;

    if (!title || !userId) {
      return NextResponse.json(
        { error: "title e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        link: link || null,
        imageUrl: imageUrl || null,
        userId,
      },
    });

    console.log("[v0] Project created successfully:", project.id);
    return NextResponse.json(project);
  } catch (error) {
    console.log("[v0] Error creating project:", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, link, imageUrl } = body;

    if (!id || !title) {
      return NextResponse.json(
        { error: "id e title são obrigatórios" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description: description || null,
        link: link || null,
        imageUrl: imageUrl || null,
      },
    });

    console.log("[v0] Project updated successfully:", updatedProject.id);
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.log("[v0] Error updating project:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar projeto" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
    }

    await prisma.project.delete({ where: { id } });

    console.log("[v0] Project deleted successfully:", id);
    return NextResponse.json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    console.log("[v0] Error deleting project:", error);
    return NextResponse.json(
      { error: "Erro ao deletar projeto" },
      { status: 500 }
    );
  }
}
