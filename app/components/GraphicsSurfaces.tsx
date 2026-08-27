import Image from "next/image";

/**
 * Etusivun Graafinen suunnittelu -paneelin visuaali: teipattu pakettiauto
 * liiketilan julkisivun edessa.
 *
 * ASETTELU ON TAHALLAAN ITSENSA RAJAAVA. Juurielementilla on kiintea
 * kuvasuhde, position: relative ja overflow: hidden, ja KAIKKI absoluuttisesti
 * asemoitu (tausta, ajovalojen hehku) on sen sisalla. Auto on tavallinen
 * virtaava lohko, jonka leveys on prosentti juuresta. Nain mikaan ei voi
 * vuotaa paneelin ulkopuolelle millaan naytonleveydella.
 *
 * Lahteena on van-wrap.webp (1195x896) eika 1x-versio: auto on paneelissa
 * n. 400px levea, joten 2x-naytto tarvitsee 800px eika 597px riittaisi.
 * Tama ei tee paneelista raskaampaa - next/image tarjoilee kullekin
 * naytolle sopivan kokoisen variantin, ja master vaikuttaa vain siihen
 * kuinka tarkkoja variantteja siita voidaan johtaa.
 *
 * Kevyt muuten: ajovaloefekti nojaa SiteEffectsin olemassa olevaan
 * .rv-havainnoijaan - ei omaa ajastinta eika omaa observeria.
 */
export default function GraphicsSurfaces() {
  return (
    <div className="gsurf rv">
      <Image
        className="gsurf-bg"
        src="/graafinen/facade-bg.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 880px) 92vw, 44vw"
      />
      <div className="gsurf-van">
        <Image
          src="/graafinen/van-wrap.webp"
          alt="Teipattu pakettiauto yrityksen ilmeellä"
          width={1195}
          height={896}
          sizes="(max-width: 880px) 76vw, 36vw"
        />
        {/* Ajovalot: 27 % leveydesta, 55 % korkeudesta auton omissa
            suhteissa, joten kohta seuraa kuvaa kaikilla leveyksilla. */}
        <span className="gsurf-light" aria-hidden="true" />
      </div>
    </div>
  );
}
