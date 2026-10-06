/**
 * LOMAKKEIDEN LAHETYS (6.10.2026).
 *
 * POST /api/lomake (multipart/form-data), kentta "tyyppi":
 *   yhteys   Ota yhteytta -ikkuna (YhteysIkkuna)
 *   tarjous  tarjouspyyntolomake (BudgetForm)
 *   hakemus  avoin hakemus liitteineen (ApplicationForm, HakemusIkkuna)
 *
 * Viesti lahtee Resendilla osoitteeseen info@wsmedia.fi niin, etta
 * siihen vastaaminen menee suoraan lahettajalle. Lahettaja saa lyhyen
 * vahvistuksen, jossa ei ole mitaan lomakkeeseen kirjoitettua.
 *
 * Selainpuoli: app/components/lomake.ts.
 */
import { NextResponse } from "next/server";
import { INFO, PUHELIN, kehys, lahetaPosti, rajoitettu, sahkopostiOk, type PostiLiite } from "../posti";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Tyyppi = "yhteys" | "tarjous" | "hakemus";
const tyyppiOk = (t: unknown): t is Tyyppi => t === "yhteys" || t === "tarjous" || t === "hakemus";

/* Vercelin funktio ottaa vastaan enintaan 4,5 Mt. Liitteille 4 Mt,
   sama raja selaimessa (lomake.ts). */
const LIITTEET_MAX = 4 * 1024 * 1024;
const LIITE_OK = /\.(pdf|docx?|jpe?g|png|zip)$/i;

/* Kentat siina jarjestyksessa kuin ne nakyvat viestissa. */
const KENTAT: [string, string][] = [
  ["nimi", "Nimi"],
  ["yritys", "Yritys"],
  ["sahkoposti", "Sähköposti"],
  ["puhelin", "Puhelin"],
  ["paikkakunta", "Paikkakunta"],
  ["palvelu", "Palvelu"],
  ["paketti", "Paketti"],
  ["lisa", "Lisätieto"],
  ["budjetti", "Budjetti"],
  ["osaaminen", "Osaaminen"],
  ["nayte", "Työnäytteet"],
  ["malli", "Toimeksianto vai työsuhde"],
  ["hinta", "Tuntihinta tai palkkatoive"],
  ["sivu", "Sivu"],
];

const VAHVISTUS: Record<Tyyppi, { aihe: string; otsikko: string; teksti: string[] }> = {
  yhteys: {
    aihe: "Viestisi on perillä",
    otsikko: "Kiitos viestistä.",
    teksti: ["Luemme viestisi ja vastaamme arkisin 24 tunnin sisällä.", `Jos asialla on kiire, soita numeroon ${PUHELIN}.`],
  },
  tarjous: {
    aihe: "Tarjouspyyntösi on perillä",
    otsikko: "Kiitos tarjouspyynnöstä.",
    teksti: ["Käymme pyyntösi läpi ja vastaamme arkisin 24 tunnin sisällä.", `Jos asialla on kiire, soita numeroon ${PUHELIN}.`],
  },
  hakemus: {
    aihe: "Hakemuksesi on perillä",
    otsikko: "Kiitos hakemuksesta.",
    teksti: ["Luemme jokaisen hakemuksen ja vastaamme viikon sisällä.", "Käsittelemme hakemukset luottamuksellisesti."],
  },
};

