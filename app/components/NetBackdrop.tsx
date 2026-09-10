"use client";

import NetMarks from "./NetMarks";
import { useEffect, useRef } from "react";

/**
 * ELAVA VERKOSTOTAUSTA.
 *
 * Pisteet ajelehtivat ja niiden valille piirtyy viiva kun ne ovat
 * riittavan lahella. Ruudukko EI ole canvasilla vaan CSS:n taustakuvana:
 * se on liikkumaton, joten sen piirtaminen joka kehyksessa olisi
 * pelkkaa hukkatyota.
 *
 * KAKSI LIIKETTA PAALLEKKAIN. Oma ajelehtiminen muuttaa verkoston
 * MUOTOA, ja vieritys siirtaa KAMERAA sen yli. Kentta on nakymaa
 * PAN_Y verran korkeampi, ja sivun etenema 0..1 valitsee mika kaista
 * siita on nakyvissa - eli verkosto kulkee sivun alusta loppuun tasan
 * saman matkan riippumatta siita kuinka pitka sivu on.
 *
 * KUSTANNUS ON RAJATTU KOLMESTA KOHDASTA:
 *
 * 1. Pisteiden maara skaalautuu PINTA-ALAAN eika ikkunan leveyteen, ja
 *    silla on katto. Tiheys 1 / 20000 px2 antaa 1728x906 nakymassa 78
 *    pistetta; katto 120 pitaa isotkin naytot kurissa. Parivertailuja on
 *    n(n-1)/2 eli 78:lla 3003 kappaletta kehyksessa - se on
 *    yksinkertaista aritmetiikkaa eika nay profiilissa.
 *
 * 2. dpr on katkaistu 1,5:een. Tama on pehmea hehkuva tausta jossa ei ole
 *    teravia reunoja, joten 2x ei toisi mitaan nakyvaa mutta
 *    kaksinkertaistaisi rasteroitavan pinta-alan.
 *
 * 3. Silmukka pysahtyy kun valilehti on piilossa
 *    (visibilitychange) - taustalla ei ole ketaan katsomassa.
 *
 * EI shadowBluria. Se on canvasin kallein yksittainen ominaisuus ja se
 * maalattaisiin joka viivalle uudelleen. Hehku tehdaan sen sijaan
 * CSS-kerroksella kankaan paalla, joka maalataan kerran.
 */

const DENSITY = 24000; // px2 per piste, laskettuna VIRTUAALIKENTAN alasta
const MAX_POINTS = 130;
const LINK = 180; // px, viivan piirtoetaisyys
const SPEED = 16; // px/s, ajelehtimisen huippunopeus
const DPR_MAX = 1.5;
/* Kuinka paljon kentta on nakymaa korkeampi. Tama on se matka jonka
   verkosto kulkee koko sivun vierityksen aikana, eli parallaksin
   liikevara. 900px on hieman yli yhden nakyman: liike on selvasti
   nahtavissa mutta verkosto ei ehdi vaihtua kokonaan toiseksi. */
const PAN_Y = 900;
/* Vaakasuuntainen kamera-ajo. Pienempi kuin pysty, koska sivua ei
   vieriteta sivusuunnassa eika liikkeella ole siella omaa syyta -
   se on vain rikkomassa sen etta kuvio nousisi tasan suoraan. */
const PAN_X = 220;
/* Vierityksen tasoitus, sama tekniikka ja sama perustelu kuin
   HeroScrubissa: raaka scrollY tulee epatasaisina askelina, ja
   jatkuvana taustana se nakyisi nykimisena. */
const SCROLL_TAU = 0.12;

type P = { x: number; y: number; vx: number; vy: number };

/**
 * mount kertoo kumpaan kerrokseen tama ilmentyma kuuluu.
 *
 * "fixed"  Heron takana. Kiinnitetty nakymaan, vaaleat varit.
 * "cover"  Coverin sisalla. Cover on LAPINAKYMATON - se on
 *          sticky-mekanismin ehto, ei tyylivalinta - joten heron takana
 *          oleva kerros ei nay sen lapi. Kuvio on siksi toistettava
 *          coverin omana kerroksena, tummilla vareilla.
 *
 *          position: sticky eika fixed: sticky-lapsi rajautuu vanhemman
 *          laatikkoon, joten kuvio alkaa ja loppuu tasan coverin mukana.
 *          Fixed-lapsi ei rajaudu vanhempaansa vaan olisi nakynyt myos
 *          heron kohdalla, kahtena kuviona paallekkain.
 */
