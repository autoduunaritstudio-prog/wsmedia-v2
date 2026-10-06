/* MOBIILIN KUORI (6.10.2026): ylapalkki, valikko, lomakeikkuna ja
   jatkuva CTA-palkki. Rakenne, tekstit ja tyylit ovat suunnitelmasta
   (_mobiili-design/sivut/Puhelin.dc.html ja Toihin.dc.html) sellaisenaan.
   Palvelinkomponentti: kaikki kayttaytyminen on Moottori.tsx:ssa, joka
   loytaa osat data-attribuuteista. Valikko toimii myos ilman
   JavaScriptia (checkbox + CSS, ks. kuori.css .mo-wv-*). */
import "./kuori.css";
import "./mobiili.css";
import { LOGO_VIEWBOX, LogoPolut } from "./Logo";
import { Ansa, LomakeVirhe } from "./Lomakeosat";

export type MobiiliReitti =
  | "/"
  | "/lyhytvideot"
  | "/verkkosivut"
  | "/graafinen-suunnittelu"
  | "/hakukoneoptimointi"
  | "/meista"
  | "/toihin-meille"
  | "/yhteystiedot"
  | "/laskutustiedot"
  | "/tietosuoja";

type Props = {
  /** Nykyinen sivu: valikon rivi himmennetaan ja palvelukortti korostetaan. */
  reitti: MobiiliReitti;
  /** Lomakeikkuna: yhteys (palvelu esivalittuna) tai Toihin meille -sivun hakemus. */
  ikkuna?: "yhteys" | "hakemus";
  /** Yhteysikkunan esivalittu palvelu. */
  palvelu?: string;
  /** iso = palvelusivujen ja etusivun palkki, pieni = yhteystiedot, laskutus, tietosuoja. */
  tapa?: "iso" | "pieni";
};

const NUOLI = (
  <span className="mo-wv-nuoli">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6"></path>
    </svg>
  </span>
);

const PALVELUT = [
  {
    href: "/lyhytvideot",
    nimi: "Lyhytvideot",
    ala: "TikTok, Reels ja Shorts avaimet käteen",
    ikoni: (
      <>
        <rect x="6" y="2.5" width="12" height="19" rx="3"></rect>
        <path d="M10.5 9.5v5l4-2.5z" fill="currentColor"></path>
      </>
    ),
  },
  {
    href: "/verkkosivut",
    nimi: "Verkkosivut",
    ala: "Nopeat, hakukoneoptimoidut sivustot",
    ikoni: (
      <>
        <rect x="2.5" y="4" width="19" height="16" rx="2.5"></rect>
        <path d="M2.5 8.5h19"></path>
        <circle cx="5.5" cy="6.3" r=".6" fill="currentColor"></circle>
        <circle cx="7.8" cy="6.3" r=".6" fill="currentColor"></circle>
        <path d="M6 12.5h7M6 15.5h4"></path>
      </>
    ),
  },
  {
    href: "/graafinen-suunnittelu",
    nimi: "Graafinen suunnittelu",
    ala: "Yritysilme, painotuotteet ja teippaukset",
    ikoni: (
      <>
        <path d="M12 3l7 7-7 11-7-11z"></path>
        <circle cx="12" cy="11" r="1.8"></circle>
        <path d="M12 3v6.2"></path>
      </>
    ),
  },
  {
    href: "/hakukoneoptimointi",
    nimi: "SEO-optimointi",
    ala: "Näkyvyys niissä hauissa jotka tuovat liidit",
    ikoni: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5"></circle>
        <path d="M15.5 15.5L21 21"></path>
        <path d="M7.5 12l2-2 1.5 1.5 2.5-3"></path>
      </>
    ),
  },
] as const;

const SIVUT = [
  { href: "/meista", nimi: "Meistä", i: 6 },
  { href: "/toihin-meille", nimi: "Töihin meille", i: 7 },
  { href: "/yhteystiedot", nimi: "Yhteystiedot", i: 8 },
  { href: "/laskutustiedot", nimi: "Laskutus", i: 9 },
] as const;

const PUHELIN_IKONI = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2";

