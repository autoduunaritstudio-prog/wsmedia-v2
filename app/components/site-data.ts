import type { FooterColumn } from "./Footer";

/**
 * Olemassa olevat reitit. Naiden ulkopuolelle ei saa linkittaa: kaikki muu
 * 404aa. Suunniteltujen mutta toteuttamattomien sivujen (Tapahtumat,
 * Tyonaytteet, Hinnoittelu, Yhteystiedot, Blogi) tilalla kaytetaan etusivun
 * osioita, jotta yksikaan linkki ei osoita tyhjaan.
 */
export const ROUTES = {
  etusivu: "/",
  lyhytvideot: "/lyhytvideot",
  verkkosivut: "/verkkosivut",
  seo: "/hakukoneoptimointi",
  graafinen: "/graafinen-suunnittelu",
  toihin: "/toihin-meille",
  tietosuoja: "/tietosuoja",
  /** Sivua ei viela ole -> etusivun Palvelut-osio. */
  tapahtumat: "/#palvelut",
  palvelut: "/#palvelut",
  tyonaytteet: "/#tyot",
  prosessi: "/#prosessi",
  hinnoittelu: "/#paketit",
  yhteys: "/#lomake",
} as const;

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
    href: ROUTES.lyhytvideot,
    label: "Lyhytvideot",
    desc: "TikTok, Reels ja Shorts avaimet käteen",
    icon: "video",
  },
  {
    href: ROUTES.verkkosivut,
    label: "Verkkosivut",
    desc: "Nopeat, hakukoneoptimoidut sivustot",
    icon: "site",
  },
  {
    href: ROUTES.graafinen,
    label: "Graafinen suunnittelu",
    desc: "Yritysilme, painotuotteet ja teippaukset",
    icon: "site",
  },
  {
    // Ankkuri, ei ROUTES.tapahtumat: FullscreenNav prefiksoi #-alkuiset
    // hrefit anchorBasella, jolloin alasivuilta tulee /#palvelut ja
    // etusivulla linkki vierittaa samalla sivulla.
    href: "#palvelut",
    label: "Tapahtumat",
    desc: "Suunnittelu, toteutus ja taltiointi",
    icon: "event",
  },
  {
    href: ROUTES.seo,
    label: "SEO-optimointi",
    desc: "Näkyvyys niissä hauissa jotka tuovat liidit",
    icon: "seo",
  },
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
  { href: ROUTES.toihin, label: "Töihin meille" },
  // Yhteystiedot-sivua ei ole; ankkuri etusivun lomakkeeseen.
  { href: "#lomake", label: "Yhteystiedot" },
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

/** Some-kanavat. Avautuvat uuteen valilehteen. */
export type SocialLink = { href: string; label: string; icon: "instagram" | "tiktok" | "linkedin" };

export const SOCIAL: SocialLink[] = [
  { href: "https://www.instagram.com/wsmedia.fi/", label: "Instagram", icon: "instagram" },
  { href: "https://www.tiktok.com/@wsmedia.fi", label: "TikTok", icon: "tiktok" },
  { href: "https://fi.linkedin.com/company/ws-media-oy", label: "LinkedIn", icon: "linkedin" },
];

/**
 * Etusivun footer. Ankkurit ovat tarkoituksella ilman /-etuliitetta: footer
 * on vain etusivulla, joten #tyot vierittaa samalla sivulla sen sijaan etta
 * kaynnistaisi reittinavigaation.
 */
export const HOME_FOOTER: FooterColumn[] = [
  {
    title: "Palvelut",
    links: [
      { href: ROUTES.lyhytvideot, label: "Lyhytvideot" },
      // TikTok, Reels ja Shorts kasitellaan lyhytvideosivulla; omia
      // alasivuja ei ole, joten kaikki kolme osoittavat sinne.
      { href: ROUTES.lyhytvideot, label: "TikTok-videot" },
      { href: ROUTES.lyhytvideot, label: "Instagram Reels" },
      { href: ROUTES.lyhytvideot, label: "YouTube Shorts" },
      { href: ROUTES.verkkosivut, label: "Verkkosivut" },
      { href: ROUTES.seo, label: "Hakukoneoptimointi" },
      { href: "#palvelut", label: "Tapahtumat" },
    ],
  },
  {
    title: "Töihin meille",
    links: [
      { href: "/toihin-meille#roolit", label: "Keitä etsimme" },
      { href: "/toihin-meille#tyomalli", label: "Freelancerina tai työsuhteessa" },
      { href: "/toihin-meille#prosessi", label: "Näin haku etenee" },
      { href: ROUTES.toihin, label: "Jätä hakemus" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: "#tyot", label: "Työnäytteet" },
      { href: "#prosessi", label: "Prosessi" },
      { href: "#paketit", label: "Hinnoittelu" },
      { href: "#lomake", label: "Ota yhteyttä" },
      { href: ROUTES.tietosuoja, label: "Tietosuojaseloste" },
      { action: "consent", label: "Evästeasetukset" },
    ],
  },
];

