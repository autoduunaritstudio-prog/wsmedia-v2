"use client";

import { useEffect, useRef } from "react";

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
  d: { dir: "/hero/d/", n: 151, avifDir: "/hero/da/" },
  /* Kapealla naytolla ei scrubata, joten sarjaa ei ole - vain poster.
     n: 1 pitaa kaiken muun koodin ennallaan (imgs, settled, K, nearest)
     ilman erillista mobiilihaaraa. */
  m: { dir: "/hero/m/", n: 1 },
};
const WIDE = "(min-width: 980px)";
const DPR_MAX = 2;
/* Yhtaaikaisten ruutulatausten maara load-tapahtuman jalkeen. */
const CONC = 5;
/* LATAUSRUUDUN AIKAKATKAISU. 12 s laskettuna latauksen alusta. Se on
   varaventtiili, ei normaali reitti: RELEASE_AT tayttyy jokaisella
   mitatulla profiililla selvasti aiemmin. Katkaisun jalkeen scrubbaus
   toimii silla mita on ladattu (nearest-resident) ja loput tulevat
   taustalla. */
const LOAD_TIMEOUT = 12000;
/* VAPAUTUSKYNNYS. Kerros ei odota koko sarjaa vaan yhtenaista etuliitetta
   RELEASE_AT asti; loput ladataan taustalla samalla lataajalla.

   LUVUT LASKETTU UUDELLEEN kun sarja kaksinkertaistui 76 -> 151 ruutuun.
   Kulutus kaksinkertaistui, koska sama vieritysmatka kayttaa nyt kaksi
   kertaa enemman ruutuja; tuotto kasvoi vain hieman, koska keskimaarainen
   ruutu keveni 58 kt -> 51,6 kt.

   Rauhallinen ensikatselu on n. 400 px/s, mika on vh 700:lla 38,3
   ruutua/s (oli 19,1) ja vh 600:lla 44,6 ruutua/s. Tuotto CONC 5:lla:
   kuitu 112, tyypillinen 4G 28,7 ja hidas 4G 9,9 ruutua/s.

   Tyypillisella 4G:lla vajetta kertyy 9,6 ruutua sekunnissa sen 3,92 s
   ajan jonka matka kestaa, eli 38 ruutua; vh 600:lla 53. 60 kattaa
   molemmat. Kuidulla tuotto ylittaa kulutuksen jo ilman etuliitetta,
   joten kynnys maksaa siella 0,54 s.

   HITAALLE 4G:LLE EI ENAA OLE KYNNYSTA JOKA RIITTAISI: vaje olisi 111
   ruutua eli kaksi kolmasosaa koko sarjasta, ja sen odottaminen olisi
   pahempi haitta kuin itse puute. Siella - kuten trackpadin
   heilautuksessakin - piirtyy nearest-resident. Se heikentyi vahemman
   kuin luvut antavat ymmartaa: kun ruudut ovat kaksi kertaa tiheammassa,
   yksi puuttuva ruutu on puolet pienempi hyppy kuin ennen. */
const RELEASE_AT = 60;
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

/* AVIF-TUKI SELVITETAAN KERRAN, ILMAN VERKKOPYYNTOA.
   1x1-kuva data-URLina: dekoodaus on paikallinen, joten vastaus tulee
   yhden tai kahden kehyksen sisalla eika se voi hidastaa ensimmaista
   ruutua verkon yli. Tulos valimuistitetaan moduulitasolla, joten
   uudelleenmountissa ei tehda uutta koetta.

   img.decode() eika onload: Chrome ja Safari laukaisevat onloadin myos
   muodolle jota ne eivat osaa purkaa, jolloin koe antaisi vaaran
   positiivisen. decode() hylkaa lupauksen jos purku ei onnistu. */
const AVIF_PROBE =
  "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=";
