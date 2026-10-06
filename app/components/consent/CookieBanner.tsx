"use client";

import { useEffect, useId, useState } from "react";

import { CONSENT_OPEN, readConsent, writeConsent } from "./consent";

/**
 * Evastebanneri. Nayetaan kun voimassa olevaa suostumusta ei ole, ja uudelleen
 * kun footerin Evasteasetukset-nappi pyytaa. Analytiikka on oletuksena pois:
 * hyvaksynta on aina aktiivinen valinta, ja kieltaminen yhta helppoa kuin
 * hyvaksyminen.
 */
export default function CookieBanner() {
  /* Avoinna jo palvelimella: banneri on HTML:ssa ensimmaisesta piirrosta
     asti. Jos suostumus on jo annettu, <html data-suostumus> (layout.tsx)
     piilottaa sen CSS:lla ennen piirtoa, joten tilaa ei tarvitse muuttaa
     latauksessa. */
  const [open, setOpen] = useState(true);
  /* Kayttajan itse avaama banneri liukuu sisaan; ensimmaisella
     nayttokerralla se on valmiiksi paikallaan (ks. globals.css .cc). */
  const [avattu, setAvattu] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const toggleId = useId();

  /* Oma tarkistus (8.10.2026): jos voimassa oleva valinta on tallessa,
     banneri suljetaan myos silloin, kun <html data-suostumus> puuttuu.
     Safarissa merkinta voi kadota, jos React piirtaa juuren uudelleen
     hydraatioeron jalkeen (esim. iOS on muuttanut numeroita linkeiksi
     ennen hydraatiota), jolloin pelkka CSS-saanto ei piilota banneria. */
  useEffect(() => {
    if (readConsent()) setOpen(false);
  }, []);

  useEffect(() => {
    const onOpen = () => {
      // Piilotus on vain ensimmaista piirtoa varten; avaus ohittaa sen.
      document.documentElement.removeAttribute("data-suostumus");
      setAvattu(true);
      setAnalytics(readConsent()?.analytics ?? false);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN, onOpen);
  }, []);

  if (!open) return null;

  const save = (value: boolean) => {
    writeConsent({ analytics: value });
    setOpen(false);
  };

  return (
    <div
      className={avattu ? "cc cc-avattu" : "cc"}
      role="dialog"
      aria-modal="false"
      aria-label="Evästeasetukset"
    >
      <div className="cc-in">
        <div className="cc-txt">
          <p className="cc-h">Evästeet</p>
          <p>
            Käytämme välttämättömiä evästeitä sivuston toimintaan. Analytiikka- ja
            markkinointievästeet otetaan käyttöön vain suostumuksellasi. Lue lisää{" "}
            <a href="/tietosuoja">tietosuojaselosteesta</a>.
          </p>
        </div>

        <div className="cc-opts">
          <div className="cc-opt">
            <span>
              <b>Välttämättömät</b>
              <small>Sivuston toiminta ja tietoturva</small>
            </span>
            <span className="cc-always">Aina käytössä</span>
          </div>
          <div className="cc-opt">
            <label htmlFor={toggleId}>
              <b>Analytiikka &amp; markkinointi</b>
              <small>Google Analytics 4 ja Meta Pixel</small>
            </label>
            <input
              id={toggleId}
              type="checkbox"
              className="cc-sw"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
          </div>
        </div>

        <div className="cc-btns">
          <button type="button" className="btn alt" onClick={() => save(analytics)}>
            Tallenna valinta
          </button>
          <button type="button" className="btn" onClick={() => save(true)}>
            Hyväksy kaikki
          </button>
        </div>
      </div>
    </div>
  );
}
