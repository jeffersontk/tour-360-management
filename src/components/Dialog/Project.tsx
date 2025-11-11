'use client'
import React from 'react'

import { Plus, FolderOpen, Users, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface props {
    open:boolean,
    setOpen: (status: boolean) => {}
}

export default function DialogProject({open, setOpen}:props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
            </Button>
            <Button className="shadow-glow" onClick={() => setOpen(false)}>
            Criar Projeto
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
