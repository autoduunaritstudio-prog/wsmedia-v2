import type { ReactNode } from "react";

/* ==================================================================
   ARTEFAKTIT
   ==================================================================
   MIKA MUUTTUI AJATTELUSSA. Kaytin ensin valokuvia vertauskuvina
   (juoksurata = sijoitus) ja sitten datagrafiikkaa (kayra = sijoitus).
   Molemmat ovat KUVIA ASIASTA. Kolmas vaihtoehto on nayttaa ITSE ASIA:
   se tiedosto, se merkinta, se hakutulos jota tyo oikeasti koskee.

   Talle talolle se on myos oikea viesti. Yritys joka koodaa sivustoja
   voi nayttaa koodia, ja koodi on samalla se osa tyota jota asiakas ei
   koskaan nae. Sen nayttaminen on avaamista, ei koristetta.

   Jokainen artefakti liittyy suoraan sen osion otsikkoon jonka alla se
   on, eika toimi ilman sita. Se on ehto: jos kuvan voisi siirtaa
   toiseen osioon, se on koriste.
   ================================================================== */

/* ---------- KOODI-IKKUNA ----------
   Varitys on tehty kasin pienella merkkauksella eika kirjastolla:
   nayte on kymmenen riviä, ja syntaksivarittaja olisi ollut 40 kt
   riippuvuus kymmenen rivin takia. Varit tulevat sivun paletista, ei
   editoriteemasta - tama on sivuston koodinayte, ei kuvakaappaus
   VS Codesta. */
type Rivi = { t: string; v?: "avain" | "arvo" | "kommentti" | "merkki" };

export function Koodi({
  tiedosto,
  rivit,
  selite,
}: {
  tiedosto: string;
  rivit: Rivi[];
  selite?: string;
}) {
  return (
    <figure className="art art-koodi">
      <div className="art-palkki">
        <span className="art-pisteet" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <code>{tiedosto}</code>
      </div>
      <pre>
        <code>
          {rivit.map((r, i) => (
            <span className="art-rivi" key={i}>
              <em aria-hidden="true">{String(i + 1).padStart(2, "0")}</em>
              <span className={r.v ? "k-" + r.v : undefined}>{r.t || " "}</span>
            </span>
          ))}
        </code>
      </pre>
      {selite ? <figcaption>{selite}</figcaption> : null}
    </figure>
  );
}

/* ---------- HAKUTULOKSEN ESIKATSELU ----------
   Tasan se mita Google nayttaa: murupolku, title ja kuvaus. Tama on
   se yksi asia jonka asiakas oikeasti nakee hakutuloksessa, ja se on
   myos sisaltotyon konkreettisin tuotos. Merkkimaarat mukana, koska
   juuri ne ratkaisevat katkeaako teksti. */
export function Hakutulos({
  polku,
  otsikko,
  kuvaus,
}: {
  polku: string;
  otsikko: string;
  kuvaus: string;
}) {
  return (
    <figure className="art art-serp">
      <div className="serp-polku">{polku}</div>
      <p className="serp-otsikko">{otsikko}</p>
      <p className="serp-kuvaus">{kuvaus}</p>
      <figcaption>
        <span>
          Title <b>{otsikko.length}</b> / 60 merkkiä
        </span>
        <span>
          Kuvaus <b>{kuvaus.length}</b> / 155 merkkiä
        </span>
      </figcaption>
    </figure>
  );
}

/* ---------- LINKKIPROFIILI ----------
   Viittaavat verkkotunnukset ja niiden arvo. Tama on auktoriteettityon
   ainoa nakyva tuotos: lista sivustoja jotka viittaavat sinuun. */
const LINKIT: [string, number, string][] = [
  ["rakennuslehti.example", 74, "Artikkeli"],
  ["kauppakamari.example", 68, "Jäsenhakemisto"],
  ["espoo.example", 61, "Yrityslistaus"],
  ["toimialaliitto.example", 57, "Jäsensivu"],
  ["paikallislehti.example", 44, "Haastattelu"],
];

export function Linkkiprofiili() {
  return (
    <figure className="art art-linkit">
      <div className="art-palkki">
        <code>viittaavat verkkotunnukset</code>
        <b>+12 / 6 kk</b>
      </div>
      <ul>
        {LINKIT.map(([nimi, dr, tyyppi]) => (
          <li key={nimi}>
            <span className="l-dr" data-arvo={dr >= 65 ? "korkea" : dr >= 50 ? "keski" : "matala"}>
              {dr}
            </span>
            <span className="l-nimi">{nimi}</span>
            <s>{tyyppi}</s>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* ---------- ISO HILJAINEN VAITE ----------
   Lukija tarvitsee levahdyspaikan. Osio jossa on yksi lause ja ei
   mitaan muuta antaa silmalle sen: se ei vaadi lukemista, se vain
   sanoo yhden asian ja paastaa jatkamaan. Tumma pohja tekee siita
   samalla rytmikatkon vaaleiden osioiden valiin. */
export function Vaite({
  children,
  alla,
  kuva,
  kuvaAlt,
}: {
  children: ReactNode;
  alla?: string;
  /* Valokuva lauseen takana. Lause tyhjalla pohjalla on vaite, lause
     kuvan paalla on hetki. Kaikki vaiteet eivat saa kuvaa: jos ne
     saisivat, keino kuluisi loppuun kolmannella kerralla. */
  kuva?: string;
  kuvaAlt?: string;
}) {
  return (
    <section className={kuva ? "vaite kuvallinen" : "vaite"} data-rvs="">
      {kuva ? <img src={kuva} alt={kuvaAlt ?? ""} aria-hidden={!kuvaAlt} data-par="0.028" /> : null}
      <div className="swrap">
        <p className="vaite-teksti">{children}</p>
        {alla ? <p className="vaite-alla">{alla}</p> : null}
      </div>
    </section>
  );
}
