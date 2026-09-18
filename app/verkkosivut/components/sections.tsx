import type { CSSProperties } from "react";
import BudgetForm from "../../components/BudgetForm";
import { Kaiku } from "../../components/Maasto";
import { FAQ_GROUPS } from "../faq";

import { Puu, Vertailu } from "./Artefaktit";
import {
  BSTATS,
  EI_SOVI,
  FIGS,
  FLIST,
  ICONS,
  INCLUDE_ICONS,
  INCLUDES,
  OPTIONS,
  PLANS,
  PROBLEMS,
  REFCHIPS,
  SEO_ICONS,
  SEO_KUVIOT,
  SEO_POINTS,
  SOPII,
  STEPS,
  UKK_KYSYMYKSET,
} from "./sisalto";

/**
 * VERKKOSIVUSIVUN OSIOT, KIRJOITETTU SIVUSTON JAETULLA KUVAKIELELLA.
 *
 * Luokat (.seo-sec, .swrap, .seo-ord, .seo-h2, .spec, .kaksi, .qa2,
 * .jana, .osat) eivat ole SEO-sivun omia vaan sivuston kuvakielen,
 * joka asuu .wsx-nimiavaruudessa. Kaksi alasivua kayttaa samaa
 * toteutusta eika kahta kopiota: kopiot eroavat toisistaan
 * ensimmaisen korjauksen jalkeen, ja juuri siita syntyy tunne
 * kahdesta eri sivustosta.
 *
 * Tekstit tulevat sisalto.tsx:sta sellaisenaan. Tama tiedosto ei
 * sisalla yhtaan lausetta jota lukija nakee.
 */

function Ikoni({ nimi }: { nimi: string }) {
  return (
    <svg className="vs-ikoni" viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[nimi]}
    </svg>
  );
}

