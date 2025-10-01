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
} from "lucide-react";

// TODO: Fetch this data from the database using Prisma
const portfolioData = {
  user: {
    firstName: "João",
    lastName: "Silva",
    username: "joaosilva",
    bio: "Desenvolvedor Full Stack apaixonado por criar experiências digitais incríveis. Especializado em React, Next.js e Node.js.",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    email: "joao@exemplo.com",
  },
  skills: [
    { id: "1", name: "React", iconUrl: "" },
    { id: "2", name: "Next.js", iconUrl: "" },
    { id: "3", name: "TypeScript", iconUrl: "" },
    { id: "4", name: "Node.js", iconUrl: "" },
    { id: "5", name: "Tailwind CSS", iconUrl: "" },
    { id: "6", name: "PostgreSQL", iconUrl: "" },
  ],
  projects: [
    {
      id: "1",
      title: "E-commerce Platform",
      description:
        "Plataforma completa de e-commerce com carrinho de compras, pagamentos integrados e painel administrativo.",
      link: "https://exemplo.com",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "2",
      title: "Task Management App",
      description:
        "Aplicativo de gerenciamento de tarefas com drag-and-drop, colaboração em tempo real e notificações.",
      link: "https://exemplo.com",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "3",
      title: "Portfolio Website",
      description:
        "Site de portfólio moderno e responsivo com animações suaves e design minimalista.",
      link: "https://exemplo.com",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
  ],
  contacts: [
    { id: "1", type: "GitHub", value: "https://github.com/joaosilva" },
    { id: "2", type: "LinkedIn", value: "https://linkedin.com/in/joaosilva" },
    { id: "3", type: "Instagram", value: "https://instagram.com/joaosilva" },
    { id: "4", type: "Email", value: "mailto:joao@exemplo.com" },
  ],
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
  const { user, skills, projects, contacts } = portfolioData;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-6">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage
                src={user.avatarUrl || "/placeholder.svg"}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className="text-3xl">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-xl text-muted-foreground">@{user.username}</p>
            </div>

            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {user.bio}
            </p>

            {/* Social Links */}
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
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Skills Section */}
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
                {skill.name}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="max-w-3xl mx-auto" />

        {/* Projects Section */}
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
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>
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
              </Card>
            ))}
          </div>
        </section>

        <Separator className="max-w-3xl mx-auto" />

        {/* Contact Section */}
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
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {user.firstName} {user.lastName}. Todos
            os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
