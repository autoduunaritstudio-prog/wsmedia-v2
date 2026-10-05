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

/** Valmiiksi taytetty hakemussahkoposti osoitteeseen info@wsmedia.fi.
 *  Sahkopostilinkki ei voi kuljettaa tiedostoja, joten valitut liitteet
 *  listataan viestiin ja hakijaa muistutetaan liittamaan ne. */
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
