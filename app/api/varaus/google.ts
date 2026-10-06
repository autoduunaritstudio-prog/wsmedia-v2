/**
 * GOOGLE CALENDAR ILMAN KIRJASTOA (4.10.2026).
 *
 * Palvelutili (service account) allekirjoittaa JWT:n, vaihtaa sen
 * access tokeniin ja kutsuu Calendar API:a suoraan fetchilla. Ei
 * googleapis-riippuvuutta.
 *
 * Kalenteri on info@wsmedia.fi:n paakalenteri, sama johon Projektipallot
 * vie projektien deadlinet ("PP: ..."). Deadlinet ovat koko paivan
 * tapahtumia tilassa "vapaa", joten ne eivat vie kartoitusaikoja.
 * Kellonajalle tehty varattu-tilainen merkinta (kuvaus, palaveri) vie.
 *
 * Ymparistomuuttujat (Vercel > Settings > Environment Variables):
 *   GOOGLE_SA_EMAIL        palvelutilin sahkoposti (...@...iam.gserviceaccount.com)
 *   GOOGLE_SA_PRIVATE_KEY  palvelutilin yksityinen avain (PEM, rivinvaihdot \n)
 *   GOOGLE_SA_SUBJECT      info@wsmedia.fi. Palvelutili toimii taman
 *                          kayttajan nimissa (Workspacen domain-wide
 *                          delegation, scopet alla). Ilman tata kalenteri
 *                          pitaa jakaa palvelutilille muokkausoikeuksin.
 *   VARAUS_KALENTERIT      tarkistettavat kalenterit pilkulla erotettuna,
 *                          oletus info@wsmedia.fi. Ensimmaiseen tehdaan varaus.
 *
 * Vahvistus asiakkaalle lahtee Resendilla (route.ts), ei Googlen kutsuna:
 * kalenterimerkinnan kuvaus on sisainen muistiinpano.
 */
import { createSign } from "node:crypto";

/* Vain se mita tarvitaan: varattujen aikojen luku ja tapahtuman luonti.
   Samat kaksi scopea annetaan Workspacen delegoinnissa. */
const SCOPE = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy";

export const kalenterit = () =>
  (process.env.VARAUS_KALENTERIT || "info@wsmedia.fi")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const b64 = (s: string | Buffer) => Buffer.from(s).toString("base64url");

let valimuisti: { token: string; voimassa: number } | null = null;

export async function token(): Promise<string> {
  if (valimuisti && valimuisti.voimassa > Date.now() + 60_000) return valimuisti.token;
  const email = process.env.GOOGLE_SA_EMAIL;
  const avain = process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !avain) throw new Error("GOOGLE_SA_EMAIL tai GOOGLE_SA_PRIVATE_KEY puuttuu");
  const nyt = Math.floor(Date.now() / 1000);
  const claim: Record<string, string | number> = {
    iss: email,
    scope: SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    iat: nyt,
    exp: nyt + 3600,
  };
  if (process.env.GOOGLE_SA_SUBJECT) claim.sub = process.env.GOOGLE_SA_SUBJECT;
  const runko = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(JSON.stringify(claim))}`;
  const allekirjoitus = createSign("RSA-SHA256").update(runko).sign(avain).toString("base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${runko}.${allekirjoitus}`,
    }),
  });
  if (!r.ok) throw new Error(`Google token ${r.status}: ${await r.text()}`);
  const j = (await r.json()) as { access_token: string; expires_in: number };
  valimuisti = { token: j.access_token, voimassa: Date.now() + j.expires_in * 1000 };
  return j.access_token;
}

export type Varattu = { alku: number; loppu: number };

/** Varatut ajat kaikista tarkistettavista kalentereista. */
export async function varatut(alku: Date, loppu: Date): Promise<Varattu[]> {
  const t = await token();
  const r = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { authorization: `Bearer ${t}`, "content-type": "application/json" },
    body: JSON.stringify({
      timeMin: alku.toISOString(),
      timeMax: loppu.toISOString(),
      timeZone: "Europe/Helsinki",
      items: kalenterit().map((id) => ({ id })),
    }),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`freeBusy ${r.status}: ${await r.text()}`);
  const j = (await r.json()) as {
    calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }>;
  };
  const out: Varattu[] = [];
  for (const [id, k] of Object.entries(j.calendars)) {
    /* Jos kalenteria ei voi lukea, ei arvata: koko vali on varattu. */
    if (k.errors?.length) throw new Error(`Kalenteria ${id} ei voi lukea`);
    for (const b of k.busy ?? []) out.push({ alku: Date.parse(b.start), loppu: Date.parse(b.end) });
  }
  return out;
}

export async function luoTapahtuma(tapahtuma: Record<string, unknown>) {
  const t = await token();
  const kal = encodeURIComponent(kalenterit()[0]);
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${kal}/events`, {
    method: "POST",
    headers: { authorization: `Bearer ${t}`, "content-type": "application/json" },
    body: JSON.stringify(tapahtuma),
  });
  if (!r.ok) throw new Error(`events.insert ${r.status}: ${await r.text()}`);
  return (await r.json()) as { id: string; htmlLink: string };
}
