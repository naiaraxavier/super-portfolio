"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const skillSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  iconUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

type SkillFormValues = z.infer<typeof skillSchema>;

type Skill = {
  id: string;
  name: string;
  iconUrl?: string;
};

export default function SkillsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      iconUrl: "",
    },
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchSkills();
    }
  }, [session]);

  async function fetchSkills() {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/profile/skills?userId=${session.user.id}`
      );
      if (!response.ok) throw new Error("Erro ao buscar habilidades");
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error("[v0] Erro ao buscar skills:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as habilidades.",
        variant: "destructive",
      });
    }
  }

  async function onSubmit(data: SkillFormValues) {
    if (!session?.user?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingSkill) {
        const response = await fetch("/api/profile/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingSkill.id,
            ...data,
            userId: session.user.id,
          }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar habilidade");

        const updatedSkill = await response.json();
        setSkills(
          skills.map((s) => (s.id === editingSkill.id ? updatedSkill : s))
        );
        toast({
          title: "Habilidade atualizada",
          description: "A habilidade foi atualizada com sucesso.",
        });
      } else {
        const response = await fetch("/api/profile/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, userId: session.user.id }),
        });

        if (!response.ok) throw new Error("Erro ao criar habilidade");

        const newSkill = await response.json();
        setSkills([newSkill, ...skills]);
        toast({
          title: "Habilidade adicionada",
          description: "A habilidade foi adicionada com sucesso.",
        });
      }

      form.reset();
      setIsDialogOpen(false);
      setEditingSkill(null);
    } catch (error) {
      console.error("[v0] Erro ao salvar skill:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a habilidade.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(skill: Skill) {
    setEditingSkill(skill);
    form.reset({
      name: skill.name,
      iconUrl: skill.iconUrl || "",
    });
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/profile/skills?id=${id}&userId=${session.user.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar habilidade");

      setSkills(skills.filter((s) => s.id !== id));
      toast({
        title: "Habilidade removida",
        description: "A habilidade foi removida com sucesso.",
      });
    } catch (error) {
      console.error("[v0] Erro ao deletar skill:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a habilidade.",
        variant: "destructive",
      });
    }
  }

  function handleDialogChange(open: boolean) {
    setIsDialogOpen(open);
    if (!open) {
      setEditingSkill(null);
      form.reset();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habilidades</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas competências e conhecimentos
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Habilidade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Editar Habilidade" : "Nova Habilidade"}
              </DialogTitle>
              <DialogDescription>
                {editingSkill
                  ? "Atualize as informações da habilidade"
                  : "Adicione uma nova habilidade ao seu portfólio"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Habilidade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="React, TypeScript, Design..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="iconUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Ícone (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://exemplo.com/icone.svg"
                          {...field}
                        />
                      </FormControl>
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
                    {editingSkill ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhuma habilidade cadastrada
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece adicionando suas primeiras habilidades
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  {skill.iconUrl && (
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={skill.iconUrl || "/placeholder.svg"}
                        alt={skill.name}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-base">{skill.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEdit(skill)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-destructive hover:text-destructive"
                  onClick={() => handleDelete(skill.id)}
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
