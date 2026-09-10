import Image from "next/image";

import { RefGrid } from "../../components/RefCards";

import Cta from "./Cta";
import MediaBand, { MediaBandRow } from "./MediaBand";
import SmartLink from "../../components/SmartLink";

import type { CSSProperties, ReactNode } from "react";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ============ MIKSI LYHYTVIDEOT ============ */
/* art nimeaa kortin oman grafiikan. Se kulkee KORTIN MUKANA eika
   jarjestysnumerossa: aiemmin paneeli valittiin listan indeksilla,
   jolloin korttien jarjestyksen vaihtaminen olisi jattanyt grafiikat
   paikoilleen ja pari olisi menneet ristiin. */
const REASONS = [
  {
    art: "hook",
    h: "Ensimmäiset kolme sekuntia ratkaisevat",
    p: "Koukku, rytmi ja leikkauspisteet määrittävät katseluajan. Rakennamme jokaisen videon aloituksen niin, että skrollaus pysähtyy.",
  },
  {
    art: "channels",
    h: "Yksi kuvauspäivä, useita kanavia",
    p: "Samasta kuvauspäivästä syntyy sisältö TikTokiin, Reelsiin, Shortsiin ja LinkedIniin. Tuotantokustannus jakautuu monelle kanavalle.",
  },
  {
    art: "funnel",
    h: "Sisältö, joka tekee myös kauppaa",
    p: "Näyttökerrat ovat välitavoite. Ohjaamme katsojan verkkosivuille, yhteydenottolomakkeelle tai myymälään, ja mittaamme mitä siitä seuraa.",
  },
  {
    art: "reach",
    h: "Orgaaninen näkyvyys ilman mainosbudjettia",
    p: "Lyhytvideoiden algoritmi jakaa sisältöä kiinnostuksen, ei seuraajamäärän mukaan. Uusi tili voi tavoittaa saman yleisön kuin vakiintunut brändi.",
  },
];

/**
 * Kavijatietonakyma ensimmaisessa kortissa.
 *
 * NAKYMA ON TAUSTA JA TEKSTI SEN PAALLA. Luettavuus tulee tekstin
 * omasta valkoisesta kehasta (globals.css: .whycard-art h3/p
 * text-shadow), ei nakyman vaimentamisesta. Aiemmat yritykset
 * kaatuivat siihen etta molempia yritettiin saataa yhdesta arvosta:
 * opacity joutui palvelemaan seka nakyvyytta etta luettavuutta, eika
 * voinut riittaa kumpaankaan. Nyt niilla on omat saatonsa, joten
 * nakyma saa olla vahva ja teksti silti terava.
 *
 * VAIN YKSI LUKU, JA SE ON PYORISTETTY. Mallikuvan 3 115 848 ja
 * 93,2 % ovat tuntemattoman tilin lukuja. Kayrä on muoto ilman
 * asteikkoa: se nayttaa nousun vaittamatta sen suuruutta.
 */
function ReachPanel() {
  return (
    <div className="whypanel" aria-hidden="true">
      {/* Luku ylanurkkaan ilman laatikkoa: kortti lyheni numeromerkkien
          poiston myota, ja umpinainen laatikko olisi leikannut otsikon
          poikki. Pelkkana tekstina se on osa taustaa. */}
      <div className="wp-tile">
        <span>Katselukerrat</span>
        <b>1&#160;000&#160;000+</b>
      </div>
      <div className="wp-strip">
        {/* preserveAspectRatio="none": kayrä on kuvitus jonka on
            venyttava kaistan mittoihin, ei kaavio jonka mittasuhteet
            tarkoittaisivat jotain. */}
        <svg className="wp-chart" viewBox="0 0 300 60" preserveAspectRatio="none" focusable="false">
          <path className="wp-grid" d="M0 57H300" />
          {/* Asteittain nouseva, ei yhta piikkia: pohjataso nousee
              56:sta 20:een ja huiput 50:sta 4:aan, eli seka huiput
              etta niiden valit kasvavat. Yksi piikki olisi kertonut
              onnenkantamoisesta. */}
          <path
            className="wp-line"
            d="M0 56 12 55 24 54 36 55 48 52 60 53 72 50 84 46 96 50 108 43 120 40 132 45 144 36 156 31 168 38 180 28 192 22 204 29 216 19 228 13 240 21 252 11 264 6 276 15 288 8 300 4"
          />
        </svg>
        <span className="wp-from">16.6.</span>
        <span className="wp-to">14.8.</span>
      </div>
    </div>
  );
}

