"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NextImage from "next/image";
import {
  ArrowLeft,
  Plus,
  Save,
  Eye,
  Image as ImageIcon,
  MapPin,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type HotspotType = "text" | "image" | "video" | "link" | "navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type Scene = {
  id: string;
  name: string;
  thumbnail: string; // URL
  hotspotsCount: number;
  description?: string;
};

const initialScenes: Scene[] = [
  {
    id: "1",
    name: "Living Room Principal",
    thumbnail:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80&auto=format",
    hotspotsCount: 4,
    description: "",
  },
  {
    id: "2",
    name: "Varanda Gourmet",
    thumbnail:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format",
    hotspotsCount: 3,
    description: "",
  },
];

export default function Page() {
  const { projectId, tourId } = useParams<{ projectId: string; tourId: string }>();
  const isNewTour = tourId === "new";

  const [openNewScene, setOpenNewScene] = useState(false);

  // === state das cenas (grade) ===
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);

  // === dialog de edição ===
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingScene = useMemo(
    () => scenes.find((s) => s.id === editingId) ?? null,
    [editingId, scenes]
  );

  // formulário do dialog
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formHotspots, setFormHotspots] = useState<number>(0);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null); // preview local
  const [openNewHotspot, setOpenNewHotspot] = useState(false);
  const [hotspotType, setHotspotType] = useState<HotspotType>("text");

  const [hotspotName, setHotspotName] = useState("");
  const [hotspotDescription, setHotspotDescription] = useState("");
  const [hotspotVideoUrl, setHotspotVideoUrl] = useState("");
  const [hotspotLinkUrl, setHotspotLinkUrl] = useState("");
  const [hotspotTargetSceneId, setHotspotTargetSceneId] = useState<string | undefined>(undefined);


  // abrir o dialog já preenchendo os campos
  function handleOpenConfig(scene: Scene) {
    setEditingId(scene.id);
    setFormName(scene.name);
    setFormDescription(scene.description ?? "");
    setFormHotspots(scene.hotspotsCount);
    setFilePreviewUrl(null); // limpa preview, começamos com a imagem original
  }

  // trocar imagem (apenas preview local)
  function handlePickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFilePreviewUrl(url);
  }

  // adicionar hotspot (apenas contagem)
  function handleAddHotspot() {
    if (!editingScene) return;

    // aqui você poderia montar um objeto Hotspot e salvar em uma lista;
    // por enquanto, só incrementamos a contagem:
    setScenes((prev) =>
      prev.map((s) =>
        s.id === editingScene.id
          ? { ...s, hotspotsCount: s.hotspotsCount + 1 }
          : s
      )
    );

    // limpa campos e fecha modal de hotspot
    setHotspotName("");
    setHotspotDescription("");
    setHotspotVideoUrl("");
    setHotspotLinkUrl("");
    setHotspotTargetSceneId(undefined);
    setHotspotType("text");
    setOpenNewHotspot(false);
  }
  // salvar as mudanças no estado "scenes"
  function handleSave() {
    if (!editingScene) return;

    setScenes((prev) =>
      prev.map((s) =>
        s.id === editingScene.id
          ? {
              ...s,
              name: formName.trim() || s.name,
              description: formDescription,
              hotspotsCount: formHotspots,
              // se houve imagem escolhida, persiste a URL local (em prod, subir e salvar URL real)
              thumbnail: filePreviewUrl ?? s.thumbnail,
            }
          : s
      )
    );

    // fechar
    setEditingId(null);
    setFilePreviewUrl(null);
  }

  // fechar sem salvar
  function handleCancel() {
    setEditingId(null);
    setFilePreviewUrl(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary flex items-center justify-center w-full text-white px-6 lg:px-0">
        <div className="flex justify-between max-w-[1280px] w-full py-4">
          <Link href={`/dashboard/projects/${projectId}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Ambiente
            </Button>
          </Link>

          <div className="flex gap-4">
            <Button className="gap-2 shadow-glow bg-white text-primary hover:bg-secondary">
              <Save className="h-4 w-4" />
              Salvar Tour
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Tour Settings */}
          <div className="lg:col-span-1 space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {isNewTour ? "Criar Novo Tour 360°" : "Editar Tour 360°"}
            </h1>

            <Card className="border-border/50 bg-white shadow-card">
              <CardHeader>
                <CardTitle>Informações do Tour</CardTitle>
                <CardDescription>Configure os detalhes básicos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tour-name">Nome do Tour</Label>
                  <Input
                    id="tour-name"
                    placeholder="Ex: Área Social Completa"
                    defaultValue={isNewTour ? "" : "Área Social Completa"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tour-description">Descrição</Label>
                  <Textarea
                    id="tour-description"
                    placeholder="Descreva o que será apresentado neste tour..."
                    rows={4}
                    defaultValue={
                      isNewTour ? "" : "Living, sala de jantar e varanda gourmet"
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>Modo de Visualização</Label>
                  <RadioGroup defaultValue="both">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="web" id="web" />
                      <Label htmlFor="web" className="font-normal cursor-pointer">
                        Apenas Web
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vr" id="vr" />
                      <Label htmlFor="vr" className="font-normal cursor-pointer">
                        Apenas VR
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both" className="font-normal cursor-pointer">
                        Web + VR
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-white shadow-card">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Cenas:</span>
                  <span className="font-bold text-primary">{scenes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Hotspots:</span>
                  <span className="font-bold text-primary">
                    {scenes.reduce((sum, s) => sum + s.hotspotsCount, 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scenes Management */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-white shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Cenas do Tour</CardTitle>
                    <CardDescription>
                      Adicione e organize as cenas panorâmicas
                    </CardDescription>
                  </div>

                  <Dialog open={openNewScene} onOpenChange={setOpenNewScene}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 shadow-glow">
                        <Plus className="h-4 w-4" />
                        Adicionar Cena
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Cena</DialogTitle>
                        <DialogDescription>
                          Faça upload da imagem panorâmica 360° e configure a cena
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="scene-name">Nome da Cena</Label>
                          <Input id="scene-name" placeholder="Ex: Living Room Principal" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scene-image">Imagem 360°</Label>
                          <Input id="scene-image" type="file" accept="image/*" />
                          <p className="text-xs text-muted-foreground">
                            Formatos aceitos: JPG, PNG. Recomendado: resolução mínima
                            4096x2048
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scene-description">Descrição (opcional)</Label>
                          <Textarea
                            id="scene-description"
                            placeholder="Adicione detalhes sobre esta cena..."
                            rows={2}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenNewScene(false)}>
                          Cancelar
                        </Button>
                        <Button className="shadow-glow" onClick={() => setOpenNewScene(false)}>
                          Adicionar Cena
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {scenes.map((scene) => (
                    <Card
                      key={scene.id}
                      className="border-border/50 bg-card/50 hover:border-primary/50 transition-all cursor-pointer group"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <NextImage
                          src={scene.thumbnail}
                          alt={scene.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary/80 backdrop-blur-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {scene.hotspotsCount}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {scene.name}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => handleOpenConfig(scene)}
                        >
                          <Settings className="h-4 w-4" />
                          Configurar Cena
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add Scene Card */}
                  <Dialog open={openNewScene} onOpenChange={setOpenNewScene}>
                    <DialogTrigger asChild>
                      <Card className="border-border/50 border-dashed bg-card/30 hover:border-primary/50 hover:bg-card/50 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center aspect-video">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
                            <ImageIcon className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                            Adicionar Nova Cena
                          </p>
                        </div>
                      </Card>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog de Configuração de Cena */}
        <Dialog
          open={!!editingScene}
          onOpenChange={(open) => !open && handleCancel()}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Configurar Cena</DialogTitle>
              <DialogDescription>
                Edite as configurações e hotspots da cena selecionada
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-scene-name">Nome da Cena</Label>
                <Input
                  id="edit-scene-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Living Room Principal"
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem 360° Atual</Label>
                {/* Altura reduzida aqui */}
                <div className="relative h-40 overflow-hidden rounded-lg border border-border">
                  {editingScene && (
                    <NextImage
                      src={filePreviewUrl ?? editingScene.thumbnail}
                      alt={editingScene.name}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-scene-image">Trocar Imagem 360°</Label>
                <Input
                  id="edit-scene-image"
                  type="file"
                  accept="image/*"
                  onChange={handlePickImage}
                />
                <p className="text-xs text-muted-foreground">
                  Deixe em branco para manter a imagem atual
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-scene-description">Descrição (opcional)</Label>
                <Textarea
                  id="edit-scene-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Adicione detalhes sobre esta cena..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Hotspots</Label>
                    <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setOpenNewHotspot(true)}
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar Hotspot
                  </Button>
                </div>

                <div className="rounded-lg border border-border p-3 bg-muted/30">
                  <p className="text-sm text-muted-foreground text-center py-2">
                    {formHotspots} hotspot(s) configurado(s)
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button className="shadow-glow" onClick={handleSave}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openNewHotspot} onOpenChange={setOpenNewHotspot}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Adicionar Hotspot</DialogTitle>
              <DialogDescription>Configure um ponto de interesse interativo na cena</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="hotspot-name">Nome do Hotspot</Label>
                <Input
                  id="hotspot-name"
                  value={hotspotName}
                  onChange={(e) => setHotspotName(e.target.value)}
                  placeholder="Ex: Varanda Gourmet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hotspot-type">Tipo de Hotspot</Label>
                <Select value={hotspotType} onValueChange={(v: HotspotType) => setHotspotType(v)}>
                  <SelectTrigger id="hotspot-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto Informativo</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="link">Link Externo</SelectItem>
                    <SelectItem value="navigation">Navegação para Cena</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hotspotType === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="hotspot-description">Descrição</Label>
                  <Textarea
                    id="hotspot-description"
                    value={hotspotDescription}
                    onChange={(e) => setHotspotDescription(e.target.value)}
                    placeholder="Adicione o texto que será exibido..."
                    rows={3}
                  />
                </div>
              )}

              {hotspotType === "image" && (
                <div className="space-y-2">
                  <Label htmlFor="hotspot-image">Upload de Imagem</Label>
                  <Input id="hotspot-image" type="file" accept="image/*" />
                </div>
              )}

              {hotspotType === "video" && (
                <div className="space-y-2">
                  <Label htmlFor="hotspot-video">URL do Vídeo</Label>
                  <Input
                    id="hotspot-video"
                    value={hotspotVideoUrl}
                    onChange={(e) => setHotspotVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              )}

              {hotspotType === "link" && (
                <div className="space-y-2">
                  <Label htmlFor="hotspot-link">URL de Destino</Label>
                  <Input
                    id="hotspot-link"
                    value={hotspotLinkUrl}
                    onChange={(e) => setHotspotLinkUrl(e.target.value)}
                    placeholder="https://exemplo.com"
                  />
                </div>
              )}

              {hotspotType === "navigation" && (
                <div className="space-y-2">
                  <Label htmlFor="hotspot-target">Cena de Destino</Label>
                  <Select
                    value={hotspotTargetSceneId}
                    onValueChange={(v) => setHotspotTargetSceneId(v)}
                  >
                    <SelectTrigger id="hotspot-target">
                      <SelectValue placeholder="Selecione a cena" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenes.map((scene) => (
                        <SelectItem key={scene.id} value={scene.id}>
                          {scene.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Posição na Cena</Label>
                <p className="text-xs text-muted-foreground">
                  Você poderá posicionar o hotspot visualmente no preview 360°
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNewHotspot(false)}>Cancelar</Button>
              <Button className="shadow-glow" onClick={handleAddHotspot}>
                Adicionar Hotspot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
