'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import { XR, createXRStore, useXR } from '@react-three/xr';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import HeadLook from '@/components/HeadLook';

/** ---- Panorama 360 como “fundo” da cena ---- **/
function Panorama360({ src = '../../public/assets/Pub.jpg' }: { src?: string }) {
  const tex = useTexture(src);
  // Garante mapeamento e correção de cores
  const texture = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [tex]);

  return (
    <mesh rotation={[0, Math.PI, 0]}>
      {/* esfera invertida */}
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}


/** ---- Overlay simples (substitua pelo seu carrossel/estilo) ---- **/
function HUD({ onEnterVR, onEnterAR }: { onEnterVR: () => void; onEnterAR: () => void }) {
  return (
    <div className="pointer-events-none fixed inset-0 grid grid-rows-[96px_1fr_140px] p-6 text-white">
      {/* ...título e carrossel... */}
      <div className="pointer-events-auto mx-auto flex gap-4">
        <button className="rounded-xl border border-white/30 bg-white/10 px-5 py-2 backdrop-blur" onClick={onEnterVR}>
          Entrar em VR
        </button>
        <button className="rounded-xl border border-white/30 bg-white/10 px-5 py-2 backdrop-blur" onClick={onEnterAR}>
          Entrar em AR
        </button>
      </div>
    </div>
  );
}


export default function Page() {
    const xrStore = useMemo(
    () => createXRStore({
      // opções úteis (todas opcionais)
      // controller: true, hand: true, gaze: true,
      // emulate: 'metaQuest3', // emulação no localhost
    }),
    []
  );

  return (
    <main className="fixed inset-0">
      {/* Botão WebXR nativo (fica fora do canvas) */}
      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.xr.enabled = true; // ok manter habilitado
        }}
        camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 0, 0] }}
      >
        {/* ✅ passe o store */}
        <XR store={xrStore}>
          <Panorama360 src="../assets/Pub.jpg" />
          <HeadLook />
        </XR>
      </Canvas>

      {/* Seu overlay/HUD */}
      <HUD
        onEnterVR={() => xrStore.enterVR()}
        onEnterAR={() => xrStore.enterAR()}
      />
    </main>
  );
}
