"use client";

import { useEffect, useRef } from "react";

import { getLenis } from "./SmoothScroll";

/**
 * Hero-scrub: valmis ruutusarja piirretaan koko heron tayttavalle
 * canvasille scrollin mukana.
 *
 * SARJAN PITUUS ON VAIN TASSA (SETS.d.n / SETS.m.n). Kaikki muu johtaa
 * sen set.n:sta, myos <picture>-fallback, joten lukua ei ole missaan
 * toisessa tiedostossa.
 *
 * SCROLL-TWEEN. Yksi vierityselele matkan aariplta ajaa koko heron lapi
 * lahdevideon omassa tahdissa. Mekanismi LIIKUTTAA VAIN SCROLL-ASEMAA:
 * scrubbaus pysyy puhtaana funktiona scrollY:sta, eika tween kirjoita
 * yhtaan animaatioarvoa elementteihin. Siksi kaikki muut scroll-sidotut
 * efektit (scrim, vaiheistus, cover, Referenssit) seuraavat mukana ilman
 * etta niista tarvitsee tietaa mitaan.
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
 * COVER-RAJAUS LASKETAAN CANVASIN SISALLA, ei CSS:n object-fitilla:
 *     s = max(cw / iw, ch / ih)
 *     drawImage(img, (cw - iw*s)/2, (ch - ih*s)/2, iw*s, ih*s)
 * object-fit ei koske canvasin PIIRTOPINTAAN vaan vain elementin
 * bittikartan sovitukseen, joten se olisi venyttanyt jo piirretyn kuvan.
 *
 * MUISTI. drawImage HTMLImageElementeista, ei createImageBitmapista.
 * Koko sarja purettuna olisi 531 MiB, joten residenttia joukkoa
 * rajataan liukuvalla ikkunalla (WIN_AHEAD / WIN_TAIL).
 *
 * LATAUSJARJESTYS. Ruutu 001 heti (20,9 kt) ja piirretaan; loput vasta
 * load-tapahtuman jalkeen, CONC kappaletta kerrallaan ja aina pienin
 * lataamaton seuraavaksi.
 *
 * ALOITUS PYSYY load-TAPAHTUMASSA. Mountissa sarja kilpailisi <picture>-
 * elementin LCP-kuvan kanssa samasta kaistasta; load takaa etta LCP on
 * jo maalattu.
 *
 * INVARIANTTI. Yhtenainen etuliite ei enaa pade, koska ikkuna ei ala
 * nollasta. Tilalla:
 *
 *     Ruutu 0 on pinnattu, joten residenttien joukko ei ole koskaan tyhja.
 *     Piirrolle annetaan aina j = lahin residentti indeksi i:sta.
 *     j valitaan residenteista, ei indeksiaritmetiikalla, joten se on
 *     rakenteeltaan residentti - piirto ei voi osua puuttuvaan ruutuun.
 *
 * Todistus ei nojaa latausjarjestykseen eika ikkunan sijaintiin, toisin
 * kuin etuliite. Kun j != i, canvasille jaa lahin olemassa oleva ruutu.
 */

const SETS = {
  d: { dir: "/hero/d/", n: 151 },
  m: { dir: "/hero/m/", n: 51 },
};
const WIDE = "(min-width: 980px)";
const COARSE = "(pointer: coarse)";
const DPR_MAX = 2;
/* Yhtaaikaisten ruutulatausten maara load-tapahtuman jalkeen. */
const CONC = 5;
/* LIUKUVA IKKUNA. 151 ruutua HTMLImageElementteina on 151 x 1280 x 720 x 4
   = 531 MiB purettua bittikarttaa; selain alkaisi hylata ja dekoodata
   uudelleen. Residenttina pidetaan pin + AHEAD + TAIL = 40 ruutua =
   140,6 MiB, katon 150 MiB alla. AHEAD 30 on 1,2 s toistoa 25 fps:lla. */
const WIN_AHEAD = 30;
const WIN_TAIL = 9;
/* SCROLL-TWEEN. Lahdevideon kesto: koko scrub-matka S kuljetaan tassa
   ajassa, joten nopeus on S / 6,040 s riippumatta lahtokohdasta. */
