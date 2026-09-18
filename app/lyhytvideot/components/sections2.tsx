import Image from "next/image";

import PlatformMark from "../../components/PlatformMark";
import SmartLink from "../../components/SmartLink";

import type { CSSProperties } from "react";
import { FAQ_GROUPS } from "../faq-data";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ============ HINNOITTELU ============ */
/**
 * KOLME KORTTIA EI VIELA OLE HINNOITTELUOSIO. Osio oli 1051px korkea
 * ilman yhtaan visuaalia, ja paketit erosivat toisistaan VAIN
 * tekstilla: jokaisen kortin lukeminen oli pakko tehda rivi rivilta
 * eika niita voinut verrata silmailemalla.
 *
 * KAKSI VISUAALISTA MITTARIA, JOTKA VOI VERRATA YHDELLA SILMAYKSELLA.
 * Maara kolmiportaisena palkkina ja kanavat alustatunnuksina. Nama
 * kaksi ovat ne joiden takia paketteja oikeasti vertaillaan; kaikki
 * muu on yksityiskohtaa jonka lukee vasta kun valinta on jo tehty.
 *
 * MITTARI ON SUHTEELLINEN, EI LUKUMAARA. Videoiden todellinen maara on
 * viela auki ([X]), ja jos palkkeja piirtaisi yhden per video, kuva
 * lupaisi luvun jota kukaan ei ole viela paattanyt. Kolme askelta
 * kertoo jarjestyksen ilman etta se vaittaa maaraa.
 *
 * NIMET OVAT ROOLEJA, EIVAT NUMEROITA. "[Paketti 1/2/3]" pakotti
 * lukemaan kuvauksen ennen kuin tiesi koskeeko paketti hanta. Nimi
 * joka kertoo tilanteen ("Aloitus", "Jatkuva") tunnistetaan ennen
 * ensimmaista ominaisuusriviä. Nama ovat ehdotuksia: vaihda vapaasti,
 * ne ovat yhdessa paikassa.
 *
 * SUOSITUIMMALLA ON PERUSTELU, EI VAIN TARRA. Skeptinen B2B-ostaja ei
 * luota tarraan; yksi lause siita KENELLE se sopii kestaa katseen.
 */
const PLANS = [
  {
    tag: "",
    name: "Aloitus",
    lv: 1,
    /** Montako alustatunnusta korostetaan. */
    kanavia: 1,
    kanavaTeksti: "Yksi kanava valintasi mukaan",
    forWhom: "Yrityksille, jotka aloittavat lyhytvideotuotannon.",
    features: [
      "[X] lyhytvideota kuukaudessa",
      "1 kuvauspäivä",
      "Käsikirjoitus, editointi ja tekstitys",
      "Optimointi 1 kanavalle",
      "Toimitus [X] arkipäivässä",
    ],
  },
  {
    tag: "Suosituin",
    name: "Jatkuva",
    lv: 2,
    kanavia: 3,
    kanavaTeksti: "TikTok, Reels ja Shorts",
    forWhom: "Yrityksille, jotka haluavat jatkuvaa näkyvyyttä.",
    peruste: "Yleisin valinta, kun tavoitteena on säännöllinen julkaisutahti.",
    lisaa: "Kaikki Aloitus-paketin sisältö, ja lisäksi:",
    features: [
      "[X] lyhytvideota kuukaudessa",
      "Monikanavainen optimointi",
      "Esiintyjä sovittaessa",
      "Julkaisu ja kuukausiraportti",
    ],
    pop: true,
  },
  {
    tag: "",
    name: "Täysi näkyvyys",
    lv: 3,
    kanavia: 3,
    linkedin: true,
    kanavaTeksti: "TikTok, Reels, Shorts ja LinkedIn",
    forWhom: "Yrityksille, jotka haluavat koko näkyvyyden kerralla.",
    lisaa: "Kaikki Jatkuva-paketin sisältö, ja lisäksi:",
    features: [
      "[X] lyhytvideota kuukaudessa",
      "[X] kuvauspäivää",
      "Meta-mainonnan hallinnointi",
      "Kuukausittainen strategiapalaveri",
    ],
  },
];

const MARKIT = ["instagram", "tiktok", "youtube"] as const;

