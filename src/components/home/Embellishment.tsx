'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, PenTool, Scissors, ShieldCheck, Layers } from 'lucide-react';
import { fabricById } from './fabric-library';
import { Eyebrow, Reveal, SplitWords, useScrollProgress } from './motion';

const TECHNIQUES = [
  {
    id: 'zari',
    name: 'Zari',
    fabric: fabricById('purple-zari-vine'),
    title: 'Zari & Dabka',
    text: 'Metallic threads laid in vines, florals and borders. Zari brings the warm, antique lustre that defines royal menswear, and holds its shine through tailoring and pressing.',
    traits: ['Antique & bright gold tones', 'Flexible for structured garments', 'Ideal for Sherwani & Jodhpuri'],
  },
  {
    id: 'sequin',
    name: 'Sequin',
    fabric: fabricById('red-sequin-lattice'),
    title: 'Sequin & Sitara',
    text: 'Sequins are fed and stitched by dedicated machine attachments, set in lattices or scattered like stars. Each one catches light from a different angle as the wearer moves.',
    traits: ['Uniform spacing by machine', 'Lattice, buti and all-over layouts', 'Evening & reception wear'],
  },
  {
    id: 'pearl',
    name: 'Pearl & Bead',
    fabric: fabricById('ivory-pearl-floral'),
    title: 'Pearl, Bead & Cutdana',
    text: 'Pearls and cutdana outline motifs with a raised, jewel-like finish. Ends are secured and checked by hand so nothing loosens when the fabric is cut and stitched.',
    traits: ['Raised, dimensional surface', 'Hand-secured thread ends', 'Bridal-grade richness'],
  },
  {
    id: 'resham',
    name: 'Resham',
    fabric: fabricById('ivory-multicolour-sequin'),
    title: 'Resham Threadwork',
    text: 'Fine silk-finish threads in many shades build up florals and jaals with a painterly, hand-drawn feel — rich in colour, soft to the touch, and light enough for Kurtas.',
    traits: ['Multi-shade colour blending', 'Soft hand-feel', 'Festive Kurtas & jackets'],
  },
  {
    id: 'applique',
    name: 'Appliqué',
    fabric: fabricById('teal-floral-applique'),
    title: 'Appliqué & Cut-Work',
    text: 'Fabric shapes are layered and outlined with zari and sequins for bold, sculpted motifs. A contemporary technique made for Indo-Western silhouettes.',
    traits: ['Layered, dimensional motifs', 'Tone-on-tone or contrast', 'Modern Indo-Western looks'],
  },
];

const STEPS = [
  {
    icon: PenTool,
    title: 'Design & Digitising',
    text: 'Artwork is converted into a stitch file — every needle point, colour change and sequin drop is mapped digitally.',
  },
  {
    icon: Layers,
    title: 'Fabric Preparation',
    text: 'The base fabric is checked, stabilised and framed tight so the embroidery stays true across the full width.',
  },
  {
    icon: Cpu,
    title: 'Multi-Head Embroidery',
    text: 'Computerised multi-head machines stitch many repeats at once, with sequin and cording attachments for consistent results metre after metre.',
  },
  {
    icon: Scissors,
    title: 'Hand Finishing',
    text: 'Artisans trim jump threads, secure bead and pearl ends, and clean the reverse — the human touch machines can’t replace.',
  },
  {
    icon: ShieldCheck,
    title: 'Inspection & Rolling',
    text: 'Every roll is inspected for missed stitches, shade and width before it is rolled, packed and dispatched.',
  },
];

