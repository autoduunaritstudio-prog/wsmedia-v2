import { lahetaLomake, liitteetLiianIsot } from "../components/lomake";

/* Hakemuksen yhteiset osat: sivun lomake ja HakemusIkkuna kayttavat samoja. */
export const SKILLS = [
  "Videokuvaus",
  "Editointi",
  "Motion graphics",
  "Verkkokehitys",
  "Hakukoneoptimointi",
  "Sisällöntuotanto",
  "Graafinen suunnittelu",
  "Teippaus tai asennus",
];

/** Lahettaa hakemuksen liitteineen (/api/lomake). Palauttaa null kun
 *  hakemus on perilla, muuten hakijalle naytettavan virheilmoituksen. */
export async function lahetaHakemus(f: FormData, osaaminen: string[], liitteet: File[] = []): Promise<string | null> {
  if (liitteetLiianIsot(liitteet))
    return "Liitteet ovat yhteensä yli 4 Mt. Poista osa tai lähetä linkki työnäytteisiin, niin hakemus lähtee.";
  const k = (n: string) => String(f.get(n) ?? "").trim();
  const ok = await lahetaLomake(
    "hakemus",
    {
      nimi: k("nimi"),
      sahkoposti: k("sahkoposti"),
      puhelin: k("puhelin"),
      paikkakunta: k("paikkakunta"),
      osaaminen: osaaminen.join(", "),
      nayte: k("nayte"),
      malli: k("malli"),
      hinta: k("hinta"),
      viesti: k("viesti"),
      verkkosivu: k("verkkosivu"),
    },
    liitteet,
  );
  return ok ? null : "Hakemus ei lähtenyt. Yritä uudelleen tai lähetä se osoitteeseen info@wsmedia.fi.";
}

/** Mobiilin ikkunat (components/mobiili/Moottori.tsx) kayttavat tata, kunnes
 *  nekin lahettavat /api/lomake-reitin kautta. */
export function hakemusMailto(f: FormData, osaaminen: string[], liitteet: string[] = []) {
  const k = (n: string) => String(f.get(n) ?? "").trim();
  const rivit = [
    `Nimi: ${k("nimi")}`,
    `Sähköposti: ${k("sahkoposti")}`,
    `Puhelin: ${k("puhelin")}`,
    `Paikkakunta: ${k("paikkakunta")}`,
    `Osaaminen: ${osaaminen.join(", ") || "ei valittu"}`,
    `Työnäytteet: ${k("nayte")}`,
    ...(k("malli") ? [`Toimeksianto vai työsuhde: ${k("malli")}`] : []),
    ...(k("hinta") ? [`Tuntihinta tai palkkatoive: ${k("hinta")}`] : []),
    "",
    k("viesti"),
    ...(liitteet.length
      ? ["", `Liitteet (lisää ne tähän viestiin ennen lähettämistä): ${liitteet.join(", ")}`]
      : []),
  ];
  const aihe = `Avoin hakemus: ${osaaminen.join(", ") || k("nimi") || "WS Media"}`;
  return `mailto:info@wsmedia.fi?subject=${encodeURIComponent(aihe)}&body=${encodeURIComponent(rivit.join("\n"))}`;
}
