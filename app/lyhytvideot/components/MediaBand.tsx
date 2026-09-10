import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/**
 * Taysleveä kuvanauha, jonka vasemmalla puolella on sisalto ja
 * oikealla kuvan kohde.
 *
 * OMA KOMPONENTTI, KOSKA NAITA ON KOLME. Kanavat, Prosessi ja
 * Kokonaisuus kayttavat samaa rakennetta, ja kolme kopiota samasta
 * asettelusta ajautuisi eri mittoihin heti ensimmaisessa muutoksessa.
 * Nyt osiot eroavat vain sisalloltaan ja kuvan rajaukselta, mika on
 * juuri se ero joka niiden KUULUU olla.
 *
 * TOISTO ON TARKOITUS, EI LAISKUUTTA. Sivun ongelma oli se, etta
 * jokainen osio keksi oman rakenteensa ja vaihdot lukivat
 * kertarysayksina. Kun sama nauha toistuu kolmesti, lukija oppii sen
 * ja vaihdot muuttuvat rytmiksi.
 *
 * KUVAN RAJAUS ANNETAAN AINA LASKETTUNA. imgWidth on kuvan leveys
 * prosentteina nauhasta: yli 100 % siirtaa kuvan sisaltoa oikealle,
 * pois tekstin alta, mutta samalla leikkaa oikeasta reunasta. Arvo on
 * haettava kunkin kuvan omista kohteista - ks. kutsujien kommentit.
 */

type Props = {
  /** Kuvan polku publicissa. */
  src: string;
  alt: string;
  /** Kuvan leveys prosentteina nauhasta, esim. 105. */
  imgWidth: number;
  /** object-position, esim. "50% 24%". */
  imgPosition: string;
  /** Kuvatiedoston omat mitat. Nailla next/image osaa rakentaa
      srcsetin oikein: jos luvut eivat vastaa tiedostoa, selain
      valitsee vaaran kokoisen variantin. */
  imgSize: [number, number];
  /** Sisalto oikealle, kuva vasemmalle. Joka toinen nauha. */
  flip?: boolean;
  /** Vierintaan sidottu vaakaliike kuvalle, esim. 0.028. Merkki
      kertoo suunnan. Suunta vuorottelee nauhasta toiseen, jolloin
      osioiden vaihdot saavat suunnan ilman etta sivulle tuodaan
      uutta mekanismia. */
  drift?: number;
  /** Peilaa kuvan vaakasuunnassa. Tarvitaan kun kuvan kohde on
      vaarassa reunassa flipattyyn asetteluun nahden. */
  mirror?: boolean;
  /** Listan asetteluvariantti: "mband-steps" (numeroitu kisko) tai
      "mband-cols" (yliotsikko ja korostuspalkki).

      MIKSI TAMA ON OLEMASSA. Nauhan rakenne saa toistua, koska
      toisto tekee vaihdoista rytmin. Sisallon asettelu EI saa, koska
      silloin kolme perakkaista nauhaa lukee samana ruutuna kolmesti
      ja lukija lakkaa erottamasta osioita toisistaan. Runko on siis
      yhteinen ja lista vaihtuu. */
  listVariant?: "steps" | "cols";
  title: ReactNode;
  sub: ReactNode;
  /** Rivit: MediaBandRow-elementteja. */
  children: ReactNode;
  /** Listan JALKEEN tuleva sisalto, esim. kehoterivi. Oma propsi
      eika children, koska lista on ruudukko: viides lapsi menisi
      ruudukon soluksi eika omaksi lohkokseen. */
  after?: ReactNode;
};

export default function MediaBand({
  src,
  alt,
  imgWidth,
  imgPosition,
  imgSize,
  drift,
  flip,
  mirror,
  listVariant,
  title,
  sub,
  children,
  after,
}: Props) {
  return (
    <div
      className={"mband rv" + (flip ? " mband-r" : "") + (mirror ? " mband-mirror" : "")}
      style={{ "--mb-w": imgWidth + "%", "--mb-pos": imgPosition } as CSSProperties}
    >
      {/* Kuva on yhtena kappaleena koko nauhan alla, ei vain oikeassa
          puoliskossa. Vasen puoli on lapinakyva verho sen paalla,
          jolloin kuvan sisalto jatkuu tekstin takana eika lohkea
          kahdeksi eri pinnaksi. */}
      <Image
        className="mband-bg"
        src={src}
        alt={alt}
        width={imgSize[0]}
        height={imgSize[1]}
        sizes="100vw"
        data-parx={drift ?? undefined}
      />
      <div className="mband-in">
        <div className="mband-txt">
          <h2>{title}</h2>
          <p className="sub">{sub}</p>
        </div>
        <div
          className={
            "mband-list stagger" + (listVariant ? " mband-" + listVariant : "")
          }
        >
          {children}
        </div>
        {after}
      </div>
    </div>
  );
}

/**
 * Yksi rivi nauhan listassa. href tekee siita linkin, ilman sita se on
 * pelkka tekstirivi - prosessin vaiheilla ei ole omaa sivua, kanavilla
 * on.
 */
export function MediaBandRow({
  i,
  href,
  over,
  title,
  text,
  link,
}: {
  i: number;
  href?: string;
  /** Yliotsikko otsikon ylapuolelle, esim. rooli ketjussa. */
  over?: string;
  title: string;
  text: ReactNode;
  link?: string;
}) {
  const inner = (
    <>
      {over ? <i>{over}</i> : null}
      <b>{title}</b>
      <s>{text}</s>
      {link ? <span className="tlink">{link}</span> : null}
    </>
  );
  const style = { "--i": i } as CSSProperties;
  return href ? (
    <a className="mband-row rv" style={style} href={href}>
      {inner}
    </a>
  ) : (
    <div className="mband-row rv" style={style}>
      {inner}
    </div>
  );
}
