import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import React from 'react';

function HeadLook({
  maxYaw = Math.PI,          // ±180°
  maxPitch = Math.PI / 2.2,  // ±~82°
  smooth = 0.08,
}) {
  const { camera, gl } = useThree();

  const target = React.useRef({ yaw: 0, pitch: 0 });
  const quat = React.useRef(new THREE.Quaternion());
  const euler = React.useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const mouse = React.useRef({ x: 0, y: 0 });

  const onPointerMove = (e: any) => {
    // quando em VR, o HMD controla — ignore mouse
    if (gl.xr?.isPresenting) return;

    const el = (e.target as HTMLElement);
    const { width, height, left, top } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    mouse.current.x = x * 2 - 1;
    mouse.current.y = y * 2 - 1;

    target.current.yaw   = mouse.current.x * maxYaw * 0.25;
    target.current.pitch = THREE.MathUtils.clamp(
      -mouse.current.y * maxPitch * 0.25,
      -maxPitch,
      maxPitch
    );
  };

  useFrame(() => {
    // checa a cada frame: true quando a sessão XR está ativa
    if (gl.xr?.isPresenting) return;

    const cur = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    const nextY = THREE.MathUtils.lerp(cur.y, target.current.yaw, smooth);
    const nextX = THREE.MathUtils.lerp(cur.x, target.current.pitch, smooth);

    euler.current.set(nextX, nextY, 0);
    quat.current.setFromEuler(euler.current);
    camera.quaternion.slerp(quat.current, 1);
  });

  // camada invisível para capturar o mouse em tela cheia
  return (
    <Html
      prepend
      style={{ position: 'fixed', inset: 0, cursor: 'grab' }}
      onPointerMove={onPointerMove}
    />
  );
}
export default HeadLook;
