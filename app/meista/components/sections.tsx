import type { CSSProperties } from "react";

import BudgetForm from "../../components/BudgetForm";
import { Kaiku } from "../../components/Maasto";

/* ==================================================================
   MEISTA-SIVUN OSIOT
   Rakenne ja kuvakieli kuten palvelusivuilla (.wsx): seo-sec, swrap,
   kaiku, vaite, sama tarjousosio. Sivun omat osat ovat .mt-*-luokkia,
   tyylit app/globals.css:ssa (MEISTA-SIVU).
   ================================================================== */

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ---------- Hero ---------- */
const PALVELUT: [string, string][] = [
  ["/lyhytvideot", "Lyhytvideot"],
  ["/verkkosivut", "Verkkosivut"],
  ["/hakukoneoptimointi", "Hakukoneoptimointi"],
  ["/graafinen-suunnittelu", "Graafinen suunnittelu"],
];

export function Hero() {
  return (
    <header className="seo-hero mt-hero">
      <div className="hero-tausta" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kuvat/fx9-hero.webp"
          alt=""
          data-par="0.075"
          data-parx="0.018"
        />
      </div>
      {/* Kameran etsimen kulmamerkit rajaavat kuva-alan. */}
      <div className="mt-etsin" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="swrap hero-sisalto mt-hero-in">
        <p className="mt-rec">
          <b>REC</b>
          <span>Meistä</span>
        </p>
        {/* Otsikossa ja ingressissa ei sisaantuloanimaatiota: suurin
            teksti piirtyy heti (LCP), ks. CLAUDE.md "Animaatio ja LCP". */}
        <h1 className="seo-h1">
          Espoolainen mainostoimisto, joka kuvaa, rakentaa ja{" "}
          <span className="accent">hoitaa näkyvyyden.</span>
        </h1>
        <div className="mt-hero-ala">
          <p className="hero-lead">
            Lyhytvideot, verkkosivut, hakukoneoptimointi ja graafinen suunnittelu samasta tiimistä.
            Palvelemme yrityksiä Espoossa, muualla pääkaupunkiseudulla ja koko Suomessa.
          </p>
          <div className="heroctas">
            <a className="btn mag" href="#tarjous">
              Pyydä maksuton kartoitus
            </a>
          </div>
          <ul className="mt-hero-pal" aria-label="Palvelumme">
            {PALVELUT.map(([href, nimi]) => (
              <li key={href}>
                <a href={href}>{nimi}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

/* ---------- Miksi yksi tiimi ---------- */
const KETJU: [string, string, string, string][] = [
  [
    "/kuvat/halli-kortti.webp",
    "Video herättää kiinnostuksen",
    "Lyhytvideo tavoittaa ihmiset, jotka eivät vielä tiedä etsivänsä sinua.",
    "/lyhytvideot",
  ],
  [
    "/verkkosivut/kartoitus-valmis.webp",
    "Verkkosivu ottaa kävijän vastaan",
    "Sivu kertoo nopeasti, mitä palvelu maksaa ja miten edetään, ja ohjaa yhteydenottoon.",
    "/verkkosivut",
  ],
  [
    "/hakukoneoptimointi/poyta.webp",
    "Näkyvyys tuo oikeat ihmiset",
    "Hakukoneoptimointi ja Meta-mainonta tuovat paikalle ne, jotka ovat jo ostamassa.",
    "/hakukoneoptimointi",
  ],
];

export function Miksi() {
  return (
    <section className="seo-sec" id="miksi">
      <Kaiku sana="YHDESSÄ" puoli="vas" />
      <div className="swrap">
        <h2 className="seo-h2 rv">Miksi kaikki samasta paikasta?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Moni yritys ostaa videot yhdeltä, verkkosivut toiselta ja mainonnan
          kolmannelta. Silloin kukaan ei vastaa siitä, toimiiko kokonaisuus.
          Meillä samat ihmiset suunnittelevat videon, rakentavat sivun ja
          seuraavat, tuleeko yhteydenottoja.
        </p>
        <ol className="mt-flow porras rv" data-rvs="">
          {KETJU.map(([kuva, h, p, href], n) => (
            <li className="mt-fc" key={h} style={i(n)}>
              <div className="mt-fi">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={kuva} alt="" loading="lazy" decoding="async" />
                <span className="mt-n" aria-hidden="true">
                  {n + 1}
                </span>
              </div>
              {/* Koko kortti linkkina: otsikon linkki venytetaan kortin
                  kokoiseksi (::after), joten linkkiteksti on otsikko. */}
              <h3>
                <a href={href}>{h}</a>
              </h3>
              <p>{p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Tiimi ---------- */
const TIIMI: { nimi: string; rooli: string; tyot: string[]; huom: string }[] = [
  {
    nimi: "Tuomas Ivanov",
    rooli: "Perustaja",
    tyot: ["Verkkosivut", "Hakukoneoptimointi", "Analytiikka"],
    huom: "Yrittäjänä yli 11 vuotta.",
  },
  {
    nimi: "Alex",
    rooli: "Toimitusjohtaja ja tuottaja",
    tyot: ["Lyhytvideotuotanto", "Kuvaukset", "Meta-mainonta"],
    huom: "Tietää, mikä toimii kameran edessä.",
  },
  {
    nimi: "Ville Karppinen",
    rooli: "Asiakasvastaava ja osakas",
    tyot: ["Graafinen suunnittelu", "Asiakkaan yhteyshenkilö", "Tarjoukset ja sopimukset"],
    huom: "Pitää huolen, että sovittu toteutuu.",
  },
];

export function Tiimi() {
  return (
    <section className="seo-sec" id="tiimi">
      <Kaiku sana="TIIMI" puoli="oik" />
      <div className="swrap">
        <h2 className="seo-h2 rv">Kolme tekijää, jotka vastaavat työstä</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Pieni tiimi tarkoittaa, ettei asiasi katoa välikäsien väliin. Puhut
          suoraan niiden kanssa, jotka tekevät työn.
        </p>
        <div className="mt-sg rv">
          {TIIMI.map((t, n) => (
            <article className="mt-sl" key={t.nimi} style={i(n)}>
              <div className="mt-arm" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="mt-sb">
                <div className="mt-sh" aria-hidden="true">
                  <span>WS Media</span>
                  <span>Otto {n + 1}</span>
                </div>
                <h3>{t.nimi}</h3>
                <p className="mt-role">{t.rooli}</p>
                <ul>
                  {t.tyot.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p className="mt-note">{t.huom}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Tyotapa ---------- */
export function Tapa() {
  return (
    <section className="seo-sec" id="tapa">
      <Kaiku sana="TAPA" puoli="vas" />
      <div className="swrap">
        <h2 className="seo-h2 rv">Näin työskentelemme</h2>
        <div className="mt-tg porras rv">
          <div className="mt-t big">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kuvat/autossa-kortti.webp"
              alt="WS Media kuvaa lyhytvideota auton sisällä"
              loading="lazy"
              decoding="async"
            />
            <div>
              <h3>Kerromme, jos et tarvitse meitä</h3>
              <p>
                Jos video, uudet sivut tai hakukoneoptimointi eivät ratkaise
                tilannettasi, sanomme sen kartoituksessa ja ohjaamme oikeaan
                suuntaan.
              </p>
            </div>
          </div>
          <div className="mt-t">
            <h3>Yksi yhteyshenkilö</h3>
            <p>Asiasi etenee yhden ihmisen kautta alusta loppuun.</p>
          </div>
          <div className="mt-t">
            <h3>Suora puhe</h3>
            <p>Hinnat ja ehdot kerrotaan etukäteen. Ei piilokuluja.</p>
          </div>
          <div className="mt-t wide">
            <h3>Kartoitus ei sido mihinkään</h3>
            <p>
              Käymme läpi nykytilan, kilpailijat ja mahdollisuudet. Vastaamme
              viestiin 24 tunnin sisällä.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- WS Media lyhyesti ----------
   Juokseva teksti hakukoneelle ja lukijalle: kuka, mita, missa. Linkit
   palvelusivuille ovat sisaista linkitysta itse tekstissa. */
export function Lyhyesti() {
  return (
    <section className="seo-sec" id="lyhyesti">
      <div className="swrap">
        <h2 className="seo-h2 rv">WS Media lyhyesti</h2>
        <div className="seoprose mt-proosa rv">
          <p>
            WS Media Oy on espoolainen mainostoimisto. Teemme yrityksille{" "}
            <a href="/lyhytvideot">lyhytvideoita</a> TikTokiin, Instagramiin ja YouTubeen,{" "}
            <a href="/verkkosivut">verkkosivuja</a>,{" "}
            <a href="/hakukoneoptimointi">hakukoneoptimointia</a> ja{" "}
            <a href="/graafinen-suunnittelu">graafista suunnittelua</a> sekä hoidamme Meta-mainontaa.
            Toimisto on Espoon Kuusiniemessä, ja asiakkaitamme on pääkaupunkiseudulla ja muualla
            Suomessa.
          </p>
          <p>
            Tiimissä on kolme tekijää. Ville Karppinen vastaa graafisesta suunnittelusta ja
            asiakkuuksista, Tuomas Ivanov verkkosivuista ja hakukoneoptimoinnista ja Alex
            videotuotannosta ja Meta-mainonnasta. Kuvaamme yrityksesi tiloissa tai sovitussa
            paikassa, ja valmiit videot ja sivut toimitetaan sähköisesti.
          </p>
          <p>
            Asiakkaitamme ovat esimerkiksi Colormaster, YDR Autohuolto, White Star, VauhtiVeikot ja
            Laaksolahden Sähkö. Olemme avoinna arkisin 9–18 ja lauantaisin 11–16, ja kaikki
            yhteystavat löydät <a href="/yhteystiedot">yhteystiedoista</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Tarjous: sama kokonaisuus kuin palvelusivuilla ---------- */
export function Tarjous() {
  return (
    <section className="seo-sec kuvapohja" id="tarjous">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="pohjakuva"
        src="/verkkosivut/kartoitus.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        data-par="0.028"
      />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">
          Vastaus 24 tunnissa
        </p>
        <div className="loc">
          <div>
            <h2 className="seo-h2 rv">
              Kerro, <span className="korosta">mitä haluat saada aikaan.</span>
            </h2>
            <p className="seo-lead rv" style={{ marginTop: "26px" }}>
              Käymme tilanteesi läpi ja kerromme suoraan, miten voimme auttaa,
              myös silloin kun vastaus on ei. Voit myös soittaa numeroon{" "}
              <a href="tel:+358405648770">040 564 8770</a> tai kirjoittaa
              osoitteeseen <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>.
            </p>
            <ol className="askel porras rv">
              <li>
                <b>24 h</b>
                <span>Luemme viestin ja vastaamme sähköpostilla.</span>
              </li>
              <li>
                <b>30 min</b>
                <span>Kartoitus: nykytila, tavoite ja mikä palvelu sopii.</span>
              </li>
              <li>
                <b>Tarjous</b>
                <span>
                  Kirjallinen ehdotus hintoineen. Ei sitoumuksia ennen
                  hyväksyntää.
                </span>
              </li>
            </ol>
          </div>

          <BudgetForm
            showBudget={false}
            messageLabel="Mitä haluaisit saada aikaan?"
            note="Ei sitoumuksia."
            tilt="y"
          />
        </div>
      </div>
    </section>
  );
}