/* ---------- Tuttu tilanne ---------- */
export function Ongelma() {
  return (
    <section className="seo-sec" id="miksi">
      <Kaiku sana="TILANNE" puoli="oik" kohta="ylos" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Tuttu tilanne</span>
          <i>Neljä syytä, mikä tahansa riittää</i>
        </div>
        <h2 className="seo-h2 rv">
          Verkkosivut ovat olemassa, mutta ne eivät <span className="mark">tuo asiakkaita.</span>
        </h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Nämä neljä tulevat vastaan lähes joka projektissa. Ne eivät ole järjestys eivätkä
          prosessi: ne tapahtuvat yhtä aikaa, ja mikä tahansa niistä yksin riittää syyksi.
        </p>

        <div className="kaksi porras rv" style={{ marginTop: "56px" }}>
          {PROBLEMS.map((p) => (
            <div key={p.h}>
              <div className="vs-otsikko">
                <Ikoni nimi={p.ic} />
                <h3>{p.h}</h3>
              </div>
              <p className="seo-body">{p.p}</p>
            </div>
          ))}
        </div>

        <div className="luvut porras rv">
          {BSTATS.map((s) => (
            <div key={s.p}>
              <b>{s.n}</b>
              <span>{s.p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Palvelun sisalto ---------- */
export function Sisalto() {
  return (
    <section className="seo-sec" id="sisalto">
      <Kaiku sana="SISÄLTÖ" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Palvelun sisältö</span>
        </div>
        <h2 className="seo-h2 rv">Mitä verkkosivujen suunnittelu ja toteutus sisältää?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Avaimet käteen tarkoittaa, ettei sinun tarvitse kirjoittaa tekstejä, valita fontteja tai
          opetella hakukoneoptimointia. Sinä kerrot yrityksestäsi ja palveluistasi, me hoidamme
          loput.
        </p>

        <div className="osat" data-rvs="">
          <article className="osa rv">
            <div className="osa-yla">
              {/* Vasen palsta: vaite ja sen todiste allekkain. Kumpikin
                  yksin oli vaaran kokoinen viereiselle palstalle, mutta
                  yhdessa ne ovat saman mittaiset kuin rivilista. */}
              <div className="osa-teksti">
                <div className="hs-otsikko">
                  <h3>Rakenne ratkaisee ennen ulkoasua</h3>
                </div>
                <p className="hs-p">
                  Sivurakenne päätetään ensin ja ulkoasu vasta sen jälkeen. Järjestys on tämä siksi,
                  että rakenne on se osa jota ei voi vaihtaa jälkikäteen ilman että näkyvyys
                  katkeaa.
                </p>
                <div className="osa-gfx kohoa rv">
                  <Puu />
                </div>
              </div>
              {/* MERKKI JOKAISELLE RIVILLE. Kahdeksan riviä oli
                  kahdeksan samanlaista tekstipakettia perakkain, eika
                  mikaan auttanut silmaa loytamaan etsimaansa. Merkki
                  antaa riville oman siluettinsa, jolloin listaa voi
                  silmailla lukematta jokaista otsikkoa. Selite
                  sisennetaan merkin leveydella, jolloin merkeista
                  syntyy vasempaan reunaan oma kisko. */}
              <dl className="hs-rows hs-merkein porras rv">
                {INCLUDES.map(([h, p], i) => (
                  <div key={h}>
                    <dt>
                      <svg className="hs-ik" viewBox="0 0 24 24" aria-hidden="true">
                        {INCLUDE_ICONS[i]}
                      </svg>
                      <span>{h}</span>
                    </dt>
                    <dd>{p}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- Toteutustapa ---------- */
export function Toteutustapa() {
  return (
    <section className="seo-sec" id="toteutustapa">
      <Kaiku sana="TOTEUTUS" puoli="oik" kohta="ylos" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Toteutustapa</span>
          <i>Kaksi tapaa, yksi mittaus</i>
        </div>
        <h2 className="seo-h2 rv">Perussivusto vai räätälöidyt verkkosivut?</h2>

        <div className="duo2" style={{ marginTop: "48px" }}>
          {OPTIONS.map((o) => (
            <div className="duo2-col" key={o.oc}>
              <p className="duo2-kick">{o.oc}</p>
              <h3>{o.h}</h3>
              <p className="seo-body">{o.p}</p>
              <ul className="seo-spec porras rv">
                {o.li.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="kohoa rv" style={{ marginTop: "56px" }}>
          <Vertailu />
        </div>
      </div>
    </section>
  );
}

/* ---------- Nakyvyys ---------- */
export function Nakyvyys() {
  return (
    <section className="seo-sec" id="hakukoneoptimointi">
      <Kaiku sana="NÄKYVYYS" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Näkyvyys</span>
          <i>Mukana jokaisessa toteutuksessa</i>
        </div>
        <h2 className="seo-h2 rv">Näin verkkosivut näkyvät Googlessa</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Hakukoneoptimoinnin perusta rakennetaan sivustoon sisään, ei päälle jälkikäteen.
        </p>

        {/* NUMEROT POIS, MERKKI TILALLE.
            01-04 lupasi jarjestyksen jota ei ole: nama nelja ovat
            rinnakkaisia keinoja, eivat askelia, ja numero sanoi
            painokkaimmin juuri sen mika kohdassa on vahiten tietoa.
            Ruudukko sanoo rinnakkaisuuden jo itse.

            Tilalle tulee kohdan oma merkki. Merkit olivat valmiina
            sisalto.tsx:ssa (SEO_ICONS) mutta niita ei ollut kytketty
            mihinkaan. Merkki on kehystetty, eli se eroaa Tuttu tilanne
            -osion paljaista merkeista: sama kuvakieli, eri asema.

            Merkki ja otsikko samalla rivilla, ei allekkain. Iso numero
            vei oman rivinsa ja tyonsi leipatekstin alas, jolloin kortti
            oli korkeampi kuin sen sisalto. Viiva ylareunassa jaa: sen
            etenema on --rvp, sama luku jolla prosessin jana taytyy, ja
            --i antaa jokaiselle kohdalle oman viiveensa. */}
        {/* data-hehku ON NOPEUSSAADIN, ks. globals.css. --rvp:n matka on
            aina noin yksi nakyma, joten piirto olisi ohi kauan ennen
            kuin osio on. */}
        <ol className="nelja nelja-ikoni" data-rvs="" data-hehku="1.3">
          {SEO_POINTS.map(([h, p], i) => (
            <li className="nelja-k" key={h} style={{ "--i": i } as CSSProperties}>
              <div className="nelja-yla">
                <svg className="nelja-ik" viewBox="0 0 24 24" aria-hidden="true">
                  {SEO_ICONS[i]}
                </svg>
                <h3>{h}</h3>
              </div>
              <p>{p}</p>
              {/* KUVIO KORTIN POHJALLE. Merkki kertoo mista kohta
                  puhuu mutta ei nayta mitaan; kuvio piirtaa sen
                  mekaniikan josta rivi puhuu. Se on selvasti tekstia
                  vaimeampi, koska sen tehtava on antaa kortille pohja
                  ja syvyys eika kilpailla otsikon kanssa. */}
              <svg className="nelja-kuvio" viewBox="0 0 100 36" aria-hidden="true">
                {SEO_KUVIOT[i]}
              </svg>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Prosessi ---------- */
export function Prosessi() {
  return (
    <section className="seo-sec" id="prosessi">
      <Kaiku sana="PROSESSI" puoli="oik" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Prosessi</span>
          <i>Suunnittelusta julkaisuun</i>
        </div>
        <h2 className="seo-h2 rv">Näin verkkosivuprojekti etenee</h2>

        <div className="jana" data-rvs="">
          <div className="jana-akseli" aria-hidden="true">
            <i />
          </div>
          <div className="jana-jaksot porras rv">
            {STEPS.map(([h, p, kesto], i) => (
              <div className="jakso" key={h} style={{ "--i": i } as CSSProperties}>
                <p className="jakso-kk">{kesto}</p>
                <h3>{h}</h3>
                <p className="jakso-p">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Tulokset ---------- */
export function Tulokset() {
  return (
    <section className="seo-sec" id="tulokset">
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Tulokset</span>
          <i>Mitattu ennen julkaisua</i>
        </div>
        <h2 className="seo-h2 rv">Ero näkyy heti, ja se mitataan.</h2>

        <div className="luvut isot porras rv">
          {FIGS.map(([n, h, p]) => (
            <div key={h}>
              <b>{n}</b>
              <span>{h}</span>
              <em>{p}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Asiakkaat ---------- */
export function Asiakkaat() {
  return (
    <section className="seo-sec" id="asiakkaat">
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Asiakkaat</span>
          <i>Toimialoja joille olemme tehneet</i>
        </div>
        <div className="seo-tags porras rv" style={{ marginTop: "32px" }}>
          {REFCHIPS.map(([a, b]) => (
            <span key={a}>
              {a}
              <s>{b}</s>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Hinnoittelu ---------- */
/* KOLME KORTTIA, EI VERTAILUTAULUKKOA. Paketit eivat ole sama
   ominaisuuslista eri arvoilla vaan kolme eri kokonaisuutta, joilla on
   eri mittaiset ja eri sisaltoiset listat. Taulukko olisi luvannut
   rivi riviltä vertailun jota naissa ei ole, ja puolet ruudukosta olisi
   ollut viivoja. */
export function Hinnoittelu() {
  return (
    /* SAMA POHJA KUIN MUULLA SIVULLA.
       Hinnasto oli sivun ainoa vaalea osio ja sillä oli oma
       fasettikuvionsa. Peittavassa vierityksessa se tarkoitti etta
       yksi coveri nousi eri varisena kuin kaikki muut: sivu vaihtoi
       pohjan kesken ketjun ja palasi takaisin seuraavassa osiossa.
       Nyt pohja jatkuu katkeamatta, ja hinnasto erottuu sillä mikä
       sen kuuluukin erottaa: korteilla. */
    <section className="seo-sec" id="hinnoittelu">
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <i>Kiinteä hinta, ei aloitusmaksua</i>
        </div>
        <h2 className="seo-h2 rv">Paljonko verkkosivut maksavat yritykselle?</h2>

        <div className="paketit porras rv">
          {PLANS.map((p) => (
            <div className={p.hl ? "paketti hl" : "paketti"} key={p.h}>
              {p.badge ? <em className="paketti-merkki">{p.badge}</em> : null}
              <h3>{p.h}</h3>
              <p className="hinta-n">
                {p.price} <small>{p.unit}</small>
              </p>
              <p className="hinta-f">{p.for}</p>
              <ul className="seo-spec">
                {p.li.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <a className="btn" href="#tarjous">
                Pyydä tarjous
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Kenelle ---------- */
export function Kenelle() {
  return (
    <section className="seo-sec" id="kenelle">
      <Kaiku sana="KENELLE" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Kenelle</span>
          <i>Sanomme sen suoraan</i>
        </div>
        <h2 className="seo-h2 rv">Kenelle verkkosivut kannattaa teettää meillä?</h2>

        <div className="kaksi porras rv" style={{ marginTop: "48px" }}>
          <div>
            <p className="kaksi-kick">Sopii sinulle, jos</p>
            <ul className="seo-spec">
              {SOPII.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kaksi-kick">Ei ehkä vielä, jos</p>
            <ul className="seo-spec">
              {EI_SOVI.map(([h, p]) => (
                <li key={h}>
                  {h}
                  <s>{p}</s>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- UKK ---------- */
export function Ukk() {
  const kaikki = FAQ_GROUPS.flatMap((g) => g.items);
  const nakyvat = UKK_KYSYMYKSET.map((q) => kaikki.find((it) => it.q === q)).filter(
    (it): it is NonNullable<typeof it> => Boolean(it),
  );

  return (
    <section className="seo-sec" id="ukk">
      <Kaiku sana="FAQ" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Usein kysyttyä</span>
          <i>{nakyvat.length} kysymystä</i>
        </div>
        <div className="qa2">
          <div className="qa2-side">
            <h2 className="seo-h2 rv">Usein kysytyt kysymykset verkkosivuista</h2>
            <p className="seo-lead rv" style={{ marginTop: "22px" }}>
              Hinta, aikataulu, omistajuus ja ylläpito. Nämä kysytään useimmin, ja vastaus on
              sama myös puhelimessa.
            </p>
            <div className="qa2-ask">
              <span>Etkö löytänyt vastausta?</span>
              <a href="#tarjous">Kysy suoraan, vastaamme 24 tunnissa</a>
            </div>
          </div>
          <div className="qa2-list porras rv">
            {nakyvat.map((item, n) => (
              <details key={item.q} name="ukk-verkkosivut" open={n === 0}>
                <summary>{item.q}</summary>
                <div className="a">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Tarjous ---------- */
export function Tarjous() {
  return (
    <section className="seo-sec kuvapohja" id="tarjous">
      <img
        className="pohjakuva"
        src="/verkkosivut/koodi.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        data-par="0.028"
      />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
        </div>
        <div className="loc">
          <div>
            <h2 className="seo-h2 rv">
              Pyydä tarjous <span className="mark">verkkosivuista.</span>
            </h2>
            <p className="seo-lead rv" style={{ marginTop: "26px" }}>
              Kerro lyhyesti mitä yritys tekee ja millainen sivusto on mielessä. Saat
              kiinteähintaisen tarjouksen, eikä yhteydenotto sido sinua mihinkään.
            </p>
            <ol className="askel porras rv">
              {FLIST.map(([h, s]) => (
                <li key={h}>
                  <b>{h}</b>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* SAMA KORTTI KUIN LYHYTVIDEOILLA. Budjettiliukuri pois:
              se oli kortin korkein yksittainen osa, ja budjetin
              kysyminen ennen kuin kavija tietaa mita han on ostamassa
              karsii yhteydenottoja. Hinnat ovat sivulla jo omana
              osionaan, joten kysymys ei kerro meille mitaan jota
              lukija ei olisi juuri lukenut.

              Kaksi kenttaa jaa: nykyiset verkkosivut ja millainen
              sivusto on mielessa. Kaanto -y kuten Lyhytvideoilla. */}
          <BudgetForm
            showBudget={false}
            messageLabel="Millainen sivusto on mielessä?"
            extraField={{ id: "nyk", label: "Nykyiset verkkosivut (jos on)", placeholder: "esimerkki.fi" }}
            note="Ei sitoumuksia."
            /* Kortti on oikeanpuoleinen lohko ja kaantyy kohti vasenta
               tekstipalstaa: "y" tuo VASEMMAN reunan katsojaa kohti.
               Aiempi "-y" kaansi sen poispain tekstista. */
            tilt="y"
          />
        </div>
      </div>
    </section>
  );
}
