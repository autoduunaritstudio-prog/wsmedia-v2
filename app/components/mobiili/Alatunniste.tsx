/* MOBIILIN ALATUNNISTE (6.10.2026): suunnitelman footer sellaisenaan
   (Puhelin.dc.html ja palvelusivut). Etusivulla Referenssit on saman
   sivun ankkuri, muilla sivuilla linkki etusivun osioon. Tyylit
   .mo-e-flink ja .mo-e-some tulevat sivun omasta CSS:sta. */
import { LOGO_VIEWBOX, LogoPolut } from "./Logo";

export default function Alatunniste({ etusivu = false }: { etusivu?: boolean }) {
  return (
          <footer data-teema="tumma" data-verkko="footer" data-vari="#060b14" style={{ position: "relative", zIndex: "1", background: "#080d13", padding: "48px 22px 96px", color: "#f5f5f7", borderTop: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <svg viewBox={LOGO_VIEWBOX} width="58" height="28" fill="#f5f5f7" aria-hidden="true">
                <LogoPolut />
              </svg>
              <span style={{ width: "1px", height: "26px", background: "rgba(255,255,255,.18)" }}></span>
              <p style={{ margin: "0", fontSize: "13.5px", lineHeight: "1.4", color: "#a9b8c6" }}>
                {"Lyhytvideot, verkkosivut ja graafinen ilme."}
                <br />
                {"Espoo ja Helsinki."}
              </p>
            </div>
            <p className="mo-rv" style={{ margin: "28px 0 0", fontSize: "26px", lineHeight: "1.15", letterSpacing: "-.02em", fontWeight: "620" }}>
              {"Yrityksille, jotka haluavat "}
              <span style={{ color: "#6fecff" }}>
                {"kasvaa."}
              </span>
            </p>
            <div className="mo-rv-s" style={{ marginTop: "22px", borderRadius: "20px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)", overflow: "hidden" }}>
              <a href="tel:+358405648770" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", color: "#f5f5f7", textDecoration: "none" }}>
                <span style={{ width: "38px", height: "38px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(111,236,255,.1)", color: "#6fecff" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path>
                  </svg>
                </span>
                <span style={{ flex: "1" }}>
                  <span style={{ display: "block", fontSize: "12px", color: "#8fa3b5" }}>
                    {"Soita"}
                  </span>
                  <b style={{ fontSize: "17px", fontWeight: "600" }}>
                    {"040 564 8770"}
                  </b>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6f8191" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6"></path>
                </svg>
              </a>
              <a href="mailto:info@wsmedia.fi" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", color: "#f5f5f7", textDecoration: "none", borderTop: "1px solid rgba(255,255,255,.07)" }}>
                <span style={{ width: "38px", height: "38px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(111,236,255,.1)", color: "#6fecff" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2.5"></rect>
                    <path d="M3.5 7l8.5 6 8.5-6"></path>
                  </svg>
                </span>
                <span style={{ flex: "1" }}>
                  <span style={{ display: "block", fontSize: "12px", color: "#8fa3b5" }}>
                    {"Sähköposti"}
                  </span>
                  <b style={{ fontSize: "17px", fontWeight: "600" }}>
                    {"info@wsmedia.fi"}
                  </b>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6f8191" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6"></path>
                </svg>
              </a>
              <a href="https://www.google.com/maps?cid=17434529617661064987" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", color: "#f5f5f7", textDecoration: "none", borderTop: "1px solid rgba(255,255,255,.07)" }}>
                <span style={{ width: "38px", height: "38px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(111,236,255,.1)", color: "#6fecff" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"></path>
                    <circle cx="12" cy="10" r="2.4"></circle>
                  </svg>
                </span>
                <span style={{ flex: "1" }}>
                  <span style={{ display: "block", fontSize: "12px", color: "#8fa3b5" }}>
                    {"Osoite"}
                  </span>
                  <b style={{ fontSize: "15.5px", fontWeight: "600" }}>
                    {"Kuusiniementie 8 F 3, 02710 Espoo"}
                  </b>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6f8191" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6"></path>
                </svg>
              </a>
            </div>
            <div className="mo-rv-s" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px", marginTop: "32px" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "11.5px", fontWeight: "600", letterSpacing: ".12em", textTransform: "uppercase", color: "#8fa3b5" }}>
                  {"Palvelut"}
                </p>
                <a href="/lyhytvideot" className="mo-e-flink">
                  {"Lyhytvideot"}
                </a>
                <a href="/verkkosivut" className="mo-e-flink">
                  {"Verkkosivut"}
                </a>
                <a href="/hakukoneoptimointi" className="mo-e-flink">
                  {"Hakukoneoptimointi"}
                </a>
                <a href="/graafinen-suunnittelu" className="mo-e-flink">
                  {"Graafinen suunnittelu"}
                </a>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "11.5px", fontWeight: "600", letterSpacing: ".12em", textTransform: "uppercase", color: "#8fa3b5" }}>
                  {"Yritys"}
                </p>
                {etusivu ? (
                  <a data-ankkuri="referenssit" role="link" tabIndex={0} className="mo-e-flink">
                    {"Referenssit"}
                  </a>
                ) : (
                  <a href="/#referenssit" className="mo-e-flink">
                    {"Referenssit"}
                  </a>
                )}
                <a href="/toihin-meille" className="mo-e-flink">
                  {"Töihin meille"}
                </a>
                <a href="/yhteystiedot" className="mo-e-flink">
                  {"Ota yhteyttä"}
                </a>
                <a href="/laskutustiedot" className="mo-e-flink">
                  {"Laskutustiedot"}
                </a>
              </div>
            </div>
            <div className="mo-rv-s" style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
              <a href="https://www.instagram.com/wsmedia.fi/" className="mo-e-some" aria-label="WS Media Instagramissa">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="5"></rect>
                  <circle cx="12" cy="12" r="3.6"></circle>
                  <circle cx="17" cy="7" r=".6" fill="currentColor"></circle>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@wsmedia.fi" className="mo-e-some" aria-label="WS Media TikTokissa">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M14 4v10.5a3.3 3.3 0 1 1-3.3-3.3M14 4c.5 2.3 2 3.8 4.6 4.1"></path>
                </svg>
              </a>
              <a href="https://fi.linkedin.com/company/ws-media-oy" className="mo-e-some" aria-label="WS Media LinkedInissä">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="4" y="9" width="3.5" height="11"></rect>
                  <circle cx="5.7" cy="5.5" r="2"></circle>
                  <path d="M10 9h3.3v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20H17v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z"></path>
                </svg>
              </a>
              <a href="https://www.google.com/maps?cid=17434529617661064987" className="mo-e-some" aria-label="WS Media Googlessa">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"></path>
                  <circle cx="12" cy="10" r="2.4"></circle>
                </svg>
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8px 18px", marginTop: "26px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,.08)", fontSize: "13px", color: "#8a93a3" }}>
              <span>
                {"© 2026 WS Media Oy · Y-tunnus 3615084-4"}
              </span>
              <span style={{ display: "flex", gap: "16px" }}>
                <a href="/tietosuoja" className="mo-osuma" style={{ color: "#b9c0cf", textDecoration: "none" }}>
                  {"Tietosuoja"}
                </a>
                <a href="/tietosuoja#evasteet" className="mo-osuma" style={{ color: "#b9c0cf", textDecoration: "none" }}>
                  {"Evästeet"}
                </a>
              </span>
            </div>
          </footer>
  );
}
