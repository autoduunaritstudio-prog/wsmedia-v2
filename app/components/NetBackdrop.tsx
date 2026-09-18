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

/* KAIKKI KERROKSET PIIRTAVAT SAMAN KENTAN.
   Sivulla on useita ilmentymia: yksi sivutason kerros ja yksi jokaista
   peittavaa vaihetta kohti. Ne olivat aiemmin toisistaan riippumattomia
   satunnaiskenttia, joten kohdassa jossa toinen alkoi ja toinen loppui
   kuvio VAIHTUI toiseksi. Vari, voimakkuus ja vinjetti saatiin samoiksi,
   mutta pisteet eivat olleet, ja juuri se lukee rajana.

   Kaksi muutosta tekee kentasta jaetun:

   1. SIEMENNETTY ARVONTA. Sama siemen jokaiselle ilmentymalle, joten
      alkukentta on identtinen. mulberry32 on 32-bittinen laskuri-PRNG:
      muutama rivi, ei riippuvuutta, ja sama tulos joka selaimella.

   2. AIKA ON KELLO, EI KERTYMA. Pisteet eivat enaa liiku kehyksittain
      (p.x += vx * dt), koska kaksi ilmentymaa kaynnistyy eri hetkella
      ja toinen pysahtyy kun se ei ole nakyvissa - kertymat ajautuvat
      erilleen valittomasti. Sijainti lasketaan absoluuttisesta ajasta:
      x(t) = taita(x0 + vx * t). Taitos on sama kimpoaminen kuin ennen,
      kirjoitettuna suoraan sen sijaan etta se syntyisi askel
      kerrallaan. Nyt mika tahansa ilmentyma laskee samalla hetkella
      saman kentan riippumatta siita milloin se aloitti tai kuinka
      pitkaan se oli pysahdyksissa. */
type P = { x0: number; y0: number; vx: number; vy: number };

/* Kiintea siemen: kentan on oltava sama kaikkialla sivulla, ja saman
   myos latauskertojen valilla - muuten kuvio "arpoutuu uusiksi"
   jokaisella sivunvaihdolla ilman etta kukaan on sita pyytanyt. */
const SIEMEN = 0x5f3a79b1;
const arpoja = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
/* Kimpoaminen suljetulla valilla [0, L] suoraan lausekkeena:
   kolmioaalto jonka jakso on 2L. */
const taita = (u: number, L: number) => {
  if (L <= 0) return 0;
  const m = ((u % (2 * L)) + 2 * L) % (2 * L);
  return L - Math.abs(m - L);
};

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
type Props = {
  mount?: "fixed" | "cover";
  /**
   * Kelluvat alustamerkit. Maarittelematta: herossa kylla, coverissa
   * ei. true lisaa ne myos coveriin, false poistaa ne myos herosta.
   * Jalkimmainen on Verkkosivut-alasivua varten: sama tausta, mutta
   * Instagram- ja TikTok-tunnukset sivulla joka myy verkkosivuja
   * eivat ole kuviota vaan vaara lupaus.
   */
  merkit?: boolean;
};

/* JAETTU TIETO SIITA ONKO SIVUTASON KERROS PEITOSSA.

   Sivutason kerros on fixed, eli se leikkaa nakyman aina, myos taysin
   peitettyna - sen nakyvyytta ei voi lukea IntersectionObserverilla.
   Ehto oli siksi "ollaan sivun ylaosassa", ja se on vaara heti kun
   sivun LOPUSSA on osioita joiden alla sama kerros taas nakyy (UKK,
   CTA): kerros oli niissa pysahtyneena, eli se nayttää vanhaa hetkea
   samalla kun sen vieressa oleva peittava kerros nayttaa nykyista.
   Kentta on nyt kaikilla sama, joten ero ei ollut enaa kuviossa vaan
   AJASSA - ja juuri se nakyi rajana hinnaston ja UKK:n valissa.

   Peittavat kerrokset kertovat tassa kun ne peittavat nakyman
   kokonaan. Sivutason kerros kay aina kun yksikaan ei peita. */
