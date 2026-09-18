"use client";

import { useEffect, useState } from "react";

type Props = {
  words: string[];
  /**
   * Kun tosi, palvelin renderoi vain ensimmaisen lauseen ja loput lisataan
   * vasta selaimessa. Alasivun mockup tekee nain tarkoituksella: H1 pysyy
   * hakukoneelle yhtena lauseena. Etusivulla kaikki lauseet ovat HTML:ssa.
   */
  deferToClient?: boolean;
};

export default function WordSwap({ words, deferToClient = false }: Props) {
  const [ready, setReady] = useState(!deferToClient);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setReady(true);

    let clear: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      setActive((cur) => {
        setLeaving(cur);
        clear = setTimeout(() => setLeaving(null), 600);
        return (cur + 1) % words.length;
      });
    }, 2900);

    return () => {
      clearInterval(id);
      if (clear) clearTimeout(clear);
    };
  }, [words.length]);

  const visible = ready ? words : words.slice(0, 1);

  return (
    <span className="swapclip">
      <span className="swap" id="swap">
        {/* NAKYMATTOMAT VAIHTOEHDOT PIILOON RUUDUNLUKIJALTA.
            Kaikki neljä vaihtoehtoa ovat samassa ruudukkoruudussa,
            jotta laatikko ei hypi vaihdon aikana. Ilman aria-hiddenia
            ruudunlukija lukee h1:n muodossa "Lyhytvideot yrityksille,
            jotka algoritmi nostaa pysayttavat skrollauksen tuovat
            yhteydenottoja katsotaan loppuun", eli sivun tarkein rivi
            on nelja lausetta perakkain.

            HUOM: tama EI muuta textContentia eika siis sita mita
            tekstia poimiva lukija nakee. Siihen aria-hidden ei pysty.
            Palvelimen HTML sisaltaa vain ensimmaisen vaihtoehdon
            (deferToClient), ja loput kolme ovat selaimessa
            opacity: 0, joten renderoiva indeksoija kasittelee ne
            piilotettuna tekstina kuten minka tahansa vaihtajan.

            Lahtevaa ei piiloteta kesken haivytyksen: se on viela
            nakyvissa. */}
        {visible.map((w, i) => (
          <span
            key={w}
            className={i === active ? "act" : i === leaving ? "out" : ""}
            aria-hidden={i === active || i === leaving ? undefined : true}
          >
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
