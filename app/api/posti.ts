/**
 * SAHKOPOSTIN LAHETYS RESENDILLA (6.10.2026), ilman kirjastoa.
 *
 * Lomakkeet (app/api/lomake) ja kartoitusvaraus (app/api/varaus)
 * lahettavat taman kautta. Sama Resend-tili ja lahetysdomain
 * (send.wsmedia.fi) kuin ws-seurannassa.
 *
 * Ymparistomuuttujat (Vercel > Settings > Environment Variables):
 *   RESEND_API_KEY    Resendin avain
 *   POSTI_LAHETTAJA   (valinnainen) oletus "WS Media <info@send.wsmedia.fi>"
 *
 * Asiakkaalle lahteva vahvistus ei koskaan sisalla lomakkeeseen
 * kirjoitettua tekstia. Muuten lomakkeella voisi lahettaa WS Median
 * nimissa mita tahansa mihin tahansa osoitteeseen.
 */
export const INFO = "info@wsmedia.fi";
export const PUHELIN = "040 564 8770";

const lahettaja = () => process.env.POSTI_LAHETTAJA || "WS Media <info@send.wsmedia.fi>";

export type PostiLiite = { filename: string; content: string; content_type?: string };
export type Posti = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: PostiLiite[];
};

export const sahkopostiOk = (s: string) => /^[^@\s<>,;]+@[^@\s<>,;]+\.[^@\s<>,;]+$/.test(s);

export async function lahetaPosti(p: Posti): Promise<string> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY puuttuu");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: lahettaja(),
      to: [p.to],
      subject: p.subject,
      text: p.text,
      ...(p.html ? { html: p.html } : {}),
      ...(p.replyTo ? { reply_to: p.replyTo } : {}),
      ...(p.attachments?.length ? { attachments: p.attachments } : {}),
    }),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return ((await r.json()) as { id: string }).id;
}

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Viestin HTML-versio: tumma ylapalkki, otsikko, kappaleet ja
 *  valinnainen tietotaulukko. Taulukkoasettelu, koska sahkopostiohjelmat
 *  eivat tue muuta luotettavasti. */
export function kehys(otsikko: string, kappaleet: string[], rivit: [string, string][] = [], vapaa = ""): string {
  const p = kappaleet
    .map((k) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#1c2530">${esc(k)}</p>`)
    .join("");
  const t = rivit.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:6px 0 18px;border-top:1px solid #e3e8ee">${rivit
        .map(
          ([a, b]) =>
            `<tr><td style="padding:9px 14px 9px 0;border-bottom:1px solid #e3e8ee;font-size:13px;color:#5b6876;white-space:nowrap;vertical-align:top">${esc(a)}</td><td style="padding:9px 0;border-bottom:1px solid #e3e8ee;font-size:15px;color:#1c2530;font-weight:600">${esc(b)}</td></tr>`,
        )
        .join("")}</table>`
    : "";
  const v = vapaa
    ? `<div style="margin:0 0 18px;padding:14px 16px;background:#f3f6f9;border-radius:10px;font-size:15px;line-height:1.55;color:#1c2530;white-space:pre-wrap">${esc(vapaa)}</div>`
    : "";
  return `<!doctype html><html lang="fi"><body style="margin:0;padding:0;background:#eef1f4">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#eef1f4"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<tr><td style="background:#0b0f14;padding:20px 28px;font-size:17px;font-weight:700;letter-spacing:.02em;color:#ffffff">WS <span style="color:#6fecff">Media</span></td></tr>
<tr><td style="padding:28px 28px 10px">
<h1 style="margin:0 0 16px;font-size:21px;line-height:1.3;color:#0b0f14">${esc(otsikko)}</h1>
${p}${t}${v}
</td></tr>
<tr><td style="padding:16px 28px 24px;border-top:1px solid #e3e8ee;font-size:13px;line-height:1.6;color:#5b6876">WS Media Oy, Kuusiniementie 8 F, 02710 Espoo<br>${PUHELIN}, ${INFO}, wsmedia.fi</td></tr>
</table></td></tr></table></body></html>`;
}

/* Kevyt lahetysrajoitus osoitteittain. Serverless-ymparistossa muisti on
   instanssikohtainen, joten tama hidastaa vain yhta instanssia hakkaavaa
   lahettajaa. Varsinainen roskapostisuoja on lomakkeiden ansakentta. */
const osumat = new Map<string, number[]>();

export function rajoitettu(req: Request, max = 6, ikkunaMs = 10 * 60_000): boolean {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "tuntematon";
  const nyt = Date.now();
  const lista = (osumat.get(ip) ?? []).filter((t) => nyt - t < ikkunaMs);
  if (lista.length >= max) {
    osumat.set(ip, lista);
    return true;
  }
  lista.push(nyt);
  osumat.set(ip, lista);
  if (osumat.size > 2000) osumat.clear();
  return false;
}
