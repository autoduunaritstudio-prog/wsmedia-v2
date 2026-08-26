/**
 * Evastesuostumuksen tila ja tallennus.
 *
 * Suostumus pidetaan localStoragessa aikaleiman kanssa: yli
 * CONSENT_MAX_AGE_DAYS vanha valinta katsotaan vanhentuneeksi ja banneri
 * nayetaan uudelleen. Versionumero antaa mahdollisuuden mitatoida vanhat
 * suostumukset, jos kategoriat muuttuvat.
 */

export const CONSENT_KEY = "wsmedia.consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180;

/** Suostumus muuttui (banneri -> analytiikkaskriptit). */
export const CONSENT_CHANGED = "wsmedia:consent-changed";
/** Banneri pyydetaan auki (footerin Evastesasetukset-nappi). */
export const CONSENT_OPEN = "wsmedia:open-consent";

export type Consent = {
  /** Valttamattomat ovat aina kaytossa, joten niita ei talleneta erikseen. */
  analytics: boolean;
};

type StoredConsent = Consent & { v: number; ts: number };

const MAX_AGE_MS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

/** Palauttaa voimassa olevan suostumuksen tai null jos sita ei ole. */
export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.v !== CONSENT_VERSION) return null;
    if (typeof parsed.ts !== "number" || Date.now() - parsed.ts > MAX_AGE_MS) return null;
    return { analytics: !!parsed.analytics };
  } catch {
    // Privaattitila tai estetty tallennus: kohdellaan kuin suostumusta ei olisi.
    return null;
  }
}

export function writeConsent(consent: Consent): void {
  const payload: StoredConsent = { ...consent, v: CONSENT_VERSION, ts: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
  } catch {
    // Tallennus voi epaonnistua; suostumus on silti voimassa taman istunnon ajan.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_CHANGED, { detail: consent }));
}

export function openConsentSettings(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN));
}
