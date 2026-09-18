"use client";

import { useEffect, useRef } from "react";

import { Film } from "./film-codec";
import { FILM } from "./film-tiedot";
import { LogoMark } from "./Logo";

/**
 * Hero-scrub: valmis ruutusarja piirretaan koko heron tayttavalle
 * canvasille scrollin mukana.
 *
 * SARJAN PITUUS ON VAIN TASSA (SETS.d.n / SETS.m.n). Kaikki muu johtaa
 * sen set.n:sta, myos <picture>-fallback, joten lukua ei ole missaan
 * toisessa tiedostossa.
 *
 * ETENEMA TULEE SPACERISTA, ei heron korkeudesta:
 *     p = clamp(scrollY / spacer.offsetHeight, 0, 1)
 *     i = round(p * (N - 1))
 * Hero on pinnattuna (top 0) ja spacer sen alla tuottaa scrollimatkan;
 * kun spacer on kulutettu, .coverin ylareuna on tasan nakyman
 * alareunassa ja seuraava vaihe alkaa. Kaava on scrollY:sta eika
 * rectista, joten se ei voi olla eri vaiheessa kuin SiteEffectsin
 * mittaukset - scrollY on yksi globaali luku framea kohti.
 *
 * NOPEUS ON KAYTTAJAN. Scrubilla ei ole omaa ajastusta: aiempi
 * scroll-tween on poistettu kokonaan, samoin sen tukirakenteet
 * (wheel-kuuntelijat, preventDefault-kulutus, Lenis-synkronointi,
 * suunnan paattely, aikakatkaisut). Etenema on pelkka scrollY.
 *
 * COVER-RAJAUS LASKETAAN CANVASIN SISALLA, ei CSS:n object-fitilla:
 *     s = max(cw / iw, ch / ih)
 *     drawImage(img, (cw - iw*s)/2, (ch - ih*s)/2, iw*s, ih*s)
 * object-fit ei koske canvasin PIIRTOPINTAAN vaan vain elementin
 * bittikartan sovitukseen, joten se olisi venyttanyt jo piirretyn kuvan.
 *
 * MUISTI. 76 x 1280 x 720 x 4 tavua = 267 MiB purettuna. Liukuvaa
 * ikkunaa ei tarvita: sarja on lyhyt ja koko joukko mahtuu muistiin.
 *
 * LATAUSJARJESTYS. Ruutu 001 heti ja piirretaan; loput vasta
 * load-tapahtuman jalkeen, CONC kappaletta kerrallaan, pienin
 * lataamaton seuraavaksi.
 *
 * ALOITUS PYSYY load-TAPAHTUMASSA. Mountissa sarja kilpailisi <picture>-
 * elementin LCP-kuvan kanssa samasta kaistasta; load takaa etta LCP on
 * jo maalattu.
 *
 * INVARIANTTI. Piirrolle annetaan aina j = lahin residentti indeksi
 * i:sta, valittuna residenteista eika indeksiaritmetiikalla. Ruutu 0 on
 * ladattu ennen kaikkea muuta, joten joukko ei ole koskaan tyhja.
 * Tama on tarpeen viela ikkunan poistonkin jalkeen: kerros vapautuu
 * RELEASE_AT-etuliitteella tai LOAD_TIMEOUTilla, siis aina vajaalla
 * sarjalla, ja silloin se on ainoa mika estaa piirron puuttuvaan
 * ruutuun.
 */

