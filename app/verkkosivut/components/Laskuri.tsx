"use client";

import { useEffect, useRef } from "react";

/* Luku laskee nollasta tavoitteeseen kerran, kun se tulee näkyviin.
   Palvelin piirtää valmiin luvun, joten ilman JS:ää tai liikkeen
   vähennyksellä luku on heti oikein. Jo näkyvissä olevaa ei nollata. */
export default function Laskuri({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight) return;

    el.textContent = "0";
    let raf = 0;
    /* Vierityskuuntelija eika IntersectionObserver: nopea hyppy luvun
       yli ei muuta leikkaustilaa, jolloin observer ei laukea ja luku
       jaisi nollaan. Taalla ohitettu luku asetetaan suoraan valmiiksi. */
    const tarkista = () => {
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight * 0.85) return;
      removeEventListener("scroll", tarkista);
      if (r.bottom < 0) {
        el.textContent = String(n);
        return;
      }
      let t0 = 0;
      const f = (t: number) => {
        if (!t0) t0 = t;
        const p = Math.min(1, (t - t0) / 1100);
        el.textContent = String(Math.round(n * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(f);
      };
      raf = requestAnimationFrame(f);
    };
    addEventListener("scroll", tarkista, { passive: true });
    return () => {
      removeEventListener("scroll", tarkista);
      cancelAnimationFrame(raf);
      el.textContent = String(n);
    };
  }, [n]);

  return <span ref={ref}>{n}</span>;
}
