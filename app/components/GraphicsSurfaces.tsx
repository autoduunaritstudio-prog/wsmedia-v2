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
 *    Hehku on additiivinen ja tarpeeksi iso vuotaakseen auton tummalle
 *    korille - vain siella se nakyy, koska auton omat valot ovat kuvassa
 *    jo kirkkaan valkoiset. Ks. .gsurf-light.
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
        {/* PYORIEN LIIKE-EPATERAVYYS sisaantulon ajaksi. Spritet ovat
            pyorimissumennetut versiot van-wrap.webp:n pyorista, muu kuva
            lapinakyvaa; terava pyora on koko ajan alla, joten lopputila
            on tasmalleen sama kuva kuin ennen.

            Sijainti prosentteina lahdekuvan 1195x896 pikseleista:
            etupyora 459/579 px, 120x166 px ja takapyora 1011/447 px,
            92x140 px. .gsurf-van img on width: 100% / height: auto ja
            sailyttaa kuvasuhteen, joten prosentit osuvat samaan kohtaan
            jokaisella leveydella.

            Ei loading="lazy": sprite ei saa ilmestya kesken animaation.
            Raaka <img> eika next/image, jotta tiedostot tarjoillaan
            sellaisenaan public/-kansiosta eika optimoijan lapi. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="gsurf-wheel gsurf-wheel-front"
          src="/graafinen/van-wheel-front-blur.webp"
          width={120}
          height={166}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="gsurf-wheel gsurf-wheel-rear"
          src="/graafinen/van-wheel-rear-blur.webp"
          width={92}
          height={140}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
        {/* Ajovalojen hehku: 27 % leveydesta, 55 % korkeudesta auton
            omissa suhteissa, eli kuvan valoryhman kohdalla. */}
        <span className="gsurf-light" aria-hidden="true" />
      </div>
    </div>
  );
}