let avifOk: Promise<boolean> | null = null;
const supportsAvif = () => {
  if (!avifOk) {
    avifOk = new Promise<boolean>((res) => {
      const img = new Image();
      img.onload = () => img.decode().then(() => res(true), () => res(false));
      img.onerror = () => res(false);
      img.src = AVIF_PROBE;
    });
  }
  return avifOk;
};
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
    const avifDir = "avifDir" in set ? (set as { avifDir: string }).avifDir : null;
    let useAvif = false;
    const srcFor = (i: number) =>
      useAvif && avifDir && i > 0 ? frameSrc(avifDir, i, "avif") : frameSrc(set.dir, i);

    const imgs: (HTMLImageElement | null)[] = new Array(set.n).fill(null);
    // RATKENNEET, ei ladatut: epaonnistunut pyynto merkitaan myos, jotta
    // yksi 404 ei pysayta etuliitetta eika jata kerrosta odottamaan
    // aikakatkaisuun asti. imgs[i] jaa silloin nulliksi ja nearest()
    // ohittaa sen.
    const settled: boolean[] = new Array(set.n).fill(false);
    // Pisin yhtenainen etuliite ratkenneista. Vapautus nojaa juuri
    // etuliitteeseen eika lukumaaraan: scrubbaus kuluttaa ruudut
    // jarjestyksessa, joten aukkoinen joukko ei kata matkan alkua.
    let ready = 0;
    const K = Math.min(RELEASE_AT, set.n);
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
      if (imgs[i]) return i;
      for (let d = 1; d < set.n; d++) {
        if (i - d >= 0 && imgs[i - d]) return i - d;
        if (i + d < set.n && imgs[i + d]) return i + d;
      }
      return 0;
    };

    // Todiste siita etta canvasilla on AIDOSTI sisaltoa: asetetaan vasta
    // onnistuneen drawImagen jalkeen. Pelkka ready-laskuri kertoo etta
    // ruudut on ladattu, ei sita etta yksikaan olisi piirretty.
    let painted = false;
    const blit = (img: HTMLImageElement, alpha: number) => {
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
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
    const paint = (fi: number) => {
      const i0 = Math.min(Math.floor(fi), set.n - 1);
      const a = nearest(i0);
      const bi = i0 + 1;
      // Sekoitetaan VAIN jos seuraava ruutu on oikeasti ladattu ja pohja
      // osui haettuun indeksiin. Jos nearest jouduttiin hakemaan kauempaa,
      // valissa ei ole mitaan jarkevaa sekoitettavaa.
      const canBlend = a === i0 && bi < set.n && !!imgs[bi];
      const q = canBlend ? Math.round((fi - i0) * BLEND_STEPS) / BLEND_STEPS : 0;
      const key = `${a}|${q}`;
      if (!imgs[a] || key === shownKey) return;
      shownKey = key;
      blit(imgs[a]!, 1);
      if (q > 0) blit(imgs[bi]!, q);
      if (!painted && cv.width > 0 && cv.height > 0) {
        painted = true;
        // Vapautus on voinut jaada odottamaan tata; yritetaan uudelleen.
        tick();
      }
    };

    const fetchFrame = (i: number) =>
      new Promise<void>((done) => {
        const img = new Image();
        img.decoding = "async";
        const fin = () => {
          // Epaonnistunutkin pyynto kasvattaa laskuria: muuten palkki
          // jaisi jumiin ja kerros odottaisi aikakatkaisuun asti ruutua
          // joka ei koskaan tule.
          settled[i] = true;
          while (ready < set.n && settled[ready]) ready++;
          tick();
          done();
        };
        img.onload = () => {
          imgs[i] = img;
          fin();
        };
        img.onerror = fin;
        img.src = srcFor(i);
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
      load.current?.style.setProperty("--hero-load-p", `${Math.min(ready / K, 1) * 100}%`);
      if (ready >= K) release();
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
    // Muotokoe kaynnistetaan heti, rinnan ruudun 0 haun kanssa: se on
    // paikallinen dekoodaus, joten se on valmis ennen kuin verkosta on
    // ehtinyt tulla mitaan.
    void supportsAvif();
    fetchFrame(0).then(() => {
      if (stopped) return;
      size();
      paint(0);
      // LOPPUSARJAN KAYNNISTYS. Ruutu 0 on SAMA tiedosto kuin
      // LCP-<img> (ks. <picture> alempana), joten sen valmistuminen on
      // tasmalleen se hetki jolloin LCP on haettu eika loppusarja voi
      // enaa kilpailla siita. rest() on idempotentti (started-lippu),
      // joten tama ei ole ristiriidassa varaventtiilien kanssa.
      //
      // MIKSI EI window.load YKSIN. Se oli aiemmin AINOA laukaisija, ja
      // se odottaa koko sivun aliresursseja. Mitattuna: Chromiumissa
      // window.load 188 ms, WebKitissa 3193 ms (116 pyyntoa / 4503 kt).
      // Ruudut latautuivat WebKitissa vasta 3200 ms kohdalla ja lukko
      // aukesi 3241 ms - eli 3,2 sekunnin viiveesta 48 ms oli itse
      // latausta ja loput pelkkaa odotusta. Lupaus ei voi myoskaan
      // "mennä ohi" niin kuin kuuntelija joka ehditaan kiinnittaa
      // vasta tapahtuman jalkeen.
      rest();
    });

    const idle = (cb: () => void) =>
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => cb())
        : window.setTimeout(cb, 1);

    // CONC 5: tehollinen aika ruutua kohti on RTT/5 + koko/kaista, eli
    // kaistan asettama lattia on saavutettavissa. Isompi maara vain
    // pilkkoisi kaistan pienempiin osiin.
    let started = false;
    const rest = async () => {
      if (started) return;
      started = true;
      // Kapealla naytolla ei haeta yhtaan ruutua. Vapautus on pakotettava:
      // ready jaisi nollaan eika kynnys tayttyisi koskaan, jolloin
      // latauskerros odottaisi LOAD_TIMEOUTin loppuun.
      if (!wide) {
        release(true);
        return;
      }
      // Muototuki ratkaistaan ennen ensimmaista hakua. Koe on
      // data-URL-dekoodaus eli paikallinen, joten odotus on kehyksen
      // luokkaa eika verkkopyynto - ja se on jo kaynnistynyt ruudun 0
      // haun rinnalla.
      useAvif = await supportsAvif();
      if (stopped) return;
      // KAYTTAJAA EI JATETA JUMIIN. Kello kaynnistyy vasta kun lataus
      // oikeasti alkaa, jottei hidas load-tapahtuma syo varaa.
      timer = window.setTimeout(() => release(true), LOAD_TIMEOUT);
      let next = 1;
      let active = 0;
      const pump = () => {
        if (stopped) return;
        while (active < CONC && next < set.n) {
          const i = next++;
          active++;
          fetchFrame(i).then(() => {
            active--;
            idle(pump);
          });
        }
      };
      idle(pump);
    };
    // VARAVENTTIILIT, eivat paapolku. Jaavat paikalleen sen varalta
    // ettei ruutu 0 lataudu lainkaan (verkkovirhe): silloin lataus
    // kaynnistyy silti eika sivu jaa latausruutuun LOAD_TIMEOUTiin asti.
    if (document.readyState === "complete") rest();
    else window.addEventListener("load", rest, { once: true });

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
      if (wide) paint(ps * (set.n - 1));
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
      window.removeEventListener("load", rest);
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
