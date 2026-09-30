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
   toiston ajan. */
export function peilaaKankaalle(v: HTMLVideoElement, c: HTMLCanvasElement): () => void {
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
