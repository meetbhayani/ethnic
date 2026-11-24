'use client';

import React, { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Fabric photo with a magnifying loupe. Mouse users get it on hover; touch users
 * tap "Inspect" and drag a finger across the fabric (page scroll is paused only
 * while inspect mode is on).
 */
export default function FabricLoupe({
  src,
  alt,
  zoom = 2.4,
  size = 170,
  className = '',
  imgClassName = '',
  children,
  showHint = true,
}: {
  src: string;
  alt: string;
  zoom?: number;
  size?: number;
  className?: string;
  imgClassName?: string;
  children?: React.ReactNode;
  showHint?: boolean;
}) {
  const box = useRef<HTMLDivElement | null>(null);
  const lens = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [touchMode, setTouchMode] = useState(false);

  const place = (clientX: number, clientY: number) => {
    const el = box.current;
    const l = lens.current;
    if (!el || !l) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width);
    const y = Math.min(Math.max(clientY - r.top, 0), r.height);
    l.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
    l.style.backgroundSize = `${r.width * zoom}px ${r.height * zoom}px`;
    l.style.backgroundPosition = `${-(x * zoom - size / 2)}px ${-(y * zoom - size / 2)}px`;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' || touchMode) {
      if (!active) setActive(true);
      place(e.clientX, e.clientY);
    }
  };

  return (
    <div
      ref={box}
      className={`relative overflow-hidden select-none ${touchMode ? 'touch-none' : ''} ${className}`}
      onPointerMove={onPointerMove}
      onPointerDown={(e) => {
        if (touchMode) {
          setActive(true);
          place(e.clientX, e.clientY);
        }
      }}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(false)}
      onPointerUp={(e) => e.pointerType !== 'mouse' && setActive(false)}
      style={{ cursor: active ? 'none' : 'zoom-in' }}
    >
      <img src={src} alt={alt} draggable={false} className={`w-full h-full object-cover ${imgClassName}`} />
      {children}

      {/* The loupe */}
      <div
        ref={lens}
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 z-30 rounded-full border-2 border-[#C8A974] shadow-[0_18px_50px_rgba(0,0,0,0.45),inset_0_0_0_6px_rgba(250,248,243,0.25)] transition-opacity duration-300 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${src})`,
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.35),transparent_40%)]" />
      </div>

      {showHint && (
        <>
          {/* Desktop hint */}
          <span
            className={`hidden md:flex absolute bottom-4 right-4 z-20 items-center gap-1.5 px-2.5 py-1 bg-[#252321]/75 backdrop-blur text-[#FAF8F3] text-[11px] uppercase tracking-widest border border-[#C8A974]/40 transition-opacity duration-300 ${
              active ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Search className="w-3 h-3 text-[#C8A974]" /> Hover to inspect stitches
          </span>
          {/* Touch toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTouchMode((v) => !v);
              setActive(false);
            }}
            className={`md:hidden absolute bottom-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 text-[12px] uppercase tracking-widest border backdrop-blur ${
              touchMode
                ? 'bg-[#C8A974] text-[#252321] border-[#C8A974]'
                : 'bg-[#252321]/75 text-[#FAF8F3] border-[#C8A974]/40'
            }`}
          >
            {touchMode ? <X className="w-3 h-3" /> : <Search className="w-3 h-3" />}
            {touchMode ? 'Done' : 'Inspect'}
          </button>
          {touchMode && !active && (
            <span className="md:hidden absolute inset-x-0 top-1/2 z-20 mx-auto w-max px-3 py-1.5 bg-[#252321]/80 text-[#FAF8F3] text-[12px] uppercase tracking-widest animate-fade-up-in">
              Drag your finger over the fabric
            </span>
          )}
        </>
      )}
    </div>
  );
}
