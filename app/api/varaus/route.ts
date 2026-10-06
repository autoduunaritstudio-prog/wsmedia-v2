/**
 * KARTOITUKSEN VARAUS (4.10.2026), ks. components/VarausIkkuna.tsx.
 *
 * GET  /api/varaus?tapa=paikalla|teams  -> vapaat ajat 3. arkipaivasta
 *                                          30 kalenteripaivaa eteenpain
 * POST /api/varaus                      -> tarkistaa ajan uudelleen,
 *                                          tekee tapahtuman kalenteriin
 *                                          ja lahettaa sahkopostit
 *
 * Sahkopostit (6.10.2026, Resend, ks. ../posti.ts): ilmoitus osoitteeseen
 * info@wsmedia.fi ja vahvistus asiakkaalle kalenteritiedoston (.ics)
 * kanssa. Jos posti ei lahde, varaus on silti kalenterissa.
 *
 * Aika tarkistetaan kalentereista viela varaushetkella, joten kaksi
 * samaan aikaan varaavaa tai valilla kalenteriin lisatty meno ei voi
 * tuottaa paallekkaista varausta.
 */
import { NextResponse } from "next/server";
import { luoTapahtuma, varatut } from "./google";
import { INFO, PUHELIN, kehys, lahetaPosti, rajoitettu } from "../posti";
import { KESTO_MIN, onVarattavissa, varattavatPaivat, vapaat, helsinki, type Tapa } from "./ajat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tapaOk = (t: unknown): t is Tapa => t === "paikalla" || t === "teams";

/** Varattavien paivien valit. GET ja POST kayttavat samaa, ja Googlen
 *  freebusy haetaan koko valille yhdella kutsulla (varatut()). */
function vali() {
  const p = varattavatPaivat();
  const eka = p[0];
  const vika = p[p.length - 1];
  return { p, alku: helsinki(eka.y, eka.kk, eka.pv, 0), loppu: helsinki(vika.y, vika.kk, vika.pv, 23, 59) };
}

