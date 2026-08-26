import type { FooterColumn } from "./Footer";

/**
 * Navin Palvelut-pudotusvalikko. Ankkurit osoittavat etusivun Palvelut-osioon,
 * joten valikko kuuluu vain etusivun naviin (HOME_NAV). Jos se lisataan
 * alasivujen naviin, ankkurit on kirjoitettava muotoon /#palvelut.
 */
export type NavLink = {
  href: string;
  label: string;
  current?: boolean;
  /** Kun annettu, rivi paljastaa taysvalikossa palvelujen alavalikon. */
  menu?: ServiceMenuItem[];
};

export type ServiceMenuItem = {
  href: string;
  label: string;
  desc: string;
  icon: "video" | "site" | "event" | "seo";
};

export const SERVICE_MENU: ServiceMenuItem[] = [
  {
    href: "/lyhytvideot",
    label: "Lyhytvideot",
    desc: "TikTok, Reels ja Shorts avaimet käteen",
    icon: "video",
  },
  {
    href: "#palvelut",
    label: "Verkkosivut",
    desc: "Nopeat, hakukoneoptimoidut sivustot",
    icon: "site",
  },
  {
    href: "#palvelut",
    label: "Tapahtumat",
    desc: "Suunnittelu, toteutus ja taltiointi",
    icon: "event",
  },
  {
    href: "#palvelut",
    label: "SEO-optimointi",
    desc: "Näkyvyys niissä hauissa jotka tuovat liidit",
    icon: "seo",
  },
];

/** Etusivun navigaatio: ankkurilinkit samalle sivulle. */
export const HOME_NAV: NavLink[] = [
  { href: "#palvelut", label: "Palvelut", menu: SERVICE_MENU },
  { href: "#tyot", label: "Työnäytteet" },
  { href: "#prosessi", label: "Prosessi" },
  { href: "#paketit", label: "Hinnoittelu" },
];

/**
 * Taysvalikon paalinkit. Sama lista kaikilla sivuilla; ankkurit (#-alkuiset)
 * osoittavat etusivun osioihin, joten alasivut antavat FullscreenNaville
 * anchorBase="/" ja etusivu jattaa sen pois.
 */
export const OVERLAY_NAV: NavLink[] = [
  { href: "/", label: "Etusivu" },
  { href: "#palvelut", label: "Palvelut", menu: SERVICE_MENU },
  { href: "#tyot", label: "Työnäytteet" },
  { href: "#prosessi", label: "Prosessi" },
  { href: "#paketit", label: "Hinnoittelu" },
  { href: "/yhteystiedot", label: "Yhteystiedot" },
];

/** Yhteystiedot yhdessa paikassa: taysvalikko ja tietosuojasivu kayttavat samoja. */
export const CONTACT = {
  company: "WS Media Oy",
  street: "Kuusiniementie 8 A 3",
  city: "02710 Espoo",
  email: "info@wsmedia.fi",
  phone: "040 564 8770",
  phoneHref: "tel:+358405648770",
  businessId: "3615084-4",
};

export const HOME_FOOTER: FooterColumn[] = [
  {
    title: "Palvelut",
    links: [
      { href: "#", label: "Lyhytvideot" },
      { href: "#", label: "TikTok-videot" },
      { href: "#", label: "Instagram Reels" },
      { href: "#", label: "YouTube Shorts" },
      { href: "#", label: "Verkkosivut" },
      { href: "#", label: "Tapahtumat" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: "#", label: "Työnäytteet" },
      { href: "#", label: "Prosessi" },
      { href: "#", label: "Hinnoittelu" },
      { href: "#", label: "Blogi" },
      { href: "#", label: "Ota yhteyttä" },
      { href: "/tietosuoja", label: "Tietosuojaseloste" },
      { action: "consent", label: "Evästeasetukset" },
    ],
  },
];

/** Alasivujen navigaatio: oikeat sivupolut. */
export const SUBPAGE_NAV: NavLink[] = [
  { href: "/lyhytvideot", label: "Lyhytvideot" },
  { href: "/verkkosivut", label: "Verkkosivut" },
  { href: "/hakukoneoptimointi", label: "Hakukoneoptimointi" },
  { href: "/tapahtumat", label: "Tapahtumat" },
  { href: "/tyonaytteet", label: "Työnäytteet" },
  { href: "/hinnoittelu", label: "Hinnoittelu" },
];

