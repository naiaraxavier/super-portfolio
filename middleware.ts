import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  // Se não estiver autenticado e tentar acessar rotas protegidas
  if (!token && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  // Se acessar a home ("/")
  if (url.pathname === "/") {
    if (token) {
      url.pathname = `/dashboard/${token.id}`; // ✅ redireciona pro dashboard do usuário logado
    } else {
      url.pathname = "/auth/signin";
    }
    return NextResponse.redirect(url);
  }

  // Se estiver autenticado e tentar acessar login
  if (token && url.pathname.startsWith("/auth/signin")) {
    url.pathname = `/dashboard/${token.id}`; // ✅ redireciona pro dashboard pessoal
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/signin", "/auth/signup"],
};