const SRC_MS = 6040;
/* Laukaisukynnys: tween lahtee vain matkan aariplta. */
const EDGE = 0.02;
/* Nappaimet jotka peruvat tweenin. Home/End/PageUp/PageDown/nuolet ovat
   vieritysnappaimia; Tab ja valilyonti ovat mukana kohdan 6 vuoksi -
   kohdistuksen siirto vierittaa selaimen omasta toimesta, ja tween ei saa
   pitaa nappaimistokayttajaa kiinni. */
const CANCEL_KEYS = new Set([
  "Home", "End", "PageUp", "PageDown",
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab", " ",
]);
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

const frameSrc = (dir: string, i: number) => `${dir}${String(i + 1).padStart(3, "0")}.webp`;

export default function HeroScrub() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const hero = cv.closest<HTMLElement>(".hero");
    const spacer = document.querySelector<HTMLElement>(".hero-spacer");
    // Sarja valitaan kerran mountissa eika resizessa: vaihto kesken
    // istunnon heittaisi jo ladatut ruudut pois ja hakisi koko uuden.
    const wide = window.matchMedia(WIDE).matches;
    const set = wide ? SETS.d : SETS.m;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Liukuva ikkuna vain tyopoydalla: mobiilisarja on 51 x 1024 x 576 x 4
    // = 120 MiB eli katon alla, joten haatoa ei tarvita. Kun ikkuna on pois,
    // rajat asetetaan sarjan pituudeksi ja sama koodipolku pitaa koko
    // sarjan residenttina.
    const slide = wide;
    const AHEAD = slide ? WIN_AHEAD : set.n;
    const TAIL = slide ? WIN_TAIL : set.n;
    // Tween ei ole kosketuslaitteilla (iOS:n momentum-vieritysta ei voi
    // luotettavasti pysayttaa preventDefaultilla) eika reduced-motionissa.
    const tweenOn = wide && !reduce && !window.matchMedia(COARSE).matches;

    const imgs: (HTMLImageElement | null)[] = new Array(set.n).fill(null);
    const inflight = new Set<number>();
    let active = 0;
    let idx = 0;
    let dir = 1;
    let shown = -1;
    let raf = 0;
    let stopped = false;

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
        shown = -1;
      }
    };

    // Lahin residentti indeksi. Haku etenee ulospain i:sta, joten se
    // loytaa aina lahimman; tasatilanteessa pienempi indeksi voittaa.
    // Ruutu 0 on pinnattu, joten palautus on aina residentti.
    const nearest = (i: number) => {
      if (imgs[i]) return i;
      for (let d = 1; d < set.n; d++) {
        if (i - d >= 0 && imgs[i - d]) return i - d;
        if (i + d < set.n && imgs[i + d]) return i + d;
      }
      return 0;
    };

    // Ikkunan ulkopuoliset vapautetaan. removeAttribute("src") eika
    // src = "": tyhja src resolvoituu dokumentin base-URL:iin ja selain
    // hakisi sivun itsensa kuvana. Viittaus nollataan samalla, jotta
    // elementti on keraettavissa.
    const evict = (i: number) => {
      if (!slide) return;
      const lo = dir >= 0 ? i - TAIL : i - AHEAD;
      const hi = dir >= 0 ? i + AHEAD : i + TAIL;
      for (let k = 1; k < set.n; k++) {
        if (k < lo || k > hi) {
          const img = imgs[k];
          if (img) {
            img.removeAttribute("src");
            imgs[k] = null;
          }
        }
      }
    };

    const paint = (i: number) => {
      const img = imgs[i];
      if (!img || i === shown) return;
      shown = i;
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
    };

    const load = (i: number) =>
      new Promise<void>((done) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          imgs[i] = img;
          done();
        };
        img.onerror = () => done();
        img.src = frameSrc(set.dir, i);
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
    };
    const progress = () => {
      const span = spacer?.offsetHeight ?? 0;
      return span > 0 ? Math.min(Math.max(window.scrollY / span, 0), 1) : 0;
    };

    const onResize = () => {
      size();
      // size() nollaa shownin jos puskuri muuttui, joten sama ruutu
      // piirretaan uudelleen. nearest() takaa etta indeksi on residentti
      // myos silloin kun ikkuna on ehtinyt liukua sen ohi.
      paint(nearest(Math.max(shown, 0)));
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Reduced motion: ei scrubia eika sarjan latausta, vain viimeinen
    // ruutu paikallaan.
    if (reduce) {
      // Ei scrubia eika sarjan latausta, vain viimeinen ruutu. Tummennus
      // saa silti seurata scrollia: se ei ole liiketta. Tekstien
      // lopputila tulee CSS:n reduced-motion-saannosta, joten --st-arvoja
      // ei tarvitse kirjoittaa.
      const last = set.n - 1;
      load(last).then(() => {
        size();
        paint(last);
      });
      const still = () => {
        raf = requestAnimationFrame(still);
        const p = progress();
        put("--hero-glow", GLOW_MAX * smoothstep(GLOW_WIN[0], GLOW_WIN[1], p));
        const raw = hero ? parseFloat(hero.style.getPropertyValue("--hero-q")) : 0;
        const q = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 1) : 0;
        put("--hero-scrim", SCRIM_P * p + (SCRIM_Q - SCRIM_P) * (1 - (1 - q) * (1 - q)));
      };
      raf = requestAnimationFrame(still);
      return () => {
        stopped = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
      };
    }

    size();
    // Ruutu 0 on PINNATTU: se on <picture>-elementin LCP-kuva, ja sen
    // residenttius on se ehto joka pitaa nearest()-invariantin voimassa.
    // evict() aloittaa ykkosesta, joten sita ei voi vapauttaa.
    load(0).then(() => {
      if (stopped) return;
      size();
      paint(0);
    });

    const idle = (cb: () => void) =>
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => cb())
        : window.setTimeout(cb, 1);

    // KYSYNTAOHJATTU LATAAJA. Ennen ketju kulki 1 -> n kertaalleen; nyt
    // ikkuna liikkuu ja sama ruutu voidaan tarvita uudelleen, joten haku
    // kohdistuu aina ikkunan puuttuviin ruutuihin. Jarjestys: lahimmasta
    // ulospain ja kulkusuunta edella, koska seuraavaksi tarvittava ruutu
    // on kulkusuunnassa.
    //
    // Rinnakkaisuus CONC = 5: tehollinen aika ruutua kohti on
    // RTT/5 + koko/kaista, eli kaistan asettama lattia on saavutettavissa.
    // Viisi eika enempaa: isompi maara vain pilkkoisi kaistan pienempiin
    // osiin ilman etta ikkuna tayttyisi nopeammin.
    const missing = () => {
      const span = Math.max(AHEAD, TAIL);
      for (let d = 0; d <= span; d++) {
        const a = idx + dir * d;
        if (d <= AHEAD && a >= 0 && a < set.n && !imgs[a] && !inflight.has(a)) return a;
        const b = idx - dir * d;
        if (d <= TAIL && b >= 0 && b < set.n && !imgs[b] && !inflight.has(b)) return b;
      }
      return -1;
    };
    // Aloitus pysyy load-tapahtumassa: ennen sita sarja kilpailisi
    // <picture>-elementin LCP-kuvan kanssa samasta kaistasta. rAF-silmukka
    // herattaa pumpun vasta kun tama on kytketty paalle.
    let started = false;
    const pump = () => {
      if (stopped || !started) return;
      while (active < CONC) {
        const k = missing();
        if (k < 0) return;
        inflight.add(k);
        active++;
        load(k).then(() => {
          active--;
          inflight.delete(k);
          idle(pump);
        });
      }
    };
    // Ikkuna liikkuu myos ilman etta yksikaan lataus valmistuu, joten
    // pumppu herataan lisaksi rAF-silmukasta - mutta vain kun on tilaa,
    // jottei joka framessa tehda turhaa tyota.
    const rest = () => {
      started = true;
      pump();
    };
    if (document.readyState === "complete") rest();
    else window.addEventListener("load", rest, { once: true });

    /* ---------------------------- SCROLL-TWEEN ----------------------------
       Animoidaan VAIN window.scrollY. Kesto on lineaarinen ja mitoitettu
       niin etta nopeus on aina S / SRC_MS riippumatta lahtokohdasta:

           dur = SRC_MS * |to - from| / S     ->     |to - from| / dur = S / SRC_MS

       Sama kaava kaytetaan kaannoksessa, joten px/s ei muutu suunnan-
       vaihdossa. Ei easingia: "normaali nopeus" on videon oma rytmi.

       LENIS. Sivustolla on Lenis, joka ajaa window.scrollTo:ta omassa
       rAF-silmukassaan ja pitaa omaa targetScrolliaan. Pelkka
       window.scrollTo jaisi sen alle seuraavassa framessa. lenis.stop()
       ei kay: se lisaa lenis-stopped-luokan, joka asettaa html:lle
       overflow: clip. Siksi joka framessa asetetaan MOLEMMAT - natiivi
       sijainti ja Lenisin sisainen tavoite - samaan arvoon. Sivuloys:
       Lenisin oma wheel-kertyma ylikirjoittuu joka framessa, joten
       tweenia ei tarvitse suojella kuuntelijoiden jarjestykselta. */
    type Tween = { from: number; to: number; t0: number; dur: number; last: number };
    let tween: Tween | null = null;

    const spanPx = () => spacer?.offsetHeight ?? 0;
    const setScroll = (y: number) => {
      window.scrollTo({ top: y, behavior: "instant" });
      getLenis()?.scrollTo(y, { immediate: true, force: true });
    };
    const begin = (to: number) => {
      const from = window.scrollY;
      const S = spanPx();
      if (S <= 0 || Math.abs(to - from) < 1) return;
      tween = { from, to, t0: performance.now(), dur: (SRC_MS * Math.abs(to - from)) / S, last: from };
    };
    const cancel = () => {
      tween = null;
    };
    const stepTween = (now: number) => {
      if (!tween) return;
      // Ulkopuolinen vieritys (selaimen haku, kohdistuksen siirto,
      // ankkuri, vierityspalkki) tunnistetaan siita etta sijainti ei ole
      // se jonka viimeksi asetimme. Silloin tween vaistaa.
      if (Math.abs(window.scrollY - tween.last) > 2) return cancel();
      const u = Math.min((now - tween.t0) / tween.dur, 1);
      const y = tween.from + (tween.to - tween.from) * u;
      tween.last = y;
      setScroll(y);
      if (u >= 1) cancel();
    };

    const onWheel = (e: WheelEvent) => {
      if (!tweenOn || e.ctrlKey) return;
      const down = e.deltaY > 0;
      if (e.deltaY === 0) return;
      if (tween) {
        // Sama ele tuottaa wheel-tapahtumia viela n. sekunnin ajan. Jos
        // ne keskeyttaisivat tweenin, sama ele joka kaynnisti sen myos
        // tappaisi sen - siksi samansuuntainen syote KULUTETAAN.
        e.preventDefault();
        if (down !== tween.to > tween.from) begin(down ? spanPx() : 0);
        return;
      }
      const p = progress();
      if (down && p <= EDGE) {
        e.preventDefault();
        begin(spanPx());
      } else if (!down && p >= 1 - EDGE) {
        e.preventDefault();
        begin(0);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (CANCEL_KEYS.has(e.key)) cancel();
    };
    // Valilehti taustalle kesken tweenin: PERUUNTUU. Jatkaminen vaatisi
    // joko kuluneen ajan hylkaamista (jolloin tween venyisi) tai sen
    // huomioimista (jolloin sijainti hyppaisi ajan verran eteenpain).
    // Peruuntuminen on ainoa vaihtoehto jossa kumpaakaan ei tapahdu, ja
    // itsestaan jatkuva liike paluuhetkella olisi myos yllattava.
    const onHide = () => {
      if (document.hidden) cancel();
    };
    if (tweenOn) {
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey, { passive: true });
      window.addEventListener("hashchange", cancel, { passive: true });
      document.addEventListener("visibilitychange", onHide, { passive: true });
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      stepTween(now);
      const p = progress();
      const i = Math.round(p * (set.n - 1));
      // Kulkusuunta: tweenin aikana sen kohde on tarkempi lahde kuin
      // indeksin erotus, joka on nollassa hitaan liikkeen aikana.
      if (tween) dir = tween.to > tween.from ? 1 : -1;
      else if (i !== idx) dir = i > idx ? 1 : -1;
      idx = i;
      evict(i);
      if (started && active < CONC) pump();
      paint(nearest(i));
      schedule(p);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", rest);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", cancel);
      document.removeEventListener("visibilitychange", onHide);
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
    </div>
  );
}
