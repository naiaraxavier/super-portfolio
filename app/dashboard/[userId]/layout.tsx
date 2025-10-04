"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Lightbulb,
  Mail,
  LogOut,
  Eye,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Você precisa estar logado.
      </div>
    );
  }

  const userId = session.user.id; // ✅ aqui definimos o userId

  const navigation = [
    {
      name: "Visão Geral",
      href: `/dashboard/${userId}`,
      icon: LayoutDashboard,
    },
    { name: "Perfil", href: `/dashboard/${userId}/profile`, icon: User },
    {
      name: "Projetos",
      href: `/dashboard/${userId}/projects`,
      icon: Briefcase,
    },
    {
      name: "Habilidades",
      href: `/dashboard/${userId}/skills`,
      icon: Lightbulb,
    },
    { name: "Contatos", href: `/dashboard/${userId}/contacts`, icon: Mail },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-card flex flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href={`/dashboard/${userId}`}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="font-semibold">Portfólio</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3 space-y-2">
          <Link href={`/portfolio/${userId}`} target="_blank">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent"
            >
              <Eye className="h-5 w-5" />
              Ver Portfólio
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={() =>
              signOut({ redirect: true, callbackUrl: "/auth/signin" })
            }
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
