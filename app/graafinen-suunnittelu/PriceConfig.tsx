"use client";

import { useState } from "react";

import g from "./gs.module.css";

/**
 * HINTALASKURI, TOINEN VERSIO.
 *
 * Ensimmainen versio oli kymmenen samannakoista valintaruutua ja summa
 * niiden alla: idea oli oikea, toteutus luki lomakkeena. Nyt kohteet on
 * ryhmitelty sen mukaan mihin ilme menee (ilme, painotuotteet, ajoneuvo,
 * toimitila), jokainen kohde nayttaa oman lahtohintansa, ja oikealla on
 * koko ajan nakyva yhteenveto valituista.
 *
 * Ajoneuvo on oma valintansa: teippauksen laajuus (logo, osa, koko auto)
 * ja autojen maara. Suunnittelu tehdaan kerran, joten toisesta autosta
 * eteenpain hinta on 75 % ensimmaisen hinnasta. Sama asia lukee sivun
 * teksteissa ("seuraavista autoista maksat vain tulostuksen ja
 * asennuksen").
 *
 * Luvut ovat samat kuin aiemmassa versiossa ja sivun muissa hinnoissa.
 */

type Kohde = { id: string; nimi: string; kuvaus: string; min: number; max: number };

const RYHMAT: { otsikko: string; kohteet: Kohde[] }[] = [
  {
    otsikko: "Ilme",
    kohteet: [
      { id: "logo", nimi: "Logo ja tunnus", kuvaus: "Logopaketti kaikissa tiedostomuodoissa", min: 490, max: 1200 },
      { id: "ohje", nimi: "Värit, fontit ja graafinen ohjeisto", kuvaus: "Ilmeen pelisäännöt yhteen PDF-tiedostoon", min: 1000, max: 2000 },
    ],
  },
  {
    otsikko: "Painotuotteet",
    kohteet: [
      { id: "kortit", nimi: "Käyntikortit", kuvaus: "Suunnittelu ja painatus", min: 190, max: 490 },
      { id: "esite", nimi: "Flyer tai esite", kuvaus: "Yksi- tai monisivuinen", min: 280, max: 1200 },
      { id: "rollup", nimi: "Roll-up", kuvaus: "Suunnittelu, tulostus ja teline", min: 290, max: 690 },
    ],
  },
  {
    otsikko: "Toimitila",
    kohteet: [
      { id: "ikkuna", nimi: "Ikkuna- tai julkisivuteippaus", kuvaus: "Laajuuden mukaan, asennettuna", min: 290, max: 2500 },
      { id: "valo", nimi: "Valomainos tai kyltti", kuvaus: "Valokirjaimet, kotelo tai opaste", min: 800, max: 5000 },
    ],
  },
];

const AUTO = [
  { id: "ei", nimi: "Ei autoa", min: 0, max: 0 },
  { id: "logo", nimi: "Logot ja yhteystiedot", min: 490, max: 900 },
  { id: "osa", nimi: "Kyljet ja takaosa", min: 990, max: 2200 },
  { id: "koko", nimi: "Koko auto", min: 2400, max: 4500 },
];
/* Toisesta autosta eteenpain: suunnittelu on jo tehty. */
const LISA = 0.75;

const fmt = (n: number) => (Math.round(n / 10) * 10).toLocaleString("fi-FI");

