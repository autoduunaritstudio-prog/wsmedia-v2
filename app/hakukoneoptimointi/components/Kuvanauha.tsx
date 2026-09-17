import Image from "next/image";

/**
 * TAYSLEVEA KUVAKAISTA JOKA SULAA SEURAAVAAN OSIOON.
 *
 * Kaista ei paaty viivaan eika reunaan vaan repaleiseen naamioon,
 * jolloin kuva nayttaa liukenevan alla olevaan osioon. Naamio on
 * rasteroitu kerran data-URIin (ks. .sulaa globals.css:ssa): elava
 * feDisplacementMap piirtaisi koko suodinalueen uudelleen joka
 * kehyksessa paasaikeessa, mika nykii keskihintaisella laitteella.
 * Valmiin naamion kanssa hinta on sama kuin tavallisella liukuvarilla.
 *
 * KUVA ON TARKOITUKSELLA VARILLINEN eika tritonissa. Jos kaikki sivun
 * kuvat kasiteltaisiin samalla suotimella, lopputulos olisi taas
 * yhdenmukainen tavalla joka lukee suodattimena eika valintana.
 * Varillinen kuva tummennettuna toimii varikenttana, ja tritoni
 * varataan pienemmille kuville osioiden sisalla.
 *
 * priority vain jos kaista on ensimmaisessa nakymassa: muuten se
 * kilpailisi heron LCP-elementin kanssa.
 */
export default function Kuvanauha({
  src,
  alt,
  kicker,
  korostus,
  korkeus = "58vh",
  priority,
  duo,
  sulaa = true,
}: {
  src: string;
  alt: string;
  kicker?: string;
  korostus?: string;
  korkeus?: string;
  priority?: boolean;
  /** Tritonisuodin paalle: kuva sivun varimaailmaan. */
  duo?: boolean;
  sulaa?: boolean;
}) {
  return (
    <div
      className={
        "kuva taysleveys " + (duo ? "duo" : "himmea") + (sulaa ? " sulaa" : "")
      }
      style={{ height: korkeus }}
    >
      <Image src={src} alt={alt} fill sizes="100vw" priority={priority} />
      {kicker ? (
        <div className="kuva-teksti">
          <p>
            {kicker}
            {korostus ? <b> {korostus}</b> : null}
          </p>
        </div>
      ) : null}
    </div>
  );
}