/**
 * Pysyvyyskayrä toisen kortin taustana.
 *
 * Sama rakenne ja samat tyylit kuin muissa korteissa - luku
 * ylanurkassa, kuvio alakaistalla, teksti valkoisen kehan takana -
 * jotta kortit lukevat sarjana eivatka neljana eri ideana.
 *
 * Kayrä NAYTTAA PYSYVYYDEN, EI SEN MENETTAMISTA. Aiempi versio
 * romahti heti alussa, eli se kuvasi ongelmaa: katsojat lahtevat. Se
 * luki vaarana lupauksena myyntisivulla, jonka kortin nimi on
 * "Pysyvyys 0:30". Nyt kayrä lahtee 100 %:sta, ohittaa kolmen sekunnin
 * merkin ilman pudotusta ja laskee loivasti koko keston yli - eli
 * koukku piti ja katsojat jaivat.
 *
 * Kolmen sekunnin merkki jaa paikalleen ja saa uuden roolin: se ei ole
 * enaa kohta jossa kayrä romahtaa vaan kohta jonka kayrä selvittaa.
 * Juuri sita otsikko lupaa.
 *
 * 3 SEKUNNIN MERKKI ON LASKETTU. Aika-akseli on 0:00-0:30 ja viewBoxin
 * leveys 300, joten yksi sekunti on 10 yksikkoa ja kolmen sekunnin
 * kohta on x = 30. Merkki ei siis ole sijoitettu silmalla vaan se
 * osoittaa tasan siihen kohtaan josta otsikko puhuu.
 *
 * EI KEKSITTYJA LUKUJA. Akselilla on vain kellonaika, ja kayrän muoto
 * on yleisesti tunnettu ilmio eika WS Median mittaus.
 */
function HookPanel() {
  return (
    <div className="whypanel" aria-hidden="true">
      <div className="wp-tile">
        <span>Pysyvyys</span>
        <b>0:30</b>
      </div>
      <div className="wp-strip">
        <svg className="wp-chart" viewBox="0 0 300 60" preserveAspectRatio="none" focusable="false">
          <path className="wp-grid" d="M0 5H300M0 31H300M0 57H300" />
          {/* Katkoviiva kolmen sekunnin kohdalle: 3 s x 10 yksikkoa. */}
          <path className="wp-mark" d="M30 3V57" />
          {/* Loiva, tasainen lasku: 100 %:sta noin puoleen koko keston
              aikana, ilman romahdusta missaan kohtaa. Kuutiokayrät eika
              murtoviiva, koska pysyvyyskayrä on jatkuva eika
              mittauspisteita ole. */}
          <path
            className="wp-line"
            d="M0 5C20 5 40 7 60 9C110 14 160 19 210 23C245 26 275 28 300 30"
          />
        </svg>
        <span className="wp-from">0:00</span>
        <span className="wp-mid">3 s</span>
        <span className="wp-to">0:30</span>
      </div>
    </div>
  );
}

/**
 * Kanavapylvaat kolmannen kortin taustana.
 *
 * TOINEN VERSIO. Ensimmainen oli vaakapalkkeja ilman ruudukkoa ja
 * akselia, ja juuri se oli vika: kaksi ensimmaista korttia ovat
 * kaavioita kehyksineen, joten kehyksettomat palkit lukivat eri
 * kuvakielella samassa rivissa. Nyt muoto on pylvaskaavio - ruudukko,
 * pohjaviiva ja nimet akselilla - eli sama kehys kuin kayrillä, mutta
 * eri kaaviotyyppi.
 *
 * HTML EIKA SVG. Pylvaissa on pyoristetyt paat ja akselilla tekstia,
 * ja kaistan svg:t venytetaan preserveAspectRatio="none":lla, mika
 * olisi vaantanyt seka pyoristykset etta kirjaimet leveyssuunnassa.
 *
 * KORKEUDET EIVAT OLE MITTAUS. Ne on porrastettu vain jotta rivi ei
 * lue neljana identtisena pylvaana; siksi mukana ei ole
 * arvoasteikkoa, joka tekisi niista vaitteen.
 */
