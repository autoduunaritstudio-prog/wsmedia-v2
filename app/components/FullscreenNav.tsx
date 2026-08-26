"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { LogoFull, LogoMark } from "./Logo";
import MenuIcon from "./MenuIcon";
import SmartLink from "./SmartLink";
import { CONTACT, type NavLink } from "./site-data";

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
};

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export default function FullscreenNav({
  links,
  ctaHref,
  ctaLabel,
  logoHref,
  anchorBase = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  /** Vierityslukon aiemmat arvot, jotta lukko voidaan purkaa synkronisesti. */
  const lockRef = useRef<{ overflow: string; pad: string } | null>(null);
  const panelId = useId();

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

  const close = useCallback(() => {
    // Lukko puretaan heti, ei vasta efektin siivouksessa. Ankkurilinkkia
    // klikatessa selain hyppaa kohteeseen samassa tapahtumassa, ja jos body on
    // viela overflow: hidden, hyppy jaa tekematta eika palaa myohemmin.
    unlockScroll();
    setOpen(false);
    setShowServices(false);
    btnRef.current?.focus();
  }, [unlockScroll]);

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
    // Fokus ensimmaiseen linkkiin, ei taustan sulkupainikkeeseen.
    panelRef.current?.querySelector<HTMLElement>(".fsnav-in a, .fsnav-in button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open, close, unlockScroll]);

  const services = links.find((l) => l.menu)?.menu ?? [];

  return (
    <>
      <nav id="nav" aria-label="Ylävalikko">
        <div className="navin">
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
            onClick={() => setOpen(true)}
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
          <div className="fsnav-top">
            <SmartLink className="fsnav-logo" href="/" onClick={close}>
              <LogoFull />
              <span className="vh">WS Media</span>
            </SmartLink>
            <button type="button" className="fsnav-close" onClick={close} aria-label="Sulje valikko">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 3 L15 15 M15 3 L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="fsnav-body">
            <nav className="fsnav-links" aria-label="Päävalikko">
              <ul onMouseLeave={() => setShowServices(false)}>
                {links.map((l) => (
                  <li key={l.label} onMouseEnter={() => setShowServices(Boolean(l.menu))}>
                    <SmartLink
                      href={resolve(l.href)}
                      onClick={close}
                      aria-current={l.current ? "page" : undefined}
                    >
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="fsnav-side">
              <div className={`fsnav-sub${showServices ? " on" : ""}`}>
                <p className="fsnav-subt">Palvelut</p>
                {services.map((item) => (
                  <SmartLink
                    href={resolve(item.href)}
                    className="fsnav-subitem"
                    key={item.label}
                    onClick={close}
                  >
                    <span className="fsnav-subico">
                      <MenuIcon name={item.icon} />
                    </span>
                    <span>
                      <b>{item.label}</b>
                      <small>{item.desc}</small>
                    </span>
                  </SmartLink>
                ))}
              </div>

              <address className="fsnav-contact">
                <b>{CONTACT.company}</b>
                {CONTACT.street}
                <br />
                {CONTACT.city}
                <br />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                <br />
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                <br />
                <small>Y-tunnus {CONTACT.businessId}</small>
              </address>

              {/* ctaHref annetaan sivulta valmiiksi oikeana: palvelusivujen lomake on
                  samalla sivulla (#tarjous), tietosuojasivu osoittaa etusivulle.
                  Sita ei siis saa prefiksoida anchorBasella. */}
              <SmartLink className="btn fsnav-cta" href={ctaHref} onClick={close}>
                {ctaLabel}
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
