import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("icon") as File; // mesmo nome do frontend

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Pasta para salvar uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Nome único
    const filename = Date.now() + "-" + file.name;
    const filePath = path.join(uploadDir, filename);

    // Converter Blob em Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Salvar no servidor
    fs.writeFileSync(filePath, buffer);

    // Retornar caminho para frontend
    const iconUrl = `/uploads/${filename}`;
    return NextResponse.json({ iconUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao enviar arquivo" },
      { status: 500 }
    );
  }
}
