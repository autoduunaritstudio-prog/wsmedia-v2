import PalvelutDropdown from "./PalvelutDropdown";
import SmartLink from "./SmartLink";
import type { ServiceMenuItem } from "./site-data";

export type NavLink = {
  href: string;
  label: string;
  current?: boolean;
  /** Kun annettu, linkki avaa pudotusvalikon sen sijaan etta navigoisi. */
  menu?: ServiceMenuItem[];
};

type Props = {
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
  /** Kun annettu, logo on linkki. Etusivu jattaa taman pois, jolloin logo on span. */
  logoHref?: string;
};

export default function Nav({ links, ctaHref, ctaLabel, logoHref }: Props) {
  return (
    <nav id="nav">
      <div className="navin">
        {logoHref ? (
          <SmartLink className="logo" href={logoHref}>
            WS Media
          </SmartLink>
        ) : (
          <span className="logo">WS Media</span>
        )}
        <div className="navlinks">
          {links.map((l) =>
            l.menu ? (
              <PalvelutDropdown key={l.label} label={l.label} items={l.menu} />
            ) : (
              <SmartLink key={l.href} href={l.href} aria-current={l.current ? "page" : undefined}>
                {l.label}
              </SmartLink>
            ),
          )}
          <SmartLink className="navcta" href={ctaHref}>
            {ctaLabel}
          </SmartLink>
        </div>
      </div>
    </nav>
  );
}
