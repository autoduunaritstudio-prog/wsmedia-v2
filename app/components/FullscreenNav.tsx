"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { LogoFull } from "./Logo";
import MenuIcon from "./MenuIcon";
import SmartLink from "./SmartLink";
import type { NavLink } from "./Nav";
import { CONTACT } from "./site-data";

/**
 * Taysvalikko: ylapalkin valikkopainike avaa koko ruudun peittavan overlayn.
 *
 * Yksi komponentti kaikilla sivuilla. Ainoa sivukohtainen ero on anchorBase:
 * ankkurilinkit osoittavat etusivun osioihin, joten alasivuilla ne on
 * kirjoitettava muotoon /#palvelut.
 *
 * Saavutettavuus:
 * - Painikkeessa aria-expanded ja aria-controls, overlayssa aria-hidden
 *   suljettuna
 * - Suljettuna overlay on visibility: hidden, joten sen linkit eivat ole
 *   tab-jarjestyksessa eika aria-hidden peita fokusoitavia elementteja
 * - Fokusansa: Tab kiertaa vain valikon sisalla niin kauan kuin se on auki
 * - Escape ja klikkaus taustaan sulkevat, ja fokus palaa valikkopainikkeeseen
 * - Sivun vieritys lukitaan valikon ollessa auki
 */

type Props = {
  links: NavLink[];
  /** "/" alasivuilla, jotta #-ankkurit osoittavat etusivulle. Etusivulla "". */
  anchorBase?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export default function FullscreenNav({ links, anchorBase = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const resolve = useCallback(
    (href: string) => (href.startsWith("#") ? `${anchorBase}${href}` : href),
    [anchorBase],
  );

  const close = useCallback(() => {
    setOpen(false);
    setShowServices(false);
    btnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    // Sivun vieritys lukkoon, mutta pidetaan vierityspalkin tila ennallaan
    // jotta sisalto ei hyppaa sivusuunnassa.
    const prevOverflow = document.body.style.overflow;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevPad = document.body.style.paddingRight;
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
    // Fokus valikon ensimmaiseen kohteeseen kun se avataan.
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open, close]);

  const services = links.find((l) => l.menu)?.menu ?? [];

  return (
    <>
      <button
        type="button"
        className="navtoggle"
        ref={btnRef}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        <span className="navtoggle-bars" aria-hidden="true">
          <i />
          <i />
        </span>
        Valikko
      </button>

      <div
        className={`fsnav${open ? " on" : ""}`}
        id={panelId}
        aria-hidden={!open}
        ref={panelRef}
      >
        {/* Tausta sulkee klikatessa; itse sisalto on tamän paalla. */}
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
                <path
                  d="M3 3 L15 15 M15 3 L3 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="fsnav-body">
            <nav className="fsnav-links" aria-label="Päävalikko">
              <ul onMouseLeave={() => setShowServices(false)}>
                {links.map((l) => (
                  <li
                    key={l.label}
                    onMouseEnter={() => setShowServices(Boolean(l.menu))}
                  >
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
