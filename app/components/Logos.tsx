import Image from "next/image";

/**
 * Asiakaslogonauha. Rivi ei animoidu itsestaan vaan on kiinni scrollY:ssa:
 * SiteEffects siirtaa sita skrollin muutoksen mukana, alas skrollatessa
 * vasemmalle ja ylos skrollatessa oikealle. Ks. ".logostrip-track"
 * SiteEffects.tsx:ssa.
 *
 * Leveys/korkeus annetaan naytettavina mittoina (36px korkea, leveys
 * kuvasuhteen mukaan), jolloin next/image generoi juuri oikean kokoiset
 * variantit 1x/2x-naytoille eika lahdekuvan taytta kokoa ladata koskaan.
 * Lahteina ovat kayttajan @2x-tiedostot, joten tarkkuus riittaa myos 3x:lle.
 */

type ClientLogo = { src: string; alt: string; w: number; h: number };

const H = 36;

const LOGOS: ClientLogo[] = [
  { src: "/logos/porsche-club-finland.png", alt: "Porsche Club Finland", w: 119, h: H },
  { src: "/logos/tesla-owners-finland.png", alt: "Tesla Owners Finland", w: 37, h: H },
  { src: "/logos/colormaster.png", alt: "Colormaster", w: 84, h: H },
  { src: "/logos/ydr-autohuolto.png", alt: "YDR Autohuolto", w: 119, h: H },
  // TARKISTA: tiedosto tuli nimella ls-monogram.png ilman yritysnimea.
  // LS-monogrammi + sivustolla jo oleva asiakas viittaavat Laaksolahden
  // Sahkoon, mutta tata ei ole vahvistettu.
  { src: "/logos/ls-monogram.png", alt: "Laaksolahden Sähkö", w: 36, h: H },
];

/**
 * Siirtyma kiedotaan yhden kopion levyisena, joten loppujen viiden on
 * peitettava viewport kummassakin suunnassa. Yksi kopio on n. 800px, joten
 * viisi riittaa n. 4000px leveyteen asti.
 */
const COPIES = 6;

export default function Logos() {
  return (
    <div className="logos rv">
      <p className="t">Yrityksiä joiden kanssa työskentelemme</p>
      <div className="logostrip">
        <div className="logostrip-track">
          {Array.from({ length: COPIES }, (_, copy) => (
            <div className="logostrip-copy" key={copy} aria-hidden={copy > 0 || undefined}>
              {LOGOS.map((l) => (
                <Image
                  key={l.src}
                  src={l.src}
                  alt={copy === 0 ? l.alt : ""}
                  width={l.w}
                  height={l.h}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
