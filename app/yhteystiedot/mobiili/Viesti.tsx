"use client";

/* "LAHETA VIESTI" -ALAPANEELI (suunnitelman m-sheet sellaisenaan).

   Avautuu heron napista ([data-mo-viesti]), sulkeutuu taustasta, rastista
   ja Escista. Validointi: nimi ja sahkoposti (suunnitelmassa riitti
   puhelinnumerokin, mutta yhteydenottoon palvelin vaatii sahkopostin). Lahetys /api/lomake-reitin kautta (lahetaLomake
   "yhteys", 6.10.2026) kuten sivuston YhteysIkkuna. Nimi, sahkoposti ja puhelin sailyvat paneelin sulkemisen
   yli kuten suunnitelman tilassa. Paneeli renderoidaan vain auki
   ollessa (suunnitelman sc-if), joten se ei ole sivun HTML:ssa. */

import { useEffect, useRef, useState } from "react";
import { lahetaLomake } from "@/app/components/lomake";
import { Ansa } from "@/app/components/mobiili/Lomakeosat";

type Tila = "" | "puuttuu" | "lahettaa" | "valmis" | "virhe";

export default function Viesti() {
  const [auki, setAuki] = useState(false);
  const [tila, setTila] = useState<Tila>("");
  const [nimi, setNimi] = useState("");
  const [mail, setMail] = useState("");
  const [puh, setPuh] = useState("");
  const paikka = useRef<HTMLInputElement>(null);
  const teksti = useRef<HTMLTextAreaElement>(null);
  const paneeli = useRef<HTMLDivElement>(null);
  const paluu = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const klikki = (e: MouseEvent) => {
      const b = (e.target as Element | null)?.closest?.<HTMLElement>("[data-mo-viesti]");
      if (!b) return;
      e.preventDefault();
      paluu.current = b;
      setTila("");
      setAuki(true);
    };
    document.addEventListener("click", klikki);
    return () => document.removeEventListener("click", klikki);
  }, []);

  useEffect(() => {
    if (!auki) return;
    const html = document.documentElement;
    html.classList.add("mo-lukko");
    paneeli.current?.focus({ preventScroll: true });
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAuki(false);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("keydown", esc);
      html.classList.remove("mo-lukko");
      paluu.current?.focus({ preventScroll: true });
    };
  }, [auki]);

  const sulje = () => setAuki(false);
  const laheta = async () => {
    if (tila === "lahettaa" || tila === "valmis") return;
    if (!nimi.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail.trim())) {
      setTila("puuttuu");
      return;
    }
    setTila("lahettaa");
    const ok = await lahetaLomake("yhteys", {
      nimi: nimi.trim(),
      sahkoposti: mail.trim(),
      puhelin: puh.trim(),
      paikkakunta: (paikka.current?.value ?? "").trim(),
      viesti: (teksti.current?.value ?? "").trim(),
      verkkosivu: paneeli.current?.querySelector<HTMLInputElement>('input[name="verkkosivu"]')?.value ?? "",
    });
    setTila(ok ? "valmis" : "virhe");
  };

  if (!auki) return null;
  const puuttuu = tila === "puuttuu";
  const virhe = tila === "virhe";
  const note = puuttuu
    ? "Kirjoita nimi ja sähköposti, niin voimme vastata."
    : tila === "valmis"
      ? "Kiitos, viestisi on perillä. Vastaamme arkisin 24 tunnin sisällä."
      : "Vastaamme 24 tunnin sisällä. Ei sitoumuksia.";

  return (
    <div style={{ position: "fixed", inset: "0", zIndex: "8" }}>
      {" "}
      <div className="mo-m-fade" onClick={sulje} style={{ position: "absolute", inset: "0", background: "rgba(5,8,12,.7)" }}></div>
      {" "}
      <div ref={paneeli} tabIndex={-1} className="mo-m-sheet" role="dialog" aria-modal="true" aria-label="Lähetä viesti" style={{ position: "absolute", left: "0", right: "0", bottom: "0", maxHeight: "calc(100% - 54px)", overflowY: "auto", overscrollBehavior: "contain", padding: "14px 20px calc(28px + env(safe-area-inset-bottom, 0px))", boxSizing: "border-box", borderRadius: "26px 26px 0 0", background: "#16263d", borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", flexDirection: "column", gap: "12px", outline: "none" }}>
        {" "}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <b style={{ fontSize: "21px" }}>
            {"Lähetä viesti"}
          </b>
          <button type="button" onClick={sulje} aria-label="Sulje" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "0", background: "rgba(255,255,255,.08)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18"></path>
            </svg>
          </button>
        </div>
        {" "}
        <label className="mo-m-in">
          {"Nimi"}
          <input type="text" name="nimi" autoComplete="name" defaultValue={nimi} onChange={(e) => setNimi(e.target.value)} />
        </label>
        {" "}
        <label className="mo-m-in">
          {"Sähköposti"}
          <input type="email" name="sahkoposti" inputMode="email" autoComplete="email" defaultValue={mail} onChange={(e) => setMail(e.target.value)} />
        </label>
        {" "}
        <label className="mo-m-in">
          {"Puhelinnumero"}
          <input type="tel" name="puhelin" inputMode="tel" autoComplete="tel" defaultValue={puh} onChange={(e) => setPuh(e.target.value)} />
        </label>
        {" "}
        <label className="mo-m-in">
          {"Paikkakunta"}
          <input ref={paikka} type="text" name="paikkakunta" autoComplete="address-level2" />
        </label>
        {" "}
        <label className="mo-m-in">
          {"Mitä tarvitset? Videot, sivusto, yritysilme vai kokonaisuus?"}
          <textarea ref={teksti} name="viesti" rows={3} style={{ height: "100px", paddingTop: "12px" }} />
        </label>
        {" "}
        <Ansa />
        <button type="button" onClick={laheta} disabled={tila === "lahettaa"} className="mo-m-btn mo-m-p mo-m-shine" style={{ marginTop: "4px", flex: "none" }}>
          {tila === "lahettaa" ? "Lähetetään…" : "Lähetä tarjouspyyntö"}
        </button>
        {" "}
        <p role="status" style={{ margin: "0", textAlign: "center", fontSize: "14px", lineHeight: "1.5", color: puuttuu ? "#ffb37a" : "rgba(255,255,255,.6)" }}>
          {note}
        </p>
        {virhe ? (
          <p role="alert" style={{ margin: "0", textAlign: "center", fontSize: "14px", lineHeight: "1.5", color: "#ffb37a" }}>
            {"Viesti ei lähtenyt. Yritä uudelleen, soita 040 564 8770 tai kirjoita osoitteeseen info@wsmedia.fi."}
          </p>
        ) : null}
        {" "}
      </div>
      {" "}
    </div>
  );
}
