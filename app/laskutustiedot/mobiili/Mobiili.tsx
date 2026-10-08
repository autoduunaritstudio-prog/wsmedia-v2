/* LASKUTUSTIEDOT: PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Laskutustiedot.dc.html: rakenne,
   tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on muunnettu
   koneellisesti (dc2jsx.mjs + tyokalut/pienet.py) ja vierityksen arvot on
   korvattu alkutilalla (y = 0). Naytetaan vain max-width: 767px.

   Suunnitelman oma ylapalkki, valikkolinkki ja CTA-pilleri korvataan
   yhteisella Kuorella (tapa="pieni"); footer on suunnitelman oma.
   Vierityksen arvot (heron skaalaus, teksti, himmennys, kulmat ja
   laskuarkin nousu) kirjoittaa Efektit.tsx suoraan DOMiin. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./mobiili.css";
import "./lisat.css";
import { Fragment } from "react";
import Kuori from "@/app/components/mobiili/Kuori";
import Moottori from "@/app/components/mobiili/Moottori";
import Efektit from "./Efektit";

/* Lahde: suunnitelman renderVals (= app/laskutustiedot/page.tsx YRITYS,
   VERKKOLASKU). Kopioitava arvo ilman valilyonteja. */
const YRITYS = [
      ['Y-tunnus', '3615084-4'],
      ['ALV-tunnus', 'FI36150844'],
      ['Kotipaikka', 'Espoo'],
      ['Postiosoite', 'Kuusiniementie 8 F, 02710 Espoo'],
    ];
const VERKKOLASKU = [
      ['Välittäjä', 'Apix Messaging Oy'],
      ['Välittäjätunnus', '003723327487'],
    ];
const rivi = (kopiot: string[]) => (r: string[]) => ({ k: r[0], v: r[1], kopio: kopiot.indexOf(r[0]) >= 0, arvo: r[1].replace(/\s/g, ''), aria: 'Kopioi ' + r[0] });
const YRITYS_ = YRITYS.map(rivi(['Y-tunnus', 'ALV-tunnus']));
const VERKKO_ = VERKKOLASKU.map(rivi(['Välittäjätunnus']));

/* Kopioi-nappi: suunnitelman kop()-tilat (Kopioi / Kopioitu, 1,8 s).
   Molemmat ikonit ovat merkinnassa, lisat.css nayttaa oikean
   .mo-ok-luokan mukaan; Efektit.tsx vaihtaa luokan ja tekstin. */
function Kop({ arvo, aria, tumma = false }: { arvo: string; aria: string; tumma?: boolean }) {
  return (
    <button type="button" className={tumma ? "mo-m-kop mo-m-kop-d" : "mo-m-kop"} data-kopioi={arvo} aria-label={aria}>
      <svg className="mo-kop-ok" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5"></path>
      </svg>
      <svg className="mo-kop-ei" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="8" y="8" width="12" height="12" rx="2.5"></rect>
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
      </svg>
      <span data-kop-teksti="">{"Kopioi"}</span>
    </button>
  );
}