function Rivi({ href, nimi, i, nyt, viimeinen }: { href: string; nimi: string; i: number; nyt: boolean; viimeinen?: boolean }) {
  const tyyli = viimeinen ? { borderBottom: "1px solid rgba(255,255,255,.1)" } : undefined;
  return (
    <li className={`mo-wv-p mo-wv-i${i}`}>
      {nyt ? (
        <span className="mo-wv-l mo-wv-nyt" aria-current="page" style={tyyli}>
          {nimi}
        </span>
      ) : (
        <a href={href} className="mo-wv-l" style={tyyli}>
          {nimi}
          {NUOLI}
        </a>
      )}
    </li>
  );
}

function YhteysIkkuna({ palvelu }: { palvelu?: string }) {
  return (
    <div className="mo-ik" data-ikkuna="yhteys" role="dialog" aria-modal="true" aria-labelledby="m-ik-otsikko" aria-hidden="true">
      <div className="mo-ik-tausta" data-sulje="1"></div>
      <div className="mo-ik-laatikko" tabIndex={-1}>
        <span className="mo-ik-kahva" aria-hidden="true"></span>
        <button type="button" className="mo-ik-sulje" data-sulje="1" aria-label="Sulje">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
          </svg>
        </button>
        <div className="mo-ik-rulla">
          <div className="mo-ik-sis">
            <p className="mo-ik-kick mo-ik-p">
              <span className="mo-ik-piste"></span>
              {"Ota yhteyttä"}
            </p>
            <h2 id="m-ik-otsikko" className="mo-ik-p">
              {"Kerro lyhyesti, mitä "}
              <span style={{ color: "#6fecff" }}>{"tarvitset."}</span>
            </h2>
            <p className="mo-ik-lead mo-ik-p">{"Vastaamme arkisin 24 tunnin sisällä. Kiireessä soita suoraan."}</p>
            <form className="mo-ik-lomake mo-ik-p" noValidate>
              <fieldset className="mo-ik-sirut">
                <legend>{"Mistä palvelusta on kyse?"}</legend>
                {["Lyhytvideot", "Verkkosivut", "Hakukoneoptimointi", "Graafinen suunnittelu"].map((p) => (
                  <label className="mo-ik-siru" key={p}>
                    <input type="checkbox" name="palvelu" value={p} defaultChecked={palvelu === p} />
                    {p}
                  </label>
                ))}
              </fieldset>
              <div className="mo-ik-rivi">
                <label className="mo-e-in">
                  {"Nimi"}
                  <input name="nimi" autoComplete="name" required />
                </label>
                <label className="mo-e-in">
                  {"Yritys"}
                  <input name="yritys" autoComplete="organization" />
                </label>
              </div>
              <div className="mo-ik-rivi">
                <label className="mo-e-in">
                  {"Puhelin"}
                  <input name="puhelin" type="tel" autoComplete="tel" />
                </label>
                <label className="mo-e-in">
                  {"Sähköposti"}
                  <input name="sahkoposti" type="email" inputMode="email" autoComplete="email" required />
                </label>
              </div>
              <label className="mo-e-in">
                {"Viesti"}
                <textarea name="viesti" rows={3} placeholder="Esim. tarvitsemme 4 videota kuukaudessa Instagramiin." />
              </label>
              <button type="submit" className="mo-e-btn mo-e-p mo-ik-laheta">{"Lähetä viesti"}</button>
              <p className="mo-ik-huom">{"Ei sitoumuksia."}</p>
              <Ansa />
              <LomakeVirhe />
            </form>
            <div className="mo-ik-kiitos" role="status">
              <span className="mo-ik-ok">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                </svg>
              </span>
              <h3>{"Kiitos, viesti on perillä."}</h3>
              <p>{"Vastaamme arkisin 24 tunnin sisällä. Lähetimme vahvistuksen sähköpostiisi."}</p>
              <button type="button" className="mo-e-btn mo-e-p" data-sulje="1">{"Sulje"}</button>
            </div>
            <Suorat />
          </div>
        </div>
      </div>
    </div>
  );
}

const OSAAMINEN = ["Videokuvaus", "Editointi", "Motion graphics", "Verkkokehitys", "Hakukoneoptimointi", "Sisällöntuotanto", "Graafinen suunnittelu", "Teippaus tai asennus"];

