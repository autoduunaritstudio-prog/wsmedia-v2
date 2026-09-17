import BudgetForm from "../../components/BudgetForm";
import NetBackdrop from "../../components/NetBackdrop";
import MetalBackdrop from "../../components/MetalBackdrop";
import SmartLink from "../../components/SmartLink";
import { RefGrid } from "../../components/RefCards";
import Kehotus from "../../hakukoneoptimointi/components/Kehotus";
import PlatformMark from "../../components/PlatformMark";

import { Pystykisko } from "../../components/Maasto";

import { PANEELIT } from "./Paneelit";
import { EI_SOVI, KETJU, PLANS, PLATFORMS, REASONS, SOPII, STEPS } from "./sisalto";
import { FAQ_GROUPS } from "../faq-data";

import type { CSSProperties, ReactNode } from "react";

/* ==================================================================
   LYHYTVIDEOT .wsx-KUVAKIELELLA
   ==================================================================
   Sivu oli sivuston ainoa alasivu joka kaytti vanhaa page-dark-pohjaa
   ja sen omaa kalustoa (.shead, .whycard, .mband, .plan, .fitbox,
   .qa). Verkkosivut ja hakukoneoptimointi puhuvat .wsx-kielta, ja
   ajatus on etta etusivu erottuu omana maailmanaan ja nelja
   palvelusivua toimivat keskenaan yhtenaisina.

   Tekstit eivat muutu. Ne tulevat sisalto.tsx:sta, johon ne
   poimittiin koneellisesti merkki merkilta. Kaaviopaneelit tulevat
   Paneelit.tsx:sta samalla tavalla: ne ovat sivun parhaat todisteet
   eika ilmeen vaihto ole syy tehda niita uudelleen.

   Kalusto on sama kuin kahdella muulla palvelusivulla:
     .seo-ord   osion numerorivi ja sen selite
     .nelja     kaksi kertaa kaksi, iso numero ja vetaytyva viiva
     .duo2      rinnakkaiset kortit
     .jana      aikajana solmuineen
     .paketit   hinnasto
     .kaksi     sopii / ei sovi
     .qa2       usein kysyttya
     .loc       kaksipalstainen lopetus
     .kehotus   osion paattava kehotus */

const n = (k: number) => ({ "--i": k }) as CSSProperties;

/**
 * KAHDEN OSION YHTEINEN TAUSTA.
 *
 * Peittava osio tarvitsee umpinaisen pohjan, ja jokaisella omalla
 * NetBackdropilla on oma satunnainen pistekentta. Kaksi perakkaista
 * osiota omilla kerroksillaan nayttivat siksi silta etta kuviointi
 * katkeaa niiden valissa ja ne irtoavat toisistaan.
 *
 * Kaare ottaa pohjan ja kuvion itselleen, ja osiot sen sisalla ovat
 * lapinakyvia: yksi kentta, yksi katkeamaton kuvio kahden osion yli.
 */
export function Jakso({ children }: { children: ReactNode }) {
  return (
    <div className="jakso-pari">
      <NetBackdrop mount="cover" />
      {children}
    </div>
  );
}


