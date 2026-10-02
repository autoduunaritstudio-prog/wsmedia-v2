/* 404-SIVU (2.10.2026). Ulkoasu sama kuin Nextin oletussivulla.
   global-not-found eika not-found: juuren layout ei enaa tuo tyyleja,
   vaan jokainen sivu tuo omansa (scripts/tyylit.cjs). not-found.tsx:n
   tyylituonti liitettaisiin Nextissa JOKAISELLE sivulle, eli kaikki
   lataisivat kaksi tyylitiedostoa. Tama sivu ohittaa layoutin
   kokonaan, joten se tarvitsee oman html:n eika lataa sivuston tyyleja. */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404: Sivua ei löytynyt | WS Media",
};

export default function GlobalNotFound() {
  return (
    <html lang="fi">
      <body style={{ margin: 0, color: "#000", background: "#fff" }}>
        <div
          style={{
            fontFamily:
              'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
            height: "100vh",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <h1
              style={{
                display: "inline-block",
                margin: "0 20px 0 0",
                padding: "0 23px 0 0",
                fontSize: 24,
                fontWeight: 500,
                verticalAlign: "top",
                lineHeight: "49px",
                borderRight: "1px solid rgba(0,0,0,.3)",
              }}
            >
              404
            </h1>
            <div style={{ display: "inline-block" }}>
              <h2 style={{ fontSize: 14, fontWeight: 400, lineHeight: "49px", margin: 0 }}>
                Sivua ei löytynyt. <Link href="/">Etusivulle</Link>
              </h2>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