export default function LaskutusMobiili() {
  return (
    <div className="mo-root mo-s-laskutus">
      <div style={{ position: "relative", background: "#0b0f14", color: "#fff", fontFamily: "var(--font-instrument), system-ui, sans-serif" }}>
        {" "}
        {/* HERO: pinnattu, laskuarkki nousee päälle */}
        {" "}
        <div style={{ height: "calc(100svh + 636px)", position: "relative", background: "#0b0f14" }}>
          {" "}
          <div data-hero="" style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden", background: "radial-gradient(120% 70% at 85% 0%, #1d3453 0%, #0b0f14 64%)", transform: "scale(1)", transformOrigin: "50% 0" }}>
            {" "}
            <svg className="mo-m-net" viewBox="0 0 390 844" width="390" height="844" aria-hidden="true" style={{ position: "absolute", inset: "0", opacity: ".5" }}>
              <g fill="none" stroke="rgba(111,236,255,.28)" strokeWidth="1">
                <path d="M30 150 L140 90 L262 170 L360 110"></path>
                <path d="M140 90 L196 260 L262 170"></path>
                <path d="M20 420 L120 330 L196 260 L330 330 L372 470"></path>
                <path d="M120 330 L60 560 L210 640 L330 330"></path>
                <path d="M210 640 L360 720"></path>
              </g>
              <g fill="#6fecff">
                <circle cx="140" cy="90" r="2.5"></circle>
                <circle cx="262" cy="170" r="2.5" style={{ animationDelay: "-.8s" }}></circle>
                <circle cx="196" cy="260" r="3" style={{ animationDelay: "-1.6s" }}></circle>
                <circle cx="120" cy="330" r="2.5" style={{ animationDelay: "-2.2s" }}></circle>
                <circle cx="330" cy="330" r="2.5" style={{ animationDelay: "-.4s" }}></circle>
                <circle cx="60" cy="560" r="2.5" style={{ animationDelay: "-1.2s" }}></circle>
                <circle cx="210" cy="640" r="2.5" style={{ animationDelay: "-2.6s" }}></circle>
                <circle cx="360" cy="110" r="2" style={{ animationDelay: "-2s" }}></circle>
              </g>
            </svg>
            {" "}
            <div className="mo-m-glow" style={{ right: "-150px", top: "60px", opacity: ".45" }}></div>
            {" "}
            <div style={{ position: "absolute", left: "20px", right: "20px", top: "112px", display: "flex", flexDirection: "column", gap: "16px", transform: "translateY(0px)", opacity: "1" }} data-hero-teksti="">
              {" "}
              <h1 className="mo-li mo-d1" style={{ margin: "0", fontSize: "44px", lineHeight: "1.04", letterSpacing: "-0.035em", fontWeight: "700" }}>
                {"Laskutustiedot"}
              </h1>
              {" "}
              <p className="mo-li mo-d2" style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "rgba(255,255,255,.82)" }}>
                {"Lähetä laskut ensisijaisesti verkkolaskuna. Tiedot vastaavat kaupparekisteriä ja Verkkolaskuosoitteistoa, ja jokaisen numeron voi kopioida suoraan."}
              </p>
              {" "}
              <p className="mo-li mo-d3" style={{ margin: "0", padding: "16px 16px 16px 18px", borderRadius: "18px", background: "rgba(16,27,44,.8)", border: "1px solid rgba(255,255,255,.1)", borderLeft: "3px solid #e9d4b4", fontSize: "15.5px", lineHeight: "1.6", color: "rgba(255,255,255,.76)" }}>
                {"Jos verkkolasku ei onnistu, kirjoita osoitteeseen "}
                <a href="mailto:info@wsmedia.fi" style={{ fontWeight: "600" }}>
                  {"info@wsmedia.fi"}
                </a>
                {", niin sovitaan toimitustapa. Merkitse laskuun viite tai yhteyshenkilö, jotta lasku kohdistuu oikein. Tiedot löytyvät myös "}
                <a href="https://verkkolaskuosoite.fi" style={{ fontWeight: "600" }}>
                  {"Verkkolaskuosoitteistosta"}
                </a>
                {"."}
              </p>
              {" "}
            </div>
            {" "}
            <div data-hero-himmea="" style={{ position: "absolute", inset: "0", background: "#05080c", opacity: "0", pointerEvents: "none" }}></div>
            {" "}
            <span data-hero-kulma="" aria-hidden="true" style={{ position: "absolute", left: "0", top: "0", width: "28px", height: "28px", background: "radial-gradient(circle at 100% 100%, rgba(11,15,20,0) 27.5px, #0b0f14 28px)", transform: "scale(0)", transformOrigin: "0 0", pointerEvents: "none" }}></span>
            <span data-hero-kulma="" aria-hidden="true" style={{ position: "absolute", right: "0", top: "0", width: "28px", height: "28px", background: "radial-gradient(circle at 0% 100%, rgba(11,15,20,0) 27.5px, #0b0f14 28px)", transform: "scale(0)", transformOrigin: "100% 0", pointerEvents: "none" }}></span>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        {/* LASKUARKKI: vaalea cover */}
        {" "}
        <section style={{ position: "relative", zIndex: "2", marginTop: "calc(-1 * 100svh)", padding: "22px 16px 56px", background: "#eef1f5", color: "#11151a", borderRadius: "28px 28px 0 0", boxShadow: "0 -30px 60px -20px rgba(0,0,0,.6)" }}>
          {" "}
          <span style={{ display: "block", margin: "0 auto 22px", width: "44px", height: "5px", borderRadius: "3px", background: "rgba(17,21,26,.15)" }}></span>
          {" "}
          <article data-arkki="" aria-label="WS Media Oy:n laskutustiedot" style={{ position: "relative", padding: "26px 20px 22px", borderRadius: "6px 6px 18px 18px", background: "#fff", boxShadow: "0 2px 0 rgba(17,21,26,.04), 0 30px 60px -30px rgba(13,13,16,.5)", transform: "translateY(40px) rotate(-2.50deg)", transformOrigin: "50% 0" }}>
            {" "}
            <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "6px", borderRadius: "6px 6px 0 0", background: "repeating-linear-gradient(90deg, #007c8f 0 22px, #6fecff 22px 44px)" }}></span>
            {" "}
            <p style={{ margin: "0", fontSize: "13px", fontWeight: "600", letterSpacing: ".06em", color: "#00697a" }}>
              {"Laskun vastaanottaja"}
            </p>
            {" "}
            <p style={{ margin: "8px 0 6px", fontSize: "30px", lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }}>
              {"WS Media Oy"}
            </p>
            {" "}
            <div style={{ margin: "0" }}>
              {" "}
              {(YRITYS_).map((r: any, rI: number) => (
                <Fragment key={rI}>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "60px", padding: "8px 0", borderTop: "1px dashed rgba(17,21,26,.14)" }}>
                    {" "}
                    <dl style={{ minWidth: "0", margin: "0" }}>
                      <dt style={{ fontSize: "13px", color: "#4a5560" }}>
                        {r.k}
                      </dt>
                      <dd style={{ margin: "3px 0 0", fontSize: "17px", lineHeight: "1.4", fontWeight: "600", color: "#11151a", fontVariantNumeric: "tabular-nums" }}>
                        {r.v}
                      </dd>
                    </dl>
                    {" "}
                    {r.kopio ? (
                      <>
                        <Kop arvo={r.arvo} aria={r.aria} />
                      </>
                    ) : null}
                    {" "}
                  </div>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div style={{ margin: "18px -20px -22px", padding: "22px 20px 22px", borderRadius: "0 0 18px 18px", background: "#0b1320", color: "#fff" }}>
              {" "}
              <p style={{ margin: "0", fontSize: "13px", fontWeight: "600", letterSpacing: ".06em", color: "#6fecff" }}>
                {"Verkkolasku"}
              </p>
              {" "}
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                {" "}
                <span style={{ fontSize: "29px", fontWeight: "700", letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>
                  {"003736150844"}
                </span>
                {" "}
                <Kop arvo="003736150844" aria="Kopioi verkkolaskuosoite" tumma />
                {" "}
              </div>
              {" "}
              <div style={{ margin: "12px 0 0" }}>
                {" "}
                {(VERKKO_).map((r: any, rI: number) => (
                  <Fragment key={rI}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "60px", padding: "8px 0", borderTop: "1px dashed rgba(255,255,255,.16)" }}>
                      {" "}
                      <dl style={{ minWidth: "0", margin: "0" }}>
                        <dt style={{ fontSize: "13px", color: "rgba(255,255,255,.6)" }}>
                          {r.k}
                        </dt>
                        <dd style={{ margin: "3px 0 0", fontSize: "17px", lineHeight: "1.4", fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>
                          {r.v}
                        </dd>
                      </dl>
                      {" "}
                      {r.kopio ? (
                        <>
                          <Kop arvo={r.arvo} aria={r.aria} tumma />
                        </>
                      ) : null}
                      {" "}
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </article>
          {" "}
          <div className="mo-rv" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px", marginTop: "18px" }}>
            {" "}
            <a href="mailto:info@wsmedia.fi" className="mo-m-tile" style={{ background: "#0b1320", borderColor: "#0b1320" }}>
              <span className="mo-m-tile-i">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                  <path d="M3 7l9 6 9-6"></path>
                </svg>
              </span>
              <span>
                <b style={{ display: "block", fontSize: "17px" }}>
                  {"Sähköposti"}
                </b>
                <span style={{ display: "block", fontSize: "13.5px", color: "rgba(255,255,255,.7)", marginTop: "2px" }}>
                  {"info@wsmedia.fi"}
                </span>
              </span>
            </a>
            {" "}
            <a href="tel:+358405648770" className="mo-m-tile" style={{ background: "#fff", color: "#11151a", borderColor: "rgba(17,21,26,.1)" }}>
              <span className="mo-m-tile-i" style={{ background: "rgba(0,124,143,.1)", color: "#007c8f" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6.6 3.5h2.6l1.6 4.2-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4.2 1.6v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"></path>
                </svg>
              </span>
              <span>
                <b style={{ display: "block", fontSize: "17px" }}>
                  {"Soita"}
                </b>
                <span style={{ display: "block", fontSize: "13.5px", color: "#4a5560", marginTop: "2px" }}>
                  {"040 564 8770"}
                </span>
              </span>
            </a>
            {" "}
          </div>
          {" "}
        </section>
        {" "}
        <footer style={{ position: "relative", zIndex: "2", padding: "40px 20px 120px", background: "#05080c", display: "flex", flexDirection: "column", gap: "22px", fontSize: "15px" }}>
          {" "}
          <div>
            <b style={{ fontSize: "18px" }}>
              {"WS Media"}
            </b>
            <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.55", color: "rgba(255,255,255,.65)" }}>
              {"Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."}
            </p>
          </div>
          {" "}
          <div style={{ display: "flex", gap: "10px" }}>
            {" "}
            <a href="https://www.instagram.com/wsmedia.fi/" aria-label="Instagram" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="5"></rect>
                <circle cx="12" cy="12" r="3.6"></circle>
              </svg>
            </a>
            {" "}
            <a href="https://www.tiktok.com/@wsmedia.fi" aria-label="TikTok" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M14 4v10.5a3.3 3.3 0 1 1-3.3-3.3M14 4c.5 2.3 2 3.8 4.6 4.1"></path>
              </svg>
            </a>
            {" "}
            <a href="https://fi.linkedin.com/company/ws-media-oy" aria-label="LinkedIn" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="4" y="9" width="3.5" height="11"></rect>
                <circle cx="5.7" cy="5.5" r="2"></circle>
                <path d="M10 9h3.3v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20H17v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z"></path>
              </svg>
            </a>
            {" "}
            <a href="https://www.google.com/maps?cid=17434529617661064987" aria-label="Google-profiili" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"></path>
                <circle cx="12" cy="9.5" r="2.5"></circle>
              </svg>
            </a>
            {" "}
          </div>
          {" "}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "22px 12px" }}>
            {" "}
            <div>
              <b style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,.55)", marginBottom: "8px" }}>
                {"Palvelut"}
              </b>
              <a href="/lyhytvideot" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Lyhytvideot"}
              </a>
              <a href="/verkkosivut" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Verkkosivut"}
              </a>
              <a href="/hakukoneoptimointi" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Hakukoneoptimointi"}
              </a>
              <a href="/graafinen-suunnittelu" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Graafinen suunnittelu"}
              </a>
            </div>
            {" "}
            <div>
              <b style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,.55)", marginBottom: "8px" }}>
                {"Yritys"}
              </b>
              <a href="/meista" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Meistä"}
              </a>
              <a href="/" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Referenssit"}
              </a>
              <a href="/toihin-meille" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Töihin meille"}
              </a>
              <a href="/yhteystiedot" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Ota yhteyttä"}
              </a>
              <a href="/laskutustiedot" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
                {"Laskutustiedot"}
              </a>
            </div>
            {" "}
          </div>
          {" "}
          <div>
            <b style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,.55)", marginBottom: "8px" }}>
              {"Yhteystiedot"}
            </b>
            <a href="mailto:info@wsmedia.fi" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
              {"info@wsmedia.fi"}
            </a>
            <a href="tel:+358405648770" style={{ display: "block", padding: "6px 0", color: "#fff", textDecoration: "none" }}>
              {"040 564 8770"}
            </a>
            <span style={{ display: "block", padding: "6px 0", color: "rgba(255,255,255,.75)" }}>
              {"Kuusiniementie 8 F"}
              <br />
              {"02710 Espoo"}
            </span>
          </div>
          {" "}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,.1)", fontSize: "13.5px", color: "rgba(255,255,255,.55)" }}>
            <span>
              {"© 2026 WS Media Oy"}
            </span>
            <a href="/tietosuoja" className="mo-osuma" style={{ color: "rgba(255,255,255,.75)", textDecoration: "none" }}>
              {"Tietosuojaseloste"}
            </a>
            <a href="#" data-mo-evasteet="" className="mo-osuma" style={{ color: "rgba(255,255,255,.75)", textDecoration: "none" }}>
              {"Evästeasetukset"}
            </a>
          </div>
          {" "}
        </footer>
        {" "}
      </div>
      <Kuori reitti="/laskutustiedot" tapa="pieni" />
      <Moottori otsake={{ tapa: "pieni" }} />
      <Efektit />
    </div>
  );
}