export const SUBPAGE_FOOTER: FooterColumn[] = [
  {
    title: "Palvelut",
    links: [
      { href: ROUTES.lyhytvideot, label: "Lyhytvideot" },
      { href: ROUTES.verkkosivut, label: "Verkkosivut" },
      { href: ROUTES.seo, label: "Hakukoneoptimointi" },
      { href: ROUTES.tapahtumat, label: "Tapahtumat" },
    ],
  },
  {
    title: "Lyhytvideot",
    links: [
      { href: ROUTES.lyhytvideot, label: "Lyhytvideotuotanto" },
      { href: "/lyhytvideot#sisalto", label: "Palvelun sisältö" },
      { href: "/lyhytvideot#prosessi", label: "Prosessi" },
      { href: "/lyhytvideot#hinnoittelu", label: "Lyhytvideon hinta" },
      { href: "/lyhytvideot#ukk", label: "Usein kysyttyä" },
    ],
  },
  {
    title: "Töihin meille",
    links: [
      { href: "/toihin-meille#roolit", label: "Keitä etsimme" },
      { href: "/toihin-meille#tyomalli", label: "Freelancerina tai työsuhteessa" },
      { href: "/toihin-meille#prosessi", label: "Näin haku etenee" },
      { href: ROUTES.toihin, label: "Jätä hakemus" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: ROUTES.tyonaytteet, label: "Työnäytteet" },
      { href: ROUTES.hinnoittelu, label: "Hinnoittelu" },
      { href: ROUTES.yhteys, label: "Ota yhteyttä" },
      { href: ROUTES.tietosuoja, label: "Tietosuojaseloste" },
      { action: "consent", label: "Evästeasetukset" },
    ],
  },
];

/** Verkkosivut-alasivun footer. */
export const VERKKOSIVUT_FOOTER: FooterColumn[] = [
  {
    title: "Palvelut",
    links: [
      { href: ROUTES.lyhytvideot, label: "Lyhytvideot" },
      { href: ROUTES.verkkosivut, label: "Verkkosivut yritykselle" },
      { href: ROUTES.seo, label: "Hakukoneoptimointi" },
      { href: "/verkkosivut#toteutustapa", label: "Räätälöidyt verkkosivut" },
      { href: ROUTES.tapahtumat, label: "Tapahtumat" },
    ],
  },
  {
    title: "Verkkosivut",
    links: [
      { href: "/verkkosivut#hinnoittelu", label: "Verkkosivujen hinta" },
      { href: "/verkkosivut#prosessi", label: "Prosessi" },
      { href: "/verkkosivut#sisalto", label: "Palvelun sisältö" },
      { href: "/verkkosivut#hakukoneoptimointi", label: "Hakukoneoptimoidut sivut" },
      { href: "/verkkosivut#ukk", label: "Usein kysyttyä" },
    ],
  },
  {
    title: "Töihin meille",
    links: [
      { href: "/toihin-meille#roolit", label: "Keitä etsimme" },
      { href: "/toihin-meille#tyomalli", label: "Freelancerina tai työsuhteessa" },
      { href: "/toihin-meille#prosessi", label: "Näin haku etenee" },
      { href: ROUTES.toihin, label: "Jätä hakemus" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: ROUTES.tyonaytteet, label: "Työnäytteet" },
      { href: ROUTES.hinnoittelu, label: "Hinnoittelu" },
      { href: ROUTES.yhteys, label: "Ota yhteyttä" },
      { href: ROUTES.tietosuoja, label: "Tietosuojaseloste" },
      { action: "consent", label: "Evästeasetukset" },
    ],
  },
];

/** Hakukoneoptimointi-alasivun footer. */
export const SEO_FOOTER: FooterColumn[] = [
  {
    title: "Palvelut",
    links: [
      { href: ROUTES.lyhytvideot, label: "Lyhytvideot" },
      { href: ROUTES.verkkosivut, label: "Verkkosivut yritykselle" },
      { href: ROUTES.seo, label: "Hakukoneoptimointi" },
      { href: "/hakukoneoptimointi#paikallinen", label: "Paikallinen SEO" },
      { href: ROUTES.tapahtumat, label: "Tapahtumat" },
    ],
  },
  {
    title: "Hakukoneoptimointi",
    links: [
      { href: "/hakukoneoptimointi#hinnoittelu", label: "Hakukoneoptimoinnin hinta" },
      { href: "/hakukoneoptimointi#sisalto", label: "Palvelun sisältö" },
      { href: "/hakukoneoptimointi#mittarit", label: "Mittarit ja raportointi" },
      { href: "/hakukoneoptimointi#ukk", label: "Usein kysyttyä" },
    ],
  },
  {
    title: "Töihin meille",
    links: [
      { href: "/toihin-meille#roolit", label: "Keitä etsimme" },
      { href: "/toihin-meille#tyomalli", label: "Freelancerina tai työsuhteessa" },
      { href: "/toihin-meille#prosessi", label: "Näin haku etenee" },
      { href: ROUTES.toihin, label: "Jätä hakemus" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: ROUTES.tyonaytteet, label: "Työnäytteet" },
      { href: ROUTES.hinnoittelu, label: "Hinnoittelu" },
      { href: ROUTES.yhteys, label: "Ota yhteyttä" },
      { href: ROUTES.tietosuoja, label: "Tietosuojaseloste" },
      { action: "consent", label: "Evästeasetukset" },
    ],
  },
];
