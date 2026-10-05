"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";

import { LogoFull, LogoMark } from "./Logo";
import NavCarriers from "./NavCarriers";
import PalveluMerkki from "./PalveluMerkki";
import SmartLink from "./SmartLink";
import SocialIcon from "./SocialIcon";
import { CONTACT, SOCIAL, type NavLink } from "./site-data";

/**
 * Ylapalkki ja taysvalikko.
 *
 * RAKENNE ON MERKITSEVA: overlay renderoidaan <nav>:n SISARUKSENA, ei sen
 * sisalle. Navilla on backdrop-filter, ja se tekee elementista containing
 * blockin position: fixed -jalkelaisille (sama vaikutus kuin transformilla tai
 * filterilla). Navin sisalla overlay puristui palkin korkuiseksi 48px-kaistaksi
 * - kayttajalle se nakyi niin, etta jokin vilahtaa ja katoaa. Sisaruksena
 * fixed on jalleen viewport-suhteinen.
 *
 * Saavutettavuus: aria-expanded painikkeessa, aria-hidden overlayssa
 * suljettuna, fokusansa Tabille, fokus palaa painikkeeseen sulkiessa, Escape
 * ja taustaklikkaus sulkevat, sivun vieritys lukitaan auki ollessa. Suljettuna
 * overlay on visibility: hidden, joten sen linkit eivat ole tab-jarjestyksessa.
 */

type Props = {
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
  /** Kun annettu, logo on linkki. Etusivu jattaa taman pois. */
  logoHref?: string;
  /** "/" alasivuilla, jotta valikon #-ankkurit osoittavat etusivulle. */
  anchorBase?: string;
  /**
   * Ohituslinkin kohde, esim. "#paasisalto". Kun annettu, navin eteen
   * piirtyy linkki joka nakyy vasta nappaimistofokuksessa.
   *
   * Valinnainen eika oletus, koska linkki joka osoittaa olemattomaan
   * ankkuriin on huonompi kuin ei linkkia lainkaan: nappaimistokayttaja
   * painaa sita ja mitaan ei tapahdu. Sivu, joka antaa taman, antaa
   * myos kohteen.
   */
  ohitaKohde?: string;
};

