import bcrypt from "bcrypt";
import NextAuth, { Session, SessionStrategy } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username: any;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password)
          throw new Error("Preencha todos os campos");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error("Usuário não encontrado");

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!valid) throw new Error("Senha incorreta");

        // Retorna apenas os campos necessários
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: any;
      user?: { id: string; username?: string };
    }) {
      if (user) {
        token.id = user.id;
        token.username = user.username; // ✅ adicionado
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username; // ✅ agora username vai existir
      }
      return session;
    },
  },

  session: {
    strategy: "jwt" as SessionStrategy,
  },

  pages: {
    signIn: "/auth/signin",
    newUser: "/dashboard",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
