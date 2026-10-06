/* MEISTA-SIVUN PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Meista.dc.html: rakenne,
   tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on muunnettu
   koneellisesti (dc2jsx.mjs + _mobiili-design/tyokalut/meista.py) ja
   vierityksen arvot on korvattu alkutilalla (y = 0); Efektit.tsx ja
   Moottori.tsx kirjoittavat ne suoraan DOMiin. Naytetaan vain
   max-width: 767px (mobiili.css).

   Tietoiset poikkeamat suunnitelmasta (ulkonako sama):
   - Heron tarkennus: suunnitelma animoi filter: blur(3.5px -> 0). Tassa
     teravan kuvan paalla on valmiiksi sumennettu kopio, jonka opacity
     haivyttaa 1 -> 0 samalla kayralla. saturate(1.05) on poltettu kuvaan.
   - AF-kehys: suunnitelma animoi left/top/width/height. Tassa neljalla
     reunaviivalla (translate + scaleX/scaleY), viivan paksuus 1,5 px.
   - Logonauhan valkoiset logot ovat valmiita kuvia (suunnitelmassa
     filter: brightness(0) invert(1)).
   - Kuvat ovat puhelimelle pienennettyja kopioita (public/mobiili/meista),
     tarjousosion kuva on rajattu ja objectPosition laskettu niin, etta
     390 px:n leveydella rajaus on sama. */
import { Ansa, LomakeVirhe } from "@/app/components/mobiili/Lomakeosat";
import "./mobiili.css";
import "./lisat.css";
import { Fragment } from "react";
import { TYHJA, logoLeveys } from "@/app/components/mobiili/mo";
import Kuori from "@/app/components/mobiili/Kuori";
import Alatunniste from "@/app/components/mobiili/Alatunniste";
import Moottori from "@/app/components/mobiili/Moottori";
import Efektit from "./Efektit";
import { SUMEA } from "./sumea";

/* ---- Suunnitelman renderVals()-tiedot sellaisenaan ---- */
const logot = [
      { src: '/mobiili/meista/porsche-club-finland-valk.webp', alt: 'Porsche Club Finland', h: 34 },
      { src: '/mobiili/logot/tesla-owners-finland-color.webp', alt: 'Tesla Owners Finland', h: 34 },
      { src: '/mobiili/meista/colormaster-valk.webp', alt: 'Colormaster', h: 28 },
      { src: '/mobiili/meista/ydr-autohuolto-valk.webp', alt: 'YDR Autohuolto', h: 30 },
      { src: '/mobiili/logot/ls-monogram-color.webp', alt: 'Laaksolahden Sähkö', h: 32 }
    ]
const LOGOT = logot.concat(logot, logot, logot);
const VAI = [
      { t: 'Video herättää kiinnostuksen', v: 'Lyhytvideo tavoittaa ihmiset, jotka eivät vielä tiedä etsivänsä sinua.', kuva: '/mobiili/meista/halli-kortti.webp', alt: 'Kuvaaja säätää kameraa hallissa', pos: '50% 30%' },
      { t: 'Verkkosivu ottaa kävijän vastaan', v: 'Sivu kertoo nopeasti, mitä palvelu maksaa ja miten edetään, ja ohjaa yhteydenottoon.', kuva: '/mobiili/meista/kartoitus-valmis.webp', alt: 'Kartoituksen paperit pöydällä', pos: '50% 50%' },
      { t: 'Näkyvyys tuo oikeat ihmiset', v: 'Hakukoneoptimointi ja Meta-mainonta tuovat paikalle ne, jotka ovat jo ostamassa.', kuva: '/mobiili/meista/poyta.webp', alt: 'Kannettava tietokone pöydällä', pos: '50% 50%' }
    ];
const VAIHEET = VAI.map((v, i) => Object.assign({}, v, { n: i + 1, top: 76 + i * 14, sk: "1.0000", himmea: "0.000" }));
const TIIMI = [
      { nimi: 'Tuomas Ivanov', nimikirj: 'TI', rooli: 'Perustaja', alat: ['Verkkosivut', 'Hakukoneoptimointi', 'Analytiikka'], huom: 'Yrittäjänä yli 11 vuotta.', vari: '#6fecff' },
      { nimi: 'Alex Pettersborg', nimikirj: 'AP', rooli: 'Toimitusjohtaja ja tuottaja', alat: ['Lyhytvideotuotanto', 'Kuvaukset', 'Meta-mainonta'], huom: 'Tietää, mikä toimii kameran edessä.', vari: '#ff9a4d' },
      { nimi: 'Ville Karppinen', nimikirj: 'VK', rooli: 'Asiakasvastaava ja osakas', alat: ['Graafinen suunnittelu', 'Asiakkaan yhteyshenkilö', 'Tarjoukset ja sopimukset'], huom: 'Pitää huolen, että sovittu toteutuu.', vari: '#e9d4b4' }
    ];
