"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  Globe,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type PortfolioData = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string | null;
  bio: string | null;
  avatarUrl: string | null;
  skills: Array<{
    id: string;
    name: string;
    iconUrl: string | null;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string | null;
    link: string | null;
    imageUrl: string | null;
  }>;
  contacts: Array<{
    id: string;
    type: string;
    value: string;
  }>;
};

function getContactIcon(type: string) {
  const icons: Record<string, any> = {
    GitHub: Github,
    LinkedIn: Linkedin,
    Instagram: Instagram,
    Email: Mail,
    Website: Globe,
    Twitter: Globe,
  };
  return icons[type] || Globe;
}

export default function PortfolioPage() {
  const params = useParams();
  const username = params.username as string;
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/portfolio/${username}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Usuário não encontrado");
          }
          throw new Error("Erro ao carregar portfólio");
        }

        const data = await response.json();
        setPortfolioData(data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError(
          err instanceof Error ? err.message : "Erro ao carregar portfólio"
        );
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando portfólio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">
            {error || "Portfólio não encontrado"}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const { firstName, lastName, bio, avatarUrl, skills, projects, contacts } =
    portfolioData;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-6">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage
                src={avatarUrl || "/placeholder.svg?height=200&width=200"}
                alt={`${firstName} ${lastName}`}
              />
              <AvatarFallback className="text-3xl">
                {firstName[0]}
                {lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {firstName} {lastName}
              </h1>
              <p className="text-xl text-muted-foreground">@{username}</p>
            </div>

            {bio && (
              <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
                {bio}
              </p>
            )}

            {/* Social Links */}
            {contacts.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                {contacts.map((contact) => {
                  const Icon = getContactIcon(contact.type);
                  return (
                    <Button
                      key={contact.id}
                      variant="outline"
                      size="lg"
                      className="gap-2 bg-transparent"
                      asChild
                    >
                      <a
                        href={contact.value}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="h-5 w-5" />
                        {contact.type}
                      </a>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Habilidades</h2>
              <p className="text-muted-foreground">
                Tecnologias e ferramentas que domino
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className="px-4 py-2 text-base"
                >
                  {skill.iconUrl && (
                    <img
                      src={skill.iconUrl || "/placeholder.svg"}
                      alt={skill.name}
                      className="h-4 w-4 mr-2"
                    />
                  )}
                  {skill.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && projects.length > 0 && (
          <Separator className="max-w-3xl mx-auto" />
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
              <p className="text-muted-foreground">
                Alguns dos meus trabalhos recentes
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={
                        project.imageUrl ||
                        "/placeholder.svg?height=400&width=600"
                      }
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    {project.description && (
                      <CardDescription className="line-clamp-3">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {project.link && (
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full gap-2 bg-transparent"
                        asChild
                      >
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ver Projeto
                        </a>
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && contacts.length > 0 && (
          <Separator className="max-w-3xl mx-auto" />
        )}

        {/* Contact Section */}
        {contacts.length > 0 && (
          <section className="space-y-6 pb-16">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Entre em Contato
              </h2>
              <p className="text-muted-foreground">Vamos trabalhar juntos!</p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {contacts.map((contact) => {
                    const Icon = getContactIcon(contact.type);
                    return (
                      <a
                        key={contact.id}
                        href={contact.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{contact.type}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {contact.value}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {firstName} {lastName}. Todos os
            direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
