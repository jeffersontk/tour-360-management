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
const mockEnvironment = {
  id: "1",
  name: "Body",
  description: "Body shop",
  projectId: "1",
  projectName: "Tour Virtual Nissan Resende",
  tours: [
    {
      id: "1",
      name: "Área Social Completa",
      description: "Living, sala de jantar e varanda gourmet",
      type: "both",
      scenesCount: 5,
      hotspotsCount: 12,
      updatedAt: "2025-01-20",
    },
    {
      id: "2",
      name: "Suítes Premium",
      description: "Master suite e suítes secundárias",
      type: "web",
      scenesCount: 4,
      hotspotsCount: 8,
      updatedAt: "2025-01-18",
    },
  ],
};

export default function Page() {
  const { projectId, environmentId } = useParams();
  const [openNewTour, setOpenNewTour] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "web":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "vr":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "both":
        return "bg-primary/20 text-primary border-primary/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "web":
        return "Web";
      case "vr":
        return "VR";
      case "both":
        return "Web + VR";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary flex items-center justify-center w-full text-white  px-6 lg:px-0">
        <div className="flex justify-between max-w-[1280px] w-full py-4 ">
          <Link href={`/dashboard/projects/${projectId}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Projeto
            </Button>
          </Link>

          <div className="flex gap-4">
            <Button size="sm" className="gap-2 shadow-glow bg-white hover:bg-secondary text-primary">
              <Plus className="h-4 w-4" />
              Novo Tour
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-2">
                {mockEnvironment.projectName}
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
                {mockEnvironment.name}
              </h1>
              <p className="text-muted-foreground">{mockEnvironment.description}</p>
            </div>
            <Dialog open={openNewTour} onOpenChange={setOpenNewTour}>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Tour 360°</DialogTitle>
                  <DialogDescription>
                    Configure as informações básicas do tour virtual
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tour-name">Nome do Tour</Label>
                    <Input
                      id="tour-name"
                      placeholder="Ex: Área Social Completa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tour-description">Descrição</Label>
                    <Textarea
                      id="tour-description"
                      placeholder="Descreva o que será apresentado neste tour..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Modo de Visualização</Label>
                    <RadioGroup defaultValue="both">
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
                  <Button variant="outline" onClick={() => setOpenNewTour(false)}>
                    Cancelar
                  </Button>
                  <Button className="shadow-glow" onClick={() => setOpenNewTour(false)}>
                    Criar Tour
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-border/50 bg-white shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{mockEnvironment.tours.length}</div>
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
                {mockEnvironment.tours.reduce((sum, t) => sum + t.scenesCount, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {mockEnvironment.tours.reduce((sum, t) => sum + t.hotspotsCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tours List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Tours 360°</h2>
          {mockEnvironment.tours.map((tour) => (
            <Card
              key={tour.id}
              className="border-border/50 bg-white shadow-card transition-all hover:shadow-glow hover:border-primary/50"
            >
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  <div className="w-full">
                    <div className="flex items-center justify-between lg:justify-start gap-3 mb-2">
                      <CardTitle className="text-xl font-bold">{tour.name}</CardTitle>
                      <Badge className={getTypeColor(tour.type)}>
                        {getTypeLabel(tour.type)}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {tour.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/projects/${projectId}/environments/${environmentId}/tours/${tour.id}/preview`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </Link>
                    <Link href={`/dashboard/projects/${projectId}/environments/${environmentId}/tours/${tour.id}/settings`}>
                      <Button size="sm" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Configurar Tour
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cenas: </span>
                    <span className="font-medium text-foreground">{tour.scenesCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hotspots: </span>
                    <span className="font-medium text-foreground">{tour.hotspotsCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Atualizado: </span>
                    <span className="font-medium text-foreground">
                      {new Date(tour.updatedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

