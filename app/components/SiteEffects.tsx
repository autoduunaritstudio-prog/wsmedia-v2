"use client";

import { useEffect } from "react";

import { easeOutCubic, formatCount, parseCount } from "./count-format";
import { tauotaPiilossa } from "./animaatiotauko";
import { mittaaLaite } from "./kevyttila";

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
    const puraTauko = tauotaPiilossa();
    const puraMittaus = mittaaLaite();

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
    /* VIERINTAAN SIDOTTU PALJASTUS. Vastapari .rv:lle, joka on
       kertalaukaisu: se lisaa .on-luokan ja tekee unobserven, joten
       ylospain palatessa ja uudelleen alas tullessa mitaan ei enaa
       tapahdu. Nama elementit saavat sen sijaan --rvp:n joka kehyksessa
       omasta sijainnistaan, jolloin liike purkautuu samaa rataa takaisin.
       Opt-in data-attribuutilla, jotta kirjoituksia tulee vain niille
       elementeille jotka sita oikeasti kayttavat. */
    const rvsEls = Array.from(document.querySelectorAll<HTMLElement>("[data-rvs]"));
    const rvsJoukko = new Set<Element>(rvsEls);

    /* HEHKU: ETENEMA JOKA EI VOI JAATYA.
     *
     * --rvp lasketaan getBoundingClientRect():sta, ja se on oikea
     * mittari osiolle joka vierii normaalisti. Pinon osiot ovat
     * position: sticky, ja PINNATUN elementin rect ei muutu
     * vieritettaessa: sen lapsilla --rvp jaatyy siihen arvoon joka
     * silla oli pinnautumishetkella. Juuri siksi korttien kaaviot
     * eivat liikkuneet, ja siksi myos natiivi view()-aikajana jai
     * samaan ansaan: se mittaa saman pinnatun laatikon.
     *
     * Tama mittari lukee elementin ASETTELUSIJAINNIN dokumentissa
     * (offsetTop-ketju). Se on layout-arvo eika riipu siita mihin
     * elementti maalataan, joten sticky ei vaikuta siihen mitenkaan.
     * Sijainti mitataan kerran ja resizessa, ei kehyksessa. */
    const hehkuEls = Array.from(document.querySelectorAll<HTMLElement>("[data-hehku]"));
    const hehkuJoukko = new Set<Element>(hehkuEls);
    const hehkuY = new WeakMap<HTMLElement, { y: number; h: number; k: number }>();
    const mittaaHehku = () => {
      for (const el of hehkuEls) {
        let y = 0;
        let n: HTMLElement | null = el;
        while (n) {
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        /* data-hehkun ARVO on matkan kerroin. Oletus 1.
           Sita tarvitaan siksi, etta elementin oma korkeus ei kerro
           milloin sen pitaa olla valmis: pinotussa vierityksessa
           seuraava osio nousee kortiston paalle jo ennen kuin
           kortisto on lopussa, ja mitattuna se peitti alarivin
           kaaviot 400px ennen kuin ne olivat piirtyneet. Kerroin
           lyhentaa matkan sen mukaan milloin kohde on VIELA
           nakyvissa, ei sen mukaan kuinka pitka se on. */
        const k = Number(el.dataset.hehku);
        hehkuY.set(el, { y, h: el.offsetHeight, k: Number.isFinite(k) && k > 0 ? k : 1 });
      }
    };
    mittaaHehku();
    window.addEventListener("resize", mittaaHehku, { passive: true });
    /* MITTAUS ON UUSITTAVA KUN ASETTELU MUUTTUU, EI VAIN KUN IKKUNA
       MUUTTUU. Mitattuna kortisto oli dokumentissa kohdassa 2355,
       mutta --piirto oli nolla viela kohdassa 2192 eli sielta missa
       sen olisi pitanyt olla jo yksi. Syy: sijainti mitattiin kerran
       efektin kaynnistyessa, ja sen jalkeen sivun ylaosa muuttui
       (kuvat, fontit, laiskasti ladatut videot). Mittaus jai siis
       vanhan asettelun mukaiseksi, ja koko piirto laskettiin vaarasta
       kohdasta.

       ResizeObserver bodylla havaitsee tasan tuon: sivun korkeuden
       muutoksen. Se on eri asia kuin resize-tapahtuma, joka kertoo
       vain ikkunasta. */

    /* VALOKERROSTEN OMA ETENEMA.
       Taustan valot ovat osioiden omissa kerroksissa, joten ne
       kulkevat osion mukana. Se ei kuitenkaan viela tarkoita etta
       valo elaisi: kerros liikkuu, mutta valo on siina aina samassa
       kohtaa. --valo kertoo kuinka pitkalle osio on kulkenut nakyman
       lapi, ja valopiste ajetaan sen mukaan, jolloin valo siirtyy
       osion sisalla samalla kun osio siirtyy ruudulla.

       Mittaus on layout-pohjainen samasta syysta kuin hehkulla:
       osiot ovat pinotussa vierityksessa, ja pinnatun elementin
       getBoundingClientRect jaatyy pinnin ajaksi. offsetTop ei.

       Nolla kun osion ylareuna koskee nakyman alareunaa, yksi kun sen
       alareuna on noussut nakyman ylareunan yli. */
    const valoEls = Array.from(
      document.querySelectorAll<HTMLElement>(".wsx .seo-sec, .wsx .jakso-pari")
    );
    /* Valon oma kerros, ks. globals.css "OSION VALO OMANA ELEMENTTINAAN".
       Lyhytvideoilla, verkkosivuilla ja graafisella sivulla, vain osioihin joiden ::before on valo. */
    const valoKerros = new WeakMap<HTMLElement, HTMLElement>();
    if (document.querySelector(".page-lyhytvideot, .page-verkkosivut, .page-graafinen-suunnittelu")) {
      for (const el of valoEls) {
        const pse = getComputedStyle(el, "::before");
        if (pse.content === "none" || !pse.backgroundImage.includes("radial-gradient")) continue;
        const k = document.createElement("span");
        k.className = "osio-valo";
        k.setAttribute("aria-hidden", "true");
        el.prepend(k);
        el.setAttribute("data-valokerros", "");
        valoKerros.set(el, k);
      }
    }
    /* --valo-q:ta lukee vain osion ::before-valo (tai sen kopio
       .osio-valo). Kuvapohjaisella osiolla valoa ei ole, ja arvo
       kirjoitettiin silti koko osioon. */
    const valoQLukija = new WeakMap<HTMLElement, boolean>();
    for (const el of valoEls) {
      // content: none tarkoittaa, ettei ::before piirry lainkaan (jakson
      // sisalla valo on jaksolla, ei osiolla). Silloin lukijaa ei ole.
      const pse = getComputedStyle(el, "::before");
      valoQLukija.set(el, pse.content !== "none" && pse.backgroundImage.includes("radial-gradient"));
    }
    const valoY = new WeakMap<HTMLElement, { y: number; h: number }>();
    const mittaaValo = () => {
      for (const el of valoEls) {
        let y = 0;
        let n: HTMLElement | null = el;
        while (n) {
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        valoY.set(el, { y, h: el.offsetHeight });
      }
    };
    mittaaValo();
    window.addEventListener("resize", mittaaValo, { passive: true });

    /* PINNIIN PYSAHTYVA ETENEMA.
       --piirto jatkaa kasvuaan myos sen jalkeen kun osio on jaanyt
       kiinni pinoon, koska se mittaa vieritysta eika osion paikkaa
       ruudulla. Silloin osio seisoo paikallaan mutta sen sisalla oleva
       liike jatkuu, ja se lukeutuu automaattisena animaationa eika
       vierityksen ohjaamana.

       --kiinni kulkee nollasta yhteen tasan siihen asti kun osion
       alareuna koskettaa nakyman alareunaa, eli hetkeen jolloin
       position: sticky; bottom: 0 tarttuu. Sen jalkeen se on yksi ja
       liike seisoo samoin kuin osio.

       Mittaus on layout-pohjainen samasta syysta kuin muillakin:
       pinnatun elementin getBoundingClientRect jaatyy, offsetTop ei. */
    const kiinniEls = Array.from(document.querySelectorAll<HTMLElement>("[data-kiinni]"));
    const kiinniJoukko = new Set<Element>(kiinniEls);
    const kiinniY = new WeakMap<HTMLElement, { y: number; h: number }>();
    const mittaaKiinni = () => {
      for (const el of kiinniEls) {
        let y = 0;
        let n: HTMLElement | null = el;
        while (n) {
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        kiinniY.set(el, { y, h: el.offsetHeight });
      }
    };
    mittaaKiinni();
    window.addEventListener("resize", mittaaKiinni, { passive: true });

    let ro: ResizeObserver | null = null;
    if ((hehkuEls.length || valoEls.length || kiinniEls.length) && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        mittaaHehku();
        mittaaValo();
        mittaaKiinni();
      });
      ro.observe(document.body);
    }
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
    /* Korkeus nakymasta jolla vierintaan sidottu paljastus on valmis.
       0,45 = elementin keskikohta on 45 %:n korkeudella nakyman
       ylareunasta, eli hieman keskikohdan ylapuolella. */
    const RVS_END = 0.45;
    /* Kynnys jolla elementti lasketaan "esilla olevaksi" (.rvs-in).
       EI 1: se on sisaantulon paatepiste, joten silla ehdolla jatkuva
       animaatio alkaisi vasta kun liike on jo kokonaan ohi ja rivi on
       seissyt hetken paikallaan. 0,7 aloittaa sen jo ennen kuin
       sisaantulo on maalissa, jolloin kehotus jatkaa suoraan liikkeesta. */
    const RVS_IN = 0.7;
    /** Varjon porrastus, ks. --tilt-step alempana. */

    /* ---------- parallaksi ---------- */
    const pars = Array.from(
      document.querySelectorAll<HTMLElement>("[data-par], [data-parx]"),
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
    /* Sama kaista alasivuilla: SEO-sivulla heron jalkeen tuleva
       avainsananauha on tasan sama tilanne kuin etusivun logonauha,
       eli tumma kaista joka vierii navin ali. Ilman tata logo ja
       valikkopainike istuvat nauhan sanojen paalla juuri silla
       hetkella kun nauha liikkuu, ja se nayttaa tormaykselta.
       Valitsin on lista: etusivulla ensimmainen osuu, alasivulla
       toinen, eika kummallakaan ole molempia. */
    const stripBand = document.querySelector<HTMLElement>(".logostrip, .seo-tapeband");
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
    /* Etusivulla kaare on .stickyzone, alasivuilla .stickysub. Valitsin
       osui vain ensimmaiseen, joten alasivun hero ei saanut --hero-s:aa
       eika --hero-q:ta lainkaan: skrubbaus ei ollut hidas tai vaimea,
       sita ei ollut ollenkaan. */
    const hero = document.querySelector<HTMLElement>(
      ".stickyzone > .hero, .stickysub > .hero",
    );
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

    /* LUVUT ENSIN, KIRJOITUKSET LOPUKSI. onScroll luki elementtien
       sijainteja (getBoundingClientRect) ja kirjoitti CSS-muuttujia
       vuorotellen, jolloin jokainen luku kirjoituksen jalkeen pakotti
       selaimen laskemaan tyylit ja asettelun uudelleen kesken kehyksen.
       Nyt kirjoitukset kerataan jonoon ja ajetaan kerralla funktion
       lopussa. Arvot ja jarjestys ovat samat, joten liike ei muutu.
       Mitattu 30.9.2026. */
    /* Sama arvo kirjoitetaan vain kerran. Kaukana olevien osioiden luvut
       ovat rajoitettuja (0 tai 1) ja toistuivat joka kehys; Safari
       kasittelee jokaisen setPropertyn muutoksena, vaikka arvo ei muutu. */
    const viimeiset = new WeakMap<HTMLElement, Map<string, string>>();
    const aseta = (el: HTMLElement, n: string, v: string) => {
      let m = viimeiset.get(el);
      if (!m) {
        m = new Map();
        viimeiset.set(el, m);
      }
      if (m.get(n) === v) return;
      m.set(n, v);
      el.style.setProperty(n, v);
    };
    const valoKaiut = new WeakMap<HTMLElement, HTMLElement[]>();
    /* MUUTTUJA SUORAAN LUKIJALLE. Safari maalaa uudelleen sen elementin,
       jonka muuttuja muuttuu, eli koko osion kuvineen, vaikka muuttujaa
       lukisi vain yksi sen lapsi. Siksi isoilla sailioilla muuttuja
       kirjoitetaan niihin lapsiin, joiden tyylit sita lukevat (ks.
       globals.css: var(--rvp) ja var(--kiinni)). Arvo on sama, joten
       ulkonako ei muutu. Muilla sailio itse on lukija. */
    /* LUKIJAT SELVITETAAN TYYLISIVUILTA. --rvp ja --piirto kirjoitettiin
       osion sailioon (.nelja, .jana, .tahdisto, .porras-rivi ...), jolloin
       Safari laski ja maalasi koko osion uudelleen joka kehys. MITATTU
       Safarissa 30.9.2026: muuttujakirjoitus bodyyn 15 ms, lehteen 0 ms;
       kaikki muuttujat pois 29 -> 50 fps.

       Nyt arvo kirjoitetaan niihin sailion jalkelaisiin, joihin osuu
       jokin saanto joka lukee muuttujaa (var(--rvp) jne.). Saannon
       viimeisesta osasta kaytetaan vain ensimmainen tunniste (tagi,
       luokka tai attribuutti), joten tilaluokat kuten .rvs-in eivat
       rajaa pois. Pois jatetaan:
       - elementit toisen kirjoittajan sisalla (sisakkaiset data-rvs),
       - elementit joille CSS itse maarittaa saman muuttujan (esim.
         .porras-rivi { --piirto: ... }), ja niiden sisalto.
       Jos saantoja ei voi lukea tai lukijoita on paljon, arvo menee
       sailioon kuten ennenkin. Arvo on sama, joten ulkonako ei muutu. */
    const vanhatKohteet = location.search.includes("vanhat-kohteet");
    const jaa = (t: string, erotin: (ch: string) => boolean): string[] => {
      const osat: string[] = [];
      let d = 0;
      let a = 0;
      for (let i = 0; i < t.length; i++) {
        const ch = t[i];
        if (ch === "(" || ch === "[") d++;
        else if (ch === ")" || ch === "]") d--;
        else if (d === 0 && erotin(ch)) {
          osat.push(t.slice(a, i));
          a = i + 1;
        }
      }
      osat.push(t.slice(a));
      return osat.map((x) => x.trim()).filter(Boolean);
    };
    const subjekti = (sel: string): string | null => {
      const puhdas = sel.replace(/::[\w-]+(\([^)]*\))?/g, "").replace(/:(before|after)\b/g, "");
      const osat = jaa(puhdas, (ch) => ch === " " || ch === ">" || ch === "+" || ch === "~" || ch === "\n" || ch === "\t");
      const m = /^([a-zA-Z][\w-]*|\.[\w-]+|\[[^\]]+\]|#[\w-]+)/.exec(osat[osat.length - 1] ?? "");
      return m ? m[1] : null;
    };
    type Saannot = { lukijat: string; maarittajat: string; varma: boolean };
    const saantoMuisti = new Map<string, Saannot>();
    const lueSaannot = (nimi: string): Saannot => {
      const lukijat = new Set<string>();
      const maarittajat: string[] = [];
      let varma = true;
      const kaytto = new RegExp("var\\(\\s*" + nimi + "\\s*[,)]");
      /* voimassa: onko saannon @media/@supports-ehto nyt tosi. Maarittajiksi
         kelpaavat vain voimassa olevat saannot: esim. reduced-motion-
         lohkon ".lv-k { --piirto: 1 }" ei maarita mitaan tavallisessa
         nakymassa, ja sen laskeminen jatti kortit ilman arvoa. Lukijoiksi
         kelpaavat kaikki, koska ylimaarainen lukija ei muuta ulkonakoa. */
      const kay = (rules: CSSRuleList, sisakkainen: boolean, voimassa: boolean) => {
        for (const r of Array.from(rules)) {
          if (r instanceof CSSStyleRule) {
            const teksti = r.style.cssText;
            if (sisakkainen && (kaytto.test(teksti) || r.style.getPropertyValue(nimi) !== "")) varma = false;
            if (!sisakkainen) {
              if (voimassa && r.style.getPropertyValue(nimi) !== "") {
                for (const x of jaa(r.selectorText, (ch) => ch === ",")) {
                  if (!/::|:before|:after/.test(x)) maarittajat.push(x);
                }
              }
              if (kaytto.test(teksti)) {
                for (const x of jaa(r.selectorText, (ch) => ch === ",")) {
                  // Esim. ".proc-cta > *": viimeista osaa ei voi loysata,
                  // joten kaytetaan koko valitsinta ilman pseudoelementtia.
                  const sj = subjekti(x) ?? x.replace(/::[\w-]+(\([^)]*\))?/g, "").replace(/:(before|after)\b/g, "").trim();
                  if (sj) lukijat.add(sj);
                  else varma = false;
                }
              }
            }
            if (r.cssRules && r.cssRules.length) kay(r.cssRules, true, voimassa);
          } else if ("cssRules" in r && (r as CSSGroupingRule).cssRules) {
            let ehto = voimassa;
            if (r instanceof CSSMediaRule) ehto = ehto && window.matchMedia(r.media.mediaText).matches;
            else if (r instanceof CSSSupportsRule) ehto = ehto && CSS.supports(r.conditionText);
            kay((r as CSSGroupingRule).cssRules, sisakkainen, ehto);
          }
        }
      };
      for (const sh of Array.from(document.styleSheets)) {
        let rules: CSSRuleList | null = null;
        try {
          rules = sh.cssRules;
        } catch {
          // Toisen palvelimen tyylisivu (fontit): ei lueta, ei muuttujia.
          continue;
        }
        if (rules) kay(rules, false, true);
      }
      if (!lukijat.size) varma = false;
      return { lukijat: Array.from(lukijat).join(","), maarittajat: maarittajat.join(","), varma };
    };
    let lukijaMuisti = new WeakMap<HTMLElement, Map<string, HTMLElement[]>>();
    const kirjoitetut: [HTMLElement, string][] = [];
    // @media-ehdot voivat vaihtua koon muuttuessa: lasketaan uudelleen.
    window.addEventListener(
      "resize",
      () => {
        saantoMuisti.clear();
        lukijaMuisti = new WeakMap();
        // Vanhat kohteet tyhjiksi, ettei niihin jaa vanhentunutta arvoa
        // peittamaan uusien kohteiden periytyvaa arvoa.
        for (const [el, n] of kirjoitetut) {
          el.style.removeProperty(n);
          viimeiset.get(el)?.delete(n);
        }
        kirjoitetut.length = 0;
      },
      { passive: true, signal },
    );
    const lukijat = (el: HTMLElement, nimi: string, kirjoittajat: Set<Element>): HTMLElement[] => {
      if (vanhatKohteet) return [el];
      let m = lukijaMuisti.get(el);
      if (!m) {
        m = new Map();
        lukijaMuisti.set(el, m);
      }
      const vanha = m.get(nimi);
      if (vanha) return vanha;
      let t = saantoMuisti.get(nimi);
      if (!t) {
        t = lueSaannot(nimi);
        saantoMuisti.set(nimi, t);
      }
      let k: HTMLElement[] = [el];
      if (t.varma) {
        try {
          if (!el.matches(t.lukijat)) {
            const maar = t.maarittajat;
            const e = Array.from(el.querySelectorAll<HTMLElement>(t.lukijat)).filter((c) => {
              for (let a: Element | null = c; a && a !== el; a = a.parentElement) {
                if (kirjoittajat.has(a)) return false;
                if (maar && a.matches(maar)) return false;
              }
              return true;
            });
            // Ei yhtaan lukijaa: arvoa ei tarvitse kirjoittaa minnekaan.
            if (e.length <= 80) k = e;
          }
        } catch {
          k = [el];
        }
      }
      m.set(nimi, k);
      for (const x of k) kirjoitetut.push([x, nimi]);
      return k;
    };
    const jono: (() => void)[] = [];
    let kirjoitusVaihe = false;
    const W = (f: () => void) => {
      if (kirjoitusVaihe) jono.push(f);
      else f();
    };
    const tyhjenna = () => {
      for (let k = 0; k < jono.length; k++) jono[k]();
      jono.length = 0;
    };
    /* PEITETYT VAIHEET PIILOON. Pinotussa vierityksessa jokainen ohitettu
       vaihe jaa pinnattuna nakyman kohdalle seuraavan alle, eli ruudun
       kohdalla on paallekkain useita koko nakyman kokoisia kerroksia.
       Selain rasteroi ne kaikki, ja kun naytonohjaimen muisti tai aika
       loppuu kesken vierityksen, ylimman kerroksen puuttuvat palat
       nakyvat lapi: juuri se valkkyminen, jossa edellinen osio kuultaa
       hinnaston lapi (kuvakaappaus 30.9.2026).

       Kun kansi (pinon toinen lapsi, aina umpinainen pohja) on noussut
       puoli nakymaa vaiheen ylareunan yli ja peittaa nakyman alareunaan
       asti, vaihe ei voi nakya, ja se saa visibility: hidden. Puolen
       nakyman vara antaa selaimelle aikaa piirtaa vaihe takaisin ennen
       kuin kansi paljastaa siita pikseliakaan ylos vieritettaessa. */
    const vaiheet = Array.from(document.querySelectorAll<HTMLElement>(".pino, .stickysub"))
      .filter((p) => p.children.length >= 2)
      .map((p) => ({
        vaihe: p.firstElementChild as HTMLElement,
        kansi: p.lastElementChild as HTMLElement,
        piilossa: false,
      }));
    /* Samat kannet kertovat myos verkostokankaiden nakyvyyden. Kangas
       piirtaa joka kehys, ja Safarissa viisi paallekkaista kangasta oli
       vierityksen raskain yksittainen tyo, vaikka niista nakyi kerrallaan
       yksi tai kaksi. Kangas on piilossa, kun jokin sen oman alueen
       (sivun juuri tai kankaan kaare) sisalla oleva kansi peittaa
       nakyman samalla puolen nakyman varalla. NetBackdrop lukee tiedon
       attribuutista, ei asettelusta. */
    const kankaat = Array.from(document.querySelectorAll<HTMLElement>(".netbd")).map((nb) => {
      const alue = nb.classList.contains("netbd-cover")
        ? (nb.closest(".netbd-clip")?.parentElement ?? null)
        : nb.parentElement;
      return {
        nb,
        kannet: alue ? vaiheet.map((v) => v.kansi).filter((k) => k !== alue && alue.contains(k)) : [],
        piilossa: false,
      };
    });
    let ticking = false;

    /* LAHELLA OLEVAT (1.10.2026). Vierityskasittelija mittasi joka
       kehys KAIKKIEN parallaksi-, kaanto- ja paljastuselementtien
       sijainnin, myos tuhansien pikselien paassa olevien. Nyt
       IntersectionObserver pitaa kirjaa niista, jotka ovat nakymassa
       tai 60 % nakyman korkeudesta sen ulkopuolella, ja vain ne
       mitataan. Kaukana olevien arvo ei muutu (parallaksia ei
       kirjoiteta, paljastus on 0 tai 1), joten ulkonako on sama.
       Lahtiessaan elementti saa lopullisen arvonsa kerran. */
    const lahella = new Set<Element>([...pars, ...tilts, ...rvsEls]);
    const rvsLoppu = new Map<Element, number>();
    const lahIo =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (es) => {
              for (const e of es) {
                if (e.isIntersecting) lahella.add(e.target);
                else {
                  lahella.delete(e.target);
                  if (rvsJoukko.has(e.target)) rvsLoppu.set(e.target, e.boundingClientRect.top > 0 ? 0 : 1);
                }
              }
              if (!ticking) {
                ticking = true;
                requestAnimationFrame(onScroll);
              }
            },
            { rootMargin: "60% 0px" },
          )
        : null;
    if (lahIo) for (const el of lahella) lahIo.observe(el);
    signal.addEventListener("abort", () => lahIo?.disconnect());

    /* Mittaus: ?mittaa kirjaa vierityskasittelijan keston
       window.__vierityMs-taulukkoon. Ei vaikuta muuhun. */
    const mittaa = location.search.includes("mittaa");
    const mittaukset: number[] = [];
    if (mittaa) (window as unknown as { __vierityMs: number[] }).__vierityMs = mittaukset;

    /* ==================================================================
       PEHMENNETTY VIERITYSASEMA
       ==================================================================
       MIKSI: Mac-ohjauslevy ja Magic Mouse tuottavat pikselitarkkoja
       vierintatapahtumia, kymmenia pienia askelia sekunnissa. Tavallisen
       hiiren rulla tuottaa yhden napsautuksen kerrallaan, ja selain
       siirtaa sivua kertaheitolla noin sadan pikselin verran. Kaikki
       talla sivulla oleva vierintaan sidottu liike (parallaksi,
       paljastus, pystykaiut, osioiden valo, korttien kaanto) lasketaan
       vierityksen ARVOSTA, joten napsautushiirella jokainen arvo hyppaa
       saman verran. Liike ei ole raju vaan se katoaa: vali-asentoja ei
       piirretä kertaakaan, joten animaatiota ei nay, nakyy vain kaksi
       pysahtynytta tilaa.

       KORJAUS EI OLE VIERITYKSEN KAAPPAUS. Sivu sai aiemmin Lenisin, ja
       se ajoi window.scrollTo:ta omassa silmukassaan, mika rikkoi heron
       skriptatun vierityksen (ks. HeroScrub.tsx). Natiiviin vieritykseen
       ei siis kosketa lainkaan: sivu hyppaa tasan niin kuin
       kayttojarjestelma kaskee, ja sticky, selaimen oma haku ja
       saavutettavuus toimivat muuttumattomina.

       Sen sijaan KORISTEIDEN AJURI pehmennetaan. scP seuraa todellista
       vierityskohtaa eksponentiaalisesti, ja viive kertoo kuinka paljon
       todellinen vieritys on karannut sen edelle. Kaikki koristearvot
       lasketaan scP:sta (tai rect-lukemasta + viive, mika on sama rect
       siina nakymassa jossa scP on), jolloin sadan pikselin hyppy
       muuttuu saman mittaiseksi liu'uksi.

       TAU on sama 0,06 s kuin heron vierityselokuvalla
       (film-codec.ts SMOOTH_TAU), jotta hero ja muu sivu kulkevat
       samassa rytmissa. Ohjauslevylla askel on muutama pikseli, joten
       60 ms:n viive on mittaamaton; napsautushiirella se on tasan se
       mita puuttui.

       KATTO rajaa viiveen kahteen ja puoleen nakymaan. Ilman sita
       vierityspalkin raahaus tai ankkurilinkki jattaisi koristeet
       liukumaan sekunniksi jalkeen. */
    /* 0,035 eika 0,06. Sivulla on nyt Lenis (ks. Pehmeavieritys.tsx),
       joka pehmentaa jo itse vierityksen, jolloin tapahtumia tulee joka
       kehys pienin askelin eika viive ehdi kasvaa. Pitka aikavakio
       paalla olisi toinen pehmennys ensimmaisen paalla, eli turhaa
       laahausta. Lyhyt arvo suodattaa jaannoksen ja on se mika jaa
       jaljelle jos Lenis ei ole kaytossa (reduced motion, vanha selain,
       skripti ei lataudu). */
    const PEHMENNYS_TAU = 0.035;
    const PEHMENNYS_KATTO = 2.5;
    /* Alle taman eroa ei erota, ja silmukka saa pysahtya. */
    const PEHMENNYS_RAJA = 0.5;
    let scP = window.scrollY;
    let pehmHetki = 0;
    // Paljastusjarjestelmalla oli OMA scroll-kuuntelija ja OMA rAF, joka
    // ajoi rect-lukunsa vasta taman funktion kirjoitusten jalkeen - eli
    // yksi ylimaarainen pakotettu asettelulaskenta joka kehyksessa.
    // Nyt se ajetaan samassa tickissa ja lukuvaiheessa. Asetetaan vasta
    // kun revealNow on maaritelty, koska onScroll ajetaan kerran heti.
    let revealFn: (() => void) | null = null;

    const onScroll = () => {
      const mittausAlku = mittaa ? performance.now() : 0;
      kirjoitusVaihe = true;
      const vh = window.innerHeight;
      const h = document.documentElement;
      const sc = window.scrollY;

      /* Kehysriippumaton seuranta: kerroin lasketaan kuluneesta ajasta,
         joten liike on sama 60, 120 ja 144 hertsilla. dt rajataan, jotta
         valilehden palautus taustalta ei tee yhta jattiaskelta. */
      const hetki = performance.now();
      const dt = pehmHetki ? Math.min((hetki - pehmHetki) / 1000, 0.05) : 0;
      pehmHetki = hetki;
      if (reduce) {
        scP = sc;
      } else {
        const katto = vh * PEHMENNYS_KATTO;
        if (Math.abs(sc - scP) > katto) scP = sc - Math.sign(sc - scP) * katto;
        if (dt > 0) scP += (sc - scP) * (1 - Math.exp(-dt / PEHMENNYS_TAU));
        else scP = sc;
        if (Math.abs(sc - scP) < PEHMENNYS_RAJA) scP = sc;
      }
      /* Kuinka paljon todellinen vieritys on edella pehmennettya. Lisataan
         rect-lukemiin: r.top + viive on sama reuna siina nakymassa jossa
         pehmennetty vieritys on. */
      const viive = sc - scP;

      // Lukuvaihe ensin, ennen yhtaan kirjoitusta.
      revealFn?.();

      // PARALLAKSI on automaattista liiketta -> sammuu. Taman funktion
      // loppupaan GEOMETRIAN MITTAUS ei ole liiketta vaan asettelua, ja
      // se ajaa aina: muuten sticky-osiot jaavat ilman mittojaan ja
      // sivulle jaa ruudullisia tyhjaa.
      // LUE ENSIN, KIRJOITA VASTA SITTEN. Aiemmin rect luettiin ja tyyli
      // kirjoitettiin saman kierroksen sisalla, jolloin SEURAAVA luku
      // pakotti selaimen laskemaan asettelun synkronisesti uudelleen.
      // Etusivulla on 22 data-par- ja 7 data-tilt-elementtia, eli noin 29
      // turhaa asettelulaskentaa joka kehyksessa 12 000 px korkealla
      // dokumentilla.
      //
      // Kirjoitetut ominaisuudet (translate, CSS-muuttujat) EIVAT vaikuta
      // asetteluun, joten lukujen siirtaminen eteen ei muuta yhtaan
      // laskettua arvoa - se vain poistaa laskennat joita ei tarvita.
      if (!reduce) {
        /* NAKYMAN ULKOPUOLELLA EI KIRJOITETA. Parallaksiarvo muuttuu joka
           kehys koko sivun kaikille ~30 elementille, myos niille jotka ovat
           tuhansien pikselien paassa. Safari kasittelee jokaisen muutoksen
           tyylityona. MITATTU 1.10.2026: jokaisella sivun osuudella noin
           15 turhaa kirjoitusta kehyksessa. Arvo lasketaan samasta
           sijainnista heti kun elementti on puolen nakyman paassa, joten
           nakyva liike on sama. */
        const parNakyy: boolean[] = [];
        const parMids = pars.map((el, i) => {
          if (!lahella.has(el)) {
            parNakyy[i] = false;
            return 0;
          }
          const r = el.getBoundingClientRect();
          parNakyy[i] = r.bottom > -vh * 0.5 && r.top < vh * 1.5 && !el.closest("[data-peitossa]");
          return r.top + viive + r.height / 2 - vh / 2;
        });
        pars.forEach((el, i) => {
          if (!parNakyy[i]) return;
          const sp = parseFloat(el.dataset.par ?? "0");
          /* VAAKAKOMPONENTTI SAMASTA LUVUSTA. data-parx kayttaa tasan
             samaa etaisyytta nakyman keskelta kuin pysty, joten liike on
             sidottu vierintaan eika ajastimeen ja purkautuu samaa rataa
             takaisin. Molemmat kirjoitetaan YHTEEN translate-arvoon:
             kaksi erillista setPropertya samalle ominaisuudelle jattaisi
             vain jalkimmaisen voimaan. */
          const spx = parseFloat(el.dataset.parx ?? "0");
          W(() => { aseta(el, 
            "translate",
            `${(-parMids[i] * spx).toFixed(1)}px ${(-parMids[i] * sp).toFixed(1)}px`,
          ); });
        });
      }

      // VIERINTAAN SIDOTTU PALJASTUS. Sama lue-ensin-kirjoita-sitten -jako
      // kuin parallaksilla.
      //
      // ETENEMA on 0 kun elementin ylareuna on tasan nakyman alareunassa
      // ja 1 kun elementin KESKIKOHTA on RVS_END:n korkeudella. Aiemmin
      // jakajana oli pelkka elementin korkeus, jolloin liike oli ohi jo
      // silla hetkella kun kortti oli kokonaan nakyvissa - 906px
      // nakymassa 290px korkealla kortilla se tarkoitti 290px matkaa ja
      // kortti oli valmis viela nakyman alalaidassa. Nyt matka on
      // 0,45*vh + h/2 eli samoilla luvuilla 553px, ja liike jatkuu siihen
      // asti kunnes kortti on luettavalla korkeudella.
      if (!reduce) {
        const rvsP = rvsEls.map((el) => {
          if (!lahella.has(el)) return rvsLoppu.get(el) ?? -1;
          const r = el.getBoundingClientRect();
          const span = Math.max(vh * (1 - RVS_END) + r.height / 2, 1);
          return Math.min(Math.max((vh - (r.top + viive)) / span, 0), 1);
        });
        /* Hehkun etenema. Nolla kun elementin YLAREUNA on nakyman
           alareunassa, yksi kun se on noussut kolmanneksen nakymasta
           ylospain: liike tapahtuu silloin kun elementti on
           katsottavassa kohdassa, ei ruudun alalaidassa. */
        for (const el of hehkuEls) {
          const m = hehkuY.get(el);
          if (!m) continue;
          const matka = Math.max((vh * 0.62 + m.h * 0.35) * m.k, 1);
          const kuljettu = scP + vh - m.y;
          const pv = Math.min(Math.max(kuljettu / matka, 0), 1).toFixed(3);
          const pq = (Math.round(parseFloat(pv) * 25) / 25).toFixed(2);
          W(() => {
            for (const k of lukijat(el, "--piirto", hehkuJoukko)) aseta(k, "--piirto", pv);
            for (const k of lukijat(el, "--piirto-q", hehkuJoukko)) aseta(k, "--piirto-q", pq);
          });
        }

        for (const el of valoEls) {
          const m = valoY.get(el);
          if (!m) continue;
          const matka = Math.max(m.h + vh, 1);
          const kuljettu = scP + vh - m.y;
          const valo = Math.min(Math.max(kuljettu / matka, 0), 1);
          /* --valo-q on porrastettu (0,02) kopio osion taustavalolle. Valo
             on osion koko korkuinen liukuvari maskeineen, ja sen jokainen
             muutos maalasi koko pinnatun osion uudelleen joka kehys.
             MITATTU 30.9.2026: Miksi-osion vieritys 60 -> 86 fps pelkalla
             valon jaadytyksella. Porras siirtaa valoa alle 0,5 % kerrallaan
             eika sita erota; pystykaiku kayttaa edelleen tarkkaa --valoa. */
          /* Tarkka --valo kirjoitetaan vain pystykaiulle, joka on sen ainoa
             lukija. Safari (WebKit) maalaa elementin uudelleen jokaisesta
             sen omasta muuttujamuutoksesta, joten osion koko korkuinen
             kerros piirtyi joka kehys. MITATTU Safarissa 30.9.2026:
             muuttujakirjoitukset pois 24 -> 42 fps. Osio saa vain
             porrastetun --valo-q:n, joka muuttuu harvoin. */
          let kaiut = valoKaiut.get(el);
          if (!kaiut) {
            kaiut = Array.from(el.querySelectorAll<HTMLElement>(":scope > .kaiku"));
            valoKaiut.set(el, kaiut);
          }
          const vs = valo.toFixed(3);
          const vq = (Math.round(valo * 50) / 50).toFixed(2);
          W(() => {
            for (const k of kaiut!) aseta(k, "--valo", vs);
            const vk = valoKerros.get(el) ?? (valoQLukija.get(el) ? el : null);
            if (vk) aseta(vk, "--valo-q", vq);
          });
        }

        /* Nolla kun osion ylareuna koskee nakyman alareunaa, yksi kun
           sen alareuna koskee samaa reunaa eli kun pino tarttuu. */
        for (const el of kiinniEls) {
          const m = kiinniY.get(el);
          if (!m) continue;
          const kv = Math.min(Math.max((scP + vh - m.y) / Math.max(m.h, 1), 0), 1).toFixed(3);
          W(() => { for (const k of lukijat(el, "--kiinni", kiinniJoukko)) aseta(k, "--kiinni", kv); });
        }

        rvsEls.forEach((el, i) => {
          if (rvsP[i] < 0) return;
          rvsLoppu.delete(el);
          const rv = rvsP[i].toFixed(3);
          W(() => { for (const k of lukijat(el, "--rvp", rvsJoukko)) aseta(k, "--rvp", rv); });
          // PALAUTUVA "OSIO ON ESILLA" -TILA. Tarvitaan koska CSS ei osaa
          // haarautua muuttujan ARVOSTA: animaatiota ei voi kaynnistaa
          // ehdolla var(--rvp) === 1. Luokka on siis sama tieto luettavassa
          // muodossa, ja se poistuu itsestaan kun etenema laskee alle
          // ykkosen. classList.add/remove jo oikeassa tilassa ei muuta
          // DOMTokenListia, joten tasta ei tule kehyskohtaista tyota.
          /* Luokka vain kun tila vaihtuu: add/remove joka kehys oli joka
             elementille attribuuttimuutos joka kehys. */
          const onJo = el.classList.contains("rvs-in");
          if (rvsP[i] >= RVS_IN) { if (!onJo) W(() => { el.classList.add("rvs-in"); }); }
          else if (onJo) W(() => { el.classList.remove("rvs-in"); });
        });
      }

      // KAANTO on automaattista -> sammuu.
      if (!reduce) {
        // Sama jako kuin parseissa: kaikki rectit ensin, kirjoitukset sitten.
        const tiltNakyy: boolean[] = [];
        const tiltDs = tilts.map((el, i) => {
          if (!lahella.has(el)) {
            tiltNakyy[i] = false;
            return 0;
          }
          const r = el.getBoundingClientRect();
          tiltNakyy[i] = r.bottom > -vh * 0.5 && r.top < vh * 1.5 && !el.closest("[data-peitossa]");
          return (r.top + viive + r.height / 2 - vh / 2) / vh;
        });
        tilts.forEach((el, i) => {
        if (!tiltNakyy[i]) return;
        // Keskikohtien etaisyys, normalisoitu viewportin korkeuteen.
        const d = tiltDs[i];
        // 1 = keskella (taysi kaanto), 0 = TILT_RANGEn paassa keskelta
        // (tasainen). Elementti on siis "avautuneimmillaan" kun se on
        // parhaiten katsottavissa ja suoristuu tullessaan nakyviin seka
        // poistuessaan.
        const t = Math.max(1 - Math.abs(d) / TILT_RANGE, 0);
        // --tilt ei enaa kirjoiteta: CSS ei lue sita (ks. globals.css,
        // varjot kayttavat vakiota), ja se oli koko kortin muuttuja.
        // VARJOLLE PORRASTETTU ARVO. box-shadow'n sumennussade ja
        // siirtyma ovat maalausominaisuuksia: portaattomana ne maalaavat
        // ison sumennetun varjon uudelleen joka kehyksessa. Mitattuna
        // kayttajan Chromessa 158 hidasta kehysta (>18 ms) kasautui
        // valille scrollY 7815-8619, jossa nakyvissa ovat vain .cal ja
        // .case, ja pahimmat kehykset olivat 34,3-35,3 ms eli tasan
        // 4 x 8,33 ms vsync - kompositorin kadenssin pudotus, ei
        // skriptijumi. Long Animation Frames antoi 0 osumaa, joten
        // paasaikeen tyo oli suljettu pois.
        //
        // Kaanto (--tilt-rot) jaa portaattomaksi: transform on
        // komposiittia eika maksa maalausta.
        // --tilt-step EI ENAA KIRJOITETA. Portaistus ei riittanyt:
        // box-shadow on maalausominaisuus, ja sen paivittaminen .cal- ja
        // .case-korteilla sai coverin valkkymaan Chromessa. CSS:n
        // var(--tilt-step, 0) antaa nyt vakion 0, eli varjo on kiintea.
        // Todennettu eristamalla kayttajan Chromessa: arvon jaadyttaminen
        // poisti valkkymisen, palauttaminen toi sen takaisin.
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
        W(() => { aseta(el, "--tilt-rot", `${axis}(${main.toFixed(2)}deg)${back}`); });
        });
      }

      if (mbLayer) {
        // Ajuriksi coverin oma sijainti, ei raaka scrollY: arvo kulkee
        // 0 -> coverin korkeus juuri sen matkan aikana kun kuvio on
        // nakyvissa, joten liike osuu sinne missa se nahdaan.
        const mbRect = mbLayer.getBoundingClientRect();
        const p = -(mbRect.top + viive);
        // Eteneminen koko kuvioalueella, ei coverin korkeudella: kerros
        // ulottuu nyt footeriin asti ja liikkeen on jakauduttava sille.
        /* Nimittajan pohjaksi yksi nakyma. Etusivulla kerros on
           noin 6400px, joten arvo ei muutu. Alasivun hinnasto-osiossa
           kerros on 987px ja vanha nimittaja olisi ollut 81px: valo
           olisi kayttanyt koko ratansa 81 pikselin vierityksessa ja
           nayttanyt vilkkumiselta. Nyt rata jakautuu vahintaan yhden
           nakyman matkalle. */
        const mbProg = Math.min(Math.max(p / Math.max(mbRect.height - vh, vh), 0), 1);

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
            W(() => { aseta(el, "--mb-gy", `${gy.toFixed(1)}%`); });
            W(() => { aseta(el, "--mb-gx", `${gx.toFixed(1)}%`); });
          }
          // LIIKE background-positionilla, EI transformilla. Mika tahansa
          // kehyskohtainen transformi tolla nakymankokoisella kuviokerroksella
          // sai Chromen pudottamaan sisaltoa sen paalta: kalenteri, StatBand
          // ja .case-kortit katosivat ja ilmestyivat. Todennettu molempiin
          // suuntiin kayttajan omassa Chromessa. background-position on sama
          // tekniikka jolla gradientin kirkas kohta jo liikkuu, ja se on
          // todistetusti turvallinen. 120/200 -> 300/200px, vara 432/270px.
          const bx = (mbProg * 300).toFixed(1);
          const by = (-mbProg * 200).toFixed(1);
          for (const el of mbFacetsAll) W(() => { el.style.backgroundPosition = `${bx}px ${by}px`; });
          // Ryhmat kiertyvat VASTAKKAISIIN suuntiin ja eri vauhtia, jolloin
          // niiden leikkauspisteet vaeltavat ja fasettien rajat piirtyvat
          // sivun eri kohdissa eri tavalla. Kierto on SVG:n sisalla, joten
          // se ei voi paljastaa fasettikerroksen reunaa.
          // Ryhmien vastakkainen kierto on poistettu: se oli SVG-ryhmien
          // transformi, ja transformi tolla kerroksella on juuri se mika
          // rikkoo Chromen. Kaaret ovat nyt yksi taustakuva joka liikkuu
          // kokonaisuutena.
        }

        // Kertoimet ovat tarkoituksella ERI SUURUISIA JA ERI SUUNTIIN:
        // A liikkuu pystysuunnassa nopeammin, B vaakasuunnassa. Nain
        // lohkojen KESKINAINEN asema muuttuu koko matkan ajan eika koko
        // kuvio vain siirry yhtena kappaleena.
        if (mbA) {
          W(() => { mbA.style.transform =
            `translate3d(${(p * 0.09).toFixed(1)}px, ${(-p * 0.16).toFixed(1)}px, 0)` +
            ` rotate(${(p * 0.02).toFixed(2)}deg)`; });
        }
        if (mbB) {
          W(() => { mbB.style.transform =
            `translate3d(${(-p * 0.14).toFixed(1)}px, ${(p * 0.07).toFixed(1)}px, 0)` +
            ` rotate(${(-p * 0.011).toFixed(2)}deg)`; });
        }
        if (mbSweep) {
          // 1917px eika raitajakso 900px: 118 asteen kulmassa pystysiirtyma
          // vastaa kuvion jaksoa vasta kun se on jaettu cos(118°):lla.
          // Aiempi 420px ei osunut jaksoon lainkaan, joten kuvio HYPPASI
          // takaisin alkuun - juuri se nakyi toistona.
          W(() => { mbSweep.style.transform = `translate3d(0, ${(-(p * 0.3) % 1917).toFixed(1)}px, 0)`; });
        }
      }

      if (bdGrid && bdRing && bdWave) {
        const gx = -((sc * 0.02) % 240);
        const gy = -((sc * 0.012) % 300);
        W(() => { bdGrid.style.transform = `translate(${gx.toFixed(1)}px, ${gy.toFixed(1)}px)`; });
        W(() => { bdRing.style.transform = `translate(770px,110px) rotate(${(sc * 0.14).toFixed(1)}deg)`; });
        W(() => { bdWave.style.transform = `translateX(${(-(sc * 0.05) % 660).toFixed(1)}px)`; });
        const drawT = (Math.sin(sc / 380) + 1) / 2;
        bdPaths.forEach((p, i) => {
          if (!p) return;
          const off = 100 - ((drawT * 100 - i * 6 + 600) % 100);
          W(() => { p.style.strokeDashoffset = off.toFixed(1); });
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
        W(() => { aseta(refSticky, "--ref-scrim", (rp * REF_SCRIM_MAX).toFixed(3)); });
        // Sama etenema myos .refsille omana muuttujanaan. RAAKA rp (0..1),
        // ei rp * REF_SCRIM_MAX: overlayn oma gradientti maaraa
        // voimakkuuden, ja muuttuja saataa vain sen etenemaa. Ei uutta
        // laskentaa - rp on jo tassa ja se on 0,000 tasan pin-hetkella.
        W(() => { aseta(refCover, "--refs-dim", rp.toFixed(3)); });
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
        W(() => { aseta(afterCover, "--cover-fade", Math.min(Math.max(v, 0), 1).toFixed(3)); });
      }

      // Kolmas pari: Referenssien tummennus etenee kun .aftercover nousee
      // sen paalle. Sama geometriasta johdettu kaava kuin kahdella muulla.
      if (refCover && afterCover) {
        const apRaw = 1 - afterCover.getBoundingClientRect().top / vh;
        const ap = Math.min(Math.max(apRaw, 0), 1);
        W(() => { aseta(refCover, "--refs-scrim", (ap * REF_SCRIM_MAX).toFixed(3)); });
        // RAJAAMATON etenema NavCarriersille. Rajattu ap kyllastyy ykkoseen
        // heti kun .aftercover peittaa nakyman ylareunan, joten silla ei voi
        // ajoittaa mitaan sen jalkeen - ikkunan siirtaminen myohemmaksi
        // vaatii arvon joka jatkaa yli ykkosen. Negatiivisena se kertoo
        // kuinka kaukana .aftercover viela on, mika on Referenssien
        // keskijakson ainoa mitta. Ei uusi laskenta - sama rect, sama rivi.
        W(() => { aseta(refCover, "--refs-ap", apRaw.toFixed(3)); });
      }

      if (hero && cover) {
        /* HERON OMA SKRUBBAUSETENEMA, ennen coveria.
         *
         * --hero-q kertoo kuinka pitkalle COVER on noussut, eli se on
         * nollassa niin kauan kuin heroa katsotaan. Sille ei voi
         * ajoittaa mitaan mika tapahtuu heron AIKANA.
         *
         * --hero-s on sama mittaus toisesta paasta: kuinka pitkalle
         * heron oma pinnattu matka on kuljettu. Heron virtauslaatikko
         * on nakymaa korkeampi, ja se erotus ON se matka jonka ajan
         * hero seisoo paikallaan. Nollasta ykkoseen sen yli, ja cover
         * alkaa nousta vasta kun luku on jo yksi.
         *
         * Mitta luetaan kaareen ylareunasta eika heron omasta
         * rectista: pinnattu elementti ei liiku, joten sen oma rect
         * on vakio koko matkan ajan. */
        const wrap = hero.parentElement;
        if (wrap) {
          /* Kaksi nakymaa pois, ei yhta: viimeinen nakyma on coverin
           nousumatka, jonka ajan hero on yha pinnattuna mutta
           skrubbauksen on jo oltava valmis. */
          const matka = Math.max(hero.offsetHeight - vh * 2, 1);
          const kuljettu = -wrap.getBoundingClientRect().top;
          const hs = Math.min(Math.max(kuljettu / matka, 0), 1).toFixed(4);
          W(() => { for (const k of lukijat(hero, "--hero-s", new Set())) aseta(k, "--hero-s", hs); });
        }

        const p = Math.min(Math.max(1 - cover.getBoundingClientRect().top / vh, 0), 1);
        // RAAKA q HeroScrubille: 0 kun coverin ylareuna on nakyman
        // alareunassa, 1 kun cover peittaa heron. Sama mittaus kuin ennen,
        // vain ilman kerrointa - scrimin aikataulu on nyt HeroScrubissa,
        // jotta p:n ja q:n jaksot ovat yhdessa paikassa.
        /* --hero-q EI OLE CSS-MUUTTUJA. Sita lukee vain HeroScrub, joten
           arvo annetaan elementin kentassa. Muuttujana se kirjoitettiin
           heroon (167 lasta) joka kehys, ja Safari laski koko heron
           tyylit uudelleen. MITATTU 1.10.2026 Safarissa: sivun alku 28 fps. */
        W(() => { (hero as HTMLElement & { heroQ?: number }).heroQ = p; });
      }

      if (strip && copyW > 0) {
        stripOff += (sc - lastSc) * LOGO_SPEED;
        const x = -(((stripOff % copyW) + copyW) % copyW);
        W(() => { strip.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`; });
      }
      const kansiRect = new Map<HTMLElement, DOMRect>();
      for (const v of vaiheet) {
        const k = v.kansi.getBoundingClientRect();
        kansiRect.set(v.kansi, k);
        /* Vaihe on pinon sisalla ja kansi sen viimeinen lapsi, joten vaihe
           ei ulotu kannen alareunan alle. Se on siis kokonaan peitossa
           kun kannen ylareuna on vaiheen ylareunan ylapuolella, samalla
           puolen nakyman varalla. Aiempi ehto vaati kannen ulottuvan
           nakyman alareunaan asti: sivun lopussa, kun alatunniste tulee
           nakyviin, kaikki kuusi vaihetta tulivat kerralla takaisin
           tarjousosion alle, ja Chrome valkytti tarjouksen kuvaa. */
        const s = v.vaihe.getBoundingClientRect();
        const piiloon = k.top <= Math.min(s.top, 0) - vh * 0.5 && k.bottom >= Math.min(s.bottom, vh);
        if (piiloon !== v.piilossa) {
          v.piilossa = piiloon;
          W(() => {
            if (piiloon) v.vaihe.setAttribute("data-peitossa", "");
            else v.vaihe.removeAttribute("data-peitossa");
          });
        }
      }
      for (const kn of kankaat) {
        const piiloon = kn.kannet.some((k) => {
          const r = kansiRect.get(k);
          return !!r && r.top <= -vh * 0.5 && r.bottom >= vh;
        });
        if (piiloon !== kn.piilossa) {
          kn.piilossa = piiloon;
          W(() => {
            if (piiloon) kn.nb.setAttribute("data-kangas-piilossa", "");
            else kn.nb.removeAttribute("data-kangas-piilossa");
          });
        }
      }
      lastSc = sc;

      navAndProgress(sc, h, scP);
      kirjoitusVaihe = false;
      tyhjenna();
      ticking = false;
      if (mittaa) mittaukset.push(performance.now() - mittausAlku);

      /* HANTA. Vierintatapahtumia tulee vain silloin kun sivu oikeasti
         liikkuu, joten napsautushiirella niita tulee yksi per napsautus.
         Pehmennys tarvitsee kehyksia myos sen JALKEEN, muuten se jaa
         puoliväliin ja arvo hyppaa seuraavalla tapahtumalla. Silmukka
         pyorii vain niin kauan kuin eroa on, eli idlena tasta ei tule
         yhtaan kehysta. */
      if (!reduce && !ticking && Math.abs(window.scrollY - scP) >= PEHMENNYS_RAJA) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    };

    // Navi tiivistyy scrolled-tilassa 4px, joten tila vaihdetaan hystereesilla:
    // paalle vasta 14px:n jalkeen, pois vasta alle 4px:n. Ilman sita tila
    // varahtelisi kynnyksen tuntumassa ja jokainen vaihto siirtaisi sisaltoa.
    let scrolled = false;
    const navAndProgress = (sc: number, h: HTMLElement, scPeh: number = sc) => {
      if (!scrolled && sc > 14) scrolled = true;
      else if (scrolled && sc < 4) scrolled = false;
      if (nav && nav.classList.contains("scrolled") !== scrolled) W(() => { nav.classList.toggle("scrolled", scrolled); });

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
          W(() => { nav.classList.toggle("nav-away", overlap); });
        }
      }

      if (prog) {
        // scaleX eika width: palkki on taysilevyinen ja etenema on pelkka
        // kompositoritransformi, joten kehysta kohden ei tule asettelua,
        // maalausta eika rasterointia. Ks. #prog globals.css:ssa.
        const max = h.scrollHeight - window.innerHeight;
        /* Palkki kulkee pehmennetylla arvolla: se on koriste kuten muutkin
           vierintaan sidotut liikkeet, ja napsautushiirella raaka arvo
           naytti saman hypyn. */
        W(() => { prog.style.transform = `scaleX(${(max > 0 ? scPeh / max : 0).toFixed(4)})`; });
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
    // POIS KAYTOSTA. Mockupit eivat ole interaktiivisia: niissa ei ole
    // mitaan painettavaa, joten osoittimen mukaan kaantyminen lupaa
    // toiminnallisuutta jota ei ole. Lisaksi se kirjoitti transformin
    // inline ja yliajoi CSS:n kaariasetelman (translateZ + rotateY),
    // jolloin kaari hajosi heti kun hiiri osui nayttamoon.
    //
    // Koodi jaa paikalleen kytkettyna pois: jos kaanto joskus halutaan
    // takaisin, se on palautettava CSS-muuttujaan eika suoraan
    // transformiin, jotta se yhdistyy kaaren kanssa.
    const PHONE_TILT = false;
    const stage = document.getElementById("stage");
    if (PHONE_TILT && stage && finePointer && !reduce) {
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
      const paljasta: HTMLElement[] = [];
      document.querySelectorAll<HTMLElement>(".rv:not(.on)").forEach((el) => {
        const r = el.getBoundingClientRect();
        const area = r.width * r.height;
        if (area <= 0) return;
        const ih = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        const iw = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
        if ((ih * iw) / area >= 0.1) paljasta.push(el);
      });
      // Luokat vasta kaikkien lukujen jalkeen: lisays keskella silmukkaa
      // pakotti seuraavan getBoundingClientRectin laskemaan asettelun.
      for (const el of paljasta) W(() => el.classList.add("on"));
      // TOISSIJAINEN todistepolku. Ensisijainen on havainnoijan
      // ensimmainen toimitus; tama kattaa sen epatodennakoisen
      // tilanteen jossa IO ei toimita mutta tama varmistus onnistuu.
      // Ei enaa ainoa ehto, joten se ei voi jaada tayttymatta siksi
      // ettei kayttaja vierita.
      if (paljasta.length || document.querySelector(".rv.on")) rvProven();
    };
    revealNow();
    // HeroScrub ilmoittaa lukon purusta tapahtumalla, ei tuonnilla:
    // komponentit pysyvat erillaan. Synteettinen scroll ei auttaisi -
    // IO:ta ei ajeta scroll-tapahtumista vaan renderointisilmukasta.
    window.addEventListener("hero:unlocked", revealNow, { passive: true, signal });
    // Ei omaa kuuntelijaa eika omaa rAF:aa: onScroll kutsuu taman
    // lukuvaiheessaan. Yksi silmukka, yksi asettelulaskenta.
    revealFn = revealNow;

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

    /* ---------- PINON KORKEUS ----------
     * position: sticky; bottom: 0 EI TARTU jos elementti on nakymaa
     * korkeampi. Mitattuna: 1300px korkea laatikko 906px nakymassa
     * vieri kokonaan ohi ilman etta offsettia sovellettiin kertaakaan.
     * Se ei ole bugi vaan seuraus siita, etta bottom-rajoitusta ei voi
     * tayttaa ilman etta ylareuna vuotaa - ja selain jattaa silloin
     * siirtaman tekematta.
     *
     * Sama asia saadaan topilla, mutta vain jos offset tietaa
     * elementin korkeuden: top = nakyman korkeus - elementin korkeus.
     * Negatiivisena se tarkoittaa "tartu vasta kun alareuna on
     * nakyman alareunassa", eli tasan sen mita bottom: 0:n piti tehda.
     *
     * Korkeus ei ole vakio: se muuttuu fontin latauksesta, kuvien
     * latauksesta ja ikkunan koosta. ResizeObserver kattaa sisallon,
     * window-resize nakyman. Luku kirjoitetaan elementin omaan
     * muuttujaan, jolloin CSS hoitaa loput eika taalla lasketa
     * yhtaan sijaintia. */
    const pinoAlla = Array.from(
      document.querySelectorAll<HTMLElement>(".pino > :first-child"),
    );
    let pinoRo: ResizeObserver | null = null;
    const measurePino = () => {
      pinoAlla.forEach((el) => {
        el.style.setProperty("--pino-h", `${Math.round(el.offsetHeight)}px`);
      });
    };
    if (pinoAlla.length) {
      measurePino();
      pinoRo = new ResizeObserver(measurePino);
      pinoAlla.forEach((el) => pinoRo?.observe(el));
      window.addEventListener("resize", measurePino, { passive: true, signal });
    }

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
      pinoRo?.disconnect();
      refRo?.disconnect();
      ac.abort();
      puraTauko();
      puraMittaus();
      heroRo?.disconnect();
      ro?.disconnect();
      io.disconnect();
      io2.disconnect();
      lightsIo?.disconnect();
      frames.forEach((f) => cancelAnimationFrame(f));
    };
  }, []);

  return null;
}
