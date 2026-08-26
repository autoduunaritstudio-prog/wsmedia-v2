const SERVICES = [
  "Lyhytvideot",
  "TikTok-videot",
  "Instagram Reels",
  "YouTube Shorts",
  "Verkkosivut",
  "Tapahtumat",
];

const COMPANY = ["Työnäytteet", "Prosessi", "Hinnoittelu", "Blogi", "Ota yhteyttä"];

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="cols">
          <div style={{ maxWidth: "280px" }}>
            <h4>WS Media</h4>
            <p>
              Lyhytvideot, verkkosivut ja tapahtumat. Espoo ja Helsinki. Yrityksille jotka haluavat
              kasvaa.
            </p>
          </div>
          <div>
            <h4>Palvelut</h4>
            {SERVICES.map((s) => (
              <a href="#" key={s}>
                {s}
              </a>
            ))}
          </div>
          <div>
            <h4>Yritys</h4>
            {COMPANY.map((c) => (
              <a href="#" key={c}>
                {c}
              </a>
            ))}
          </div>
        </div>
        <div className="base">© 2026 WS Media Oy · Espoo</div>
      </div>
    </footer>
  );
}
