/* GRAAFISEN SUUNNITTELUN PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Graafinen.dc.html: rakenne,
   tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on muunnettu
   koneellisesti (dc2jsx.mjs + _mobiili-design/tyokalut/graafinen.py) ja
   vierityksen ja tilan arvot on korvattu alkutilalla; Efektit.tsx ja
   Moottori.tsx kirjoittavat ne suoraan DOMiin. Naytetaan vain
   max-width: 767px (app/components/mobiili/mobiili.css).

   Tietoiset poikkeamat suunnitelmasta (nakyma sama 390 px:n leveydella):
   - Heron teippausruutu skaalautuu nakyman leveyteen (suunnitelma 390 px).
   - Vertailun kolme korttia, kenelle-listat, kaikki 15 UKK:ta ja
     SEO-teksti ovat HTML:ssa valmiina (suljetut hidden), jotta sisalto
     on hakukoneelle ja ilman JS:aa luettavissa.
   - Hinta-arvion rivit ovat yhdessa kaaressa (data-g="rivit"), jotta
     Efektit voi rakentaa ne uudelleen. Asettelu on sama.
   - Logonauhan kuvat ovat kevyet /mobiili/logot/*.webp-versiot. */
import "./mobiili.css";
import "./lisat.css";
import { Fragment } from "react";
import { mo, TYHJA } from "@/app/components/mobiili/mo";
import Kuori from "@/app/components/mobiili/Kuori";
import Alatunniste from "@/app/components/mobiili/Alatunniste";
import Moottori from "@/app/components/mobiili/Moottori";
import GraafinenEfektit from "./Efektit";
import { ALUEET, ARVIO, AUTOT, KA, KE_LISTAT, KESTOT, LOGOT, PAL_PISTEET, PALVELUT, RYHMAT, UKK_, VERT_KORTIT, VERTAILU } from "./data";

