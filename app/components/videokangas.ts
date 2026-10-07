/* VIDEO KANKAAN KAUTTA.

   MITATTU 30.9.2026 (Chromium, 1440x900, 120 Hz naytto): kun ruudulla on
   KAKSI tai useampi toistuva <video>-elementti, selain laskee koko sivun
   ruudunpaivityksen 30 kuvaan sekunnissa. Vieritys, verkostotausta ja
   kaikki muu liike nykii silloin, vaikka paasaie on joutilas. Yksi video
   ei tee sita, ja nakymaton (opacity 0) video ei tee sita.

   Siksi video toistuu edelleen omassa elementissaan, mutta se on
   lapinakyva, ja sen kuvat piirretaan viereiselle kankaalle. Kankaan
   paivitys on tavallista sivun sisaltoa eika videopintaa, joten se ei
   laske ruudunpaivitysta. Mitattu samassa kohdassa: 30 fps -> 120 fps.

   Uusi kuva piirretaan vasta kun video on esittanyt sen
   (requestVideoFrameCallback), eli 25..30 kertaa sekunnissa eika joka
   kehys. Selaimissa joissa sita ei ole, piirto kulkee rAF:ssa vain
   toiston ajan.

   SAFARISSA (WebKit) EI PEILATA (7.10.2026). Safarissa kopio videosta
   2D-kankaalle on kallis, natiivi video taas ei laske ruudunpaivitysta.
   MITATTU oikealla Safarilla (safaridriver, scripts/safari-oikea.mjs),
   etusivun Referenssit, viisi videota soi, 1440x900: yli 20 ms
   kehyksia kankaan kautta 43-85 %, natiivina 0-11 %. Siksi WebKitissa
   kankaalle ei piirreta: se piilotetaan VAIN toiston ajaksi, jolloin
   sen alla oleva natiivi video nakyy (sama paikka, sama luokka).
   Tauolla kangas on nakyvissa, koska PhoneReelin pysakuva on kankaan
   taustakuvana (.phone .ph-kangas) - pysyva piilotus vei sen kevyesta
   tilasta, saastotilasta ja ennen toiston alkua.
   Tunnistus navigator.vendorista: se kertoo moottorin (Apple = WebKit). */
const WEBKIT = typeof navigator !== "undefined" && /^Apple/.test(navigator.vendor);

export function peilaaKankaalle(v: HTMLVideoElement, c: HTMLCanvasElement): () => void {
  if (WEBKIT) {
    // Piilotus vasta kun video on ESITTANYT ruudun (rVFC), ettei
    // pysakuvan ja videon valiin jaa tyhjaa ruutua.
    let odotus = 0;
    const nayta = () => {
      if (odotus) v.cancelVideoFrameCallback?.(odotus);
      odotus = 0;
      c.style.visibility = "";
    };
    const piilota = () => {
      if (typeof v.requestVideoFrameCallback !== "function") {
        c.style.visibility = "hidden";
        return;
      }
      if (odotus) return;
      odotus = v.requestVideoFrameCallback(() => {
        odotus = 0;
        if (!v.paused) c.style.visibility = "hidden";
      });
    };
    v.addEventListener("playing", piilota);
    v.addEventListener("pause", nayta);
    v.addEventListener("emptied", nayta);
    if (!v.paused && v.readyState >= 2) piilota();
    return () => {
      v.removeEventListener("playing", piilota);
      v.removeEventListener("pause", nayta);
      v.removeEventListener("emptied", nayta);
      nayta();
    };
  }
  const x = c.getContext("2d", { alpha: true });
  if (!x) return () => {};
  let kaynnissa = false;
  let cb = 0;
  let raf = 0;
  const rvfc = typeof v.requestVideoFrameCallback === "function";

  const piirra = () => {
    if (v.readyState < 2 || !v.videoWidth) return;
    if (c.width !== v.videoWidth || c.height !== v.videoHeight) {
      c.width = v.videoWidth;
      c.height = v.videoHeight;
    }
    x.drawImage(v, 0, 0, c.width, c.height);
  };

  const kierros = () => {
    cb = 0;
    raf = 0;
    if (!kaynnissa) return;
    piirra();
    if (rvfc) cb = v.requestVideoFrameCallback(kierros);
    else raf = requestAnimationFrame(kierros);
  };

  const aloita = () => {
    if (kaynnissa) return;
    kaynnissa = true;
    if (rvfc) cb = v.requestVideoFrameCallback(kierros);
    else raf = requestAnimationFrame(kierros);
  };
  const lopeta = () => {
    kaynnissa = false;
    if (cb) v.cancelVideoFrameCallback?.(cb);
    if (raf) cancelAnimationFrame(raf);
    cb = 0;
    raf = 0;
    piirra();
  };

  v.style.opacity = "0";
  v.addEventListener("play", aloita);
  v.addEventListener("playing", aloita);
  v.addEventListener("pause", lopeta);
  v.addEventListener("seeked", piirra);
  v.addEventListener("loadeddata", piirra);
  if (!v.paused) aloita();
  else piirra();

  return () => {
    kaynnissa = false;
    if (cb) v.cancelVideoFrameCallback?.(cb);
    if (raf) cancelAnimationFrame(raf);
    v.removeEventListener("play", aloita);
    v.removeEventListener("playing", aloita);
    v.removeEventListener("pause", lopeta);
    v.removeEventListener("seeked", piirra);
    v.removeEventListener("loadeddata", piirra);
    v.style.opacity = "";
  };
}