function HakemusIkkuna() {
  return (
    <div className="mo-ik" data-ikkuna="hakemus" role="dialog" aria-modal="true" aria-labelledby="m-ik-otsikko" aria-hidden="true">
      <div className="mo-ik-tausta" data-sulje="1"></div>
      <div className="mo-ik-laatikko" tabIndex={-1}>
        <span className="mo-ik-kahva" aria-hidden="true"></span>
        <button type="button" className="mo-ik-sulje" data-sulje="1" aria-label="Sulje">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
          </svg>
        </button>
        <div className="mo-ik-rulla">
          <div className="mo-ik-sis">
            <p className="mo-ik-kick mo-ik-p">
              <span className="mo-ik-piste"></span>
              {"Avoin hakemus"}
            </p>
            <h2 id="m-ik-otsikko" className="mo-ik-p">
              {"Kerro, mitä "}
              <span style={{ color: "#6fecff" }}>{"osaat."}</span>
            </h2>
            <p className="mo-ik-lead mo-ik-p">{"Hakemus vie viisi minuuttia. Luemme jokaisen ja vastaamme viikon sisällä."}</p>
            <ul className="mo-ik-faktat mo-ik-p">
              <li>
                <span>{"Ansioluettelo"}</span>
                <b>{"Ei tarvita"}</b>
              </li>
              <li>
                <span>{"Työmalli"}</span>
                <b>{"Toimeksianto tai työsuhde"}</b>
              </li>
              <li>
                <span>{"Laskutus"}</span>
                <b>{"Kevytyrittäjyys käy"}</b>
              </li>
            </ul>
            <form className="mo-ik-lomake mo-ik-p" noValidate>
              <fieldset className="mo-ik-sirut">
                <legend>{"Mitä osaat? Valitse yksi tai useampi"}</legend>
                {OSAAMINEN.map((o) => (
                  <label className="mo-ik-siru" key={o}>
                    <input type="checkbox" name="osaaminen" value={o} />
                    {o}
                  </label>
                ))}
              </fieldset>
              <div className="mo-ik-rivi">
                <label className="mo-e-in">
                  {"Nimi"}
                  <input name="nimi" autoComplete="name" required />
                </label>
                <label className="mo-e-in">
                  {"Sähköposti"}
                  <input name="sahkoposti" type="email" inputMode="email" autoComplete="email" required />
                </label>
              </div>
              <div className="mo-ik-rivi">
                <label className="mo-e-in">
                  {"Puhelin"}
                  <input name="puhelin" type="tel" autoComplete="tel" />
                </label>
                <label className="mo-e-in">
                  {"Paikkakunta"}
                  <input name="paikkakunta" autoComplete="address-level2" />
                </label>
              </div>
              <label className="mo-e-in">
                {"Linkki työnäytteisiin"}
                <input name="nayte" placeholder="Portfolio, showreel tai GitHub" />
              </label>
              <label className="mo-e-in">
                {"Kerro lyhyesti, mitä olet tehnyt ja mitä haluaisit tehdä"}
                <textarea name="viesti" rows={3} />
              </label>
              <button type="submit" className="mo-e-btn mo-e-p mo-ik-laheta">{"Lähetä hakemus"}</button>
              <p className="mo-ik-huom">{"Käsittelemme hakemukset luottamuksellisesti."}</p>
              <Ansa />
              <LomakeVirhe />
            </form>
            <div className="mo-ik-kiitos" role="status">
              <span className="mo-ik-ok">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5"></path>
                </svg>
              </span>
              <h3>{"Kiitos, hakemus on perillä."}</h3>
              <p>{"Luemme sen ja vastaamme viikon sisällä. Lähetimme vahvistuksen sähköpostiisi."}</p>
              <button type="button" className="mo-e-btn mo-e-p" data-sulje="1">{"Sulje"}</button>
            </div>
            <Suorat />
          </div>
        </div>
      </div>
    </div>
  );
}

function Suorat() {
  return (
    <div className="mo-ik-suorat mo-ik-p">
      <a href="tel:+358405648770">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={PUHELIN_IKONI}></path>
        </svg>
        {"040 564 8770"}
      </a>
      <a href="mailto:info@wsmedia.fi">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5"></rect>
          <path d="M3.5 7l8.5 6 8.5-6"></path>
        </svg>
        {"info@wsmedia.fi"}
      </a>
    </div>
  );
}