export default function GraafinenMobiili() {
  return (
    <div className="mo-root mo-s-graafinen">
      {/* Heron ensimmainen teippausruutu heti (vain puhelimessa). */}
      <link rel="preload" as="image" href="/mobiili/graafinen-teippaus-alfa-0.webp" media="(max-width: 767px)" fetchPriority="high" />
      <div className="mo-e-root" style={{ position: "relative", background: "#0b0f14", color: "#f5f5f7" }}>
        {/* HERO: auto teipataan vierityksen mukana */}
        {" "}
        <div style={{ height: "calc(330px + 200svh)", position: "relative" }}>
          {" "}
          <div data-teema="tumma" className="mo-g-raidat" style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden" }}>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none", background: "repeating-linear-gradient(-58deg, rgba(120,170,255,0) 0 80px, rgba(120,170,255,.045) 80px 150px, rgba(120,170,255,0) 150px 230px)", WebkitMask: "linear-gradient(180deg, #000 0%, #000 55%, transparent 85%)", mask: "linear-gradient(180deg, #000 0%, #000 55%, transparent 85%)" }}></div>
            {" "}
            <div style={{ position: "absolute", left: "0", right: "0", top: "calc(66px + max(0px, (100svh - 798px) / 2))", height: "calc(100vw * 2 / 3)", transform: "translateY(0px) scale(1)", transformOrigin: "50% 0" }} data-g="lava">
              {" "}
              <div className="mo-g-teippi" role="img" aria-label="Valkoinen pakettiauto teipataan WS Median ilmeeseen, ja samaan ilmeeseen syntyvät valomainos, roll-up ja käyntikortit" style={{ position: "absolute", inset: "0", backgroundPosition: "0% 0%" }} data-g="ruutu"></div>
              {" "}
            </div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "calc(100svh - 140px)", transform: "translateX(-50%) translateY(6px)", display: "flex", alignItems: "center", gap: "12px", height: "58px", padding: "0 8px 0 6px", borderRadius: "999px", background: "rgba(12,17,23,.62)", WebkitBackdropFilter: "blur(14px) saturate(1.3)", backdropFilter: "blur(14px) saturate(1.3)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12), 0 10px 30px -12px rgba(0,0,0,.7)", opacity: "1", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "6" }} data-g="vihje">
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
                  {"niin auto teipataan"}
                </span>
              </span>
              {" "}
              <span style={{ position: "relative", width: "32px", height: "32px", marginLeft: "4px" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "block", transform: "rotate(-90deg)" }}>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2.5"></circle>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#6fecff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="81.7" strokeDashoffset="81.7" data-g="rengas"></circle>
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
            <div aria-hidden="true" style={{ position: "absolute", left: "16px", right: "16px", top: "calc(100svh - 140px)", height: "58px", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px", borderRadius: "18px", background: "rgba(111,236,255,.1)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.35)", opacity: "0", transform: "translateY(8px)", zIndex: "6", pointerEvents: "none" }} data-g="lopuksi">
              <span style={{ flex: "none", width: "26px", height: "26px", borderRadius: "50%", background: "#6fecff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0b0f14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.2 4L19 7"></path>
                </svg>
              </span>
              <span style={{ fontSize: "13.5px", lineHeight: "1.35", fontWeight: "600", color: "#eafcff" }}>
                {"Sama logo, samat värit ja sama fontti, oli pinta mikä tahansa."}
              </span>
            </div>
            {" "}
            <div style={{ position: "absolute", left: "22px", right: "22px", top: "calc(100svh - 424px)", textAlign: "left", transform: "translateY(0px)", zIndex: "6" }} data-g="teksti">
              {" "}
              <h1 style={{ margin: "0", fontSize: "32px", lineHeight: "1.06", letterSpacing: "-.022em", fontWeight: "640", color: "#f5f5f7" }}>
                {"Graafinen suunnittelu yritykselle, "}
                <span style={{ color: "#6fecff" }}>
                  {"logosta auton kylkeen."}
                </span>
              </h1>
              {" "}
              <p style={{ margin: "12px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#d6dce6" }}>
                {"Suunnittelemme logon, värit ja graafisen ohjeiston ja viemme ilmeen käyntikortteihin, roll-upeihin, ikkunoihin ja pakettiauton kylkeen. Saat yhden tarjouksen, yhden yhteyshenkilön ja yhden laskun."}
              </p>
              {" "}
              <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                {" "}
                <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ flex: "1.25", padding: "0 12px", fontSize: "15px" }}>
                  {"Varaa kartoitus"}
                </a>
                {" "}
                <a data-ankkuri="hinta" role="link" tabIndex={0} className="mo-e-btn mo-e-o" style={{ flex: "1", padding: "0 12px", fontSize: "15px" }}>
                  {"Laske hinta"}
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#05080c", opacity: "0", pointerEvents: "none", zIndex: "7" }} data-g="peitto"></div>
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
            <div style={{ position: "absolute", inset: "0", background: "#0e1a30" }}></div>
            {" "}
            <canvas data-mo-verkko="" width="390" height="844" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100svh", display: "block" }}></canvas>
            {" "}
          </div>
          {" "}
          <section data-teema="tumma" data-verkko="alku" data-vari="#0e1a30" style={{ position: "relative", zIndex: "1" }}>
            {" "}
            <div aria-label="Asiakkaitamme" className="mo-e-nauha-w mo-rv-n" style={{ position: "relative", height: "96px", overflow: "hidden", WebkitMask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", mask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
              {" "}
              <div className="mo-e-nauha" style={{ position: "absolute", top: "32px", left: "0" }}>
                {" "}
                {(LOGOT).map((l, lI) => (
                  <Fragment key={lI}>
                    <img src={TYHJA} data-mo-src={l.src} alt={l.alt} style={{ height: `${l.h}px`, width: "auto", display: "block", filter: l.f, opacity: ".78" }} loading="lazy" decoding="async" />
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* MIKSI */}
          {" "}
          <section id="m-miksi" data-teema="tumma" data-verkko="miksi" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "22px 16px 44px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Mainostoimisto vai teippaamo? Meiltä saat "}
                <span style={{ color: "#6fecff" }}>
                  {"molemmat."}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Mainostoimisto suunnittelee ja teippaamo asentaa. Väliin jää kysymyksiä, joihin kukaan ei vastaa: kuka tekee painovalmiit tiedostot, kuka sopii asennusajan ja kuka korjaa, jos auton kylki ei näytä luonnokselta."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Vertailu" style={{ marginTop: "20px" }}>
              {" "}
              {(VERTAILU).map((v, vI) => (
                <Fragment key={vI}>
                  <button type="button" role="tab" aria-selected={v.on} data-g-vert={vI} style={{ background: v.tabBg, color: v.tabFg, fontSize: "13px" }}>
                    {v.lyhyt}
                  </button>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            {(VERT_KORTIT).map((v, vI) => (
              <Fragment key={vI}>
                {" "}
                <article className={mo(v.luokka)} data-g-vertkortti={vI} hidden={vI !== 1} style={{ position: "relative", marginTop: "14px", padding: "20px 18px", borderRadius: "22px", background: v.bg, boxShadow: v.reuna }}>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <b style={{ fontSize: `${v.koko}px`, fontWeight: "650", letterSpacing: "-.012em", lineHeight: "1.2" }}>
                      {v.otsikko}
                    </b>
                    {v.me ? (
                      <>
                        <span className="mo-e-chip mo-g-pulssi" style={{ flex: "none", height: "26px", padding: "0 10px", fontSize: "11px", fontWeight: "700", letterSpacing: ".06em", background: "#ff9a4d", color: "#0b0f14" }}>
                          {"★ SUOSITELTU"}
                        </span>
                      </>
                    ) : null}
                    {v.muu ? (
                      <>
                        <span style={{ flex: "none", fontSize: "11px", fontWeight: "600", color: "#8fa3b5" }}>
                          {"Vertailu"}
                        </span>
                      </>
                    ) : null}
                  </div>
                  {" "}
                  <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
                    {" "}
                    {(v.vaiheet).map((s, sI) => (
                      <Fragment key={sI}>
                        <div style={{ flex: "1" }}>
                          <i className="mo-g-vaihe" style={{ display: "block", background: s.c, transform: `scaleX(${s.sx})`, transitionDelay: `${s.d}s` }}></i>
                          <span style={{ display: "block", marginTop: "6px", fontSize: "11px", color: s.tc, textDecoration: s.td }}>
                            {s.n}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    {" "}
                  </div>
                  {" "}
                  <p style={{ margin: "14px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#c3d0dc" }}>
                    {v.tiivis}
                  </p>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "8px 0 0", padding: "0" }}>
                    {" "}
                    {(v.rivit).map((r, rI) => (
                      <Fragment key={rI}>
                        <li className="mo-l-li" style={{ fontSize: "14.5px" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={v.ikVari} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={v.ikoni}></path>
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
                </article>
                {" "}
              </Fragment>
            ))}
            {" "}
            <p className="mo-rv" style={{ margin: "14px 6px 0", fontSize: "14px", lineHeight: "1.55", color: "#9fb0bf" }}>
              {"Emme teippaa emmekä paina itse. Valitsemme tekijät, annamme heille oikeat tiedostot ja vastaamme siitä, että lopputulos vastaa hyväksymääsi luonnosta."}
            </p>
            {" "}
          </section>
          {" "}
          {/* PALVELUT: kortit pinoutuvat */}
          {" "}
          <section id="m-palvelut" data-teema="tumma" data-verkko="palvelut" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "16px 16px 36px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Mitä graafinen suunnittelu meillä sisältää?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Ilme suunnitellaan kerran ja sitä käytetään kaikkialla. Voit tilata koko kokonaisuuden tai vain sen osan, jonka tarvitset nyt."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-e-x mo-rv mo-d1" data-g="pal" style={{ gap: "12px", margin: "0 -16px", padding: "22px 22px 6px", scrollPaddingLeft: "22px" }}>
              {" "}
              {(PALVELUT).map((p, pI) => (
                <Fragment key={pI}>
                  {" "}
                  <article className="mo-g-kortti" data-g-pal={pI} style={{ flex: "0 0 300px", scrollSnapAlign: "start", borderRadius: "24px", overflow: "hidden", background: "#0f1822", boxShadow: `inset 0 0 0 1px ${p.reuna}`, transform: `scale(${p.sk})`, opacity: p.op, transition: "transform .45s cubic-bezier(.2,.7,.2,1), opacity .45s, box-shadow .45s" }}>
                    {" "}
                    <div style={{ position: "relative", height: "170px", overflow: "hidden" }}>
                      <img src={TYHJA} data-mo-src={p.kuva} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `scale(${p.zoom})`, transition: "transform 1.4s cubic-bezier(.2,.7,.2,1)" }} loading="lazy" decoding="async" />
                      <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(8,13,19,0) 40%, rgba(15,24,34,.95) 100%)" }}></span>
                      <span className="mo-e-chip" style={{ position: "absolute", left: "14px", top: "14px", height: "28px", padding: "0 11px", fontSize: "12px", color: "#0b0f14", background: "#6fecff" }}>
                        {p.hinta}
                      </span>
                      <span style={{ position: "absolute", right: "14px", top: "16px", fontSize: "12px", fontWeight: "650", color: "rgba(255,255,255,.8)", fontVariantNumeric: "tabular-nums" }}>
                        {"0"}
                        {p.nro}
                        {" / 04"}
                      </span>
                    </div>
                    {" "}
                    <div style={{ padding: "2px 18px 20px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "650", letterSpacing: ".14em", color: "#ff9a4d" }}>
                        {p.kick}
                      </span>
                      <h3 style={{ margin: "4px 0 0", fontSize: "19px", lineHeight: "1.25", fontWeight: "640", letterSpacing: "-.012em" }}>
                        {p.nimi}
                      </h3>
                      <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#b9c7d4" }}>
                        {p.teksti}
                      </p>
                      {" "}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                        {(p.rivit).map((r, rI) => (
                          <Fragment key={rI}>
                            <span style={{ padding: "6px 9px", borderRadius: "10px", fontSize: "12px", lineHeight: "1.3", color: "#dbe5ee", background: "rgba(255,255,255,.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
                              {r}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    {" "}
                  </article>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div data-g="palpisteet" style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>
              {" "}
              {(PAL_PISTEET).map((p, pI) => (
                <Fragment key={pI}>
                  <span style={{ width: `${p.w}px`, height: "6px", borderRadius: "3px", background: p.c, transition: "width .35s, background-color .35s" }}></span>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* VÄITE */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="vaite1" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "460px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 36px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z">
              <img data-px="1" src={TYHJA} data-mo-src="/graafinen-suunnittelu/ilme-teippaus-k.webp" alt="Pakettiauton teippausluonnokset näytöllä ja tabletilla" style={{ opacity: ".92", top: "10px", height: "330px", objectPosition: "70% 50%", WebkitMask: "linear-gradient(180deg, #000 70%, transparent 100%)", mask: "linear-gradient(180deg, #000 70%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "36px", lineHeight: "1.04", letterSpacing: "-.028em", fontWeight: "680" }}>
              {"Kun kaikki näyttää samalta, "}
              <span style={{ color: "#6fecff" }}>
                {"yritys jää mieleen."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Asiakas näkee pakettiautosi liikenteessä ja myöhemmin saman logon hakutuloksissa. Jos ne näyttävät samalta, hän tunnistaa yrityksesi jo ennen kuin soittaa."}
            </p>
            {" "}
          </section>
          {" "}
          {/* HINTALASKURI */}
          {" "}
          <section id="m-hinta" data-teema="tumma" data-verkko="hinta" data-vari="#0d1824" style={{ position: "relative", zIndex: "1", padding: "30px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Paljonko graafinen suunnittelu maksaa?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Valitse kohteet, niin näet suuruusluokan heti."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ marginTop: "20px", padding: "16px", borderRadius: "24px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
              {" "}
              {(RYHMAT).map((r, rI) => (
                <Fragment key={rI}>
                  {" "}
                  <p className="mo-l-bk" style={{ margin: "4px 2px 8px" }}>
                    {r.otsikko}
                  </p>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px", marginBottom: "14px" }}>
                    {" "}
                    {(r.kohteet).map((k, kI) => (
                      <Fragment key={kI}>
                        <button type="button" className="mo-g-laatta" aria-pressed={k.on} data-g-kohde={k.id} style={{ background: k.bg, boxShadow: k.reuna, color: "#eef3f7" }}>
                          <span style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
                            <b style={{ fontSize: "13.5px", lineHeight: "1.3", fontWeight: "620" }}>
                              {k.nimi}
                            </b>
                            <span style={{ flex: "none", width: "18px", height: "18px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", background: k.ruutu, boxShadow: k.ruutuReuna }} data-g="ruutu-k">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0b0f14" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: k.ruksi }} data-g="ruksi">
                                <path d="M5 12.5l4.2 4L19 7"></path>
                              </svg>
                            </span>
                          </span>
                          <span style={{ fontSize: "12.5px", color: "#6fecff", fontWeight: "600" }}>
                            {"alk. "}
                            {k.alk}
                            {" €"}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                    {" "}
                  </div>
                  {" "}
                </Fragment>
              ))}
              {" "}
              <p className="mo-l-bk" style={{ margin: "4px 2px 8px" }}>
                {"Ajoneuvo"}
              </p>
              {" "}
              <div className="mo-e-x" style={{ gap: "8px", margin: "0 -16px", padding: "0 16px 2px", scrollSnapType: "x proximity" }}>
                {" "}
                {(AUTOT).map((a, aI) => (
                  <Fragment key={aI}>
                    <button type="button" className="mo-g-auto" role="radio" aria-checked={a.on} data-g-auto={a.id} style={{ background: a.bg, boxShadow: a.reuna, color: a.fg }}>
                      <b style={{ fontSize: "13.5px", fontWeight: "620", whiteSpace: "nowrap" }}>
                        {a.nimi}
                      </b>
                      <span style={{ fontSize: "12px", opacity: ".8", whiteSpace: "nowrap" }}>
                        {a.alk}
                      </span>
                    </button>
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", opacity: "0.35", transition: "opacity .3s" }} data-g="maara">
                {" "}
                <span style={{ fontSize: "14px", color: "#c3d0dc" }}>
                  {"Autoja"}
                </span>
                {" "}
                <button type="button" className="mo-osuma" aria-label="Yksi auto vähemmän" data-g-maara="-1" style={{ width: "36px", height: "36px", border: "0", borderRadius: "12px", font: "inherit", fontSize: "20px", color: "#eef3f7", background: "rgba(255,255,255,.07)", cursor: "pointer" }}>
                  {"−"}
                </button>
                {" "}
                <b style={{ minWidth: "22px", textAlign: "center", fontSize: "18px", fontVariantNumeric: "tabular-nums" }}>
                  <span data-g="autoja">{"1"}</span>
                </b>
                {" "}
                <button type="button" className="mo-osuma" aria-label="Yksi auto lisää" data-g-maara="1" style={{ width: "36px", height: "36px", border: "0", borderRadius: "12px", font: "inherit", fontSize: "20px", color: "#eef3f7", background: "rgba(255,255,255,.07)", cursor: "pointer" }}>
                  {"+"}
                </button>
                {" "}
              </div>
              {" "}
              <p style={{ margin: "8px 2px 0", fontSize: "12.5px", lineHeight: "1.45", color: "#8fa3b5" }}>
                {"Toisesta autosta alkaen 25 % edullisempi, koska suunnittelu on jo tehty."}
              </p>
              {" "}
              <div style={{ marginTop: "16px", padding: "16px", borderRadius: "18px", background: "linear-gradient(180deg, rgba(111,236,255,.12), rgba(111,236,255,.04))", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.35)" }}>
                {" "}
                <p className="mo-l-bk" style={{ color: "#b4f5ff" }}>
                  {"Arviosi"}
                </p>
                {" "}
                <b className="mo-g-summa" style={{ display: "block", marginTop: "6px", fontSize: "32px", lineHeight: "1.05", letterSpacing: "-.03em", fontWeight: "680", fontVariantNumeric: "tabular-nums" }}>
                  <span data-g="summa">{ARVIO.teksti}</span>
                </b>
                {" "}
                <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#a9b8c6" }}>
                  {"+ alv 25,5 %. Sisältää suunnittelun, materiaalit ja asennuksen."}
                </p>
                {" "}
                <div data-g="rivit">{(ARVIO.rivit).map((r, rI) => (
                  <Fragment key={rI}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "7px 0", borderTop: "1px solid rgba(255,255,255,.07)", fontSize: "13px", color: "#c3d0dc" }}>
                      <span>
                        {r.n}
                      </span>
                      <span style={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                        {r.v}
                      </span>
                    </div>
                  </Fragment>
                ))}</div>
                {" "}
                <a data-ankkuri="tarjous" role="link" tabIndex={0} className="mo-e-btn mo-e-p" style={{ width: "100%", height: "48px", marginTop: "12px" }}>
                  {"Pyydä tarkka tarjous"}
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <p className="mo-rv" style={{ margin: "14px 6px 0", fontSize: "13px", lineHeight: "1.55", color: "#8fa3b5" }}>
              {"Arvio perustuu tyypillisiin toteutuksiin, ja lopullinen hinta tarkentuu kartoituksessa. Usean auton kalustossa yksikköhinta laskee selvästi, koska suunnittelu tehdään kerran ja monistetaan."}
            </p>
            {" "}
          </section>
          {" "}
          {/* KENELLE */}
          {" "}
          <section id="m-kenelle" data-teema="tumma" data-verkko="kenelle" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "20px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Kenelle graafinen suunnittelu meiltä sopii?"}
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
              <button type="button" role="tab" aria-selected={true} data-g-ke="0" style={{ background: "#6fecff", color: "#0b0f14" }}>
                {"Sopii, jos"}
              </button>
              {" "}
              <button type="button" role="tab" aria-selected={false} data-g-ke="1" style={{ background: "transparent", color: "#c9d6e2" }}>
                {"Ei kannata, jos"}
              </button>
              {" "}
            </div>
            {" "}
            {(KE_LISTAT).map((l, lI) => (
              <Fragment key={lI}>
                {" "}
                <ul className="mo-l-kortti-in" data-g-kelista={lI} hidden={lI !== 0} style={{ listStyle: "none", margin: "12px 0 0", padding: "6px 18px", borderRadius: "22px", background: "rgba(255,255,255,.035)", boxShadow: `inset 0 0 0 1px ${l.reuna}` }}>
                  {" "}
                  {(l.rivit).map((r, rI) => (
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
                {"Kysy meiltä. Vastaamme suoraan myös silloin, jos graafinen suunnittelu ei ole sinulle oikea ratkaisu."}
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
          {/* MATERIAALIT */}
          {" "}
          <section id="m-materiaalit" data-teema="tumma" data-verkko="materiaalit" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "20px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Kuinka kauan teippaus kestää?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Halpa ja kallis tarjous eroavat yleensä materiaalissa. Kerromme tarjouksessa aina, mitä materiaalia käytetään ja kuinka kauan sen pitäisi kestää."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ marginTop: "20px", padding: "6px 16px", borderRadius: "22px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
              {" "}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 2px", fontSize: "10.5px", color: "#6f8191", fontVariantNumeric: "tabular-nums" }}>
                <span>
                  {"0 v"}
                </span>
                <span>
                  {"2"}
                </span>
                <span>
                  {"4"}
                </span>
                <span>
                  {"6"}
                </span>
                <span>
                  {"8 v"}
                </span>
              </div>
              {" "}
              {(KESTOT).map((k, kI) => (
                <Fragment key={kI}>
                  {" "}
                  <div className="mo-g-kesto-r" style={{ padding: "12px 0", borderTop: k.raja }}>
                    {" "}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
                      <b style={{ fontSize: "15px", fontWeight: "620" }}>
                        {k.kohde}
                      </b>
                      <span style={{ flex: "none", fontSize: "13px", fontWeight: "650", color: "#6fecff" }}>
                        {k.ika}
                      </span>
                    </div>
                    {" "}
                    {k.palkki ? (
                      <>
                        <div className="mo-g-kesto" style={{ marginTop: "8px" }}>
                          <i style={{ left: `${k.a}%`, right: `${k.b}%` }}></i>
                        </div>
                      </>
                    ) : null}
                    {" "}
                    <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: "1.45", color: "#9fb0bf" }}>
                      {k.materiaali}
                      {" · "}
                      {k.huom}
                    </p>
                    {" "}
                  </div>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <p className="mo-rv" style={{ margin: "14px 6px 0", fontSize: "13.5px", lineHeight: "1.55", color: "#9fb0bf" }}>
              {"Lyhytikäinen kampanjateippi on halvempi mutta kestää kuukausia, ei vuosia. Kun kalusto on tarkoitus pitää samannäköisenä viisi vuotta, materiaalin valinta ratkaisee enemmän kuin muutaman satasen ero tarjouksessa."}
            </p>
            {" "}
          </section>
          {" "}
          {/* UKK */}
          {" "}
          <section id="m-ukk" data-teema="tumma" data-verkko="ukk" data-verkko-alfa="0.18" data-vari="#0b121a" style={{ position: "relative", zIndex: "1", padding: "24px 22px 40px" }}>
            {" "}
            <div className="mo-rv">
              {" "}
              <h2 className="mo-e-h2" style={{ fontSize: "30px" }}>
                {"Usein kysytyt kysymykset graafisesta suunnittelusta"}
              </h2>
              {" "}
              <p className="mo-e-lead" style={{ marginTop: "12px", fontSize: "16px", color: "#b9c7d4" }}>
                {"Hinta, aikataulu, tiedostot ja se mitä työhön oikeasti sisältyy."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-d1" style={{ marginTop: "16px" }}>
              {" "}
              {(UKK_).map((q, qI) => (
                <div key={qI} data-ukk-rivi={qI} hidden={qI >= 6}>
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
              {true ? (
                <>
                  <button type="button" data-ukk-kaikki="" className="mo-e-btn mo-e-o" style={{ width: "100%", marginTop: "16px" }}>
                    {"Näytä kaikki 15 kysymystä"}
                  </button>
                </>
              ) : null}
              {" "}
              <p style={{ margin: "22px 0 0", fontSize: "11.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8fa3b5" }}>
                {"Etkö löytänyt vastausta?"}
              </p>
              {" "}
              <a data-ankkuri="tarjous" role="link" tabIndex={0} style={{ display: "inline-flex", alignItems: "center", minHeight: "40px", fontSize: "16.5px", fontWeight: "600", textDecoration: "none" }}>
                {"Kysy suoraan, vastaamme 24 tunnissa"}
              </a>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* ALUEET + KÄYTÄNNÖSSÄ */}
          {" "}
          <section id="m-alueet" data-teema="tumma" data-verkko="alueet" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "24px 16px 44px" }}>
            {" "}
            <h2 className="mo-e-h2 mo-rv" style={{ padding: "0 6px", fontSize: "28px" }}>
              {"Graafinen suunnittelu Espoossa ja koko Suomessa"}
            </h2>
            {" "}
            <div className="mo-rv-s" style={{ marginTop: "18px", borderRadius: "22px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)", overflow: "hidden" }}>
              {" "}
              {(ALUEET).map((a, aI) => (
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
            <div className="mo-rv" style={{ marginTop: "36px", padding: "0 6px" }}>
              {" "}
              <h3 style={{ margin: "0 0 0", fontSize: "22px", lineHeight: "1.2", letterSpacing: "-.015em", fontWeight: "640" }}>
                {"Miksi yhtenäinen yritysilme kannattaa?"}
              </h3>
              {" "}
              <p style={{ margin: "12px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                {"Yrityksen ilme ei ole logo vaan se kokonaisuus, jonka asiakas kohtaa: verkkosivu, käyntikortti, pakettiauton kylki, toimitilan ikkuna ja somekanavan profiilikuva. Kun ne näyttävät samalta, jokainen kohtaaminen vahvistaa edellistä. Kun ne näyttävät eriltä, jokainen kohtaaminen alkaa alusta."}
              </p>
              {" "}
              <div className="mo-e-vast" data-g="seo" hidden>
                    {" "}
                    <h3 style={{ margin: "22px 0 0", fontSize: "19px", lineHeight: "1.25", fontWeight: "630" }}>
                      {"Mistä graafisen suunnittelun hinta muodostuu?"}
                    </h3>
                    {" "}
                    <p style={{ margin: "10px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Hinta muodostuu työtunneista, joten se kertoo suoraan, kuinka paljon työtä kohteeseen käytetään. Suurimmat tekijät ovat laajuus eli montako pintaa ja versiota tarvitaan, muutoskierrosten määrä ja käyttöoikeuksien laajuus. Teippausten ja painotuotteiden kohdalla mukaan tulee vielä materiaali ja työ. Siksi kahden tarjouksen vertailu pelkän loppusumman perusteella on harhaanjohtavaa: halvempi tarjous voi sisältää lyhytikäisen kalvon, ulkoasennuksen ja oletuksen siitä, että toimitat itse painovalmiin tiedoston."}
                    </p>
                    {" "}
                    <h3 style={{ margin: "22px 0 0", fontSize: "19px", lineHeight: "1.25", fontWeight: "630" }}>
                      {"Kannattaako pakettiauton mainosteippaus?"}
                    </h3>
                    {" "}
                    <p style={{ margin: "10px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Mainos netissä tai lehdessä näkyy niin kauan kuin siitä maksetaan. Teipattu auto näkyy joka ajokilometrillä, eikä sitä voi kytkeä pois päältä. Kustannus jakautuu koko kalvon käyttöiälle, joten pidempään kestävä kalvo tulee vuotta kohden usein edullisemmaksi, vaikka se maksaa enemmän. Siksi materiaalista kannattaa kysyä jo tarjousvaiheessa."}
                    </p>
                    {" "}
                    <h3 style={{ margin: "22px 0 0", fontSize: "19px", lineHeight: "1.25", fontWeight: "630" }}>
                      {"Mikä on suunnittelun ja tuotannon ero?"}
                    </h3>
                    {" "}
                    <p style={{ margin: "10px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Suunnittelu ratkaisee, miltä lopputulos näyttää. Tuotanto ratkaisee, kuinka kauan se kestää. Ne ovat eri ammatteja, mutta niiden yhteensovittaminen ei kuulu asiakkaalle. Sinä hyväksyt luonnoksen ja saat valmiin lopputuloksen, ja kaikki siltä väliltä on meidän työtämme."}
                    </p>
                    {" "}
                  </div>
              {" "}
              <button type="button" data-g="seonappi" aria-expanded={false} className="mo-e-btn mo-e-o" style={{ height: "42px", marginTop: "16px", padding: "0 16px", fontSize: "14.5px" }}>
                {"Lue koko teksti"}
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
            <img src={TYHJA} data-mo-src="/kuvat/tarjous-kortit-k.webp" alt="" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "620px", objectFit: "cover", objectPosition: "14% 0%", opacity: ".5", WebkitMask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)", mask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)" }} loading="lazy" decoding="async" />
            {" "}
            <div style={{ position: "relative", padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ color: "#fff" }}>
                {"Valmis uudistamaan "}
                <span style={{ color: "#6fecff" }}>
                  {"yrityksen ilmeen?"}
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
                      {"Kartoitus: mitä pintoja ilmeen pitää kattaa ja missä järjestyksessä."}
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
                      {"Kiinteä hinta, joka sisältää suunnittelun, materiaalit ja asennuksen."}
                    </p>
                  </div>
                </li>
                {" "}
              </ol>
              {" "}
              <form className="mo-rv mo-rv-s" data-g="lomake" style={{ marginTop: "30px", padding: "22px 18px 20px", borderRadius: "24px", background: "linear-gradient(180deg, rgba(22,34,48,.88), rgba(12,19,28,.92))", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1), 0 40px 80px -40px rgba(0,0,0,.9)", display: "flex", flexDirection: "column", gap: "14px" }}>
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
                  {"Mitä tarvitset? Kerro esim. ajoneuvojen määrä ja paikkakunta."}
                  <textarea name="viesti" rows={4} style={{ height: "112px", paddingTop: "13px", resize: "none" }} />
                </label>
                {" "}
                <p className="mo-e-vast" data-g="kiitos" hidden style={{ margin: "0", padding: "12px 14px", borderRadius: "12px", background: "rgba(111,236,255,.1)", color: "#b4f5ff", fontSize: "14.5px" }}>
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
          {" "}
        </div>
      </div>
      <Kuori reitti="/graafinen-suunnittelu" palvelu="Graafinen suunnittelu" />
      <Moottori otsake={{ tapa: "iso", ka: KA, piilo: 150, lasi: -30 }} verkko={{ siemen: 31, tila: "syaani", pohja: [13, 22, 40] }} />
      <GraafinenEfektit />
    </div>
  );
}
