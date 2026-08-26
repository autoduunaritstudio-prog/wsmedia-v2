import FullscreenNav from "./FullscreenNav";
import SmartLink from "./SmartLink";
import type { ServiceMenuItem } from "./site-data";

export type NavLink = {
  href: string;
  label: string;
  current?: boolean;
  /** Kun annettu, rivi paljastaa taysvalikossa palvelujen alavalikon. */
  menu?: ServiceMenuItem[];
};

type Props = {
  /** Taysvalikon paalinkit. */
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
  /** Kun annettu, logo on linkki. Etusivu jattaa taman pois, jolloin logo on span. */
  logoHref?: string;
  /** "/" alasivuilla, jotta valikon #-ankkurit osoittavat etusivulle. */
  anchorBase?: string;
};

/**
 * Ylapalkki on tarkoituksella minimaalinen: logo, valikkopainike ja CTA.
 * Kaikki navigointi on taysvalikossa (FullscreenNav), joten palkki pysyy
 * samana joka sivulla eika kasva sivumaaran myota.
 */
export default function Nav({ links, ctaHref, ctaLabel, logoHref, anchorBase }: Props) {
  return (
    // Kaksi navigaatiomaamerkkia: ylapalkki ja taysvalikko. Molemmilla on
    // oma nimi, jotta ruudunlukija erottaa ne toisistaan.
    <nav id="nav" aria-label="Ylävalikko">
      <div className="navin">
        {logoHref ? (
          <SmartLink className="logo" href={logoHref}>
            WS Media
          </SmartLink>
        ) : (
          <span className="logo">WS Media</span>
        )}

        <FullscreenNav links={links} anchorBase={anchorBase} />

        <SmartLink className="navcta" href={ctaHref}>
          {ctaLabel}
        </SmartLink>
      </div>
    </nav>
  );
}