export function Hinnoittelu() {
  return (
    <section id="hinnoittelu">
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <h2>Paljonko lyhytvideotuotanto maksaa?</h2>
          <p className="sub">
            Kiinteä kuukausihinta, ei aloitusmaksuja eikä pitkiä sopimuksia. Irtisanominen kuukausi
            kerrallaan.
          </p>
        </div>
        <div className="plans stagger">
          {PLANS.map((p, n) => (
            <div className={`card plan${p.pop ? " pop" : ""} rv`} style={i(n)} key={p.name}>
              <span className="pt">{p.tag}</span>
              <h3>{p.name}</h3>
              <p className="for">{p.forWhom}</p>

              {/* Kaksi mittaria: maara ja kanavat. aria-hidden, koska
                  sama tieto on ominaisuuslistassa sanoina - ruudunlukija
                  saisi muuten saman asian kahdesti. */}
              <div className="plan-viz" aria-hidden="true">
                <span className="plan-meter" data-lv={p.lv}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="plan-marks">
                  {MARKIT.map((m, k) => (
                    <PlatformMark
                      key={m}
                      id={m}
                      tone="line"
                      className={k < p.kanavia ? "on" : ""}
                    />
                  ))}
                  {p.linkedin ? <em>in</em> : null}
                </span>
                <s>{p.kanavaTeksti}</s>
              </div>

              <div className="price">
                [HINTA] <small>€/kk + alv</small>
              </div>
              {p.lisaa ? <p className="plan-lisaa">{p.lisaa}</p> : null}
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {p.peruste ? <p className="plan-peruste">{p.peruste}</p> : null}
              {/* Sama sanamuoto kuin muissa hintavaiheen kehotteissa.
                  "Pyyda suunnitelma" oli kolmas nimi samalle lomakkeelle,
                  ja kolme nimea saa lukijan arvailemaan vievatko ne eri
                  paikkoihin. */}
              <a className={p.pop ? "btn" : "btn alt"} href="#tarjous">
                Pyydä tarjous
              </a>
            </div>
          ))}
        </div>
        <p className="pricenote rv">
          Yksittäiset lyhytvideot ja kampanjatuotannot hinnoitellaan projekteina alkaen [HINTA] €.
          Katso myös{" "}
          <SmartLink href="/#ukk" className="tlink" style={{ fontSize: "12.5px" }}>
            usein kysytyt hintakysymykset
          </SmartLink>
        </p>
      </div>
    </section>
  );
}

/* ============ KENELLE ============ */
/**
 * LASIKORTIT POIS.
 *
 * Kaksi saman levyista, saman korkuista lasikorttia rinnakkain on se
 * yksittainen asia joka saa tumman osion nayttamaan generoidulta, ja
 * backdrop-filter on lisaksi tummalla pohjalla luettavuuden suurin
 * vihollinen: teksti kelluu sumealla pinnalla jolla ei ole omaa
 * kontrastia.
 *
 * TILALLE JAETUT RAJAT. Yksi ruudukko, jonka solut erottaa yksi
 * hiusviiva. Ei pyoristyksia, ei taustoja, ei sumennusta. Luettavuus
 * ei enaa nojaa korttien reunoihin vaan ruudukkoon, ja tumma tausta
 * lakkaa olemasta ongelma koska teksti on suoraan sivun pohjalla.
 *
 * EPASYMMETRIA ON TARKOITUS. Symmetria on toinen syy generoituun
 * ilmeeseen. "Sopii" saa 1,4-kertaisen leveyden ja taydet varit,
 * "ei sovi" kapeamman palstan ja himmennyksen - ei harmaamman varin
 * vaan pienemman opasiteetin, jolloin se lukee saman perheen
 * jasenena eika toisen luokan tekstina.
 */
const SOPII = [
  "Yrityksesi ei näy siellä missä asiakkaat viettävät aikansa",
  "Somekanavat ovat olemassa, mutta sisältöä ei ehdi tehdä",
  "Meta-mainonta on käynyt kalliiksi ja haluat orgaanista näkyvyyttä rinnalle",
  "Videoita on tehty itse, mutta katseluajat jäävät lyhyiksi",
];

