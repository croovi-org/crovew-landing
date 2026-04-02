"use client";

import React, { Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { feature } from 'topojson-client';
import { useRef, useMemo, useState, useEffect } from 'react';
import geoData from '@/lib/countries-110m.json';

/** Check if WebGL is available in this browser. */
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface EBState { error: boolean }
class CanvasErrorBoundary extends Component<{ children: React.ReactNode; onError: () => void }, EBState> {
  state: EBState = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.error ? null : this.props.children; }
}

const R = 1.38;

const CONTINENT_LOCATIONS = [
  { lat: 40.7, lon: -74.0 }, { lat: 34.0, lon: -118.2 }, { lat: 51.5, lon: -0.1 },
  { lat: 48.9, lon: 2.3 }, { lat: 52.5, lon: 13.4 }, { lat: 55.8, lon: 37.6 },
  { lat: 35.7, lon: 139.7 }, { lat: 37.5, lon: 127.0 }, { lat: 22.3, lon: 114.2 },
  { lat: 28.6, lon: 77.2 }, { lat: 19.1, lon: 72.9 }, { lat: -33.9, lon: 151.2 },
  { lat: -23.5, lon: -46.6 }, { lat: -34.6, lon: -58.4 }, { lat: 6.5, lon: 3.4 },
  { lat: -1.3, lon: 36.8 }, { lat: 30.0, lon: 31.2 }, { lat: 59.9, lon: 10.7 },
  { lat: 41.0, lon: 29.0 }, { lat: 25.2, lon: 55.3 }, { lat: 1.3, lon: 103.8 },
  { lat: 13.8, lon: 100.5 }, { lat: 45.5, lon: -73.6 }, { lat: 19.4, lon: -99.1 },
  { lat: -26.2, lon: 28.0 }, { lat: 4.9, lon: 114.9 }, { lat: 14.7, lon: -17.4 },
];

const EVENTS = [
  'User signed up', 'Session started', 'Upgraded plan',
  'Connected integration', 'Opened dashboard', 'Created project',
];

