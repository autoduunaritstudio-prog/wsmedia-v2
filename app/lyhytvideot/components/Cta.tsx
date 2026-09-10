import type { CSSProperties } from "react";

import { CONTACT } from "../../components/site-data";

/**
 * Sivun sisainen kehotelohko.
 *
 * KAKSI PYYNTOA, EI KOLMEA. Sivulla oli kolme eri sanamuotoa samaan
 * lomakkeeseen ("Varaa maksuton kartoitus", "Pyyda tarjous", "Pyyda
 * suunnitelma"). Kolme nimea samalle asialle saa lukijan olettamaan,
 * etta ne vievat eri paikkoihin, ja jokainen epavarmuus maksaa
 * konversiota. Nyt pyyntoja on kaksi ja ne on sidottu lukijan
 * vaiheeseen: ennen hintoja ja todisteita matalan kynnyksen kartoitus,
 * niiden jalkeen suora tarjouspyynto.
 *
 * MIKROTEKSTI KUULUU NAPPIIN. Kynnys ei ole napin vari vaan se mita
 * painamisesta seuraa. Kesto ja sitoutumattomuus napin vieressa
 * vastaavat siihen ennen klikkia, ei vasta lomakkeella.
 *
 * KOHDE ON AINA #tarjous eli taman sivun oma lomake. Jos kohteita
 * olisi kaksi, sanamuotojen ero pitaisi myos nakya perilla.
 *
 * TOISSIJAINEN NAPPI VIE ERI PAIKKAAN, EI SAMAAN. "Ota yhteytta" on
 * suora sahkoposti eika kolmas nimi samalle lomakkeelle. Osa lukijoista
 * ei tayta lomaketta lainkaan, ja heille lomakkeen rinnalla oleva
 * matalampi reitti on ainoa reitti - mutta vain jos se todella on eri
 * reitti. Kaksi nappia samaan kohteeseen olisi pelkkaa valinnan vaivaa.
 */
type Kind = "kartoitus" | "tarjous";

const ASK: Record<Kind, { label: string; note: string }> = {
  kartoitus: { label: "Varaa maksuton kartoitus", note: "30 minuuttia, ei sitoumuksia" },
  tarjous: { label: "Pyydä tarjous", note: "Vastaamme 24 tunnin sisällä" },
};

export default function Cta({
  kind,
  center,
  delay,
  secondary,
}: {
  kind: Kind;
  /** Lisaa rinnalle suoran sahkopostilinkin. */
  secondary?: boolean;
  /** Keskitetty rivi. Kaytetaan osioissa joiden otsikko on keskitetty. */
  center?: boolean;
  /** Ilmestymisviive ms, kun lohko jatkaa edellisen sarjan porrastusta. */
  delay?: number;
}) {
  const a = ASK[kind];
  return (
    <div
      className={"cta-row rv" + (center ? " cta-row-c" : "")}
      style={delay ? ({ transitionDelay: delay + "ms" } as CSSProperties) : undefined}
    >
      <a className="btn mag" href="#tarjous">
        {a.label}
      </a>
      {secondary ? (
        <a className="btn alt" href={`mailto:${CONTACT.email}`}>
          Ota yhteyttä
        </a>
      ) : null}
      <span>{a.note}</span>
    </div>
  );
}
