"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Github,
  Linkedin,
  Instagram,
  MailIcon,
  Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  type: z.string().min(1, "Selecione um tipo de contato"),
  value: z.string().min(3, "Valor deve ter no mínimo 3 caracteres"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type Contact = {
  id: string;
  type: string;
  value: string;
};

const contactTypes = [
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin },
  { value: "GitHub", label: "GitHub", icon: Github },
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Email", label: "Email", icon: MailIcon },
  { value: "Website", label: "Website", icon: Globe },
  { value: "Twitter", label: "Twitter", icon: Globe },
  { value: "Behance", label: "Behance", icon: Globe },
  { value: "Dribbble", label: "Dribbble", icon: Globe },
];

export default function ContactsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { type: "", value: "" },
  });

  useEffect(() => {
    if (!userId) return;
    async function loadContacts() {
      try {
        const res = await fetch(`/api/profile/contacts?userId=${userId}`);
        if (!res.ok) throw new Error("Erro ao buscar contatos");
        const data: Contact[] = await res.json();
        setContacts(data);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os contatos.",
          variant: "destructive",
        });
      }
    }
    loadContacts();
  }, [userId]);

  async function onSubmit(data: ContactFormValues) {
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
      const body = editingContact
        ? { ...data, id: editingContact.id, userId }
        : { ...data, userId };
      const method = editingContact ? "PUT" : "POST";

      const res = await fetch("/api/profile/contacts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro ao salvar contato");
      const savedContact: Contact = await res.json();

      if (editingContact) {
        setContacts(
          contacts.map((c) => (c.id === savedContact.id ? savedContact : c))
        );
        toast({ title: "Contato atualizado" });
      } else {
        setContacts([...contacts, savedContact]);
        toast({ title: "Contato adicionado" });
      }

      form.reset();
      setEditingContact(null);
      setIsDialogOpen(false);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o contato.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(contact: Contact) {
    setEditingContact(contact);
    form.reset({ type: contact.type, value: contact.value });
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/profile/contacts?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar");
      setContacts(contacts.filter((c) => c.id !== id));
      toast({ title: "Contato removido" });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível deletar o contato.",
        variant: "destructive",
      });
    }
  }

  function handleDialogChange(open: boolean) {
    setIsDialogOpen(open);
    if (!open) {
      setEditingContact(null);
      form.reset();
    }
  }

  function getContactIcon(type: string) {
    return contactTypes.find((ct) => ct.value === type)?.icon || Globe;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contatos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus links de redes sociais e contatos
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Adicionar Contato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Editar Contato" : "Novo Contato"}
              </DialogTitle>
              <DialogDescription>
                {editingContact
                  ? "Atualize as informações do contato"
                  : "Adicione um novo link de contato ao seu portfólio"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Contato</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contactTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="h-4 w-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL ou Endereço</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/seu-perfil"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Cole o link completo ou endereço de email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingContact ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhum contato cadastrado
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece adicionando seus links de redes sociais e contatos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => {
            const Icon = getContactIcon(contact.type);
            return (
              <Card key={contact.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">
                        {contact.type}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <a
                      href={contact.value}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Abrir
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => handleEdit(contact)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-destructive hover:text-destructive"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