function Valikko({ reitti }: { reitti: MobiiliReitti }) {
  return (
    <div className="mo-wv-ov" role="dialog" aria-modal="true" aria-label="Valikko">
      <div className="mo-wv-hehku" aria-hidden="true"></div>
      <svg className="mo-wv-vesi" viewBox={LOGO_VIEWBOX} width="560" height="269" fill="#ffffff" aria-hidden="true">
        <LogoPolut />
      </svg>
      <div className="mo-wv-rullaus">
        <div style={{ position: "relative", padding: "80px 20px 40px", display: "flex", flexDirection: "column", gap: "28px" }}>
          <nav aria-label="Päävalikko">
            <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
              <Rivi href="/" nimi="Etusivu" i={0} nyt={reitti === "/"} />
              <li>
                <span className="mo-wv-otsake mo-wv-p mo-wv-i1">{"Palvelut"}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "4px 0 18px" }}>
                  {PALVELUT.map((p, i) => {
                    const nyt = reitti === p.href;
                    return (
                      <a key={p.href} href={p.href} aria-current={nyt ? "page" : undefined} className={`${nyt ? "mo-wv-nyt " : ""}mo-wv-sub mo-wv-p mo-wv-i${i + 2}`}>
                        <span className="mo-wv-merkki">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            {p.ikoni}
                          </svg>
                        </span>
                        <span>
                          <b style={{ display: "block", fontSize: "17px", letterSpacing: "-0.01em" }}>{p.nimi}</b>
                          <small style={{ display: "block", fontSize: "14px", lineHeight: "1.4", color: "rgba(255,255,255,.65)", marginTop: "2px" }}>{p.ala}</small>
                        </span>
                      </a>
                    );
                  })}
                </div>
              </li>
              {SIVUT.map((s, k) => (
                <Rivi key={s.href} href={s.href} nimi={s.nimi} i={s.i} nyt={reitti === s.href} viimeinen={k === SIVUT.length - 1} />
              ))}
            </ul>
          </nav>
          <div className="mo-wv-p mo-wv-i10" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <span aria-hidden="true" style={{ display: "block", width: "40px", height: "2px", borderRadius: "2px", background: "#6fecff" }}></span>
            <address style={{ fontStyle: "normal", fontSize: "15.5px", lineHeight: "1.6", color: "rgba(255,255,255,.75)" }}>
              <b style={{ color: "#fff" }}>{"WS Media Oy"}</b>
              {" Kuusiniementie 8 F 3 "}
              <br />
              {"02710 Espoo "}
              <br />
              <a href="mailto:info@wsmedia.fi" style={{ textDecoration: "none", fontWeight: "600" }}>{"info@wsmedia.fi"}</a>
              {" "}
              <br />
              <small style={{ fontSize: "13.5px", color: "rgba(255,255,255,.55)" }}>{"Y-tunnus 3615084-4"}</small>
            </address>
            <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p mo-wv-btn">{"Varaa maksuton kartoitus"}</a>
            <a href="tel:+358405648770" className="mo-wv-btn mo-wv-o">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M6.2 3.5 L8.2 3.5 L9.3 6.6 L7.9 7.7 a9 9 0 0 0 4.4 4.4 L13.4 10.7 L16.5 11.8 L16.5 13.8 a1.8 1.8 0 0 1-2 1.8 A12.4 12.4 0 0 1 4.4 5.5 a1.8 1.8 0 0 1 1.8-2 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path>
              </svg>
              {"040 564 8770"}
            </a>
          </div>
          <div className="mo-wv-p mo-wv-i11">
            <p id="m-wv-some" style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: "600", letterSpacing: ".04em", color: "rgba(255,255,255,.55)" }}>{"Seuraa meitä"}</p>
            <ul aria-labelledby="m-wv-some" style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", gap: "10px" }}>
              <li>
                <a href="https://www.instagram.com/wsmedia.fi/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (avautuu uuteen välilehteen)" title="Instagram" className="mo-wv-some">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="5"></rect>
                    <circle cx="12" cy="12" r="3.6"></circle>
                    <circle cx="17" cy="7" r=".8" fill="currentColor"></circle>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@wsmedia.fi" target="_blank" rel="noopener noreferrer" aria-label="TikTok (avautuu uuteen välilehteen)" title="TikTok" className="mo-wv-some">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M14 4v10.5a3.3 3.3 0 1 1-3.3-3.3M14 4c.5 2.3 2 3.8 4.6 4.1"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://fi.linkedin.com/company/ws-media-oy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (avautuu uuteen välilehteen)" title="LinkedIn" className="mo-wv-some">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="4" y="9" width="3.5" height="11"></rect>
                    <circle cx="5.7" cy="5.5" r="2"></circle>
                    <path d="M10 9h3.3v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20H17v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.google.com/maps?cid=17434529617661064987" target="_blank" rel="noopener noreferrer" aria-label="Google-profiili (avautuu uuteen välilehteen)" title="Google-profiili" className="mo-wv-some">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path>
                    <circle cx="12" cy="9.5" r="2.5"></circle>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const ikoniTyyli = { flex: "none", width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5f5f7", background: "rgba(255,255,255,.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)" } as const;

function Palkki({ ikkuna, tapa }: { ikkuna?: "yhteys" | "hakemus"; tapa: "iso" | "pieni" }) {
  if (tapa === "pieni") {
    return (
      <nav aria-label="Pikatoiminnot" className="mo-palkki mo-palkki-pieni" data-mo-palkki="pieni">
        <a href="tel:+358405648770" aria-label="Soita 040 564 8770" className="mo-m-btn mo-m-o">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.6 3.5h2.6l1.6 4.2-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4.2 1.6v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"></path>
          </svg>
        </a>
        <a href="mailto:info@wsmedia.fi" aria-label="Lähetä sähköpostia" className="mo-m-btn mo-m-o">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2"></rect>
            <path d="M3 7l9 6 9-6"></path>
          </svg>
        </a>
        <a href="/yhteystiedot" data-varaus="" className="mo-m-btn mo-m-p mo-m-shine">{"Varaa kartoitus"}</a>
      </nav>
    );
  }
  const hakemus = ikkuna === "hakemus";
  return (
    <nav aria-label="Pikatoiminnot" className="mo-palkki" data-mo-palkki="iso">
      <a href="tel:+358405648770" aria-label="Soita 040 564 8770" style={ikoniTyyli}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={PUHELIN_IKONI}></path>
        </svg>
      </a>
      <a data-ankkuri={hakemus ? "hakemus" : "lomake"} role="link" tabIndex={0} aria-label="Pyydä tarjous" style={ikoniTyyli}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5"></rect>
          <path d="M3.5 7l8.5 6 8.5-6"></path>
        </svg>
      </a>
      {hakemus ? (
        <a data-ankkuri="hakemus" role="link" tabIndex={0} className="mo-e-btn mo-e-p" style={{ flex: "1", height: "48px", borderRadius: "14px", padding: "0 14px", fontSize: "15.5px", fontWeight: "600" }}>
          {"Jätä hakemus"}
        </a>
      ) : (
        <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ flex: "1", height: "48px", borderRadius: "14px", padding: "0 14px", fontSize: "15.5px", fontWeight: "600" }}>
          {"Varaa maksuton kartoitus"}
        </a>
      )}
    </nav>
  );
}

