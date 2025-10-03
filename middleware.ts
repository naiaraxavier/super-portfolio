import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  // Se acessar a home (/) e não estiver autenticado, vai para login
  if (!token && url.pathname === "/") {
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  // Se acessar a home (/) e estiver autenticado, vai para dashboard
  if (token && url.pathname === "/") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Se não estiver autenticado e tentar acessar rotas protegidas
  if (!token && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  // Se estiver autenticado e tentar acessar login/registro
  if (token && url.pathname.startsWith("/auth/signin")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/signin", "/auth/signup"],
};
