/* KEVYT TILA HITAILLE LAITTEILLE (1.10.2026).

   Sivu mittaa ensimmaisten sekuntien ruudunpaivityksen. Jos kehysvali
   on pitka (alle noin 35 kuvaa sekunnissa) tai laite ilmoittaa
   vahaisen muistin, <html> saa data-kevyt="1" ja koristeet keventyvat:
   - heron sivupuhelimet nayttavat pysakuvan, vain keskimmainen video
     pyorii,
   - verkostotausta piirretaan 15 kertaa sekunnissa 30:n sijaan.
   Sisalto ja ulkoasu pysyvat samoina, vain liikkeen maara vahenee.

   Tila ei palaa takaisin saman sivulatauksen aikana: edestakainen
   vaihtelu nayttaisi viealta. */

const AVAIN = "kevyt";

export function onKevyt(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset[AVAIN] === "1";
}

function kytke() {
  if (onKevyt()) return;
  document.documentElement.dataset[AVAIN] = "1";
  window.dispatchEvent(new Event("ws-kevyt"));
}

export function mittaaLaite(): () => void {
  const nav = navigator as Navigator & { deviceMemory?: number };
  if ((nav.deviceMemory && nav.deviceMemory <= 2) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2)) {
    kytke();
    return () => {};
  }
  let raf = 0;
  let edellinen = 0;
  const valit: number[] = [];
  /* Ensimmainen sekunti ohitetaan: latauksen aikana kaikki laitteet
     nykivat. Sitten mitataan 90 kehysta. */
  const alku = performance.now() + 1000;
  const kehys = (t: number) => {
    if (document.hidden) {
      edellinen = 0;
      raf = requestAnimationFrame(kehys);
      return;
    }
    if (t > alku) {
      if (edellinen) valit.push(t - edellinen);
      edellinen = t;
    }
    if (valit.length >= 90) {
      const j = [...valit].sort((a, b) => a - b);
      const mediaani = j[Math.floor(j.length / 2)];
      if (mediaani > 28) kytke();
      return;
    }
    raf = requestAnimationFrame(kehys);
  };
  raf = requestAnimationFrame(kehys);
  return () => cancelAnimationFrame(raf);
}
