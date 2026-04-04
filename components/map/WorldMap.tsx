"use client";

import React, { useState, useEffect, useId } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
} from 'react-simple-maps';
import { motion } from 'framer-motion';
import { feature } from 'topojson-client';
import type { Topology, Objects } from 'topojson-specification';

import geoData from '@/lib/countries-110m.json';

const GEO = feature(
  geoData as unknown as Topology<Objects>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (geoData as any).objects.countries
);

// Dot spawn regions [lonMin, lonMax, latMin, latMax, weight]
const DOT_REGIONS: [number, number, number, number, number][] = [
  [-130, -65,  25,  60, 4], // North America
  [ -80, -35, -55,  12, 2], // South America
  [ -12,  40,  36,  68, 4], // Europe
  [ -18,  52, -35,  37, 2], // Africa
  [  25, 100,  10,  55, 4], // Asia (West + Central)
  [ 100, 145,   0,  25, 3], // East + SE Asia
  [ 115, 155, -40, -15, 1], // Australia
];

const EVENT_LABELS = [
  'User signed up',
  'Session started',
  'Clicked pricing',
  'Opened dashboard',
  'Created project',
  'Upgraded plan',
  'Invited team member',
  'Connected integration',
];

interface Dot {
  id: string;
  lon: number;
  lat: number;
  label: string;
  showTooltip: boolean;
}

interface AnimatedWorldMapProps {
  className?: string;
  dotRadius?: number;
  strongGlow?: boolean;
  projectionScale?: number;
  style?: React.CSSProperties;
}

function spawnDot(): Dot {
  const totalWeight = DOT_REGIONS.reduce((s, r) => s + r[4], 0);
  let rand = Math.random() * totalWeight;
  let region = DOT_REGIONS[0];
  for (const r of DOT_REGIONS) {
    rand -= r[4];
    if (rand <= 0) { region = r; break; }
  }
  const [lonMin, lonMax, latMin, latMax] = region;
  return {
    id: Math.random().toString(36).slice(2, 9),
    lon: lonMin + Math.random() * (lonMax - lonMin),
    lat: latMin + Math.random() * (latMax - latMin),
    label: EVENT_LABELS[Math.floor(Math.random() * EVENT_LABELS.length)],
    showTooltip: true,
  };
}

function DotMarker({
  dot,
  dotRadius,
  strongGlow,
}: {
  dot: Dot;
  dotRadius: number;
  strongGlow: boolean;
}) {
  const tooltipWidth = Math.max(dot.label.length * 6.2 + 18, 80);
  const tooltipHeight = 22;

  return (
    <Marker coordinates={[dot.lon, dot.lat]}>
      <g>
        {/* Outer ping rings */}
        <motion.circle
          r={dotRadius}
          fill="none"
          stroke="#7AF5E8"
          strokeWidth={0.8}
          initial={{ r: dotRadius, opacity: 0.7 }}
          animate={{ r: dotRadius + 11, opacity: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.circle
          r={dotRadius}
          fill="none"
          stroke="#23C9B9"
          strokeWidth={0.6}
          initial={{ r: dotRadius, opacity: 0.5 }}
          animate={{ r: dotRadius + 6, opacity: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
        />

        {/* Core dot */}
        <circle
          r={dotRadius}
          fill="#23C9B9"
          style={{
            filter: strongGlow
              ? 'drop-shadow(0 0 10px rgba(27,169,156,0.8)) drop-shadow(0 0 14px rgba(35,201,185,0.55))'
              : 'drop-shadow(0 0 4px rgba(122,245,232,0.9)) drop-shadow(0 0 8px rgba(35,201,185,0.6))',
          }}
        />
        <circle r={Math.max(1.5, dotRadius * 0.5)} fill="#7AF5E8" />

        {/* Tooltip rendered as SVG foreignObject */}
        {dot.showTooltip && (
          <foreignObject
            x={-tooltipWidth / 2}
            y={-(tooltipHeight + 10)}
            width={tooltipWidth}
            height={tooltipHeight}
            style={{ overflow: 'visible' }}
          >
            <div
              // @ts-expect-error foreignObject namespace attribute is valid in SVG usage here.
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                background: 'rgba(11,15,20,0.96)',
                border: '1px solid rgba(122,245,232,0.28)',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: 10,
                fontWeight: 500,
                color: '#E6F7F6',
                whiteSpace: 'nowrap',
                lineHeight: '16px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {dot.label}
            </div>
          </foreignObject>
        )}
      </g>
    </Marker>
  );
}

export function AnimatedWorldMap({
  className,
  dotRadius = 3,
  strongGlow = false,
  projectionScale = 185,
  style,
}: AnimatedWorldMapProps) {
  const [dots, setDots] = useState<Dot[]>([]);
  const filterId = useId().replace(/:/g, '');

  useEffect(() => {
    let addTimeoutId: ReturnType<typeof setTimeout>;

    const addDot = () => {
      const dot = spawnDot();
      setDots(prev => {
        const next = [...prev, dot];
        return next.length > 20 ? next.slice(-20) : next;
      });

      // Hide tooltip after 1.8s
      setTimeout(() => {
        setDots(prev => prev.map(d => d.id === dot.id ? { ...d, showTooltip: false } : d));
      }, 1800);

      // Remove dot after 4–8s
      const ttl = 4000 + Math.random() * 4000;
      setTimeout(() => {
        setDots(prev => prev.filter(d => d.id !== dot.id));
      }, ttl);

      addTimeoutId = setTimeout(addDot, 500 + Math.random() * 900);
    };

    addTimeoutId = setTimeout(addDot, 600);
    return () => clearTimeout(addTimeoutId);
  }, []);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className ?? ''}`} style={style}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: projectionScale, center: [15, 8] }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {/* Left + right edge fade so map dissolves cleanly on both sides */}
          <linearGradient id={`fadeLeft-${filterId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="white" stopOpacity="0" />
            <stop offset="18%"  stopColor="white" stopOpacity="1" />
            <stop offset="88%"  stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          {/* Top/bottom fade */}
          <linearGradient id={`fadeV-${filterId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.2" />
            <stop offset="12%"  stopColor="white" stopOpacity="1"   />
            <stop offset="88%"  stopColor="white" stopOpacity="1"   />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>
          {/* Combined mask via feBlend */}
          <mask id={`vignette-${filterId}`}>
            <rect id={`mh-${filterId}`} width="100%" height="100%" fill={`url(#fadeLeft-${filterId})`} />
          </mask>
          <mask id={`vignetteV-${filterId}`}>
            <rect width="100%" height="100%" fill={`url(#fadeV-${filterId})`} />
          </mask>
        </defs>

        <g mask={`url(#vignetteV-${filterId})`}>
          <g mask={`url(#vignette-${filterId})`}>
            {/* Subtle lat/lon grid */}
            <Graticule stroke="rgba(122,245,232,0.05)" strokeWidth={0.4} />

            {/* Countries */}
            <Geographies geography={GEO}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(13,30,40,0.8)"
                    stroke="rgba(35,201,185,0.25)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'rgba(15,127,120,0.18)', stroke: 'rgba(35,201,185,0.5)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Animated event dots */}
            {dots.map(dot => (
              <DotMarker
                key={dot.id}
                dot={dot}
                dotRadius={dotRadius}
                strongGlow={strongGlow}
              />
            ))}
          </g>
        </g>
      </ComposableMap>
    </div>
  );
}