export async function GET(req: Request) {
  const tapa = new URL(req.url).searchParams.get("tapa");
  if (!tapaOk(tapa)) return NextResponse.json({ virhe: "tapa" }, { status: 400 });
  try {
    const { p, alku, loppu } = vali();
    const v = await varatut(alku, loppu);
    return NextResponse.json({ paivat: vapaat(p, v, tapa) }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("varaus GET", e);
    return NextResponse.json({ virhe: "kalenteri" }, { status: 503 });
  }
}

type Pyynto = {
  aika: string;
  tapa: Tapa;
  yritys: string;
  nimi: string;
  puhelin: string;
  sahkoposti: string;
  osoite?: string;
  palvelu?: string;
  lisatiedot?: string;
  sivu?: string;
  ansa?: string;
};

const puhdas = (s: unknown, max = 300) => String(s ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

const TZ = "Europe/Helsinki";
const paivaTxt = (d: Date) =>
  new Intl.DateTimeFormat("fi-FI", { weekday: "long", day: "numeric", month: "numeric", timeZone: TZ }).format(d);
const kloTxt = (d: Date) => new Intl.DateTimeFormat("fi-FI", { hour: "numeric", minute: "2-digit", timeZone: TZ }).format(d);

/** Kalenteritiedosto asiakkaan vahvistukseen. Ei sisalla mitaan
 *  lomakkeeseen kirjoitettua. */
function ics(id: string, alku: Date, loppu: Date, paikka: string): string {
  const z = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WS Media Oy//Kartoitusvaraus//FI",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${id}@wsmedia.fi`,
    `DTSTAMP:${z(new Date())}`,
    `DTSTART:${z(alku)}`,
    `DTEND:${z(loppu)}`,
    "SUMMARY:Maksuton kartoitus\\, WS Media",
    `LOCATION:${paikka}`,
    `DESCRIPTION:WS Media Oy\\, ${PUHELIN}\\, ${INFO}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export async function POST(req: Request) {
  let b: Pyynto;
  try {
    b = (await req.json()) as Pyynto;
  } catch {
    return NextResponse.json({ virhe: "data" }, { status: 400 });
  }
  /* Roskapostiansa: piilotettu kentta, jota ihminen ei tayta. */
  if (b.ansa) return NextResponse.json({ ok: true });
  const yritys = puhdas(b.yritys, 120);
  const nimi = puhdas(b.nimi, 120);
  const puhelin = puhdas(b.puhelin, 40);
  const sahkoposti = puhdas(b.sahkoposti, 160);
  const osoite = puhdas(b.osoite, 200);
  if (!tapaOk(b.tapa) || !yritys || !nimi || !puhelin || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(sahkoposti))
    return NextResponse.json({ virhe: "kentat" }, { status: 400 });
  if (b.tapa === "paikalla" && !osoite) return NextResponse.json({ virhe: "osoite" }, { status: 400 });
  if (rajoitettu(req)) return NextResponse.json({ virhe: "liikaa" }, { status: 429 });

  try {
    const { alku, loppu } = vali();
    const v = await varatut(alku, loppu);
    if (!onVarattavissa(b.aika, v, b.tapa)) return NextResponse.json({ virhe: "varattu" }, { status: 409 });

    const a = new Date(b.aika);
    const l = new Date(a.getTime() + KESTO_MIN * 60_000);
    const tapaTxt = b.tapa === "paikalla" ? "Paikan päällä" : "Teams";
    const kuvaus = [
      `Maksuton kartoitus, varattu wsmedia.fi:stä.`,
      ``,
      `Yritys: ${yritys}`,
      `Yhteyshenkilö: ${nimi}`,
      `Puhelin: ${puhelin}`,
      `Sähköposti: ${sahkoposti}`,
      `Tapa: ${tapaTxt}${b.tapa === "paikalla" ? `, ${osoite}` : ", lähetä Teams-linkki asiakkaalle"}`,
      `Palvelu: ${puhdas(b.palvelu, 80) || "ei valittu"}`,
      `Sivu: ${puhdas(b.sivu, 120)}`,
      ``,
      puhdas(b.lisatiedot, 1500),
    ].join("\n");
    const tapahtuma: Record<string, unknown> = {
      summary: `Kartoitus: ${yritys} (${tapaTxt})`,
      description: kuvaus,
      location: b.tapa === "paikalla" ? osoite : "Microsoft Teams",
      start: { dateTime: a.toISOString(), timeZone: "Europe/Helsinki" },
      end: { dateTime: l.toISOString(), timeZone: "Europe/Helsinki" },
      reminders: { useDefault: false, overrides: [{ method: "popup", minutes: b.tapa === "paikalla" ? 60 : 15 }] },
      extendedProperties: { private: { lahde: "wsmedia-varaus", tapa: b.tapa } },
    };
    const luotu = await luoTapahtuma(tapahtuma);

    /* Sahkopostit. Varaus on jo kalenterissa, joten postin virhe ei
       kaada varausta: se kirjataan lokiin. */
    const aikaTxt = `${paivaTxt(a)} klo ${kloTxt(a)}–${kloTxt(l)}`;
    const palvelu = puhdas(b.palvelu, 80);
    const lisatiedot = puhdas(b.lisatiedot, 1500);
    const rivit: [string, string][] = [
      ["Aika", aikaTxt],
      ["Tapa", b.tapa === "paikalla" ? `Paikan päällä, ${osoite}` : "Teams, lähetä linkki asiakkaalle"],
      ["Yritys", yritys],
      ["Yhteyshenkilö", nimi],
      ["Puhelin", puhelin],
      ["Sähköposti", sahkoposti],
      ...(palvelu ? ([["Palvelu", palvelu]] as [string, string][]) : []),
    ];
    const asiakkaalle =
      b.tapa === "paikalla"
        ? "Tulemme paikan päälle antamaasi osoitteeseen."
        : "Tapaaminen pidetään Teamsissa. Lähetämme linkin sähköpostiisi ennen tapaamista.";
    const peruutus = `Jos aika ei sovikaan, vastaa tähän viestiin tai soita numeroon ${PUHELIN}.`;
    const tulos = await Promise.allSettled([
      lahetaPosti({
        to: INFO,
        subject: `Uusi kartoitus: ${yritys}, ${paivaTxt(a)} klo ${kloTxt(a)}`,
        replyTo: sahkoposti,
        text: [...rivit.map(([x, y]) => `${x}: ${y}`), "", lisatiedot, "", `Kalenterissa: ${luotu.htmlLink}`].join("\n"),
        html: kehys("Uusi kartoitus varattu", ["Varaus tehtiin wsmedia.fi:ssä ja se on jo info@wsmedia.fi:n kalenterissa."], rivit, lisatiedot),
      }),
      lahetaPosti({
        to: sahkoposti,
        subject: `Kartoitus varattu: ${paivaTxt(a)} klo ${kloTxt(a)}`,
        replyTo: INFO,
        text: ["Hei,", "", "maksuton kartoitus on varattu.", `Aika: ${aikaTxt}`, asiakkaalle, "", peruutus, "", "Terveisin", "WS Media", `${PUHELIN}, ${INFO}`].join("\n"),
        html: kehys("Kartoitus on varattu.", [asiakkaalle, peruutus], [["Aika", aikaTxt], ["Kesto", `${KESTO_MIN} minuuttia`]]),
        attachments: [
          {
            filename: "kartoitus.ics",
            content: Buffer.from(ics(luotu.id, a, l, b.tapa === "paikalla" ? "Paikan päällä" : "Microsoft Teams")).toString("base64"),
            content_type: "text/calendar; charset=utf-8; method=PUBLISH",
          },
        ],
      }),
    ]);
    tulos.forEach((t, i) => {
      if (t.status === "rejected") console.error(i ? "varaus vahvistus" : "varaus ilmoitus", t.reason);
    });
    return NextResponse.json({ ok: true, aika: a.toISOString() });
  } catch (e) {
    console.error("varaus POST", e);
    return NextResponse.json({ virhe: "kalenteri" }, { status: 503 });
  }
}