const SETS = {
  /* Tyopoydan sarja on olemassa KAHDESSA muodossa samalla ruutumaaralla:
     avif on ensisijainen ja webp varasarja. Mitattuna kayttajan
     M1 Prossa ruudulla 60: avif 29 kt / SSIM 0,987 / dekoodaus 7,0 ms,
     webp 45 kt / 0,985 / 8,4 ms. AVIF on siis pienempi, tarkempi JA
     nopeampi purkaa - varasarja on olemassa vain Safari 16.3:a
     vanhemmille, jotka eivat tunne muotoa lainkaan.
     Koko sarja: 5,3 MB vs 7,9 MB. */
  d: { dir: "/hero/d/", n: 151 },
  /* Kapealla naytolla ei scrubata, joten sarjaa ei ole - vain poster.
     n: 1 pitaa kaiken muun koodin ennallaan (imgs, settled, K, nearest)
     ilman erillista mobiilihaaraa. */
  m: { dir: "/hero/m/", n: 1 },
};
const WIDE = "(min-width: 980px)";
const DPR_MAX = 2;
/* LATAUSRUUDUN AIKAKATKAISU. 12 s laskettuna latauksen alusta. Se on
   varaventtiili, ei normaali reitti: RELEASE_AT tayttyy jokaisella
   mitatulla profiililla selvasti aiemmin. Katkaisun jalkeen scrubbaus
   toimii silla mita on ladattu (nearest-resident) ja loput tulevat
   taustalla. */
const LOAD_TIMEOUT = 12000;
/* VAPAUTUSKYNNYS POISTETTU. Se oli 60 ruudun yhtenainen etuliite
   151:n sarjasta, eli noin 1,98 MB - kerros odotti juuri niin monta
   ruutua etta scrubbaus ei kuluta niita loppuun ennen kuin loput ovat
   tulleet. Koko elokuva on 1,94 MB, joten sama odotus antaa nyt kaikki
   151 ruutua eika 60:ta, ja kynnys on tarpeeton. */

/* Scroll-vihje piiloon heti kun liike alkaa. Sama kynnys molempiin
   suuntiin, joten vihje palaa kun kayttaja palaa alkuun. */
const HINT_P = 0.02;
/* Vaiheistuksen ikkunat --hero-p:n yli. Smoothstep, ei lineaarinen.
   Tekstit alkavat kolmen sekunnin kohdalta lahdevideota. Lahde on
   151 freimia 25 fps:lla (6,040 s, varmistettu ffprobella); desktop-sarja
   on joka neljas lahdefreimi (38 kpl, indeksit 0..148) ja mobiili joka
   kolmas (51 kpl). t = 3,000 s on lahdefreimi 75, mika on desktopilla
   sarjaindeksi 18,75 / 37 ja mobiilissa 25 / 50 - molemmissa p = 0,5000
   tasan.
   h1 saa nyt saman kohtelun kuin muut, joten LCP-ehdokkaana on
   .hero-median <img> eika h1. */
const WIN: [number, number][] = [
  [0.56, 0.68],  // h1
  [0.72, 0.82],  // .sub
  [0.86, 0.96],  // .heroctas
];
/* Ylagradientti tekstiryhman taakse. Ryhma (h1 + .sub + .heroctas) on
   yhtena lohkona ylhaalla, joten gradientteja tarvitaan vain yksi.

   IKKUNA [0,56, 0,62] on h1:n ikkunan alkupuolisko: taysi arvo on
   saavutettava siina p:ssa jossa h1 saavuttaa opacity 0,5, ja smoothstep
   on symmetrinen, joten se on h1:n ikkunan keskikohta 0,62. Ennen 0,56
   arvo on TASAN 0 - kuva on siis koskematon koko alkuosan ajan, mika oli
   koko muutoksen syy.

   VOIMAKKUUS 0,36 ON MITATTU, ei peritty vanhasta 0,62:sta. Pienin arvo
   joka vie kaikki nelja elementtia yli 4,5:1:n on 0,3411 (sitova h1
   freimilla 048, 1440x900, kirkkain pikseli puhdas valkoinen, scrim
   siina 0,376). 0,36 on pienin sadasosan askel sen yli. */
