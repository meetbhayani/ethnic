'use client';

import React, { useEffect, useRef, useState } from 'react';

/** True when the visitor asked the OS to minimise motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Becomes true once the element scrolls into view (and stays true when `once`). */
export function useInView<T extends Element>(
  options: { once?: boolean; threshold?: number; rootMargin?: string } = {},
) {
  const { once = true, threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, rootMargin]);

  return [ref, inView] as const;
}

type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'unfurl' | 'unroll';

/** Fades / slides / unfurls its children in when they enter the viewport. */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  threshold,
}: {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: React.ElementType;
  threshold?: number;
}) {
  const [ref, inView] = useInView<HTMLElement>({ threshold });
  // Clip-based variants clip an inner wrapper: IntersectionObserver ignores fully clipped targets.
  const clipped = variant === 'unfurl' || variant === 'unroll';
  return (
    <Tag
      ref={ref}
      data-variant={variant}
      data-shown={inView}
      className={`reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {clipped ? <div className="reveal-clip h-full">{children}</div> : children}
    </Tag>
  );
}

/** Headline whose words rise into place one after another. */
export function SplitWords({
  text,
  className = '',
  as: Tag = 'h2',
  stagger = 70,
  delay = 0,
  accent,
  accentClassName = 'italic font-serif text-[#C8A974]',
}: {
  text: string;
  className?: string;
  as?: React.ElementType;
  stagger?: number;
  delay?: number;
  /** Words (exact match, punctuation included) to style with `accentClassName`. */
  accent?: string[];
  accentClassName?: string;
}) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.3 });
  const words = text.split(' ');
  return (
    <Tag ref={ref} data-shown={inView} className={className} aria-label={text}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="split-word" aria-hidden="true">
            <span
              className={accent?.includes(word) ? accentClassName : undefined}
              style={{ '--word-delay': `${delay + i * stagger}ms` } as React.CSSProperties}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/** Number that counts up from zero the first time it is seen. */
export function Counter({
  to,
  duration = 1800,
  prefix = '',
  suffix = '',
  className = '',
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

/**
 * Calls `onProgress` with how far the element has travelled through the viewport
 * (0 = just entering at the bottom, 1 = just left at the top). Runs on rAF, no re-renders.
 */
export function useScrollProgress<T extends HTMLElement>(onProgress: (p: number) => void) {
  const ref = useRef<T | null>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - rect.top) / (vh + rect.height);
      cb.current(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

/** Moves its children vertically at a different speed from the page scroll. */
export function Parallax({
  children,
  speed = 0.15,
  className = '',
}: {
  children: React.ReactNode;
  /** Pixels moved per pixel scrolled; negative moves the opposite way. */
  speed?: number;
  className?: string;
}) {
  const inner = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const ref = useScrollProgress<HTMLDivElement>((p) => {
    if (!inner.current || reduced) return;
    const distance = (p - 0.5) * window.innerHeight * speed * 2;
    inner.current.style.transform = `translate3d(0, ${distance.toFixed(1)}px, 0)`;
  });
  return (
    <div ref={ref} className={className}>
      <div ref={inner} className="will-change-transform h-full">
        {children}
      </div>
    </div>
  );
}

/** 3D tilt that follows the pointer, with a light spot that tracks the cursor. */
export function Tilt({
  children,
  className = '',
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
    ref.current.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
    ref.current.style.setProperty('--mx', `${x * 100}%`);
    ref.current.style.setProperty('--my', `${y * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group/tilt relative transition-transform duration-300 ease-out [transform-style:preserve-3d] ${className}`}
      style={{ transform: 'perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{
          background:
            'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,240,210,0.28), transparent 45%)',
          mixBlendMode: 'soft-light',
        }}
      />
    </div>
  );
}

/** Thin gold "thread" across the top of the viewport showing page scroll progress. */
export function ScrollThread() {
  const bar = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden className="fixed top-0 inset-x-0 h-[3px] z-[60] pointer-events-none">
      <div
        ref={bar}
        className="h-full origin-left bg-gradient-to-r from-[#713B43] via-[#AD8A53] to-[#C8A974]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

/** Small uppercase label used above every section heading. */
export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <Reveal variant="fade" className="flex items-center gap-3 mb-4">
      <span className={`h-px w-8 ${light ? 'bg-[#C8A974]' : 'bg-[#AD8A53]'}`} />
      <span
        className={`text-[12px] sm:text-[13px] uppercase tracking-ultra font-semibold ${
          light ? 'text-[#C8A974]' : 'text-[#AD8A53]'
        }`}
      >
        {children}
      </span>
    </Reveal>
  );
}
