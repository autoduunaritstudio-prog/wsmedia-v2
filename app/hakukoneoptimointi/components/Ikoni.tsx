import type { CSSProperties } from "react";

/**
 * KAKSISAVYINEN IKONI.
 *
 * Kaksi polkua: tayttopala perii osion korostusvarin ja viiva
 * currentColorin. Sama merkinta nayttaa erilaiselta vaalealla ja
 * tummalla osiolla ilman yhtaan lisasaantoa, ja se on juuri se mika
 * erottaa ikoniJARJESTELMAN ikonipoiminnasta.
 *
 * KAIKKI SAMALLA 32 YKSIKON RUUDUKOLLA ja samalla viivanpaksuudella.
 * Rajoitus on se mika saa sarjan lukemaan jarjestelmana; ilman sita
 * nelja ikonia eri lahteista lukee nelja kertaa eri kasialana.
 *
 * pathLength="1" tekee piirtymisanimaatiosta mittauksettoman:
 * stroke-dasharray: 1 on koko polku riippumatta sen todellisesta
 * pituudesta, joten JS:n ei tarvitse kutsua getTotalLengthia eika
 * lukea asettelua kertaakaan.
 */
export type IkoniNimi = "haku" | "rakenne" | "linkki" | "kone" | "mittari" | "kartta";

const POLUT: Record<IkoniNimi, { tayte: string; viiva: string }> = {
  /* Suurennuslasi ja nouseva palkki sen sisalla */
  haku: {
    tayte: "M4 24h5v5H4zM11 19h5v10h-5z",
    viiva: "M20.5 20.5 29 29M13.5 4a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19Z",
  },
  /* Sivustorakenne: juuri ja kolme lasta */
  rakenne: {
    tayte: "M12 3h8v5h-8z",
    viiva: "M16 8v7M5 24v-5h22v5M5 24h4v5H5zM14 24h4v5h-4zM23 24h4v5h-4z",
  },
  /* Ketjun lenkki */
  linkki: {
    tayte: "M14 14h4v4h-4z",
    viiva: "M13 19.5 8.5 24a5.5 5.5 0 0 1-7.8-7.8L5 12M19 12.5l4.5-4.5a5.5 5.5 0 0 1 7.8 7.8L27 20",
  },
  /* Vastauskupla ja kipina */
  kone: {
    tayte: "M22 4l1.6 3.9L27.5 9.5l-3.9 1.6L22 15l-1.6-3.9L16.5 9.5l3.9-1.6z",
    viiva: "M4 8.5h9M4 14h14M4 19.5h11M4 4h24v18H12l-6 5.5V22H4z",
  },
  /* Mittari, viisari */
  mittari: {
    tayte: "M15 15h2.5v2.5H15z",
    viiva: "M3 24a13 13 0 1 1 26 0M16 24l6.5-8",
  },
  /* Karttamerkki */
  kartta: {
    tayte: "M16 9.5a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2z",
    viiva: "M16 29S5.5 20.6 5.5 13.2A10.5 10.5 0 0 1 26.5 13.2C26.5 20.6 16 29 16 29Z",
  },
};

export default function Ikoni({ nimi, i = 0 }: { nimi: IkoniNimi; i?: number }) {
  const p = POLUT[nimi];
  return (
    <svg
      className="ikoni"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      style={{ "--i": i } as CSSProperties}
    >
      <path className="tayte" d={p.tayte} />
      <path className="viiva" d={p.viiva} pathLength="1" />
    </svg>
  );
}
