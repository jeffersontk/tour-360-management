// src/components/three/SceneStandalone.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { useTexture, OrbitControls } from '@react-three/drei';
import { XR, createXRStore, type XRStore } from '@react-three/xr';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import HeadLook from '../HeadLook';

export type HotspotKind = 'image' | 'video' | 'text';

export type Hotspot = {
  id: string;
  position: [number, number, number];
  kind: HotspotKind;
  title?: string;
  mediaUrl?: string;
  description?: string;
};

type SceneStandaloneProps = {
  src: string;
  hotspots?: Hotspot[];
  onHotspotClick?: (h: Hotspot) => void;
  enableZoom?: boolean;
  autoRotate?: boolean;
  xrStore?: XRStore;       // opcional: use um store compartilhado
  enableXR?: boolean;      // true = monta <XR> e habilita WebXR no renderer
};

function Panorama({ src }: { src: string }) {
  const tex = useTexture(src);
  const texture = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [tex]);

  return (
    <mesh rotation={[0, Math.PI, 0]}>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function POIs({
  hotspots = [],
  onClick,
}: {
  hotspots?: Hotspot[];
  onClick?: (h: Hotspot) => void;
}) {
  const iconImage = useTexture('/assets/spot-image.png');
  const iconVideo = useTexture('/assets/spot-video.png');
  const iconText  = useTexture('/assets/spot-text.png');

  const textureFor = (kind: HotspotKind) =>
    kind === 'image' ? iconImage : kind === 'video' ? iconVideo : iconText;

  return (
    <>
      {hotspots.map((h) => (
        <sprite
          key={h.id}
          position={h.position}
          scale={[8, 8, 8]}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(h);
          }}
        >
          <spriteMaterial
            map={textureFor(h.kind)}
            depthTest={false}
            depthWrite={false}
            sizeAttenuation
            transparent
          />
        </sprite>
      ))}
    </>
  );
}

export default function SceneStandalone({
  src,
  hotspots,
  onHotspotClick,
  enableZoom = false,
  autoRotate = false,
  xrStore: extStore,
  enableXR = false,
}: SceneStandaloneProps) {
  // Se não veio store externo, cria um local
  const xrStore = useMemo(() => extStore ?? createXRStore(), [extStore]);
  const controlsRef = useRef<any>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // “Está apresentando” = existe XRSession ativa no store
  const [isPresenting, setIsPresenting] = useState(false);
  useEffect(() => {
    // Assina mudanças de sessão (mais robusto que depender de isPresenting do hook)
    const unsub = xrStore.subscribe((s) => {
      setIsPresenting(!!s.session);
    });
    setIsPresenting(!!xrStore.getState().session);
    return unsub;
  }, [xrStore]);

  // Liga/desliga WebXR no renderer + teardown completo no unmount
  useEffect(() => {
    const gl = rendererRef.current;
    if (!gl) return;

    // habilita/desabilita WebXR no renderer
    (gl as any).xr.enabled = !!enableXR;

      return () => {
      try { (xrStore as any).setSession?.(undefined as any); } catch {}
      try { (gl as any).xr.setSession?.(null); } catch {}

      // garante desligar o XR no renderer
      (gl as any).xr.enabled = false;

      gl.setAnimationLoop(null);
      gl.dispose();
      rendererRef.current = null;

      // se o “WebXR Emulator Extension” estiver ativo, derruba a overlay
      try { (xrStore.getState() as any).emulator?.disconnect?.(); } catch {}
    };
  }, [enableXR, xrStore]);

  return (
    <div className="absolute inset-0">
      <Canvas
        className="r3f-canvas"                           
        style={{ touchAction: 'none' }}  
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
            rendererRef.current = gl;
            gl.setClearColor(0x000000, 1);
            (gl as any).xr.enabled = !!enableXR;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
          }}
      >
        {enableXR ? (
          <XR store={xrStore}>
            <ambientLight intensity={0.6} />
            <Panorama src={src} />
            <POIs hotspots={hotspots} onClick={onHotspotClick} />
            <HeadLook />
            <OrbitControls
              ref={controlsRef}
              makeDefault                             
              enableZoom={!isPresenting && enableZoom}
              enablePan={false}
              minDistance={0.05}
              maxDistance={2}
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={-0.35}
              autoRotate={autoRotate}
              autoRotateSpeed={0.3}
              touches={{ ONE: 1, TWO: 2 }}
            />
          </XR>
        ) : (
          <>
            <ambientLight intensity={0.6} />
            <Panorama src={src} />
            <POIs hotspots={hotspots} onClick={onHotspotClick} />
            <OrbitControls
              ref={controlsRef}
              makeDefault                             
              enableZoom={enableZoom}
              enablePan={false}
              minDistance={0.05}
              maxDistance={2}
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={-0.35}
              autoRotate={autoRotate}
              autoRotateSpeed={0.3}
              touches={{ ONE: 1, TWO: 2 }}
            />
          </>
        )}
      </Canvas>
    </div>
  );
}