const EI_SOVI = [
  {
    tilanne: "Etsit yhtä yksittäistä videota etkä jatkuvaa tuotantoa",
    suositus: "Kysy projektihinta, se on tähän järkevämpi",
  },
  {
    tilanne: "Odotat tuloksia jo ensimmäisestä kuukaudesta",
    suositus: "Käänne tulee tyypillisesti [X] kuukauden kohdalla",
  },
];

export function Kenelle() {
  return (
    <section id="kenelle" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <h2>Kenelle lyhytvideotuotanto sopii?</h2>
        </div>
        <div className="ledger rv">
          <div className="ledger-col">
            <h3>Sopii sinulle, jos</h3>
            <ul>
              {SOPII.map((t) => (
                <li key={t}>{t}</li>
              ))}
              <li>
                Haluat saman kumppanin hoitavan myös{" "}
                <SmartLink href="/verkkosivut">verkkosivut</SmartLink>, hakukoneoptimoinnin ja
                Meta-mainonnan
              </li>
            </ul>
          </div>
          <div className="ledger-col ledger-soft">
            <h3>Älä osta tätä, jos</h3>
            <ul>
              {EI_SOVI.map((e) => (
                <li key={e.tilanne}>
                  {e.tilanne}
                  <b>{e.suositus}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ PAIKKAKUNNAT ============ */
/**
 * KOLME LAATIKKOA POIS, TILALLE HAKEMISTO.
 *
 * Kolme rinnakkaista laatikkoa on sama generoitu muoto kuin kaksi
 * lasikorttia. Hakemisto ratkaisee kaksi asiaa kerralla: kaupunki on
 * oma rivinsa, joten oman kaupungin loytaa silmailemalla, ja rivin
 * oikeassa reunassa on metatieto joka kertoo mita se kaytannossa
 * tarkoittaa. Juuri metatietosarake tekee listasta hakemiston; ilman
 * sita se on yha pelkka linkkilista.
 *
 * VASEN PALSTA ON STICKY. Oikea palsta on pidempi kuin vasen, joten
 * otsikko jaa paikalleen kun hakemisto vierii ohi eika osion vasen
 * puoli jaa tyhjaksi. Ehto: yhdellakaan esivanhemmalla ei saa olla
 * overflow: hidden, tai sticky lakkaa toimimasta aanettomasti.
 */
const SLUGS: Record<string, string> = { Jyväskylä: "jyvaskyla" };
const slug = (city: string) => SLUGS[city] ?? city.toLowerCase();

const PAIKAT = [
  { c: "Espoo", meta: "Toimipiste" },
  { c: "Helsinki", meta: "Kuvauksia viikoittain" },
  { c: "Vantaa", meta: "Kuvauksia viikoittain" },
  { c: "Tampere", meta: "Päivän ajomatka" },
  { c: "Turku", meta: "Päivän ajomatka" },
  { c: "Lahti", meta: "Päivän ajomatka" },
  { c: "Pori", meta: "Päivän ajomatka" },
  { c: "Jyväskylä", meta: "Sovitusti" },
  { c: "Kuopio", meta: "Sovitusti" },
  { c: "Oulu", meta: "Sovitusti" },
  { c: "Joensuu", meta: "Sovitusti" },
  { c: "Vaasa", meta: "Sovitusti" },
];

export function Alueet() {
  return (
    <section id="alueet" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="dir rv">
          <div className="dir-side">
            {/* VALOKUVA ENNEN OTSIKKOA, EI SEN VIERESSA. Osion vaite on
                paikka, ja paikka on ainoa asia jota tekstilista ei voi
                todistaa: kaupunkien nimet ovat vain nimia kunnes joku
                on niissa kameran kanssa. Kuva on sticky-palstan sisalla,
                joten se seuraa otsikkoa eika jaa hakemiston ylaosaan. */}
            <div className="dir-shot">
              <Image
                src="/referenssit/ydr-autohuolto-case.webp"
                alt="Kuvauspäivä asiakkaan tiloissa"
                width={1000}
                height={563}
                sizes="(max-width: 900px) 100vw, 400px"
              />
            </div>
            <h2>Lyhytvideotuotantoa Espoosta koko Suomeen</h2>
            <p>
              Toimipisteemme on Espoossa ja kuvaamme päivittäin pääkaupunkiseudulla. Mitä kauempana
              olet, sitä enemmän kuvauspäivä vaatii sopimista, mutta mikään näistä ei ole este.
            </p>
            <p className="dir-note">
              Käsikirjoitus, editointi ja julkaisu toimivat etänä minne tahansa Suomessa.
            </p>
          </div>
          <div className="dir-list">
            {PAIKAT.map((p) => (
              <SmartLink href={`/lyhytvideot/${slug(p.c)}`} key={p.c}>
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

/* ============ UKK ============ */
/**
 * STICKY-PALSTA JA NATIIVI EKSKLUSIIVINEN HAITARI.
 *
 * KAKSI ONGELMAA YHDELLA RAKENTEELLA. Kysymyslista on kapea ja pitka,
 * jolloin osion vasen puoli jaa tyhjaksi - ja juuri tyhja puoli on se
 * mika lukee keskeneraisena. Sticky-palsta tayttaa sen sisallolla joka
 * on jo olemassa: otsikko, yksi lause ja yhteydenottonosto. Samalla
 * konversio siirtyy UKK:n SISALLE, eli siihen kohtaan jossa viimeinen
 * este poistuu.
 *
 * name-ATTRIBUUTTI TEKEE HAITARISTA EKSKLUSIIVISEN ILMAN JS:AA. Kun
 * kaikilla details-elementeilla on sama name, selain sulkee edellisen
 * kun seuraava avataan. Lista pysyy hallitun mittaisena, nappaimisto ja
 * ruudunlukija toimivat itsestaan, ja suljettu sisalto loytyy yha
 * selaimen omalla haulla. Ei yhtaan riviä tilanhallintaa.
 *
 * KYSYMYKSIA KARSITTIIN 17 -> 10. Seitseman kysymysta vastasi asiaan
 * joka on jo sanottu muualla sivulla (tekstitykset, kanavaversiot,
 * verkkosivut, hakukoneoptimointi), ja pitka lista lukee itsessaan
 * epavarmuutena: mita enemman kysymyksia, sita enemman selittelya.
 */
const UKK_KYSYMYKSET = [
  "Paljonko lyhytvideotuotanto maksaa?",
  "Kuinka nopeasti saan valmiit videot?",
  "Kuka omistaa valmiit videot?",
  "Kuinka monta lyhytvideota kannattaa julkaista kuukaudessa?",
  "Kuinka nopeasti lyhytvideot tuottavat tulosta?",
  "Meillä ei ole ketään kameran eteen. Mitä teemme?",
  "Missä kuvaukset tehdään?",
  "Kuinka paljon aikaani menee yhteistyöhön?",
  "Onko pakko sitoutua pitkäksi aikaa?",
  "Voitteko hoitaa myös julkaisun ja Meta-mainonnan?",
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
            <h2>Usein kysyttyä</h2>
            <p>
              Alla kymmenen kysymystä, jotka tulevat lähes jokaisessa aloituspalaverissa. Loput
              käydään läpi puhelussa.
            </p>
            <div className="qa-ask">
              <span>Etkö löytänyt vastausta?</span>
              <a href="#tarjous">Kysy suoraan</a>
            </div>
          </div>
          <div className="qa-list">
            {nakyvat.map((item, n) => (
              <details key={item.q} name="ukk" open={n === 0}>
                <summary>{item.q}</summary>
                <div className="a">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ JUOKSEVA TEKSTI ============ */
/**
 * PITKA SEO-TEKSTI, JOTA EI VOI POISTAA MUTTA JOTA EI MYOSKAAN LUETA.
 *
 * Osio oli 3509 merkkia juoksevaa tekstia ilman yhtaan pysahdyspaikkaa,
 * eli sivun raskain kohta. Sita ei voi poistaa: se on hakukonesisaltoa
 * ja se vastaa kysymyksiin joita ostaja oikeasti hakee. Ratkaisu on
 * siis luettavuus, ei lyhentaminen.
 *
 * KOLME MUUTOSTA.
 *
 * 1. Otsikot ovat kysymyksia. Lukija paattaa valiotsikoiden perusteella
 *    onko sisalto hanelle, joten otsikon on kerrottava mihin lohko
 *    vastaa. Samalla ne osuvat pitkan hannan hakuihin.
 *
 * 2. Kaksi ensimmaista lohkoa auki, loput <details>-elementissa.
 *    Google on sanonut etta UX-syista piilotettu sisalto saa tayden
 *    painoarvon, mutta kaytannon testit ovat ristiriitaisia - siksi
 *    piilotetaan JATKO eika alkua. Avainsanarikkain alku on aina
 *    nakyvissa, ja osion korkeus on silti hallinnassa.
 *
 * 3. Oma hillitty kaista. Konvertoiva kavija on jo poistunut CTA:n
 *    kautta ennen tata, joten teksti ei kilpaile konversiosta. Kapeampi
 *    mitta ja vaimeampi vari kertovat sen myos lukijalle.
 *
 * NATIIVI <details>, EI JS-TOGGLEA. Selain hoitaa tilan, nappaimiston ja
 * ruudunlukijan ilman yhtaan riviä skriptia, ja sisalto on DOM:ssa myos
 * suljettuna eli hakukone nakee sen.
 */
export function Kaytannossa() {
  return (
    <section id="kaytannossa" className="seosec">
      <div className="wrap-n">
        <div className="shead rv" data-par="0.03" style={{ marginBottom: "30px" }}>
          <h2>Lyhytvideotuotanto käytännössä</h2>
        </div>
        <div className="prose seoprose rv">
          <h3>Mitä lyhytvideotuotanto tarkoittaa käytännössä?</h3>
          <p>
            Lyhytvideotuotanto yrityksille tarkoittaa alle minuutin pituisten pystyvideoiden
            suunnittelua, kuvaamista ja editointia sosiaalisen median kanaviin. Käytännössä kyse on
            jatkuvasta tuotannosta: yksittäinen video ei muuta mitään, mutta säännöllinen
            julkaisutahti kerryttää katseluaikaa, ja katseluaika on se signaali, jonka perusteella
            TikTokin, Instagram Reelsin ja YouTube Shortsin algoritmit päättävät, kenelle sisältö
            näytetään.
          </p>
          <p>
            Tämä on myös syy siihen, miksi lyhytvideot ovat pk-yritykselle poikkeuksellisen edullinen
            kanava. Perinteisessä mainonnassa näkyvyys ostetaan budjetilla. Lyhytvideoissa se
            ansaitaan sisällöllä, ja koska algoritmi arvioi jokaisen videon erikseen, tuntemattoman
            yrityksen video voi levitä yhtä laajalle kuin vakiintuneen brändin. Maksettu mainonta ei
            häviä kuvasta, mutta sen rooli muuttuu: sitä käytetään vahvistamaan videoita, jotka ovat
            jo osoittautuneet toimiviksi orgaanisesti.
          </p>

          <h3>Mikä lyhytvideossa ratkaisee?</h3>
          <p>
            Kolme asiaa toistuu jokaisessa videossa, joka toimii. <strong>Koukku</strong> eli
            ensimmäiset kolme sekuntia, joiden aikana katsoja päättää, jatkaako.{" "}
            <strong>Rytmi</strong> eli leikkauspisteet, jotka pitävät katseen ruudussa loppuun asti.{" "}
            <strong>Selkeä lopetus</strong> eli se, mitä katsojan halutaan tekevän, sanottuna ääneen.
            Tekniikka, valo ja ääni ovat perusedellytyksiä, mutta ne eivät yksin pelasta videota,
            jonka aloitus ei pysäytä.
          </p>

          {/* Loput lohkot avautuvat pyydettaessa. Sisalto on DOM:ssa myos
              suljettuna, joten se ei katoa hakukoneelta. */}
          <details className="seomore">
            <summary>
              <span>Lue koko teksti</span>
            </summary>

            <h3>Kannattaako lyhytvideotuotanto ulkoistaa?</h3>
            <p>
              Itse tekeminen on halvinta silloin, kun yrityksessä on henkilö, jolla on sekä taito
              että aika pitää julkaisutahtia yllä kuukaudesta toiseen. Käytännössä juuri tahti on se,
              mikä katkeaa ensimmäisenä kiireisenä kuukautena, ja katkennut tahti nollaa kertyneen
              näkyvyyden nopeammin kuin sen rakentaminen kesti. Ulkoistamisen todellinen hyöty ei ole
              pelkkä tuotannon laatu vaan se, että sisältöä syntyy myös silloin, kun yrityksellä on
              kiire.
            </p>

            <h3>Miksi lyhytvideot eivät tuo liidejä suoraan?</h3>
            <p>
              Yleisin pettymys lyhytvideoihin syntyy siitä, että niiltä odotetaan väärää asiaa.
              Orgaaninen lyhytvideo on brändityökalu: se kasvattaa tunnettuutta, rakentaa luottamusta
              ja tekee yrityksestä tutun ennen kuin katsojalla on ostotarvetta. Se on arvokasta,
              mutta se ei näy suoraan viikkotason tarjouspyyntöinä, eikä pidäkään.
            </p>
            <p>
              Liidit syntyvät kahdesta muusta kanavasta, ja molemmat johtavat samaan paikkaan.{" "}
              <strong>Meta-mainonta</strong> ottaa videot, jotka ovat jo osoittautuneet toimiviksi
              orgaanisesti, ja vie ne maksettuna Facebookiin ja Instagramiin tarkalla kohdennuksella:
              mainoseuro menee toistoihin sen sijaan, että sillä testattaisiin mikä sisältö puree.
              Mainonnan tehtävä ei ole myydä somessa vaan{" "}
              <strong>ohjata liikenne verkkosivullesi, jossa konversio tapahtuu</strong>.{" "}
              <strong>Hakukoneoptimointi</strong> puolestaan poimii sen kysynnän, jonka video on
              luonut: kun ostaja lopulta hakee palvelua Googlesta, hän löytää sivustosi eikä
              kilpailijaa, ilman klikkikohtaista hintaa.
            </p>

            {/* Koko tekstin paatelma omana laatikkonaan. Se on ainoa
                kohta jonka lukija voi ottaa mukaansa, jos han lukee
                osiosta vain yhden asian. */}
            <p className="seonote">
              Ketju on kolmiosainen: video kasvattaa yleisöä ja tunnettuutta, Meta-mainonta ohjaa
              siitä syntyneen kiinnostuksen sivustolle, ja hakukoneoptimointi tuo lisäksi ne ostajat,
              jotka etsivät palvelua omatoimisesti. Konversio tapahtuu kaikissa tapauksissa
              verkkosivulla.
            </p>

            <h3>Missä WS Media kuvaa ja mitä muuta se tekee?</h3>
            <p>
              WS Media tuottaa lyhytvideot Espoosta ja kuvaa päivittäin pääkaupunkiseudulla. Koska
              teemme myös <SmartLink href="/verkkosivut">verkkosivut</SmartLink>,{" "}
              <SmartLink href="/hakukoneoptimointi">hakukoneoptimoinnin</SmartLink>, Meta-mainonnan ja{" "}
              <SmartLink href="/graafinen-suunnittelu">graafisen suunnittelun</SmartLink>, sama
              kuvausmateriaali palvelee somen lisäksi sivustoasi ja mainontaasi, ja viesti pysyy
              yhtenäisenä kanavasta riippumatta.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

/* ============ BLOGI ============ */
const POSTS = [
  { href: "/blogi/lyhytvideon-hinta", tag: "Hinnoittelu", title: "Paljonko lyhytvideo maksaa vuonna 2026?" },
  {
    href: "/blogi/miten-aloittaa-lyhytvideot",
    tag: "Opas",
    title: "Miten aloittaa lyhytvideoiden tekeminen yrityksessä?",
  },
  {
    href: "/blogi/tiktok-vai-instagram-reels",
    tag: "Vertailu",
    title: "TikTok vai Instagram Reels, kumpi kannattaa valita?",
  },
];

export function Blogi() {
  return (
    <section id="blogi" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03" style={{ marginBottom: "30px" }}>
          <h2>Lue lisää lyhytvideoista</h2>
        </div>
        <div className="postrows rv">
          {POSTS.map((p) => (
            <a href={p.href} key={p.href}>
              <span>{p.tag}</span>
              <b>{p.title}</b>
              <i>→</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
