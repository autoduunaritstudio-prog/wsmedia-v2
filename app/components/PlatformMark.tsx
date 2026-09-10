/**
 * Alustamerkit yhdessa paikassa, kahtena asuna.
 *
 * tone="line"   ohut viivapiirros joka perii varinsa currentColorista.
 *               Kaytossa verkostotaustan kelluvissa merkeissa.
 * tone="brand"  alustan oma tunnus omilla vareillaan. Kaytossa
 *               kanavakorttien taustana.
 *
 * YKSI LAHDE, EI KAHTA KOPIOTA. Samat merkit tarvitaan kahdessa
 * paikassa, ja kaksi kopiota samoista poluista paasee ajautumaan eri
 * muotoihin huomaamatta - juuri niin kavi YouTube Shortsin kanssa,
 * jonka ensimmainen versio oli piirretty muistista vaarin.
 *
 * TUNNUKSET OVAT SVG:TA, EIVAT KUVATIEDOSTOJA. Ne skaalautuvat
 * korttiin terävina millä tahansa naytolla, eika sivulle tule kolmea
 * uutta latausta. Samalla vältetaan lahdekuvien omat taustat: yksi
 * olisi ollut valkoisella, toinen harmaalla, ja tumman kortin paalla
 * ne olisivat lukeneet kolmena eri laattana.
 */

type Props = {
  id: "tiktok" | "instagram" | "youtube";
  tone?: "line" | "brand";
  className?: string;
};

/* TikTokin nuotti. Sama polku piirretaan kolmesti: syaani ja magenta
   vastakkaisiin suuntiin siirrettyina ja paamuoto niiden paalle. Juuri
   se limitys on tunnuksen tunnistettava piirre, ei nuotin muoto. */
const TT_NOTE =
  "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

/* YouTube Shortsin runko: kaksi limittaista kapselia noin 30 asteen
   kulmassa. Polku on Simple Icons -paketin youtubeshorts. */
const YT_BODY =
  "m18.931 9.99l-1.441-.601l1.717-.913a4.48 4.48 0 0 0 1.874-6.078a4.506 4.506 0 0 0-6.09-1.874L4.792 5.929a4.5 4.5 0 0 0-2.402 4.193a4.52 4.52 0 0 0 2.666 3.904c.036.012 1.442.6 1.442.6l-1.706.901a4.51 4.51 0 0 0-2.369 3.967A4.53 4.53 0 0 0 6.93 24c.725 0 1.437-.174 2.08-.508l10.21-5.406a4.49 4.49 0 0 0 2.39-4.192a4.53 4.53 0 0 0-2.678-3.904Z";
const YT_PLAY = "M9.597 15.19V8.824l6.007 3.184z";

export default function PlatformMark({ id, tone = "line", className }: Props) {
  const box = {
    className,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: "false" as const,
  };

  if (tone === "brand") {
    if (id === "tiktok") {
      return (
        <svg {...box} fill="none">
          <g>
            <path d={TT_NOTE} fill="#25f4ee" transform="translate(-1.1 -1.1)" />
            <path d={TT_NOTE} fill="#fe2c55" transform="translate(1.1 1.1)" />
            <path d={TT_NOTE} fill="#ffffff" />
          </g>
        </svg>
      );
    }
    if (id === "instagram") {
      return (
        <svg {...box} fill="none">
          <defs>
            {/* Tunnuksen liukuvari lahtee vasemmasta alakulmasta, ei
                keskelta: keltainen on kulmassa ja sininen vastakkaisella
                puolella. Keskelta lahteva liuku olisi antanut saman
                varit mutta vaarassa jarjestyksessa. */}
            <radialGradient id="wsIgGrad" cx="28%" cy="104%" r="128%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="12%" stopColor="#fdf497" />
              <stop offset="35%" stopColor="#fd5949" />
              <stop offset="62%" stopColor="#d6249f" />
              <stop offset="100%" stopColor="#285aeb" />
            </radialGradient>
          </defs>
          <rect x="0.6" y="0.6" width="22.8" height="22.8" rx="6.6" fill="url(#wsIgGrad)" />
          <g fill="none" stroke="#ffffff" strokeWidth="1.7">
            <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="4" />
            <circle cx="12" cy="12" r="3.5" />
          </g>
          <circle cx="17.3" cy="6.7" r="1.05" fill="#ffffff" />
        </svg>
      );
    }
    return (
      <svg {...box} fill="none">
        <path d={YT_BODY} fill="#ff0000" />
        <path d={YT_PLAY} fill="#ffffff" />
      </svg>
    );
  }

  /* ---- viiva-asu ---- */
  const line = {
    ...box,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinejoin: "round" as const,
  };

  if (id === "instagram") {
    return (
      <svg {...line}>
        <rect x="3" y="3" width="18" height="18" rx="5.4" />
        <circle cx="12" cy="12" r="4.3" />
        <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (id === "tiktok") {
    return (
      <svg {...line} strokeLinecap="round">
        <path d="M14.6 3.2v10.9a4.1 4.1 0 1 1-4.1-4.1" />
        <path d="M14.6 3.2a5.2 5.2 0 0 0 5.2 5.1" />
      </svg>
    );
  }
  return (
    <svg {...line}>
      <path d={YT_BODY} />
      <path d={YT_PLAY} fill="currentColor" stroke="none" />
    </svg>
  );
}
