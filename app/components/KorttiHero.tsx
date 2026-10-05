"use client";

import { useEffect, useRef } from "react";

/**
 * PALVELUSIVUN HERO KORTISSA (5.10.2026).
 *
 * Etusivun palvelukortin kuva-alueella pyorii lyhyt silmukka kyseisen
 * palvelusivun herosta: sama tausta, otsikko ja animaatio, jolloin lukija
 * nakee etukateen millaiselle sivulle kortti vie. Silmukat on kaapattu
 * tuotantobuildista kehys kerrallaan (tools/herovideo2.js) ja pakattu
 * sivuston reseptilla (h264, crf 32, ei aanta, faststart).
 *
 * Video ladataan vasta kun kortti lahestyy nakymaa (preload none ->
 * play IntersectionObserverilla) ja pysahtyy kun se poistuu. Reduced
 * motion: pelkka pysakuva.
 */
export default function KorttiHero({
  nimi,
  kuvaus,
  pysakuva = false,
}: {
  nimi: "video" | "site" | "seo" | "design";
  kuvaus: string;
  /** Vain kuva ilman videota: verkkosivujen kortissa skrubbauselokuvan loppukuva. */
  pysakuva?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (pysakuva) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="kortti-hero" src={`/kortti-hero-${nimi}.webp`} alt={kuvaus} width={960} height={555} loading="lazy" decoding="async" />
    );
  }

  return (
    <video
      ref={ref}
      className="kortti-hero"
      src={`/kortti-hero-${nimi}.mp4`}
      poster={`/kortti-hero-${nimi}.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={kuvaus}
    />
  );
}