export default function PriceConfig() {
  const [valitut, setValitut] = useState<Set<string>>(() => new Set(["logo", "ohje"]));
  const [auto, setAuto] = useState("ei");
  const [autoja, setAutoja] = useState(1);

  const vaihda = (id: string) =>
    setValitut((v) => {
      const n = new Set(v);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const kaikki = RYHMAT.flatMap((r) => r.kohteet);
  const rivit = kaikki.filter((k) => valitut.has(k.id)).map((k) => ({ nimi: k.nimi, min: k.min, max: k.max }));
  const a = AUTO.find((x) => x.id === auto)!;
  if (a.id !== "ei") {
    const k = 1 + LISA * (autoja - 1);
    rivit.push({
      nimi: autoja > 1 ? `Auton teippaus, ${autoja} autoa` : "Auton teippaus",
      min: a.min * k,
      max: a.max * k,
    });
  }
  const lo = rivit.reduce((t, r) => t + r.min, 0);
  const hi = rivit.reduce((t, r) => t + r.max, 0);

  return (
    <div className={`${g.laskuri} rv`} id="conf">
      <div className={g.valinnat}>
        {RYHMAT.slice(0, 2).map((r) => (
          <fieldset className={g.ryhma} key={r.otsikko}>
            <legend>{r.otsikko}</legend>
            <div className={g.laatat}>
              {r.kohteet.map((k) => (
                <button
                  type="button"
                  key={k.id}
                  className={g.laatta}
                  aria-pressed={valitut.has(k.id)}
                  onClick={() => vaihda(k.id)}
                >
                  <b>{k.nimi}</b>
                  <span>{k.kuvaus}</span>
                  <em>alk. {k.min.toLocaleString("fi-FI")} €</em>
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <fieldset className={g.ryhma}>
          <legend>Ajoneuvo</legend>
          <div className={g.autot} role="radiogroup" aria-label="Teippauksen laajuus">
            {AUTO.map((x) => (
              <button
                type="button"
                role="radio"
                key={x.id}
                aria-checked={auto === x.id}
                className={g.autoValinta}
                onClick={() => setAuto(x.id)}
              >
                <b>{x.nimi}</b>
                {x.min ? <em>alk. {x.min.toLocaleString("fi-FI")} €</em> : null}
              </button>
            ))}
          </div>
          <div className={g.maara} aria-disabled={auto === "ei"}>
            <span>Autoja</span>
            <button
              type="button"
              aria-label="Yksi auto vähemmän"
              disabled={auto === "ei" || autoja <= 1}
              onClick={() => setAutoja((n) => Math.max(1, n - 1))}
            >
              −
            </button>
            <output aria-live="polite">{autoja}</output>
            <button
              type="button"
              aria-label="Yksi auto lisää"
              disabled={auto === "ei" || autoja >= 20}
              onClick={() => setAutoja((n) => Math.min(20, n + 1))}
            >
              +
            </button>
            <small>Toisesta autosta alkaen 25 % edullisempi, koska suunnittelu on jo tehty.</small>
          </div>
        </fieldset>

        {RYHMAT.slice(2).map((r) => (
          <fieldset className={g.ryhma} key={r.otsikko}>
            <legend>{r.otsikko}</legend>
            <div className={g.laatat}>
              {r.kohteet.map((k) => (
                <button
                  type="button"
                  key={k.id}
                  className={g.laatta}
                  aria-pressed={valitut.has(k.id)}
                  onClick={() => vaihda(k.id)}
                >
                  <b>{k.nimi}</b>
                  <span>{k.kuvaus}</span>
                  <em>alk. {k.min.toLocaleString("fi-FI")} €</em>
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <aside className={g.yhteenveto} aria-label="Hinta-arvio">
        <p className={g.yvOtsikko}>Arviosi</p>
        {rivit.length ? (
          <ul className={g.yvRivit}>
            {rivit.map((r) => (
              <li key={r.nimi}>
                <span>{r.nimi}</span>
                <span>
                  {fmt(r.min)}–{fmt(r.max)} €
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={g.yvTyhja}>Valitse vasemmalta mitä tarvitset, niin näet hinnan tässä.</p>
        )}
        <p className={g.yvSumma} aria-live="polite">
          {rivit.length ? (
            <>
              {fmt(lo)}
              <span>–</span>
              {fmt(hi)} <small>€</small>
            </>
          ) : (
            "0 €"
          )}
        </p>
        <p className={g.yvAlv}>Hintaan lisätään arvonlisävero 25,5 %. Sisältää suunnittelun, materiaalit ja asennuksen.</p>
        {/* Avaa Ota yhteytta -ikkunan, johon valinnat ja arvio tulevat
            valmiiksi (Kehotukset.tsx lukee data-paketin). */}
        <button
          type="button"
          className={`btn ${g.yvNappi}`}
          data-yhteys=""
          data-paketti-otsikko="Hinta-arvio"
          data-paketti={rivit.length ? `${rivit.map((r) => r.nimi).join(", ")} (${fmt(lo)}–${fmt(hi)} € + alv)` : ""}
        >
          Pyydä tarkka tarjous
        </button>
      </aside>
    </div>
  );
}