/* ---------- 1. Miksi ---------- */
export function Miksi() {
  return (
    <section className="seo-sec" id="miksi">
      <Pystykisko teksti="Miksi lyhytvideot" />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">Neljä syytä, mikä tahansa riittää</p>
        <h2 className="seo-h2 rv">
          Lyhytvideot ovat pk-yrityksen kustannustehokkain tapa tulla löydetyksi.
        </h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          TikTokissa, Instagram Reelsissä ja YouTube Shortsissa näkyvyys ei enää seuraa
          seuraajamäärää vaan sisällön laatua. Se on pienen yrityksen etu: jos sisältö on tehty
          oikein.
        </p>

        {/* Kaaviopaneeli on kortin tausta eika sen kuvitus: jokainen
            nayttaa sen ilmion josta kortin oma otsikko puhuu. */}
        <ol className="nelja" data-rvs="" data-hehku="1">
          {REASONS.map((r, k) => (
            <li className="nelja-k lv-k" key={r.h} style={n(k)}>
              <div className="lv-taus" aria-hidden="true">
                {PANEELIT[r.art]}
              </div>
              <b className="nelja-n">{k + 1}</b>
              <h3>{r.h}</h3>
              <p>{r.p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 2. Alustat ---------- */
export function Alustat() {
  return (
    <section className="seo-sec" id="alustat">
      <Pystykisko teksti="Kanavat" />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">Kolme alustaa, yksi kuvauspäivä</p>
        <h2 className="seo-h2 rv">TikTok, Instagram Reels vai YouTube Shorts?</h2>
        {/* INGRESSI KORJATTIIN. Aiempi teksti lupasi, etta sama
            kuvausmateriaali "leikataan ja optimoidaan jokaiselle
            kanavalle erikseen". Kaytannossa sama video julkaistaan
            kaikissa kolmessa, joten lupaus olisi ollut myyntia joka ei
            pida paikkaansa. Ero kanavien valilla on siina kenet niista
            tavoittaa, ja ratkaiseva tekija on kasikirjoitus. */}
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Vastaus on yleensä kaikki kolme, ja sama video toimii niissä kaikissa. Ratkaiseva ero ei
          ole alusta vaan käsikirjoitus: se päättää pysähtyykö katsoja. Kanavat eroavat siinä,
          kenet niistä tavoittaa.
        </p>

        <div className="duo2" style={{ marginTop: "48px" }}>
          {PLATFORMS.map((p) => (
            <div className={`duo2-col kanava kanava-${p.mark} rv`} key={p.href}>
              <p className="kanava-merkki">
                {/* tone="brand" eli alustan omat varit. Harmaat
                    viivalogot lukivat koristeena; varillisina ne
                    tunnistaa yhdella silmayksella, ja juuri
                    tunnistaminen on taman osion tehtava. */}
                <PlatformMark id={p.mark} tone="brand" />
              </p>
              <h3>{p.h}</h3>
              <p className="seo-body">{p.p}</p>
              <SmartLink href={p.href} className="tlink">
                {p.link}
              </SmartLink>
            </div>
          ))}
        </div>

        {/* MITATTU: heron napin ja seuraavan napin valiin jai 7 606px
            eli 8,8 nakymaa. Alalaidan palkki peittaa sen, mutta osion
            oma kehotus on parempi: se on siina kohdassa jossa lukija
            on juuri saanut vastauksen. */}
        <Kehotus kick="Kaikki kolme, yhdestä kuvauksesta">
          Kartoituksessa katsotaan mitkä kanavat sinun asiakkaasi oikeasti käyttävät ja mitä
          niihin kannattaa tehdä.
        </Kehotus>
      </div>
    </section>
  );
}

/* ---------- 3. Prosessi ---------- */
export function Prosessi() {
  return (
    <section className="seo-sec" id="prosessi">
      <Pystykisko teksti="Prosessi" />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">Ensimmäisestä puhelusta julkaisuun</p>
        <h2 className="seo-h2 rv">Näin lyhytvideotuotanto etenee.</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Ensimmäisestä puhelusta valmiisiin videoihin tyypillisesti [X] arkipäivää. Sinun aikaasi
          kuluu noin [X] tuntia kuukaudessa.
        </p>

        <div className="jana" data-rvs="">
          <div className="jana-akseli" aria-hidden="true">
            <i />
          </div>
          <div className="jana-jaksot porras rv">
            {STEPS.map((s, k) => (
              <div className="jakso" key={s.h} style={n(k)}>
                <p className="jakso-kk">{String(k + 1).padStart(2, "0")}</p>
                <h3>{s.h}</h3>
                <p className="jakso-p">{s.p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Missa kuvaamme. Tama oli oma osionsa; nyt se on prosessin
            viimeinen rivi, koska se on prosessin kysymys. */}
        <div className="missa rv">
          <p className="missa-kick">Missä kuvaamme</p>
          <p className="missa-p">
            Kuvaamme päivittäin pääkaupunkiseudulla ja muualla Suomessa sopimuksen mukaan.
            Käsikirjoitus, editointi ja julkaisu toimivat etänä minne tahansa Suomessa.
          </p>
        </div>

        <Kehotus kick="Et tarvitse käsikirjoitusta valmiiksi">
          Kartoituksessa käymme läpi mitä yritys tekee ja kenelle, ja rakennamme ensimmäisen
          kuukauden sisällöt sen pohjalta.
        </Kehotus>
      </div>
    </section>
  );
}

/* Alueet-osio poistettiin omana osionaan.

   Se oli taysleveä valokuva, jonka paalla oli otsikko ja kolme riviä
   kuvauslogistiikkaa. Kaksi osiota aiemmin on jo taysleveä kuvalaatta
   ja kaksi osiota myohemmin toinen, joten kolmas peraakkain luki
   kuvituksena eika osiona: B-rollia B-rollin paalle.

   Sisalto ei katoa. Se on nyt Prosessin paattava rivi, jossa se myos
   kuuluu: kysymys "tuletteko meille" syntyy silloin kun prosessia
   luetaan, eika se ansaitse omaa nakymaansa. Samalla sivu lyhenee
   yhdella osiolla ilman etta yhtaan lausetta menetetaan. */

/* KOLME MERKKIA KOKONAISUUDEN RIVEILLE.
   Rivit olivat pelkkaa typografiaa, ja osio luki siksi tyhjana
   verrattuna muuhun sivuun. Jokainen merkki nayttaa sen mekaniikan
   josta oma rivinsa puhuu, eika ole koriste:

     yleiso   yksi piste sailee moneksi, eli orgaaninen leviaminen
     kohdennus  leveasta joukosta rajattu osa, eli maksettu kohdennus
     haku     hakutuloslista ja siita valittu rivi

   Viivat piirtyvat rivin oman --rvp:n mukaan, samalla tavalla kuin
   korttien kaaviot. */
const MERKIT = [
  /* BRANDIARVO, KOLMAS VERSIO. Kaksi kayrää samassa kuvassa:
     ylempi nousee ja JAA ylos, alempi nousee ja putoaa takaisin.
     Juuri se on brandiarvon ero ostettuun nakyvyyteen, ja se on myos
     osion oma vaite. Aiemmat versiot (leviava verkosto, paallekkaiset
     jaljet, laajenevat kehat) kuvasivat tavoittavuutta ja toistoa,
     eivat sita etta arvo JAA. */
  <svg viewBox="0 0 120 72" fill="none" key="a" aria-hidden="true">
    <path d="M10 62 H112" className="km-akseli" />
    <path
      d="M12 58 C30 56, 40 30, 56 22 C74 13, 92 14, 110 14"
      className="km-viiva km-kirkas"
      pathLength={1}
    />
    <path
      d="M12 60 C28 58, 38 34, 52 30 C66 26, 74 50, 86 56 C96 60, 104 61, 110 61"
      className="km-viiva km-laskeva"
      pathLength={1}
    />
    <circle cx="110" cy="14" r="3.4" className="km-piste" />
  </svg>,
  /* KYSYNTA = yha useampi etsii. Pylvaat kasvavat vasemmalta oikealle
     ja niiden paalla on hakukentta: kysynta on sita etta ihmiset
     alkavat hakea. Aiempi kohdennuskuva kuvasi mainonnan tekniikkaa
     eika sita mita siita seuraa. */
  <svg viewBox="0 0 120 72" fill="none" key="b" aria-hidden="true">
    <rect x="14" y="48" width="13" height="12" rx="3" className="km-pylvas p1" />
    <rect x="34" y="40" width="13" height="20" rx="3" className="km-pylvas p2" />
    <rect x="54" y="30" width="13" height="30" rx="3" className="km-pylvas p3" />
    <rect x="74" y="18" width="13" height="42" rx="3" className="km-pylvas p4" />
    <circle cx="98" cy="20" r="11" className="km-kehys km-vahva" />
    <path d="M106 28 L114 36" className="km-viiva km-kirkas" pathLength={1} />
  </svg>,
  /* LIIDIT = yhteydenotto saapuu. Kirjekuori oikeissa mittasuhteissa
     (56 x 38, ei litistetty kaistale) ja nuoli joka laskeutuu siihen. */
  <svg viewBox="0 0 120 72" fill="none" key="c" aria-hidden="true">
    <path d="M60 4 V22" className="km-viiva km-kirkas" pathLength={1} />
    <path d="M53 16 l7 7 7 -7" className="km-viiva km-kirkas" pathLength={1} />
    <rect x="32" y="28" width="56" height="38" rx="6" className="km-kehys km-vahva" />
    <path d="M32 33 L60 51 88 33" className="km-viiva" pathLength={1} />
  </svg>,
];


/* ---------- 5. Kokonaisuus ---------- */
/* KOLMAS YRITYS, ja syy on sama molemmilla edellisilla.

   Ensin kolme rinnakkaista korttia: ne lukivat vaihtoehtoina, vaikka
   osion otsikko sanoo etta nama ovat perakkaisia. Sitten numeroitu
   ketju ja sen jalkeen numeroitu pystyvirta: molemmat olivat
   silmalle sama kuva kuin Prosessin aikajana kaksi osiota aiemmin,
   koska molemmissa oli numeroidut solmut ja niita yhdistava viiva.
   Jarjestyksen vaihtaminen ei auta, jos KALUSTO on sama.

   Nyt kalusto on eri. Ei numeroita, ei yhdistavaa viivaa, ei
   solmuja. Kolme taysleveää riviä, joissa rooli on ISO hiljainen
   sana vasemmalla ja selitys oikealla, hiusviiva valissa. Prosessi
   on kapea aikajana tummalla paneelilla, tama on leveaa typografiaa
   sivun omalla pohjalla. Ne eivat voi enaa nayttaa samalta.

   Osio ei myoskaan saa omaa savyaan eika verkostotaustaa: kaksi
   perakkaista osiota, joilla on sama kuvio eri savyisena, lukee
   virheena eika rytmina. */
export function Kokonaisuus() {
  return (
    <section className="seo-sec" id="kokonaisuus">
      <Pystykisko teksti="Kokonaisuus" />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">Kolme osaa, yksi ketju</p>
        <h2 className="seo-h2 rv">Lyhytvideo rakentaa brändin. Mainonta ja haku tuovat liidit.</h2>

        <div className="portaat porras rv">
          {KETJU.map((k, idx) => (
            <div className="porras-rivi" data-hehku="" key={k.h}>
              <div className="porras-vasen">
                <p className="porras-rooli">{k.over}</p>
                <span className="porras-merkki">{MERKIT[idx]}</span>
              </div>
              <div className="porras-teksti">
                <h3>{k.h}</h3>
                <p className="seo-body">{k.p}</p>
                {idx > 0 ? (
                  <SmartLink
                    href={idx === 1 ? "/graafinen-suunnittelu" : "/hakukoneoptimointi"}
                    className="tlink"
                  >
                    {idx === 1 ? "Graafinen suunnittelu" : "Hakukoneoptimointi"}
                  </SmartLink>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Tulokset ---------- */
export function Tulokset() {
  return (
    <section className="seo-sec" id="tulokset">
      <Pystykisko teksti="Tehtyä työtä" />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">Asiakkaiden omilla tileillä</p>
        <h2 className="seo-h2 rv">Näytämme mieluummin kuin kerromme.</h2>

        {/* Ruudukko oli .swrapin ULKOPUOLELLA, joten se levisi koko
            nakymaan: 1728px levea ruudukko ja 364 x 625 pikselin
            kortit 592 pikselin ruudussa, eli kortit eivat mahtuneet
            omaan ruudukkoonsa. Nyt se on osion omassa mitassa ja
            saa oman kattonsa. */}
        <div className="lv-refs">
          <RefGrid />
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. Hinnoittelu ---------- */
export function Hinnoittelu() {
  return (
    <section className="seo-sec valo" id="hinnoittelu">
      <MetalBackdrop inSection />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">Kiinteä kuukausihinta · ei aloitusmaksua</p>
        <h2 className="seo-h2 rv">Paljonko lyhytvideotuotanto maksaa?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Kiinteä kuukausihinta, ei aloitusmaksuja eikä pitkiä sopimuksia. Irtisanominen kuukausi
          kerrallaan.
        </p>

        <div className="paketit porras rv">
          {PLANS.map((p) => (
            <div className={p.pop ? "paketti hl" : "paketti"} key={p.name}>
              {p.tag ? <em className="paketti-merkki">{p.tag}</em> : null}
              <h3>{p.name}</h3>
              <p className="hinta-n">
                [HINTA] <small>€/kk + alv</small>
              </p>
              <p className="hinta-f">{p.forWhom}</p>
              <ul className="seo-spec">
                {p.features.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <a className={p.pop ? "btn" : "btn alt"} href="#tarjous">
                Pyydä tarjous
              </a>
            </div>
          ))}
        </div>

        <p className="seo-body" style={{ marginTop: "28px", maxWidth: "80ch" }}>
          Yksittäiset lyhytvideot ja kampanjatuotannot hinnoitellaan projekteina alkaen [HINTA] €.
          Kaikki hinnat + alv 25,5 %.
        </p>
      </div>
    </section>
  );
}

/* ---------- 8. Kenelle ---------- */
export function Kenelle() {
  return (
    <section className="seo-sec" id="kenelle">
      {/* Savy pois. Umpinainen pohja peitti sivutason verkoston, joten
          osio luki eri maailmasta kuin sen naapuri UKK. Lapinakyvana
          molemmat nayttavat saman kuvion. */}
      <Pystykisko teksti="Kenelle" />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">Sanomme sen kartoituksessa</p>
        <h2 className="seo-h2 rv">Kenelle lyhytvideotuotanto sopii?</h2>

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
            <p className="kaksi-kick">Älä osta tätä, jos</p>
            <ul className="seo-spec">
              {EI_SOVI.map((x) => (
                <li key={x.tilanne}>
                  {x.tilanne}
                  <s>{x.suositus}</s>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Kehotus kick="Kumpi palsta on sinun?">
          Jos et ole varma, kysy. Sanomme kartoituksessa suoraan myös silloin, kun vastaus on
          ettei tämä kannata.
        </Kehotus>
      </div>
    </section>
  );
}

/* ---------- 9. Usein kysyttyä ---------- */
export function Ukk() {
  const kaikki = FAQ_GROUPS.flatMap((g) => g.items);
  return (
    <section className="seo-sec" id="ukk">
      <div className="swrap">
        <p className="seo-selite" data-rvs="">{kaikki.length} kysymystä</p>
        <div className="qa2">
          <div className="qa2-side">
            <h2 className="seo-h2 rv">Usein kysytyt kysymykset lyhytvideotuotannosta</h2>
            <p className="seo-body" style={{ marginTop: "22px" }}>
              Hinta, määrä, aikataulu ja se mitä työhön oikeasti sisältyy.
            </p>
            <p className="qa2-ask">
              <span>Etkö löytänyt vastausta?</span>
              <a href="#tarjous">Kysy suoraan, vastaamme 24 tunnissa</a>
            </p>
          </div>
          <div className="qa2-list porras rv">
            {kaikki.map((it, k) => (
              <details key={it.q} name="ukk-lyhytvideot" open={k === 0}>
                <summary>{it.q}</summary>
                <div className="a">{it.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 10. Tarjous ---------- */
export function Tarjous() {
  return (
    <section className="seo-sec kuvapohja" id="tarjous">
      <img
        className="pohjakuva"
        src="/lyhytvideot/prosessi-leikkaus.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        data-par="0.028"
      />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">Vastaus 24 tunnissa</p>
        <div className="loc">
          <div>
            <h2 className="seo-h2 rv">
              Valmis aloittamaan <span className="korosta">lyhytvideotuotannon?</span>
            </h2>
            <p className="seo-lead rv" style={{ marginTop: "26px" }}>
              Vastaamme 24 tunnin sisällä ja kerromme suoraan mitä ehdotamme ja mitä se maksaa.
            </p>
            <ol className="askel porras rv">
              <li>
                <b>24 h</b>
                <span>Luemme viestin ja vastaamme sähköpostilla arkipäivän sisällä.</span>
              </li>
              <li>
                <b>30 min</b>
                <span>Puhelu tai etäpalaveri: tavoite, kanavat ja kuvausten käytäntö.</span>
              </li>
              <li>
                <b>Tarjous</b>
                <span>Kirjallinen ehdotus hintoineen. Ei sitoumuksia ennen hyväksyntää.</span>
              </li>
            </ol>
          </div>

          {/* Ei budjettiliukuria. Sama perustelu kuin etusivulla:
              budjetin kysyminen ennen kuin kavija tietaa mita han on
              ostamassa karsii yhteydenottoja, ja talla sivulla hinnat
              ovat viela auki. Kysymys "mita tavoittelet" tekee saman
              tyon ilman etta kukaan joutuu arvaamaan lukua. */}
          <BudgetForm
            showBudget={false}
            messageLabel="Mitä tavoittelet lyhytvideoilla?"
            note="Ei sitoumuksia."
            tilt="-y"
          />
        </div>
      </div>
    </section>
  );
}
