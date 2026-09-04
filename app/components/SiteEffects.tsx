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

    /* PALJASTUKSEN OLETUS ON NAKYVA, ei piilotettu.
     *
     * .rv:n perustila oli aiemmin opacity: 0, ja vain JS teki siita
     * nakyvan. Mika tahansa vika paljastusketjussa - kaatunut skripti,
     * estetty JS, havainnoija joka ei toimita - jatti sivun tyhjaksi.
     * Nyt piilotus on kiinni TASSA luokassa: se lisataan ennen kuin
     * mitaan observoidaan, joten ilman JS:aa tai ennen sen ajoa kaikki
     * sisalto on nakyvissa ja animaatio jaa vain pois.
     *
     * VARMISTUSAIKAKATKAISU. Jos paljastusta ei todisteta toimivaksi
     * RV_FALLBACK:n kuluessa, luokka poistetaan kokonaan ja kaikki
     * paljastumaton tulee nakyviin ilman animaatiota.
     *
     * PERUUTUSEHTO EI SAA OLLA "jokin .rv on saanut .on". Se oli
     * aiemmin, ja se on mahdoton tayttaa etusivulla: hero tayttaa
     * ensimmaisen nakyman eika siina ole yhtaan .rv-elementtia, joten
     * mitattuna 0/33 elementtia yltaa 10 %:n kynnykseen ennen kuin
     * kayttaja vierittaa. Varaventtiili laukesi siis AINA jos kayttaja
     * ei ehtinyt vierittaa 8 sekunnissa - mitattu tuotantobuildista,
     * rv-ready poistui 8122 ms kohdalla ja koko reveal-jarjestelma
     * kuoli. Ehto ei saa riippua kayttajan vierityksesta eika siita
     * sattuuko ensimmaisessa nakymassa olemaan .rv-elementteja.
     *
     * OIKEA TODISTE ON ETTA HAVAINNOIJA ELAA. IntersectionObserver
     * toimittaa ensimmaisen kutsun jokaisesta observoidusta kohteesta
     * riippumatta siita leikkaako se nakymaa: mitattuna 1 kutsu, 33
     * entrya, joista isIntersecting=true 0 kpl. Se on suora todiste
     * siita etta havainnoija on asennettu ja toimittaa, eika vaadi
     * kayttajalta mitaan. Ks. rvProven alempana.
     *
     * ARVO 8000 SAILYY. Vika oli ehdossa, ei ajassa. Mitattu aika
     * sivun alusta havainnoijan ensimmaiseen toimitukseen: 137 ms
     * normaalisti, 490 ms 6x CPU-throttlauksella ja 2293 ms 20x CPU +
     * hidas 3G. 8 s antaa siis noin 3,5-kertaisen marginaalin
     * pahimpaan mitattuun, ja koska ehto nyt tayttyy ensimmaisella
     * framella, varaventtiili laukeaa kaytannossa vain jos havainnoija
     * on aidosti rikki tai dokumentti on piilotettu (taustavalilehti,
     * jolloin renderointipaivitysta ei aja eika IO toimita). Molemmissa
     * tapauksissa laukeaminen on OIKEA lopputulos: sisalto tulee
     * nakyviin, vain animaatio jaa pois. */
    const root = document.documentElement;
    const RV_FALLBACK = 8000;
    root.classList.add("rv-ready");
    let rvTimer: number | undefined = window.setTimeout(() => {
      root.classList.remove("rv-ready");
      rvTimer = undefined;
    }, RV_FALLBACK);
    /* Paljastus on todistettu toimivaksi: varaventtiilia ei tarvita.
       Idempotentti, joten sen voi kutsua jokaisesta todistepolusta. */
    const rvProven = () => {
      if (rvTimer === undefined) return;
      window.clearTimeout(rvTimer);
      rvTimer = undefined;
    };

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
    // Case-kortit ovat pieni, tiivis kolmikko, joten 13 astetta olisi
    // liikaa. 4 astetta taas jai havaintokynnyksen alle: lahi- ja
    // kaukoreunan skaalojen ero oli vain 1,96 %. 9 on pienin kulma jolla
    // ero ylittaa 4 %, ja ulostyontyma on siina 1,60 px eli 6,7 %
    // .wrapin 24px paddingista. Ulostyontyma ei kasva lineaarisesti:
    // cos(theta) kutistaa korttia samaa tahtia kuin perspektiivi tyontaa
    // lahireunaa ulos, joten se on huipussaan 8 asteella (1,63 px) ja
    // nollautuu 16 asteella.
    const TILT_MAX_CARD = 9;     // .case: rotateY, ei taaksepain-kallistusta
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
      const footTop = foot.getBoundingClientRect().top;
      const h = footTop - layer.getBoundingClientRect().top;
      layer.style.setProperty("--metalbd-h", `${Math.round(h)}px`);

      // .aftercoverin oma kuviokerros. KAKSI ARVOA SAMASTA RECTISTA:
      // --metalbd-tail on kerroksen korkeus (tasta footeriin) ja antaa
      // sticky-panelle liikevaran sauman yli; --aftercover-h on maskin
      // alastop. Jos ne luettaisiin eri kutsuista, valiin ehtisi asettelu-
      // muutos ja saumaan jaisi rako tai paallekkainen maalaus.
      //
      // EI PYORISTYSTA. Maskin alastop lasketaan samasta laatikosta kuin
      // kerroksen ylareuna (molemmat .aftercoverin border-boxista), joten
      // murtoluku osuu tasan alareunaan. Pyoristys ylospain tuottaisi
      // ylimaaraisen maalatun rivin, alaspain raon.
      const after = document.querySelector<HTMLElement>(".aftercover");
      if (!after) return;
      const r = after.getBoundingClientRect();
      after.style.setProperty("--metalbd-tail", `${footTop - r.top}px`);
      after.style.setProperty("--aftercover-h", `${r.height}px`);
      // Liikevaran diagnostiikka: panen on pysyttava nakymaan pinnattuna
      // koko osion ajan, mika vaatii ettei kerros lopu ennen kuin osio on
      // ohitettu - eli footTop - r.bottom > nakyman korkeus.
      after.style.setProperty("--aftercover-gap", `${footTop - r.bottom}px`);
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

    // Mittaus, ei animaatio: ajaa myos reduced-motion-tilassa.
    if (refSticky || refCover) {
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

    // Mittaus, ei animaatio: ajaa myos reduced-motion-tilassa.
    if (hero) {
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

      // PARALLAKSI on automaattista liiketta -> sammuu. Taman funktion
      // loppupaan GEOMETRIAN MITTAUS ei ole liiketta vaan asettelua, ja
      // se ajaa aina: muuten sticky-osiot jaavat ilman mittojaan ja
      // sivulle jaa ruudullisia tyhjaa.
      if (!reduce) pars.forEach((el) => {
        const sp = parseFloat(el.dataset.par ?? "0");
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2 - vh / 2;
        el.style.setProperty("translate", `0 ${(-mid * sp).toFixed(1)}px`);
      });

      // KAANTO on automaattista -> sammuu.
      if (!reduce) tilts.forEach((el) => {
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
        // data-tilt-profile valitsee kulman: "mockup" hillitympi + kevyt
        // taaksepain-kallistus, "card" hyvin pieni ja ilman kallistusta.
        // Puhelimet jaavat oletusprofiiliin.
        const profile = el.dataset.tiltProfile;
        const mockup = profile === "mockup";
        const main = sign * t * (profile === "card" ? TILT_MAX_CARD : mockup ? TILT_MAX_MOCKUP : TILT_MAX);
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
        // RAAKA q HeroScrubille: 0 kun coverin ylareuna on nakyman
        // alareunassa, 1 kun cover peittaa heron. Sama mittaus kuin ennen,
        // vain ilman kerrointa - scrimin aikataulu on nyt HeroScrubissa,
        // jotta p:n ja q:n jaksot ovat yhdessa paikassa.
        hero.style.setProperty("--hero-q", p.toFixed(4));
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

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true, signal },
    );
    onScroll();

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
        // ENSIMMAINEN TOIMITUS ON VARAVENTTIILIN PERUUTUSEHTO, ei se
        // etta jokin elementti leikkaa nakymaa. Spesifikaation mukaan
        // observe() ajastaa alkuhavainnon jokaiselle kohteelle, ja se
        // toimitetaan seuraavassa renderointipaivityksessa myos silloin
        // kun isIntersecting on false kaikilla. Tama on siis suora
        // todiste siita etta havainnoija elaa - riippumatta siita onko
        // kayttaja vierittanyt tai onko ensimmaisessa nakymassa yhtaan
        // .rv-elementtia. Kumpikaan ei patenyt etusivulla.
        rvProven();
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    const rvNodes = document.querySelectorAll(".rv");
    rvNodes.forEach((el) => io.observe(el));
    // Sivu ilman yhtaan .rv-elementtia ei saa yhtaan toimitusta, koska
    // observe():a ei kutsuta kertaakaan. Silloin ei ole mitaan
    // paljastettavaa eika mitaan todistettavaa.
    if (rvNodes.length === 0) rvProven();

    /* Varmistus havainnoijan rinnalle, ei sen korvaaja.
     *
     * MIKSI TATA TARVITAAN. Latauskerroksen ajan juuressa on
     * html.hero-locked { overflow: hidden }, joka tekee <html>:sta
     * LEIKKAAVAN esivanhemman. IntersectionObserver leikkaa kohteen
     * suorakulmion jokaista esivanhemman leikkausta vasten, joten koko
     * taitteen alapuolinen sisalto on lukituksen ajan nollattu. Kun
     * luokka poistetaan, mikaan ei valttamatta laukaise IO:lle uutta
     * arviota ennen kuin kayttaja on vierittanyt reilusti - ja koska
     * paljastus on kertaluontoinen (unobserve), valiin jaaneet
     * elementit jaavat opacity: 0 -tilaan. Mitattuna rvOn oli 0 / 33.
     *
     * Kynnys on sama 0,1 kuin havainnoijalla ja laskettu samalla
     * maaritelmalla: leikkauspinta-ala jaettuna elementin pinta-alalla.
     * classList.add on idempotentti, joten IO:n oma toimitus samalle
     * elementille ei tee vahinkoa. */
    const revealNow = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(".rv:not(.on)").forEach((el) => {
        const r = el.getBoundingClientRect();
        const area = r.width * r.height;
        if (area <= 0) return;
        const ih = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        const iw = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
        if ((ih * iw) / area >= 0.1) el.classList.add("on");
      });
      // TOISSIJAINEN todistepolku. Ensisijainen on havainnoijan
      // ensimmainen toimitus; tama kattaa sen epatodennakoisen
      // tilanteen jossa IO ei toimita mutta tama varmistus onnistuu.
      // Ei enaa ainoa ehto, joten se ei voi jaada tayttymatta siksi
      // ettei kayttaja vierita.
      if (document.querySelector(".rv.on")) rvProven();
    };
    revealNow();
    // HeroScrub ilmoittaa lukon purusta tapahtumalla, ei tuonnilla:
    // komponentit pysyvat erillaan. Synteettinen scroll ei auttaisi -
    // IO:ta ei ajeta scroll-tapahtumista vaan renderointisilmukasta.
    window.addEventListener("hero:unlocked", revealNow, { passive: true, signal });
    let revealTick = false;
    window.addEventListener(
      "scroll",
      () => {
        if (revealTick) return;
        revealTick = true;
        requestAnimationFrame(() => {
          revealTick = false;
          revealNow();
        });
      },
      { passive: true, signal },
    );

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
      if (rvTimer !== undefined) window.clearTimeout(rvTimer);
      root.classList.remove("rv-ready");
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
