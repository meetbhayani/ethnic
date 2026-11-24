'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { fabricById } from './fabric-library';
import { Eyebrow, Reveal, SplitWords, Tilt } from './motion';

const COLLECTIONS = [
  {
    category: 'sherwani',
    title: 'Sherwani Fabrics',
    line: 'Heavy, structured embroidery for the groom’s grandest moment.',
    fabric: fabricById('ivory-pearl-floral'),
  },
  {
    category: 'jodhpuri',
    title: 'Jodhpuri & Bandhgala',
    line: 'Rich surfaces that hold a sharp shoulder and a crisp band collar.',
    fabric: fabricById('purple-zari-vine'),
  },
  {
    category: 'kurta',
    title: 'Kurta Fabrics',
    line: 'Lighter, breathable embroidery for festive days and sangeet nights.',
    fabric: fabricById('beige-leaf-pearl'),
  },
  {
    category: 'indo-western',
    title: 'Indo-Western',
    line: 'Contemporary appliqué and sequin play for the modern reception.',
    fabric: fabricById('teal-floral-applique'),
  },
  {
    category: 'brocade',
    title: 'Royal Brocades',
    line: 'Lattices and trellises with the depth of a palace wall.',
    fabric: fabricById('red-sequin-lattice'),
  },
  {
    category: 'designer',
    title: 'Designer Couture',
    line: 'Statement panels and all-over jaals for signature collections.',
    fabric: fabricById('ivory-multicolour-sequin'),
  },
];

export default function Collections() {
  const rail = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 24), behavior: 'smooth' });
  };

  // Mouse drag-to-scroll (touch already swipes natively).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !rail.current) return;
    drag.current = { down: true, startX: e.clientX, startScroll: rail.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !rail.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5) {
      d.moved = true;
      rail.current.style.scrollSnapType = 'none';
    }
    rail.current.scrollLeft = d.startScroll - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
    if (rail.current) rail.current.style.scrollSnapType = '';
  };

  return (
    <section className="relative bg-[#F4EFE6] py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <Eyebrow>Collections</Eyebrow>
            <SplitWords
              text="Fabrics for Distinctive Creations."
              accent={['Distinctive']}
              accentClassName="italic font-serif text-[#713B43]"
              className="font-editorial text-4xl sm:text-5xl leading-[1.1] text-[#30241F]"
            />
            <Reveal delay={200}>
              <p className="mt-5 text-sm sm:text-base text-[#30241F]/75 leading-relaxed">
                Drag through the collections. Every bolt is chosen for how it drapes, how it tailors, and how it
                catches the light.
              </p>
            </Reveal>
          </div>
          <Reveal delay={300} className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous collections"
              onClick={() => scrollBy(-1)}
              className="w-12 h-12 rounded-full border border-[#AD8A53]/50 flex items-center justify-center text-[#30241F] hover:bg-[#30241F] hover:text-[#FAF8F3] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next collections"
              onClick={() => scrollBy(1)}
              className="w-12 h-12 rounded-full border border-[#AD8A53]/50 flex items-center justify-center text-[#30241F] hover:bg-[#30241F] hover:text-[#FAF8F3] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </Reveal>
        </div>
      </div>

      {/* Rail: bleeds to the right edge on large screens */}
      <div
        ref={rail}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="no-scrollbar flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-4 cursor-grab active:cursor-grabbing"
      >
        {COLLECTIONS.map((c, i) => (
          <Reveal
            key={c.category}
            variant="right"
            delay={i * 90}
            className="snap-start shrink-0 w-[78vw] sm:w-[340px] lg:w-[360px]"
          >
            <div data-card>
              <Tilt max={7}>
                <Link
                  href={`/collections?category=${c.category}`}
                  draggable={false}
                  className="group block relative aspect-[3/4] overflow-hidden bg-[#30241F] fabric-sheen"
                >
                  <img
                    src={c.fabric.src}
                    alt={`${c.title} — ${c.fabric.technique}`}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714]/90 via-[#1C1714]/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                  <span className="absolute top-4 left-4 font-editorial text-[#FAF8F3]/80 text-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FAF8F3]/10 backdrop-blur border border-[#FAF8F3]/30 flex items-center justify-center text-[#FAF8F3] transition-all duration-500 group-hover:bg-[#C8A974] group-hover:text-[#1C1714] group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-[#FAF8F3]">
                    <h3 className="font-editorial text-2xl leading-tight">{c.title}</h3>
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] max-lg:grid-rows-[1fr] transition-[grid-template-rows] duration-500">
                      <p className="overflow-hidden text-xs sm:text-[13px] text-[#E9DFCF]/85 leading-relaxed">
                        <span className="block pt-2">{c.line}</span>
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-[#C8A974]">
                      <span className="h-px w-6 bg-[#C8A974] transition-all duration-500 group-hover:w-12" />
                      Explore
                    </span>
                  </div>
                </Link>
              </Tilt>
            </div>
          </Reveal>
        ))}
        {/* Final "view all" tile */}
        <div className="snap-start shrink-0 w-[60vw] sm:w-[260px] flex items-center">
          <Link
            href="/collections"
            draggable={false}
            className="group w-full aspect-[3/4] border border-[#AD8A53]/40 flex flex-col items-center justify-center gap-4 text-center hover:bg-[#30241F] transition-colors duration-500"
          >
            <span className="w-16 h-16 rounded-full border border-[#AD8A53] flex items-center justify-center text-[#AD8A53] group-hover:bg-[#C8A974] group-hover:text-[#1C1714] transition-colors">
              <ArrowRight className="w-5 h-5" />
            </span>
            <span className="font-editorial text-xl text-[#30241F] group-hover:text-[#FAF8F3] transition-colors">
              View the full
              <br />
              catalogue
            </span>
          </Link>
        </div>
      </div>

      {/* Progress thread */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="h-px bg-[#AD8A53]/25 relative">
          <div
            className="absolute left-0 top-[-1px] h-[3px] bg-[#713B43] transition-[width] duration-200"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
