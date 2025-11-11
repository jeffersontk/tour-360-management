'use client'
import { Plus, FolderOpen, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock data
const projects = [
  {
    id: "1",
    name: "Tour Virtual Nissan Resende",
    description: "Tour virtual da fabrica Nissan planta Resende",
    client: "Nissan Brasil",
    status: "published",
    toursCount: 3,
    scenesCount: 12,
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Museu Histórico",
    description: "Tour interativo pelas exposições permanentes",
    client: "Museu Nacional",
    status: "draft",
    toursCount: 1,
    scenesCount: 8,
    createdAt: "2025-01-20",
  },
  {
    id: "3",
    name: "Hotel Resort Paradiso",
    description: "Apresentação completa das instalações",
    client: "Resort Paradiso",
    status: "published",
    toursCount: 5,
    scenesCount: 24,
    createdAt: "2025-01-10",
  },
];

export default function Page() {
  const [openNewProject, setOpenNewProject] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-primary/20 text-primary border-primary/30";
      case "draft":
        return "bg-muted text-muted-foreground border-border";
      case "archived":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Rascunho";
      case "archived":
        return "Arquivado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary p-8 text-white flex items-center justify-center w-full ">
        <div className="max-w-[1280px] w-full">
          <div className="mb-8 flex items-center justify-between ">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Gerenciador de Tours 360°
              </h1>
              <p className="">
                SENAI ISI SVP
              </p>
            </div>
            <Dialog open={openNewProject} onOpenChange={setOpenNewProject}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2 shadow-glow bg-white text-primary hover:bg-secondary">
                  <Plus className="h-5 w-5" />
                  Novo Projeto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Projeto</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do projeto de tour virtual
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Nome do Projeto</Label>
                    <Input
                      id="project-name"
                      placeholder="Ex: Tour Virtual Imóvel Luxo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Descrição</Label>
                    <Textarea
                      id="project-description"
                      placeholder="Descreva o projeto..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-client">Cliente</Label>
                    <Input
                      id="project-client"
                      placeholder="Nome do cliente (opcional)"
                    />
                  </div>
                   <div className="space-y-3">
                    <Label>Modo de Visualização</Label>
                    <RadioGroup defaultValue="both" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="web" id="web-new" />
                        <Label htmlFor="web-new" className="font-normal cursor-pointer">
                          Apenas Web
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vr" id="vr-new" />
                        <Label htmlFor="vr-new" className="font-normal cursor-pointer">
                          Apenas VR
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both-new" />
                        <Label htmlFor="both-new" className="font-normal cursor-pointer">
                          Web + VR
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenNewProject(false)}>
                    Cancelar
                  </Button>
                  <Button className="shadow-glow" onClick={() => setOpenNewProject(false)}>
                    Criar Projeto
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="border-border/50 bg-white shadow-card transition-all hover:shadow-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Projetos
                </CardTitle>
                <FolderOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{projects.length}</div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-white shadow-card transition-all hover:shadow-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tours Ativos
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {projects.reduce((sum, p) => sum + p.toursCount, 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-white shadow-card transition-all hover:shadow-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cenas Totais
                </CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {projects.reduce((sum, p) => sum + p.scenesCount, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-6 py-8">
        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="h-full border-border/50 bg-white shadow-card transition-all hover:shadow-glow hover:border-primary/50 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="font-medium text-foreground">{project.client}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tours:</span>
                      <span className="font-medium text-primary">{project.toursCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cenas:</span>
                      <span className="font-medium text-primary">{project.scenesCount}</span>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        Criado em {new Date(project.createdAt).toLocaleDateString("pt-BR")}
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
  );
};