export default function Kuori({ reitti, ikkuna = "yhteys", palvelu, tapa = "iso" }: Props) {
  const pieni = tapa === "pieni";
  return (
    <>
      {ikkuna === "hakemus" ? <HakemusIkkuna /> : <YhteysIkkuna palvelu={palvelu} />}
      {/* autoComplete off: selain ei palauta valikkoa auki takaisin-painikkeella. */}
      <input type="checkbox" id="m-wv-auki" className="mo-wv-cb" aria-label="Avaa tai sulje valikko" autoComplete="off" />
      <header className={pieni ? "mo-otsake mo-otsake-pieni" : "mo-otsake"} data-mo-otsake="">
        <span className="mo-otsake-lasi"></span>
        <a href="/" aria-label="WS Media, etusivu" className="mo-otsake-logo">
          <svg viewBox={LOGO_VIEWBOX} width={pieni ? 52 : 58} height={pieni ? 25 : 28} fill="currentColor" aria-hidden="true">
            <LogoPolut />
          </svg>
        </a>
        <label htmlFor="m-wv-auki" className="mo-wv-nappi" aria-label="Valikko">
          <span className="mo-wv-ic" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </span>
        </label>
      </header>
      <Valikko reitti={reitti} />
      <Palkki ikkuna={ikkuna} tapa={tapa} />
    </>
  );
}
