import Image from "next/image";

/**
 * Etusivun Graafinen suunnittelu -paneelin visuaali: teipattu pakettiauto.
 *
 * KAKSI ERI MEKANISMIA, tarkoituksella:
 *
 * 1. SISAANTULO (.rv): auto "ajaa esiin" tekstin takaa. Kertaalleen
 *    laukeava, koska SiteEffectsin reveal-havainnoija tekee unobserven
 *    ensimmaisen kerran jalkeen. Alkutila ja lopputila ovat CSS:ssa
 *    .gsurf-van.rv / .gsurf-van.rv.on -saannoissa.
 *
 * 2. AJOVALOT (data-lights -> .lights-on): PALAUTUVA tila. Oma
 *    IntersectionObserver SiteEffectsissa togglaa luokan nakyvyyden
 *    mukaan eika tee unobservea, joten valot syttyvat ja sammuvat aina
 *    kun auto tulee ruudulle tai poistuu siita.
 *
 *    Auton valot palavat jo valokuvassa, joten peite toimii toisin pain:
 *    se HIMMENTAA valot kun paneeli ei ole nakyvissa. Ks. .gsurf-light.
 */
export default function GraphicsSurfaces() {
  return (
    <div className="gsurf">
      <div className="gsurf-van rv" data-lights>
        <Image
          src="/graafinen/van-wrap.webp"
          alt="Teipattu pakettiauto yrityksen ilmeellä"
          width={1195}
          height={896}
          sizes="(max-width: 880px) 82vw, 40vw"
        />
        {/* Ajovalojen peite: 27 % leveydesta, 55 % korkeudesta auton
            omissa suhteissa, eli kuvan valoryhman kohdalla. */}
        <span className="gsurf-light" aria-hidden="true" />
      </div>
    </div>
  );
}
