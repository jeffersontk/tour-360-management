'use client'
import { ArrowLeft, Plus, Eye, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

// Mock data
const mockProject = {
  id: "1",
  name: "Tour Virtual Nissan Resende",
  description: "Tour virtual da fabrica Nissan planta Resende",
  client: "Nissan Brasil",
  status: "published",
  createdAt: "2025-01-15",
  environments: [
    {
      id: "1",
      name: "Body",
      description: "Body shop",
      toursCount: 2,
      scenesCount: 9,
      updatedAt: "2025-01-20",
    },
    {
      id: "2",
      name: "Paint",
      description: "Espaços compartilhados do condomínio",
      toursCount: 1,
      scenesCount: 3,
      updatedAt: "2025-01-18",
    },
  ],
};

export default function Page() {
  const { projectId } = useParams<{ projectId: string }>();
  const [openNewEnvironment, setOpenNewEnvironment] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary flex items-center justify-center w-full text-white">
        <div className="flex justify-between max-w-[1280px] w-full py-4">
          <Link href={`/dashboard`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Ambiente
            </Button>
          </Link>

          <div className="flex gap-4">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
            <Button className="gap-2 shadow-glow bg-white text-primary hover:bg-secondary">
              <Plus className="h-4 w-4" />  
              Novo Ambiente
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
                {mockProject.name}
              </h1>
              <p className="text-muted-foreground mb-4">{mockProject.description}</p>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cliente: </span>
                  <span className="font-medium text-foreground">{mockProject.client}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Criado em: </span>
                  <span className="font-medium text-foreground">
                    {new Date(mockProject.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              
              <Dialog open={openNewEnvironment} onOpenChange={setOpenNewEnvironment}>
                <DialogTrigger asChild>
              
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Ambiente</DialogTitle>
                    <DialogDescription>
                      Ambientes organizam seus tours por locais ou áreas específicas
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="env-name">Nome do Ambiente</Label>
                      <Input
                        id="env-name"
                        placeholder="Ex: Apartamento Modelo, Áreas Comuns"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="env-description">Descrição</Label>
                      <Textarea
                        id="env-description"
                        placeholder="Descreva este ambiente..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenNewEnvironment(false)}>
                      Cancelar
                    </Button>
                    <Button className="shadow-glow" onClick={() => setOpenNewEnvironment(false)}>
                      Criar Ambiente
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-border/50 bg-white shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Ambientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{mockProject.environments.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {mockProject.environments.reduce((sum, e) => sum + e.toursCount, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Cenas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {mockProject.environments.reduce((sum, e) => sum + e.scenesCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environments List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Ambientes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mockProject.environments.map((environment) => (
              <Link key={environment.id} href={`/dashboard/projects/${projectId}/environments/${environment.id}`}>
                <Card className="h-full border-border/50 bg-white shadow-card transition-all hover:shadow-glow hover:border-primary/50 cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {environment.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {environment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tours:</span>
                        <span className="font-medium text-primary">{environment.toursCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Cenas:</span>
                        <span className="font-medium text-primary">{environment.scenesCount}</span>
                      </div>
                      <div className="pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          Atualizado em {new Date(environment.updatedAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
