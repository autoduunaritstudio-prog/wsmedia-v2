import type { NavLink } from "./Nav";
import type { FooterColumn } from "./Footer";

/** Etusivun navigaatio: ankkurilinkit samalle sivulle. */
export const HOME_NAV: NavLink[] = [
  { href: "#palvelut", label: "Palvelut" },
  { href: "#tyot", label: "Työnäytteet" },
  { href: "#prosessi", label: "Prosessi" },
  { href: "#paketit", label: "Hinnoittelu" },
];

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
    ],
  },
];

/** Alasivujen navigaatio: oikeat sivupolut. */
export const SUBPAGE_NAV: NavLink[] = [
  { href: "/lyhytvideot", label: "Lyhytvideot" },
  { href: "/verkkosivut", label: "Verkkosivut" },
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
      { href: "/tietosuojaseloste", label: "Tietosuojaseloste" },
    ],
  },
];
