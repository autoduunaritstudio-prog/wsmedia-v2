/* VERKKOSIVUJEN PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Verkkosivut.dc.html:
   rakenne, tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on
   muunnettu koneellisesti (dc2jsx.mjs + _mobiili-design/tyokalut/verkkosivut.py)
   ja vieritys- ja tila-arvot on korvattu alkutilalla; Efektit.tsx ja
   Moottori.tsx kirjoittavat ne suoraan DOMiin. Naytetaan vain
   max-width: 767px. GENEROITU: muuta verkkosivut.py:ta ja aja se uudelleen.

   Tietoiset poikkeamat suunnitelmasta (ks. lisat.css ja Efektit.tsx):
   - Heron elokuvaruutu skaalautuu nakyman leveyteen (suunnitelma 390 px),
     390 px:n leveydella tulos on sama pikselilleen.
   - Prosessin etenemispalkki on scaleX eika width.
   - PageSpeed-mittarin kaari animoituu CSS-siirtymalla paljastuksessa. */
import "./mobiili.css";
import "./lisat.css";
import { Fragment } from "react";
import { mo, TYHJA, logoLeveys } from "@/app/components/mobiili/mo";
import Kuori from "@/app/components/mobiili/Kuori";
import Alatunniste from "@/app/components/mobiili/Alatunniste";
import Moottori from "@/app/components/mobiili/Moottori";
import Efektit from "./Efektit";
import { ALUEET, ASKELEET, KARTTA, KE_LISTA, KE_TAB, LOGOT, MITAT, ONGELMAT, PAKETIT, PAKETIT_AUKI, PAKETTI_ALKU, PAN_PISTEET, SIS, SISALTO, TAB, TAPA_AUKI, TAVAT, UKK, UKK_KAIKKI_TEKSTI, UKK_NAKYVIA } from "./data";

