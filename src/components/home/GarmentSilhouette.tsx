'use client';

import React, { useEffect, useId, useState } from 'react';

export type GarmentKind = 'sherwani' | 'jodhpuri' | 'kurta' | 'indo-western';

interface GarmentShape {
  body: string;
  collar?: { x: number; y: number; w: number; h: number };
  /** Solid (non-fabric) garment pieces, e.g. trousers. */
  base?: string;
  /** Sleeve panels, shaded separately so they read as sleeves. */
  sleeves: string[];
  /** Armhole / shoulder seams. */
  seams: string[];
  /** Soft vertical drape folds. */
  folds: string[];
  /** Decorative lines: plackets, slits, closures. */
  lines: string[];
  buttons: [number, number][];
}

// Front-view garment outlines on a 200 × 320 canvas (hanger sits above y = 0).
const SHAPES: Record<GarmentKind, GarmentShape> = {
  sherwani: {
    body: 'M86 34 L60 40 L40 50 L20 184 L40 188 L54 94 L44 298 L156 298 L146 94 L160 188 L180 184 L160 50 L140 40 L114 34 Z',
    collar: { x: 86, y: 16, w: 28, h: 18 },
    sleeves: ['M40 50 L20 184 L40 188 L54 94 Z', 'M160 50 L180 184 L160 188 L146 94 Z'],
    seams: ['M44 52 L56 94', 'M156 52 L144 94'],
    folds: ['M78 120 L70 296', 'M122 120 L130 296', 'M90 200 L86 296', 'M110 200 L114 296'],
    lines: ['M100 34 L100 298'],
    buttons: [44, 66, 88, 110, 132, 154, 176].map((y) => [100, y] as [number, number]),
  },
  jodhpuri: {
    base: 'M60 190 L140 190 L137 314 L108 314 L100 222 L92 314 L63 314 Z',
    body: 'M86 34 L60 40 L40 50 L22 182 L42 186 L55 94 L52 200 L148 200 L145 94 L158 186 L178 182 L160 50 L140 40 L114 34 Z',
    collar: { x: 86, y: 19, w: 28, h: 15 },
    sleeves: ['M40 50 L22 182 L42 186 L55 94 Z', 'M160 50 L178 182 L158 186 L145 94 Z'],
    seams: ['M44 52 L57 94', 'M156 52 L143 94'],
    folds: ['M78 120 L74 198', 'M122 120 L126 198'],
    lines: ['M100 34 L100 200', 'M118 140 L138 140', 'M62 70 L80 70'],
    buttons: [46, 66, 86, 106, 126, 146, 166, 186].map((y) => [100, y] as [number, number]),
  },
  kurta: {
    body: 'M86 26 C92 31 108 31 114 26 L140 34 L158 44 L178 168 L158 172 L146 84 L150 264 L50 264 L54 84 L42 172 L22 168 L42 44 L60 34 Z',
    collar: { x: 90, y: 18, w: 20, h: 10 },
    sleeves: ['M42 44 L22 168 L42 172 L54 84 Z', 'M158 44 L178 168 L158 172 L146 84 Z'],
    seams: ['M45 46 L56 84', 'M155 46 L144 84'],
    folds: ['M76 110 L68 262', 'M124 110 L132 262', 'M100 130 L100 262'],
    lines: ['M100 30 L100 112', 'M52 232 L50 264', 'M148 232 L150 264'],
    buttons: [46, 64, 82, 100].map((y) => [100, y] as [number, number]),
  },
  'indo-western': {
    base: 'M66 246 L134 236 L130 316 L106 316 L100 270 L94 316 L70 316 Z',
    body: 'M86 34 L60 40 L40 50 L20 184 L40 188 L54 94 L48 252 L106 290 L152 234 L146 94 L160 188 L180 184 L160 50 L140 40 L114 34 Z',
    collar: { x: 86, y: 18, w: 28, h: 16 },
    sleeves: ['M40 50 L20 184 L40 188 L54 94 Z', 'M160 50 L180 184 L160 188 L146 94 Z'],
    seams: ['M44 52 L56 94', 'M156 52 L144 94'],
    folds: ['M70 130 L66 256', 'M130 130 L134 236'],
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

/** Size of one fabric repeat on the 200-wide garment canvas. */
const TILE = 58;

/**
 * A garment "tailored" from a seamless fabric tile, hanging on a wooden hanger.
 * The tile is repeated evenly across the garment, then sleeves, folds and seams are
 * shaded on top. When `fabricSrc` changes, the new fabric unrolls over the old one.
 * `sketch` draws an unfilled pattern-paper outline instead.
 */
export default function GarmentSilhouette({
  kind,
  fabricSrc,
  variant = 'fabric',
  className = '',
  title,
  sway = false,
  swayDelay = 0,
}: {
  kind: GarmentKind;
  /** Seamless fabric tile (see /public/fabrics/tiles). */
  fabricSrc?: string;
  variant?: 'fabric' | 'sketch';
  className?: string;
  title?: string;
  /** Gentle hanging sway. */
  sway?: boolean;
  swayDelay?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const shape = SHAPES[kind];
  const sketch = variant === 'sketch';
  const id = (name: string) => `${name}-${uid}`;

  // Keep the previous fabric underneath while the new one unrolls.
  const [layers, setLayers] = useState<{ cur?: string; prev?: string }>({ cur: fabricSrc });
  useEffect(() => {
    setLayers((l) => (l.cur === fabricSrc ? l : { cur: fabricSrc, prev: l.cur }));
  }, [fabricSrc]);

  const stroke = sketch ? '#8C6F4A' : '#C8A974';
  const bodyBottom = 320;

  return (
    <svg
      viewBox="0 -22 200 342"
      className={className}
      role="img"
      aria-label={title ?? `${GARMENT_LABELS[kind]} silhouette`}
    >
      <defs>
        <clipPath id={id('clip')}>
          <path d={shape.body} />
          {shape.collar && (
            <rect x={shape.collar.x} y={shape.collar.y} width={shape.collar.w} height={shape.collar.h + 2} rx={3} />
          )}
        </clipPath>
        {layers.cur && (
          <pattern id={id('pat-cur')} patternUnits="userSpaceOnUse" width={TILE} height={TILE} x="-8" y="-4">
            <image href={layers.cur} width={TILE} height={TILE} preserveAspectRatio="xMidYMid slice" />
          </pattern>
        )}
        {layers.prev && (
          <pattern id={id('pat-prev')} patternUnits="userSpaceOnUse" width={TILE} height={TILE} x="-8" y="-4">
            <image href={layers.prev} width={TILE} height={TILE} preserveAspectRatio="xMidYMid slice" />
          </pattern>
        )}
        <clipPath id={id('unroll')}>
          <rect key={layers.cur} x="0" y="0" width="200" height={bodyBottom} className="svg-unroll" />
        </clipPath>
        {/* Body: darker at the sides, like cloth turning away from the light */}
        <linearGradient id={id('side')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.5" />
          <stop offset="0.2" stopColor="#000" stopOpacity="0.12" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.58" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0.14" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={id('top')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={id('sleeve')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id={id('sheen')} x1="0" x2="1" y1="0" y2="0.35">
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFF4DC" stopOpacity="0.38" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('wood')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#B08A5A" />
          <stop offset="1" stopColor="#6E5132" />
        </linearGradient>
        <linearGradient id={id('trouser')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#D9CDB8" />
          <stop offset="0.5" stopColor="#F3ECE0" />
          <stop offset="1" stopColor="#D4C7B0" />
        </linearGradient>
        <filter id={id('soft')} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="314" rx="62" ry="5" fill="#000" opacity={sketch ? 0.06 : 0.18} className={sway && !sketch ? 'garment-shadow' : undefined} style={{ animationDelay: `${swayDelay}ms` }} />

      <g
        className={sway && !sketch ? 'garment-sway' : undefined}
        style={{ transformOrigin: '100px 10px', animationDelay: `${swayDelay}ms` }}
      >
        {/* Hanger */}
        <g opacity={sketch ? 0.55 : 1}>
          <path d="M100 -4 C100 -12 108 -14 108 -8 C108 -3 102 -2 100 4 L100 19" fill="none" stroke={sketch ? stroke : '#9A9A9A'} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M46 34 Q100 2 154 34" fill="none" stroke={sketch ? stroke : `url(#${id('wood')})`} strokeWidth={sketch ? 1.2 : 4.5} strokeLinecap="round" strokeDasharray={sketch ? '4 3' : undefined} />
        </g>

        {shape.base && (
          <path
            d={shape.base}
            fill={sketch ? 'none' : `url(#${id('trouser')})`}
            stroke={stroke}
            strokeWidth={sketch ? 1 : 0.6}
            strokeOpacity={sketch ? 1 : 0.6}
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
          <g clipPath={`url(#${id('clip')})`}>
            <rect x="0" y="0" width="200" height={bodyBottom} fill="#30241F" />
            {layers.prev && <rect x="0" y="0" width="200" height={bodyBottom} fill={`url(#${id('pat-prev')})`} />}
            {layers.cur && (
              <g clipPath={layers.prev ? `url(#${id('unroll')})` : undefined}>
                <rect x="0" y="0" width="200" height={bodyBottom} fill={`url(#${id('pat-cur')})`} />
              </g>
            )}

            {/* Depth */}
            <rect x="0" y="0" width="200" height={bodyBottom} fill={`url(#${id('side')})`} />
            {shape.sleeves.map((d, i) => (
              <path key={i} d={d} fill={`url(#${id('sleeve')})`} />
            ))}
            <g filter={`url(#${id('soft')})`} fill="none" strokeLinecap="round">
              {shape.folds.map((d, i) => (
                <React.Fragment key={i}>
                  <path d={d} stroke="#000" strokeOpacity="0.28" strokeWidth="5" />
                  <path d={d} stroke="#fff" strokeOpacity="0.12" strokeWidth="3" transform="translate(4 0)" />
                </React.Fragment>
              ))}
              {/* Shadow under the collar and at the armholes */}
              <ellipse cx="100" cy="38" rx="20" ry="5" fill="#000" fillOpacity="0.35" />
              {shape.seams.map((d, i) => (
                <path key={i} d={d} stroke="#000" strokeOpacity="0.35" strokeWidth="4" />
              ))}
            </g>
            <rect x="0" y="0" width="200" height={bodyBottom} fill={`url(#${id('top')})`} />

            {/* Travelling silk sheen */}
            <rect
              x="-200"
              y="0"
              width="200"
              height={bodyBottom}
              fill={`url(#${id('sheen')})`}
              className="svg-sheen"
              style={{ animationDelay: `${swayDelay * 2}ms` }}
            />
          </g>
        )}

        {!sketch && (
          <>
            <path d={shape.body} fill="none" stroke={stroke} strokeWidth="0.9" strokeOpacity="0.8" />
            {shape.collar && (
              <rect
                x={shape.collar.x}
                y={shape.collar.y}
                width={shape.collar.w}
                height={shape.collar.h}
                rx={3}
                fill="none"
                stroke={stroke}
                strokeWidth="0.9"
                strokeOpacity="0.8"
              />
            )}
            {/* Stitched seams */}
            {shape.seams.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#E3C98F" strokeOpacity="0.55" strokeWidth="0.6" strokeDasharray="2 1.6" />
            ))}
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
          <g key={i}>
            {!sketch && <circle cx={x + 0.6} cy={y + 0.8} r={2.4} fill="#000" opacity="0.35" />}
            <circle
              cx={x}
              cy={y}
              r={sketch ? 1.6 : 2.3}
              fill={sketch ? 'none' : '#E3C98F'}
              stroke={sketch ? stroke : '#7A5B2E'}
              strokeWidth="0.6"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