const GLOW_MAX = 0.36;
const GLOW_WIN: [number, number] = [0.56, 0.62];
/* Globaali scrim, kaksi jaksoa. Gradienttikerrokset ovat pois paalta
   (--hero-glow-on), joten tama on ainoa tummennus.

     p = 0      : 0, ei tummennusta lainkaan
     p = 0 -> 1 : LINEAARISESTI 0 -> SCRIM_P
     q = 0 -> 1 : EASE OUT SCRIM_P -> SCRIM_Q, kayralla 1 - (1-q)^2

   Kayra on nopea alussa ja hidastuu loppua kohti: tummennus ehtii tehda
   tyonsa heti kun cover alkaa nousta eika jaa kiihtymaan siina vaiheessa
   kun hero on jo lahes peitossa.

   JATKUVUUS. Arvo on SCRIM_P molemmin puolin liitosta, koska q = 0 kun
   p = 1. Muutosnopeus scroll-pikselia kohti:
     scrubin puoli : SCRIM_P / S,  missa S = 2,24 * vh
     coverin puoli : (SCRIM_Q - SCRIM_P) * f'(0) / vh,  f'(0) = 2
   Suhde = (0,20 * 2 / vh) / (0,60 / (2,24 * vh)) = 0,4 * 2,24 / 0,6
         = 1,493. Riippumaton nakyman korkeudesta ja alle kahden, joten
   liitoksessa ei tunnu nykaysta. */
const SCRIM_P = 0.6;
const SCRIM_Q = 0.8;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

const frameSrc = (dir: string, i: number, ext = "webp") =>
  `${dir}${String(i + 1).padStart(3, "0")}.${ext}`;

/* AVIF-KOE POISTETTU. Se ratkaisi kumpi KUVASARJA haetaan, ja
   kuvasarjoja ei enaa ole: koko elokuva on yksi mp4 joka puretaan
   WebCodecsilla. Ruutu 0 jai webppina, koska se on <picture>-elementin
   LCP-kuva - se on ainoa jaljella oleva kuvatiedosto. */

