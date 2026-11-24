'use client';

import React, { useRef } from 'react';
import { useHomeFabrics } from './useHomeFabrics';
import { Counter, Eyebrow, Parallax, Reveal, SplitWords, useScrollProgress } from './motion';


export default function BrandIntro() {
  const { pick } = useHomeFabrics();
  const COLLAGE = [
    pick('purple-zari-vine', undefined, 0),
    pick('ivory-pearl-floral', undefined, 1),
    pick('red-sequin-lattice', undefined, 2),
  ];
  const threadRef = useRef<SVGPathElement | null>(null);
  const sectionRef = useScrollProgress<HTMLElement>((p) => {
    const path = threadRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    // Thread is fully stitched by the time the section reaches mid-screen.
    path.style.strokeDashoffset = `${len * (1 - Math.min(1, p * 1.7))}`;
  });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#FAF8F3] py-20 sm:py-28 lg:py-32">
      {/* Golden thread stitched by scrolling */}
      <svg
        aria-hidden
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full"
      >
        <path
          ref={threadRef}
          d="M-40 120 C 260 40, 420 320, 640 260 S 980 40, 1120 220 S 1300 640, 980 700 S 520 860, 300 760 S 60 620, -40 820"
          fill="none"
          stroke="#AD8A53"
          strokeWidth="1.4"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
        <div className="lg:col-span-6">
          <Eyebrow>Our Story</Eyebrow>
          <SplitWords
            text="Every Thread Tells a Story."
            accent={['Story.']}
            accentClassName="italic font-serif text-[#713B43]"
            className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-[#30241F]"
          />
          <Reveal delay={200}>
            <p className="mt-7 text-sm sm:text-base text-[#30241F]/80 leading-relaxed">
              From the textile lanes of Surat, <strong className="font-semibold text-[#30241F]">Khodal Fashion</strong>{' '}
              creates embroidered fabrics for the most important moments in a man’s wardrobe — the wedding Sherwani,
              the reception Jodhpuri, the festive Kurta.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-4 text-sm sm:text-base text-[#30241F]/80 leading-relaxed">
              We don’t sell finished garments. Our canvas is the unstitched fabric: zari that holds its lustre, sequins
              that catch candlelight, pearls set row by row — built to survive cutting, tailoring and a lifetime of
              celebration.
            </p>
          </Reveal>

          <Reveal delay={440} className="mt-10 grid grid-cols-3 gap-4 border-t border-[#AD8A53]/25 pt-6">
            <div>
              <Counter to={85} suffix="+" className="font-editorial text-3xl sm:text-4xl text-[#713B43]" />
              <p className="text-[12px] sm:text-[13px] uppercase tracking-widest text-[#30241F]/75 mt-1">Curated designs</p>
            </div>
            <div>
              <Counter to={20} suffix=" m" className="font-editorial text-3xl sm:text-4xl text-[#713B43]" />
              <p className="text-[12px] sm:text-[13px] uppercase tracking-widest text-[#30241F]/75 mt-1">Ready-stock MOQ</p>
            </div>
            <div>
              <Counter to={100} suffix=" m" className="font-editorial text-3xl sm:text-4xl text-[#713B43]" />
              <p className="text-[12px] sm:text-[13px] uppercase tracking-widest text-[#30241F]/75 mt-1">Custom MOQ</p>
            </div>
          </Reveal>
        </div>

        {/* Parallax fabric collage */}
        <div className="lg:col-span-6 relative h-[440px] sm:h-[540px] lg:h-[600px]">
          <Parallax speed={0.08} className="absolute left-0 top-6 w-[58%] h-[72%]">
            <Reveal variant="unfurl" className="h-full">
              <div className="fabric-sheen h-full overflow-hidden border border-[#AD8A53]/30 shadow-2xl">
                <img src={COLLAGE[0].src} alt={COLLAGE[0].name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-[1500ms]" />
              </div>
              <p className="mt-2 text-[12px] uppercase tracking-widest text-[#AD8A53]">{COLLAGE[0].technique}</p>
            </Reveal>
          </Parallax>
          <Parallax speed={-0.12} className="absolute right-0 top-0 w-[44%] h-[46%]">
            <Reveal variant="unfurl" delay={200} className="h-full">
              <div className="fabric-sheen h-full overflow-hidden border border-[#AD8A53]/30 shadow-xl">
                <img src={COLLAGE[1].src} alt={COLLAGE[1].name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-[1500ms]" />
              </div>
            </Reveal>
          </Parallax>
          <Parallax speed={0.2} className="absolute right-[4%] bottom-0 w-[48%] h-[44%]">
            <Reveal variant="unfurl" delay={350} className="h-full">
              <div className="fabric-sheen h-full overflow-hidden border-4 border-[#FAF8F3] shadow-2xl">
                <img src={COLLAGE[2].src} alt={COLLAGE[2].name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-[1500ms]" />
              </div>
            </Reveal>
          </Parallax>
          {/* Rotating seal */}
          <div className="absolute left-[46%] top-[58%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 z-10">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-slow-spin">
              <defs>
                <path id="seal-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
              </defs>
              <circle cx="50" cy="50" r="49" fill="#30241F" />
              <text fill="#C8A974" fontSize="9.5" letterSpacing="3.2" style={{ textTransform: 'uppercase' }}>
                <textPath href="#seal-circle">Crafted in Surat · Made for royalty ·</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-editorial text-[#C8A974] text-xl">KF</span>
          </div>
        </div>
      </div>
    </section>
  );
}
