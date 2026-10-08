/* YHTEYSTIEDOT: PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Yhteystiedot.dc.html: rakenne,
   tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on muunnettu
   koneellisesti (dc2jsx.mjs + tyokalut/pienet.py) ja vierityksen arvot on
   korvattu alkutilalla (y = 0). Naytetaan vain max-width: 767px.

   Suunnitelman oma ylapalkki, valikkolinkki ja CTA-pilleri korvataan
   yhteisella Kuorella (tapa="pieni"); footer on suunnitelman oma.
   Vierityksen arvot (heron skaalaus, teksti, himmennys, kulmat,
   filminauha) kirjoittaa Efektit.tsx suoraan DOMiin; tekijakorttien
   pino on Moottorin data-pino (suunnitelman kaava: 84 + i * 16, matka
   420 px, skaala 1 - 0,06k). "Laheta viesti" -alapaneeli on oma
   saarekkeensa (Viesti.tsx). */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./mobiili.css";
import "./lisat.css";
import { Fragment } from "react";
import { TYHJA } from "@/app/components/mobiili/mo";
import Kuori from "@/app/components/mobiili/Kuori";
import Moottori from "@/app/components/mobiili/Moottori";
import Efektit from "./Efektit";
import Viesti from "./Viesti";

const RUUDUT = [
        { src: '/mobiili/huoltoasema-terava.webp', alt: '' },
        { src: '/kuvat/halli-kortti.webp', alt: 'Kuvaus asiakkaan hallissa' },
        { src: '/mobiili/kuvauskeikka-k.webp', alt: 'Kuvauskeikka kadulla' },
        { src: '/kuvat/fx9-k.webp', alt: 'Kamera kuvauspaikalla kiitoradalla' },
        { src: '/mobiili/huoltoasema-terava.webp', alt: 'Kuvaus huoltoasemalla' },
        { src: '/mobiili/autossa-terava.webp', alt: 'Kuvaus auton sisällä' },
        { src: '/kuvat/halli-kortti.webp', alt: '' },
      ];
const tekijat = [
      ['Graafinen suunnittelu', 'Ville Karppinen', 'Asiakasvastaava. Myös tarjoukset ja sopimukset.'],
      ['Verkkosivut ja hakukoneoptimointi', 'Tuomas Ivanov', 'Perustaja'],
      ['Lyhytvideot ja Meta-mainonta', 'Alex Pettersborg', 'Toimitusjohtaja ja tuottaja'],
    ];
const TEKIJAT = tekijat.map((t, i) => ({ ala: t[0], nimi: t[1], rooli: t[2], nro: '0' + (i + 1), top: 84 + i * 16, skaala: "1.0000" }));

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

