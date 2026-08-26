"use client";

import { useEffect, useRef } from "react";

/**
 * Silmukoituva demovideo mockup-elementin sisalla (selainkehys, puhelin).
 *
 * preload="none" pitaa videon poissa ensilatauksesta; tiedosto haetaan vasta
 * kun elementti tulee nakyviin. Toisto on sidottu nakyvyyteen, joten ruudun
 * ulkopuolella ei kulu akkua eika GPU-aikaa.
 *
 * Lahteet ovat vain <source>-elementteina: jos <video>-elementilla on src,
 * selain jattaa source-lapset kokonaan huomiotta, jolloin webm-versio ei
 * koskaan valikoituisi.
 */

type Props = {
  /** Videoelementin luokka; koko ja rajaus tulevat siita. */
  className: string;
  /**
   * Polut public/-kansiossa. webm tarjotaan ensin ja mp4 varalle, mutta
   * webm on valinnainen: se kannattaa jattaa pois jos vp9 ei paase samaan
   * laatuun samalla tiedostokoolla kuin h264 (mitattu lahdekohtaisesti).
   */
  webm?: string;
  mp4: string;
  poster: string;
  /**
   * Videolla ei ole alt-attribuuttia (se on vain kuville), joten sisalto
   * kuvataan aria-labelilla.
   */
  label: string;
};

export default function DemoVideo({ className, webm, mp4, poster, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Silmukoituva video on koristetta, joten se jaa poster-kuvaan jos
    // kayttaja on pyytanyt vahemman liiketta.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() hylkaa lupauksen esim. jos selain keskeyttaa toiston.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
