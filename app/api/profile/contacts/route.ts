import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const contacts = await prisma.contact.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.log("[v0] Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contatos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, value, userId } = body;

    if (!type || !value || !userId) {
      return NextResponse.json(
        { error: "type, value e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        type,
        value,
        userId,
      },
    });

    console.log("[v0] Contact created successfully:", contact.id);
    return NextResponse.json(contact);
  } catch (error) {
    console.log("[v0] Error creating contact:", error);
    return NextResponse.json(
      { error: "Erro ao criar contato" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, type, value } = body;

    if (!id || !type || !value) {
      return NextResponse.json(
        { error: "id, type e value são obrigatórios" },
        { status: 400 }
      );
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { type, value },
    });

    console.log("[v0] Contact updated successfully:", updatedContact.id);
    return NextResponse.json(updatedContact);
  } catch (error) {
    console.log("[v0] Error updating contact:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar contato" },
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

    await prisma.contact.delete({ where: { id } });

    console.log("[v0] Contact deleted successfully:", id);
    return NextResponse.json({ message: "Contato deletado com sucesso" });
  } catch (error) {
    console.log("[v0] Error deleting contact:", error);
    return NextResponse.json(
      { error: "Erro ao deletar contato" },
      { status: 500 }
    );
  }
}
