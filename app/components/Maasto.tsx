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

/**
 * VAITE: yksi lause taytena nakymana, valokuva taustalla tai ilman.
 * Hengahdys kahden raskaan osion valissa. Siirretty tanne SEO-sivun
 * omasta tiedostosta, koska se on kuvakielen osa eika yhden sivun.
 */
export function Vaite({
  children,
  alla,
  kuva,
  kuvaAlt,
  palkkiAlkaa,
}: {
  children: ReactNode;
  alla?: string;
  /* Valokuva lauseen takana. Lause tyhjalla pohjalla on vaite, lause
     kuvan paalla on hetki. Kaikki vaiteet eivat saa kuvaa: jos ne
     saisivat, keino kuluisi loppuun kolmannella kerralla. */
  kuva?: string;
  kuvaAlt?: string;
  /* Kehotuspalkki alkaa tasta osiosta. Ks. Palkki.tsx: palkki ei enaa
     ala coverin noususta vaan siita osiosta joka on merkitty tallä. */
  palkkiAlkaa?: boolean;
}) {
  return (
    <section
      className={kuva ? "vaite kuvallinen" : "vaite"}
      data-rvs=""
      {...(palkkiAlkaa ? { "data-palkki-alku": "" } : null)}
    >
      {/* loading="lazy" puuttui, ja se maksoi eniten koko sivun
          latauksessa: molemmat vaitteet ovat taysleveita 1728px:n
          valokuvia (54 kB + 104 kB) ja ne latautuivat heti, vaikka
          kumpikaan ei ole lahellakaan taitetta. Laatta ja tarjous-
          osion pohjakuva olivat jo laiskoja, vaite ei. */}
      {kuva ? (
        <img
          src={kuva}
          alt={kuvaAlt ?? ""}
          aria-hidden={!kuvaAlt}
          loading="lazy"
          decoding="async"
          data-par="0.028"
        />
      ) : null}
      <div className="swrap">
        <p className="vaite-teksti">{children}</p>
        {alla ? <p className="vaite-alla">{alla}</p> : null}
      </div>
    </section>
  );
}

/**
 * PYSTYKISKO: osion nimi sivussa pystyssa, ja sen vieressa viiva joka
 * tayttyy osion edetessa.
 *
 * Tama on sama idea kuin Verkkosivut-alasivun heron mittakisko, mutta
 * osiokohtaisena: pieni tekninen merkinta sivun reunassa, joka kertoo
 * missa kohtaa ollaan ja etta sivu etenee. Se on pinnattu, joten se
 * seuraa lukijaa osion lapi eika vilahda ohi.
 *
 * Etenema tulee --rvp:sta, jonka SiteEffects kirjoittaa osion omasta
 * sijainnista nakymassa. Sama luku kuin janalla ja kehotusviivoilla,
 * eli sivulla on yksi tapa sanoa "tama etenee".
 */
export function Pystykisko({ teksti }: { teksti: string }) {
  return (
    <div className="pystykisko" data-rvs="" aria-hidden="true">
      <span className="pk-teksti">{teksti}</span>
    </div>
  );
}
