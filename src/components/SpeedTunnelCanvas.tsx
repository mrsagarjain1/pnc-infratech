"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RING_COUNT = 26;
const RING_SPACING = 6.5;
const TUNNEL_DEPTH = RING_COUNT * RING_SPACING;
const STREAK_COUNT = 42;

function ExpresswayTunnelScene({
  hoursRatio,
}: {
  hoursRatio: number;
}) {
  const ringsRef = useRef<THREE.InstancedMesh>(null);
  const limeRingsRef = useRef<THREE.InstancedMesh>(null);
  const streaksRef = useRef<THREE.InstancedMesh>(null);
  const velocityRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const onVel = (e: Event) => {
      const ce = e as CustomEvent<number>;
      velocityRef.current = Math.min(3.5, Math.abs(ce.detail ?? 0) * 0.08);
    };
    window.addEventListener("pnc-scroll-velocity", onVel);
    return () => window.removeEventListener("pnc-scroll-velocity", onVel);
  }, []);

  const streakSeeds = useMemo(() => {
    return Array.from({ length: STREAK_COUNT }, (_, i) => {
      const angle = (i / STREAK_COUNT) * Math.PI * 2;
      const radius = 5.4 + (i % 3) * 0.75;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.72,
        zOffset: (i * 11.3) % TUNNEL_DEPTH,
        speed: 18 + (i % 5) * 6,
        len: 3.5 + (i % 4) * 1.8,
      };
    });
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const { x, y } = state.pointer;

    // Warp speed scales cleanly with 100-hour scrubber + live Lenis scroll velocity
    const baseSpeed = 9 + hoursRatio * 18 + velocityRef.current * 24;
    scrollOffsetRef.current = (scrollOffsetRef.current + baseSpeed * dt) % TUNNEL_DEPTH;
    velocityRef.current *= Math.exp(-dt * 4);

    // Subtle cockpit camera tilt toward cursor
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      x * 1.4,
      1 - Math.exp(-dt * 3.5),
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      y * 0.9,
      1 - Math.exp(-dt * 3.5),
    );
    state.camera.lookAt(0, 0, -40);

    // Update cobalt arch tunnel rings
    if (ringsRef.current) {
      for (let i = 0; i < RING_COUNT; i++) {
        const rawZ = (i * RING_SPACING + scrollOffsetRef.current) % TUNNEL_DEPTH;
        const z = rawZ - TUNNEL_DEPTH + 10;
        const twist = Math.sin(t * 0.4 + i * 0.22) * 0.14;
        dummy.position.set(Math.sin(z * 0.025 + t * 0.4) * 1.1, 0, z);
        dummy.rotation.set(0, 0, twist);
        dummy.scale.set(1.25, 0.88, 1);
        dummy.updateMatrix();
        ringsRef.current.setMatrixAt(i, dummy.matrix);
      }
      ringsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update milestone acid-lime chainage rings (every 4th rib)
    if (limeRingsRef.current) {
      for (let i = 0; i < 6; i++) {
        const rawZ = (i * (TUNNEL_DEPTH / 6) + scrollOffsetRef.current * 1.15) % TUNNEL_DEPTH;
        const z = rawZ - TUNNEL_DEPTH + 10;
        dummy.position.set(Math.sin(z * 0.025 + t * 0.4) * 1.1, 0, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1.22, 0.85, 1);
        dummy.updateMatrix();
        limeRingsRef.current.setMatrixAt(i, dummy.matrix);
      }
      limeRingsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update rushing speed light streaks
    if (streaksRef.current) {
      for (let i = 0; i < streakSeeds.length; i++) {
        const s = streakSeeds[i];
        const z =
          ((s.zOffset + t * (s.speed + hoursRatio * 22)) % TUNNEL_DEPTH) -
          TUNNEL_DEPTH +
          12;
        dummy.position.set(s.x, s.y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(0.08, 0.08, s.len);
        dummy.updateMatrix();
        streaksRef.current.setMatrixAt(i, dummy.matrix);
      }
      streaksRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fogExp2 attach="fog" args={["#000000", 0.015]} />
      <ambientLight intensity={0.45} color="#1a2ffb" />
      <pointLight position={[0, 0, -25]} intensity={90} distance={90} color="#1a2ffb" />

      {/* Cobalt Highway Portal Ribs */}
      <instancedMesh ref={ringsRef} args={[undefined, undefined, RING_COUNT]}>
        <torusGeometry args={[6.2, 0.14, 10, 40]} />
        <meshStandardMaterial
          color="#1a2ffb"
          emissive="#1a2ffb"
          emissiveIntensity={1.85}
          roughness={0.25}
        />
      </instancedMesh>

      {/* Acid-Lime Chainage Milestone Rings */}
      <instancedMesh ref={limeRingsRef} args={[undefined, undefined, 6]}>
        <torusGeometry args={[6.15, 0.06, 8, 40]} />
        <meshBasicMaterial color="#c1ff00" transparent opacity={0.75} />
      </instancedMesh>

      {/* High-Speed Light Streaks */}
      <instancedMesh
        ref={streaksRef}
        args={[undefined, undefined, STREAK_COUNT]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#f0f1fa" transparent opacity={0.7} />
      </instancedMesh>
    </>
  );
}

class TunnelErrorBoundary extends React.Component<
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

export function SpeedTunnelCanvas({ hoursRatio }: { hoursRatio: number }) {
  return (
    <TunnelErrorBoundary>
      <Canvas
        dpr={[1, 1.4]}
        camera={{ position: [0, 0, 8], fov: 62, near: 0.5, far: 220 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <ExpresswayTunnelScene hoursRatio={hoursRatio} />
      </Canvas>
    </TunnelErrorBoundary>
  );
}