export default function Embellishment() {
  const [tab, setTab] = useState(0);
  const t = TECHNIQUES[tab];

  const lineRef = React.useRef<HTMLDivElement | null>(null);
  const timelineRef = useScrollProgress<HTMLDivElement>((p) => {
    if (!lineRef.current) return;
    const fill = Math.min(1, Math.max(0, (p - 0.15) / 0.5));
    lineRef.current.style.setProperty('--fill', String(fill));
  });

  return (
    <section className="relative bg-[#1C1714] text-[#FAF8F3] py-20 sm:py-28 overflow-hidden">
      <div aria-hidden className="absolute inset-0 weave-texture opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow light>Embroidery & Production</Eyebrow>
          <SplitWords
            text="The Art of Embellishment."
            accent={['Embellishment.']}
            className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.08]"
          />
          <Reveal delay={200}>
            <p className="mt-5 text-sm sm:text-base text-[#E9DFCF]/75 leading-relaxed">
              Five techniques, one standard. Choose a technique to see it up close.
            </p>
          </Reveal>
        </div>

        {/* Technique tabs */}
        <Reveal delay={250} className="mt-10 -mx-4 px-4 overflow-x-auto no-scrollbar">
          <div role="tablist" aria-label="Embroidery techniques" className="flex gap-2 w-max">
            {TECHNIQUES.map((tech, i) => (
              <button
                key={tech.id}
                role="tab"
                aria-selected={i === tab}
                onClick={() => setTab(i)}
                className={`relative px-5 py-2.5 text-[13px] uppercase tracking-widest font-semibold border transition-all duration-300 ${
                  i === tab
                    ? 'bg-[#C8A974] text-[#1C1714] border-[#C8A974]'
                    : 'border-[#C8A974]/30 text-[#E9DFCF]/80 hover:border-[#C8A974] hover:text-[#FAF8F3]'
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Embroidery hoop */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-[72vw] max-w-[460px] aspect-square">
              {/* Outer wooden/gold hoop ring */}
              <div className="absolute inset-0 rounded-full p-[10px] bg-[conic-gradient(from_0deg,#7A5B2E,#E3C98F,#8C6F4A,#C8A974,#6B4E26,#E3C98F,#7A5B2E)] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#30241F] ring-4 ring-[#1C1714]/40">
                  <img
                    key={t.id}
                    src={t.fabric.src}
                    alt={`${t.title} embroidery close-up`}
                    className="absolute inset-0 w-full h-full object-cover animate-hoop-in"
                  />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.65)]" />
                </div>
              </div>
              {/* Hoop screw */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 rounded-sm bg-gradient-to-b from-[#E3C98F] to-[#7A5B2E] shadow-lg" />
              {/* Orbiting technique label */}
              <svg viewBox="0 0 100 100" className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] h-[calc(100%+3rem)] sm:h-[calc(100%+4rem)] animate-slow-spin pointer-events-none">
                <defs>
                  <path id="hoop-orbit" d="M50 50 m-47 0 a47 47 0 1 1 94 0 a47 47 0 1 1 -94 0" />
                </defs>
                <text fill="#C8A974" fontSize="3.2" letterSpacing="1.6" opacity="0.7">
                  <textPath href="#hoop-orbit">
                    {`${t.title.toUpperCase()} · KHODAL FASHION · SURAT · ${t.title.toUpperCase()} · HANDFINISHED ·`}
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/* Technique details */}
          <div key={t.id} className="lg:col-span-6 animate-fade-up-in">
            <span className="font-editorial text-[#C8A974] text-sm">
              {String(tab + 1).padStart(2, '0')} / {String(TECHNIQUES.length).padStart(2, '0')}
            </span>
            <h3 className="mt-2 font-editorial text-3xl sm:text-4xl">{t.title}</h3>
            <p className="mt-4 text-sm sm:text-base text-[#E9DFCF]/80 leading-relaxed">{t.text}</p>
            <ul className="mt-6 space-y-3">
              {t.traits.map((trait, i) => (
                <li
                  key={trait}
                  className="flex items-center gap-3 text-sm animate-fade-up-in"
                  style={{ animationDelay: `${150 + i * 100}ms` }}
                >
                  <span className="w-6 h-px bg-[#C8A974]" />
                  {trait}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-[#E9DFCF]/70">Shown: {t.fabric.name}</p>
            <Link
              href="/craftsmanship"
              className="group mt-6 inline-flex items-center gap-2 text-[13px] uppercase tracking-widest font-semibold text-[#C8A974] hover:text-[#FAF8F3]"
            >
              More on our craft <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Machine production timeline */}
        <div ref={timelineRef} className="mt-24 sm:mt-32">
          <Reveal>
            <h3 className="font-editorial text-2xl sm:text-3xl max-w-xl">
              From stitch file to finished roll — <span className="italic font-serif text-[#C8A974]">how machine embroidery is made</span>
            </h3>
          </Reveal>

          <div ref={lineRef} className="relative mt-12" style={{ '--fill': '0' } as React.CSSProperties}>
            {/* Desktop horizontal line */}
            <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-[#C8A974]/20">
              <div className="h-full bg-[#C8A974] origin-left" style={{ transform: 'scaleX(var(--fill))' }} />
            </div>
            {/* Mobile vertical line */}
            <div className="lg:hidden absolute left-7 top-0 bottom-0 w-px bg-[#C8A974]/20">
              <div className="w-full h-full bg-[#C8A974] origin-top" style={{ transform: 'scaleY(var(--fill))' }} />
            </div>

            <ol className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-6">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 120} className="relative flex lg:block gap-5">
                  <span className="relative z-10 shrink-0 w-14 h-14 rounded-full bg-[#1C1714] border border-[#C8A974] flex items-center justify-center text-[#C8A974] shadow-[0_0_0_6px_#1C1714]">
                    <s.icon className="w-5 h-5" />
                  </span>
                  <div className="lg:mt-6">
                    <span className="text-[12px] uppercase tracking-widest text-[#C8A974]/70">Step {i + 1}</span>
                    <h4 className="font-editorial text-lg mt-1">{s.title}</h4>
                    <p className="mt-2 text-[13px] text-[#E9DFCF]/70 leading-relaxed">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Running-stitch flourish */}
          <svg aria-hidden viewBox="0 0 800 40" className="mt-16 w-full h-8 text-[#C8A974]/50">
            <path d="M0 20 Q 100 0 200 20 T 400 20 T 600 20 T 800 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-stitch" />
          </svg>
        </div>
      </div>
    </section>
  );
}
