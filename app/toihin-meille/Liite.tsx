"use client";

import { useId } from "react";

/**
 * "Lisää liite" -painike hakemuslomakkeisiin (5.10.2026). Tiedostokentta
 * on piilotettu painikkeen alle; valitut tiedostot nakyvat listana ja
 * ne voi poistaa. Tiedostot lahtevat hakemuksen mukana, yhteensa
 * enintaan 4 Mt (ks. hakemus.ts).
 */
export default function Liite({
  tiedostot,
  muuta,
}: {
  tiedostot: File[];
  muuta: (t: File[]) => void;
}) {
  const id = useId();
  return (
    <div className="tm-liite">
      <input
        id={id}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
        className="tm-liite-kentta"
        onChange={(e) => {
          const uudet = Array.from(e.currentTarget.files ?? []);
          muuta([...tiedostot, ...uudet.filter((u) => !tiedostot.some((t) => t.name === u.name))]);
          e.currentTarget.value = "";
        }}
      />
      <label htmlFor={id} className="tm-liite-nappi">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.1-8.1a3.4 3.4 0 0 1 4.8 4.8l-8 8a1.7 1.7 0 0 1-2.4-2.4l7.4-7.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Lisää liite
        <small>CV, portfolio tai työnäyte (PDF, kuva, Word, zip)</small>
      </label>
      {tiedostot.length > 0 ? (
        <ul className="tm-liite-lista" aria-label="Valitut liitteet">
          {tiedostot.map((t) => (
            <li key={t.name}>
              <span>{t.name}</span>
              <button
                type="button"
                aria-label={`Poista liite ${t.name}`}
                onClick={() => muuta(tiedostot.filter((x) => x.name !== t.name))}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
