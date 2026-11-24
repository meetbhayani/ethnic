'use client';

import React, { useId } from 'react';

export type GarmentKind = 'sherwani' | 'jodhpuri' | 'kurta' | 'indo-western';

interface GarmentShape {
  body: string;
  collar?: { x: number; y: number; w: number; h: number };
  /** Solid (non-fabric) garment pieces, e.g. trousers. */
  base?: string;
  /** Decorative lines: plackets, slits, closures. */
  lines: string[];
  buttons: [number, number][];
}

// Front-view garment outlines on a 200 × 320 canvas.
const SHAPES: Record<GarmentKind, GarmentShape> = {
  sherwani: {
    body: 'M86 34 L60 40 L40 50 L20 184 L40 188 L54 94 L44 298 L156 298 L146 94 L160 188 L180 184 L160 50 L140 40 L114 34 Z',
    collar: { x: 86, y: 16, w: 28, h: 18 },
    lines: ['M100 34 L100 298', 'M44 298 L156 298'],
    buttons: [44, 66, 88, 110, 132, 154, 176].map((y) => [100, y] as [number, number]),
  },
  jodhpuri: {
    base: 'M60 190 L140 190 L137 314 L108 314 L100 222 L92 314 L63 314 Z',
    body: 'M86 34 L60 40 L40 50 L22 182 L42 186 L55 94 L52 200 L148 200 L145 94 L158 186 L178 182 L160 50 L140 40 L114 34 Z',
    collar: { x: 86, y: 19, w: 28, h: 15 },
    lines: ['M100 34 L100 200', 'M118 140 L138 140', 'M62 70 L80 70'],
    buttons: [46, 66, 86, 106, 126, 146, 166, 186].map((y) => [100, y] as [number, number]),
  },
  kurta: {
    body: 'M86 26 C92 31 108 31 114 26 L140 34 L158 44 L178 168 L158 172 L146 84 L150 264 L50 264 L54 84 L42 172 L22 168 L42 44 L60 34 Z',
    collar: { x: 90, y: 18, w: 20, h: 10 },
    lines: ['M100 30 L100 112', 'M52 232 L50 264', 'M148 232 L150 264'],
    buttons: [46, 64, 82, 100].map((y) => [100, y] as [number, number]),
  },
  'indo-western': {
    base: 'M66 246 L134 236 L130 316 L106 316 L100 270 L94 316 L70 316 Z',
    body: 'M86 34 L60 40 L40 50 L20 184 L40 188 L54 94 L48 252 L106 290 L152 234 L146 94 L160 188 L180 184 L160 50 L140 40 L114 34 Z',
    collar: { x: 86, y: 18, w: 28, h: 16 },
    lines: ['M114 34 C110 90 96 150 82 268'],
    buttons: [
      [110, 70],
      [104, 112],
      [96, 154],
      [88, 196],
    ],
  },
};

export const GARMENT_LABELS: Record<GarmentKind, string> = {
  sherwani: 'Sherwani',
  jodhpuri: 'Jodhpuri',
  kurta: 'Kurta',
  'indo-western': 'Indo-Western',
};

/**
 * Garment outline "tailored" from a fabric photo: the photo is clipped to the
 * garment shape, with soft side shading for depth. `sketch` draws an unfilled
 * pattern-paper outline instead.
 */
export default function GarmentSilhouette({
  kind,
  fabricSrc,
  variant = 'fabric',
  className = '',
  title,
}: {
  kind: GarmentKind;
  fabricSrc?: string;
  variant?: 'fabric' | 'sketch';
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const shape = SHAPES[kind];
  const clipId = `clip-${kind}-${uid}`;
  const shadeId = `shade-${uid}`;
  const glossId = `gloss-${uid}`;
  const sketch = variant === 'sketch';

  const stroke = sketch ? '#8C6F4A' : '#C8A974';

  return (
    <svg viewBox="0 0 200 320" className={className} role="img" aria-label={title ?? `${GARMENT_LABELS[kind]} silhouette`}>
      <defs>
        <clipPath id={clipId}>
          <path d={shape.body} />
          {shape.collar && (
            <rect x={shape.collar.x} y={shape.collar.y} width={shape.collar.w} height={shape.collar.h + 2} rx={3} />
          )}
        </clipPath>
        <linearGradient id={shadeId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.22" stopColor="#000" stopOpacity="0.08" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="0.78" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={glossId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="314" rx="62" ry="5" fill="#000" opacity={sketch ? 0.06 : 0.18} />

      {shape.base && (
        <path
          d={shape.base}
          fill={sketch ? 'none' : '#EFE7D9'}
          stroke={stroke}
          strokeWidth={sketch ? 1 : 0.8}
          strokeDasharray={sketch ? '4 3' : undefined}
        />
      )}

      {sketch ? (
        <g fill="rgba(250,248,243,0.04)" stroke={stroke} strokeWidth="1.1" strokeDasharray="5 4">
          <path d={shape.body} />
          {shape.collar && (
            <rect x={shape.collar.x} y={shape.collar.y} width={shape.collar.w} height={shape.collar.h} rx={3} />
          )}
        </g>
      ) : (
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="200" height="320" fill="#30241F" />
          {fabricSrc && (
            <image
              key={fabricSrc}
              href={fabricSrc}
              x="-10"
              y="0"
              width="220"
              height="320"
              preserveAspectRatio="xMidYMid slice"
              className="svg-fabric-drop"
            />
          )}
          <rect x="0" y="0" width="200" height="320" fill={`url(#${shadeId})`} />
          <rect x="0" y="0" width="200" height="320" fill={`url(#${glossId})`} />
        </g>
      )}

      {!sketch && (
        <>
          <path d={shape.body} fill="none" stroke={stroke} strokeWidth="1" strokeOpacity="0.85" />
          {shape.collar && (
            <rect
              x={shape.collar.x}
              y={shape.collar.y}
              width={shape.collar.w}
              height={shape.collar.h}
              rx={3}
              fill="none"
              stroke={stroke}
              strokeWidth="1"
              strokeOpacity="0.85"
            />
          )}
        </>
      )}

      {shape.lines.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth="0.9"
          strokeOpacity={sketch ? 0.7 : 0.75}
          strokeDasharray={sketch ? '3 3' : undefined}
        />
      ))}
      {shape.buttons.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={sketch ? 1.6 : 2.2}
          fill={sketch ? 'none' : '#E3C98F'}
          stroke={sketch ? stroke : '#7A5B2E'}
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}
