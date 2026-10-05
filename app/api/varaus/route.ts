/**
 * KARTOITUKSEN VARAUS (4.10.2026), ks. components/VarausIkkuna.tsx.
 *
 * GET  /api/varaus?tapa=paikalla|teams  -> vapaat ajat 3.–5. arkipaivalle
 * POST /api/varaus                      -> tarkistaa ajan uudelleen ja
 *                                          tekee tapahtuman kalenteriin
 *
 * Aika tarkistetaan kalentereista viela varaushetkella, joten kaksi
 * samaan aikaan varaavaa tai valilla kalenteriin lisatty meno ei voi
 * tuottaa paallekkaista varausta.
 */
import { NextResponse } from "next/server";
import { delegointi, luoTapahtuma, varatut } from "./google";
import { KESTO_MIN, onVarattavissa, varattavatPaivat, vapaat, helsinki, type Tapa } from "./ajat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tapaOk = (t: unknown): t is Tapa => t === "paikalla" || t === "teams";

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
    /* Asiakas kutsutaan vain kun tapahtuma tehdaan info@wsmedia.fi:n
       nimissa (delegointi). Muuten Google ei salli kutsuja palvelutilin
       tapahtumaan. */
    if (delegointi()) tapahtuma.attendees = [{ email: sahkoposti, displayName: nimi }];
    await luoTapahtuma(tapahtuma);
    return NextResponse.json({ ok: true, aika: a.toISOString() });
  } catch (e) {
    console.error("varaus POST", e);
    return NextResponse.json({ virhe: "kalenteri" }, { status: 503 });
  }
}