function ChannelPanel() {
  const BARS = [
    { n: "TikTok", h: 100 },
    { n: "Reels", h: 86 },
    { n: "Shorts", h: 72 },
    { n: "LinkedIn", h: 45 },
  ];
  return (
    <div className="whypanel" aria-hidden="true">
      <div className="wp-tile">
        <span>Kanavat</span>
        <b>4</b>
      </div>
      <div className="wp-strip wp-ruled">
        <div className="wp-cols">
          {BARS.map((b) => (
            <s key={b.n}>
              <u style={{ height: b.h + "%" }} />
            </s>
          ))}
        </div>
        <div className="wp-axis4">
          {BARS.map((b) => (
            <span key={b.n}>{b.n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Kaksi kayrää neljannen kortin taustana.
 *
 * TOINEN VERSIO. Ensimmainen oli suppilo, ja se oli seka
 * kehyksettoman etta liian lahella kolmannen kortin palkkeja - kaksi
 * vierekkaista korttia lukivat saman kuvan kahtena kappaleena.
 *
 * Nyt kortti sanoo asiansa kahdella kayrällä: harmaa on nayttokerrat
 * ja sininen se mita niista seuraa. Sininen kulkee harmaan alapuolella
 * ja nousee sen mukana, mika on tasan kortin vaite - nayttokerrat ovat
 * valitavoite ja mitattava asia on alempi kayrä.
 *
 * Ero ensimmaiseen korttiin on VARI JA PARI, ei muoto: siella yksi
 * magenta kayrä, taalla harmaa ja sininen pari. Kaksi samanlaista
 * yksittaista kayrää samassa ruudukossa olisi lukenut toistona.
 */
function FunnelPanel() {
  return (
    <div className="whypanel" aria-hidden="true">
      <div className="wp-tile">
        <span>Yhteydenotot</span>
        <b>Mitattu</b>
      </div>
      <div className="wp-strip">
        <svg className="wp-chart" viewBox="0 0 300 60" preserveAspectRatio="none" focusable="false">
          <path className="wp-grid" d="M0 5H300M0 31H300M0 57H300" />
          {/* Ylempi: nayttokerrat. */}
          <path
            className="wp-line2"
            d="M0 47 25 44 50 45 75 38 100 34 125 36 150 28 175 22 200 25 225 16 250 11 275 13 300 6"
          />
          {/* Alempi: yhteydenotot. Seuraa samaa nousua mutta jaa
              alemmas - suhde on se mita kortti kuvaa, ei etaisyys. */}
          <path
            className="wp-line3"
            d="M0 55 25 54 50 54 75 51 100 50 125 51 150 47 175 44 200 45 225 40 250 37 275 38 300 33"
          />
        </svg>
        <span className="wp-from">
          <i className="k2" />
          Näyttökerrat
        </span>
        <span className="wp-to">
          <i className="k3" />
          Yhteydenotot
        </span>
      </div>
    </div>
  );
}

export function Miksi() {
  return (
    <section id="miksi" style={{ paddingTop: "90px" }}>
      <div className="wrap">
        {/* KAHTEEN PALSTAAN: vaite vasemmalle, kuva oikealle.
            Kuvassa ovat juuri ne kaksi alustaa joista otsikko puhuu, eli
            se ei ole koriste vaan nayttaa mista on kyse ennen kuin
            lukija paasee perusteluihin. */}
        <div className="miksi-split stagger">
          <div className="shead rv" style={i(0)} data-par="0.03">
            <h2 className="big">
              Lyhytvideot ovat pk-yrityksen kustannustehokkain tapa tulla löydetyksi.
            </h2>
            <p className="sub">
              TikTokissa, Instagram Reelsissä ja YouTube Shortsissa näkyvyys ei enää seuraa
              seuraajamäärää vaan sisällön laatua. Se on pienen yrityksen etu: jos sisältö on
              tehty oikein.
            </p>
          </div>
          {/* sizes kertoo selaimelle todellisen naytettavan leveyden, jotta
              next/image ei lataa isompaa varianttia kuin tarvitaan.
              590px on MITATTU arvo: 1727px:n nakymassa palsta on 584px.
              Kapealla naytolla kuva on koko leveydelta. */}
          {/* data-tilt="-y": oikea reuna tulee katsojaa kohti eli
              ULKOREUNA, ja kuvan sisareuna painuu taaksepain. Kuva
              avautuu siis nakymaan sivun reunasta eika keskilinjasta.
              Profiili "mockup" antaa 13 asteen
              sivuttaiskulman ja 5 asteen taaksepain-kallistuksen, mika
              on iso pinnalle sopivampi kuin puhelinparin 19 astetta.
              Kulma tulee SiteEffectsista ja seuraa kuvan etaisyytta
              nakyman keskelta, eli kaanto purkautuu samaa rataa
              takaisin ylospain vieritettaessa. */}
          {/* EI data-par. Parallaksi kirjoittaa style.translaten suoraan
              elementtiin, ja translate kantaa nyt paljastuksen - inline-tyyli
              voittaa aina CSS-saannon, joten sivulta tuleva ilmestys ei olisi
              nakynyt lainkaan. Mitattuna kuvan translate oli parallaksin
              arvo (0 16,9px) eika paljastuksen (36px 0). Kuvalla on jo
              vierintaan sidottu kaanto, joten yksi liikejarjestelma riittaa. */}
            <figure className="miksi-kuva rv" style={i(1)} data-tilt="-y" data-tilt-profile="mockup">
            <Image
              src="/lyhytvideot/reels-tiktok-puhelimet.webp"
              alt="Kaksi puhelinta vierekkäin, näytöillä Instagram Reelsin ja TikTokin tunnukset"
              width={1200}
              height={675}
              sizes="(max-width: 900px) 92vw, 590px"
            />
          </figure>
        </div>
        {/* KORTIT, EI PELKKIA VIIVOJA.
            Osion takana kulkee verkostokuvio, ja pelkalla hiusviivalla
            erotettu leipateksti luki suoraan sen paalla: viivat ja
            pisteet kulkivat kirjainten lapi. Kortti tuo tekstin alle
            oman pinnan, jolloin kuvio jaa sen taakse ja lukeminen on
            taas rauhallista. Sama syy miksi etusivun palvelupaneeleilla
            on levy metallikuvion paalla. */}
        <div className="whygrid stagger">
          {REASONS.map((r, n) => (
            <div className="whycard whycard-art rv" style={i(n)} key={r.h}>
              {r.art === "reach" ? (
                <ReachPanel />
              ) : r.art === "channels" ? (
                <ChannelPanel />
              ) : r.art === "hook" ? (
                <HookPanel />
              ) : (
                <FunnelPanel />
              )}
              <h3>{r.h}</h3>
              <p>{r.p}</p>
            </div>
          ))}
        </div>
        <div className="whycta rv" style={i(4)}>
          {/* Sama sanamuoto kuin muilla palvelusivuilla ("maksuton",
              ei "ilmainen"): sama tarjous ei saa esiintya kahdella
              nimella, tai lukija olettaa niiden olevan eri asioita.
              Kohde on #tarjous eli taman sivun oma lomake. */}
          <a className="btn mag" href="#tarjous">
            Varaa maksuton kartoitus
          </a>
          <span>30 minuuttia, ei sitoumuksia</span>
        </div>
      </div>
    </section>
  );
}

/* ============ ALUSTAT ============ */
const PLATFORMS = [
  {
    href: "/lyhytvideot/tiktok",
    mark: "tiktok" as const,
    h: "TikTok-videot yritykselle",
    p: "Nopein kanava tavoittaa uusi yleisö nollasta. Toimii, kun sisältö on aitoa, rytmikästä ja puhuu katsojan kielellä, ei mainospuhetta.",
    link: "TikTok-videotuotanto",
  },
  {
    href: "/lyhytvideot/instagram-reels",
    mark: "instagram" as const,
    h: "Instagram Reels yritykselle",
    p: "Laajin ikäjakauma ja vahvin ostopolku Suomessa. Reels tuo uudet katsojat, feed ja tarinat hoitavat luottamuksen rakentamisen.",
    link: "Reels-tuotanto",
  },
  {
    href: "/lyhytvideot/youtube-shorts",
    mark: "youtube" as const,
    h: "YouTube Shorts yritykselle",
    p: "Shorts tuo uudet katsojat kanavalle ja pidemmät videot syventävät asiantuntijuutta. Sisältö löytyy myös haulla vielä kuukausien päästä.",
    link: "Shorts-tuotanto",
  },
];

export function Alustat() {
  return (
    <section id="alustat" className="bandsec">
      <div className="wrap">
        {/* KUVAN RAJAUS ON LASKETTU LAHDEKUVAN PIKSELEISTA.
            Mittasin varialueiden rajat: Shorts-tunnus on 79,8-91,7 %:n
            kohdalla ja kasvot 50-62 %:n. Reunaehdot ovat kasvojen
            vasen reuna >= tekstin oikea reuna (818px) ja Shortsin
            oikea reuna <= nauhan oikea reuna (1727px), mika antaa
            leveydelle valin 95-109 %. 105 % on siita keskivaiheilta.
            Pystysuunta 24 %: paalaki jaa nakyviin 11px:n varalla. */}
        <MediaBand
          src="/lyhytvideot/kanavat-haastattelu.webp"
          alt="Kuvaustilanne: haastateltava puhuu kameralle kolmijalan takaa kuvattuna"
          imgWidth={108}
          imgPosition="50% 0%"
          imgSize={[2880, 1628]}
          drift={0.028}
          title="TikTok, Instagram Reels vai YouTube Shorts?"
          sub="Vastaus on yleensä kaikki kolme. Sama kuvausmateriaali leikataan ja optimoidaan jokaiselle kanavalle erikseen, koska yleisö, kesto ja algoritmi eroavat toisistaan."
        >
          {PLATFORMS.map((p, n) => (
            <MediaBandRow key={p.href} i={n} href={p.href} title={p.h} text={p.p} link={p.link} />
          ))}
        </MediaBand>
      </div>
    </section>
  );
}

/* ============ SUPPILO ============ */
/* KOLMAS NAUHA. Sisalto vasemmalla kuten Kanavissa, koska Prosessi
   valissa on oikealla: vuorottelu pitaa silman liikkeessa. Lista on
   kolmas variantti (yliotsikko + korostuspalkki), silla kaksi
   samanlaista listaa perakkain lukisi yhtena osiona.

   KUVAN RAJAUS ON LASKETTU LAHDEKUVAN PIKSELEISTA. Mittasin valkoisen
   dashboardin: se on 27,5-66,7 %:n kohdalla ja miehen paa 63,7-78,4
   %:n. Tekstipaneeli peittaa 0-898px. 120 %:n leveydella dashboard on
   570-1382px, eli sen oikea puolisko (Engagement Rate ja Conversions)
   jaa kokonaan vapaaseen kaistaan ja mies mahtuu kuvaan; oikeasta
   reunasta leikkautuu vain sohva ja muki. */
const KETJU = [
  {
    over: "Brändiarvo",
    h: "Lyhytvideot",
    p: "Orgaaninen näkyvyys TikTokissa, Reelsissä ja Shortsissa. Ihmiset oppivat kuka olet ja mitä teet jo ennen kuin heillä on tarve.",
  },
  {
    over: "Kysyntä",
    h: "Meta-mainonta",
    p: "Parhaiten orgaanisesti toimineet videot viedään Facebook- ja Instagram-mainonnaksi. Sisältö on jo todistettu yleisöllä, joten mainoseuro menee toistoihin ja kohdennukseen.",
  },
  {
    over: "Liidit",
    h: "Hakukoneoptimointi",
    p: "Video luo kysynnän, hakukone korjaa sadon. Kun ostaja googlaa palveluasi, hakukoneoptimoitu sivusto vie hänet yhteydenottolomakkeelle. Tuottaa liikennettä myös silloin, kun videot eivät pyöri.",
  },
];

export function Kokonaisuus() {
  return (
    <section id="kokonaisuus" className="bandsec">
      <div className="wrap">
        <MediaBand
          src="/lyhytvideot/kokonaisuus-data.webp"
          alt="Sisällöntuottaja tarkastelee näytöltä lyhytvideoiden katselukertoja, sitoutumista ja konversioita"
          imgWidth={126}
          imgPosition="50% 25%"
          imgSize={[2688, 1520]}
          drift={0.028}
          listVariant="cols"
          title="Lyhytvideo rakentaa brändin. Mainonta ja haku tuovat liidit."
          sub="Orgaaninen lyhytvideo tekee yrityksestäsi tunnetun ja luotettavan. Tunnettuus ei silti yksin täytä kalenteria, joten rakennamme sen rinnalle kaksi kanavaa, jotka muuttavat huomion yhteydenotoiksi."
          after={<Cta kind="kartoitus" secondary />}
        >
          {KETJU.map((k, n) => (
            <MediaBandRow key={k.h} i={n} over={k.over} title={k.h} text={k.p} />
          ))}
          <p className="mband-note">
            Molemmat kanavat päättyvät samaan paikkaan:{" "}
            <SmartLink href="/verkkosivut">verkkosivullesi</SmartLink>. Siksi sivuston nopeus,
            selkeys ja yhteydenoton helppous ratkaisevat lopulta koko ketjun tuloksen. Paraskaan
            video ei pelasta sivustoa, joka ei muuta kävijää yhteydenotoksi.
          </p>
        </MediaBand>
      </div>
    </section>
  );
}

/* ============ PROSESSI ============ */
const STEPS = [
  {
    h: "Aloituspalaveri",
    p: "Käydään läpi tavoitteet, kohderyhmä ja kanavat. Saat konkreettisen sisältösuunnitelman ja hinnan ennen kuin mitään sovitaan.",
  },
  {
    h: "Ideointi ja käsikirjoitus",
    p: "Rakennamme kuukauden sisällöt teemoiksi ja kirjoitamme käsikirjoitukset. Hyväksyt ne ennen kuvauspäivää.",
  },
  {
    h: "Kuvauspäivä",
    p: "Kuvaamme sinun tiloissasi tai sovitussa paikassa. Yhdestä päivästä syntyy tyypillisesti [X] lyhytvideota.",
  },
  {
    h: "Editointi ja julkaisu",
    p: "Leikkaus, tekstitykset ja alustakohtainen optimointi. Julkaisemme sovitusti tai toimitamme videot julkaisuvalmiina.",
  },
];

export function Prosessi() {
  return (
    <section id="prosessi" className="bandsec">
      <div className="wrap">
        {/* KUVAN RAJAUS ON LASKETTU LAHDEKUVAN PIKSELEISTA.
            Mittasin aikajanan turkoosin aaltomuodon: se on 47,1-66,8 %:n
            kohdalla, ja kamera poydalla 84,2-94,7 %:n. Reunaehdot ovat
            aaltomuodon vasen reuna >= tekstin oikea reuna (818px) ja
            kameran oikea reuna <= nauhan oikea reuna (1727px), mika
            antaa leveydelle valin 101-105 %. 104 % jattaa kameralle
            26px reunaan.

            SISALTO OIKEALLE JA KUVA PEILATTUNA. Ensimmaisessa nauhassa
            sisalto on vasemmalla, joten tama kaannetaan - muuten kolme
            perakkaista nauhaa lukisi samana asetteluna kolmesti.

            Kaannetyssa asettelussa vapaa alue on vasemmalla (0-909px),
            mutta lahdekuvan naytto on 47,1-66,8 %:n kohdalla eli
            oikealla. Sen siirtaminen vasemmalle rajaamalla olisi
            vaatinut noin 157 %:n zoomin, jolloin kuvasta olisi jaanyt
            jaljelle vain murto-osa. Peilattuna naytto on 33,2-52,9 %:n
            kohdalla eli 573-913px, joka mahtuu vapaaseen alueeseen
            ilman zoomia (100 %).

            Peilaus on tassa turvallinen: kuvassa ei ole luettavaa
            tekstia eika tunnistettavaa logoa. Kannettavan
            kayttoliittyman tekstit ovat naytettavassa koossa muutaman
            pikselin korkuisia, eli niita ei lue kumpaankaan suuntaan.

            Kuvaajan pää ja selka ovat peilattuna 60-89 %:n kohdalla eli
            sisallon alla, ja se on tarkoitus: hanet on kuvattu takaa,
            joten kuvan kohde on naytto eika henkilo. */}
        <MediaBand
          src="/lyhytvideot/prosessi-leikkaus.webp"
          alt="Editoija leikkaa lyhytvideota kannettavalla, aikajanalla näkyy ääniraita ja pystyvideon esikatselu"
          imgWidth={100}
          imgPosition="50% 70%"
          imgSize={[2205, 1520]}
          drift={-0.028}
          flip
          listVariant="steps"
          title="Näin lyhytvideotuotanto etenee."
          sub="Ensimmäisestä puhelusta valmiisiin videoihin tyypillisesti [X] arkipäivää. Sinun aikaasi kuluu noin [X] tuntia kuukaudessa."
        >
          {STEPS.map((t, n) => (
            <MediaBandRow key={t.h} i={n} title={t.h} text={t.p} />
          ))}
        </MediaBand>
      </div>
    </section>
  );
}

/* ============ REFERENSSIT ============ */
/**
 * OIKEAT VIDEOT, EI PAIKKAMERKKEJA. Osio lupasi "naytamme mieluummin
 * kuin kerromme" ja naytti kolme tyhjaa korttia joissa luki
 * "Taytetaan". Lupaus ja sisalto olivat vastakkain. Samat viisi
 * asiakasvideota ovat jo etusivulla, joten kortit tuodaan sielta
 * sellaisenaan (../../components/RefCards).
 *
 * TAUSTA ON VALO, EI KUVIO. Etusivulla korttien takana on
 * metallikuvio, mutta se on sen osion oma tunnus eika toistu tanne;
 * lisaksi talla sivulla on jo oma taustakuvionsa (verkosto), ja kaksi
 * kuviota paallekkain lukisi sotkuna. Tilalle nayttamovalo: pehmea
 * keila korttirivin takana ja valaistu reuna sen alla. Se sanoo saman
 * asian - tassa on esitys - ilman toista kuviota.
 */
export function Tulokset() {
  return (
    <section id="tulokset" className="showcase">
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <h2>Näytämme mieluummin kuin kerromme.</h2>
          <p className="sub">
            Nämä ovat oikeita asiakastuotantoja. Vie osoitin kortin päälle tai napauta sitä, niin
            video käynnistyy.
          </p>
        </div>
        {/* Kortit EIVAT saa .rv-luokkaa: .rv.on kirjoittaa
            transform: none, joka voittaisi kaaren nth-child-saannot ja
            litistaisi rivin. Paljastus on siksi kaareessa. */}
        <div className="showstage rv">
          <RefGrid />
        </div>
        {/* Todisteiden JALKEEN suora tarjouspyynto: tahan asti lukija
            on saanut syyn, tavan ja tuloksen, joten kynnysta ei
            tarvitse enaa madaltaa kartoituksella. */}
        <Cta kind="tarjous" center />
      </div>
    </section>
  );
}
