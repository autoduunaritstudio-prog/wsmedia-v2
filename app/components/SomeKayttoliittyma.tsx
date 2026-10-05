/**
 * Instagram Reelsin ja TikTokin kayttoliittyma puhelimen paalle
 * (5.10.2026). Pelkka ulkoasu: ei lukuja, koska tykkays- ja
 * kommenttimaaria ei ole kirjattu. Kuvakkeet ovat omia viivapiirroksia,
 * eivat alustojen logoja.
 */
const Sydan = () => <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />;
const Kupla = () => <path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5z" />;
const Laheta = () => <path d="M21 4L3 11l7 2.5L12.5 20 21 4z M10 13.5L21 4" />;
const Tallenna = () => <path d="M6 3.5h12v17l-6-4.5-6 4.5z" />;
const Jaa = () => <path d="M13 5l7 6.5-7 6.5v-4C7.5 14 5 16 3.5 19 4 13 7 9.5 13 9z" />;

function Kuvake({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

export function InstagramUI({ kahva }: { kahva: string }) {
  return (
    <div className="some-ui some-ig" aria-hidden="true">
      <div className="some-yla">
        <b>Reels</b>
      </div>
      <div className="some-sivu">
        <Kuvake><Sydan /></Kuvake>
        <Kuvake><Kupla /></Kuvake>
        <Kuvake><Laheta /></Kuvake>
        <Kuvake><Tallenna /></Kuvake>
      </div>
      <div className="some-ala">
        <b>{kahva}</b>
      </div>
    </div>
  );
}

export function TikTokUI({ kahva }: { kahva: string }) {
  return (
    <div className="some-ui some-tt" aria-hidden="true">
      <div className="some-yla some-yla-tt">
        <span>Seuratut</span>
        <b>Sinulle</b>
      </div>
      <div className="some-sivu">
        <Kuvake><Sydan /></Kuvake>
        <Kuvake><Kupla /></Kuvake>
        <Kuvake><Tallenna /></Kuvake>
        <Kuvake><Jaa /></Kuvake>
      </div>
      <div className="some-ala some-ala-tt">
        <b>@{kahva}</b>
      </div>
    </div>
  );
}
