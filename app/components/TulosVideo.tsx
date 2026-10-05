"use client";

import { useEffect, useRef } from "react";

/**
 * Tulokset-kortin puhelinvideo (5.10.2026): asiakkaan oma lyhytvideo
 * silmukkana. Ladataan vasta kun kortti lahestyy nakymaa (preload none
 * + IntersectionObserver) ja pysaytetaan kun se poistuu. Reduced
 * motion: pelkka pysakuva.
 */
export default function TulosVideo({ src, poster, kuvaus }: { src: string; poster: string; kuvaus: string }) {
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

  return (
    <video
      ref={ref}
      className="tul-video"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={kuvaus}
    />
  );
}
