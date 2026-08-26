import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Sisaiset polut next/linkilla (esilataus ja client-navigaatio), ankkurit ja
 * ulkoiset osoitteet tavallisena a-elementtina. Nav ja Footer saavat hrefit
 * datana, jossa ankkurit ja polut ovat sekaisin, joten valinta on tehtava
 * ajossa eika kirjoitushetkella.
 */
export default function SmartLink({ href, children, ...rest }: Props) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
