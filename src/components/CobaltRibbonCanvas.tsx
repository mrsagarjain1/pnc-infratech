"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GlossyCobaltRibbon() {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const { mainGeo, accentGeo, curve } = useMemo(() => {
    const mainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-9.5, 4.8, -1.5),
      new THREE.Vector3(-4.2, 3.6, 1.2),
      new THREE.Vector3(-0.6, 0.9, 2.2),
      new THREE.Vector3(-1.4, -2.5, 0.8),
      new THREE.Vector3(-5.8, -4.4, -1.2),
    ]);

    const secondCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-9.2, 4.1, -2.1),
      new THREE.Vector3(-3.6, 2.9, 0.4),
      new THREE.Vector3(0.2, 0.3, 1.6),
      new THREE.Vector3(-0.7, -2.9, 0.2),
      new THREE.Vector3(-5.2, -4.8, -1.6),
    ]);

    return {
      curve: mainCurve,
      mainGeo: new THREE.TubeGeometry(mainCurve, 120, 0.62, 24, false),
      accentGeo: new THREE.TubeGeometry(secondCurve, 100, 0.16, 16, false),
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const { x, y } = state.pointer;

    if (groupRef.current) {
      const targetRotY = x * 0.22 + Math.sin(t * 0.35) * 0.08;
      const targetRotX = -y * 0.14 + Math.cos(t * 0.28) * 0.05;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        1 - Math.exp(-dt * 4),
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        1 - Math.exp(-dt * 4),
      );
    }

    if (pulseRef.current) {
      const u = (t * 0.16) % 1;
      const pos = curve.getPointAt(u);
      pulseRef.current.position.copy(pos);
    }
  });

  return (
    <>
      <ambientLight intensity={1.1} color="#ffffff" />
      <directionalLight position={[6, 10, 8]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-8, -5, 5]} intensity={1.6} color="#00d9ff" />
      <pointLight position={[2, 4, 5]} intensity={18} color="#c1ff00" />

      <group ref={groupRef} position={[1.4, 0, 0]}>
        <mesh geometry={mainGeo}>
          <meshPhysicalMaterial
            color="#1a2ffb"
            emissive="#071bdf"
            emissiveIntensity={0.28}
            roughness={0.14}
            metalness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>

        <mesh geometry={accentGeo}>
          <meshPhysicalMaterial
            color="#00d9ff"
            emissive="#00d9ff"
            emissiveIntensity={0.45}
            roughness={0.2}
            metalness={0.2}
            clearcoat={1}
          />
        </mesh>

        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.74, 24, 24]} />
          <meshStandardMaterial
            color="#c1ff00"
            emissive="#c1ff00"
            emissiveIntensity={1.6}
            roughness={0.2}
          />
        </mesh>
      </group>
    </>
  );
}

class RibbonErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function CobaltRibbonCanvas() {
  return (
    <RibbonErrorBoundary>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 11.5], fov: 44 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <GlossyCobaltRibbon />
      </Canvas>
    </RibbonErrorBoundary>
  );
}