export default function HeroScrub() {
  const ref = useRef<HTMLCanvasElement>(null);
  const load = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const hero = cv.closest<HTMLElement>(".hero");
    const spacer = document.querySelector<HTMLElement>(".hero-spacer");
    // Sarja valitaan kerran mountissa eika resizessa: vaihto kesken
    // istunnon heittaisi jo ladatut ruudut pois ja hakisi koko uuden.
    //
    // PUHELIMESSA EI SCRUBATA LAINKAAN. Sarja on siella pelkka kustannus:
    // 51 ruutua eli 1,2 MB mobiiliyhteydella, ja 100vh:n spacerilla koko
    // animaatio on ohi yhdella peukalon vedolla. Kapealla naytolla
    // nakyviin jaa <picture>-elementin poster, joka on LCP-kuva ja
    // ladataan joka tapauksessa. Vaiheistetut tekstit (--st1..3) ajetaan
    // silti, joten osio ei muutu staattiseksi - vain kuva pysyy
    // paikallaan.
    const wide = window.matchMedia(WIDE).matches;
    const set = wide ? SETS.d : SETS.m;
    /* RUUTU 0 HAETAAN AINA WEBPINA, muut avifina jos selain tukee.
       Syy on ettei LCP-kuvaa ladata kahdesti: <picture>-elementin <img>
       osoittaa juuri ruutuun 0 webpina, ja se on jo selaimen
       valimuistissa siina vaiheessa kun sarja alkaa. Sama tiedosto eri
       muodossa olisi uusi lataus keskella LCP:ta. Yhden ruudun 16 kt:n
       ero ei ole minkaan arvoinen sen rinnalla. */
    /* imgs sisaltaa enaa YHDEN kuvan: ruudun 0. Se on <picture>-
       elementin LCP-kuva ja siksi jo selaimen valimuistissa, ja se on
       se mika kankaalla nakyy siihen asti kunnes elokuva on purettu -
       ja se mika jaa nakyviin jos WebCodecsia ei ole. */
    const imgs: (HTMLImageElement | null)[] = new Array(set.n).fill(null);
    /** Elokuva. null = ei tuettu, ei viela ladattu, tai lataus kaatui. */
    let film: Film | null = null;
    /* LATAUKSEN ETENEMA 0..1. Kuvasarjan aikaan tama oli "pisin
       yhtenainen etuliite ladatuista ruuduista", koska scrubbaus kulutti
       ruudut jarjestyksessa ja aukkoinen joukko ei kattanut matkan alkua.
       Yhdella tiedostolla kysymys on yksinkertaisempi: kuinka suuri osa
       tavuista on tullut.

       MITTA ON SAMA KUIN ENNEN, vaikka luku laskettiin toisin. Vanha
       kynnys oli 60 ruutua avif-sarjasta eli noin 1,98 MB, ja koko
       elokuva on 1,94 MB. Odotus ei siis pitene, mutta sen jalkeen
       kaytossa on 151 ruutua eika 60. */
    let osuus = 0;
    let shownKey = "";
    let raf = 0;
    let stopped = false;

    // AVAUS ALUSTA. Hero on intro-animaatio, joten sen keskelta
    // aloittaminen ei ole mielekasta: selaimen oma palautus otetaan pois
    // kaytosta ja sijainti nollataan ennen kuin kerros haipyy.
    const restore = history.scrollRestoration;
    history.scrollRestoration = "manual";

    // Canvas mitoitetaan NAKYVAAN kokoon, dpr-katto 2. Kolmen ja neljan
    // dpr:n naytoilla 3x-puskuri maksaisi yli kaksinkertaisen taytto-
    // kaistan ilman etta 1280px levea lahde tarjoaa lisadetaljia.
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      if (w > 0 && h > 0 && (cv.width !== w || cv.height !== h)) {
        cv.width = w;
        cv.height = h;
        // Canvas tyhjeni koon vaihdossa, joten piirtoavain on
        // mitatoitava - muuten paint ohittaisi piirron samalla arvolla.
        shownKey = "";
      }
    };

    // Lahin residentti indeksi. Haku etenee ulospain i:sta, joten se
    // loytaa aina lahimman; tasatilanteessa pienempi indeksi voittaa.
    // Ruutu 0 ladataan ennen kaikkea muuta, joten palautus on residentti.
    const nearest = (i: number) => {
      if (film?.valmis) {
        const j = film.lahin(i);
        if (j >= 0) return j;
      }
      // Ennen elokuvaa (ja ilman WebCodecsia) kaytossa on vain ruutu 0.
      return 0;
    };

    // Todiste siita etta canvasilla on AIDOSTI sisaltoa: asetetaan vasta
    // onnistuneen drawImagen jalkeen. Pelkka ready-laskuri kertoo etta
    // ruudut on ladattu, ei sita etta yksikaan olisi piirretty.
    let painted = false;
    /* VideoFrame ja HTMLImageElement ilmoittavat mittansa eri nimilla.
       Ilman tata sama rajauslasku olisi kahtena kappaleena, ja juuri
       sellainen pari ajautuu erilleen. */
    const mitat = (x: CanvasImageSource) =>
      x instanceof HTMLImageElement
        ? { w: x.naturalWidth, h: x.naturalHeight }
        : { w: (x as VideoFrame).displayWidth, h: (x as VideoFrame).displayHeight };
    const blit = (img: CanvasImageSource, alpha: number) => {
      const m = mitat(img);
      const s = Math.max(cv.width / m.w, cv.height / m.h);
      const dw = m.w * s;
      const dh = m.h * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    /**
     * RUUTUJEN VALISSA SEKOITETAAN, ei hypata.
     *
     * ONGELMA MITATTUNA: .hero-spacer on 2029px ja ruutuja on 76, eli
     * yksi ruutu kestaa 26,7 pikselia vieritysta. Hitaassa vierityksessa
     * se nakyy portaana - kuva seisoo paikallaan 27px ja hyppaa sitten.
     *
     * RATKAISU ILMAN YHTAAN LISATAVUA: indeksi otetaan liukulukuna ja
     * kaksi vierekkaista ruutua ristihaivytetaan murto-osan mukaan.
     * Liike on hidas kameran peruutus, jossa lineaarinen sekoitus lukee
     * valiruutuna eika kaksoiskuvana. 76 ruutua muuttuu nain 1824
     * portaaksi eli 1,1 pikseliin porrasta kohti.
     *
     * Sekoitus kvantisoidaan 1/24:aan, jotta piirto ohitetaan kokonaan
     * kun mikaan ei ole muuttunut: ilman sita jokainen frame piirtaisi
     * uudelleen myos paikallaan seistessa.
     *
     * HINTA on toinen drawImage niina kehyksina joissa sekoitetaan.
     * Se on tarkoituksella kompositoinnin puolella eika uutta latausta:
     * lisaruudut olisivat maksaneet 3,8 MB.
     */
    const BLEND_STEPS = 24;
    /** Ruutu i piirrettavana: elokuvasta jos on, muuten ruutu 0. */
    const kuva = (i: number): CanvasImageSource | null =>
      (film?.valmis ? film.hae(i) : null) ?? (i === 0 ? imgs[0] : null);
    const paint = (fi: number) => {
      const i0 = Math.min(Math.floor(fi), set.n - 1);
      const a = nearest(i0);
      const bi = i0 + 1;
      // Sekoitetaan VAIN jos seuraava ruutu on oikeasti purettuna ja pohja
      // osui haettuun indeksiin. Jos nearest jouduttiin hakemaan kauempaa,
      // valissa ei ole mitaan jarkevaa sekoitettavaa.
      const bKuva = bi < set.n ? kuva(bi) : null;
      const canBlend = a === i0 && !!bKuva;
      const q = canBlend ? Math.round((fi - i0) * BLEND_STEPS) / BLEND_STEPS : 0;
      const aKuva = kuva(a);
      const key = `${a}|${q}`;
      if (!aKuva || key === shownKey) return;
      shownKey = key;
      blit(aKuva, 1);
      if (q > 0 && bKuva) blit(bKuva, q);
      if (!painted && cv.width > 0 && cv.height > 0) {
        painted = true;
        // Vapautus on voinut jaada odottamaan tata; yritetaan uudelleen.
        tick();
      }
    };

    /* RUUTU 0. Sama tiedosto kuin <picture>-elementin LCP-kuva, joten
       tama on kaytannossa valimuistiosuma eika uusi lataus. */
    const haeRuutu0 = () =>
      new Promise<void>((done) => {
        const img = new Image();
        img.decoding = "async";
        // Epaonnistunutkin pyynto ratkaisee lupauksen: muuten elokuvan
        // lataus ei kaynnistyisi lainkaan ja kerros odottaisi
        // aikakatkaisuun asti kuvaa joka ei koskaan tule.
        img.onload = () => {
          imgs[0] = img;
          done();
        };
        img.onerror = () => done();
        img.src = frameSrc(set.dir, 0);
      });

    // Kaikki kerrokset ovat puhtaita funktioita p:sta ja q:sta. Kirjoitus
    // vain kun arvo oikeasti muuttuu, jottei joka frame likaa tyyleja.
    const prev: Record<string, string> = {};
    const put = (name: string, v: number) => {
      const t = v.toFixed(3);
      if (hero && prev[name] !== t) {
        prev[name] = t;
        hero.style.setProperty(name, t);
      }
    };
    const schedule = (p: number) => {
      for (let k = 0; k < WIN.length; k++) put(`--st${k + 1}`, smoothstep(WIN[k][0], WIN[k][1], p));
      put("--hero-glow", GLOW_MAX * smoothstep(GLOW_WIN[0], GLOW_WIN[1], p));
      const raw = hero ? parseFloat(hero.style.getPropertyValue("--hero-q")) : 0;
      const q = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 1) : 0;
      put("--hero-scrim", SCRIM_P * p + (SCRIM_Q - SCRIM_P) * (1 - (1 - q) * (1 - q)));
      put("--hero-hint", p > HINT_P ? 0 : 1);
    };
    const progress = () => {
      const span = spacer?.offsetHeight ?? 0;
      return span > 0 ? Math.min(Math.max(window.scrollY / span, 0), 1) : 0;
    };

    const onResize = () => {
      size();
      // Piirretaan sama kohta uudelleen uuteen kokoon. Etenema luetaan
      // scrollista eika muistetusta indeksista: se on aina ajan tasalla
      // eika voi ajautua erilleen rAF-silmukan kanssa.
      paint(progress() * (set.n - 1));
    };
    window.addEventListener("resize", onResize, { passive: true });

    // LATAUSRUUTU. Palkki seuraa TODELLISTA latausta: leveys on
    // count / set.n, ei ajastinta. Arvo kirjoitetaan suoraan DOMiin eika
    // Reactin tilaan, jottei 76 latausta tuota 76 uudelleenrenderointia.
    let timer = 0;
    let released = false;
    /**
     * force = varaventtiili. LOAD_TIMEOUT purkaa lukon EHDOTTOMASTI,
     * myos jos piirtoa ei koskaan tapahdu: kayttaja ei saa jaada
     * lukkoon rikkinaisen canvasin takia.
     *
     * Muutoin vaaditaan todennettu piirto - canvasilla on koko ja
     * vahintaan yksi drawImage on onnistunut ladatulla ruudulla. Mitattu
     * tila on jo nyt oikea (3456x1984, sisaltoa 100 %, 1 piirto
     * vapautushetkella molemmilla moottoreilla), joten tama ei korjaa
     * havaittua vikaa vaan estaa sen luokan: vapautus ei voi ohittaa
     * piirtoa vaikka ajoitus muuttuisi.
     */
    const release = (force = false) => {
      if (released) return;
      if (!force && !painted) return;
      released = true;
      window.clearTimeout(timer);
      // Ankkurilinkki menee nollauksen edelle: kayttaja on pyytanyt
      // tiettya kohtaa sivulla, ei introa. Sama ehto kuin
      // SmoothScrollin sivunvaihtonollauksessa.
      if (!window.location.hash) window.scrollTo(0, 0);
      document.documentElement.classList.remove("hero-locked");
      load.current?.classList.add("is-gone");
      // Lukon purku ei itsessaan laukaise IntersectionObserveria, joten
      // SiteEffectsin paljastusvarmistus herateta tapahtumalla. Tapahtuma
      // eika tuonti: komponentit eivat tunne toisiaan.
      window.dispatchEvent(new Event("hero:unlocked"));
    };
    // Edistyminen menee YHTENA muuttujana CSS:aan, ja sielta seka logon
    // tayttomaskiin etta palkin leveyteen. Mittari on 0 -> K eika
    // 0 -> set.n: kayttajalle ei nayteta palkkia joka pysahtyy
    // puoliveliin. Se on silti todellinen edistyminen - sama etuliite
    // jolla vapautus tehdaan - ja tayttyy tasan silla hetkella kun
    // kerros haipyy.
    const tick = () => {
      load.current?.style.setProperty("--hero-load-p", `${Math.min(osuus, 1) * 100}%`);
      if (osuus >= 1) release();
    };

    // Reduced motion: ei scrubia eika sarjan latausta, vain viimeinen
    // ruutu paikallaan.
    // SCRUBBAUS EI OLE AUTOMAATTISTA LIIKETTA: se etenee tasmalleen
    // kayttajan vierityksen mukaan ja pysahtyy kun han pysahtyy, joten
    // prefers-reduced-motion ei koske sita. Aiempi reduce-haara piirsi
    // vain viimeisen ruudun, jolloin .hero-spacerin 224vh jai
    // tayttamatta ja kayttaja vieritti ruudullisia tyhjaa.
    //
    // Sama ratkaisu kuin ydr-autohuolto.vercel.appissa: se pitaa scrubin
    // kaynnissa ja poistaa vain automaattiset osat (idle-ajelehdus,
    // pehmennys). Talla scrubilla ei ole kumpaakaan - asento luetaan
    // suoraan vierityksesta - joten mitaan ei tarvitse poistaa.
    // Sammutettavat asiat ovat CSS:ssa.
    document.documentElement.classList.add("hero-locked");
    // html.hero-locked { overflow: hidden } RIITTAA nyt yksin. Aiemmin ei
    // riittanyt, koska Lenis ajoi window.scrollTo:ta omassa
    // rAF-silmukassaan lukon ohi - overflow: hidden estaa kayttajan
    // vierityksen mutta ei skriptattua. Lenis on poistettu, joten
    // erillista pysaytysta ei tarvita.
    if (!window.location.hash) window.scrollTo(0, 0);

    size();
    haeRuutu0().then(() => {
      if (stopped) return;
      size();
      paint(0);
      // ELOKUVAN LATAUS ALKAA VASTA TASTA. Ruutu 0 on SAMA tiedosto kuin
      // LCP-<img>, joten sen valmistuminen on tasmalleen se hetki jolloin
      // LCP on haettu eika elokuva voi enaa kilpailla siita kaistasta.
      //
      // MIKSI EI window.load. Se odottaa koko sivun aliresursseja.
      // Mitattuna: Chromiumissa window.load 188 ms, WebKitissa 3193 ms
      // (116 pyyntoa / 4503 kt), ja ruudut latautuivat WebKitissa vasta
      // 3200 ms kohdalla - 3,2 sekunnin viiveesta 48 ms oli latausta ja
      // loput odotusta. Lupaus ei myoskaan voi "menna ohi" niin kuin
      // kuuntelija joka ehditaan kiinnittaa vasta tapahtuman jalkeen.
      void kaynnista();
    });

    let started = false;
    const kaynnista = async () => {
      if (started) return;
      started = true;
      /* KAPEALLA NAYTOLLA EI PURETA MITAAN. Elokuva olisi siella pelkka
         kustannus: 100vh:n spacerilla koko animaatio on ohi yhdella
         peukalon vedolla, ja <picture>-elementin poster on jo ladattu.
         Vapautus on pakotettava, koska osuus jaisi nollaan. */
      if (!wide) {
        release(true);
        return;
      }
      /* ILMAN WebCodecsia EI OLE VARASARJAA. Se olisi juuri se 13 MB
         kuollutta painolastia joka tasta poistettiin. Nakyviin jaa ruutu
         0 ja tekstien vaiheistus ajetaan normaalisti, eli osio ei ole
         rikki vaan liikkumaton. Chrome 94+, Safari 16.4+ ja Firefox
         130+ tukevat, joten tama on kapea kaista. */
      if (!Film.tuettu()) {
        release(true);
        return;
      }
      // KAYTTAJAA EI JATETA JUMIIN. Kello kaynnistyy vasta kun lataus
      // oikeasti alkaa, jottei hidas ensimmainen ruutu syo varaa.
      timer = window.setTimeout(() => release(true), LOAD_TIMEOUT);
      const f = new Film();
      try {
        await f.lataa(
          { src: FILM.src, frames: FILM.frames, width: FILM.width, height: FILM.height },
          (e) => {
            osuus = e;
            tick();
          },
        );
        if (stopped) {
          f.vapauta();
          return;
        }
        film = f;
        osuus = 1;
        shownKey = "";
        paint(progress() * (set.n - 1));
        tick();
      } catch {
        // Verkkovirhe tai odottamaton tiedostorakenne: ruutu 0 jaa
        // nakyviin ja lukko avataan, jottei kavija jaa odottamaan.
        f.vapauta();
        release(true);
      }
    };

    /* SYOTTEEN TASOITUS.
     *
     * MIKSI VASTA NYT. Kun yksi ruutu kesti 26,7 pikselia, karkea
     * porrastus PEITTI sen etta macOS toimittaa hitaan vierityksen
     * epatasaisina askelina. Nyt kun kuva seuraa vieritysta jatkuvasti,
     * sama epatasaisuus nakyy sellaisenaan - eli tokkiminen ei tullut
     * lisatysta tyosta vaan siita etta jitter paljastui.
     *
     * MITTAUS SULKEE POIS PIIRTOKUSTANNUKSEN: kayttajan Chromessa yksi
     * drawImage 1920x1080 -> 3456x1812 maksaa 0,66 ms ja sekoituksen
     * kaksi 0,92 ms. 120 Hz:n budjetti on 8,3 ms, joten lisays on 3 %
     * budjetista eika se voi olla tokkimisen syy.
     *
     * Tasoitus on eksponentiaalinen ja AIKAPERUSTAINEN, ei
     * kehysperustainen: sama vaimennus 60 ja 120 Hz:lla. Aikavakio 60 ms
     * tarkoittaa 400 px/s vauhdissa 24 pikselin eli 1,8 ruudun viivetta,
     * mika ei erotu mutta riittaa nielemaan askeleet.
     *
     * Sama tasoitettu arvo ohjaa MYOS overlay-vaiheita, joten kuva ja
     * tekstit pysyvat synkassa keskenaan. Kun ero kutistuu alle
     * puolen ruudun, arvo napsautetaan kohdalleen: muuten silmukka jaisi
     * kirjoittamaan ikuisesti haipyvia desimaaleja. */
    const SMOOTH_TAU = 0.06;
    let ps = -1;
    let prevT = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const target = progress();
      const dt = prevT ? Math.min((now - prevT) / 1000, 0.05) : 0;
      prevT = now;
      if (ps < 0 || dt === 0) ps = target;
      else {
        ps += (target - ps) * (1 - Math.exp(-dt / SMOOTH_TAU));
        if (Math.abs(target - ps) * (set.n - 1) < 0.5) ps = target;
      }
      // Liukuluku, ei pyoristys: paint sekoittaa murto-osan mukaan.
      // Kapealla naytolla canvasille ei piirreta mitaan: alla oleva
      // poster jaa nakyviin. Vaiheistus ajetaan silti.
      if (wide) {
        const fi = ps * (set.n - 1);
        /* MOOTTORI LUKEE ASENNON TASSA RUUDUSSA, ei scroll-tapahtumasta.
           Tapahtumia ei tule tasan yhta ruutua kohti, joten tapahtumasta
           paivitetty kohde olisi osassa ruutuja vanha ja osassa kahdesti
           uusi. Jarjestys on kiintea: aseta kohde, syota purkajalle,
           piirra, vapauta ikkunan ulkopuoliset. */
        if (film?.valmis) {
          film.aseta(fi);
          film.tayta();
        }
        paint(fi);
        film?.siivoa();
      }
      schedule(ps);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      stopped = true;
      history.scrollRestoration = restore;
      window.clearTimeout(timer);
      document.documentElement.classList.remove("hero-locked");
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      /* VideoFrame on GPU-muistia eika roskienkeruu vapauta sita:
         ilman tata purettu ikkuna jaisi elamaan navigoinnin yli. */
      film?.vapauta();
    };
  }, []);

  return (
    <div className="hero-media" aria-hidden="true">
      {/* LCP-ELEMENTTI. Canvas ei ole LCP-ehdokas eika inline-SVG
          myoskaan, ja h1 alkaa nyt opacity 0:sta - ilman tata
          alkunakymassa ei olisi yhtaan ehdokasta.

          Sama tiedosto jonka scrub hakee ensimmaisena (load(0)), ja
          <source>-ehto on sama 980px:n raja jolla sarja valitaan, joten
          selain nakee saman URL:n eika toista latausta synny.

          Ei loading="lazy" eika decoding="async": molemmat siirtaisivat
          maalausta ja siten LCP:ta. object-fit: cover keskitettyna on
          sama rajaus kuin canvasin drawImage-laskenta. */}
      <picture>
        <source media="(max-width: 979px)" srcSet={frameSrc(SETS.m.dir, 0)} />
        <img
          src={frameSrc(SETS.d.dir, 0)}
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
        />
      </picture>
      <canvas ref={ref} />
      {/* SCROLL-VIHJE. Nakyvyys tulee --hero-hintista, jonka rAF-silmukka
          kirjoittaa heroon: p > 0,02 -> 0, muuten 1. Palaa siis itsestaan
          kun kayttaja palaa alkuun. */}
      <div className="hero-hint">
        <span>Vieritä</span>
        <i />
      </div>
      {/* LATAUSRUUTU. Peittaa nakyman kunnes sarja on ladattu tai
          LOAD_TIMEOUT laukeaa. Logo on navin oma LogoMark, ei uusi
          piirros. Palkin leveys tulee latauslaskurista suoraan DOMiin. */}
      <div className="hero-load" ref={load}>
        {/* MERKKI ON MITTARI. Sama LogoMark kahdesti: alempi himmea,
            ylempi kirkas ja maskattu alhaalta ylos --hero-load-p:n
            mukaan. Merkin polkuihin ei kosketa - maski on elementin
            paalla, ei sen sisalla. */}
        <div className="hero-load-logo">
          <LogoMark className="hero-load-dim" />
          <LogoMark className="hero-load-fill" />
        </div>
        <div className="hero-load-track">
          <div className="hero-load-bar" />
        </div>
      </div>
    </div>
  );
}
