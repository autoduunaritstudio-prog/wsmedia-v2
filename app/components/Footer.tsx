import { LogoMark } from "./Logo";
import SmartLink from "./SmartLink";
import SocialIcon from "./SocialIcon";
import CookieSettingsButton from "./consent/CookieSettingsButton";
import { CONTACT, SOCIAL, ROUTES } from "./site-data";

/**
 * Footerin linkki on joko tavallinen osoite tai toiminto. Toimintovariantti on
 * olemassa evasteasetuksia varten: se avaa bannerin uudelleen eika navigoi.
 */
export type FooterLink =
  | { label: string; href: string }
  | { label: string; action: "consent" };

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

type Props = {
  intro: string;
  columns: FooterColumn[];
  base: string;
  /** Mockupit eroavat: etusivulla brandiotsikko on h4, alasivulla h2. */
  brandHeading?: "h2" | "h4";
};

/**
 * RAKENNE on alan vakiomalli:
 *   brandilohko (logo, lupaus, some) | linkkisarakkeet | yhteystiedot
 *   ------------------------------------------------------------------
 *   lakirivi: copyright ja Y-tunnus vasemmalla, lakilinkit oikealla
 *
 * Tietosuojaseloste ja evasteasetukset kuuluvat lakiriville eivatka
 * linkkisarakkeeseen: ne ovat velvoitteita eivatka navigaatiota, ja
 * kayttaja etsii ne aina footerin alalaidasta.
 */
export default function Footer({ intro, columns, base, brandHeading = "h4" }: Props) {
  const Brand = brandHeading;
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <span className="footer-mark" aria-hidden="true">
              <LogoMark />
            </span>
            <Brand>WS Media</Brand>
            <p>{intro}</p>
            <ul className="foot-social">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <SocialIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {columns.map((col) => (
            <div className="foot-col" key={col.title}>
              <h4>{col.title}</h4>
              {col.links.map((l) =>
                "action" in l ? (
                  <CookieSettingsButton key={l.label} label={l.label} />
                ) : (
                  <SmartLink href={l.href} key={l.label}>
                    {l.label}
                  </SmartLink>
                ),
              )}
            </div>
          ))}

          <div className="foot-col">
            <h4>Yhteystiedot</h4>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <address>
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </address>
          </div>
        </div>

        <div className="foot-base">
          <span>{base}</span>
          <span className="foot-legal">
            <SmartLink href={ROUTES.tietosuoja}>Tietosuojaseloste</SmartLink>
            <CookieSettingsButton label="Evästeasetukset" />
          </span>
        </div>
      </div>
    </footer>
  );
}