export default function YhteysMobiili() {
  return (
    <div className="mo-root mo-s-yhteys">
      <div style={{ position: "relative", background: "#0b0f14", color: "#fff", fontFamily: "var(--font-instrument), system-ui, sans-serif" }}>
        {" "}
        {/* HERO: pinnattu, numero on otsikko */}
        {" "}
        <div style={{ height: "calc(100svh + 716px)", position: "relative", background: "#0b0f14" }}>
          {" "}
          <div data-hero="" style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden", background: "radial-gradient(120% 70% at 80% 0%, #1d3453 0%, #0b0f14 64%)", transform: "scale(1)", transformOrigin: "50% 0" }}>
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
            <div className="mo-m-glow" style={{ left: "-60px", top: "150px", opacity: ".55" }}></div>
            {" "}
            <div style={{ position: "absolute", left: "20px", right: "20px", top: "112px", display: "flex", flexDirection: "column", gap: "14px", transform: "translateY(0px)", opacity: "1" }} data-hero-teksti="">
              {" "}
              <h1 className="mo-li mo-d1" style={{ margin: "0", fontSize: "40px", lineHeight: "1.06", letterSpacing: "-0.035em", fontWeight: "700" }}>
                {"Ota yhteyttä WS Mediaan"}
              </h1>
              {" "}
              <a className="mo-li mo-d2" href="tel:+358405648770" aria-label="Soita 040 564 8770" style={{ display: "block", fontSize: "52px", lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "700", color: "#6fecff", textDecoration: "none", fontVariantNumeric: "tabular-nums", textShadow: "0 0 40px rgba(111,236,255,.35)", whiteSpace: "nowrap" }}>
                {"040 564 8770"}
              </a>
              {" "}
              <p className="mo-li mo-d2" style={{ margin: "0", fontSize: "17px", lineHeight: "1.55", color: "rgba(255,255,255,.8)" }}>
                {"Soita tai kirjoita. Vastaamme 24 tunnin sisällä."}
              </p>
              {" "}
              <div className="mo-li mo-d3" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px", marginTop: "6px" }}>
                {" "}
                <a href="tel:+358405648770" className="mo-m-tile" style={{ background: "#6fecff", color: "#0b1320", borderColor: "#6fecff" }}>
                  <span className="mo-m-tile-i" style={{ background: "rgba(11,19,32,.12)", color: "#0b1320" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6.6 3.5h2.6l1.6 4.2-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4.2 1.6v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"></path>
                    </svg>
                  </span>
                  <span>
                    <b style={{ display: "block", fontSize: "17px" }}>
                      {"Soita"}
                    </b>
                    <span style={{ display: "block", fontSize: "13.5px", opacity: ".75", marginTop: "2px" }}>
                      {"040 564 8770"}
                    </span>
                  </span>
                </a>
                {" "}
                <a href="mailto:info@wsmedia.fi" className="mo-m-tile">
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
              </div>
              {" "}
              <div className="mo-li mo-d4" style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                {" "}
                <button type="button" data-mo-viesti="" aria-haspopup="dialog" className="mo-m-btn mo-m-o">
                  {"Lähetä viesti"}
                </button>
                {" "}
                <a href="/yhteystiedot" data-varaus="" className="mo-m-btn mo-m-o" style={{ borderColor: "rgba(233,212,180,.5)", color: "#e9d4b4" }}>
                  {"Varaa maksuton kartoitus"}
                </a>
                {" "}
              </div>
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
        {/* YHTEYSRIVIT: vaalea cover nousee heron päälle */}
        {" "}
        <section style={{ position: "relative", zIndex: "2", marginTop: "calc(-1 * 100svh)", padding: "22px 20px 60px", background: "#eef1f5", color: "#11151a", borderRadius: "28px 28px 0 0", boxShadow: "0 -30px 60px -20px rgba(0,0,0,.6)" }}>
          {" "}
          <span style={{ display: "block", margin: "0 auto 22px", width: "44px", height: "5px", borderRadius: "3px", background: "rgba(17,21,26,.15)" }}></span>
          {" "}
          <dl style={{ margin: "0", borderRadius: "22px", background: "#fff", boxShadow: "0 24px 50px -30px rgba(13,13,16,.45)", padding: "4px 18px" }}>
            {" "}
            <div className="mo-rv" style={{ padding: "16px 0", borderBottom: "1px solid rgba(17,21,26,.08)" }}>
              {" "}
              <dt style={{ fontSize: "13px", fontWeight: "600", letterSpacing: ".04em", color: "#00697a" }}>
                {"Sähköposti"}
              </dt>
              {" "}
              <dd style={{ margin: "6px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <a href="mailto:info@wsmedia.fi" style={{ fontSize: "18px", fontWeight: "600", color: "#11151a", textDecoration: "none", minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
                  {"info@wsmedia.fi"}
                </a>
                <Kop arvo="info@wsmedia.fi" aria="Kopioi sähköpostiosoite" />
              </dd>
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ padding: "16px 0", borderBottom: "1px solid rgba(17,21,26,.08)" }}>
              {" "}
              <dt style={{ fontSize: "13px", fontWeight: "600", letterSpacing: ".04em", color: "#00697a" }}>
                {"Osoite"}
              </dt>
              {" "}
              <dd style={{ margin: "6px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ fontSize: "17px", lineHeight: "1.45", color: "#11151a" }}>
                  {"Kuusiniementie 8 F, 02710 Espoo"}
                </span>
                <Kop arvo="Kuusiniementie 8 F, 02710 Espoo" aria="Kopioi osoite" />
              </dd>
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ padding: "16px 0", borderBottom: "1px solid rgba(17,21,26,.08)" }}>
              {" "}
              <dt style={{ fontSize: "13px", fontWeight: "600", letterSpacing: ".04em", color: "#00697a" }}>
                {"Aukioloajat"}
              </dt>
              {" "}
              <dd style={{ margin: "8px 0 0", display: "flex", flexDirection: "column", gap: "6px", fontSize: "17px", color: "#11151a" }}>
                {" "}
                <span style={{ display: "flex", justifyContent: "space-between" }}>
                  <b>
                    {"Ma–pe"}
                  </b>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    {"9–18"}
                  </span>
                </span>
                {" "}
                <span style={{ display: "flex", justifyContent: "space-between" }}>
                  <b>
                    {"La"}
                  </b>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    {"11–16"}
                  </span>
                </span>
                {" "}
              </dd>
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ padding: "10px 0", borderBottom: "1px solid rgba(17,21,26,.08)" }}>
              {" "}
              <dt style={{ fontSize: "13px", fontWeight: "600", letterSpacing: ".04em", color: "#00697a", paddingTop: "6px" }}>
                {"Google"}
              </dt>
              {" "}
              <dd style={{ margin: "0" }}>
                <a href="https://www.google.com/maps?cid=17434529617661064987" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "48px", fontSize: "17px", fontWeight: "600", color: "#007c8f", textDecoration: "none" }}>
                  {"Kartta ja arvostelut"}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7M9 7h8v8"></path>
                  </svg>
                </a>
              </dd>
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ padding: "10px 0" }}>
              {" "}
              <dt style={{ fontSize: "13px", fontWeight: "600", letterSpacing: ".04em", color: "#00697a", paddingTop: "6px" }}>
                {"Laskutus"}
              </dt>
              {" "}
              <dd style={{ margin: "0" }}>
                <a href="/laskutustiedot" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "48px", fontSize: "17px", fontWeight: "600", color: "#007c8f", textDecoration: "none" }}>
                  {"Laskutustiedot"}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M9 6l6 6-6 6"></path>
                  </svg>
                </a>
              </dd>
              {" "}
            </div>
            {" "}
          </dl>
          {" "}
        </section>
        {" "}
        {/* FILMINAUHA: liukuu vierityksen mukaan */}
        {" "}
        <div data-filmi="1" role="img" aria-label="WS Median kuvauksia" style={{ position: "relative", zIndex: "2", padding: "56px 0", background: "#0b0f14", overflow: "hidden" }}>
          {" "}
          <div data-filmi-nauha="" className="mo-yt-nauha" style={{ display: "flex", gap: "0", width: "max-content", padding: "16px 0", background: "#05080c", boxShadow: "0 30px 60px -30px rgba(0,0,0,.9)" }}>
            {" "}
            {(RUUDUT).map((r: any, rI: number) => (
              <Fragment key={rI}>
                {" "}
                <div style={{ position: "relative", flex: "none", width: "214px", padding: "18px 7px", boxSizing: "border-box", backgroundImage: "repeating-linear-gradient(90deg, transparent 0 8px, rgba(233,212,180,.5) 8px 18px, transparent 18px 26px), repeating-linear-gradient(90deg, transparent 0 8px, rgba(233,212,180,.5) 8px 18px, transparent 18px 26px)", backgroundSize: "100% 7px, 100% 7px", backgroundPosition: "0 5px, 0 calc(100% - 5px)", backgroundRepeat: "no-repeat" }}>
                  {" "}
                  <img src={TYHJA} data-filmi-src={r.src} alt={r.alt} width="200" height="140" style={{ display: "block", width: "200px", height: "140px", objectFit: "cover", borderRadius: "4px" }} decoding="async" />
                  {" "}
                </div>
                {" "}
              </Fragment>
            ))}
            {/* Sama sisalto toiseen kertaan: saumaton silmukka (siirto -50 %). */}
            {(RUUDUT).map((r: any, rI: number) => (
              <Fragment key={"b" + rI}>
                {" "}
                <div style={{ position: "relative", flex: "none", width: "214px", padding: "18px 7px", boxSizing: "border-box", backgroundImage: "repeating-linear-gradient(90deg, transparent 0 8px, rgba(233,212,180,.5) 8px 18px, transparent 18px 26px), repeating-linear-gradient(90deg, transparent 0 8px, rgba(233,212,180,.5) 8px 18px, transparent 18px 26px)", backgroundSize: "100% 7px, 100% 7px", backgroundPosition: "0 5px, 0 calc(100% - 5px)", backgroundRepeat: "no-repeat" }}>
                  {" "}
                  <img src={TYHJA} data-filmi-src={r.src} alt="" width="200" height="140" style={{ display: "block", width: "200px", height: "140px", objectFit: "cover", borderRadius: "4px" }} decoding="async" />
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
        {/* KENELLE ASIASI KUULUU */}
        {" "}
        <section id="m-kenelle" style={{ position: "relative", zIndex: "2", padding: "20px 20px 64px", background: "#0b0f14" }}>
          {" "}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "26px" }}>
            {" "}
            <h2 className="mo-m-h2 mo-rv">
              <span className="mo-m-otsikko mo-m-otsikko-d">
                {"Kenelle asiasi kuuluu"}
              </span>
            </h2>
            {" "}
            <p className="mo-m-p2 mo-rv mo-d1">
              {"Kaikki viestit tulevat samaan osoitteeseen, ja ohjaamme ne oikealle ihmiselle."}
            </p>
            {" "}
          </div>
          {" "}
          <dl data-pino='{"alku":84,"askel":16,"oma":true,"matka":420,"sk":0.06,"hi":0}' style={{ margin: "0", display: "block" }}>
            {" "}
            {(TEKIJAT).map((t: any, tI: number) => (
              <Fragment key={tI}>
                {" "}
                <div data-kortti="1" style={{ position: "sticky", top: `${t.top}px`, marginBottom: "16px", padding: "22px 20px", minHeight: "200px", boxSizing: "border-box", borderRadius: "22px", overflow: "hidden", background: "linear-gradient(160deg, #16263d 0%, #101b2c 70%)", border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 -12px 40px -18px rgba(0,0,0,.8)", transform: `scale(${t.skaala})`, transformOrigin: "50% 0", transition: "transform .25s linear" }}>
                  {" "}
                  <dt style={{ fontSize: "13px", fontWeight: "600", letterSpacing: ".04em", color: "#6fecff" }}>
                    {t.ala}
                  </dt>
                  {" "}
                  <dd style={{ margin: "14px 0 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {" "}
                    <b style={{ fontSize: "27px", lineHeight: "1.1", letterSpacing: "-0.025em" }}>
                      {t.nimi}
                    </b>
                    {" "}
                    <span style={{ fontSize: "16px", lineHeight: "1.55", color: "rgba(255,255,255,.72)" }}>
                      {t.rooli}
                    </span>
                    {" "}
                  </dd>
                  {" "}
                </div>
                {" "}
              </Fragment>
            ))}
            {" "}
          </dl>
          {" "}
          <p className="mo-m-p2 mo-rv" style={{ marginTop: "14px", padding: "20px 18px", borderRadius: "20px", background: "#101b2c", border: "1px solid rgba(255,255,255,.1)" }}>
            {"Toimimme Espoosta käsin koko pääkaupunkiseudulla ja muualla Suomessa. Kuvaukset tehdään yrityksesi tiloissa tai sovitussa paikassa, ja valmiit videot ja sivut toimitetaan sähköisesti."}
          </p>
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
      <Viesti />
      <Kuori reitti="/yhteystiedot" tapa="pieni" />
      <Moottori otsake={{ tapa: "pieni" }} />
      <Efektit />
    </div>
  );
}
