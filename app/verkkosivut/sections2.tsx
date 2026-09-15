import Image from "next/image";

import type { CSSProperties } from "react";

import BeforeAfter from "../components/BeforeAfter";
import BudgetForm from "../components/BudgetForm";
import SmartLink from "../components/SmartLink";
import { FAQ_GROUPS } from "./faq";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ---------- Tulokset ---------- */
const FIGS = [
  ["90+/100", "PageSpeed-pisteet mobiilissa", "Mitataan Googlen työkalulla ennen julkaisua"],
  ["alle 1,5 s", "Sisällön latautuminen mobiilissa", "Testataan mobiiliyhteydellä, ei vain toimiston verkossa"],
  ["100 %", "Sivuista indeksoitavissa julkaisupäivänä", "Sivustokartta ja metatiedot tarkistetaan sivu kerrallaan"],
];

export function Tulokset() {
  return (
    <section id="tulokset" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="hsplit rv">
          <div>
            <span className="kick">Tulokset</span>
            <h2>Ero näkyy heti, ja se mitataan.</h2>
          </div>
          <p className="sub">
            Vedä kahvasta ja katso ero. Jokainen sivusto mitataan ennen julkaisua, ja nämä tasot ovat
            se rima, jonka alle ei mennä.
          </p>
        </div>

        <div className="frame rv">
          <BeforeAfter />
        </div>

        <div className="figs stagger">
          {FIGS.map(([n, b, s], idx) => (
            <div className="fig rv" style={i(idx)} key={b}>
              <span className="tag">Mitataan</span>
              <div className="n">{n}</div>
              <b>{b}</b>
              <s>{s}</s>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Hinnoittelu ---------- */
const PLANS = [
  {
    h: "Startti",
    for: "Yritykselle, joka tarvitsee uskottavat kotisivut nopeasti.",
    li: ["Etusivu ja 3 alasivua", "Ulkoasu ja tekstit valmiina", "Tekninen hakukoneoptimointi", "Yhteydenottolomake ja analytiikka", "Julkaisu 2 viikossa"],
    price: "1 490",
    unit: "€ + alv",
    alt: true,
  },
  {
    h: "Yrityssivusto",
    badge: "Suosituin",
    for: "Yritykselle, jolla on useita palveluita ja jonka pitää näkyä hauissa.",
    li: ["6–12 sisältösivua", "Oma alasivu jokaiselle palvelulle", "Laajempi sisältö- ja hakusanatyö", "Referenssit ja työnäytteet", "Lomakkeet ja analytiikka", "Laajennettava rakenne"],
    price: "2 990",
    unit: "€ + alv",
    hl: true,
  },
  {
    h: "Räätälöity",
    for: "Kun tarpeet menevät pakettien yli.",
    li: ["Käsin koodattu toteutus", "Omat toiminnallisuudet ja integraatiot", "Verkkokauppa tai varausjärjestelmä", "Monikieliset sivut", "Ei ylärajaa sivumäärässä"],
    price: "alk. 5 900",
    unit: "€ + alv",
    alt: true,
  },
];

export function Hinnoittelu() {
  return (
    <section id="hinnoittelu">
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Hinnoittelu</span>
          <h2>Paljonko verkkosivut maksavat yritykselle?</h2>
          <p className="sub">
            Kiinteä projektihinta kattaa suunnittelun, toteutuksen, tekstit, teknisen
            hakukoneoptimoinnin ja julkaisun. Lopullinen hinta riippuu sivuston laajuudesta, sisällön
            määrästä ja siitä, kuinka paljon sivuston halutaan tukevan hakukonenäkyvyyttä.
          </p>
        </div>

        <div className="prows">
          {PLANS.map((p) => (
            <div className={`prow${p.hl ? " hl" : ""} rv`} key={p.h}>
              <div>
                {p.badge && <span className="badge">{p.badge}</span>}
                <h3>{p.h}</h3>
                <p className="for">{p.for}</p>
              </div>
              <ul>
                {p.li.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="pp">
                <div className="price">
                  {p.price} <small>{p.unit}</small>
                </div>
                <a className={p.alt ? "btn alt" : "btn"} href="#tarjous">
                  Pyydä tarjous
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="care rv">
          <div>
            <span className="kick">Jatkuva näkyvyys</span>
            <h3>Ylläpito ja hakukoneoptimointi</h3>
            <p>
              Projektihinta vie sivuston verkkoon. Sijoitukset syntyvät kuitenkin ajan kanssa:
              sisältöä pitää lisätä, hakusanoja seurata ja tekniikka pitää ajan tasalla. Jatkuva
              paketti hoitaa tämän kuukausittain, eikä sinun tarvitse muistaa mitään.
            </p>
            <ul>
              {["Päivitykset ja tietoturva", "Palvelintila ja varmuuskopiot", "Sisältömuutokset", "Hakusanaseuranta ja kuukausiraportti", "Jatkuva sisällöntuotanto"].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="careprice">
            <div className="price">
              390 <small>€/kk + alv</small>
            </div>
            <a className="btn" href="#tarjous">
              Pyydä suunnitelma
            </a>
          </div>
        </div>

        <p className="pricenote rv">
          Kaikki hinnat + alv 25,5 %. Projektihinta on kertaluonteinen eikä sivusto vaadi pakollista
          kuukausisitoutumista. Verkkotunnus, palvelintila ja SSL-suojaus sisältyvät ensimmäiseen
          vuoteen. Jatkuvan paketin voi lopettaa kuukauden irtisanomisajalla, sivusto ja
          verkkotunnus jäävät joka tapauksessa sinulle.
        </p>
      </div>
    </section>
  );
}

/* ---------- Kenelle ---------- */
/**
 * TILIKIRJA, EI KAHTA KORTTIA.
 *
 * Osio oli kaksi saman levyista paneelia rinnakkain, molemmilla oma
 * tausta ja oma reuna. Se on sama muoto jota sivun jokainen muukin
 * osio kaytti, jolloin lukija ei tiedä kumpi puoli on kumpi ennen kuin
 * lukee otsikot - vaikka juuri vastakkainasettelu on koko osion asia.
 *
 * Jaettu pystyviiva tekee sen minka kaksi reunaa hukkasivat: yksi raja
 * kahden asian valissa lukee vertailuna, kaksi reunaa lukee kahtena
 * laatikkona. Sama rakenne on lyhytvideosivulla, ja se on nyt
 * teemaneutraali (ks. ALAOSAN KALUSTON TEEMATOKENIT globals.css:ssa),
 * joten vaalea ja tumma sivu jakavat saman kaluston eivatka kahta
 * toisintoa.
 *
 * EI-PUOLI HIMMENNETAAN OPASITEETILLA eika harmaammalla varilla: sama
 * tekstiperhe pienemmalla painolla. Harmaampi vari olisi tehnyt siita
 * toisen luokan tekstia, vaikka se on yhta rehellista sisaltoa.
 */
const SOPII = [
  "Yritykselläsi on useampi palvelu, joilla jokaisella on oma asiakaskuntansa",
  "Haluat näkyä Googlessa palveluhauilla, et vain yrityksen nimellä",
  "Nykyinen sivusto on hidas, vanhentunut tai sitä ei voi päivittää itse",
  "Haluat kiinteän hinnan ja tietää etukäteen mitä siihen sisältyy",
  "Toivot, että tekstit, kuvat ja tekniikka hoituvat samalta tiimiltä",
];

const EI_SOVI: [string, string][] = [
  ["Etsit halvinta mahdollista sivustoa", "Emme kilpaile hinnalla vaan sillä, että sivusto löytyy ja myy"],
  ["Haluat rakentaa sivut itse", "Tarvitset silloin alustan ja mallipohjan, et toteuttajaa"],
  ["Palvelusi tai kohderyhmäsi on vielä auki", "Kannattaa ensin päättää mitä myyt ja kenelle"],
  ["Odotat Google-sijoituksia muutamassa viikossa", "Tekninen pohja on valmis heti, sijoitukset kertyvät kuukausissa"],
];

export function Kenelle() {
  return (
    <section id="kenelle" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Kenelle</span>
          <h2>Kenelle verkkosivut kannattaa teettää meillä?</h2>
          <p className="sub">
            Emme sovi kaikille, ja se on rehellisempää sanoa etukäteen kuin kolmannessa
            palaverissa.
          </p>
        </div>
        <div className="ledger rv">
          <div className="ledger-col">
            <h3>Sopii sinulle, jos</h3>
            <ul>
              {SOPII.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="ledger-col ledger-soft">
            <h3>Ei ehkä vielä, jos</h3>
            <ul>
              {EI_SOVI.map(([x, why]) => (
                <li key={x}>
                  {x}
                  <b>{why}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Toiminta-alue ---------- */
/**
 * HAKEMISTO, EI PILLERIRIVI.
 *
 * Kaupungit olivat rivi keskitettyja pillereita otsikon ja pitkan
 * kappaleen alla. Pillerirfvi on muodoltaan tagipilvi, eli se lukee
 * koristeena vaikka jokainen niista on oma sivunsa - ja keskitettyna
 * rivin katkeamiskohdat vaihtelevat ruudun leveyden mukaan, joten
 * listalla ei ole yhtaan pystysuoraa jota silmalla seurata.
 *
 * Hakemistossa on kaksi saraketta rivin SISALLA: nimi vasemmalla,
 * metatieto oikeassa reunassa. Juuri se toinen sarake tekee
 * linkkilistasta hakemiston, koska se vastaa kysymykseen jonka lukija
 * oikeasti tekee - onko tama lahella vai ei.
 *
 * Vasen palsta on sticky, koska oikea on pidempi eika osion vasen
 * puoli saa jaada tyhjaksi. Ehto: yhdellakaan esivanhemmalla ei saa
 * olla overflow: hidden, tai sticky lakkaa toimimasta aanettomasti.
 */
const SLUGS: Record<string, string> = { Jyväskylä: "jyvaskyla" };
const slug = (city: string) => SLUGS[city] ?? city.toLowerCase();

const PAIKAT = [
  { c: "Espoo", meta: "Toimipiste" },
  { c: "Helsinki", meta: "Tapaamisia viikoittain" },
  { c: "Vantaa", meta: "Tapaamisia viikoittain" },
  { c: "Tampere", meta: "Etänä tai paikan päällä" },
  { c: "Turku", meta: "Etänä tai paikan päällä" },
  { c: "Lahti", meta: "Etänä tai paikan päällä" },
  { c: "Pori", meta: "Etänä" },
  { c: "Jyväskylä", meta: "Etänä" },
  { c: "Kuopio", meta: "Etänä" },
  { c: "Oulu", meta: "Etänä" },
  { c: "Joensuu", meta: "Etänä" },
  { c: "Vaasa", meta: "Etänä" },
];

export function Alueet() {
  return (
    <section id="alueet" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="dir rv">
          <div className="dir-side">
            {/* SIVUN AINOA VALOKUVA. Sivulla ei ollut yhtaan kuvaa, ja
                juuri se tekee siita tekstiseinan: lukija ei saa yhtaan
                lepopistetta 14 000 pikselin matkalla. Kuva on
                toteutettu asiakastyo, eli se todistaa samalla mita
                osion ymparilla luvataan. Sticky-palstan sisalla se
                seuraa otsikkoa eika jaa hakemiston ylaosaan. */}
            <div className="dir-shot">
              <Image
                src="/referenssit/laaksolahdensahko-case.webp"
                alt="Toteutettu verkkosivusto asiakkaalle"
                width={1000}
                height={563}
                sizes="(max-width: 900px) 100vw, 400px"
              />
            </div>
            <span className="kick">Toiminta-alue</span>
            <h2>Verkkosivut yritykselle Espoosta koko Suomeen</h2>
            <p>
              Verkkosivuprojekti ei vaadi paikallaoloa. Kartoitus hoituu puhelimessa, suunnittelua
              seurataan demo-osoitteesta ja julkaisu tapahtuu verkossa, joten sijainti ei vaikuta
              hintaan eikä aikatauluun.
            </p>
            <p className="dir-note">
              Paikkakunnalla on merkitystä yhdessä asiassa: jos yrityksesi palvelee tiettyä aluetta,
              sivusto rakennetaan näkymään juuri niillä palveluhauilla joissa paikkakunta on mukana.
            </p>
          </div>
          <div className="dir-list">
            {PAIKAT.map((p) => (
              <SmartLink href={`/verkkosivut/${slug(p.c)}`} key={p.c}>
                <span>{p.c}</span>
                <s>{p.meta}</s>
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- UKK ---------- */
/**
 * STICKY-PALSTA JA NATIIVI EKSKLUSIIVINEN HAITARI.
 *
 * Osio oli kaksi rinnakkaista saraketta ryhmaotsikoineen, eli 17
 * kysymysta kahdessa pinossa. Kaksi saraketta pakottaa silman
 * hyppimaan puolelta toiselle, ja ryhmaotsikot kertoivat vain sen mika
 * kysymyksista jo nakyy.
 *
 * Yksi palsta ja sticky-otsikko sen vieressa. name-attribuutti tekee
 * haitarista eksklusiivisen ilman JS:aa: kun kaikilla details-
 * elementeilla on sama name, selain sulkee edellisen kun seuraava
 * avataan. Lista pysyy hallitun mittaisena, nappaimisto ja ruudunlukija
 * toimivat itsestaan, ja suljettu sisalto loytyy yha selaimen omalla
 * haulla.
 *
 * KYSYMYKSIA KARSITTIIN 17 -> 10. Seitseman vastasi asiaan joka on jo
 * sanottu muualla sivulla, ja pitka lista lukee itsessaan
 * epavarmuutena: mita enemman kysymyksia, sita enemman selittelya.
 * Karsitut sailyvat faq.tsx:ssa, joten FAQPage-merkinta ei koydy.
 */
const UKK_KYSYMYKSET = [
  "Paljonko verkkosivut maksavat yritykselle?",
  "Mitä verkkosivujen hinta sisältää?",
  "Kuinka nopeasti verkkosivut valmistuvat?",
  "Onko pakko sitoutua kuukausimaksuun?",
  "Käytättekö WordPressiä?",
  "Voinko päivittää sisältöä itse?",
  "Kuka omistaa sivuston ja verkkotunnuksen?",
  "Tarvitseeko minulla olla valmiit tekstit ja kuvat?",
  "Voiko vanhat sivut uudistaa ilman että Google-näkyvyys katoaa?",
  "Teettekö myös verkkokaupan?",
];

export function Ukk() {
  const kaikki = FAQ_GROUPS.flatMap((g) => g.items);
  const nakyvat = UKK_KYSYMYKSET.map((q) => kaikki.find((it) => it.q === q)).filter(
    (it): it is NonNullable<typeof it> => Boolean(it),
  );

  return (
    <section id="ukk" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="qa rv">
          <div className="qa-side">
            <span className="kick">Usein kysyttyä</span>
            <h2>Usein kysytyt kysymykset verkkosivuista</h2>
            <p>
              Hinta, aikataulu, omistajuus ja ylläpito. Nämä kymmenen tulevat vastaan lähes joka
              projektissa.
            </p>
            {/* Yhteydenottonosto UKK:n SISALLA: tama on se kohta jossa
                viimeinen este poistuu, joten kehote kuuluu tanne eika
                vasta osion jalkeen. */}
            <div className="qa-ask">
              <span>Etkö löytänyt vastausta?</span>
              <a href="#tarjous">Kysy suoraan, vastaamme 24 tunnissa</a>
            </div>
          </div>
          <div className="qa-list">
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

/* ---------- Taustaa ---------- */
export function Taustaa() {
  return (
    <section id="kaytannossa">
      <div className="wrap-n">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Taustaa</span>
          <h2>Verkkosivut yritykselle käytännössä</h2>
        </div>
        <div className="prose rv">
          <h3>Mikä verkkosivuilla oikeasti ratkaisee</h3>
          <p>
            Verkkosivujen tehtävä on kolme asiaa tässä järjestyksessä: <strong>löytyä</strong>,{" "}
            <strong>vakuuttaa</strong> ja <strong>tehdä yhteydenotosta helppoa</strong>. Kaunis
            sivusto, jota kukaan ei löydä, ei tuota mitään. Löydettävä sivusto, joka ei vakuuta,
            menettää kävijän kymmenessä sekunnissa. Ja vakuuttava sivusto, jolta ei löydä
            yhteystietoja tai lomaketta, jättää kaupan tekemättä.
          </p>
          <p>
            Käytännössä tämä tarkoittaa, että sivusto suunnitellaan sisällöstä ulospäin eikä toisin
            päin. Ensin päätetään mitä sivuja tarvitaan ja millä hauilla ne pyrkivät näkymään, sitten
            kirjoitetaan tekstit, ja vasta lopuksi mietitään miltä kaikki näyttää. Kun järjestys on
            toinen, syntyy sivusto joka näyttää hyvältä mutta jää löytymättä.
          </p>

          <h3>Perussivusto vai räätälöity toteutus</h3>
          <p>
            Valmiiseen pohjaan rakennettu sivusto on alkuinvestointina edullisempi, koska valmis
            rakenne nopeuttaa työtä. Sen hinta maksetaan myöhemmin: raskaat teemat ja lisäosat
            lataavat omat tiedostonsa jokaisella sivunlatauksella, päivityksiä tulee jatkuvasti ja
            jokainen lisäosa on yksi tietoturvariski lisää.
          </p>
          <p>
            <strong>
              Käsin koodatussa toteutuksessa sivustolla on vain se koodi, jota oikeasti tarvitaan.
            </strong>{" "}
            Se näkyy latausajoissa, ylläpitotaakassa ja siinä, ettei ulkoasu muistuta muita samalla
            pohjalla tehtyjä sivustoja. Kumpikaan ei kuitenkaan nouse Googlessa itsestään, toteutustapa ratkaisee lähtötason, sisältö ratkaisee sijoituksen.
          </p>

          <h3>Miksi nopeus on osa hakukoneoptimointia</h3>
          <p>
            Google mittaa sivuston nopeutta oikeilta käyttäjiltä ja käyttää sitä yhtenä
            sijoitustekijänä. Suurempi vaikutus on kuitenkin epäsuora: hidas sivu saa kävijän
            palaamaan takaisin hakutuloksiin, ja se on hakukoneelle signaali siitä, ettei sivu
            vastannut kysymykseen. Mobiilissa ero on suurin, koska yhteys on epävakaampi ja
            kärsivällisyys lyhyempi.
          </p>

          <h3>Sivusto on markkinoinnin perusta, ei sen lopputulos</h3>
          <p>
            Lyhytvideot ja mainonta tuovat liikennettä, mutta liikenne päätyy aina samaan paikkaan:
            verkkosivuille. Jos sivusto on hidas tai epäselvä, koko mainosbudjetti valuu hukkaan
            viimeisellä metrillä. Siksi järjestys kannattaa pitää selvänä, ensin sivusto kuntoon,
            sitten liikennettä sen päälle.
          </p>
          <p>
            Käytännössä tämä on myös kustannuskysymys. Sama kuvausmateriaali, joka kuvataan{" "}
            <SmartLink href="/lyhytvideot">lyhytvideoita</SmartLink> varten, toimii sellaisenaan
            sivuston etusivulla ja palvelusivuilla. Kun sisältö, sivusto ja mainonta tulevat samalta
            tiimiltä, mitään ei tarvitse tehdä kahteen kertaan.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Blogi ---------- */
const POSTS = [
  ["Opas", "Verkkosivujen hinta, mistä nettisivujen hinta oikeasti muodostuu"],
  ["Vertailu", "WordPress vai räätälöidyt verkkosivut? Näin valitset yritykselle"],
  ["Hakukoneoptimointi", "Hakukoneoptimoidut verkkosivut, mitä niissä kannattaa oikeasti tehdä"],
  ["Sivustouudistus", "Sivustouudistus ilman että Google-näkyvyys katoaa"],
];

export function Blogi() {
  return (
    <section id="blogi" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="hsplit rv">
          <div>
            <span className="kick">Blogi</span>
            <h2>Lue lisää verkkosivuista</h2>
          </div>
          <p className="sub">
            Käymme läpi ne kysymykset, jotka tulevat vastaan ennen tarjouspyyntöä.
          </p>
        </div>
        <div className="postrows rv">
          {POSTS.map(([tag, title]) => (
            <a href="#" key={title}>
              <span>{tag}</span>
              <b>{title}</b>
              <i>→</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Tarjous ---------- */
const FLIST = [
  ["Vastaus 24 tunnin sisällä", "Arkipäivisin useimmiten samana päivänä."],
  ["Kiinteä hinta ennen aloitusta", "Näet mitä hintaan sisältyy, ei piilokuluja eikä aloitusmaksuja."],
  ["Et tarvitse mitään valmiiksi", "Sisältö, tekstit ja rakenne suunnitellaan yhdessä kartoituksessa."],
  ["Ei sitoutumista", "Tarjouspyyntö ei velvoita mihinkään."],
];

export function Tarjous() {
  return (
    <section id="tarjous" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="formsplit">
          <div className="rv" data-par="0.02">
            <span className="kick">Tarjous</span>
            <h2 style={{ marginTop: "12px" }}>Pyydä tarjous verkkosivuista</h2>
            <p className="lead">
              Kerro lyhyesti mitä yritys tekee ja millainen sivusto on mielessä. Saat
              kiinteähintaisen tarjouksen 24 tunnin sisällä, eikä yhteydenotto sido sinua mihinkään.
            </p>
            <ul className="flist">
              {FLIST.map(([h, s]) => (
                <li key={h}>
                  {h}
                  <s>{s}</s>
                </li>
              ))}
            </ul>

            {/* MITA LAHETYKSEN JALKEEN TAPAHTUU. Lomakkeen viereen ei
                kuulu lisaa myyntia vaan se mita nappi tekee: kynnys ei
                ole napin vari vaan epavarmuus siita mihin sitoutuu.
                Sama kolmen askeleen rakenne kuin lyhytvideosivulla. */}
            <ol className="next3 stagger">
              <li className="rv" style={i(0)}>
                <b>24 h</b>
                <span>Luemme viestin ja vastaamme sähköpostilla arkipäivän sisällä.</span>
              </li>
              <li className="rv" style={i(1)}>
                <b>30 min</b>
                <span>Puhelu tai etäpalaveri: tavoite, sivurakenne ja aikataulu.</span>
              </li>
              <li className="rv" style={i(2)}>
                <b>Tarjous</b>
                <span>Kiinteähintainen ehdotus. Ei sitoumuksia ennen hyväksyntää.</span>
              </li>
            </ol>
          </div>

          <BudgetForm
            budgetLabel="Projektin budjetti"
            messageLabel="Millainen sivusto on mielessä? Uudet sivut, uudistus vai verkkokauppa?"
            extraField={{ id: "nyk", label: "Nykyiset verkkosivut (jos on)", placeholder: "esimerkki.fi" }}
            min={500}
            max={20000}
            initial={3000}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Loppu-CTA ---------- */
export function Loppu() {
  return (
    <section style={{ paddingTop: "20px" }}>
      <div className="closer rv">
        <div>
          <h2>
            Valmis uudistamaan <span style={{ color: "#6fecff" }}>verkkosivusi?</span>
          </h2>
          <p>
            Varaa maksuton 30 minuutin kartoitus. Käymme läpi nykyisen sivuston, kilpailijoiden
            näkyvyyden ja sen, mitä kannattaa tehdä ensin.
          </p>
        </div>
        <div>
          <a className="btn mag" href="#tarjous">
            Varaa maksuton kartoitus
          </a>
          <p className="cnote">Ei sitoumuksia</p>
        </div>
      </div>
    </section>
  );
}