/** Avausanimaation porrastusindeksi, ks. globals.css .fsnav.on. */
const porras = (i: number) => ({ "--i": i }) as CSSProperties;

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export default function FullscreenNav({
  links,
  ctaHref,
  ctaLabel,
  logoHref,
  anchorBase = "",
  ohitaKohde,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  /** Vierityslukon aiemmat arvot, jotta lukko voidaan purkaa synkronisesti. */
  const lockRef = useRef<{ overflow: string; pad: string } | null>(null);
  const panelId = useId();
  /* Nykyisen sivun rivi ei ole linkki: se palaa sinisena eika reagoi. */
  const polku = usePathname();
  const onNyt = (href: string) => href === polku;

  const resolve = useCallback(
    (href: string) => (href.startsWith("#") ? `${anchorBase}${href}` : href),
    [anchorBase],
  );

  const unlockScroll = useCallback(() => {
    if (!lockRef.current) return;
    document.body.style.overflow = lockRef.current.overflow;
    document.body.style.paddingRight = lockRef.current.pad;
    lockRef.current = null;
  }, []);

  /** Ympyran keskipiste valikkonapin keskelle ja sade kauimpaan kulmaan,
   *  jotta valikko levittaytyy napista ja pakkautuu siihen takaisin. */
  const mittaaLahto = useCallback(() => {
    const b = btnRef.current?.getBoundingClientRect();
    const p = panelRef.current;
    if (!b || !p) return;
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const w = window.innerWidth;
    const h = window.innerHeight;
    p.style.setProperty("--fx", `${x}px`);
    p.style.setProperty("--fy", `${y}px`);
    p.style.setProperty("--fr", `${Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2}px`);
  }, []);

  const close = useCallback(() => {
    // Lukko puretaan heti, ei vasta efektin siivouksessa. Ankkurilinkkia
    // klikatessa selain hyppaa kohteeseen samassa tapahtumassa, ja jos body on
    // viela overflow: hidden, hyppy jaa tekematta eika palaa myohemmin.
    unlockScroll();
    mittaaLahto();
    setOpen(false);
    btnRef.current?.focus();
  }, [unlockScroll, mittaaLahto]);

  useEffect(() => {
    if (!open) return;

    lockRef.current = {
      overflow: document.body.style.overflow,
      pad: document.body.style.paddingRight,
    };
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", mittaaLahto);
    // Fokus ensimmaiseen linkkiin, ei taustan sulkupainikkeeseen.
    panelRef.current?.querySelector<HTMLElement>(".fsnav-in a, .fsnav-in button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", mittaaLahto);
      unlockScroll();
    };
  }, [open, close, unlockScroll, mittaaLahto]);

  const services = links.find((l) => l.menu)?.menu ?? [];

  return (
    <>
      {ohitaKohde ? (
        <a className="ohita" href={ohitaKohde}>
          Siirry sisältöön
        </a>
      ) : null}
      <nav id="nav" aria-label="Ylävalikko">
        <div className="navin">
          {/* KOKEILU, poistettavissa talta yhdelta rivilta. Ks. NavCarriers.tsx. */}
          <NavCarriers />
          {/* Logo on aria-hidden ja nimi tulee .vh-tekstista, jotta
              saavutettava nimi ja hakukoneteksti sailyvat. */}
          {logoHref ? (
            <SmartLink className="logo" href={logoHref}>
              <LogoMark />
              <span className="vh">WS Media</span>
            </SmartLink>
          ) : (
            <span className="logo">
              <LogoMark />
              <span className="vh">WS Media</span>
            </span>
          )}

          {/* Ylapalkissa on vain logo ja valikkonappi. Tarjouspyynto on
              taysvalikossa yhteystietojen yhteydessa. */}
          <button
            type="button"
            className="navtoggle"
            ref={btnRef}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label="Avaa valikko"
            onClick={() => {
              mittaaLahto();
              setOpen(true);
            }}
          >
            <span className="navtoggle-bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </nav>

      <div className={`fsnav${open ? " on" : ""}`} id={panelId} aria-hidden={!open} ref={panelRef}>
        <button
          type="button"
          className="fsnav-scrim"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
        />

        <div className="fsnav-in">
          {/* Iso haivytetty merkki taustalla. aria-hidden ja pointer-events:
              none, joten se ei vaikuta luettavuuteen eika osoittimeen. */}
          <span className="fsnav-watermark" aria-hidden="true">
            <LogoFull />
          </span>

          <div className="fsnav-top" style={porras(0)}>
            <button
              type="button"
              className="fsnav-close"
              onClick={close}
              aria-label="Sulje valikko"
            >
              {/* 34px, sama suhde nappiin (84px) kuin ennen: 26/64 = 0,41. */}
              <svg width="34" height="34" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M12 4 L6 10 L12 16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="fsnav-body">
            <nav className="fsnav-links" aria-label="Päävalikko">
              <ul>
                {links.map((l, i) => (
                  <li key={l.label} style={porras(i)}>
                    {/* Palvelut-rivi ei ole linkki: palvelut ovat jo auki
                        viereisessa sarakkeessa. */}
                    {l.menu ? (
                      <span className="fsnav-otsake">{l.label}</span>
                    ) : onNyt(l.href) ? (
                      <span className="fsnav-otsake" aria-current="page">
                        {l.label}
                      </span>
                    ) : (
                      <SmartLink
                        href={resolve(l.href)}
                        onClick={close}
                        aria-current={l.current ? "page" : undefined}
                      >
                        {l.label}
                      </SmartLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Palvelut omana sarakkeenaan, aina nakyvissa. Aiemmin tama oli
                hoverin takana Palvelut-rivilla, mika piilotti sen kosketuksella
                ja hakukoneelta yhta lailla. */}
            <div className="fsnav-sub">
              {services.map((item, i) => {
                const sisalto = (
                  <>
                    <PalveluMerkki p={item.icon} className="fsnav-merkki" />
                    <span>
                      <b>{item.label}</b>
                      <small>{item.desc}</small>
                    </span>
                  </>
                );
                return onNyt(item.href) ? (
                  <span
                    className="fsnav-subitem fsnav-nyt"
                    key={item.label}
                    style={porras(i + 1)}
                    data-p={item.icon}
                    aria-current="page"
                  >
                    {sisalto}
                  </span>
                ) : (
                  <SmartLink
                    href={resolve(item.href)}
                    className="fsnav-subitem"
                    key={item.label}
                    style={porras(i + 1)}
                    data-p={item.icon}
                    onClick={close}
                  >
                    {sisalto}
                  </SmartLink>
                );
              })}
            </div>

            <div className="fsnav-side" style={porras(3)}>
              <address className="fsnav-contact">
                <span className="fsnav-rule" aria-hidden="true" />
                {/* Valilyonnit ennen <br />:aa: ilman niita osoite luetaan
                    yhtena merkkijonona "WS Media OyKuusiniementie...". */}
                <b>{CONTACT.company}</b>{" "}
                {CONTACT.street}{" "}
                <br />
                {CONTACT.city}{" "}
                <br />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{" "}
                <br />
                <small>Y-tunnus {CONTACT.businessId}</small>
              </address>

              {/* ctaHref annetaan sivulta valmiiksi oikeana: palvelusivujen
                  lomake on samalla sivulla, tietosuojasivu osoittaa etusivulle.
                  Sita ei siis prefiksoida anchorBasella. */}
              <SmartLink className="btn fsnav-cta" href={ctaHref} onClick={close}>
                {ctaLabel}
              </SmartLink>

              <a className="fsnav-call" href={CONTACT.phoneHref}>
                <span className="fsnav-callico" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6.2 3.5 L8.2 3.5 L9.3 6.6 L7.9 7.7 a9 9 0 0 0 4.4 4.4 L13.4 10.7 L16.5 11.8 L16.5 13.8 a1.8 1.8 0 0 1-2 1.8 A12.4 12.4 0 0 1 4.4 5.5 a1.8 1.8 0 0 1 1.8-2 Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {CONTACT.phone}
              </a>

              {/* Somekanavat yhteystietojen alla omana lohkonaan (5.10.2026).
                  Aiemmin pienet harmaat renkaat oikeassa reunassa, joita
                  ei juuri huomannut. */}
              <div className="fsnav-some">
                <p id={`${panelId}-some`}>Seuraa meitä</p>
                <ul className="fsnav-social" aria-labelledby={`${panelId}-some`}>
                  {SOCIAL.map((sm, i) => (
                    <li key={sm.label} style={porras(5 + i)}>
                      <a
                        href={sm.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${sm.label} (avautuu uuteen välilehteen)`}
                        title={sm.label}
                        data-some={sm.icon}
                      >
                        <SocialIcon name={sm.icon} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
