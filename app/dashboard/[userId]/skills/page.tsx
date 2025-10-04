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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const skillSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  icon: z.any().optional(), // arquivo File
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
    defaultValues: { name: "", icon: "" },
  });

  useEffect(() => {
    if (session?.user?.id) fetchSkills();
  }, [session]);

  async function fetchSkills() {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/profile/skills?userId=${session.user.id}`);
      if (!res.ok) throw new Error("Erro ao buscar skills");
      const data = await res.json();
      setSkills(data);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as habilidades.",
        variant: "destructive",
      });
    }
  }

  // Função para upload do ícone
  async function handleIconUpload(file: File) {
    const formData = new FormData();
    formData.append("icon", file); // deve bater com o backend

    const res = await fetch("/api/profile/skills/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao enviar ícone");

    return data.iconUrl;
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
      let iconUrl = editingSkill?.iconUrl || "";

      // Se for um arquivo, faz upload
      if (data.icon instanceof File) {
        iconUrl = await handleIconUpload(data.icon);
      }

      const body = editingSkill
        ? { ...data, id: editingSkill.id, userId: session.user.id, iconUrl }
        : { ...data, userId: session.user.id, iconUrl };

      const method = editingSkill ? "PUT" : "POST";

      const res = await fetch("/api/profile/skills", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro ao salvar habilidade");

      const savedSkill: Skill = await res.json();

      if (editingSkill) {
        setSkills(skills.map((s) => (s.id === savedSkill.id ? savedSkill : s)));
        toast({
          title: "Habilidade atualizada",
          description: "A habilidade foi atualizada com sucesso.",
        });
      } else {
        setSkills([savedSkill, ...skills]);
        toast({
          title: "Habilidade adicionada",
          description: "A habilidade foi adicionada com sucesso.",
        });
      }

      form.reset();
      setEditingSkill(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
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
    form.reset({ name: skill.name, icon: "" });
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(
        `/api/profile/skills?id=${id}&userId=${session.user.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Erro ao deletar habilidade");
      setSkills(skills.filter((s) => s.id !== id));
      toast({
        title: "Habilidade removida",
        description: "A habilidade foi removida com sucesso.",
      });
    } catch {
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
      {/* Header e Botão */}
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
                        <Input placeholder="React, TypeScript..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone da Habilidade (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
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

      {/* Lista de Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardHeader className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={skill.iconUrl || "/placeholder.svg"}
                    alt={skill.name}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <CardTitle className="text-base">{skill.name}</CardTitle>
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
    </div>
  );
}
