"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tulokset-kortin puhelinvideo (5.10.2026): asiakkaan oma lyhytvideo
 * silmukkana. Ladataan vasta kun kortti lahestyy nakymaa (preload none
 * + IntersectionObserver) ja pysaytetaan kun se poistuu. Reduced
 * motion: pelkka pysakuva.
 *
 * EI MUSTAA VALAHDYSTA ASIAKASTA VAIHDETTAESSA (7.10.2026). Vaihdossa
 * lava rakennetaan uudelleen ja puhelimeen tulee uusi <video>. Ennen
 * pysakuva oli videon poster-attribuutti: ennen kuin se oli ladattu,
 * ja uudelleen toiston alkaessa ennen ensimmaista piirrettya ruutua,
 * nakyi videon tumma tausta. Nyt pysakuva on oma kuvansa videon alla,
 * ja video tulee nakyviin vasta kun se on ESITTANYT ruudun
 * (requestVideoFrameCallback; varapolkuna 'playing'). TulosNayttamo
 * esilataa kaikkien asiakkaiden pysakuvat, joten vaihdossa kuva on
 * valmiina.
 */
export default function TulosVideo({ src, poster, kuvaus }: { src: string; poster: string; kuvaus: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [nakyy, setNakyy] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let odotus = 0;
    const naytaKunPiirretty = () => {
      if (typeof v.requestVideoFrameCallback !== "function") {
        setNakyy(true);
        return;
      }
      if (odotus) return;
      odotus = v.requestVideoFrameCallback(() => {
        odotus = 0;
        setNakyy(true);
      });
    };
    v.addEventListener("playing", naytaKunPiirretty);
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("playing", naytaKunPiirretty);
      if (odotus) v.cancelVideoFrameCallback?.(odotus);
    };
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tul-video tul-kansi" src={poster} alt="" aria-hidden="true" decoding="async" />
      <video
        ref={ref}
        className="tul-video tul-liike"
        data-nakyy={nakyy ? "" : undefined}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-label={kuvaus}
      />
    </>
  );
}
