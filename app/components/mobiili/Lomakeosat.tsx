/* PUHELINVERSION LOMAKKEIDEN YHTEISET OSAT (6.10.2026): ansakentta ja
   virherivi. Kayttavat Kuoren ikkunat ja sivujen omat lomakkeet
   (tarjous.ts, Viesti.tsx, toihin-meille/mobiili). */

/* Piilotettu ansakentta roskapostiboteille (kuten tyopoydan .vi-ansa). */
export function Ansa() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
      <input type="text" name="verkkosivu" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

/* Lahetysvirhe lomakkeen alla (lahettava koodi kirjoittaa tekstin). */
export function LomakeVirhe() {
  return <p data-mo-lomakevirhe="" role="alert" hidden style={{ margin: "0", textAlign: "center", fontSize: "14px", lineHeight: "1.5", color: "#ffb37a" }}></p>;
}
