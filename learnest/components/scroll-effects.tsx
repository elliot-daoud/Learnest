"use client";

import { useEffect, useRef, useState } from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fait apparaître son contenu en fondu quand il entre dans l'écran.
export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || el.getBoundingClientRect().top < window.innerHeight) return;
    setHidden(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHidden(false);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${hidden ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"} ${className}`}
    >
      {children}
    </div>
  );
}

// Compte de 0 à `to` quand il devient visible. Le HTML serveur contient déjà la valeur finale.
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    setValue(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

// Les lignes du titre glissent latéralement (en sens opposés) pendant le défilement.
export function ScrollTitle({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, window.scrollY / 400);
      el.style.setProperty("--p", String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <h1
      ref={ref}
      className="text-[clamp(2.75rem,14vw,6rem)] font-black uppercase leading-[0.92] tracking-tighter"
      style={{ ["--p" as string]: 0 }}
    >
      {lines.map((line, i) => (
        <span
          key={line}
          className={`block will-change-transform ${i === lines.length - 1 ? "text-emerald-600 dark:text-emerald-400" : ""}`}
          style={{ transform: `translateX(calc(var(--p) * ${i % 2 === 0 ? 36 : -36}px))` }}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}
