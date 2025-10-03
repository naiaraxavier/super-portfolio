import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("avatar") as any;

  if (!file)
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });

  const filename = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(uploadPath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}

// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { PrismaClient } from "@prisma/client";

// export const runtime = "nodejs"; // garante que fs funcione

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("avatar") as any;
//     const userId = formData.get("userId") as string;

//     if (!file || !userId) {
//       return NextResponse.json(
//         { error: "Arquivo ou userId não enviados" },
//         { status: 400 }
//       );
//     }

//     const uploadsDir = path.join(process.cwd(), "public", "uploads");
//     if (!fs.existsSync(uploadsDir))
//       fs.mkdirSync(uploadsDir, { recursive: true });

//     const filename = `${Date.now()}-${file.name}`;
//     const uploadPath = path.join(uploadsDir, filename);
//     const buffer = Buffer.from(await file.arrayBuffer());
//     fs.writeFileSync(uploadPath, buffer);

//     const avatarUrl = `/uploads/${filename}`;

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: { avatarUrl },
//     });

//     return NextResponse.json({ url: avatarUrl, user: updatedUser });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Erro interno ao fazer upload" },
//       { status: 500 }
//     );
//   }
// }
