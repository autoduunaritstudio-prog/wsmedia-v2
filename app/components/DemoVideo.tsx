"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Silmukoituva demovideo mockup-elementin sisalla (selainkehys, puhelin).
 *
 * preload pitaa videon poissa ensilatauksesta; tiedosto haetaan vasta kun
 * elementti tulee nakyviin. Toisto on sidottu nakyvyyteen, joten ruudun
 * ulkopuolella ei kulu akkua eika GPU-aikaa.
 *
 * Musta valahdys ja sen korjaus: selain saa hylata poster-attribuutin kuvan
 * heti kun latautuminen alkaa, mutta ensimmainen dekoodattu ruutu on valmis
 * vasta myohemmin - valiin jaa tyhja musta hetki. Siksi poster piirretaan
 * lisaksi omana kerroksenaan videon paalle, ja se haivytetaan vasta
 * 'playing'-tapahtumassa. 'play' ei kelpaa: se laukeaa jo kun toisto on
 * pyydetty, ei kun kuvaa on nakyvissa.
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
   * "metadata" hakee otsikkotiedot ja ensimmaisen ruudun verran dataa
   * etukateen, mika lyhentaa mustan valin ilman etta koko tiedosto
   * ladataan. "none" on oletus niille videoille joissa viivetta ei nay.
   */
  preload?: "none" | "metadata";
  /**
   * Videolla ei ole alt-attribuuttia (se on vain kuville), joten sisalto
   * kuvataan aria-labelilla.
   */
  label: string;
};

export default function DemoVideo({
  className,
  webm,
  mp4,
  poster,
  label,
  preload = "none",
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onPlaying = () => setPlaying(true);
    el.addEventListener("playing", onPlaying);

    // Silmukoituva video on koristetta, joten se jaa poster-kuvaan jos
    // kayttaja on pyytanyt vahemman liiketta. Kuuntelija puretaan silti,
    // ja poster jaa nakyviin - mika on juuri haluttu lopputulos.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => el.removeEventListener("playing", onPlaying);
    }

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

    return () => {
      el.removeEventListener("playing", onPlaying);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <video
        ref={ref}
        className={className}
        muted
        loop
        playsInline
        preload={preload}
        poster={poster}
        aria-label={label}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={mp4} type="video/mp4" />
      </video>
      {/* Tyhja alt ja aria-hidden: kuva on sama sisalto jonka videon
          aria-label jo kuvaa, joten oma vaihtoehtoinen teksti lukisi sen
          ruudunlukijalle kahteen kertaan. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`demo-poster${playing ? " is-hidden" : ""}`}
        src={poster}
        alt=""
        aria-hidden="true"
      />
    </>
  );
}
