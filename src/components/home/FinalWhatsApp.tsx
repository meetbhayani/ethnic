'use client';

import React, { useMemo, useState } from 'react';
import {
  Check,
  CheckCheck,
  ClipboardList,
  Copy,
  FileText,
  MousePointerClick,
  Pencil,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import { HOME_FABRICS, HomeFabric } from './fabric-library';
import { useHomeFabrics } from './useHomeFabrics';
import { Reveal, SplitWords } from './motion';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const INTENTS = [
  { id: 'ready', label: 'Ready-stock fabric', sentence: 'I would like to buy ready-stock fabric' },
  { id: 'custom', label: 'Made to order', sentence: 'I would like a made-to-order version of one of your designs' },
  { id: 'swatch', label: 'Swatch kit / samples', sentence: 'I would like a swatch kit or sample cuts' },
  { id: 'partner', label: 'Wholesale partnership', sentence: 'I would like to discuss a long-term wholesale partnership' },
] as const;

const GARMENTS = ['Sherwani', 'Kurta', 'Jodhpuri', 'Indo-Western', 'Not sure yet'];
const QUANTITIES = ['Sample cut', '10–15 metres (MOQ)', '50 metres', '100+ metres'];

const HOW_IT_WORKS = [
  { icon: MousePointerClick, title: 'Choose what you need', text: 'Tell us the purpose, garment and quantity.' },
  { icon: ClipboardList, title: 'Check your message', text: 'We write it for you — edit anything you like.' },
  { icon: Send, title: 'Send on WhatsApp', text: 'WhatsApp opens with the message ready. You press send.' },
];

/** Small numbered label used for each step of the form. */
function StepLabel({ n, children, hint }: { n: number; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-3">
      <span className="flex items-center gap-2.5">
        <span className="w-6 h-6 shrink-0 rounded-full bg-[#C8A974] text-[#3B0E17] text-[13px] font-bold flex items-center justify-center">
          {n}
        </span>
        <span className="text-sm sm:text-[15px] font-semibold text-[#FAF8F3]">{children}</span>
      </span>
      {hint && <span className="text-[13px] text-[#E9DFCF]/70 text-right">{hint}</span>}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2.5 rounded-full text-[13px] border transition-all duration-200 ${
        active
          ? 'bg-[#FAF8F3] text-[#3B0E17] border-[#FAF8F3] font-semibold shadow-md'
          : 'border-[#C8A974]/35 text-[#E9DFCF] hover:border-[#C8A974] hover:bg-white/5'
      }`}
    >
      {active && <Check className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />}
      {children}
    </button>
  );
}

export default function FinalWhatsApp() {
  const { generateWhatsAppUrl, openEnquiryModal } = useEnquiry();
  const { live, list } = useHomeFabrics();
  const SWATCHES = (live ? list : HOME_FABRICS.filter((f) => f.id !== 'pastel-motif-thread')).slice(0, 8);
  const [intent, setIntent] = useState<(typeof INTENTS)[number]['id']>('ready');
  const [garment, setGarment] = useState(GARMENTS[0]);
  const [quantity, setQuantity] = useState(QUANTITIES[1]);
  const [fabric, setFabric] = useState<HomeFabric | null>(null);
  const [customNote, setCustomNote] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const autoNote = useMemo(() => {
    const i = INTENTS.find((x) => x.id === intent) ?? INTENTS[0];
    const forGarment = garment === 'Not sure yet' ? '' : ` for ${garment}`;
    const fabricPart = fabric ? ` I like the "${fabric.name}" design (${fabric.technique.toLowerCase()}).` : '';
    return `Hello Khodal Fashion, ${i.sentence}${forGarment}.${fabricPart}`;
  }, [intent, garment, fabric]);

  const note = customNote ?? autoNote;

  const whatsappUrl = generateWhatsAppUrl({
    sourcePage: 'Website home page',
    productName: fabric?.name,
    quantity,
    customNote: note,
  });
  // Show exactly what WhatsApp will receive.
  const fullMessage = useMemo(() => {
    try {
      return decodeURIComponent(whatsappUrl.split('?text=')[1] ?? '');
    } catch {
      return note;
    }
  }, [whatsappUrl, note]);

  const resetCustom = () => {
    setCustomNote(null);
    setEditing(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  const stubFabric = fabric ?? SWATCHES[Math.min(1, SWATCHES.length - 1)];

  return (
    <section id="whatsapp-enquiry" className="relative bg-[#FAF8F3] py-14 sm:py-20 overflow-hidden">
      <div aria-hidden className="absolute inset-0 weave-texture opacity-60 pointer-events-none" />

      <Reveal variant="scale" className="relative max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="ticket flex flex-col lg:flex-row">
          {/* ───────── Ticket body ───────── */}
          <div className="ticket-main relative flex-1 min-w-0 bg-gradient-to-br from-[#5C1A27] via-[#4D1721] to-[#3B0E17] text-[#FAF8F3]">
            <div aria-hidden className="absolute inset-0 weave-texture opacity-25 pointer-events-none" />
            <div aria-hidden className="absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full bg-[#25D366]/10 blur-3xl pointer-events-none" />

            {/* Ticket header strip */}
            <div className="relative flex items-center justify-between gap-3 px-8 sm:px-12 py-3.5 border-b border-dashed border-[#C8A974]/30 text-[12px] sm:text-[13px] uppercase tracking-widest">
              <span className="flex items-center gap-2 font-semibold text-[#FAF8F3]">
                <span className="w-2 h-2 rounded-full bg-[#25D366]" /> Khodal Fashion · Surat Sales Desk
              </span>
              <span className="hidden sm:inline text-[#C8A974]">B2B Enquiry Pass</span>
            </div>

            <div className="relative px-5 sm:px-10 lg:px-12 py-8 sm:py-10">
              {/* Purpose */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-10 items-end">
                <div className="xl:col-span-7">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#7EE2A8] text-[13px] uppercase tracking-widest font-semibold">
                    <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp Enquiry
                  </span>
                  <SplitWords
                    text="Get prices & samples on WhatsApp."
                    accent={['WhatsApp.']}
                    className="mt-4 font-editorial text-3xl sm:text-4xl lg:text-5xl leading-[1.1]"
                  />
                  <p className="mt-4 text-sm sm:text-base text-[#F4EFE6]/80 leading-relaxed max-w-2xl">
                    Use this to message our Surat sales team directly. Answer three quick questions and we’ll prepare
                    your enquiry for you. Our team replies on WhatsApp with wholesale prices, stock availability and
                    sample options.
                  </p>
                </div>
                <ol className="xl:col-span-5 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-2.5">
                  {HOW_IT_WORKS.map((s, i) => (
                    <li key={s.title} className="flex items-start gap-3 bg-black/15 border border-[#C8A974]/20 p-3 rounded-lg">
                      <span className="w-8 h-8 shrink-0 rounded-full border border-[#C8A974]/50 text-[#C8A974] flex items-center justify-center">
                        <s.icon className="w-4 h-4" />
                      </span>
                      <span>
                        <span className="block text-[13px] font-semibold">
                          {i + 1}. {s.title}
                        </span>
                        <span className="block text-xs text-[#E9DFCF]/65 mt-0.5">{s.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Builder + preview */}
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Questions */}
          <Reveal className="lg:col-span-7 space-y-8 bg-black/15 border border-[#C8A974]/20 rounded-2xl p-5 sm:p-7">
            <div>
              <StepLabel n={1}>What do you need?</StepLabel>
              <div className="flex flex-wrap gap-2">
                {INTENTS.map((i) => (
                  <Chip
                    key={i.id}
                    active={intent === i.id}
                    onClick={() => {
                      setIntent(i.id);
                      resetCustom();
                    }}
                  >
                    {i.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <StepLabel n={2}>Which garment?</StepLabel>
                <div className="flex flex-wrap gap-2">
                  {GARMENTS.map((g) => (
                    <Chip
                      key={g}
                      active={garment === g}
                      onClick={() => {
                        setGarment(g);
                        resetCustom();
                      }}
                    >
                      {g}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <StepLabel n={3}>How much fabric?</StepLabel>
                <div className="flex flex-wrap gap-2">
                  {QUANTITIES.map((q) => (
                    <Chip key={q} active={quantity === q} onClick={() => setQuantity(q)}>
                      {q}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <StepLabel n={4} hint="Optional">
                Saw a fabric you like?
              </StepLabel>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
                {SWATCHES.map((f) => {
                  const active = fabric?.id === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFabric(active ? null : f);
                        resetCustom();
                      }}
                      aria-pressed={active}
                      aria-label={f.name}
                      title={f.name}
                      className={`group relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                        active
                          ? 'ring-[3px] ring-[#C8A974] ring-offset-2 ring-offset-[#4D1721] scale-[1.03]'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={f.src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {active && (
                        <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#C8A974] text-[#3B0E17] flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-[#E9DFCF]/60 min-h-[1rem]">
                {fabric ? (
                  <>
                    Selected: <span className="text-[#FAF8F3] font-semibold">{fabric.name}</span> — {fabric.technique}.{' '}
                    <button type="button" onClick={() => { setFabric(null); resetCustom(); }} className="underline hover:text-[#FAF8F3]">
                      Remove
                    </button>
                  </>
                ) : (
                  'Tap a photo to mention that fabric in your message, or skip this step.'
                )}
              </p>
            </div>
          </Reveal>

          {/* Chat preview */}
          <Reveal delay={150} className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10">
              {/* Chat header */}
              <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3">
                <span className="w-10 h-10 rounded-full bg-[#FAF8F3] text-[#5C1A27] font-editorial text-sm flex items-center justify-center">
                  KF
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-white truncate">Khodal Fashion — Sales Desk</span>
                  <span className="block text-[13px] text-white/70">Surat, Gujarat · Business account</span>
                </span>
                <ShieldCheck className="w-5 h-5 text-white/80" />
              </div>

              {/* Chat body */}
              <div className="bg-[#ECE5DD] p-4 sm:p-5 min-h-[280px] bg-[radial-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:14px_14px]">
                <p className="mx-auto mb-4 w-max px-3 py-1 rounded-md bg-[#FFF5C4] text-[12px] text-[#5b5130] text-center">
                  Preview — nothing is sent until you press Send in WhatsApp
                </p>
                <div className="ml-auto max-w-[94%] relative bg-[#DCF8C6] text-[#111B21] rounded-lg rounded-tr-none px-3.5 py-3 shadow-sm">
                  <span aria-hidden className="absolute top-0 -right-2 border-t-[10px] border-t-[#DCF8C6] border-r-[10px] border-r-transparent" />
                  {editing ? (
                    <>
                      <label htmlFor="wa-note" className="block text-[13px] font-semibold text-[#075E54] mb-1">
                        Your requirement
                      </label>
                      <textarea
                        id="wa-note"
                        rows={5}
                        value={note}
                        onChange={(e) => setCustomNote(e.target.value)}
                        className="w-full bg-white/80 p-2.5 text-[13px] leading-relaxed rounded border border-[#8DC377] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                      />
                    </>
                  ) : (
                    <p className="text-[13px] leading-relaxed whitespace-pre-line break-words">{fullMessage}</p>
                  )}
                  <span className="mt-1 flex items-center justify-end gap-1 text-[12px] text-[#667781]">
                    now <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                  </span>
                </div>
              </div>

              {/* Tools */}
              <div className="flex items-center justify-between gap-2 bg-[#F0F2F5] px-4 py-2.5 text-[13px] text-[#3B4A54]">
                <button
                  type="button"
                  onClick={() => setEditing((v) => !v)}
                  className="inline-flex items-center gap-1.5 font-semibold hover:text-[#075E54]"
                >
                  {editing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                  {editing ? 'Done' : 'Edit message'}
                </button>
                {customNote !== null && !editing && (
                  <button type="button" onClick={resetCustom} className="hover:text-[#075E54] underline">
                    Reset
                  </button>
                )}
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 font-semibold hover:text-[#075E54]">
                  {copied ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-5 flex items-center justify-center gap-3 w-full px-8 py-4 bg-[#25D366] hover:bg-[#1fb757] text-white text-sm sm:text-[15px] font-semibold rounded-full shadow-[0_20px_50px_-12px_rgba(37,211,102,0.7)] transition-colors"
            >
              <span aria-hidden className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ring-pulse" />
              <WhatsAppIcon className="w-5 h-5" />
              Send on WhatsApp
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <p className="mt-3 text-center text-xs text-[#E9DFCF]/65">
              Prefer email?{' '}
              <button
                type="button"
                onClick={() => openEnquiryModal(undefined, quantity)}
                className="inline-flex items-center gap-1 font-semibold text-[#FAF8F3] underline underline-offset-2 hover:text-[#C8A974]"
              >
                <FileText className="w-3.5 h-3.5" /> Fill in the enquiry form
              </button>
            </p>
          </Reveal>
              </div>
            </div>
          </div>

          {/* ───────── Tear-off stub ───────── */}
          <div className="ticket-stub-edge lg:w-[300px] xl:w-[320px] shrink-0">
            <div className="ticket-stub relative h-full min-h-[240px] overflow-hidden bg-[#5C1A27] border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-[#C8A974]/50">
              <img
                key={stubFabric.id}
                src={stubFabric.src}
                alt={stubFabric.name}
                className="absolute inset-0 w-full h-full object-cover animate-fade-up-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0910] via-[#4D1721]/65 to-[#4D1721]/5" />

              <div className="relative h-full flex lg:flex-col items-end lg:items-stretch justify-between gap-4 p-6 sm:p-8 pb-8 lg:pr-10">
                <a
                  href="/collections"
                  className="order-2 lg:order-1 self-end lg:self-end shrink-0 px-4 py-2 bg-[#FAF8F3] hover:bg-[#F4EFE6] text-[#3B0E17] text-[12px] tracking-widest uppercase font-bold shadow"
                >
                  View collection
                </a>
                <div className="order-1 lg:order-2 text-[#FAF8F3]">
                  <p className="font-editorial text-[#E3C98F] text-sm font-semibold tracking-widest uppercase">The Blend</p>
                  <p className="font-serif text-3xl sm:text-4xl leading-none mt-1">Tradition &amp; Trend</p>
                  <p className="mt-3 text-xs text-[#F4EFE6]/80 max-w-[240px]">
                    {fabric ? `Your pick: ${fabric.name}.` : 'Embroidered in Surat for the modern groom.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