let peitossa = 0;
const peittoKuuntelijat = new Set<() => void>();
const kerroPeitosta = (muutos: number) => {
  if (!muutos) return;
  peitossa = Math.max(0, peitossa + muutos);
  for (const f of peittoKuuntelijat) f();
};

export default function NetBackdrop({ mount = "fixed", merkit }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pts: P[] = [];
    /* Lasketut sijainnit tassa kehyksessa. Erillaan pisteiden
       alkuarvoista, jotta alkuarvot pysyvat muuttumattomina: niista
       lasketaan joka kehys uudelleen, ei niiden paalle. */
    let px = new Float64Array(0);
    let py = new Float64Array(0);
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
        const r = arpoja(SIEMEN);
        pts = Array.from({ length: n }, () => ({
          x0: r() * (w + PAN_X),
          y0: r() * fh,
          vx: (r() - 0.5) * 2 * SPEED,
          vy: (r() - 0.5) * 2 * SPEED,
        }));
        px = new Float64Array(n);
        py = new Float64Array(n);
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

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // Kimpoaminen reunoista, ei kierratysta: kierratys saa pisteen
      // ilmestymaan yhtakkia vastakkaiselle laidalle keskelle omaa
      // viivaverkkoaan. Rajat ovat KENTAN rajat, eivat nakyman.
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        px[i] = taita(p.x0 + p.vx * t, w + PAN_X);
        py[i] = taita(p.y0 + p.vy * t, fh);
      }
      // Kameran sijainti kentassa. Pystysuunta seuraa vieritysta suoraan;
      // vaakasuunta kulkee saman etenemän yli mutta puolikkaan jaksoa
      // eri vaiheessa (sini), jolloin nousu ei ole tasan suora.
      const ox = -(Math.sin(sp * Math.PI) * PAN_X);
      const oy = -(sp * PAN_Y);
      /* KENTTA ON NAKYMAN KOORDINAATEISSA, EI KANKAAN.
         Sivutason kerros on fixed eli sen ylareuna on aina nakyman
         ylareunassa. Peittavan vaiheen kerros on sticky osionsa
         sisalla: kun osion alareuna nousee nakyman alareunan ylapuolelle,
         sticky ei enaa pysy kiinni vaan liukuu osion mukana ylos -
         mitattuna 391 pikselia siina kohdassa jossa hinnasto paattyy.
         Kentta piirtyi silloin eri kohtaan kuin viereisessa
         kerroksessa, ja kuvio KATKESI ja hyppasi rajalla, vaikka
         kentta itse oli jo sama.

         Piirto siirretaan kankaan oman sijainnin verran, jolloin
         kentan y-koordinaatti tarkoittaa nakyman y-koordinaattia
         jokaisessa kerroksessa. Fixed-kerroksella siirto on nolla,
         joten sen kohdalla tama ei muuta mitaan. */
      ctx.save();
      ctx.translate(ox, oy);
      // Viivat ensin, pisteet paalle.
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          // Kirkkaus etaisyyden mukaan: viiva syttyy ja sammuu
          // asteittain eika ilmesty valahtaen kynnyksella.
          const a = (1 - Math.sqrt(d2) / LINK) * 0.5;
          ctx.strokeStyle = `rgba(${lineRgb},${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(px[j], py[j]);
          ctx.stroke();
        }
      }
      ctx.fillStyle = dotColor;
      for (let i = 0; i < pts.length; i++) {
        ctx.beginPath();
        ctx.arc(px[i], py[i], 1.6, 0, Math.PI * 2);
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
      if (mount === "cover") {
        const k = kaareRef;
        if (k) {
          const r = k.getBoundingClientRect();
          const nyt = r.top <= 0 && r.bottom >= window.innerHeight;
          if (nyt !== peittaa) {
            peittaa = nyt;
            kerroPeitosta(nyt ? 1 : -1);
          }
        }
      }
      /* Absoluuttinen aika, ei kertyma: ks. tyypin P kommentti. Sama
         luku jokaiselle ilmentymalle samassa kehyksessa. */
      draw(now / 1000);
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
    /* MITATTU: ehto kirjoitettiin kahdelle kankaalle, mutta niita on
       nyt NELJA. Lyhytvideot-sivulla on sivutason kerros, coverin
       kerros ja kaksi jakson kerrosta, ja kolme jalkimmaista ovat
       kaikki mount="cover". Vanha ehto "on vieritetty yli nakyman"
       oli tosi niille kaikille yhta aikaa, eli kolme kangasta
       pyori rinnakkain koko loppusivun ajan. Yksi kangas tekee
       kehyksessa n(n-1)/2 parivertailua 130 pisteella eli noin 8400,
       joten kolme kangasta on 25 000 turhaa vertailua kehyksessa.

       Coverin kerros EI ole fixed vaan sticky absoluuttisen
       .netbd-clipin sisalla, ja se laatikko on tavallinen osion
       mittainen laatikko. Sen nakyvyyden voi siis lukea suoraan
       IntersectionObserverilla. Vain fixed-kerros tarvitsee
       vierityksesta luetun ehdon, koska se leikkaa nakyman aina, myos
       taysin peitettyna. */
    let inView = mount !== "cover";
    /* Peittaako TAMA kerros nakyman kokonaan juuri nyt. Luetaan
       kaareesta, koska kangas itse on sticky eika kerro osion
       rajoista. */
    let peittaa = false;
    const shouldRun = () => {
      if (mount === "cover") return inView;
      /* SIVUTASON KERROS KAY AINA. Ehto oli ensin "ollaan sivun
         ylaosassa" ja sitten "yksikaan cover ei peita nakymaa
         kokonaan". Molemmat ovat vaaria samasta syysta: pinossa on
         useita paallekkaisia coverikerroksia, joista alempi voi yha
         peittaa nakyman silla hetkella kun ylempi on jo vetaytynyt
         puoliksi pois - laskuri on silloin yli nollan vaikka
         sivutason kerros NAKYY ruudun alaosassa. Pysahtynyt kerros
         nayttaa vanhaa hetkea, ja se on tasan se raja joka nakyi.

         Yksi kangas maksaa kehyksessa noin 8400 parivertailua. Se on
         mitattuna merkityksetonta sen rinnalla etta tausta katkeaa
         nakyvasti, joten ehto on nyt vain "valilehti on nakyvissa". */
      return true;
    };
    let awake = true;
    const setAwake = () => {
      const want = !document.hidden && shouldRun();
      if (want === awake) return;
      awake = want;
      if (!want) {
        cancelAnimationFrame(raf);
        raf = 0;
        /* Pysahtynyt kerros ei paivita peittoaan, joten se ei saa jaada
           laskuriin: se jaisi vaittamaan peittoa jota ei ole. */
        if (peittaa) {
          peittaa = false;
          kerroPeitosta(-1);
        }
      } else if (!raf) {
        prev = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const kaareRef = ref.current?.closest(".netbd-clip") ?? ref.current?.parentElement ?? null;
    /* Sivutason kerros herataan heti kun peitto muuttuu: se ei ole
       silloin omassa silmukassaan, joten se ei voi huomata muutosta
       itse. */
    if (mount !== "cover") peittoKuuntelijat.add(setAwake);
    let io: IntersectionObserver | null = null;
    if (mount === "cover" && typeof IntersectionObserver !== "undefined") {
      /* Kaare, ei kangas: kangas on sticky ja pysyy nakymassa vaikka
         sen oma osio olisi jo ohitettu. Kaare on osion mittainen. */
      const kaare = kaareRef;
      if (kaare) {
        io = new IntersectionObserver(
          (entries) => {
            inView = entries.some((e) => e.isIntersecting);
            setAwake();
          },
          { rootMargin: "20% 0px" },
        );
        io.observe(kaare);
      } else {
        inView = true;
      }
    }
    const onVis = () => setAwake();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", setAwake, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    setAwake();
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      /* Oma peitto-osuus pois laskurista, muuten purettu kerros pitaisi
         sivutason kerroksen ikuisesti pysahdyksissa. */
      if (peittaa) {
        peittaa = false;
        kerroPeitosta(-1);
      }
      peittoKuuntelijat.delete(setAwake);
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
      {mount === "fixed" ? (
        merkit === false ? null : <NetMarks />
      ) : merkit ? (
        <NetMarks variantti="jakso" />
      ) : null}
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
