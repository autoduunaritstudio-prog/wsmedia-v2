import type { ReactNode } from "react";

/**
 * MAASTO: sivun visuaalisen kielen kolme rakennuspalikkaa.
 *
 * Nama eivat ole koristeita vaan sommittelun valineita. Sivu joka
 * pitaa kaiken saman 1320px:n palstan sisalla on yksi pylvas
 * laatikoita riippumatta siita mita varia ne ovat. Sommitelma syntyy
 * vasta kun jokin rikkoo palstan.
 */

/**
 * LAATTA: taysleveä valokuva, joka menee reunasta reunaan.
 * Halutessaan sen paalle voi asettaa tekstin, jolloin kuva ei ole
 * kuvitus vaan osion pohja.
 */
export function Laatta({
  kuva,
  alt,
  korkeus = "korkea",
  children,
}: {
  kuva: string;
  alt?: string;
  korkeus?: "taysi" | "korkea" | "matala";
  children?: ReactNode;
}) {
  return (
    /* data-rvs antaa tälle laatikolle --rvp:n (0..1) omasta
       sijainnistaan nakymassa. Teksti nousee sen mukaan, ja koska luku
       lasketaan joka kehyksessa sijainnista eika ajastimesta, liike
       purkautuu samaa rataa takaisin kun kayttaja palaa ylos.
       data-par liikuttaa kuvaa hitaammin kuin sivua. */
    <div className={`laatta ${korkeus}`} data-rvs="">
      <img src={kuva} alt={alt ?? ""} aria-hidden={!alt} loading="lazy" data-par="0.028" />
      {children ? (
        <div className="laatta-teksti">
          <div className="swrap">{children}</div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * JUOVA: ohut maastokaista osioiden valissa. Ei sisaltoa, ei
 * luettavaa. Sivulla on oltava kohtia joissa silma lepaa, muuten se
 * palaa taaksepain kesken tekstin.
 */
export function Juova() {
  return (
    <div className="juova" aria-hidden="true">
      <img src="/hakukoneoptimointi/pinta.webp" alt="" loading="lazy" data-parx="0.04" />
    </div>
  );
}

/**
 * KAIKU: ylisuuri aariviivasana osion takana, leikattuna reunasta.
 * Mittakaavaero on se joka tekee syvyyden: kun samassa nakymassa on
 * 17px ja 260px, sivu ei ole enaa litteä.
 *
 * aria-hidden koska sana toistaa jo nakyvan otsikon sisallon.
 * Ruudunlukija lukisi sen toiseen kertaan ilman mitaan lisaarvoa.
 */
export function Kaiku({ sana, puoli = "oik" }: { sana: string; puoli?: "oik" | "vas" }) {
  return (
    <span className={`kaiku ${puoli}`} aria-hidden="true" data-parx="0.03">
      {sana}
    </span>
  );
}
