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
  /** passe um store compartilhado se você controlar o enterVR() do lado de fora */
  xrStore?: XRStore;
  /** quando true, monta <XR> e habilita WebXR no renderer (não chama enterVR automaticamente) */
  enableXR?: boolean;
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
  const iconText = useTexture('/assets/spot-text.png');

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
  enableZoom = true,
  autoRotate = false,
  xrStore: extStore,
  enableXR = false,
}: SceneStandaloneProps) {
  // store XR (compartilhado ou local)
  const xrStore = useMemo(() => extStore ?? createXRStore(), [extStore]);

  const controlsRef = useRef<any>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // “tap-to-start” para liberar gestos/sensores no mobile/Quest
  const [started, setStarted] = useState(false);

  // sessão ativa?
  const [isPresenting, setIsPresenting] = useState(false);
  useEffect(() => {
    const unsub = xrStore.subscribe((s) => setIsPresenting(!!s.session));
    setIsPresenting(!!xrStore.getState().session);
    return unsub;
  }, [xrStore]);

  // habilita/desabilita WebXR no renderer e faz teardown limpo
  useEffect(() => {
    const gl = rendererRef.current as any;
    if (!gl) return;

    // habilita/desabilita WebXR no renderer
    gl.xr.enabled = !!enableXR;

    return () => {
      // encerra a XRSession se existir (API pública)
      try {
        const s: XRSession | undefined = xrStore.getState().session as any;
        if (s) {
          // end() pode ser async; não precisamos await aqui
          s.end().catch(() => {});
        }
      } catch {}

      // limpa o renderer
      try { gl.xr.setSession?.(null); } catch {}
      gl.xr.enabled = false;
      try { gl.setAnimationLoop?.(null); } catch {}
      try { gl.dispose?.(); } catch {}
      rendererRef.current = null;
    };
  }, [enableXR, xrStore]);


  // handler do primeiro toque: pede permissão e libera controles
  const handleStart = async () => {
    try {
      // iOS/alguns Androids exigem este pedido explícito
      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof (DeviceMotionEvent as any).requestPermission === 'function'
      ) {
        await (DeviceMotionEvent as any).requestPermission().catch(() => {});
      }
    } finally {
      setStarted(true);
    }
  };

  return (
    <div className="absolute inset-0" style={{ touchAction: 'none' }}>
      {!started && (
        <button
          onClick={handleStart}
          className="absolute inset-0 z-20 grid place-items-center bg-black/70 text-white"
        >
          <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 shadow-2xl backdrop-blur-md">
            <p className="text-base font-medium">Toque para iniciar</p>
            <p className="mt-1 text-xs opacity-80">
              Ativamos controles e sensores para sua experiência 360°
            </p>
          </div>
        </button>
      )}

      {started && (
        <Canvas
          camera={{ position: [0, 0, 0.1], fov: 75 }}
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
              {/* VR: a câmera acompanha a cabeça */}
              <HeadLook />
              {/* Enquanto estiver em VR, desabilita zoom p/ evitar conflito */}
              <OrbitControls
                ref={controlsRef}
                enableZoom={!isPresenting && enableZoom}
                enablePan={false}
                minDistance={0.05}
                maxDistance={2}
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={-0.35}
                autoRotate={autoRotate}
                autoRotateSpeed={0.3}
                touches={{
                  ONE: THREE.TOUCH.ROTATE,       
                  TWO: THREE.TOUCH.DOLLY_PAN, 
                }}
              />
            </XR>
          ) : (
            <>
              <ambientLight intensity={0.6} />
              <Panorama src={src} />
              <POIs hotspots={hotspots} onClick={onHotspotClick} />
              {/* Web: arraste com o dedo/mouse */}
              <OrbitControls
                ref={controlsRef}
                enableZoom={enableZoom}
                enablePan={false}
                minDistance={0.05}
                maxDistance={2}
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={-0.35}
                autoRotate={autoRotate}
                autoRotateSpeed={0.3}
                touches={{
                  ONE: THREE.TOUCH.ROTATE,       
                  TWO: THREE.TOUCH.DOLLY_PAN, 
                }}
              />
            </>
          )}
        </Canvas>
      )}
    </div>
  );
}
