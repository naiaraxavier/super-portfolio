"use client";

import type React from "react";
import { signOut } from "next-auth/react";

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

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { name: "Perfil", href: "/dashboard/profile", icon: User },
  { name: "Projetos", href: "/dashboard/projects", icon: Briefcase },
  { name: "Habilidades", href: "/dashboard/skills", icon: Lightbulb },
  { name: "Contatos", href: "/dashboard/contacts", icon: Mail },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="font-semibold">Portfólio</span>
            </Link>
          </div>

          {/* Navigation */}
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

          {/* Footer Actions */}
          <div className="border-t p-3 space-y-2">
            <Link href="/portfolio" target="_blank">
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
                signOut({
                  redirect: true, // faz redirecionamento
                  callbackUrl: "/auth/signin", // página para onde o usuário vai
                })
              }
            >
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        <main className="min-h-screen p-8">{children}</main>
      </div>
    </div>
  );
}
