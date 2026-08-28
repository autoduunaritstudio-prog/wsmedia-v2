import Image from "next/image";

/**
 * Asiakaslogonauha. Rivi ei animoidu itsestaan vaan on kiinni scrollY:ssa:
 * SiteEffects siirtaa sita skrollin muutoksen mukana, alas skrollatessa
 * vasemmalle ja ylos skrollatessa oikealle. Ks. ".logostrip-track"
 * SiteEffects.tsx:ssa.
 *
 * Leveys/korkeus annetaan naytettavina mittoina (42px korkea, leveys
 * kuvasuhteen mukaan; arvot on laskettu lahdekuvien todellisista
 * pikselimitoista, ei skaalattu vanhoista), jolloin next/image generoi juuri oikean kokoiset
 * variantit 1x/2x-naytoille eika lahdekuvan taytta kokoa ladata koskaan.
 * Lahteina ovat kayttajan @2x-tiedostot, joten tarkkuus riittaa myos 3x:lle.
 */

type ClientLogo = { src: string; alt: string; w: number; h: number };

const H = 42;

const LOGOS: ClientLogo[] = [
  { src: "/logos/porsche-club-finland.png", alt: "Porsche Club Finland", w: 139, h: H },
  { src: "/logos/tesla-owners-finland-color.png", alt: "Tesla Owners Finland", w: 43, h: H },
  { src: "/logos/colormaster.png", alt: "Colormaster", w: 99, h: H },
  { src: "/logos/ydr-autohuolto.png", alt: "YDR Autohuolto", w: 139, h: H },
  // TARKISTA: tiedosto tuli nimella ls-monogram.png ilman yritysnimea.
  // LS-monogrammi + sivustolla jo oleva asiakas viittaavat Laaksolahden
  // Sahkoon, mutta tata ei ole vahvistettu.
  { src: "/logos/ls-monogram-color.png", alt: "Laaksolahden Sähkö", w: 42, h: H },
];

/**
 * Siirtyma kiedotaan yhden kopion levyisena, joten loppujen viiden on
 * peitettava viewport kummassakin suunnassa. Yksi kopio on koon noston
 * jalkeen n. 880px (462px logoja + 5 x 84px vali), joten viisi riittaa
 * n. 4400px leveyteen asti.
 */
const COPIES = 6;

export default function Logos() {
  return (
    <div className="logos rv">
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
