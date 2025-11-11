'use client';
import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SceneData {
  id?: string;
  name: string;
  description?: string;
  thumbnail?: string;
}

interface Props {
  open: boolean;
  setOpen: (status: boolean) => void;
  mode: "create" | "edit";
  initialData?: SceneData;
  onSave: (data: SceneData) => void;
}

export default function DialogScene({ open, setOpen, mode, initialData, onSave }: Props) {
  const [formData, setFormData] = useState<SceneData>({
    name: "",
    description: "",
    thumbnail: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (key: keyof SceneData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Adicionar Nova Cena" : "Editar Cena"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Faça upload da imagem panorâmica 360° e configure a nova cena."
              : "Atualize as informações desta cena panorâmica."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="scene-name">Nome da Cena</Label>
            <Input
              id="scene-name"
              placeholder="Ex: Living Room Principal"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scene-image">Imagem 360°</Label>
            <Input
              id="scene-image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChange(
                  "thumbnail",
                  e.target.files?.[0]?.name ?? formData.thumbnail ?? ""
                )
              }
            />
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: JPG, PNG. Recomendado: resolução mínima 4096x2048
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scene-description">Descrição (opcional)</Label>
            <Textarea
              id="scene-description"
              placeholder="Adicione detalhes sobre esta cena..."
              rows={2}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button className="shadow-glow" onClick={handleSubmit}>
            {mode === "create" ? "Adicionar Cena" : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