const TIIMI_ = TIIMI.map((t, i) => { const on = i === 0; return Object.assign({}, t, { otto: i + 1, sk: on ? 1 : 0.94, op: on ? 1 : 0.6, klaffi: on ? 0 : -16, reuna: on ? 'inset 0 0 0 1px rgba(111,236,255,.35), 0 30px 50px -28px rgba(0,0,0,.95)' : 'inset 0 0 0 1px rgba(255,255,255,.08)' }); });
const TIIMI_PISTEET = TIIMI.map((x, i) => ({ w: i === 0 ? 22 : 6, c: i === 0 ? '#6fecff' : 'rgba(255,255,255,.25)' }));
const TAPA = [
      { t: 'Kerromme, jos et tarvitse meitä', v: 'Jos video, uudet sivut tai hakukoneoptimointi eivät ratkaise tilannettasi, sanomme sen kartoituksessa ja ohjaamme oikeaan suuntaan.', ikoni: 'M16 28a12 12 0 1 0 0-24 12 12 0 0 0 0 24zM11 16.5l3.5 3.5 7-7.5', sar: '1 / -1' },
      { t: 'Yksi yhteyshenkilö', v: 'Asiasi etenee yhden ihmisen kautta alusta loppuun.', ikoni: 'M16 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM7 27c0-5 4-8.5 9-8.5s9 3.5 9 8.5', sar: 'auto' },
      { t: 'Suora puhe', v: 'Hinnat ja ehdot kerrotaan etukäteen. Ei piilokuluja.', ikoni: 'M5 8a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H13l-6 5v-5H8a3 3 0 0 1-3-3zM11 12h10M11 16h6', sar: 'auto' },
      { t: 'Kartoitus ei sido mihinkään', v: 'Käymme läpi nykytilan, kilpailijat ja mahdollisuudet. Vastaamme viestiin 24 tunnin sisällä.', ikoni: 'M16 28a12 12 0 1 0 0-24 12 12 0 0 0 0 24zM20.5 11.5l-2.8 6.2-6.2 2.8 2.8-6.2z', sar: '1 / -1' }
    ];
const FAKTAT = [['Toimisto', 'Kuusiniementie 8, Espoo'], ['Palvelemme', 'Pääkaupunkiseutu ja koko Suomi'], ['Tiimi', '3 tekijää, yksi yhteyshenkilö'], ['Vastaus', 'Viestiin 24 tunnin sisällä'], ['Avoinna', 'Ma–pe 9–18, la 11–16'], ['Palvelut', 'Lyhytvideot, verkkosivut, SEO, grafiikka, Meta-mainonta']].map((f) => ({ l: f[0], v: f[1] }));

