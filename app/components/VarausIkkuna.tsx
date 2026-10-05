"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { YhteysTieto } from "./Kehotukset";

/**
 * MAKSUTTOMAN KARTOITUKSEN VARAUS (4.10.2026).
 *
 * Avautuu ws:varaus-tapahtumasta (Kehotukset.tsx). Kolme vaihetta:
 *
 * 1. Tapa: paikan paalla (paakaupunkiseutu) tai Teams.
 * 2. Aika: 3.–5. arkipaiva, vapaat 30 min ajat haetaan
 *    /api/varaus-reitilta, joka lukee info@wsmedia.fi:n kalenterin
 *    varatut ajat. Paikan paalla -ajoissa on pidempi puskuri
 *    siirtymaa varten, joten vapaat ajat haetaan tavan mukaan.
 * 3. Tiedot: yritys, yhteyshenkilo, puhelin, sahkoposti, osoite
 *    (paikan paalla) ja vapaa viesti.
 *
 * Palvelin tarkistaa ajan viela varaushetkella. Jos joku ehti ensin
 * (409), ajat haetaan uudelleen ja lukija palaa valitsemaan. Jos
 * kalenteri ei vastaa (503), ikkuna tarjoaa puhelinta ja viestia.
 */
type Tapa = "paikalla" | "teams";
type Paiva = { paiva: string; ajat: string[] };
type Tila = "lataa" | "valmis" | "virhe";

const TZ = "Europe/Helsinki";
const PALVELUT = ["Lyhytvideot", "Verkkosivut", "Hakukoneoptimointi", "Graafinen suunnittelu"];

const paivaTeksti = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  const vk = new Intl.DateTimeFormat("fi-FI", { weekday: "short", timeZone: TZ }).format(d);
  const pv = new Intl.DateTimeFormat("fi-FI", { day: "numeric", month: "numeric", timeZone: TZ }).format(d);
  return { vk: vk.replace(".", ""), pv };
};
const klo = (iso: string) =>
  new Intl.DateTimeFormat("fi-FI", { hour: "numeric", minute: "2-digit", timeZone: TZ }).format(new Date(iso));
const pitka = (iso: string) =>
  new Intl.DateTimeFormat("fi-FI", { weekday: "long", day: "numeric", month: "numeric", timeZone: TZ }).format(new Date(iso));