function latLon(lat: number, lon: number, r = R): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function CountryLines() {
  const geo = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countries = feature(geoData as any, (geoData as any).objects.countries) as any;
    const pts: number[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    countries.features.forEach((f: any) => {
      const rings: number[][][] =
        f.geometry.type === 'Polygon'
          ? f.geometry.coordinates
          : (f.geometry.coordinates as number[][][][]).flat(1);
      rings.forEach((ring) => {
        for (let i = 0; i < ring.length - 1; i++) {
          const v1 = latLon(ring[i][1], ring[i][0]);
          const v2 = latLon(ring[i + 1][1], ring[i + 1][0]);
          pts.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
        }
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#23C9B9" transparent opacity={0.22} />
    </lineSegments>
  );
}

function Graticule() {
  const geo = useMemo(() => {
    const pts: number[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 4) {
        const v1 = latLon(lat, lon);
        const v2 = latLon(lat, lon + 4);
        pts.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }
    for (let lon = -180; lon < 180; lon += 60) {
      for (let lat = -90; lat < 90; lat += 4) {
        const v1 = latLon(lat, lon);
        const v2 = latLon(lat + 4, lon);
        pts.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#7AF5E8" transparent opacity={0.05} />
    </lineSegments>
  );
}

interface GlobeDot {
  id: number;
  position: THREE.Vector3;
  label: string;
  born: number;
  ttl: number;
}

let _dotId = 0;

function DotMesh({ dot }: { dot: GlobeDot }) {
  const coreRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null!);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(() => {
    const progress = (Date.now() - dot.born) / dot.ttl;
    if (progress > 1) return;

    let alpha = 1;
    if (progress < 0.12) alpha = progress / 0.12;
    else if (progress > 0.78) alpha = (1 - progress) / 0.22;

    if (coreMat.current) coreMat.current.opacity = alpha;

    if (ringRef.current && ringMat.current) {
      const pulse = (progress * 2.5) % 1;
      ringRef.current.scale.setScalar(1 + pulse * 5);
      ringMat.current.opacity = (1 - pulse) * 0.22 * alpha;
    }
  });

  const pos = dot.position.toArray() as [number, number, number];

  return (
    <group position={pos}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial ref={coreMat} color="#23C9B9" transparent opacity={0} />
      </mesh>
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshBasicMaterial ref={ringMat} color="#7AF5E8" transparent opacity={0} wireframe />
      </mesh>
    </group>
  );
}

function GlobeGroup({
  onHoverChange,
  onClick,
  transitioning,
}: {
  onHoverChange: (v: boolean) => void;
  onClick: () => void;
  transitioning: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const atmMat = useRef<THREE.MeshBasicMaterial>(null!);
  const [dots, setDots] = useState<GlobeDot[]>([]);
  const speedRef = useRef(0.0014);
  const targetSpeedRef = useRef(0.0014);
  const hoveredRef = useRef(false);

  useEffect(() => {
    targetSpeedRef.current = transitioning ? 0.0002 : 0.0014;
  }, [transitioning]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const spawn = () => {
      const src = CONTINENT_LOCATIONS[Math.floor(Math.random() * CONTINENT_LOCATIONS.length)];
      const pos = latLon(
        src.lat + (Math.random() - 0.5) * 14,
        src.lon + (Math.random() - 0.5) * 22,
        R * 1.018,
      );
      setDots(prev => {
        const active = prev.filter(d => Date.now() - d.born < d.ttl);
        const dot: GlobeDot = {
          id: _dotId++,
          position: pos,
          label: EVENTS[Math.floor(Math.random() * EVENTS.length)],
          born: Date.now(),
          ttl: 4200 + Math.random() * 3800,
        };
        return [...active.slice(-14), dot];
      });
      timeout = setTimeout(spawn, 650 + Math.random() * 650);
    };
    timeout = setTimeout(spawn, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useFrame(() => {
    speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.025;
    if (groupRef.current) {
      groupRef.current.rotation.y += speedRef.current;
      groupRef.current.position.y = Math.sin(Date.now() * 0.00055) * 0.038;
    }
    if (atmMat.current) {
      const pulse = 0.04 + Math.sin(Date.now() * 0.001) * 0.008;
      atmMat.current.opacity = hoveredRef.current ? pulse * 1.6 : pulse;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, Math.PI * 135 / 180, 0]}>
      <mesh
        onPointerEnter={() => { onHoverChange(true); hoveredRef.current = true; }}
        onPointerLeave={() => { onHoverChange(false); hoveredRef.current = false; }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[R, 72, 72]} />
        <meshBasicMaterial color="#060D14" />
      </mesh>

      <mesh scale={1.06}>
        <sphereGeometry args={[R, 32, 32]} />
        <meshBasicMaterial ref={atmMat} color="#23C9B9" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      <mesh scale={1.14}>
        <sphereGeometry args={[R, 20, 20]} />
        <meshBasicMaterial color="#1BA99C" transparent opacity={0.012} side={THREE.BackSide} />
      </mesh>

      <Graticule />
      <CountryLines />

      {dots.map(d => <DotMesh key={d.id} dot={d} />)}
    </group>
  );
}

/** GlobeScene fills its parent container absolutely.
 *  Wrap it in a positioned container (e.g. absolute inset-0). */
export function GlobeScene({
  onClick,
  transitioning,
  onWebGLError,
  className = '',
}: {
  onClick: () => void;
  transitioning: boolean;
  onWebGLError?: () => void;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`absolute inset-0 select-none ${className}`}
      style={{ cursor: hovered ? 'pointer' : 'default' }}
    >
      <CanvasErrorBoundary onError={onWebGLError ?? (() => {})}>
        <Canvas
          camera={{ position: [0, 0, 3.6], fov: 48 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%', background: 'transparent', display: 'block' }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <GlobeGroup
            onHoverChange={setHovered}
            onClick={onClick}
            transitioning={transitioning}
          />
        </Canvas>
      </CanvasErrorBoundary>

      {/* Ambient radial glow centered on the globe */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 54% 54% at 50% 50%, rgba(35,201,185,${hovered ? 0.09 : 0.048}) 0%, rgba(35,201,185,0.018) 60%, transparent 80%)`,
        }}
      />
    </div>
  );
}