type Props = { mount?: "fixed" | "cover" };

export default function NetBackdrop({ mount = "fixed" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pts: P[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;

    // Kentan korkeus, ei nakyman: pisteet elavat nakymaa korkeammassa
    // tilassa ja vieritys valitsee mika osa siita on nakyvissa.
    let fh = 0;

    // VARIT LUETAAN CSS:STA, EI KOVAKOODATA. Ruudukko on CSS:n
    // background-image ja viivat piirretaan taalla; jos molemmat
    // kantaisivat oman kopionsa varista, vaalea ja tumma variantti
    // paasisivat eroon toisistaan huomaamatta. Luku tehdaan size():ssa
    // eli kerran per koon muutos, ei kehyskohtaisesti.
    let lineRgb = "111,236,255";
    let dotColor = "rgba(180,245,255,.85)";
    const readColors = () => {
      const cs = getComputedStyle(cv.parentElement || cv);
      const l = cs.getPropertyValue("--net-rgb").trim();
      const d = cs.getPropertyValue("--net-dot").trim();
      if (l) lineRgb = l;
      if (d) dotColor = d;
    };

    const size = () => {
      readColors();
      dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      w = cv.clientWidth;
      h = cv.clientHeight;
      fh = h + PAN_Y;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(Math.round((w * fh) / DENSITY), MAX_POINTS);
      // Pisteet luodaan uudelleen vain jos maara muuttuu: pelkka ikkunan
      // korkeuden heilahdus mobiiliselaimen osoitepalkista ei saa
      // sekoittaa kuviota.
      if (n !== pts.length) {
        pts = Array.from({ length: n }, () => ({
          x: Math.random() * (w + PAN_X),
          y: Math.random() * fh,
          vx: (Math.random() - 0.5) * 2 * SPEED,
          vy: (Math.random() - 0.5) * 2 * SPEED,
        }));
      }
    };

    /* Sivun etenema 0..1. Nimittajana koko vieritettava matka, joten
       verkosto kulkee tasan PAN_Y pikselia sivun alusta loppuun
       riippumatta siita kuinka pitka sivu on. */
    const progress = () => {
      const span = document.documentElement.scrollHeight - window.innerHeight;
      return span > 0 ? Math.min(Math.max(window.scrollY / span, 0), 1) : 0;
    };
    let sp = -1;

    /* Etenema jaetaan CSS:lle, jotta alustamerkit kulkevat TASAN saman
       vierityksen mukana kuin canvas. Vaihtoehto olisi ollut oma
       scroll-kuuntelija merkeille, jolloin kaksi lukijaa olisi voinut
       ajautua eri arvoon saman kehyksen sisalla ja merkit olisivat
       nykineet verkkoon nahden.

       KIRJOITUS ON PORRASTETTU. Arvo pyoristetaan kolmeen desimaaliin
       ja kirjoitetaan vain kun se muuttuu: sama tekniikka kuin
       NavCarriersin --beam. Muuten joka kehys tuottaisi tyylimuutoksen
       myos silloin kun sivu on paikallaan. */
    const host = cv.parentElement;
    let prevSp = -1;
    const pushSp = () => {
      if (!host) return;
      const q = Math.round(sp * 1000) / 1000;
      if (q === prevSp) return;
      prevSp = q;
      host.style.setProperty("--nsp", q.toFixed(3));
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // Kimpoaminen reunoista, ei kierratysta: kierratys saa pisteen
        // ilmestymaan yhtakkia vastakkaiselle laidalle keskelle omaa
        // viivaverkkoaan. Rajat ovat KENTAN rajat, eivat nakyman.
        if (p.x < 0 || p.x > w + PAN_X) {
          p.vx *= -1;
          p.x = Math.min(Math.max(p.x, 0), w + PAN_X);
        }
        if (p.y < 0 || p.y > fh) {
          p.vy *= -1;
          p.y = Math.min(Math.max(p.y, 0), fh);
        }
      }
      // Kameran sijainti kentassa. Pystysuunta seuraa vieritysta suoraan;
      // vaakasuunta kulkee saman etenemän yli mutta puolikkaan jaksoa
      // eri vaiheessa (sini), jolloin nousu ei ole tasan suora.
      const ox = -(Math.sin(sp * Math.PI) * PAN_X);
      const oy = -(sp * PAN_Y);
      ctx.save();
      ctx.translate(ox, oy);
      // Viivat ensin, pisteet paalle.
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          // Kirkkaus etaisyyden mukaan: viiva syttyy ja sammuu
          // asteittain eika ilmesty valahtaen kynnyksella.
          const a = (1 - Math.sqrt(d2) / LINK) * 0.5;
          ctx.strokeStyle = `rgba(${lineRgb},${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = dotColor;
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    size();
    sp = progress();
    if (reduce) {
      // Yksi ruutu paikallaan. Kuvio on silti olemassa, vain liike jaa.
      pushSp();
      draw(0);
      const onResizeStatic = () => {
        size();
        draw(0);
      };
      window.addEventListener("resize", onResizeStatic, { passive: true });
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    let raf = 0;
    let prev = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // dt katkaistaan: valilehden palatessa taukolta prev on vanha ja
      // ilman kattoa kaikki pisteet hyppaisivat kerralla ruudun laidalle.
      const dt = prev ? Math.min((now - prev) / 1000, 0.05) : 0;
      prev = now;
      // Vieritys luetaan tassa silmukassa eika omassa kuuntelijassa:
      // yksi lukupaikka, yksi asettelulaskenta kehysta kohti.
      const target = progress();
      if (sp < 0 || dt === 0) sp = target;
      else sp += (target - sp) * (1 - Math.exp(-dt / SCROLL_TAU));
      pushSp();
      draw(dt);
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => size();

    /* KAKSI KERROSTA, MUTTA VAIN YKSI KAY KERRALLAAN.
       Sivulla on nyt kaksi kangasta (hero ja cover). Molempien
       pyorittaminen koko sivun ajan olisi tuplannut kustannuksen
       turhaan, koska kumpikin nakyy vain omalla puoliskollaan.

       Ehtoa ei voi lukea IntersectionObserverilla molemmille: coverin
       kerros on sticky ja rajautuu vanhempaansa, mutta heron kerros on
       fixed eli se "leikkaa" nakyman aina, myos taysin peitettyna.
       Siksi ehto luetaan vierityksesta: hero on peitetty kun on
       vieritetty yli nakyman korkeuden, ja cover ei ole viela tullut
       kun ollaan sen alapuolella. Raja on sama molemmille, joten
       kaistaa jossa kumpikaan ei kay ei ole. */
    const shouldRun = () => {
      const past = window.scrollY > window.innerHeight * 1.05;
      return mount === "cover" ? past : !past;
    };
    let awake = true;
    const setAwake = () => {
      const want = !document.hidden && shouldRun();
      if (want === awake) return;
      awake = want;
      if (!want) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        prev = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const onVis = () => setAwake();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", setAwake, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    setAwake();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", setAwake);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [mount]);

  const layer = (
    <div className={mount === "cover" ? "netbd netbd-cover" : "netbd"} aria-hidden="true">
      <canvas ref={ref} />
      {/* Hehku ja reunojen tummennus omana kerroksenaan: maalataan kerran
          eika joka kehyksessa niin kuin canvasin shadowBlur. */}
      <div className="netbd-glow" />
      {/* Alustamerkit hehkun PAALLA: vinjetti vaalentaa reunoja, ja sen
          alle jaaneet merkit olisivat haipyneet juuri niilla alueilla
          joille ne on sijoitettu.

          Vain herossa. Merkkien paikat on mitattu heron tyhjista
          kaistoista; coverissa samat kohdat ovat leipatekstin ja
          korttien alla, jolloin ne lukisivat likana tekstin takana. */}
      {mount === "fixed" ? <NetMarks /> : null}
    </div>
  );

  /* Coverin kerros kaaritaan absoluuttiseen laatikkoon jossa on
     overflow: clip.

     Ilman sita pinnattu kerros valuu coverin ULKOPUOLELLE: mitattuna
     coverin laatikko paattyi 590px:aan mutta kerros jatkui 906px:aan
     eli 316px footerin paalle. Sticky rajautuu vanhempaansa vain jos
     vanhemmalla on rajaus - pelkka korkeus ei riita, koska kerroksen
     oma marginaali on vedetty negatiiviseksi.

     Kaare on absoluuttinen, joten se ei vie tilaa virrassa eika siis
     tyonna coverin sisaltoa alaspain. overflow: clip eika hidden: clip
     ei tee elementista vieritettavaa, joten sticky-lapsi pinnautuu
     edelleen NAKYMAAN eika kaareeseen. hidden olisi rikkonut sen. */
  return mount === "cover" ? <div className="netbd-clip">{layer}</div> : layer;
}
