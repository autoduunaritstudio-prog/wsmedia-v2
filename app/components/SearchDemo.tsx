"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Heron hakunayttamo: haku kirjoittuu merkki kerrallaan, tulos nousee sijalta
 * 7 sijalle 1, ja tekoalyvastaus kirjoittuu peraan siteeraten samaa sivustoa.
 *
 * Tama on sivun ydinviestin visuaalinen todiste: sama tyo nakyy seka
 * hakutuloslistassa etta tekoalyn vastauksessa.
 *
 * Toteutus: yksi async-silmukka, joka ajaa kohtaukset perakkain. Kaikki
 * ajastimet ja silmukan lopetus kulkevat saman cancelled-lipun kautta, jotta
 * komponentin purku ei jata kayvia ajastimia eika paivita purettua tilaa.
 *
 * prefers-reduced-motion: ensimmainen kohtaus nayetaan valmiina, kursori pois.
 */

type Scene = { q: string; d: string; a: string };

const SCENES: Scene[] = [
  {
    q: "kattoremontti espoo",
    d: "Kattoremontit Espoossa — hinta, aikataulu ja maksuton kartoitus",
    a: "Espoossa kattoremontteja tekee useita yrityksiä. Hinta määräytyy katon koon ja materiaalin mukaan, ja kartoitus on tyypillisesti maksuton.",
  },
  {
    q: "tilitoimisto helsinki",
    d: "Tilitoimisto Helsingissä — kirjanpito, palkanlaskenta ja veroneuvonta",
    a: "Helsingin alueen tilitoimistot hoitavat kirjanpidon, palkanlaskennan ja veroneuvonnan. Hinnoittelu perustuu yleensä tositemäärään.",
  },
  {
    q: "sähköasentaja vantaa",
    d: "Sähköasentaja Vantaalla — asennukset, vikakorjaukset ja urakat",
    a: "Vantaalla toimivat sähköasentajat tekevät asennuksia, vikakorjauksia ja urakoita. Kannattaa varmistaa pätevyys ja pyytää kirjallinen tarjous.",
  },
];

const START_RANK = 7;

export default function SearchDemo() {
  const [query, setQuery] = useState("");
  const [desc, setDesc] = useState("");
  const [aiText, setAiText] = useState("");
  const [rank, setRank] = useState(START_RANK);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [aiVisible, setAiVisible] = useState(false);
  const [caret, setCaret] = useState(true);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const s = SCENES[0];
      setQuery(s.q);
      setDesc(s.d);
      setAiText(s.a);
      setRank(1);
      setResultsVisible(true);
      setAiVisible(true);
      setCaret(false);
      return;
    }

    const timers = new Set<ReturnType<typeof setTimeout>>();
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    const type = async (text: string, speed: number, set: (v: string) => void) => {
      for (let i = 0; i < text.length; i++) {
        if (cancelled.current) return;
        set(text.slice(0, i + 1));
        await sleep(speed);
      }
    };

    const run = async () => {
      let i = 0;
      while (!cancelled.current) {
        const s = SCENES[i];

        // nollaus
        setAiVisible(false);
        setAiText("");
        setDesc("");
        setRank(START_RANK);
        setResultsVisible(false);
        await sleep(450);
        if (cancelled.current) return;

        // haku kirjoittuu
        await type(s.q, 58, setQuery);
        await sleep(520);
        if (cancelled.current) return;

        // tulos ilmestyy ja nousee sijalle 1
        setResultsVisible(true);
        setDesc(s.d);
        for (let r = START_RANK; r >= 1; r--) {
          if (cancelled.current) return;
          setRank(r);
          await sleep(95);
        }
        await sleep(700);
        if (cancelled.current) return;

        // tekoaly vastaa ja siteeraa
        setAiVisible(true);
        await sleep(320);
        await type(s.a, 17, setAiText);
        await sleep(3600);

        i = (i + 1) % SCENES.length;
      }
    };

    run();

    return () => {
      cancelled.current = true;
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  return (
    <div
      className="sstage li d5"
      data-par="-0.03"
      aria-label="Havainnekuva hakutuloksesta ja tekoälyvastauksesta"
    >
      <div className="chip-f cf1">
        <em>▲</em>
        <span>
          Orgaaninen<small>ei lopu kun budjetti loppuu</small>
        </span>
      </div>
      <div className="chip-f cf2">
        <em>✦</em>
        <span>
          Tekoälyhaku<small>lähteenä mainittu</small>
        </span>
      </div>

      <div className="sbar">
        <span className="ico" aria-hidden="true" />
        <span className="q" id="sq">
          {query}
        </span>
        {caret && <span className="caret" id="scaret" aria-hidden="true" />}
      </div>

      <div
        className="sres"
        id="sres"
        aria-hidden="true"
        style={{ opacity: resultsVisible ? 1 : 0.45 }}
      >
        <div className="srow" data-slot="1">
          <span className="rk">1</span>
          <span className="ln">
            <s />
            <s />
          </span>
        </div>
        <div className="srow" data-slot="2">
          <span className="rk">2</span>
          <span className="ln">
            <s />
            <s />
          </span>
        </div>
        <div className="srow us" data-slot="3">
          <span className="rk" id="srank">
            {rank}
          </span>
          <span className="ln">
            <b>yrityksesi.fi</b>
            <i id="sdesc">{desc || "Palvelu paikkakunnalla — hinnat, aikataulu ja yhteydenotto"}</i>
          </span>
        </div>
      </div>

      <div className={`aians${aiVisible ? " on" : ""}`} id="aians" aria-hidden="true">
        <p className="ah">
          <em>✦</em>Tekoälyn vastaus
        </p>
        <p id="aitext">{aiText}</p>
        <div className="src">
          <small>Lähteet:</small>
          <span>toimiala-lehti.fi</span>
          <span className="us">yrityksesi.fi</span>
          <span>hakemisto.fi</span>
        </div>
      </div>
    </div>
  );
}