const rivi = (s: unknown, max = 200) => String(s ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
const teksti = (s: unknown, max = 4000) =>
  String(s ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim().slice(0, max);

export async function POST(req: Request) {
  let f: FormData;
  try {
    f = await req.formData();
  } catch {
    return NextResponse.json({ virhe: "data" }, { status: 400 });
  }
  /* Roskapostiansa: piilotettu kentta, jota ihminen ei tayta. */
  if (rivi(f.get("verkkosivu"))) return NextResponse.json({ ok: true });

  const tyyppi = f.get("tyyppi");
  if (!tyyppiOk(tyyppi)) return NextResponse.json({ virhe: "tyyppi" }, { status: 400 });

  const nimi = rivi(f.get("nimi"), 120);
  const sahkoposti = rivi(f.get("sahkoposti"), 160);
  const puhelin = rivi(f.get("puhelin"), 40);
  const postiOk = sahkopostiOk(sahkoposti);
  /* Tarjouspyyntoon riittaa puhelin, muissa sahkoposti on pakollinen. */
  const yhteysOk = tyyppi === "tarjous" ? postiOk || Boolean(puhelin) : postiOk;
  if (!nimi || !yhteysOk || (sahkoposti && !postiOk)) return NextResponse.json({ virhe: "kentat" }, { status: 400 });

  if (rajoitettu(req)) return NextResponse.json({ virhe: "liikaa" }, { status: 429 });

  /* Kahdella kentalla on lomakekohtainen otsikko: hinnoittelukortin
     paketti ("Paketti", "Taso") ja palvelusivun lisakentta. */
  const otsikot: Record<string, string> = {
    paketti: rivi(f.get("paketti_otsikko"), 60),
    lisa: rivi(f.get("lisa_otsikko"), 60),
  };
  const rivit: [string, string][] = [];
  for (const [avain, otsikko] of KENTAT) {
    const arvo = rivi(f.get(avain));
    if (arvo) rivit.push([otsikot[avain] || otsikko, arvo]);
  }
  const viesti = teksti(f.get("viesti"));

  const liitteet: PostiLiite[] = [];
  if (tyyppi === "hakemus") {
    let koko = 0;
    for (const t of f.getAll("liite")) {
      if (!(t instanceof File) || !t.size) continue;
      if (!LIITE_OK.test(t.name)) return NextResponse.json({ virhe: "liite" }, { status: 400 });
      koko += t.size;
      if (koko > LIITTEET_MAX || liitteet.length >= 8) return NextResponse.json({ virhe: "koko" }, { status: 413 });
      liitteet.push({
        filename: rivi(t.name, 120),
        content: Buffer.from(await t.arrayBuffer()).toString("base64"),
        ...(t.type ? { content_type: t.type } : {}),
      });
    }
  }

  const palvelu = rivi(f.get("palvelu"), 120);
  const aihe =
    tyyppi === "yhteys"
      ? `Yhteydenotto: ${[palvelu, rivi(f.get("paketti"), 80)].filter(Boolean).join(", ") || nimi}`
      : tyyppi === "tarjous"
        ? `Tarjouspyyntö: ${rivi(f.get("sivuotsikko"), 80) || nimi}`
        : `Avoin hakemus: ${rivi(f.get("osaaminen"), 120) || nimi}`;
  const otsikko = tyyppi === "yhteys" ? "Uusi yhteydenotto" : tyyppi === "tarjous" ? "Uusi tarjouspyyntö" : "Uusi avoin hakemus";

  try {
    await lahetaPosti({
      to: INFO,
      subject: aihe,
      replyTo: postiOk ? sahkoposti : undefined,
      text: [...rivit.map(([a, b]) => `${a}: ${b}`), "", viesti].join("\n"),
      html: kehys(otsikko, ["Lähetetty wsmedia.fi:n lomakkeella. Vastaa tähän viestiin, niin vastaus menee suoraan lähettäjälle."], rivit, viesti),
      attachments: liitteet,
    });
  } catch (e) {
    console.error("lomake", tyyppi, e);
    return NextResponse.json({ virhe: "posti" }, { status: 502 });
  }

  /* Vahvistus lahettajalle. Jos se ei lahde, viesti on silti perilla. */
  if (postiOk) {
    const v = VAHVISTUS[tyyppi];
    try {
      await lahetaPosti({
        to: sahkoposti,
        subject: `${v.aihe}, WS Media`,
        replyTo: INFO,
        text: ["Hei,", "", v.otsikko, ...v.teksti, "", "Terveisin", "WS Media", `${PUHELIN}, ${INFO}`].join("\n"),
        html: kehys(v.otsikko, v.teksti),
      });
    } catch (e) {
      console.error("lomake vahvistus", e);
    }
  }
  return NextResponse.json({ ok: true });
}
