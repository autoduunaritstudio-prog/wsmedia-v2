import type { SocialLink } from "./site-data";

/**
 * Viivatyyliset some-ikonit. Sama linja kuin muualla sivustolla: ohut veto,
 * ei tayttoa, vari periytyy currentColorin kautta.
 */
export default function SocialIcon({ name }: { name: SocialLink["icon"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="14" height="14" rx="4.2" />
          <circle cx="10" cy="10" r="3.4" />
          <circle cx="14.1" cy="5.9" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M12.4 2.8 v8.9 a3.3 3.3 0 1 1-3.3-3.3" />
          <path d="M12.4 2.8 a4.2 4.2 0 0 0 4.2 4.1" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="14" height="14" rx="2.4" />
          <path d="M6.6 8.6 V14" />
          <circle cx="6.6" cy="6.2" r="0.9" fill="currentColor" stroke="none" />
          <path d="M9.6 14 V8.6" />
          <path d="M9.6 10.9 a2.3 2.3 0 0 1 4.6 0 V14" />
        </svg>
      );
  }
}
