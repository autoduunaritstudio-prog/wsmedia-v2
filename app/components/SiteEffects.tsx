"use client";

import { useEffect } from "react";

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

    /* ---------- taustakuvio ---------- */
    const bdGrid = document.getElementById("bdGrid");
    const bdRing = document.getElementById("bdRing");
    const bdWave = document.getElementById("bdWave");
    const bdPaths = ["bdP1", "bdP2", "bdP3", "bdP4", "bdP5"].map((id) =>
      document.getElementById(id),
    );

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
      if (hero && cover) {
        const p = Math.min(Math.max(1 - cover.getBoundingClientRect().top / vh, 0), 1);
        hero.style.setProperty("--scrim-opacity", (p * SCRIM_MAX).toFixed(3));
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

    /* ---------- numerorullaus (lukukaista + case-kortit) ---------- */
    // Kaksi nuppia, molemmat tassa: milloin rullaus alkaa ja kauanko se
    // kestaa. Ne saadetaan yhdessa - liian aikainen laukaisu yhdessa lyhyen
    // keston kanssa tarkoittaa, etta luku on jo valmis kun se tulee
    // nakyviin. Sama havainnoija ja kesto ohjaavat molempia paikkoja, joten
    // ajoitus pysyy yhtenaisena.
    const COUNT_ROOT_MARGIN = "0px 0px 5% 0px"; // laukaisu: 5% vh:sta ennen taitetta
    const COUNT_DURATION = 2000;                // rullauksen kesto, ms

    const frames = new Set<number>();
    const spin = (el: HTMLElement) => {
      const target = (el.dataset.count ?? "").replace(/&nbsp;/g, " ");
      const chars = [...target];
      let t0: number | null = null;
      const dur = COUNT_DURATION;
      const tick = (ts: number) => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        el.textContent = chars
          .map((c, i) => {
            if (!/[0-9]/.test(c)) return c;
            const settle = ((i + 1) / chars.length) * 0.8;
            return p >= settle ? c : String(Math.floor(Math.random() * 10));
          })
          .join("");
        if (p < 1) frames.add(requestAnimationFrame(tick));
        else el.textContent = target;
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
      ac.abort();
      heroRo?.disconnect();
      io.disconnect();
      io2.disconnect();
      frames.forEach((f) => cancelAnimationFrame(f));
    };
  }, []);

  return null;
}
