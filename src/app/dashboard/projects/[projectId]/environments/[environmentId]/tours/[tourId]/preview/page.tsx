'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Maximize2, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import SceneStandalone, { type Hotspot } from '@/components/three/SceneStandalone';
import { createXRStore, type XRStore } from '@react-three/xr';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import db from '@/mocks/db.json';

type Scene = { id: string; name: string; image: string; thumb?: string; hotspots: Hotspot[] };
type TourMode = 'web' | 'vr' | 'both';

export default function Page() {
  const { projectId, tourId } = useParams<{ projectId: string; tourId: string }>();
  const searchParams = useSearchParams();
  const initialSceneId = searchParams.get('sceneId') || undefined;
  const [xrCapable, setXrCapable] = useState(false);

  // carrega cenas do tour
  const scenes: Scene[] = useMemo(() => {
    return (db.scenes as any[]).filter(s => s.tourId === tourId) as Scene[];
  }, [tourId]);

  // se vier sceneId, abre nessa; senão, primeira
  const initialIndex = useMemo(() => {
    if (!initialSceneId) return 0;
    const idx = scenes.findIndex(s => s.id === initialSceneId);
    return idx >= 0 ? idx : 0;
  }, [initialSceneId, scenes]);

  const [current, setCurrent] = useState(initialIndex);
  const [showMenu, setShowMenu] = useState(false);
  const [mode, setMode] = useState<'ask' | 'web'>('ask');

  // descobre o tipo do tour para decidir se pergunta ou vai direto
  const tour = useMemo(() => (db.tours as any[]).find(t => t.id === tourId && t.projectId === projectId), [tourId, projectId]);
  const tourType: TourMode = tour?.type ?? 'both';

  const xrStore = useMemo<XRStore>(() => createXRStore(), []);

  const scene = scenes[current];
  const [poi, setPoi] = useState<Hotspot | null>(null);
  // helpers
const isLocalhost = typeof window !== "undefined" && 
  (location.hostname === "localhost" || location.hostname === "127.0.0.1");

const isSecure = typeof window !== "undefined" && location.protocol === "https:";

// XR só é permitido em https ou localhost
const xrAllowed = isSecure || isLocalhost;

  const next = () => setCurrent(p => (p + 1) % scenes.length);
  const prev = () => setCurrent(p => (p - 1 + scenes.length) % scenes.length);

  const startWeb = () => setMode('web');
  const startVR = () => {
    setMode('web');
    requestAnimationFrame(() => xrStore.enterVR());
  };

  useEffect(() => {
  let mounted = true;
  (async () => {
    if (!xrAllowed || !(navigator as any).xr?.isSessionSupported) {
      mounted && setXrCapable(false);
      return;
    }
    const ok = await (navigator as any).xr.isSessionSupported("immersive-vr");
    mounted && setXrCapable(!!ok);
  })();
  return () => { mounted = false; };
}, [xrAllowed]);

useMemo(() => {
  if (tourType === "web") {
    setMode("web");
  } else if (tourType === "vr") {
    // Em rede sem https/localhost, força web
    if (xrAllowed) {
      setMode("web");
      requestAnimationFrame(() => xrStore.enterVR());
    } else {
      setMode("web");
    }
  } else {
    // both
    setMode(xrAllowed ? "ask" : "web");
  }
}, [tourType, xrStore, xrAllowed]);


  
  const canShowXR = xrCapable && tourType !== 'web';

  if (!scene) {
    return (
      <div className="p-8">
        <p>Nenhuma cena encontrada para esse tour.</p>
        <Link href={`/dashboard/projects/${projectId}`}>
          <Button className="mt-4">Voltar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-md p-4 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <Link href={`/dashboard/projects/${projectId}`}>
            <Button variant="ghost" className="gap-2 text-lg">
              <ArrowLeft className="h-6 w-6" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {canShowXR && (
              <Button variant="ghost" size="icon" onClick={() => xrStore.enterVR()} className="gap-2">
                VR
              </Button>
            )}
            <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm hover:text-white">
              Cena {current + 1} de {scenes.length}
            </Badge>
            <Button variant="ghost" size="icon" onClick={() => setShowMenu(v => !v)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => document.documentElement.requestFullscreen().catch(() => {})}>
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Viewer 360 */}
      <div className="relative h-screen w-full overflow-hidden">
        <SceneStandalone
          src={scene.image}
          xrStore={xrStore}
          hotspots={scene.hotspots}
          enableZoom={true}
          autoRotate={false}
          onHotspotClick={setPoi}
          enableXR={mode !== 'web'}  
        />

        {/* Navegação inferior */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex gap-8 items-center justify-center text-white">
            <Button size="icon" onClick={prev} className="bg-white/25 backdrop-blur-md border border-border/50 rounded-full px-3 py-3">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="bg-white/25 text-white backdrop-blur-md border border-border/50 rounded-full px-6 py-3">
              <p className="text-lg font-semibold ">{scene.name}</p>
            </div>
            <Button size="icon" onClick={next} className="bg-white/25 backdrop-blur-md border border-border/50 rounded-full px-3 py-3">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Menu lateral (cenas) */}
      {showMenu && (
        <div className="absolute top-0 right-0 h-screen w-80 bg-white/25 backdrop-blur-xl border-l border-border/50 z-10 p-6 pt-20 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 text-foreground">Navegação</h3>
          <div className="space-y-3">
            {scenes.map((s, index) => (
              <Card
                key={s.id}
                onClick={() => setCurrent(index)}
                className={`p-3 cursor-pointer transition-all bg-white/50 ${
                  index === current ? 'border-primary shadow-glow bg-primary/10' : 'border-border/50 hover:border-primary/50'
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image src={s.thumb ?? s.image} alt={s.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Cena {index + 1}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal de escolha Web/VR (só quando both) */}
      {mode === 'ask' && tourType === 'both' && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/60 backdrop-blur-sm">
          <div className="w-[520px] max-w-[92vw] rounded-2xl border border-white/15 bg-background/90 p-6 shadow-2xl">
            <h3 className="mb-2 text-xl font-semibold">Como você quer visualizar?</h3>
            <p className="mb-6 text-sm text-muted-foreground">Escolha entre a visualização Web (mouse/gestos) ou imersiva em VR (WebXR).</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={startWeb}>Web</Button>
              <Button onClick={startVR} className="shadow-glow">VR (WebXR)</Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de POI */}
      <Dialog open={!!poi} onOpenChange={(open) => !open && setPoi(null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{poi?.title ?? 'Ponto de Interesse'}</DialogTitle>
            {poi?.description && <DialogDescription>{poi.description}</DialogDescription>}
          </DialogHeader>

          {poi?.kind === 'image' && poi.mediaUrl && (
            <div className="relative w-full aspect-video overflow-hidden rounded-lg">
              <Image src={poi.mediaUrl} alt={poi.title ?? ''} fill className="object-cover" />
            </div>
          )}
          {poi?.kind === 'video' && poi.mediaUrl && (
            <video controls className="w-full rounded-lg">
              <source src={poi.mediaUrl} />
            </video>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
