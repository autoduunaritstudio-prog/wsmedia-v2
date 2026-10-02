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

/* HIDAS VERKKO (2.10.2026). Kaksi tasoa:
   - "tiukka": selain kertoo itse, etta yhteys on hidas tai kayttaja on
     pyytanyt saastamaan dataa (Chrome ja Edge). Silloin yksikaan video
     ei lahde itsestaan, vaan niissa on toistopainike.
   - "mitattu": selain ei kerro yhteydesta (Safari, Firefox), mutta heron
     keskimmainen video ei ehtinyt toistokuntoon neljassa sekunnissa.
     Silloin sivupuhelimet jaavat pysakuvaksi ja saavat painikkeen;
     keskimmainen lahtee kayntiin kun se on latautunut.
   Tila ei palaa takaisin saman sivulatauksen aikana. */
type Yhteys = { saveData?: boolean; effectiveType?: string };
let verkkoLuettu = false;

function lueVerkko() {
  if (verkkoLuettu || typeof navigator === "undefined") return;
  verkkoLuettu = true;
  const y = (navigator as Navigator & { connection?: Yhteys }).connection;
  if (y && (y.saveData || y.effectiveType === "slow-2g" || y.effectiveType === "2g" || y.effectiveType === "3g")) {
    document.documentElement.dataset.saasto = "tiukka";
  }
}

/** Hidas verkko, kumpi tahansa taso. */
export function onSaasto(): boolean {
  if (typeof document === "undefined") return false;
  lueVerkko();
  return !!document.documentElement.dataset.saasto;
}

/** Selain itse ilmoitti hitaan yhteyden tai datansaaston. */
export function onSaastoTiukka(): boolean {
  if (typeof document === "undefined") return false;
  lueVerkko();
  return document.documentElement.dataset.saasto === "tiukka";
}

/** Mitattu hitaus: video ei ehtinyt latautua ajoissa. */
export function kytkeSaasto() {
  if (onSaasto()) return;
  document.documentElement.dataset.saasto = "mitattu";
  window.dispatchEvent(new Event("ws-saasto"));
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
  let alku = performance.now() + 1000;
  const kehys = (t: number) => {
    /* Latausruudun aikana ei mitata (ks. Latausruutu.tsx): sivu ei ole
       viela siina tilassa jossa kayttaja sita katsoo, ja ruudun haivytys
       on itse raskas hetki. Mittaus alkaa sekunnin kuluttua avautumisesta. */
    if (document.documentElement.dataset.lataus === "1") {
      alku = t + 1000;
      edellinen = 0;
      valit.length = 0;
      raf = requestAnimationFrame(kehys);
      return;
    }
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
