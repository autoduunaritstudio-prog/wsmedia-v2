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
