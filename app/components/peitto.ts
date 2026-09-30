/* PEITON TUNNISTUS PINOTUSSA VIERITYKSESSA.

   Sivun osiot ovat pinnattuja (sticky) ja seuraava vaihe nousee niiden
   PAALLE. IntersectionObserver ei tieda peitosta: pinnattu elementti on
   geometrisesti nakymassa koko sen ajan kun sen paalla on toinen osio.
   Siksi referenssikorttien videot jatkoivat toistoa sivun loppuun asti
   jonkin toisen osion alla. MITATTU 30.9.2026 1440x900: viisi
   piilossa soivaa videota lukitsi vierityksen 30 fps:iin.

   Tarkistus on osumatesti kahdessa pisteessa elementin sisalla: jos
   kummassakin pisteessa paallimmainen elementti on jokin muu kuin tama
   elementti tai sen esivanhempi, elementti on peitossa. Esivanhempi
   hyvaksytaan, koska pointer-events: none -lapsen kohdalla osuma menee
   sen alla olevalle vanhemmalle.

   Testi ajetaan vierityksen aikana korkeintaan kerran 120 ms:ssa ja
   aina vierityksen paatyttya, eli se ei ole kehyskohtaista tyota. */
export function seuraaPeittoa(el: HTMLElement, cb: (peitossa: boolean) => void): () => void {
  let tila: boolean | null = null;
  let ajastin = 0;
  let viimeksi = 0;

  const tarkista = () => {
    ajastin = 0;
    viimeksi = performance.now();
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    if (r.bottom <= 0 || r.top >= vh || r.width === 0) return;
    // Pisteet elementin NAKYVALTA osalta: korkea osio voi alkaa nakyman
    // ylapuolelta, jolloin sen oma keskikohta on ruudun ulkopuolella.
    const x0 = Math.max(r.left, 0);
    const x1 = Math.min(r.right, vw);
    const y0 = Math.max(r.top, 0);
    const y1 = Math.min(r.bottom, vh);
    let laskettu = 0;
    let peitettyja = 0;
    for (const fx of [0.25, 0.5, 0.75]) {
      for (const fy of [0.3, 0.6]) {
        const x = Math.min(Math.max(x0 + (x1 - x0) * fx, 1), vw - 1);
        const y = Math.min(Math.max(y0 + (y1 - y0) * fy, 1), vh - 1);
        const osuma = document.elementFromPoint(x, y);
        if (!osuma) continue;
        // Kiintea kerros (valikko, alapalkki, evasteilmoitus) kulkee
        // kaiken paalla koko sivun ajan. Sen alle osunutta pistetta ei
        // lasketa kumpaankaan suuntaan.
        let kiintea = false;
        for (let a: Element | null = osuma; a && a !== document.body; a = a.parentElement) {
          if (getComputedStyle(a).position === "fixed") {
            kiintea = true;
            break;
          }
        }
        if (kiintea) continue;
        laskettu++;
        if (!el.contains(osuma) && !osuma.contains(el)) peitettyja++;
      }
    }
    const peitetty = laskettu > 0 && peitettyja === laskettu;
    if (peitetty !== tila) {
      tila = peitetty;
      cb(peitetty);
    }
  };

  const ajasta = () => {
    if (ajastin) return;
    const odota = Math.max(0, 120 - (performance.now() - viimeksi));
    ajastin = window.setTimeout(tarkista, odota);
  };

  window.addEventListener("scroll", ajasta, { passive: true });
  window.addEventListener("resize", ajasta, { passive: true });
  ajasta();
  return () => {
    window.removeEventListener("scroll", ajasta);
    window.removeEventListener("resize", ajasta);
    if (ajastin) clearTimeout(ajastin);
  };
}
