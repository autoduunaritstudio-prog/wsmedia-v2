"use client";

import { useEffect } from "react";

import { easeOutCubic, formatCount, parseCount } from "./count-format";

/**
 * Sivun skrolli- ja osoitinsidonnaiset efektit yhdessä paikassa.
 *
 * Periaatteet:
 * - Yksi scroll-kuuntelija koko sivulle, rAF-tahdistettuna. Skrollin arvoa ei
 *   koskaan viedä Reactin stateen, joten yksikään skrollitikki ei aiheuta
 *   uudelleenrenderöintiä.
 * - Kaikki liike on koristetta: sisältö on DOM:issa ilman tätä komponenttia.
 * - prefers-reduced-motion pysäyttää parallaksin ja taustan scrubin, mutta
 *   jättää navin tilan ja lukupalkin toimimaan.
 */
export default function SiteEffects() {
  useEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const nav = document.getElementById("nav");
    const prog = document.getElementById("prog");

    /* ---------- metallitausta (etusivun kokeilu) ---------- */
    // Pelkkia transformeja: kaarilohkot ja valovyot ovat GPU-kiihdytettyja
    // kerroksia, joten koko sivun kokoinen tausta ei aiheuta
    // uudelleenpiirtoa framea kohden. Kohinakerros on staattinen eika
    // osallistu tahan lainkaan.
    // Paakerros ohjaa etenemaa; kaikkia kerroksia (myos tummaa varianttia)
    // ajetaan SAMASTA arvosta, jolloin ne ovat aina samassa vaiheessa eika
    // vaalean ja tumman alueen valiin synny hyppaysta kuviossa.
    const mbLayer = document.querySelector<HTMLElement>(".metalbd-v2:not(.metalbd-dark)");
    const mbLayers = Array.from(document.querySelectorAll<HTMLElement>(".metalbd-v2"));
    const mbA = document.querySelector<HTMLElement>(".metalbd-a");
    const mbB = document.querySelector<HTMLElement>(".metalbd-b");
    const mbSweep = document.querySelector<HTMLElement>(".metalbd-sweep");
    const mbFacetsAll = Array.from(document.querySelectorAll<HTMLElement>(".metalbd-facets"));
    const mbfAll = Array.from(document.querySelectorAll<SVGGElement>(".mbf-a, .mbf-b"));

    /* ---------- taustakuvio ---------- */
    const bdGrid = document.getElementById("bdGrid");
    const bdRing = document.getElementById("bdRing");
    const bdWave = document.getElementById("bdWave");
    const bdPaths = ["bdP1", "bdP2", "bdP3", "bdP4", "bdP5"].map((id) =>
      document.getElementById(id),
    );

    /* ---------- Palvelut-visuaalien 3D-kaanto ---------- */
    // Elementti on kallistettuna kun se on kaukana viewportin keskelta
    // (tulossa alhaalta TAI poistumassa ylhaalta) ja suorassa kun se on
    // keskella. Arvo lasketaan joka framessa suoraan sijainnista, joten
    // liike seuraa skrollia 1:1 molempiin suuntiin ilman CSS-transitionia -
    // transition viivastyttaisi arvoa ja veisi tasmallisyyden skrollin
    // kanssa. Kaanto ei ole kertaalleen laukeava sisaantulo vaan taysin
    // palautuva. Samalla asetetaan --tilt, jota varjot lukevat CSS:ssa.
    const tilts = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    const TILT_MAX = 19;         // puhelinparin sivuttaiskulma
    // Selainmockup ja tapahtumakortti ovat isoja pintoja, joilla sama 19
    // astetta nayttaa liialliselta. Niille oma, hillitympi sivuttaiskulma
    // ja lisaksi kevyt taaksepain-kallistus syvyysvaikutelmaksi.
    const TILT_MAX_MOCKUP = 13;  // .browser ja .event: rotateY
    const TILT_BACK_MAX = 5;     // .browser ja .event: rotateX, ylareuna taakse
    // Etaisyys viewportin keskelta (osuus vh:sta) jossa kulma on nollassa.
    // 0.5 = elementin keskikohta on ruudun ala- tai ylareunassa.
    const TILT_RANGE = 0.5;

    /* ---------- parallaksi ---------- */
    const pars = Array.from(
      document.querySelectorAll<HTMLElement>("[data-par]"),
    );

    /* ---------- asiakaslogonauha ---------- */
    // Nauha on kiinni scrollYn MUUTOKSESSA: siirtyma kasvaa suoraan
    // verrannollisena skrollin deltaan, joten alas skrollatessa rivi liikkuu
    // vasemmalle ja ylos skrollatessa oikealle - ja pysahtyy samalla
    // hetkella kuin skrollaus, ilman omaa ajastinta tai vaimennusta.
    //
    // Siirtyma kiedotaan yhden kopion levyisena. Kopiot ovat identtisia,
    // joten -copyW nayttaa tasmalleen samat pikselit kuin 0: silmukka on
    // saumaton kumpaankin suuntaan eika reunoihin jaa tyhjaa.
    const strip = document.querySelector<HTMLElement>(".logostrip-track");
    /* ---------- nav pois logonauhan tielta ---------- */
    // Logonauha vierii navin paalle (nav on z-index 50, cover 2), jolloin
    // logot ja nav-elementit menevat paallekkain. Kaista piilottaa logon ja
    // valikkopainikkeen ohituksensa ajaksi.
    const stripBand = document.querySelector<HTMLElement>(".logostrip");
    // Suunnat saadetaan erikseen: piiloutuminen halutaan hyvissa ajoin
    // ennen kosketusta, palautuminen heti kun kaista on ohi.
    //
    // NAV_HIDE_BUFFER_IN: kuinka monta pikselia ENNEN kosketusta piiloutuminen
    // alkaa. Isompi = aikaisemmin piiloon. Tama on myos aikapuskuri, koska
    // CSS-siirtyma kestaa 200ms ja sen on ehdittava valmiiksi.
    //
    // NAV_SHOW_BUFFER_OUT: kuinka monta pikselia ENNEN kaistan taydellista
    // ohitusta palautuminen alkaa. Isompi = aikaisemmin esiin. 24px vastaa
    // pieninta --nav-top -arvoa: navin NAKYVAT elementit alkavat vasta sen
    // verran alempaa, joten kaista on jo ohittanut ne vaikka se koskettaisi
    // viela navin laatikon ylareunaa. Negatiivinen arvo viivyttaisi.
    const NAV_HIDE_BUFFER_IN = 120;
    const NAV_SHOW_BUFFER_OUT = 24;
    let navAway = false;
    const LOGO_SPEED = 0.4;
    let copyW = 0;
    let stripOff = 0;
    let lastSc = window.scrollY;
    if (strip && !reduce) {
      const measureStrip = () => {
        const first = strip.firstElementChild as HTMLElement | null;
        // .rv-paljastus siirtaa vain translateY:lla, joten leveys on oikea
        // jo ennen kuin osio on tullut nakyviin.
        copyW = first ? first.getBoundingClientRect().width : 0;
      };
      measureStrip();
      window.addEventListener("resize", measureStrip, { passive: true, signal });
    }

    /* ---------- sticky hero + nouseva cover ---------- */
    // Itse liike on natiivia sticky-kaytosta. Taalla lasketaan vain kaksi
    // asiaa: heron sticky-top (jotta yli viewportin korkuinen hero ehtii
    // nakyviin ennen pinnausta) ja tummennuksen voimakkuus.
    const hero = document.querySelector<HTMLElement>(".stickyzone > .hero");
    const cover = document.querySelector<HTMLElement>(".cover");
    const SCRIM_MAX = 0.65;
    let heroRo: ResizeObserver | null = null;

    // Kuviokerroksen korkeus: coverin ylareunasta footerin ylareunaan.
    // Rect-arvot ovat nakymasuhteisia, mutta niiden EROTUS on dokumentti-
    // etaisyys, joten mittaus on oikea skrollin sijainnista riippumatta.
    // Footeri jaa tarkoituksella kuvion ulkopuolelle: se on oma
    // visuaalinen vyohykkeensa eika sisaltoa.
    const measureMetal = () => {
      const layer = document.querySelector<HTMLElement>(".metalbd-v2");
      const foot = document.querySelector("footer");
      if (!layer || !foot) return;
      const h = foot.getBoundingClientRect().top - layer.getBoundingClientRect().top;
      layer.style.setProperty("--metalbd-h", `${Math.round(h)}px`);
    };
    measureMetal();
    // Sivun korkeus muuttuu fonttien latauksen ja kuvien mitoituksen myota,
    // joten kertamittaus ei riita. Observoidaan bodya: se kattaa kaikki
    // sisallon korkeusmuutokset, ja resize kattaa viewportin muutokset.
    const metalRo = new ResizeObserver(measureMetal);
    metalRo.observe(document.body);
    window.addEventListener("resize", measureMetal, { passive: true, signal });

    /* ---------- toinen sticky + cover: Tapahtumat + Referenssit ---------- */
    // Sama kaava kuin herolla: negatiivinen top vain jos pinnattava on
    // viewportia korkeampi, muuten 0.
    const refSticky = document.querySelector<HTMLElement>(".refsticky");
    const refCover = document.querySelector<HTMLElement>(".refs");
    const afterCover = document.querySelector<HTMLElement>(".aftercover");
    const REF_SCRIM_MAX = 0.65;
    // Coverin sisaantulohaivytys. Kerroin ON SUORAAN se nakyvyysosuus
    // jolla opacity saavuttaa 1:n: kun ylareuna on kohdassa vh - f*vh,
    // osiota on nakyvissa f*vh eli f osuus nakymasta. 0.35 osuu pyydetyn
    // 30-40 %:n haarukan keskelle.
    const COVER_FADE_SPAN = 0.35;
    let refRo: ResizeObserver | null = null;

    const measureRef = () => {
      if (refSticky) {
        const top = Math.min(0, window.innerHeight - refSticky.offsetHeight);
        refSticky.style.setProperty("--ref-sticky-top", `${Math.round(top)}px`);
      }
      // .refs on aina lapinakymaton; varmistetaan ettei aiemmin
      // kirjoitettu arvo jaa elamaan.
      refCover?.style.removeProperty("--cover-fade");
      if (refCover) {
        // Sama kaava kolmannelle parille. Referenssit on min-height: 100vh,
        // joten top on yleensa 0; kaava kattaa senkin tapauksen etta sisalto
        // kasvattaa osion viewporttia korkeammaksi matalalla ikkunalla.
        const h = refCover.offsetHeight;
        refCover.style.setProperty(
          "--refs-sticky-top",
          `${Math.round(Math.min(0, window.innerHeight - h))}px`,
        );
        // EHTO C >= H PAKOTETAAN TASSA, ei jateta sisallon varaan: coverin
        // vahimmaiskorkeudeksi asetetaan pinnattavan oma korkeus. Nain
        // Referenssit ei voi paljastua .aftercoverin ylapuolelle silla
        // hetkella kun se irtoaa, riippumatta ikkunan koosta tai siita
        // kuinka paljon sisaltoa lukukaistan jalkeen on.
        // +2px turvamarginaali: C = H on matemaattisesti tasan riittava
        // (paljastuva kaistale on korkeudeltaan H - C), mutta offsetHeight
        // pyoristaa kokonaislukuun ja todellinen korkeus voi olla
        // murtoluku. Kahden pikselin ylimaara sulkee pois kaiken
        // pyoristyksesta syntyvan raon eika nay missaan.
        afterCover?.style.setProperty("--aftercover-min", `${Math.ceil(h) + 2}px`);
      }
    };

    if ((refSticky || refCover) && !reduce) {
      measureRef();
      refRo = new ResizeObserver(measureRef);
      if (refSticky) refRo.observe(refSticky);
      if (refCover) refRo.observe(refCover);
      window.addEventListener("resize", measureRef, { passive: true, signal });
    }

    const measureHero = () => {
      if (!hero) return;
      // Negatiivinen top vain jos hero on viewportia korkeampi; muuten 0.
      const top = Math.min(0, window.innerHeight - hero.offsetHeight);
      hero.style.setProperty("--hero-sticky-top", `${Math.round(top)}px`);
    };

    if (hero && !reduce) {
      measureHero();
      // ResizeObserver kattaa sisallon muutokset (fontin lataus, tekstin
      // rivittyminen), window-resize taas pelkan viewportin korkeuden
      // muutoksen, joka ei muuta heron omaa kokoa.
      heroRo = new ResizeObserver(measureHero);
      heroRo.observe(hero);
      window.addEventListener("resize", measureHero, { passive: true, signal });
    }

    let ticking = false;

    const onScroll = () => {
      const vh = window.innerHeight;
      const h = document.documentElement;
      const sc = window.scrollY;

      pars.forEach((el) => {
        const sp = parseFloat(el.dataset.par ?? "0");
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2 - vh / 2;
        el.style.setProperty("translate", `0 ${(-mid * sp).toFixed(1)}px`);
      });

      tilts.forEach((el) => {
        const r = el.getBoundingClientRect();
        // Keskikohtien etaisyys, normalisoitu viewportin korkeuteen.
        const d = (r.top + r.height / 2 - vh / 2) / vh;
        // 1 = keskella (taysi kaanto), 0 = TILT_RANGEn paassa keskelta
        // (tasainen). Elementti on siis "avautuneimmillaan" kun se on
        // parhaiten katsottavissa ja suoristuu tullessaan nakyviin seka
        // poistuessaan.
        const t = Math.max(1 - Math.abs(d) / TILT_RANGE, 0);
        el.style.setProperty("--tilt", t.toFixed(3));
        // data-tilt: "x" | "y" | "-x" | "-y". Etumerkki valitsee kumpi
        // reuna tulee katsojaa kohti.
        //   rotateX +  : ylareuna poispain (sarana alareunassa)
        //   rotateY +  : VASEN reuna katsojaa kohti, oikea loittonee
        //   rotateY -  : oikea reuna katsojaa kohti, vasen loittonee
        //
        // Kirjoitetaan MUUTTUJAAN eika style.transformiin: puhelimilla on
        // CSS:ssa oma perusrotaationsa (rotate(-7deg)/rotate(6deg)), jonka
        // suora transform-asetus yliajaisi. CSS yhdistaa perusrotaation ja
        // taman saman ketjun sisalla. Arvo on kokonainen rotate-funktio,
        // joten akseli sailyy data-tiltissa eika valu CSS:aan.
        const spec = el.dataset.tilt ?? "x";
        const axis = spec.endsWith("y") ? "rotateY" : "rotateX";
        const sign = spec.startsWith("-") ? -1 : 1;
        // data-tilt-profile="mockup" valitsee hillitymman kulman ja lisaa
        // taaksepain-kallistuksen. Puhelimet jaavat oletusprofiiliin.
        const mockup = el.dataset.tiltProfile === "mockup";
        const main = sign * t * (mockup ? TILT_MAX_MOCKUP : TILT_MAX);
        // Positiivinen rotateX vie ylareunan poispain katsojasta. Sama t,
        // joten molemmat akselit ovat huipussaan yhta aikaa keskella.
        const back = mockup ? ` rotateX(${(t * TILT_BACK_MAX).toFixed(2)}deg)` : "";
        el.style.setProperty("--tilt-rot", `${axis}(${main.toFixed(2)}deg)${back}`);
      });

      if (mbLayer) {
        // Ajuriksi coverin oma sijainti, ei raaka scrollY: arvo kulkee
        // 0 -> coverin korkeus juuri sen matkan aikana kun kuvio on
        // nakyvissa, joten liike osuu sinne missa se nahdaan.
        const mbRect = mbLayer.getBoundingClientRect();
        const p = -mbRect.top;
        // Eteneminen koko kuvioalueella, ei coverin korkeudella: kerros
        // ulottuu nyt footeriin asti ja liikkeen on jakauduttava sille.
        const mbProg = Math.min(Math.max(p / Math.max(mbRect.height - vh, 1), 0), 1);

        // KIRKKAAN ALUEEN SEURANTA. Tama on rakenteellinen luettavuus-
        // korjaus eika koriste: kuvion vaalein kohta pidetaan aina siina
        // kohdassa kuviota joka sattuu nakymakeskukseen, joten se teksti
        // jota kayttaja juuri lukee on aina kuvion kirkkaimman kohdan
        // paalla. Ilman tata kirkas alue olisi kiinteassa kohdassa ja
        // sen ulkopuolelle jaava teksti tarvitsisi taas oman levynsa.
        if (mbFacetsAll.length) {
          // Valon rata ei ole tasainen liuku vaan poikkeaa siita sinilla.
          // Sticky-pane pitaa valon joka tapauksessa nakymassa, joten rata
          // saa vaihdella ilman etta luettavuus karsii.
          const gy = 34 + mbProg * 16 + Math.sin(mbProg * Math.PI * 2.5) * 5;
          // Vaakasuunnalla on OMA, hitaampi jaksonsa. Jaksot 2,5 ja 1,7
          // ovat yhteismitattomia, joten pari ei palaa samaan asentoon
          // kertaakaan matkan aikana - juuri se poistaa toistuvuuden.
          const gx = 56 + Math.sin(mbProg * Math.PI * 1.7) * 6;
          for (const el of mbLayers) {
            el.style.setProperty("--mb-gy", `${gy.toFixed(1)}%`);
            el.style.setProperty("--mb-gx", `${gx.toFixed(1)}%`);
          }
          // 120/200 -> 300/200px. Vara on 432/270px, joten tama mahtuu.
          const tf = `translate3d(${(mbProg * 300).toFixed(1)}px, ${(-mbProg * 200).toFixed(1)}px, 0)`;
          for (const el of mbFacetsAll) el.style.transform = tf;
          // Ryhmat kiertyvat VASTAKKAISIIN suuntiin ja eri vauhtia, jolloin
          // niiden leikkauspisteet vaeltavat ja fasettien rajat piirtyvat
          // sivun eri kohdissa eri tavalla. Kierto on SVG:n sisalla, joten
          // se ei voi paljastaa fasettikerroksen reunaa.
          const ra = `rotate(${(mbProg * 4.5).toFixed(2)}deg)`;
          const rb = `rotate(${(-2.2 - Math.sin(mbProg * Math.PI * 1.3) * 2.4).toFixed(2)}deg)`;
          for (const g of mbfAll) {
            g.style.transform = g.classList.contains("mbf-a") ? ra : rb;
          }
        }

        // Kertoimet ovat tarkoituksella ERI SUURUISIA JA ERI SUUNTIIN:
        // A liikkuu pystysuunnassa nopeammin, B vaakasuunnassa. Nain
        // lohkojen KESKINAINEN asema muuttuu koko matkan ajan eika koko
        // kuvio vain siirry yhtena kappaleena.
        if (mbA) {
          mbA.style.transform =
            `translate3d(${(p * 0.09).toFixed(1)}px, ${(-p * 0.16).toFixed(1)}px, 0)` +
            ` rotate(${(p * 0.02).toFixed(2)}deg)`;
        }
        if (mbB) {
          mbB.style.transform =
            `translate3d(${(-p * 0.14).toFixed(1)}px, ${(p * 0.07).toFixed(1)}px, 0)` +
            ` rotate(${(-p * 0.011).toFixed(2)}deg)`;
        }
        if (mbSweep) {
          // 1917px eika raitajakso 900px: 118 asteen kulmassa pystysiirtyma
          // vastaa kuvion jaksoa vasta kun se on jaettu cos(118°):lla.
          // Aiempi 420px ei osunut jaksoon lainkaan, joten kuvio HYPPASI
          // takaisin alkuun - juuri se nakyi toistona.
          mbSweep.style.transform = `translate3d(0, ${(-(p * 0.3) % 1917).toFixed(1)}px, 0)`;
        }
      }

      if (bdGrid && bdRing && bdWave) {
        const gx = -((sc * 0.02) % 240);
        const gy = -((sc * 0.012) % 300);
        bdGrid.style.transform = `translate(${gx.toFixed(1)}px, ${gy.toFixed(1)}px)`;
        bdRing.style.transform = `translate(770px,110px) rotate(${(sc * 0.14).toFixed(1)}deg)`;
        bdWave.style.transform = `translateX(${(-(sc * 0.05) % 660).toFixed(1)}px)`;
        const drawT = (Math.sin(sc / 380) + 1) / 2;
        bdPaths.forEach((p, i) => {
          if (!p) return;
          const off = 100 - ((drawT * 100 - i * 6 + 600) % 100);
          p.style.strokeDashoffset = off.toFixed(1);
        });
      }

      // Tummennus seuraa sita kuinka paljon cover on noussut nakyviin:
      // coverTop = vh -> 0 (ei tummennusta), coverTop = 0 -> 1 (taysi).
      // Arvo lasketaan joka framessa suoraan skrollista, joten se seuraa
      // molempiin suuntiin 1:1 ilman omaa siirtymaa.
      // Referenssit-coverin tummennus, sama kaava kuin herolla: coverin
      // ylareuna vh -> 0 vastaa tummennusta 0 -> REF_SCRIM_MAX. Arvo
      // lasketaan joka framessa suoraan geometriasta, joten se seuraa
      // molempiin suuntiin ilman omaa siirtymaa.
      if (refSticky && refCover) {
        // SAMA H1-ANKKURI KUIN FADESSA. vh-ankkuri antoi pin-hetkella
        // nollasta poikkeavan arvon (0,080 / 0,303 / 0,544 kolmella
        // nakymakorkeudella), koska paneeli on viewporttia matalampi ja
        // .refs on jo osittain nakyvissa. Paneelin omaan korkeuteen
        // ankkuroituna refs.top === H1 pin-hetkella, joten rp === 0 tasan.
        //
        // Jakaja 0,6: tummennus on taydessa voimassa kun cover on peittanyt
        // 60 % paneelista, ei vasta lopussa jolloin paneeli olisi jo
        // piilossa.
        // ANKKURI A = min(H1, vh). Paneeleita on nyt kaksi, joten .refsticky
        // voi olla nakymaa KORKEAMPI. Silloin se pinnautuu negatiivisella
        // topilla ja sen alareuna - eli .refsin ylareuna - on pin-hetkella
        // nakyman ALAREUNASSA, ei H1:n kohdalla. Pelkka offsetHeight olisi
        // siis oikein vain kun paneelipari mahtuu nakymaan; A kattaa
        // molemmat tapaukset, ja refs.top === A tasan pin-hetkella.
        const A = Math.min(refSticky.offsetHeight, vh);
        const rp = Math.min(
          Math.max((A - refCover.getBoundingClientRect().top) / (0.6 * A), 0),
          1,
        );
        refSticky.style.setProperty("--ref-scrim", (rp * REF_SCRIM_MAX).toFixed(3));
        // Sama etenema myos .refsille omana muuttujanaan. RAAKA rp (0..1),
        // ei rp * REF_SCRIM_MAX: overlayn oma gradientti maaraa
        // voimakkuuden, ja muuttuja saataa vain sen etenemaa. Ei uutta
        // laskentaa - rp on jo tassa ja se on 0,000 tasan pin-hetkella.
        refCover.style.setProperty("--refs-dim", rp.toFixed(3));
      }

      // Coverit materialisoituvat sisaan: koko elementin opacity seuraa
      // sita kuinka suuri osa nakymasta on jo sen peitossa. Arvo johdetaan
      // joka framessa rectista eika deltoista, joten se palautuu
      // ylospain skrollattaessa samaa rataa eika voi jaada jumiin.
      // VAIN .aftercover haivyy sisaan. .refs oli aiemmin mukana, mutta
      // paneeli on nyt viewporttia matalampi, joten .refs on nakyvissa heti
      // pinnautuessa - lapinakyvyys nakyi valkoisena aukkona paneelin alla.
      // Sen opacity jaa CSS:n varasyottoon 1; measureRef poistaa muuttujan
      // kertaalleen, jottei aiempi arvo jaa elamaan.
      if (afterCover) {
        const v = (vh - afterCover.getBoundingClientRect().top) / (vh * COVER_FADE_SPAN);
        afterCover.style.setProperty("--cover-fade", Math.min(Math.max(v, 0), 1).toFixed(3));
      }

      // Kolmas pari: Referenssien tummennus etenee kun .aftercover nousee
      // sen paalle. Sama geometriasta johdettu kaava kuin kahdella muulla.
      if (refCover && afterCover) {
        const apRaw = 1 - afterCover.getBoundingClientRect().top / vh;
        const ap = Math.min(Math.max(apRaw, 0), 1);
        refCover.style.setProperty("--refs-scrim", (ap * REF_SCRIM_MAX).toFixed(3));
        // RAJAAMATON etenema NavCarriersille. Rajattu ap kyllastyy ykkoseen
        // heti kun .aftercover peittaa nakyman ylareunan, joten silla ei voi
        // ajoittaa mitaan sen jalkeen - ikkunan siirtaminen myohemmaksi
        // vaatii arvon joka jatkaa yli ykkosen. Negatiivisena se kertoo
        // kuinka kaukana .aftercover viela on, mika on Referenssien
        // keskijakson ainoa mitta. Ei uusi laskenta - sama rect, sama rivi.
        refCover.style.setProperty("--refs-ap", apRaw.toFixed(3));
      }

      if (hero && cover) {
        const p = Math.min(Math.max(1 - cover.getBoundingClientRect().top / vh, 0), 1);
        hero.style.setProperty("--scrim-opacity", (p * SCRIM_MAX).toFixed(3));
        // Sama p raakana HeroScrubille. Ruudun indeksi on round(p * (N-1)),
        // joten se tarvitsee tarkemman arvon kuin scrimin kolme desimaalia
        // - ja nimenomaan TAMAN saman mittauksen, ettei toinen silmukka lue
        // samaa rectia eri vaiheessa framea.
        hero.style.setProperty("--hero-p", p.toFixed(4));
      }

      if (strip && copyW > 0) {
        stripOff += (sc - lastSc) * LOGO_SPEED;
        const x = -(((stripOff % copyW) + copyW) % copyW);
        strip.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      }
      lastSc = sc;

      navAndProgress(sc, h);
      ticking = false;
    };

    // Navi tiivistyy scrolled-tilassa 4px, joten tila vaihdetaan hystereesilla:
    // paalle vasta 14px:n jalkeen, pois vasta alle 4px:n. Ilman sita tila
    // varahtelisi kynnyksen tuntumassa ja jokainen vaihto siirtaisi sisaltoa.
    let scrolled = false;
    const navAndProgress = (sc: number, h: HTMLElement) => {
      if (!scrolled && sc > 14) scrolled = true;
      else if (scrolled && sc < 4) scrolled = false;
      nav?.classList.toggle("scrolled", scrolled);

      if (nav && stripBand) {
        const r = stripBand.getBoundingClientRect();
        const navH = nav.getBoundingClientRect().height;
        // Tila johdetaan joka framessa suoraan geometriasta, ei deltoista,
        // joten se korjaa itsensa eika voi jaada jumiin nopeassakaan
        // edestakaisessa skrollauksessa.
        const overlap =
          r.top < navH + NAV_HIDE_BUFFER_IN && r.bottom > NAV_SHOW_BUFFER_OUT;
        // DOMia kosketaan vain kun tila oikeasti vaihtuu, ei joka tickilla.
        if (overlap !== navAway) {
          navAway = overlap;
          nav.classList.toggle("nav-away", overlap);
        }
      }

      if (prog) {
        const max = h.scrollHeight - window.innerHeight;
        prog.style.width = (max > 0 ? (sc / max) * 100 : 0) + "%";
      }
    };

    const onScrollReduced = () => {
      navAndProgress(window.scrollY, document.documentElement);
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(reduce ? onScrollReduced : onScroll);
          ticking = true;
        }
      },
      { passive: true, signal },
    );
    if (!reduce) onScroll();
    else onScrollReduced();

    /* ---------- korttien tilt ---------- */
    if (finePointer && !reduce) {
      document.querySelectorAll<HTMLElement>(".tilt").forEach((c) => {
        c.addEventListener(
          "mousemove",
          (e) => {
            const r = c.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            c.style.transform = `translateY(-6px) perspective(900px) rotateY(${x * 4.5}deg) rotateX(${-y * 4.5}deg)`;
          },
          { signal },
        );
        c.addEventListener("mouseleave", () => { c.style.transform = ""; }, { signal });
      });
    }

    /* ---------- puhelinten hiiriparallaksi ---------- */
    const stage = document.getElementById("stage");
    if (stage && finePointer && !reduce) {
      const phones = Array.from(stage.querySelectorAll<HTMLElement>(".phone"));
      stage.addEventListener(
        "mousemove",
        (e) => {
          const r = stage.getBoundingClientRect();
          const cx = (e.clientX - r.left) / r.width - 0.5;
          const cy = (e.clientY - r.top) / r.height - 0.5;
          phones.forEach((p) => {
            const d = Number(p.dataset.depth ?? 0);
            const base = p.classList.contains("p2")
              ? "rotate(-8deg) scale(.85) "
              : p.classList.contains("p3")
                ? "rotate(7deg) scale(.8) "
                : "";
            p.style.transform =
              base +
              `translate3d(${cx * d}px, ${cy * d}px, 0) rotateY(${cx * 7}deg) rotateX(${-cy * 6}deg)`;
          });
        },
        { signal },
      );
      stage.addEventListener(
        "mouseleave",
        () => { phones.forEach((p) => { p.style.transform = ""; }); },
        { signal },
      );
    }

    /* ---------- heron selainnayttamon hiiriparallaksi ---------- */
    // Verkkosivut-sivun vastine puhelinnayttamolle: koko selainikkuna
    // kallistuu osoittimen mukaan. Muilla sivuilla elementteja ei ole,
    // jolloin tama on no-op eika omaa kuuntelijaa lisata.
    const bstage = document.querySelector<HTMLElement>(".bstage");
    const bwrap = document.getElementById("bwrap");
    if (bstage && bwrap && finePointer && !reduce) {
      bstage.addEventListener(
        "mousemove",
        (e) => {
          const r = bstage.getBoundingClientRect();
          const cx = (e.clientX - r.left) / r.width - 0.5;
          const cy = (e.clientY - r.top) / r.height - 0.5;
          bwrap.style.transform =
            `rotateY(${cx * 5}deg) rotateX(${-cy * 4}deg) ` +
            `translate3d(${cx * 10}px, ${cy * 8}px, 0)`;
        },
        { signal },
      );
      bstage.addEventListener(
        "mouseleave",
        () => { bwrap.style.transform = ""; },
        { signal },
      );
    }

    /* ---------- magneettinen nappi ---------- */
    if (finePointer && !reduce) {
      document.querySelectorAll<HTMLElement>(".mag").forEach((b) => {
        b.addEventListener(
          "mousemove",
          (e) => {
            const r = b.getBoundingClientRect();
            b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
          },
          { signal },
        );
        b.addEventListener("mouseleave", () => { b.style.transform = ""; }, { signal });
      });
    }

    /* ---------- reveal ---------- */
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));

    /* ---------- ajovalot (palautuva tila) ---------- */
    // Eri havainnoija kuin .rv-paljastus: TAMA EI TEE UNOBSERVEA, vaan
    // togglaa luokan nakyvyyden mukaan molempiin suuntiin. Sisaantulo on
    // kertaluontoinen, valot eivat.
    //
    // Ehto on intersectionRatio, EI isIntersecting. isIntersecting on tosi
    // aina kun leikkausta on yhtaan (ratio > 0) riippumatta thresholdista -
    // threshold ohjaa vain sita milloin callback laukeaa. Sen kanssa valot
    // sammuivat vasta kun elementti oli kokonaan ruudun ulkopuolella, eika
    // sammumista ehtinyt nahda. Ratio-vertailu sammuttaa ne kun 55 % on
    // viela nakyvissa, ja sytyttaa symmetrisesti samassa kohdassa.
    const LIGHTS_RATIO = 0.55;
    const lightsIo = reduce
      ? null
      : new IntersectionObserver(
          (es) => {
            es.forEach((e) =>
              e.target.classList.toggle("lights-on", e.intersectionRatio >= LIGHTS_RATIO),
            );
          },
          // Useita kynnyksia, jotta tila lasketaan uudelleen riittavan
          // usein eika yksikaan ylitys jaa valiin nopeassa skrollauksessa.
          { threshold: [0, 0.25, LIGHTS_RATIO, 0.8, 1] },
        );
    if (lightsIo) {
      document.querySelectorAll("[data-lights]").forEach((el) => lightsIo.observe(el));
    }

    /* ---------- numerorullaus (lukukaista + case-kortit) ---------- */
    // Luku kasitellaan YHTENA kokonaislukuna, ei merkki kerrallaan. Aiempi
    // merkkikohtainen odometri pyoritti jokaista numeroa omaan tahtiinsa,
    // jolloin koko luku hyppi epaloogisesti: 150:tta kohti mentaessa se
    // saattoi nayttaa valilla 300, 500 ja 254. Nyt arvo interpoloidaan
    // 0:sta tavoitteeseen ja muotoilu lasketaan vasta lopuksi, joten luku
    // kasvaa aina monotonisesti eika koskaan laske.
    const COUNT_ROOT_MARGIN = "0px 0px 5% 0px"; // laukaisu: 5% vh:sta ennen taitetta
    const COUNT_DURATION = 3400;                // rullauksen kesto, ms

    const frames = new Set<number>();
    const spin = (el: HTMLElement) => {
      const target = (el.dataset.count ?? "").replace(/&nbsp;/g, " ");
      const fmt = parseCount(target);
      if (!fmt) return;

      let t0: number | null = null;
      const tick = (ts: number) => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / COUNT_DURATION, 1);
        if (p < 1) {
          // easeOutCubic on aidosti kasvava, joten Math.round tuottaa
          // ei-laskevan jonon: arvo ei voi kaantya alaspain missaan kohtaa.
          el.textContent = formatCount(Math.round(easeOutCubic(p) * fmt.value), fmt);
          frames.add(requestAnimationFrame(tick));
        } else {
          // Viimeinen frame asetetaan lahdemerkkijonosta, jolloin
          // lopputulos on varmasti tasmalleen alkuperainen.
          el.textContent = target;
        }
      };

      frames.add(requestAnimationFrame(tick));
    };

    const io2 = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            if (!reduce) spin(e.target as HTMLElement);
            io2.unobserve(e.target);
          }
        });
      },
      // POSITIIVINEN alamarginaali laajentaa juuren viewportin alapuolelle,
      // eli suurempi arvo laukaisee aiemmin. 20% oli liikaa: rullaus ehti
      // loppuun ennen kuin luku tuli nakyviin. threshold 0 riittaa, kun raja
      // on jo siirretty marginaalilla.
      { threshold: 0, rootMargin: COUNT_ROOT_MARGIN },
    );
    document
      .querySelectorAll<HTMLElement>("[data-count]")
      .forEach((el) => io2.observe(el));

    return () => {
      metalRo.disconnect();
      refRo?.disconnect();
      ac.abort();
      heroRo?.disconnect();
      io.disconnect();
      io2.disconnect();
      lightsIo?.disconnect();
      frames.forEach((f) => cancelAnimationFrame(f));
    };
  }, []);

  return null;
}