export default function VerkkosivutMobiili() {
  return (
    <div className="mo-root mo-s-verkkosivut">
      {/* Heron ensimmainen elokuvaruutu heti (vain puhelimessa, media). */}
      <link rel="preload" as="image" href="/mobiili/verkkosivut-film-ikkuna-0.webp" media="(max-width: 767px)" fetchPriority="high" />
      <div className="mo-e-root" style={{ position: "relative", background: "#0b0f14", color: "#f5f5f7" }}>
        {/* HERO: koodi muuttuu sivustoksi vierityksen mukana */}
        {" "}
        <div style={{ height: "calc(280px + 200svh)", position: "relative" }}>
          {" "}
          <div data-teema="tumma" data-vs="hero" style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden", background: "#0b0f14" }}>
            {" "}
            <div style={{ position: "absolute", left: "0", right: "0", top: "68px", height: "calc(100vw * 44 / 39)", transform: "translateY(0px)" }} data-vs="film">
              {" "}
              <div className="mo-v-film" role="img" aria-label="Koodi kirjoitetaan ja valmis verkkosivu syttyy toiselle näytölle" style={{ position: "absolute", inset: "0", backgroundPosition: "0% 0%" }} data-vs="ruutu"></div>
              {" "}
              <div style={{ position: "absolute", left: "0", right: "0", top: "0", height: "120px", background: "linear-gradient(180deg, rgba(11,15,20,.62), rgba(11,15,20,0))" }}></div>
              {" "}
              <div style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "190px", background: "linear-gradient(180deg, rgba(11,15,20,0) 0%, rgba(11,15,20,.55) 45%, #0b0f14 100%)" }}></div>
              {" "}
            </div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "calc(100svh - 70px)", transform: "translateX(-50%) translateY(6px)", display: "flex", alignItems: "center", gap: "12px", height: "58px", padding: "0 8px 0 6px", borderRadius: "999px", background: "rgba(12,17,23,.92)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12), 0 10px 30px -12px rgba(0,0,0,.7)", opacity: "1", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "6" }} data-vs="vihje">
              {" "}
              <span style={{ position: "relative", width: "46px", height: "46px", borderRadius: "50%", overflow: "hidden", background: "#05090d", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.22)" }}>
                <i className="mo-e-kasi" style={{ position: "absolute", inset: "0", background: "url(/mobiili/hint-sormi-r.webp) 0 0 / 2300px 46px no-repeat", mixBlendMode: "screen" }}></i>
              </span>
              {" "}
              <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.15" }}>
                <b style={{ fontSize: "13.5px", fontWeight: "600", color: "#f5f5f7", letterSpacing: "-.005em" }}>
                  {"Vieritä alas"}
                </b>
                <span style={{ fontSize: "11.5px", color: "#a9b8c6" }}>
                  {"hinnat, sisältö ja prosessi"}
                </span>
              </span>
              {" "}
              <span style={{ position: "relative", width: "32px", height: "32px", marginLeft: "4px" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "block", transform: "rotate(-90deg)" }}>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2.5"></circle>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#6fecff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="81.7" strokeDashoffset="81.7" data-vs="rengas"></circle>
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
            <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "82px", textAlign: "left", transform: "translateY(0px)", zIndex: "6" }} data-vs="teksti">
              {" "}
              <h1 style={{ margin: "0", fontSize: "33px", lineHeight: "1.06", letterSpacing: "-.022em", fontWeight: "640", color: "#f5f5f7" }}>
                {"Kotisivut yritykselle, jotka"}
                <span style={{ display: "block", height: "38px", color: "#6fecff", whiteSpace: "nowrap" }}>
                  {" "}
                  {/* H1:ssa vain ensimmainen muoto. Muut sanat ovat
                      data-sanat-attribuutissa, josta Efektit vaihtaa tekstin. */}
                  <span className="mo-e-sana" data-sanat="löytyvät Googlesta.|latautuvat sekunnissa.|tuovat yhteydenottoja.|kestävät vuosia.">{"löytyvät Googlesta."}</span>
                  {" "}
                </span>
              </h1>
              {" "}
              <p style={{ margin: "6px 0 0", fontSize: "15.5px", lineHeight: "1.5", color: "#d6d9e0" }}>
                {"Kotisivujen ja verkkosivujen suunnittelu ja toteutus avaimet käteen: sivurakenne, tekstit, tekninen hakukoneoptimointi ja julkaisu. Perussivustosta räätälöityyn toteutukseen, kiinteällä projektihinnalla."}
              </p>
              {" "}
              <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                {" "}
                <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ flex: "1.25", padding: "0 12px", fontSize: "15px" }}>
                  {"Varaa kartoitus"}
                </a>
                {" "}
                <a data-ankkuri="hinnoittelu" role="link" tabIndex={0} className="mo-e-btn mo-e-o" style={{ flex: "1", padding: "0 12px", fontSize: "15px" }}>
                  {"Katso hinnat"}
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#05080c", opacity: "0", pointerEvents: "none", zIndex: "7" }} data-vs="peitto"></div>
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
          <section data-teema="tumma" data-verkko="alku" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "0 0 8px" }}>
            {" "}
            <div aria-label="Asiakkaitamme" className="mo-e-nauha-w mo-rv-n" style={{ position: "relative", height: "96px", overflow: "hidden", WebkitMask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", mask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
              {" "}
              <div className="mo-e-nauha" style={{ position: "absolute", top: "32px", left: "0" }}>
                {" "}
                {(LOGOT).map((l: any, lI: number) => (
                  <Fragment key={lI}>
                    <img src={l.src} width={logoLeveys(l.src, l.h)} height={l.h} alt={l.alt} style={{ height: `${l.h}px`, width: "auto", display: "block", filter: l.f, opacity: ".78" }} decoding="async" />
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-rv-z" data-laske="1" style={{ position: "relative", margin: "6px 16px 0", padding: "20px", borderRadius: "24px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)", display: "grid", gridTemplateColumns: "124px minmax(0, 1fr)", gap: "18px", alignItems: "center" }}>
              {" "}
              <div style={{ position: "relative", width: "124px", height: "124px" }}>
                {" "}
                <svg width="124" height="124" viewBox="0 0 124 124" style={{ display: "block", transform: "rotate(-90deg)" }} aria-hidden="true">
                  <circle cx="62" cy="62" r="54" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="9"></circle>
                  <circle className="mo-v-gauge" cx="62" cy="62" r="54" fill="none" stroke="#3ddc84" strokeWidth="9" strokeLinecap="round" strokeDasharray="339.3" strokeDashoffset="33.9"></circle>
                </svg>
                {" "}
                <span style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <b style={{ fontSize: "34px", lineHeight: "1", letterSpacing: "-.04em", fontWeight: "680", fontVariantNumeric: "tabular-nums" }}>
                    <span data-luku="90" data-luku-jalki="+">{"90+"}</span>
                  </b>
                  <span style={{ marginTop: "3px", fontSize: "10.5px", color: "#8fa3b5" }}>
                    {"/ 100 mobiili"}
                  </span>
                </span>
                {" "}
              </div>
              {" "}
              <div>
                {" "}
                <p className="mo-l-bk">
                  {"PageSpeed-tavoite"}
                </p>
                {" "}
                <div style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                  <b style={{ display: "block", fontSize: "24px", letterSpacing: "-.03em", fontWeight: "660" }}>
                    {"2–4 vk"}
                  </b>
                  <span style={{ fontSize: "13px", color: "#a9b8c6" }}>
                    {"suunnittelusta julkaisuun"}
                  </span>
                </div>
                {" "}
                <div style={{ paddingTop: "10px" }}>
                  <b style={{ display: "block", fontSize: "24px", letterSpacing: "-.03em", fontWeight: "660", fontVariantNumeric: "tabular-nums" }}>
                    <span data-luku="24">{"24"}</span>
                    {" h"}
                  </b>
                  <span style={{ fontSize: "13px", color: "#a9b8c6" }}>
                    {"vastaus tarjouspyyntöön"}
                  </span>
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* TILANNE: kortit pinoutuvat vierittäessä */}
          {" "}
          <section id="m-miksi" data-teema="tumma" data-verkko="miksi" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "44px 16px 30px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Verkkosivut ovat olemassa, mutta ne eivät "}
                <span className="mo-v-alleviiva" style={{ color: "#ff9a4d" }}>
                  {"tuo asiakkaita."}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Nämä neljä syytä toistuvat lähes jokaisessa sivustouudistuksessa. Yksikin niistä riittää siihen, että kotisivut eivät tuo yhteydenottoja."}
              </p>
              {" "}
            </div>
            {" "}
            <div data-pino='{"alku":84,"askel":12,"matka":-30,"sk":0.05,"hi":0.55}' style={{ marginTop: "22px" }}>
              {" "}
              {(ONGELMAT).map((o: any, oI: number) => (
                <Fragment key={oI}>
                  {" "}
                  <article data-kortti="1" className="mo-v-ongelma mo-v-pino mo-rv-k" style={{ top: `${o.top}px`, transform: `scale(${o.sk})`, marginBottom: "14px" }}>
                    <span className="mo-v-ik">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={o.ikoni}></path>
                      </svg>
                    </span>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "650", letterSpacing: ".14em", color: "#ff9a4d" }}>
                        {o.nro}
                        {" / 04"}
                      </span>
                      <h3 style={{ margin: "3px 0 0", fontSize: "17.5px", lineHeight: "1.3", fontWeight: "630" }}>
                        {o.t}
                      </h3>
                      <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#b9c7d4" }}>
                        {o.v}
                      </p>
                    </div>
                    <span aria-hidden="true" data-kortti-himmea="" style={{ position: "absolute", inset: "0", background: "#070b10", opacity: o.himmea, pointerEvents: "none", borderRadius: "inherit" }}></span>
                  </article>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* SISÄLTÖ */}
          {" "}
          <section id="m-sisalto" data-teema="tumma" data-verkko="sisalto" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "20px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Mitä verkkosivujen suunnittelu ja toteutus sisältää?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Avaimet käteen tarkoittaa, ettei sinun tarvitse kirjoittaa tekstejä, valita fontteja tai opetella hakukoneoptimointia. Sinä kerrot yrityksestäsi ja palveluistasi, me hoidamme loput."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-bento mo-rv" style={{ marginTop: "22px", padding: "18px" }}>
              {" "}
              <p className="mo-l-bk" style={{ color: "#b4f5ff" }}>
                {"Rakenne ratkaisee ennen ulkoasua"}
              </p>
              {" "}
              <p style={{ margin: "8px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#c3d0dc" }}>
                {"Sivurakenne päätetään ensin ja ulkoasu vasta sen jälkeen, koska rakennetta ei voi vaihtaa jälkikäteen ilman että näkyvyys katkeaa."}
              </p>
              {" "}
              <div className="mo-v-kartta" style={{ marginTop: "14px" }}>
                {" "}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", color: "#6f8191" }}>
                  <span>
                    <i style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#3a4552", marginRight: "4px" }}></i>
                    <i style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#3a4552", marginRight: "4px" }}></i>
                    <i style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#3a4552", marginRight: "8px" }}></i>
                    {"sivustokartta"}
                  </span>
                  <span style={{ color: "#6fecff" }}>
                    {"esim. lvi-yritys"}
                  </span>
                </div>
                {" "}
                {(KARTTA).map((k: any, kI: number) => (
                  <Fragment key={kI}>
                    <div className="mo-v-rivi">
                      <span style={{ color: "#e6eef5" }}>
                        {k.p}
                      </span>
                      <span style={{ color: "#8fa3b5" }}>
                        {k.h}
                      </span>
                    </div>
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
              <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.5", color: "#8fa3b5" }}>
                {"Jokainen palvelu saa oman sivunsa ja oman hakunsa. Yhdelle etusivulle puristettuna ne kilpailisivat keskenään samasta tuloksesta."}
              </p>
              {" "}
            </div>
            {" "}
            <p className="mo-rv" style={{ margin: "22px 6px 10px", fontSize: "13px", fontWeight: "600", color: "#8fa3b5" }}>
              {"Hintaan sisältyy, napauta kohtaa:"}
            </p>
            {" "}
            <div className="mo-rv-s" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
              {" "}
              {(SISALTO).map((s: any, sI: number) => (
                <Fragment key={sI}>
                  <button type="button" className="mo-v-tile" data-vs-kohta={sI} aria-pressed={s.on} style={{ background: s.bg, boxShadow: s.reuna, color: s.fg }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.ikVari} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={s.ikoni}></path>
                    </svg>
                    <span style={{ fontSize: "14px", lineHeight: "1.3", fontWeight: "600" }}>
                      {s.t}
                    </span>
                  </button>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            {(SIS).map((s: any, sI: number) => (
              <Fragment key={sI}>
                {" "}
                <div className="mo-l-kortti-in" data-vs-kohta-auki={sI} hidden={sI !== 0} style={{ marginTop: "10px", padding: "16px 18px", borderRadius: "18px", background: "rgba(111,236,255,.07)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.25)" }}>
                  <b style={{ fontSize: "16px", fontWeight: "630", color: "#b4f5ff" }}>
                    {s.t}
                  </b>
                  <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.55", color: "#dbe5ee" }}>
                    {s.v}
                  </p>
                </div>
                {" "}
              </Fragment>
            ))}
            {" "}
          </section>
          {" "}
          {/* VÄITE 1 */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="vaite1" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "460px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 36px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z">
              <img data-px="1" src={TYHJA} data-mo-src="/verkkosivut/luonnos-k.webp" alt="Sivun rautalankamallia piirretään kynällä" style={{ opacity: ".92", top: "10px", height: "360px", objectPosition: "60% 50%", WebkitMask: "linear-gradient(180deg, #000 70%, transparent 100%)", mask: "linear-gradient(180deg, #000 70%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "36px", lineHeight: "1.04", letterSpacing: "-.028em", fontWeight: "680" }}>
              {"Sivun rakenne kannattaa "}
              <span style={{ color: "#6fecff" }}>
                {"piirtää ennen ulkoasua."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Kun rakenne on mietitty valmiiksi, jokaisella sivulla on selvä tehtävä: mitä kävijä etsii, mitä hän saa selville ja mistä hän ottaa yhteyttä."}
            </p>
            {" "}
          </section>
          {" "}
          {/* TOTEUTUS */}
          {" "}
          <section id="m-toteutustapa" data-teema="tumma" data-verkko="toteutus" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "22px 16px 36px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Perussivusto vai räätälöidyt verkkosivut?"}
              </h2>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Toteutustapa" style={{ marginTop: "20px" }}>
              {" "}
              {(TAVAT).map((t: any, tI: number) => (
                <Fragment key={tI}>
                  <button type="button" role="tab" aria-selected={t.on} data-vs-tapa={tI} style={{ background: t.tabBg, color: t.tabFg }}>
                    {t.nimi}
                  </button>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            {(TAPA_AUKI).map((t: any, tI: number) => (
              <Fragment key={tI}>
                {" "}
                <article className="mo-l-kortti-in" data-vs-tapa-auki={tI} hidden={tI !== 0} style={{ marginTop: "12px", borderRadius: "22px", overflow: "hidden", background: "#0e161f", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1)" }}>
                  {" "}
                  <div style={{ padding: "12px 14px 14px", background: "#121c27", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "12px" }}>
                      <i style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3a4552" }}></i>
                      <i style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3a4552" }}></i>
                      <i style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3a4552" }}></i>
                      <span style={{ marginLeft: "8px", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", color: t.vari, background: "rgba(255,255,255,.05)" }}>
                        {t.nimi}
                      </span>
                    </div>
                    {" "}
                    {t.malli0 ? (
                      <>
                        <div style={{ height: "104px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <i className="mo-v-rak" style={{ width: "34px", height: "8px", borderRadius: "3px", background: "rgba(255,255,255,.35)", animationDelay: "0.00s" }}></i>
                            <span style={{ display: "flex", gap: "5px" }}>
                              <i className="mo-v-rak" style={{ width: "22px", height: "5px", borderRadius: "3px", background: "rgba(255,255,255,.18)", animationDelay: "0.10s" }}></i>
                              <i className="mo-v-rak" style={{ width: "22px", height: "5px", borderRadius: "3px", background: "rgba(255,255,255,.18)", animationDelay: "0.15s" }}></i>
                              <i className="mo-v-rak" style={{ width: "30px", height: "9px", borderRadius: "5px", background: "#ff9a4d", animationDelay: "0.20s" }}></i>
                            </span>
                          </div>
                          <i className="mo-v-rak" style={{ display: "block", height: "10px", width: "72%", marginTop: "14px", borderRadius: "4px", background: "rgba(255,255,255,.4)", animationDelay: "0.35s" }}></i>
                          <i className="mo-v-rak" style={{ display: "block", height: "6px", width: "54%", marginTop: "7px", borderRadius: "3px", background: "rgba(255,255,255,.18)", animationDelay: "0.45s" }}></i>
                          <i className="mo-v-rak" style={{ display: "block", height: "14px", width: "30%", marginTop: "10px", borderRadius: "7px", background: "#ff9a4d", animationDelay: "0.60s" }}></i>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginTop: "12px" }}>
                            <i className="mo-v-rak" style={{ height: "20px", borderRadius: "5px", background: "rgba(255,154,77,.16)", animationDelay: "0.75s" }}></i>
                            <i className="mo-v-rak" style={{ height: "20px", borderRadius: "5px", background: "rgba(255,154,77,.16)", animationDelay: "0.85s" }}></i>
                            <i className="mo-v-rak" style={{ height: "20px", borderRadius: "5px", background: "rgba(255,154,77,.16)", animationDelay: "0.95s" }}></i>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {" "}
                    {t.malli1 ? (
                      <>
                        <div style={{ height: "104px", display: "grid", gridTemplateColumns: "1fr 92px", gap: "10px" }}>
                          <div style={{ padding: "8px 9px", borderRadius: "8px", background: "#070b10", fontFamily: "ui-monospace, Menlo, monospace" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "13px" }}>
                              <span style={{ width: "10px", fontSize: "7px", color: "#3a4552" }}>
                                {"1"}
                              </span>
                              <i className="mo-v-rak" style={{ marginLeft: "0px", width: "46%", height: "5px", borderRadius: "3px", background: "#c792ea", animationDelay: "0.00s" }}></i>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "13px" }}>
                              <span style={{ width: "10px", fontSize: "7px", color: "#3a4552" }}>
                                {"2"}
                              </span>
                              <i className="mo-v-rak" style={{ marginLeft: "0px", width: "62%", height: "5px", borderRadius: "3px", background: "#6fecff", animationDelay: "0.12s" }}></i>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "13px" }}>
                              <span style={{ width: "10px", fontSize: "7px", color: "#3a4552" }}>
                                {"3"}
                              </span>
                              <i className="mo-v-rak" style={{ marginLeft: "14px", width: "38%", height: "5px", borderRadius: "3px", background: "#c3e88d", animationDelay: "0.24s" }}></i>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "13px" }}>
                              <span style={{ width: "10px", fontSize: "7px", color: "#3a4552" }}>
                                {"4"}
                              </span>
                              <i className="mo-v-rak" style={{ marginLeft: "14px", width: "52%", height: "5px", borderRadius: "3px", background: "#ffcb6b", animationDelay: "0.36s" }}></i>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "13px" }}>
                              <span style={{ width: "10px", fontSize: "7px", color: "#3a4552" }}>
                                {"5"}
                              </span>
                              <i className="mo-v-rak" style={{ marginLeft: "14px", width: "30%", height: "5px", borderRadius: "3px", background: "#6fecff", animationDelay: "0.48s" }}></i>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "13px" }}>
                              <span style={{ width: "10px", fontSize: "7px", color: "#3a4552" }}>
                                {"6"}
                              </span>
                              <i className="mo-v-rak" style={{ marginLeft: "0px", width: "24%", height: "5px", borderRadius: "3px", background: "#c792ea", animationDelay: "0.60s" }}></i>
                            </div>
                            <i className="mo-v-kursori" style={{ display: "inline-block", width: "6px", height: "9px", marginLeft: "20px", background: "#6fecff" }}></i>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <i className="mo-v-rak" style={{ height: "30px", borderRadius: "6px", background: "linear-gradient(135deg, rgba(111,236,255,.35), rgba(111,236,255,.08))", animationDelay: "0.80s" }}></i>
                            <i className="mo-v-rak" style={{ height: "30px", borderRadius: "6px", background: "rgba(111,236,255,.16)", animationDelay: "0.95s" }}></i>
                            <i className="mo-v-rak" style={{ height: "30px", borderRadius: "6px", background: "rgba(111,236,255,.1)", animationDelay: "1.10s" }}></i>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {" "}
                    {t.malli2 ? (
                      <>
                        <div style={{ position: "relative", height: "104px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                            <div className="mo-v-rak" style={{ position: "relative", height: "46px", borderRadius: "6px", background: "rgba(255,255,255,.07)", animationDelay: "0.00s" }}>
                              <i style={{ position: "absolute", left: "6px", right: "6px", top: "6px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,.1)" }}></i>
                              <i style={{ position: "absolute", left: "6px", bottom: "6px", width: "40%", height: "6px", borderRadius: "3px", background: "#c9d6e2" }}></i>
                            </div>
                            <div className="mo-v-rak" style={{ position: "relative", height: "46px", borderRadius: "6px", background: "rgba(255,255,255,.07)", animationDelay: "0.12s" }}>
                              <i style={{ position: "absolute", left: "6px", right: "6px", top: "6px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,.1)" }}></i>
                              <i style={{ position: "absolute", left: "6px", bottom: "6px", width: "40%", height: "6px", borderRadius: "3px", background: "#c9d6e2" }}></i>
                            </div>
                            <div className="mo-v-rak" style={{ position: "relative", height: "46px", borderRadius: "6px", background: "rgba(255,255,255,.07)", animationDelay: "0.24s" }}>
                              <i style={{ position: "absolute", left: "6px", right: "6px", top: "6px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,.1)" }}></i>
                              <i style={{ position: "absolute", left: "6px", bottom: "6px", width: "40%", height: "6px", borderRadius: "3px", background: "#c9d6e2" }}></i>
                            </div>
                            <div className="mo-v-rak" style={{ position: "relative", height: "46px", borderRadius: "6px", background: "rgba(255,255,255,.07)", animationDelay: "0.36s" }}>
                              <i style={{ position: "absolute", left: "6px", right: "6px", top: "6px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,.1)" }}></i>
                              <i style={{ position: "absolute", left: "6px", bottom: "6px", width: "40%", height: "6px", borderRadius: "3px", background: "#c9d6e2" }}></i>
                            </div>
                            <div className="mo-v-rak" style={{ position: "relative", height: "46px", borderRadius: "6px", background: "rgba(255,255,255,.07)", animationDelay: "0.48s" }}>
                              <i style={{ position: "absolute", left: "6px", right: "6px", top: "6px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,.1)" }}></i>
                              <i style={{ position: "absolute", left: "6px", bottom: "6px", width: "40%", height: "6px", borderRadius: "3px", background: "#c9d6e2" }}></i>
                            </div>
                            <div className="mo-v-rak" style={{ position: "relative", height: "46px", borderRadius: "6px", background: "rgba(255,255,255,.07)", animationDelay: "0.60s" }}>
                              <i style={{ position: "absolute", left: "6px", right: "6px", top: "6px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,.1)" }}></i>
                              <i style={{ position: "absolute", left: "6px", bottom: "6px", width: "40%", height: "6px", borderRadius: "3px", background: "#c9d6e2" }}></i>
                            </div>
                          </div>
                          <span className="mo-v-kori" style={{ position: "absolute", right: "-4px", top: "-30px", width: "22px", height: "22px", borderRadius: "50%", background: "#ff9a4d", color: "#0b0f14", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {"3"}
                          </span>
                        </div>
                      </>
                    ) : null}
                    {" "}
                  </div>
                  {" "}
                  <div style={{ padding: "18px 18px 20px" }}>
                    {" "}
                    <h3 style={{ margin: "0", fontSize: "20px", lineHeight: "1.25", letterSpacing: "-.012em", fontWeight: "630" }}>
                      {t.otsikko}
                    </h3>
                    {" "}
                    <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#b9c7d4" }}>
                      {t.kuvaus}
                    </p>
                    {" "}
                    <ul style={{ listStyle: "none", margin: "12px 0 0", padding: "0" }}>
                      {" "}
                      {(t.rivit).map((r: any, rI: number) => (
                        <Fragment key={rI}>
                          <li className="mo-l-li">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.vari} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M5 12.5l4.2 4L19 7"></path>
                            </svg>
                            <span>
                              {r}
                            </span>
                          </li>
                        </Fragment>
                      ))}
                      {" "}
                    </ul>
                    {" "}
                  </div>
                  {" "}
                </article>
                {" "}
              </Fragment>
            ))}
            {" "}
          </section>
          {" "}
          {/* NÄKYVYYS */}
          {" "}
          <section id="m-hakukoneoptimointi" data-teema="tumma" data-verkko="nakyvyys" data-vari="#0d1824" style={{ position: "relative", zIndex: "1", padding: "24px 0 40px" }}>
            {" "}
            <div style={{ padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Näin verkkosivut näkyvät Googlessa"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                <a href="/hakukoneoptimointi">
                  {"Hakukoneoptimoinnin"}
                </a>
                {" perusta rakennetaan sivustoon sisään, ei päälle jälkikäteen."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-e-x mo-rv mo-d1" data-vs="pan" style={{ gap: "12px", padding: "22px 22px 6px", scrollPaddingLeft: "22px" }}>
              {" "}
              <article className="mo-v-paneeli">
                {" "}
                <p className="mo-l-bk">
                  {"Latausnopeus"}
                </p>
                <b style={{ display: "block", marginTop: "6px", fontSize: "34px", lineHeight: "1", letterSpacing: "-.03em", fontWeight: "680", color: "#3ddc84" }}>
                  {"90+"}
                </b>
                {" "}
                <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: "620" }}>
                  {"Nopeat latausajat"}
                </p>
                {" "}
                <p style={{ margin: "5px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#b9c7d4" }}>
                  {"Google mittaa sivuston nopeutta oikeilta käyttäjiltä. Hidas sivu menettää kävijän ja myös sijoituksia, ja mobiilissa ero on suurin."}
                </p>
                {" "}
                <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "14px", background: "#070b10", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)" }}>
                  {" "}
                  {(MITAT).map((m: any, mI: number) => (
                    <Fragment key={mI}>
                      <div style={{ padding: "6px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#c3d0dc" }}>
                          <span>
                            {m.l}
                          </span>
                          <b style={{ color: "#3ddc84" }}>
                            {m.v}
                          </b>
                        </div>
                        <i style={{ display: "block", height: "3px", marginTop: "6px", borderRadius: "2px", background: "rgba(255,255,255,.08)" }}>
                          <i style={{ display: "block", height: "100%", width: `${m.w}%`, borderRadius: "2px", background: "#3ddc84" }}></i>
                        </i>
                      </div>
                    </Fragment>
                  ))}
                  {" "}
                  <p style={{ margin: "6px 0 0", fontSize: "10.5px", color: "#6f8191" }}>
                    {"PageSpeed-tavoite, esimerkki"}
                  </p>
                  {" "}
                </div>
                {" "}
              </article>
              {" "}
              <article className="mo-v-paneeli">
                {" "}
                <p className="mo-l-bk">
                  {"Rakenne"}
                </p>
                <b style={{ display: "block", marginTop: "6px", fontSize: "34px", lineHeight: "1", letterSpacing: "-.03em", fontWeight: "680", color: "#6fecff" }}>
                  {"Oma sivu"}
                </b>
                {" "}
                <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: "620" }}>
                  {"Selkeä sivurakenne ja sisäinen linkitys"}
                </p>
                {" "}
                <p style={{ margin: "5px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#b9c7d4" }}>
                  {"Sivut linkittyvät toisiinsa niin, että Google löytää ne kaikki ja ymmärtää, minkä palvelun alle mikin kuuluu."}
                </p>
                {" "}
                <svg viewBox="0 0 264 120" width="100%" height="120" style={{ display: "block", marginTop: "12px" }} aria-hidden="true">
                  <path className="mo-v-puu" d="M132 30 V48 M44 48 H220 M44 48 V66 M132 48 V66 M220 48 V66" fill="none" stroke="rgba(111,236,255,.55)" strokeWidth="1.5"></path>
                  <path className="mo-v-puu" d="M70 94 V104 H194 V94" fill="none" stroke="rgba(111,236,255,.3)" strokeWidth="1.2" strokeDasharray="3 3"></path>
                  <rect x="98" y="8" width="68" height="22" rx="6" fill="#0b2a33" stroke="#6fecff"></rect>
                  <text x="132" y="23" textAnchor="middle" fontSize="10" fill="#eafcff" fontFamily="inherit">
                    {"etusivu"}
                  </text>
                  <rect x="4" y="66" width="80" height="22" rx="6" fill="#111a24" stroke="rgba(255,255,255,.25)"></rect>
                  <text x="44" y="81" textAnchor="middle" fontSize="9" fill="#dbe5ee" fontFamily="inherit">
                    {"/putkiremontit"}
                  </text>
                  <rect x="96" y="66" width="72" height="22" rx="6" fill="#111a24" stroke="rgba(255,255,255,.25)"></rect>
                  <text x="132" y="81" textAnchor="middle" fontSize="9" fill="#dbe5ee" fontFamily="inherit">
                    {"/lvi-huolto"}
                  </text>
                  <rect x="180" y="66" width="80" height="22" rx="6" fill="#111a24" stroke="rgba(255,255,255,.25)"></rect>
                  <text x="220" y="81" textAnchor="middle" fontSize="9" fill="#dbe5ee" fontFamily="inherit">
                    {"/viemärit"}
                  </text>
                  <text x="70" y="116" textAnchor="middle" fontSize="8.5" fill="#8fa3b5" fontFamily="inherit">
                    {"hinnat"}
                  </text>
                  <text x="194" y="116" textAnchor="middle" fontSize="8.5" fill="#8fa3b5" fontFamily="inherit">
                    {"yhteystiedot"}
                  </text>
                </svg>
                {" "}
              </article>
              {" "}
              <article className="mo-v-paneeli">
                {" "}
                <p className="mo-l-bk">
                  {"Hakusanat"}
                </p>
                <b style={{ display: "block", marginTop: "6px", fontSize: "34px", lineHeight: "1", letterSpacing: "-.03em", fontWeight: "680", color: "#6fecff" }}>
                  {"Sivu 1"}
                </b>
                {" "}
                <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: "620" }}>
                  {"Optimoitu sisältö ja oikeat hakusanat"}
                </p>
                {" "}
                <p style={{ margin: "5px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#b9c7d4" }}>
                  {"Tekstit kirjoitetaan niillä sanoilla, joilla asiakkaat oikeasti hakevat."}
                </p>
                {" "}
                <div style={{ position: "relative", marginTop: "12px", padding: "10px 12px 12px", borderRadius: "14px", background: "#f4f6f8", color: "#1d1d1f", overflow: "hidden", height: "138px", boxSizing: "border-box" }}>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "30px", padding: "0 12px", borderRadius: "999px", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.12)", fontSize: "12px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                      <path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20"></path>
                    </svg>
                    {"kotisivut espoo"}
                  </div>
                  {" "}
                  <div className="mo-v-nousu" style={{ marginTop: "8px", padding: "7px 9px", borderRadius: "9px", background: "#e6fbfd", boxShadow: "inset 0 0 0 1px #6fecff" }}>
                    <span style={{ display: "block", fontSize: "9.5px", color: "#3c4043" }}>
                      {"wsmedia.fi"}
                    </span>
                    <b style={{ display: "block", fontSize: "12px", color: "#1a0dab", fontWeight: "600" }}>
                      {"Kotisivut yritykselle Espoossa"}
                    </b>
                  </div>
                  {" "}
                  <div style={{ marginTop: "6px", padding: "0 9px", fontSize: "9.5px", color: "#70757a" }}>
                    {"kilpailija-a.fi"}
                  </div>
                  {" "}
                  <div style={{ marginTop: "14px", padding: "0 9px", fontSize: "9.5px", color: "#70757a" }}>
                    {"kilpailija-b.fi"}
                  </div>
                  {" "}
                </div>
                {" "}
              </article>
              {" "}
              <article className="mo-v-paneeli">
                {" "}
                <p className="mo-l-bk">
                  {"Käyttäjäkokemus"}
                </p>
                <b style={{ display: "block", marginTop: "6px", fontSize: "34px", lineHeight: "1", letterSpacing: "-.03em", fontWeight: "680", color: "#6fecff" }}>
                  {"1 napautus"}
                </b>
                {" "}
                <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: "620" }}>
                  {"Hyvä käyttäjäkokemus"}
                </p>
                {" "}
                <p style={{ margin: "5px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#b9c7d4" }}>
                  {"Kävijä, joka ei löydä etsimäänsä, palaa hakutuloksiin. Selkeä rakenne ja toimiva mobiilinäkymä pitävät hänet sivulla."}
                </p>
                {" "}
                <div style={{ position: "relative", marginTop: "12px", height: "118px", borderRadius: "14px", background: "#070b10", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {" "}
                  <div className="mo-v-ilmo" style={{ position: "absolute", left: "12px", right: "12px", top: "12px", display: "flex", alignItems: "center", gap: "10px", padding: "9px 11px", borderRadius: "12px", background: "rgba(255,255,255,.08)", WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}>
                    <span style={{ width: "26px", height: "26px", borderRadius: "7px", background: "#3ddc84", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06140c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path>
                      </svg>
                    </span>
                    <span style={{ lineHeight: "1.25" }}>
                      <b style={{ display: "block", fontSize: "11.5px" }}>
                        {"Uusi yhteydenotto"}
                      </b>
                      <span style={{ fontSize: "10.5px", color: "#a9b8c6" }}>
                        {"Puhelu verkkosivuilta"}
                      </span>
                    </span>
                  </div>
                  {" "}
                  <span className="mo-l-pulssi" style={{ position: "absolute", bottom: "14px", display: "inline-flex", alignItems: "center", gap: "6px", height: "34px", padding: "0 16px", borderRadius: "999px", background: "#6fecff", color: "#0b0f14", fontSize: "13px", fontWeight: "650" }}>
                    {"Soita"}
                  </span>
                  {" "}
                </div>
                {" "}
              </article>
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>
              {" "}
              {(PAN_PISTEET).map((p: any, pI: number) => (
                <Fragment key={pI}>
                  <span style={{ width: `${p.w}px`, height: "6px", borderRadius: "3px", background: p.c, transition: "width .35s, background-color .35s" }}></span>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* ET TARVITSE MITÄÄN VALMIIKSI */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="laatta" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "500px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 40px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z">
              <img data-px="1" src={TYHJA} data-mo-src="/kuvat/autossa.webp" alt="Videokuvausta auton sisällä" style={{ opacity: ".9", top: "0", height: "390px", objectPosition: "45% 50%", WebkitMask: "linear-gradient(180deg, #000 70%, transparent 100%)", mask: "linear-gradient(180deg, #000 70%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "40px", lineHeight: "1.02", letterSpacing: "-.03em", fontWeight: "680" }}>
              {"Et tarvitse mitään "}
              <span style={{ color: "#6fecff" }}>
                {"valmiiksi."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Tekstit, kuvat ja rakenne ovat osa toteutusta, eivät sen edellytys."}
            </p>
            {" "}
          </section>
          {" "}
          {/* PROSESSI: pyyhkäistävä aikajana */}
          {" "}
          <section id="m-prosessi" data-teema="tumma" data-verkko="prosessi" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "40px 0 36px" }}>
            {" "}
            <div style={{ padding: "0 22px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
              {" "}
              <div>
                <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                  {"Näin nettisivujen teko etenee"}
                </h2>
              </div>
              {" "}
              <span className="mo-rv" style={{ flex: "none", paddingBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#8fa3b5", fontVariantNumeric: "tabular-nums" }}>
                <span data-vs="askelnro">{"1"}</span>
                {" / 5"}
              </span>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-d1" style={{ position: "relative", margin: "22px 22px 0", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,.08)" }}>
              <i style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "100%", transform: "scaleX(0)", transformOrigin: "0 50%", borderRadius: "2px", background: "linear-gradient(90deg, #6fecff, #ff9a4d)", transition: "transform .3s" }} data-vs="askelpalkki"></i>
              {" "}
              {(ASKELEET).map((a: any, aI: number) => (
                <Fragment key={aI}>
                  <span data-vs-askel-piste="" style={{ position: "absolute", top: "-5px", left: `${a.x}%`, width: "14px", height: "14px", marginLeft: "-7px", borderRadius: "50%", background: a.bg, boxShadow: a.reuna, transition: "background-color .3s, box-shadow .3s" }}></span>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div className="mo-e-x mo-rv mo-d1" data-vs="askeleet" style={{ gap: "12px", padding: "22px 22px 6px", scrollPaddingLeft: "22px" }}>
              {" "}
              {(ASKELEET).map((a: any, aI: number) => (
                <Fragment key={aI}>
                  {" "}
                  <article data-vs-askel-kortti="" style={{ flex: "0 0 262px", scrollSnapAlign: "start", padding: "18px", borderRadius: "22px", background: a.kbg, boxShadow: a.kreuna, transition: "background-color .35s, box-shadow .35s" }}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="mo-l-nro" style={{ width: "36px", height: "36px", fontSize: "14px", background: a.bg, color: a.fg }}>
                        {a.n}
                      </span>
                      <span className="mo-e-chip" style={{ height: "26px", padding: "0 10px", fontSize: "11.5px", letterSpacing: ".06em", color: "#b4f5ff", background: "rgba(111,236,255,.08)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.2)" }}>
                        {a.aika}
                      </span>
                    </div>
                    {" "}
                    <b style={{ display: "block", marginTop: "16px", fontSize: "19px", fontWeight: "630", letterSpacing: "-.01em" }}>
                      {a.t}
                    </b>
                    {" "}
                    <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#b9c7d4" }}>
                      {a.v}
                    </p>
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
          {/* KENELLE */}
          {" "}
          <section id="m-kenelle" data-teema="tumma" data-verkko="kenelle" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "20px 16px 44px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Kenelle kotisivut kannattaa teettää meillä?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Jos tilanteesi kuuluu jälkimmäiseen ryhmään, sanomme sen suoraan jo kartoituksessa. Se säästää molempien aikaa ja rahaa."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Sopiiko" style={{ marginTop: "20px" }}>
              {" "}
              <button type="button" role="tab" aria-selected={true} data-vs-ke="0" style={{ background: KE_TAB[0].bg, color: KE_TAB[0].fg }}>
                {"Sopii, jos"}
              </button>
              {" "}
              <button type="button" role="tab" aria-selected={false} data-vs-ke="1" style={{ background: TAB.ei.bg, color: TAB.ei.fg }}>
                {"Ei kannata, jos"}
              </button>
              {" "}
            </div>
            {" "}
            {(KE_LISTA).map((l: any, lI: number) => (
              <Fragment key={lI}>
                {" "}
                <ul className="mo-l-kortti-in" data-vs-ke-auki={lI} hidden={lI !== 0} style={{ listStyle: "none", margin: "12px 0 0", padding: "6px 18px", borderRadius: "22px", background: "rgba(255,255,255,.035)", boxShadow: `inset 0 0 0 1px ${l.reuna}` }}>
                  {" "}
                  {(l.rivit).map((r: any, rI: number) => (
                    <Fragment key={rI}>
                      {" "}
                      <li style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: "12px", padding: "14px 0", borderTop: r.raja }}>
                        <span style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: l.ikBg }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={l.ikVari} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={l.ikoni}></path>
                          </svg>
                        </span>
                        <span>
                          <span style={{ display: "block", fontSize: "15.5px", lineHeight: "1.45", color: "#eef3f7" }}>
                            {r.t}
                          </span>
                          {r.v ? (
                            <>
                              <span style={{ display: "block", marginTop: "3px", fontSize: "13.5px", lineHeight: "1.45", color: "#9fb0bf" }}>
                                {r.v}
                              </span>
                            </>
                          ) : null}
                        </span>
                      </li>
                      {" "}
                    </Fragment>
                  ))}
                  {" "}
                </ul>
                {" "}
              </Fragment>
            ))}
            {" "}
            <div className="mo-rv" style={{ marginTop: "12px", padding: "18px", borderRadius: "22px", background: "rgba(111,236,255,.06)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.18)" }}>
              {" "}
              <b style={{ fontSize: "17px", fontWeight: "630" }}>
                {"Etkö ole varma, kumpaan ryhmään kuulut?"}
              </b>
              {" "}
              <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#c3d0dc" }}>
                {"Kysy meiltä. Vastaamme suoraan myös silloin, jos uudet verkkosivut eivät ole sinulle oikea ratkaisu."}
              </p>
              {" "}
              <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ flex: "1.4", height: "46px", padding: "0 12px", fontSize: "14.5px" }}>
                  {"Varaa kartoitus"}
                </a>
                <a data-ankkuri="tarjous" role="link" tabIndex={0} className="mo-e-btn mo-e-o" style={{ flex: "1", height: "46px", padding: "0 12px", fontSize: "14.5px" }}>
                  {"Kysy viestillä"}
                </a>
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* VÄITE 2 */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="vaite2" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "480px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 40px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z">
              <img data-px="1" src={TYHJA} data-mo-src="/verkkosivut/naytto-k.webp" alt="Verkkosivua suunnitellaan kannettavalla tietokoneella" style={{ opacity: ".92", top: "10px", height: "350px", objectPosition: "42% 50%", WebkitMask: "linear-gradient(180deg, #000 70%, transparent 100%)", mask: "linear-gradient(180deg, #000 70%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "36px", lineHeight: "1.04", letterSpacing: "-.028em", fontWeight: "680" }}>
              {"Verkkosivujen hinta sovitaan "}
              <span style={{ color: "#6fecff" }}>
                {"ennen kuin työ alkaa."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Hinta perustuu sivumäärään ja sisällön laajuuteen, ei arvioon tunneista. Näet tarjouksesta, mitä siihen sisältyy."}
            </p>
            {" "}
          </section>
          {" "}
          {/* HINNOITTELU */}
          {" "}
          <section id="m-hinnoittelu" data-teema="tumma" data-verkko="hinnoittelu" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "36px 16px 36px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Paljonko kotisivut maksavat yritykselle?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Kiinteä projektihinta, ei aloitusmaksuja eikä piilokuluja."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Paketit" style={{ marginTop: "22px" }}>
              {" "}
              {(PAKETIT).map((p: any, pI: number) => (
                <Fragment key={pI}>
                  <button type="button" role="tab" aria-selected={p.on} data-vs-paketti={pI} style={{ background: p.tabBg, color: p.tabFg }}>
                    {p.nimi}
                  </button>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            {(PAKETIT_AUKI).map((p: any, pI: number) => (
              <Fragment key={pI}>
                {" "}
                <article className="mo-l-kortti-in" data-vs-paketti-auki={pI} hidden={pI !== PAKETTI_ALKU} style={{ position: "relative", marginTop: "12px", padding: "22px 20px 20px", borderRadius: "24px", background: p.bg, boxShadow: p.reuna }}>
                  {" "}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="mo-l-bk" style={{ color: p.kickVari }}>
                      {p.nimi}
                    </span>
                    {p.suosittu ? (
                      <>
                        <span className="mo-e-chip" style={{ height: "26px", padding: "0 10px", fontSize: "12px", background: "#6fecff", color: "#0b0f14" }}>
                          {"Suosituin"}
                        </span>
                      </>
                    ) : null}
                  </div>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "10px" }}>
                    <span style={{ fontSize: "15px", color: "#a9b8c6" }}>
                      {p.alk}
                    </span>
                    <b style={{ fontSize: "46px", lineHeight: "1", letterSpacing: "-.04em", fontWeight: "680", fontVariantNumeric: "tabular-nums" }}>
                      <span data-vs-hinta={p.hintaLuku}>{p.hintaN}</span>
                    </b>
                    <span style={{ fontSize: "14px", color: "#a9b8c6" }}>
                      {"€ + alv"}
                    </span>
                  </div>
                  {" "}
                  <p style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#c3d0dc" }}>
                    {p.kuvaus}
                  </p>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "16px 0 0", padding: "0" }}>
                    {" "}
                    {(p.rivit).map((r: any, rI: number) => (
                      <Fragment key={rI}>
                        <li className="mo-l-li">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6fecff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12.5l4.2 4L19 7"></path>
                          </svg>
                          <span>
                            {r}
                          </span>
                        </li>
                      </Fragment>
                    ))}
                    {" "}
                  </ul>
                  {" "}
                  <a data-ankkuri="tarjous" role="link" tabIndex={0} className="mo-e-btn mo-e-p" style={{ width: "100%", marginTop: "16px" }}>
                    {"Pyydä tarjous"}
                  </a>
                  {" "}
                </article>
                {" "}
              </Fragment>
            ))}
            {" "}
            <div className="mo-rv" style={{ marginTop: "12px", padding: "14px 16px", borderRadius: "18px", background: "rgba(255,255,255,.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)", fontSize: "13.5px", lineHeight: "1.55", color: "#a9b8c6" }}>
              {"Ylläpito maksaa "}
              <b style={{ color: "#eef3f7" }}>
                {"49 €/kk + alv"}
              </b>
              {", ja siihen kuuluvat palvelintila, verkkotunnus ja SSL-suojaus. Verkkotunnus on yrityksesi nimissä. Hakukoneoptimoinnin jatkuva seuranta on erillinen palvelu, "}
              <b style={{ color: "#eef3f7" }}>
                {"290 €/kk + alv"}
              </b>
              {". Esimerkki toteutuksestamme: "}
              <a href="https://laaksolahdensahko.fi/" className="mo-osuma">
                {"Laaksolahden Sähkö"}
              </a>
              {"."}
            </div>
            {" "}
          </section>
          {" "}
          {/* UKK */}
          {" "}
          <section id="m-ukk" data-teema="tumma" data-verkko="ukk" data-verkko-alfa="0.18" data-vari="#0b121a" style={{ position: "relative", zIndex: "1", padding: "30px 22px 44px" }}>
            {" "}
            <div className="mo-rv">
              {" "}
              <h2 className="mo-e-h2" style={{ fontSize: "30px" }}>
                {"Usein kysytyt kysymykset verkkosivuista"}
              </h2>
              {" "}
              <p className="mo-e-lead" style={{ marginTop: "12px", fontSize: "16px", color: "#b9c7d4" }}>
                {"Hinta, aikataulu, omistajuus ja ylläpito. Nämä kysytään useimmin, ja vastaus on sama myös puhelimessa."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-d1" style={{ marginTop: "16px" }}>
              {" "}
              {(UKK).map((q: any, qI: number) => (
                <div key={qI} data-ukk-rivi={qI} hidden={qI >= UKK_NAKYVIA}>
                  {" "}
                  <button type="button" className={mo(q.luokka)} data-ukk={qI} aria-expanded={q.auki}>
                    {q.k}
                    <span className="mo-e-plus" aria-hidden="true"></span>
                  </button>
                  {" "}
                  <div className="mo-e-vast" data-ukk-vast={qI} hidden={!q.auki} style={{ padding: "0 0 18px" }}>
                        <p style={{ margin: "0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                          {q.v}
                        </p>
                      </div>
                  {" "}
                </div>
              ))}
              {" "}
              <div style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}></div>
              {" "}
              <button type="button" data-ukk-kaikki="" className="mo-e-btn mo-e-o" style={{ width: "100%", marginTop: "16px" }}>
                    {UKK_KAIKKI_TEKSTI}
                  </button>
              {" "}
              <p style={{ margin: "22px 0 0", fontSize: "11.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8fa3b5" }}>
                {"Etkö löytänyt vastausta?"}
              </p>
              {" "}
              <a data-ankkuri="tarjous" role="link" tabIndex={0} className="mo-osuma" style={{ display: "inline-flex", alignItems: "center", minHeight: "40px", fontSize: "16.5px", fontWeight: "600", textDecoration: "none" }}>
                {"Kysy suoraan, vastaamme 24 tunnissa"}
              </a>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* ALUEET */}
          {" "}
          <section id="m-alueet" data-teema="tumma" data-verkko="alueet" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "24px 16px 40px" }}>
            {" "}
            <h2 className="mo-e-h2 mo-rv" style={{ padding: "0 6px", fontSize: "28px" }}>
              {"Verkkosivut yritykselle Espoosta koko Suomeen"}
            </h2>
            {" "}
            <div className="mo-rv-s" style={{ marginTop: "18px", borderRadius: "22px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)", overflow: "hidden" }}>
              {" "}
              {(ALUEET).map((a: any, aI: number) => (
                <Fragment key={aI}>
                  <div style={{ display: "grid", gridTemplateColumns: "96px minmax(0, 1fr)", gap: "12px", padding: "16px 18px", borderTop: a.raja }}>
                    <b style={{ fontSize: "17px", fontWeight: "630", color: "#6fecff" }}>
                      {a.t}
                    </b>
                    <span style={{ fontSize: "14.5px", lineHeight: "1.5", color: "#c3d0dc" }}>
                      {a.v}
                    </span>
                  </div>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* TARJOUS */}
          {" "}
          <section id="m-tarjous" data-teema="tumma" data-verkko="lomake" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", overflow: "hidden", padding: "56px 0 44px", background: "#080d13" }}>
            {" "}
            <img src={TYHJA} data-mo-src="/kuvat/tarjous-kortit-k.webp" alt="" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "620px", objectFit: "cover", objectPosition: "14% 0%", opacity: ".5", WebkitMask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)", mask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)" }} loading="lazy" decoding="async" />
            {" "}
            <div style={{ position: "relative", padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ color: "#fff" }}>
                {"Valmis uudistamaan "}
                <span style={{ color: "#6fecff" }}>
                  {"verkkosivut?"}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "16px", color: "#c9d6e2" }}>
                {"Vastaamme 24 tunnin sisällä ja kerromme suoraan, mitä ehdotamme ja mitä se maksaa. Voit myös soittaa numeroon "}
                <a href="tel:+358405648770" className="mo-osuma">
                  {"040 564 8770"}
                </a>
                {", ja tekijät esittelemme "}
                <a href="/meista" className="mo-osuma">
                  {"Meistä-sivulla"}
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
                      {"Puhelu tai etäpalaveri: tavoite, sivurakenne ja aikataulu."}
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
                      {"Kirjallinen ehdotus kiinteällä hinnalla. Ei sitoumuksia ennen hyväksyntää."}
                    </p>
                  </div>
                </li>
                {" "}
              </ol>
              {" "}
              <form className="mo-rv mo-rv-s" data-vs="lomake" style={{ marginTop: "30px", padding: "22px 18px 20px", borderRadius: "24px", background: "linear-gradient(180deg, rgba(22,34,48,.88), rgba(12,19,28,.92))", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1), 0 40px 80px -40px rgba(0,0,0,.9)", display: "flex", flexDirection: "column", gap: "14px" }}>
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
                  {"Millainen sivusto on mielessä?"}
                  <textarea name="viesti" rows={4} style={{ height: "112px", paddingTop: "13px", resize: "none" }} />
                </label>
                {" "}
                <p className="mo-e-vast" data-vs="kiitos" hidden style={{ margin: "0", padding: "12px 14px", borderRadius: "12px", background: "rgba(111,236,255,.1)", color: "#b4f5ff", fontSize: "14.5px" }}>
                      {"Kiitos. Vastaamme 24 tunnin sisällä."}
                    </p>
                {" "}
                <button type="submit" className="mo-e-btn mo-e-p" style={{ width: "100%", height: "54px", marginTop: "4px", fontSize: "16.5px", fontWeight: "600" }}>
                  {"Lähetä tarjouspyyntö"}
                </button>
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
        </div>
      </div>
      <Kuori reitti="/verkkosivut" palvelu="Verkkosivut" />
      <Moottori otsake={{ tapa: "iso", ka: 280, piilo: 150, lasi: -30 }} verkko={{ siemen: 23, tila: "syaani", pohja: [11, 19, 29] }} />
      <Efektit />
    </div>
  );
}
