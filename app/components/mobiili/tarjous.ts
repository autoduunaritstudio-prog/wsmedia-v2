/* PUHELINVERSION SIVUJEN OMAT TARJOUSLOMAKKEET (6.10.2026).

   Etusivu, lyhytvideot, verkkosivut, hakukoneoptimointi, graafinen ja
   meista lahettavat /api/lomake-reitin kautta samoin kentin kuin
   tyopoydan BudgetForm.tsx (nimi, sahkoposti, puhelin, paikkakunta, lisa,
   lisa_otsikko, budjetti, sivuotsikko, viesti, verkkosivu). Puhelimen
   lomakkeissa ei ole lisakenttaa eika budjettia, joten ne jaavat pois.
   Lahetyksen ajan nappi on pois kaytosta ("Lahetetaan..."), onnistuessa
   kiitosteksti nakyviin, virheessa virherivi lomakkeen alla. */

import { lahetaLomake } from "@/app/components/lomake";

const PUUTTUU = "Kirjoita nimi ja sähköposti tai puhelinnumero, niin voimme vastata.";
const VIRHE = "Tarjouspyyntö ei lähtenyt. Yritä uudelleen, soita 040 564 8770 tai kirjoita osoitteeseen info@wsmedia.fi.";

export function kytkeTarjous(lomake: HTMLFormElement | null, kiitos: HTMLElement | null, jalkeen?: () => void) {
  if (!lomake) return () => {};
  let lahettaa = false;
  let valmis = false; // kuten BudgetForm: perillä olevaa pyyntöä ei lähetetä toiseen kertaan
  const laheta = async (e: Event) => {
    e.preventDefault();
    if (lahettaa || valmis) return;
    if (kiitos) kiitos.hidden = true;
    const d = new FormData(lomake);
    const k = (x: string) => String(d.get(x) ?? "").trim();
    const nappi = lomake.querySelector<HTMLButtonElement>("button[type=submit]");
    const virhe = lomake.querySelector<HTMLElement>("[data-mo-lomakevirhe]");
    const nayta = (t: string | null) => {
      if (!virhe) return;
      virhe.textContent = t ?? "";
      virhe.hidden = !t;
      jalkeen?.();
    };
    if (!k("nimi") || (!k("email") && !k("puhelin"))) {
      nayta(PUUTTUU);
      return;
    }
    nayta(null);
    lahettaa = true;
    const teksti = nappi?.textContent ?? "";
    if (nappi) {
      nappi.disabled = true;
      nappi.textContent = "Lähetetään…";
    }
    const ok = await lahetaLomake("tarjous", {
      nimi: k("nimi"),
      sahkoposti: k("email"),
      puhelin: k("puhelin"),
      paikkakunta: k("paikkakunta"),
      sivuotsikko: document.title.split("|")[0].trim(),
      viesti: k("viesti"),
      verkkosivu: k("verkkosivu"),
    });
    lahettaa = false;
    if (nappi) {
      nappi.disabled = false;
      nappi.textContent = teksti;
    }
    if (!ok) {
      nayta(VIRHE);
      return;
    }
    valmis = true;
    if (kiitos) kiitos.hidden = false;
    jalkeen?.();
  };
  lomake.addEventListener("submit", laheta);
  return () => lomake.removeEventListener("submit", laheta);
}
