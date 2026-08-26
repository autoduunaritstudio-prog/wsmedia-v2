"use client";

import { useEffect, useRef } from "react";

/**
 * Laaksolahden Sähkön sivuston kuvakaappausvideo Verkkosivut-paneelissa.
 *
 * preload="none" pitää videon poissa ensilatauksesta; tiedosto haetaan vasta
 * kun paneeli tulee näkyviin. Toisto on sidottu näkyvyyteen, joten ruudun
 * ulkopuolella ei kulu akkua eikä GPU-aikaa.
 *
 * Lähteet ovat vain <source>-elementteinä: jos <video>-elementillä on src,
 * selain jättää source-lapset kokonaan huomiotta, jolloin webm-versio ei
 * koskaan valikoituisi.
 */
export default function WebsiteDemoVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Silmukoituva video on koristetta, joten se jää poster-kuvaan jos
    // käyttäjä on pyytänyt vähemmän liikettä.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() hylkää lupauksen esim. jos selain keskeyttää toiston.
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
      className="demo-video"
      muted
      loop
      playsInline
      preload="none"
      poster="/laaksolahti-poster.jpg"
      aria-label="Kuvakaappaus Laaksolahden Sähkön uudesta verkkosivustosta, jonka WS Media on toteuttanut"
    >
      <source src="/laaksolahti-demo.webm" type="video/webm" />
      <source src="/laaksolahti-demo.mp4" type="video/mp4" />
    </video>
  );
}
