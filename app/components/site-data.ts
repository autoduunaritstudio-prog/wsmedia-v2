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
  meista: "/meista",
  toihin: "/toihin-meille",
  tietosuoja: "/tietosuoja",
  laskutus: "/laskutustiedot",
  yhteystiedot: "/yhteystiedot",
  palvelut: "/#palvelut",
  prosessi: "/#prosessi",
  yhteys: "/yhteystiedot",
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
  icon: "video" | "site" | "design" | "event" | "seo";
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
    icon: "design",
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
  { href: ROUTES.meista, label: "Meistä" },
  { href: ROUTES.toihin, label: "Töihin meille" },
  { href: ROUTES.yhteystiedot, label: "Yhteystiedot" },
  { href: ROUTES.laskutus, label: "Laskutus" },
];

/** Yhteystiedot yhdessa paikassa: taysvalikko ja tietosuojasivu kayttavat samoja. */
export const CONTACT = {
  company: "WS Media Oy",
  street: "Kuusiniementie 8 F",
  city: "02710 Espoo",
  email: "info@wsmedia.fi",
  phone: "040 564 8770",
  phoneHref: "tel:+358405648770",
  businessId: "3615084-4",
};

/** Some-kanavat. Avautuvat uuteen valilehteen. */
export type SocialLink = { href: string; label: string; icon: "instagram" | "tiktok" | "linkedin" | "kartta" };

export const SOCIAL: SocialLink[] = [
  { href: "https://www.instagram.com/wsmedia.fi/", label: "Instagram", icon: "instagram" },
  { href: "https://www.tiktok.com/@wsmedia.fi", label: "TikTok", icon: "tiktok" },
  { href: "https://fi.linkedin.com/company/ws-media-oy", label: "LinkedIn", icon: "linkedin" },
  /* Google-yritysprofiili: sijainti, aukioloajat ja arvostelut. */
  { href: "https://www.google.com/maps?cid=17434529617661064987", label: "Google-profiili", icon: "kartta" },
];

/**
 * Etusivun footer. Ankkurit ovat tarkoituksella ilman /-etuliitetta: footer
 * on vain etusivulla, joten #prosessi vierittaa samalla sivulla sen sijaan etta
 * kaynnistaisi reittinavigaation.
 */
export const HOME_FOOTER: FooterColumn[] = [
  {
    title: "Palvelut",
    links: [
      { href: ROUTES.lyhytvideot, label: "Lyhytvideot" },
      { href: ROUTES.verkkosivut, label: "Verkkosivut" },
      { href: ROUTES.seo, label: "Hakukoneoptimointi" },
      { href: ROUTES.graafinen, label: "Graafinen suunnittelu" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: "#referenssit", label: "Referenssit" },
      { href: ROUTES.toihin, label: "Töihin meille" },
      { href: ROUTES.yhteys, label: "Ota yhteyttä" },
      { href: ROUTES.laskutus, label: "Laskutustiedot" },
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
      { href: ROUTES.graafinen, label: "Graafinen suunnittelu" },
    ],
  },
  {
    title: "Yritys",
    links: [
      { href: ROUTES.meista, label: "Meistä" },
      { href: "/#referenssit", label: "Referenssit" },
      { href: ROUTES.toihin, label: "Töihin meille" },
      { href: ROUTES.yhteys, label: "Ota yhteyttä" },
      { href: ROUTES.laskutus, label: "Laskutustiedot" },
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
    ],
  },
  {
    title: "Verkkosivut",
    links: [
      { href: "/verkkosivut#hinnoittelu", label: "Verkkosivujen hinta" },
      { href: "/verkkosivut#sisalto", label: "Palvelun sisältö" },
      { href: "/verkkosivut#hakukoneoptimointi", label: "Hakukoneoptimoidut sivut" },
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
      { href: ROUTES.yhteys, label: "Ota yhteyttä" },
      { href: ROUTES.laskutus, label: "Laskutustiedot" },
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
    ],
  },
  {
    title: "Hakukoneoptimointi",
    links: [
      { href: "/hakukoneoptimointi#hinnoittelu", label: "Hakukoneoptimoinnin hinta" },
      { href: "/hakukoneoptimointi#sisalto", label: "Palvelun sisältö" },
      { href: "/hakukoneoptimointi#mittarit", label: "Mittarit ja raportointi" },
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
      { href: ROUTES.yhteys, label: "Ota yhteyttä" },
      { href: ROUTES.laskutus, label: "Laskutustiedot" },
      { href: ROUTES.tietosuoja, label: "Tietosuojaseloste" },
      { action: "consent", label: "Evästeasetukset" },
    ],
  },
];