export default function VarausIkkuna() {
  const ref = useRef<HTMLDialogElement>(null);
  const [vaihe, setVaihe] = useState<1 | 2 | 3 | 4>(1);
  const [tapa, setTapa] = useState<Tapa | null>(null);
  const [paivat, setPaivat] = useState<Paiva[]>([]);
  const [tila, setTila] = useState<Tila>("lataa");
  const [paiva, setPaiva] = useState(0);
  const [aika, setAika] = useState<string | null>(null);
  const [palvelu, setPalvelu] = useState<string | undefined>();
  const [ilmoitus, setIlmoitus] = useState<string | null>(null);
  const [lahettaa, setLahettaa] = useState(false);
  /* Etusivun kalenterista valittu aika (ISO), ks. BookingCal.tsx. */
  const [toive, setToive] = useState<string | null>(null);
  const toiveRef = useRef<string | null>(null);

  const hae = useCallback(async (t: Tapa) => {
    setTila("lataa");
    try {
      const r = await fetch(`/api/varaus?tapa=${t}`, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const j = (await r.json()) as { paivat: Paiva[] };
      setPaivat(j.paivat);
      const eka = j.paivat.findIndex((p) => p.ajat.length > 0);
      setPaiva(eka < 0 ? 0 : eka);
      setTila("valmis");
      /* Toivottu aika: vapaana -> suoraan yhteystietoihin, muuten
         toivotun paivan ajat esiin ja pyynto valita toinen. */
      const tv = toiveRef.current;
      if (tv) {
        toiveRef.current = null;
        const i = j.paivat.findIndex((p) => p.ajat.includes(tv));
        if (i >= 0) {
          setPaiva(i);
          setAika(tv);
          setVaihe(3);
        } else {
          const pv = j.paivat.findIndex((p) => tv.startsWith(p.paiva) || p.ajat.some((a) => a.slice(0, 10) === tv.slice(0, 10)));
          if (pv >= 0) setPaiva(pv);
          setIlmoitus("Toivomasi aika ei ole vapaana. Valitse toinen aika.");
        }
      }
    } catch {
      setTila("virhe");
    }
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const avaa = (e: Event) => {
      const t = (e as CustomEvent<YhteysTieto>).detail ?? {};
      setPalvelu(t.palvelu);
      setToive(t.toive ?? null);
      toiveRef.current = t.toive ?? null;
      setVaihe(1);
      setTapa(null);
      setAika(null);
      setIlmoitus(null);
      if (!d.open) d.showModal();
      document.documentElement.classList.add("lukossa");
    };
    const kiinni = () => document.documentElement.classList.remove("lukossa");
    const taustaklikki = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    window.addEventListener("ws:varaus", avaa);
    d.addEventListener("close", kiinni);
    d.addEventListener("click", taustaklikki);
    return () => {
      window.removeEventListener("ws:varaus", avaa);
      d.removeEventListener("close", kiinni);
      d.removeEventListener("click", taustaklikki);
    };
  }, []);

  const valitseTapa = (t: Tapa) => {
    setTapa(t);
    setAika(null);
    setIlmoitus(null);
    setVaihe(2);
    hae(t);
  };

  const viesti = () => {
    ref.current?.close();
    window.dispatchEvent(new CustomEvent("ws:yhteys", { detail: { palvelu } }));
  };

  const varaa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tapa || !aika || lahettaa) return;
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");
    setLahettaa(true);
    setIlmoitus(null);
    try {
      const r = await fetch("/api/varaus", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          aika,
          tapa,
          yritys: g("yritys"),
          nimi: g("nimi"),
          puhelin: g("puhelin"),
          sahkoposti: g("sahkoposti"),
          osoite: g("osoite"),
          palvelu: palvelu ?? "",
          lisatiedot: g("lisatiedot"),
          sivu: location.pathname,
          ansa: g("verkkosivu"),
        }),
      });
      if (r.status === 409) {
        setIlmoitus("Joku ehti varata tämän ajan juuri äsken. Valitse toinen aika.");
        setAika(null);
        setVaihe(2);
        hae(tapa);
        return;
      }
      if (!r.ok) throw new Error(String(r.status));
      setVaihe(4);
    } catch {
      setIlmoitus("Varaus ei mennyt perille. Yritä uudelleen tai soita 040 564 8770.");
    } finally {
      setLahettaa(false);
    }
  };

  const valittu = paivat[paiva];
  const tapaTeksti = tapa === "paikalla" ? "Paikan päällä" : tapa === "teams" ? "Teams" : null;

  return (
    <dialog className="yi vi" ref={ref} aria-labelledby="vi-otsikko">
      <div className="yi-sisus">
        <button type="button" className="yi-sulje" aria-label="Sulje" onClick={() => ref.current?.close()}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="yi-vasen">
          <p className="yi-kick">Maksuton kartoitus</p>
          <h2 id="vi-otsikko">Varaa 30 minuuttia, katsotaan tilanteesi yhdessä.</h2>
          <p className="yi-lead">Käymme läpi nykytilan ja tavoitteet. Saat suosituksen ja hinta-arvion. Ei sido mihinkään.</p>
          <ol className="vi-polku">
            <li data-on={vaihe >= 1 ? "1" : "0"} data-ok={tapa ? "1" : "0"}>
              <span>Tapa</span>
              <b>{tapaTeksti ?? "Valitse"}</b>
            </li>
            <li data-on={vaihe >= 2 ? "1" : "0"} data-ok={aika ? "1" : "0"}>
              <span>Aika</span>
              <b>
                {aika
                  ? `${pitka(aika)} klo ${klo(aika)}`
                  : toive
                    ? `Toive: ${pitka(toive)} klo ${klo(toive)}`
                    : "Valitse"}
              </b>
            </li>
            <li data-on={vaihe >= 3 ? "1" : "0"} data-ok={vaihe === 4 ? "1" : "0"}>
              <span>Yhteystiedot</span>
              <b>{vaihe === 4 ? "Valmis" : "Täytä"}</b>
            </li>
          </ol>
        </div>

        <div className="yi-lomake vi-oikea">
          {vaihe === 1 ? (
            <>
              <h3 className="vi-h">Miten tavataan?</h3>
              {toive ? (
                <p className="vi-toive">
                  Valitsit ajan <b>{pitka(toive)} klo {klo(toive)}</b>. Valitse vielä tapaamistapa.
                </p>
              ) : null}
              <div className="vi-tavat">
                <button type="button" className="vi-tapa" onClick={() => valitseTapa("paikalla")}>
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </svg>
                  <b>Tulemme paikan päälle</b>
                  <span>Pääkaupunkiseudulla: Helsinki, Espoo, Vantaa, Kauniainen</span>
                </button>
                <button type="button" className="vi-tapa" onClick={() => valitseTapa("teams")}>
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="6" width="13" height="12" rx="2.5" />
                    <path d="M16 10.5l5-3v9l-5-3" />
                  </svg>
                  <b>Teams-etäpalaveri</b>
                  <span>Lähetämme linkin sähköpostiisi ennen tapaamista</span>
                </button>
              </div>
              <p className="vi-vihje">
                Haluatko mieluummin kirjoittaa?{" "}
                <button type="button" className="vi-linkki" onClick={viesti}>
                  Lähetä viesti
                </button>
              </p>
            </>
          ) : null}

          {vaihe === 2 ? (
            <>
              <button type="button" className="vi-takaisin" onClick={() => setVaihe(1)}>
                ‹ Vaihda tapaa
              </button>
              <h3 className="vi-h">Valitse aika</h3>
              {ilmoitus ? (
                <p className="vi-ilmoitus" role="alert">
                  {ilmoitus}
                </p>
              ) : null}
              {tila === "lataa" ? (
                <div className="vi-lataa" role="status">
                  Haetaan vapaita aikoja…
                </div>
              ) : tila === "virhe" ? (
                <div className="vi-virhe" role="alert">
                  <p>Kalenteri ei vastaa juuri nyt. Soita 040 564 8770 tai lähetä viesti, niin sovitaan aika.</p>
                  <div className="vi-napit">
                    <a className="btn" href="tel:+358405648770">
                      Soita
                    </a>
                    <button type="button" className="btn alt" onClick={viesti}>
                      Lähetä viesti
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="vi-paivat" role="tablist" aria-label="Päivä">
                    {paivat.map((p, i) => {
                      const t = paivaTeksti(p.paiva);
                      return (
                        <button
                          key={p.paiva}
                          type="button"
                          role="tab"
                          aria-selected={i === paiva}
                          disabled={p.ajat.length === 0}
                          className="vi-paiva"
                          onClick={() => setPaiva(i)}
                        >
                          <span>{t.vk}</span>
                          <b>{t.pv}</b>
                          <small>{p.ajat.length ? `${p.ajat.length} vapaata` : "täynnä"}</small>
                        </button>
                      );
                    })}
                  </div>
                  {valittu && valittu.ajat.length ? (
                    <div className="vi-ajat" role="radiogroup" aria-label="Kellonaika">
                      {valittu.ajat.map((a) => (
                        <button
                          key={a}
                          type="button"
                          role="radio"
                          aria-checked={a === aika}
                          className="vi-aika"
                          onClick={() => setAika(a)}
                        >
                          {klo(a)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="vi-tyhja">
                      Näille päiville ei ole vapaita aikoja. Soita 040 564 8770 tai{" "}
                      <button type="button" className="vi-linkki" onClick={viesti}>
                        lähetä viesti
                      </button>
                      .
                    </p>
                  )}
                  <button type="button" className="btn" disabled={!aika} onClick={() => setVaihe(3)}>
                    Jatka
                  </button>
                </>
              )}
            </>
          ) : null}

          {vaihe === 3 ? (
            <form className="vi-tiedot" onSubmit={varaa}>
              <button type="button" className="vi-takaisin" onClick={() => setVaihe(2)}>
                ‹ Vaihda aikaa
              </button>
              <h3 className="vi-h">Yhteystiedot</h3>
              <label>
                Yrityksen nimi
                <input name="yritys" autoComplete="organization" required />
              </label>
              <div className="yi-rivi">
                <label>
                  Yhteyshenkilö
                  <input name="nimi" autoComplete="name" required />
                </label>
                <label>
                  Puhelin
                  <input name="puhelin" type="tel" autoComplete="tel" required />
                </label>
              </div>
              <label>
                Sähköposti
                <input name="sahkoposti" type="email" autoComplete="email" required />
              </label>
              {tapa === "paikalla" ? (
                <label>
                  Käyntiosoite
                  <input name="osoite" autoComplete="street-address" placeholder="Katu, postinumero ja kaupunki" required />
                </label>
              ) : null}
              <fieldset className="yi-palvelut">
                <legend>Mistä haluat puhua?</legend>
                {PALVELUT.map((p) => (
                  <label key={p} className={palvelu === p ? "on" : undefined}>
                    <input type="radio" name="palvelu" checked={palvelu === p} onChange={() => setPalvelu(p)} />
                    {p}
                  </label>
                ))}
              </fieldset>
              <label>
                Lisätiedot <span className="vi-vapaa">(vapaaehtoinen)</span>
                <textarea name="lisatiedot" rows={2} />
              </label>
              {/* Roskapostiansa: ihminen ei nae eika tayta tata. */}
              <label className="vi-ansa" aria-hidden="true">
                Verkkosivu
                <input name="verkkosivu" tabIndex={-1} autoComplete="off" />
              </label>
              {ilmoitus ? (
                <p className="vi-ilmoitus" role="alert">
                  {ilmoitus}
                </p>
              ) : null}
              <button className="btn" type="submit" disabled={lahettaa}>
                {lahettaa ? "Varataan…" : `Varaa ${aika ? `${pitka(aika)} klo ${klo(aika)}` : ""}`}
              </button>
            </form>
          ) : null}

          {vaihe === 4 && aika ? (
            <div className="vi-valmis" role="status">
              <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
                <circle cx="24" cy="24" r="22" fill="#0f1a2b" />
                <path d="M15 24.5l6 6 12-13" fill="none" stroke="#6fecff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3>Kartoitus on varattu.</h3>
              <p>
                {pitka(aika)} klo {klo(aika)}, {tapa === "paikalla" ? "tulemme paikan päälle" : "Teams"}. Vahvistamme ajan
                sähköpostilla{tapa === "teams" ? " ja lähetämme Teams-linkin" : ""}.
              </p>
              <button type="button" className="btn" onClick={() => ref.current?.close()}>
                Sulje
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
