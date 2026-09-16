import Ikoni from "./Ikoni";

/**
 * SAMA KYSELY, KAKSI MAARANPAATA.
 *
 * Tassa oli pinnattu kerrontarakenne: vasen kuvio pysyi paikallaan ja
 * vaihtui hakutuloslistasta tekoalyvastaukseksi sita mukaa kun oikea
 * palsta vieri ohi. Idea oli hyva mutta mekaniikka liian raskas
 * siihen mita se tuotti: IntersectionObserver, tilamuuttuja, kaksi
 * paallekkaista kuviota ja 22vh valia askelten valissa - kaikki sita
 * varten etta lukija nakee kaksi kuvaa yksi kerrallaan.
 *
 * Rinnakkain molemmat nakyvat yhdella silmayksella, ja vertailu on
 * juuri se mita osio tekee. Ei tilaa, ei efektia, ei pinnausta. Kuviot
 * ovat nyt myos isompia, koska niiden ei tarvitse mahtua samaan
 * laatikkoon.
 */
const OSIOT = [
  {
    kick: "Hakutulokset",
    h: "Orgaaninen näkyvyys Googlessa",
    p: "Klassinen hakukoneoptimointi: sijoitus hakutuloksissa ratkaisee, kenen sivulle asiakas klikkaa.",
  },
  {
    kick: "Tekoälyhaku",
    h: "Näkyvyys vastauksissa, ei vain listassa",
    p: "Tekoäly kokoaa vastauksen useasta lähteestä ja mainitsee ne. Kilpailu käydään siitä, kuka pääsee lähteeksi.",
  },
];

/** Hakutuloslistan rivit. Yksi on asiakkaan oma, loput kilpailijoita. */
const SERP: [string, string, boolean][] = [
  ["1", "yrityksesi.fi › palvelut › ilmalämpöpumput", true],
  ["2", "kilpailija.fi › ilmalampopumput", false],
  ["3", "verkkokauppa.example › lampopumput", false],
  ["4", "hakemisto.example › espoo › lvi", false],
];

/** Tekoalyvastauksen lahteet. Sama sivusto, eri rooli. */
const LAHTEET: [string, boolean][] = [
  ["yrityksesi.fi", true],
  ["energiavirasto.example", false],
  ["kilpailija.fi", false],
];

export default function Nakyvyys() {
  return (
    <section className="seo-sec lava" id="nakyvyys">
      {/* ELOKUVALLINEN TAUSTA, ARTEFAKTIT SEN PAALLA.
          Tama on Surferin rakenne: taysleveä maalauksellinen kuva ja
          sen paalla kelluva kayttoliittymapaneeli. Syy miksi se toimii
          on etta kuva antaa TUNNELMAN ja paneeli antaa TODISTEEN, ja
          kumpikaan ei yrita tehda molempia. Kun kaikki on litteita
          laatikoita vaalealla, kumpaakaan ei ole.

          Kuva on tehty tata sivua varten: syaanit korkeuskayrat
          sumussa, ja vasen puoli on tarkoituksella tyhjaa tummaa jotta
          otsikko saa oman tilansa. */}
      <div className="lava-tausta" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hakukoneoptimointi/haku.webp" alt="" data-par="0.028" />
      </div>
      <div className="swrap lava-sisalto">
        <div className="seo-ord" data-rvs="">
          <span>Näkyvyys 2026</span>
          <i>Sama kysely, kaksi määränpäätä</i>
        </div>

        <h2 className="seo-h2 rv">Asiakas ei enää kysy pelkältä Googlelta.</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Osa hauista päättyy yhä hakutuloslistaan, osa tekoälyn koostamaan valmiiseen vastaukseen.
          Sama työ ratkaisee molemmissa, mutta vain jos sisältö on rakennettu niin, että kone löytää
          siitä vastauksen.
        </p>

        <p className="kysely">
          <span aria-hidden="true">⌕</span> ilmalämpöpumppu asennus espoo
        </p>

        <div className="duo2">
          {OSIOT.map((o, idx) => (
            <article className="duo2-col rv" key={o.kick}>
              <p className="pin-kick">
                <Ikoni nimi={idx === 0 ? "haku" : "kone"} i={idx} />
                {o.kick}
              </p>

              {idx === 0 ? (
                <div className="fig serp">
                  {SERP.map(([n, url, oma]) => (
                    <div className={"serprow" + (oma ? " oma" : "")} key={n}>
                      <em>{n}</em>
                      <span>{url}</span>
                      {oma ? <b>Sinä</b> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="fig ai">
                  <p className="ai-txt">
                    Espoossa ilmalämpöpumpun asennus maksaa tyypillisesti{" "}
                    <mark>1 200–2 400 €</mark> laitteineen, ja asennus vie yhden työpäivän.
                  </p>
                  <p className="ai-lk">Lähteet</p>
                  <div className="ai-src">
                    {LAHTEET.map(([nimi, oma]) => (
                      <span className={oma ? "oma" : undefined} key={nimi}>
                        {nimi}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <h3>{o.h}</h3>
              <p className="seo-body">{o.p}</p>
            </article>
          ))}
        </div>

        <p className="seo-body pin-after">
          Käytännössä nämä eivät ole kaksi eri projektia.{" "}
          <strong>
            Selkeä sivurakenne, tekninen kunto, strukturoitu data ja sisältö joka vastaa kysymykseen
            suoraan
          </strong>{" "}
          parantavat molempia yhtä aikaa. Suurin ero on painotuksessa: hakutuloksissa tavoitellaan
          sijoitusta, tekoälyvastauksissa sitä, että sisältösi on niin selkeää ja tarkistettavaa,
          että kone uskaltaa nojata siihen.
        </p>
      </div>
    </section>
  );
}
