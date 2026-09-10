import Image from "next/image";

/**
 * Asiakaslogonauha. Rivi ei animoidu itsestaan vaan on kiinni scrollY:ssa:
 * SiteEffects siirtaa sita skrollin muutoksen mukana, alas skrollatessa
 * vasemmalle ja ylos skrollatessa oikealle. Ks. ".logostrip-track"
 * SiteEffects.tsx:ssa.
 *
 * Leveys/korkeus annetaan naytettavina mittoina (48px korkea, leveys
 * kuvasuhteen mukaan; arvot on laskettu lahdekuvien todellisista
 * pikselimitoista, ei skaalattu vanhoista), jolloin next/image generoi juuri oikean kokoiset
 * variantit 1x/2x-naytoille eika lahdekuvan taytta kokoa ladata koskaan.
 * Lahteina ovat kayttajan @2x-tiedostot, joten tarkkuus riittaa myos 3x:lle.
 */

/**
 * ink = lahdekuva on tayttaa mustaa.
 *
 * Mitattuna kolmen tiedoston kaikkien lapinakymattomien pikselien
 * keskikirkkaus on 0 ja kylläisyys 0, eli niissa ei ole yhtaan varia
 * kaannettavaksi. Tummalla pohjalla ne katoaisivat kokonaan, joten juuri
 * ne kaannetaan valkoisiksi. Kaksi muuta ovat varillisia (kirkkaus 87 ja
 * 93, kylläisyys 182 ja 103) ja nakyvat tummalla sellaisenaan - niiden
 * kaantaminen olisi vain harmaannuttanut ne.
 *
 * Lippu on tiedostokohtainen eika koko nauhaa koskeva suodin, koska
 * lahdekuvat ovat keskenaan erilaisia. Uutta logoa lisatessa: jos
 * tiedosto on mustavalkoinen viivapiirros, ink: true.
 */
type ClientLogo = { src: string; alt: string; w: number; h: number; ink?: boolean };

const H = 48;

const LOGOS: ClientLogo[] = [
  { src: "/logos/porsche-club-finland.png", alt: "Porsche Club Finland", w: 159, h: H, ink: true },
  { src: "/logos/tesla-owners-finland-color.png", alt: "Tesla Owners Finland", w: 50, h: H },
  { src: "/logos/colormaster.png", alt: "Colormaster", w: 113, h: H, ink: true },
  { src: "/logos/ydr-autohuolto.png", alt: "YDR Autohuolto", w: 159, h: H, ink: true },
  // TARKISTA: tiedosto tuli nimella ls-monogram.png ilman yritysnimea.
  // LS-monogrammi + sivustolla jo oleva asiakas viittaavat Laaksolahden
  // Sahkoon, mutta tata ei ole vahvistettu.
  { src: "/logos/ls-monogram-color.png", alt: "Laaksolahden Sähkö", w: 48, h: H },
];

/**
 * Siirtyma kiedotaan yhden kopion levyisena, joten loppujen viiden on
 * peitettava viewport kummassakin suunnassa. Yksi kopio on n. 1009px
 * (529px logoja + 5 x 96px vali), joten viisi riittaa n. 5000px
 * leveyteen asti.
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
                  className={l.ink ? "ink" : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
