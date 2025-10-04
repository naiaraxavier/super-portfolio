"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const projectSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  link: z.string().url("URL inválida").optional().or(z.literal("")),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type Project = {
  id: string;
  title: string;
  description?: string;
  link?: string;
  imageUrl?: string;
};

export default function ProjectsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (!userId) return;
    async function loadProjects() {
      try {
        const res = await fetch(`/api/profile/projects?userId=${userId}`);
        if (!res.ok) throw new Error("Erro ao buscar projetos");
        const data: Project[] = await res.json();
        setProjects(data);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os projetos.",
          variant: "destructive",
        });
      }
    }
    loadProjects();
  }, [userId]);

  async function onSubmit(data: ProjectFormValues) {
    if (!userId) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const body = editingProject
        ? { ...data, id: editingProject.id, userId }
        : { ...data, userId };
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch("/api/profile/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro ao salvar projeto");
      const savedProject: Project = await res.json();

      if (editingProject) {
        setProjects(
          projects.map((p) => (p.id === savedProject.id ? savedProject : p))
        );
        toast({
          title: "Projeto atualizado",
          description: "O projeto foi atualizado com sucesso.",
        });
      } else {
        setProjects([...projects, savedProject]);
        toast({
          title: "Projeto adicionado",
          description: "O projeto foi adicionado com sucesso.",
        });
      }

      form.reset();
      setIsDialogOpen(false);
      setEditingProject(null);
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o projeto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/profile/projects?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar");
      setProjects(projects.filter((p) => p.id !== id));
      toast({
        title: "Projeto removido",
        description: "O projeto foi removido com sucesso.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível deletar o projeto.",
        variant: "destructive",
      });
    }
  }

  function handleDialogChange(open: boolean) {
    setIsDialogOpen(open);
    if (!open) {
      setEditingProject(null);
      form.reset();
    }
  }

  function handleEdit(project: Project) {
    setEditingProject(project);
    form.reset({
      title: project.title,
      description: project.description || "",
      link: project.link || "",
      imageUrl: project.imageUrl || "",
    });
    setIsDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus projetos e trabalhos
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Editar Projeto" : "Novo Projeto"}
              </DialogTitle>
              <DialogDescription>
                {editingProject
                  ? "Atualize as informações do projeto"
                  : "Adicione um novo projeto ao seu portfólio"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Projeto</FormLabel>
                      <FormControl>
                        <Input placeholder="Meu Projeto Incrível" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva seu projeto, tecnologias utilizadas e resultados..."
                          className="min-h-24 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/500 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link do Projeto (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://meuprojeto.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link para o projeto ao vivo ou repositório
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://exemplo.com/imagem.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Imagem de capa do projeto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingProject ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhum projeto cadastrado
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece adicionando seus primeiros projetos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {project.imageUrl && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={
                      project.imageUrl ||
                      "/placeholder.svg?height=400&width=600" ||
                      "/placeholder.svg"
                    }
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    {project.description && (
                      <CardDescription className="mt-2 line-clamp-3">
                        {project.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                {project.link && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver Projeto
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className={project.link ? "" : "flex-1 bg-transparent"}
                  onClick={() => handleEdit(project)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-destructive hover:text-destructive"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
