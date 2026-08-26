import type { ServiceMenuItem } from "./site-data";

/**
 * Viivatyyliset ikonit palveluvalikkoon. Sama linja kuin taustakuviossa
 * (bdSvg): ohut veto, ei tayttoa, geometrinen muoto.
 */
export default function MenuIcon({ name }: { name: ServiceMenuItem["icon"] }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "video":
      // Pystyvideo ja toistokolmio
      return (
        <svg {...common}>
          <rect x="6" y="2.5" width="8" height="15" rx="2" />
          <path d="M8.9 8.4 L12.1 10 L8.9 11.6 Z" />
        </svg>
      );
    case "site":
      // Selainikkuna, osoitepalkki ja sisaltorivit
      return (
        <svg {...common}>
          <rect x="2.5" y="4" width="15" height="12" rx="2" />
          <path d="M2.5 7.6 H17.5" />
          <path d="M5.6 10.8 H11" />
          <path d="M5.6 13.2 H9" />
        </svg>
      );
    case "event":
      // Trussi, ripustukset ja lava
      return (
        <svg {...common}>
          <path d="M3 4.6 H17" />
          <path d="M6.8 4.6 V7.4" />
          <path d="M13.2 4.6 V7.4" />
          <circle cx="6.8" cy="8.5" r="1.1" />
          <circle cx="13.2" cy="8.5" r="1.1" />
          <path d="M4 15.6 H16" />
          <path d="M7.4 15.6 L8.6 12.2 H11.4 L12.6 15.6" />
        </svg>
      );
    case "seo":
      // Suurennuslasi ja nouseva kayra
      return (
        <svg {...common}>
          <circle cx="8.8" cy="8.8" r="5.3" />
          <path d="M12.7 12.7 L17 17" />
          <path d="M6.4 10.3 L8.2 8.2 L9.8 9.4 L11.6 6.9" />
        </svg>
      );
  }
}