export const SUBPAGE_FOOTER: FooterColumn[] = [
  {
    title: "Lyhytvideot",
    links: [
      { href: "/lyhytvideot", label: "Lyhytvideotuotanto" },
      { href: "/lyhytvideot/tiktok", label: "TikTok-videot" },
      { href: "/lyhytvideot/instagram-reels", label: "Instagram Reels" },
      { href: "/lyhytvideot/youtube-shorts", label: "YouTube Shorts" },
      { href: "/lyhytvideot/linkedin", label: "LinkedIn-videot" },
    ],
  },
  {
    title: "Muut palvelut",
    links: [
      { href: "/verkkosivut", label: "Verkkosivut" },
      { href: "/hakukoneoptimointi", label: "Hakukoneoptimointi" },
      { href: "/meta-mainonta", label: "Meta-mainonta" },
      { href: "/tapahtumat", label: "Tapahtumat" },
      { href: "/hinnoittelu", label: "Hinnoittelu" },
      { href: "/blogi", label: "Blogi" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: "/yhteystiedot", label: "Ota yhteyttä" },
      { href: "/tietosuoja", label: "Tietosuojaseloste" },
      { action: "consent", label: "Evästeasetukset" },
    ],
  },
];

/** Verkkosivut-alasivun footer. */
export const VERKKOSIVUT_FOOTER: FooterColumn[] = [
  {
    title: "Palvelut",
    links: [
      { href: "/lyhytvideot", label: "Lyhytvideot" },
      { href: "/verkkosivut", label: "Verkkosivut yritykselle" },
      { href: "/verkkosivut#toteutustapa", label: "Räätälöidyt verkkosivut" },
      { href: "/verkkosivut#hakukoneoptimointi", label: "Hakukoneoptimointi" },
      { href: "/tapahtumat", label: "Tapahtumat" },
    ],
  },
  {
    title: "Verkkosivut",
    links: [
      { href: "/verkkosivut#hinnoittelu", label: "Verkkosivujen hinta" },
      { href: "/verkkosivut#prosessi", label: "Prosessi" },
      { href: "/verkkosivut#ukk", label: "Usein kysyttyä" },
      { href: "/verkkosivut/espoo", label: "Verkkosivut Espoo" },
      { href: "/verkkosivut/helsinki", label: "Verkkosivut Helsinki" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: "/tyonaytteet", label: "Työnäytteet" },
      { href: "/hinnoittelu", label: "Hinnoittelu" },
      { href: "/blogi", label: "Blogi" },
      { href: "/yhteystiedot", label: "Ota yhteyttä" },
      { href: "/tietosuoja", label: "Tietosuojaseloste" },
      { action: "consent", label: "Evästeasetukset" },
    ],
  },
];

/** Hakukoneoptimointi-alasivun footer. */
export const SEO_FOOTER: FooterColumn[] = [
  {
    title: "Palvelut",
    links: [
      { href: "/lyhytvideot", label: "Lyhytvideot" },
      { href: "/verkkosivut", label: "Verkkosivut yritykselle" },
      { href: "/hakukoneoptimointi", label: "Hakukoneoptimointi" },
      { href: "/hakukoneoptimointi#paikallinen", label: "Paikallinen SEO" },
      { href: "/tapahtumat", label: "Tapahtumat" },
    ],
  },
  {
    title: "Hakukoneoptimointi",
    links: [
      { href: "/hakukoneoptimointi#hinnoittelu", label: "Hakukoneoptimoinnin hinta" },
      { href: "/hakukoneoptimointi#sisalto", label: "Palvelun sisältö" },
      { href: "/hakukoneoptimointi#mittarit", label: "Mittarit ja raportointi" },
      { href: "/hakukoneoptimointi#ukk", label: "Usein kysyttyä" },
      { href: "/hakukoneoptimointi/espoo", label: "Hakukoneoptimointi Espoo" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: "/tyonaytteet", label: "Työnäytteet" },
      { href: "/hinnoittelu", label: "Hinnoittelu" },
      { href: "/blogi", label: "Blogi" },
      { href: "/yhteystiedot", label: "Ota yhteyttä" },
      { href: "/tietosuoja", label: "Tietosuojaseloste" },
      { action: "consent", label: "Evästeasetukset" },
    ],
  },
];