export default function MeistaMobiili() {
  return (
    <div className="mo-root mo-s-meista">
      {/* Heron kuva (LCP) heti, vaikka puhelinversion puu on HTML:n lopussa. */}
      <link rel="preload" as="image" href="/mobiili/meista/fx9-hero.webp" media="(max-width: 767px)" fetchPriority="high" />
      <div className="mo-e-root" style={{ position: "relative", background: "#0b0f14", color: "#f5f5f7" }}>
        {" "}
        {/* HERO: kameran etsin, tarkennus lukittuu vierityksen mukana */}
        {" "}
        <div style={{ height: "calc(300px + 200svh)", position: "relative" }}>
          {" "}
          <div data-teema="tumma" style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden", background: "#070b12" }}>
            {" "}
            <div style={{ position: "absolute", left: "0", right: "0", top: "0", height: "520px", overflow: "hidden" }}>
              {" "}
              <span data-meista="kuva" style={{ position: "absolute", left: "50%", top: "0", height: "100%", aspectRatio: "16 / 9", transform: "translateX(-46%) scale(1.18)", transformOrigin: "46% 40%", opacity: ".85" }}><img src="/mobiili/meista/fx9-hero.webp" alt="Elokuvakamera ja objektiivi kuvauspaikalla" width={1440} height={810} fetchPriority="high" loading="eager" decoding="async" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", display: "block" }} /><img src={SUMEA} alt="" aria-hidden="true" width={288} height={162} data-meista="sumea" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", display: "block", opacity: "1" }} /></span>
              {" "}
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(7,11,18,.55) 0%, rgba(7,11,18,.1) 30%, rgba(7,11,18,.35) 62%, #070b12 100%)" }}></span>
              {" "}
            </div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "16px", right: "16px", top: "78px", height: "270px", pointerEvents: "none" }}>
              {" "}
              <i className="mo-m-kulma" style={{ left: "0", top: "0", borderLeftWidth: "2px", borderTopWidth: "2px" }}></i>
              <i className="mo-m-kulma" style={{ right: "0", top: "0", borderRightWidth: "2px", borderTopWidth: "2px" }}></i>
              <i className="mo-m-kulma" style={{ left: "0", bottom: "0", borderLeftWidth: "2px", borderBottomWidth: "2px" }}></i>
              <i className="mo-m-kulma" style={{ right: "0", bottom: "0", borderRightWidth: "2px", borderBottomWidth: "2px" }}></i>
              {" "}
              <div className="mo-m-hud" style={{ position: "absolute", left: "12px", top: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="mo-m-rec" style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ff3b30" }}></i>
                <b style={{ fontFamily: "inherit", color: "#fff" }}>
                  {"REC"}
                </b>
                <span data-meista="aika">{"00:00:00"}</span>
              </div>
              {" "}
              <div className="mo-m-hud" style={{ position: "absolute", right: "12px", top: "10px" }}>
                {"4K · 25P"}
              </div>
              {" "}
              <div className="mo-m-hud" style={{ position: "absolute", left: "12px", bottom: "10px" }}>
                {"ISO 800 · 1/50 · F2.8"}
              </div>
              {" "}
              <div className="mo-m-hud" style={{ position: "absolute", right: "12px", bottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "26px", height: "10px", borderRadius: "2px", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.8)" }}>
                  <i style={{ display: "block", width: "70%", height: "100%", background: "rgba(255,255,255,.8)" }}></i>
                </span>
              </div>
              {" "}
              <div data-meista="af" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", color: "rgba(255,255,255,.85)", transition: "color .3s" }}><i data-af="y" style={{ position: "absolute", left: "0", top: "0", width: "100px", height: "1.5px", background: "currentColor", transformOrigin: "0 0", transform: "translate(24px, 44px) scaleX(3)" }}></i><i data-af="a" style={{ position: "absolute", left: "0", top: "0", width: "100px", height: "1.5px", background: "currentColor", transformOrigin: "0 0", transform: "translate(24px, 222.5px) scaleX(3)" }}></i><i data-af="v" style={{ position: "absolute", left: "0", top: "0", width: "1.5px", height: "100px", background: "currentColor", transformOrigin: "0 0", transform: "translate(24px, 44px) scaleY(1.8)" }}></i><i data-af="o" style={{ position: "absolute", left: "0", top: "0", width: "1.5px", height: "100px", background: "currentColor", transformOrigin: "0 0", transform: "translate(322.5px, 44px) scaleY(1.8)" }}></i><span className="mo-m-hud" data-af="t" style={{ position: "absolute", left: "0", top: "0", transform: "translate(24px, 28px)", color: "inherit", whiteSpace: "nowrap" }}>{"AF"}</span></div>
              {" "}
            </div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "calc(100svh - 140px)", transform: "translateX(-50%) translateY(6px)", display: "flex", alignItems: "center", gap: "12px", height: "58px", padding: "0 8px 0 6px", borderRadius: "999px", background: "rgba(12,17,23,.92)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12), 0 10px 30px -12px rgba(0,0,0,.7)", opacity: "1", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "6" }} data-meista="vihje">
              {" "}
              <span style={{ position: "relative", width: "46px", height: "46px", borderRadius: "50%", overflow: "hidden", background: "#05090d", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.22)" }}>
                <i className="mo-e-kasi" data-mo-bg="/mobiili/hint-sormi-r.webp" style={{ position: "absolute", inset: "0", background: "0 0 / 2300px 46px no-repeat", mixBlendMode: "screen" }}></i>
              </span>
              {" "}
              <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.15" }}>
                <b style={{ fontSize: "13.5px", fontWeight: "600", color: "#f5f5f7", letterSpacing: "-.005em" }}>
                  {"Vieritä alas"}
                </b>
                <span style={{ fontSize: "11.5px", color: "#a9b8c6" }}>
                  {"tiimi, tapa ja yhteystiedot"}
                </span>
              </span>
              {" "}
              <span style={{ position: "relative", width: "32px", height: "32px", marginLeft: "4px" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "block", transform: "rotate(-90deg)" }}>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2.5"></circle>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#6fecff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="81.7" strokeDashoffset="81.7" data-meista="rengas"></circle>
                </svg>
                <span style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5f5f7" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5"></path>
                  </svg>
                </span>
              </span>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", left: "22px", right: "22px", top: "calc(100svh - 448px)", transform: "translateY(0px)", zIndex: "6" }} data-meista="teksti">
              {" "}
              <h1 style={{ margin: "0", fontSize: "30px", lineHeight: "1.06", letterSpacing: "-.022em", fontWeight: "640", color: "#f5f5f7" }}>
                {"Espoolainen mainostoimisto, joka kuvaa, rakentaa ja "}
                <span style={{ color: "#6fecff" }}>
                  {"hoitaa näkyvyyden."}
                </span>
              </h1>
              {" "}
              <p style={{ margin: "12px 0 0", fontSize: "15.5px", lineHeight: "1.5", color: "#d6dce6" }}>
                {"Lyhytvideot, verkkosivut, hakukoneoptimointi ja graafinen suunnittelu samasta tiimistä. Palvelemme yrityksiä Espoossa, muualla pääkaupunkiseudulla ja koko Suomessa."}
              </p>
              {" "}
              <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                {" "}
                <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ flex: "1.25", padding: "0 12px", fontSize: "15px" }}>
                  {"Varaa kartoitus"}
                </a>
                {" "}
                <a data-ankkuri="tiimi" role="link" tabIndex={0} className="mo-e-btn mo-e-o" style={{ flex: "1", padding: "0 12px", fontSize: "15px" }}>
                  {"Tutustu tiimiin"}
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#05080c", opacity: "0", pointerEvents: "none", zIndex: "7" }} data-meista="peitto"></div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        {/* COVER */}
        {" "}
        <div data-kerros="1" style={{ position: "relative", zIndex: "2", marginTop: "calc(-1 * 100svh)", borderRadius: "30px 30px 0 0", boxShadow: "0 -30px 70px -20px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.06)", overflow: "clip" }}>
          {" "}
          <div aria-hidden="true" style={{ position: "sticky", top: "0", height: "100svh", marginBottom: "calc(-1 * 100svh)", zIndex: "0", pointerEvents: "none" }}>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#0b131d" }}></div>
            {" "}
            <canvas data-mo-verkko="" width="390" height="844" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100svh", display: "block" }}></canvas>
            {" "}
          </div>
          {" "}
          <section data-teema="tumma" data-verkko="alku" data-vari="#0b131d" style={{ position: "relative", zIndex: "1" }}>
            {" "}
            <div aria-label="Asiakkaitamme" className="mo-e-nauha-w mo-rv-n" style={{ position: "relative", height: "96px", overflow: "hidden", WebkitMask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", mask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
              {" "}
              <div className="mo-e-nauha" style={{ position: "absolute", top: "32px", left: "0" }}>
                {" "}
                {(LOGOT).map((l, lI) => (
                  <Fragment key={lI}>
                    <img src={l.src} width={logoLeveys(l.src, l.h)} height={l.h} alt={l.alt} style={{ height: `${l.h}px`, width: "auto", display: "block", opacity: ".78" }} decoding="async" />
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* MIKSI: kolme vaihetta pinoutuvat */}
          {" "}
          <section id="m-miksi" data-teema="tumma" data-verkko="miksi" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "22px 16px 30px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Miksi kaikki "}
                <span style={{ color: "#6fecff" }}>
                  {"samasta paikasta?"}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Moni yritys ostaa videot yhdeltä, verkkosivut toiselta ja mainonnan kolmannelta. Silloin kukaan ei vastaa siitä, toimiiko kokonaisuus. Meillä samat ihmiset suunnittelevat videon, rakentavat sivun ja seuraavat, tuleeko yhteydenottoja."}
              </p>
              {" "}
            </div>
            {" "}
            <div data-pino='{"alku":76,"askel":14,"matka":-40,"sk":0.05,"hi":0.55}' style={{ marginTop: "22px" }}>
              {" "}
              {(VAIHEET).map((v, vI) => (
                <Fragment key={vI}>
                  {" "}
                  <article data-kortti="1" className="mo-m-pino mo-rv-k" style={{ top: `${v.top}px`, transform: `scale(${v.sk})`, marginBottom: "16px" }}>
                    {" "}
                    <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                      <img src={TYHJA} data-mo-src={v.kuva} alt={v.alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: v.pos, display: "block" }} loading="lazy" decoding="async" />
                      <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(8,13,19,0) 35%, rgba(15,24,34,.96) 100%)" }}></span>
                      <span style={{ position: "absolute", left: "16px", bottom: "12px", width: "38px", height: "38px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", color: "#6fecff", boxShadow: "inset 0 0 0 1.5px #6fecff", background: "rgba(7,11,18,.6)", WebkitBackdropFilter: "blur(6px)", backdropFilter: "blur(6px)" }}>
                        {v.n}
                      </span>
                    </div>
                    {" "}
                    <div style={{ padding: "6px 18px 20px" }}>
                      <h3 style={{ margin: "0", fontSize: "19px", lineHeight: "1.25", fontWeight: "630" }}>
                        {v.t}
                      </h3>
                      <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#b9c7d4" }}>
                        {v.v}
                      </p>
                    </div>
                    {" "}
                    <span aria-hidden="true" data-kortti-himmea="" style={{ position: "absolute", inset: "0", background: "#070b10", opacity: v.himmea, pointerEvents: "none" }}></span>
                    {" "}
                  </article>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* VÄITE 1 */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="vaite1" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "440px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 34px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z">
              <img data-px="1" src={TYHJA} data-mo-src="/mobiili/meista/huoltoasema.webp" alt="Kuvaus huoltoasemalla" style={{ opacity: ".9", top: "10px", height: "340px", objectPosition: "55% 40%", WebkitMask: "linear-gradient(180deg, #000 70%, transparent 100%)", mask: "linear-gradient(180deg, #000 70%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "38px", lineHeight: "1.03", letterSpacing: "-.03em", fontWeight: "680" }}>
              {"Kuvaamme siellä, missä "}
              <span style={{ color: "#6fecff" }}>
                {"työ tehdään."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Asiakkaan tiloissa, autolla tai kadulla. Videot toimitetaan julkaisuvalmiina."}
            </p>
            {" "}
          </section>
          {" "}
          {/* TIIMI: klaffikortit */}
          {" "}
          <section id="m-tiimi" data-teema="tumma" data-verkko="tiimi" data-vari="#0d1824" style={{ position: "relative", zIndex: "1", padding: "30px 0 40px" }}>
            {" "}
            <div style={{ padding: "0 22px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Kolme tekijää, jotka "}
                <span style={{ color: "#6fecff" }}>
                  {"vastaavat työstä"}
                </span>
              </h2>
              {" "}
              <span className="mo-rv" style={{ flex: "none", paddingBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#8fa3b5", fontVariantNumeric: "tabular-nums" }}>
                <span data-meista="tiiminro">{"1"}</span>
                {" / 3"}
              </span>
              {" "}
            </div>
            {" "}
            <p className="mo-e-lead mo-rv mo-d1" style={{ margin: "14px 22px 0", fontSize: "16px", color: "#c3d0dc" }}>
              {"Pieni tiimi tarkoittaa, ettei asiasi katoa välikäsien väliin. Puhut suoraan niiden kanssa, jotka tekevät työn."}
            </p>
            {" "}
            <div className="mo-e-x mo-rv mo-d1" data-meista="tiimi" style={{ gap: "12px", padding: "24px 22px 6px", scrollPaddingLeft: "22px" }}>
              {" "}
              {(TIIMI_).map((t, tI) => (
                <Fragment key={tI}>
                  {" "}
                  <article className="mo-m-kortti" style={{ transform: `scale(${t.sk})`, opacity: t.op, boxShadow: t.reuna }}>
                    {" "}
                    <div style={{ background: "#0b0f14", paddingTop: "8px" }}>
                      <div className="mo-m-klaffi" style={{ transform: `rotate(${t.klaffi}deg)` }}></div>
                      <div className="mo-m-klaffi-ala"></div>
                    </div>
                    {" "}
                    <div style={{ padding: "14px 18px 20px" }}>
                      {" "}
                      <div className="mo-m-hud" style={{ display: "flex", justifyContent: "space-between", color: "#8fa3b5", paddingBottom: "10px", borderBottom: "1px dashed rgba(255,255,255,.14)" }}>
                        <span>
                          {"WS MEDIA"}
                        </span>
                        <span>
                          {"OTTO "}
                          {t.otto}
                        </span>
                      </div>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "16px" }}>
                        <span className="mo-m-avatar" style={{ background: t.vari }}>
                          {t.nimikirj}
                        </span>
                        <div>
                          <b style={{ display: "block", fontSize: "19px", fontWeight: "640", letterSpacing: "-.01em" }}>
                            {t.nimi}
                          </b>
                          <span style={{ display: "block", marginTop: "2px", fontSize: "13.5px", fontWeight: "600", color: "#6fecff" }}>
                            {t.rooli}
                          </span>
                        </div>
                      </div>
                      {" "}
                      <ul style={{ listStyle: "none", margin: "14px 0 0", padding: "0" }}>
                        {" "}
                        {(t.alat).map((a, aI) => (
                          <Fragment key={aI}>
                            <li style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderTop: "1px solid rgba(255,255,255,.07)", fontSize: "14.5px", color: "#dbe5ee" }}>
                              <i style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6fecff" }}></i>
                              {a}
                            </li>
                          </Fragment>
                        ))}
                        {" "}
                      </ul>
                      {" "}
                      <p style={{ margin: "8px 0 0", fontSize: "13.5px", fontStyle: "italic", color: "#9fb0bf" }}>
                        {t.huom}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </article>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>
              {" "}
              {(TIIMI_PISTEET).map((p, pI) => (
                <Fragment key={pI}>
                  <span style={{ width: `${p.w}px`, height: "6px", borderRadius: "3px", background: p.c, transition: "width .35s, background-color .35s" }}></span>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* VÄITE 2 */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="vaite2" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "440px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 34px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z">
              <img data-px="1" src={TYHJA} data-mo-src="/mobiili/kuvauskeikka-k.webp" alt="Kuvaajat kuvaamassa kadulla" style={{ opacity: ".9", top: "10px", height: "330px", objectPosition: "50% 30%", WebkitMask: "linear-gradient(180deg, #000 70%, transparent 100%)", mask: "linear-gradient(180deg, #000 70%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "36px", lineHeight: "1.04", letterSpacing: "-.028em", fontWeight: "680" }}>
              {"Video, sivusto ja mainonta "}
              <span style={{ color: "#6fecff" }}>
                {"samasta paikasta."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Kun yksi tiimi vastaa kaikesta, kukaan ei voi sanoa, että vika on toisen toimittajan päässä."}
            </p>
            {" "}
          </section>
          {" "}
          {/* TAPA */}
          {" "}
          <section id="m-tapa" data-teema="tumma" data-verkko="tapa" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "30px 16px 40px" }}>
            {" "}
            <h2 className="mo-e-h2 mo-rv" style={{ padding: "0 6px" }}>
              {"Näin työskentelemme"}
            </h2>
            {" "}
            <div className="mo-rv-s" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px", marginTop: "20px" }}>
              {" "}
              {(TAPA).map((t, tI) => (
                <Fragment key={tI}>
                  <div className="mo-m-tapa" style={{ gridColumn: t.sar }}>
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="#6fecff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={t.ikoni}></path>
                    </svg>
                    <b style={{ display: "block", marginTop: "10px", fontSize: "16px", lineHeight: "1.25", fontWeight: "630" }}>
                      {t.t}
                    </b>
                    <p style={{ margin: "5px 0 0", fontSize: "13.5px", lineHeight: "1.5", color: "#a9b8c6" }}>
                      {t.v}
                    </p>
                  </div>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* LYHYESTI */}
          {" "}
          <section id="m-lyhyesti" data-teema="tumma" data-verkko="lyhyesti" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "20px 16px 44px" }}>
            {" "}
            <h2 className="mo-e-h2 mo-rv" style={{ padding: "0 6px", fontSize: "28px" }}>
              {"WS Media lyhyesti"}
            </h2>
            {" "}
            <div className="mo-rv-s" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px", marginTop: "18px" }}>
              {" "}
              {(FAKTAT).map((f, fI) => (
                <Fragment key={fI}>
                  <div style={{ padding: "12px 14px", borderRadius: "16px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
                    <span style={{ display: "block", fontSize: "10.5px", fontWeight: "650", letterSpacing: ".12em", textTransform: "uppercase", color: "#8fa3b5" }}>
                      {f.l}
                    </span>
                    <b style={{ display: "block", marginTop: "4px", fontSize: "14px", lineHeight: "1.35", fontWeight: "600", color: "#eef3f7" }}>
                      {f.v}
                    </b>
                  </div>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ marginTop: "18px", padding: "0 6px" }}>
              {" "}
              <p style={{ margin: "0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                {"WS Media Oy on espoolainen mainostoimisto. Teemme yrityksille lyhytvideoita TikTokiin, Instagramiin ja YouTubeen, verkkosivuja, hakukoneoptimointia ja graafista suunnittelua sekä hoidamme Meta-mainontaa. Toimisto on Espoossa osoitteessa Kuusiniementie 8, ja asiakkaitamme on pääkaupunkiseudulla ja muualla Suomessa."}
              </p>
              {" "}
              <div className="mo-e-vast" data-meista="seo" id="m-seo-lisa" hidden>
                    <p style={{ margin: "14px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Tiimissä on kolme tekijää. Ville Karppinen vastaa graafisesta suunnittelusta ja asiakkuuksista, Tuomas Ivanov verkkosivuista ja hakukoneoptimoinnista ja Alex Pettersborg videotuotannosta ja Meta-mainonnasta. Kuvaamme yrityksesi tiloissa tai sovitussa paikassa, ja valmiit videot ja sivut toimitetaan sähköisesti."}
                    </p>
                    <p style={{ margin: "14px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Olemme avoinna arkisin 9–18 ja lauantaisin 11–16, ja kaikki yhteystavat löydät "}
                      <a href="/yhteystiedot">
                        {"yhteystiedoista"}
                      </a>
                      {"."}
                    </p>
                  </div>
              {" "}
              <button type="button" data-meista="seo-nappi" aria-expanded="false" aria-controls="m-seo-lisa" className="mo-e-btn mo-e-o mo-osuma" style={{ height: "42px", marginTop: "16px", padding: "0 16px", fontSize: "14.5px" }}>
                {"Lue lisää"}
              </button>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* TARJOUS */}
          {" "}
          <section id="m-tarjous" data-teema="tumma" data-verkko="lomake" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", overflow: "hidden", padding: "56px 0 44px", background: "#080d13" }}>
            {" "}
            <img src={TYHJA} data-mo-src="/mobiili/meista/tarjous-kortit.webp" alt="" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "620px", objectFit: "cover", objectPosition: "26.8% 0%", opacity: ".5", WebkitMask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)", mask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)" }} loading="lazy" decoding="async" />
            {" "}
            <div style={{ position: "relative", padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ color: "#fff" }}>
                {"Mitä haluat "}
                <span style={{ color: "#6fecff" }}>
                  {"saada aikaan?"}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "16px", color: "#c9d6e2" }}>
                {"Käymme tilanteesi läpi ja kerromme suoraan, miten voimme auttaa, myös silloin kun vastaus on ei. Voit myös soittaa numeroon "}
                <a href="tel:+358405648770">
                  {"040 564 8770"}
                </a>
                {" tai kirjoittaa osoitteeseen "}
                <a href="mailto:info@wsmedia.fi">
                  {"info@wsmedia.fi"}
                </a>
                {"."}
              </p>
              {" "}
              <ol className="mo-rv mo-d2" style={{ listStyle: "none", margin: "28px 0 0", padding: "0", display: "flex", flexDirection: "column" }}>
                {" "}
                <li className="mo-e-askel" style={{ display: "grid", gridTemplateColumns: "32px minmax(0, 1fr)", gap: "14px" }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: "32px", height: "32px", borderRadius: "50%", boxShadow: "inset 0 0 0 1.5px #6fecff", color: "#6fecff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600" }}>
                      {"1"}
                    </span>
                    <span style={{ flex: "1", width: "1.5px", minHeight: "22px", background: "linear-gradient(#6fecff, rgba(111,236,255,.15))" }}></span>
                  </span>
                  <div style={{ paddingBottom: "18px" }}>
                    <b style={{ fontSize: "19px", fontWeight: "620" }}>
                      {"24 h"}
                    </b>
                    <p style={{ margin: "2px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#a9b8c6" }}>
                      {"Luemme viestin ja vastaamme sähköpostilla."}
                    </p>
                  </div>
                </li>
                {" "}
                <li className="mo-e-askel" style={{ display: "grid", gridTemplateColumns: "32px minmax(0, 1fr)", gap: "14px" }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: "32px", height: "32px", borderRadius: "50%", boxShadow: "inset 0 0 0 1.5px rgba(111,236,255,.55)", color: "#6fecff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600" }}>
                      {"2"}
                    </span>
                    <span style={{ flex: "1", width: "1.5px", minHeight: "22px", background: "rgba(111,236,255,.15)" }}></span>
                  </span>
                  <div style={{ paddingBottom: "18px" }}>
                    <b style={{ fontSize: "19px", fontWeight: "620" }}>
                      {"30 min"}
                    </b>
                    <p style={{ margin: "2px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#a9b8c6" }}>
                      {"Kartoitus: nykytila, tavoite ja mikä palvelu sopii."}
                    </p>
                  </div>
                </li>
                {" "}
                <li className="mo-e-askel" style={{ display: "grid", gridTemplateColumns: "32px minmax(0, 1fr)", gap: "14px" }}>
                  <span style={{ width: "32px", height: "32px", borderRadius: "50%", boxShadow: "inset 0 0 0 1.5px rgba(111,236,255,.4)", color: "#6fecff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600" }}>
                    {"3"}
                  </span>
                  <div>
                    <b style={{ fontSize: "19px", fontWeight: "620" }}>
                      {"Tarjous"}
                    </b>
                    <p style={{ margin: "2px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#a9b8c6" }}>
                      {"Kirjallinen ehdotus hintoineen. Ei sitoumuksia ennen hyväksyntää."}
                    </p>
                  </div>
                </li>
                {" "}
              </ol>
              {" "}
              <form className="mo-rv mo-rv-s" data-meista="lomake" style={{ marginTop: "30px", padding: "22px 18px 20px", borderRadius: "24px", background: "linear-gradient(180deg, rgba(22,34,48,.88), rgba(12,19,28,.92))", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1), 0 40px 80px -40px rgba(0,0,0,.9)", display: "flex", flexDirection: "column", gap: "14px" }}>
                {" "}
                <div>
                  <b style={{ fontSize: "22px", fontWeight: "620", letterSpacing: "-.01em" }}>
                    {"Tarjouspyyntö"}
                  </b>
                  <p style={{ margin: "4px 0 0", display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#a9b8c6" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3ddc84" }}></span>
                    {"Vastaamme 24 tunnin sisällä"}
                  </p>
                </div>
                {" "}
                <label className="mo-e-in">
                  {"Nimi"}
                  <input type="text" name="nimi" autoComplete="name" />
                </label>
                {" "}
                <label className="mo-e-in">
                  {"Sähköposti"}
                  <input type="email" name="email" autoComplete="email" inputMode="email" />
                </label>
                {" "}
                <label className="mo-e-in">
                  {"Puhelinnumero"}
                  <input type="tel" name="puhelin" autoComplete="tel" inputMode="tel" />
                </label>
                {" "}
                <label className="mo-e-in">
                  {"Paikkakunta"}
                  <input type="text" name="paikkakunta" autoComplete="address-level2" />
                </label>
                {" "}
                <label className="mo-e-in">
                  {"Mitä haluaisit saada aikaan?"}
                  <textarea name="viesti" rows={4} style={{ height: "112px", paddingTop: "13px", resize: "none" }} />
                </label>
                {" "}
                <p className="mo-e-vast" data-meista="kiitos" role="status" hidden style={{ margin: "0", padding: "12px 14px", borderRadius: "12px", background: "rgba(111,236,255,.1)", color: "#b4f5ff", fontSize: "14.5px" }}>
                      {"Kiitos, tarjouspyyntö on perillä. Vastaamme arkisin 24 tunnin sisällä."}
                    </p>
                {" "}
                <Ansa />
                <button type="submit" className="mo-e-btn mo-e-p" style={{ width: "100%", height: "54px", marginTop: "4px", fontSize: "16.5px", fontWeight: "600" }}>
                  {"Lähetä tarjouspyyntö"}
                </button>
                <LomakeVirhe />
                {" "}
                <p style={{ margin: "0", textAlign: "center", fontSize: "12.5px", color: "#8fa3b3" }}>
                  {"Ei sitoumuksia."}
                </p>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12.5px", color: "#6f8191" }}>
                  <span style={{ flex: "1", height: "1px", background: "rgba(255,255,255,.1)" }}></span>
                  {"tai"}
                  <span style={{ flex: "1", height: "1px", background: "rgba(255,255,255,.1)" }}></span>
                </div>
                {" "}
                <a href="/yhteystiedot" data-varaus="" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)", color: "#e6f6fa", fontSize: "14.5px", fontWeight: "600", textDecoration: "none" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5"></rect>
                    <path d="M3.5 10h17M8 3v4M16 3v4"></path>
                  </svg>
                  {"Varaa 30 min kartoitus"}
                </a>
                {" "}
                <a href="tel:+358405648770" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)", color: "#e6f6fa", fontSize: "14.5px", fontWeight: "600", textDecoration: "none" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path>
                  </svg>
                  {"040 564 8770"}
                </a>
                {" "}
              </form>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <Alatunniste />
          {" "}
        </div>
        {" "}      </div>
      <Kuori reitti="/meista" />
      <Moottori otsake={{ tapa: "iso", ka: 300, piilo: 150, lasi: -30 }} verkko={{ siemen: 53, tila: "meista", pohja: [11, 19, 29] }} />
      <Efektit />
    </div>
  );
}
