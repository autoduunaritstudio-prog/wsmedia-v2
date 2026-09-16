import { Sijoituskayra } from "./Grafiikat";

/**
 * TUMMA ELOKUVALLINEN HERO, KUTEN ETUSIVULLA.
 *
 * KATSOIN ETUSIVUN VIHDOIN OIKEASTI. Se ei avaudu valkoisella
 * tekstisivulla vaan taysruudun elokuvallisella kuvalla: tumma pohja,
 * 3D-metallilogo, syaani sahkoinen hehku joka latautuu vierityksen
 * mukana, ja valkoinen otsikko jonka toinen rivi on syaani. Se on
 * taidetta, ja se kertoo ensimmaisessa sekunnissa etta talo tekee
 * kuvaa.
 *
 * Talla sivulla oli valkoinen pohja, musta otsikko ja kaavio. Se kertoi
 * etta talo tekee raportteja. Sama yritys, kaksi eri viestia.
 *
 * Nyt hero on tumma ja taysleveä, tausta on sivua varten tehty
 * kuvio (nousevat rivit syaanilla), otsikko on valkoinen ja sen
 * painottuva osa syaani - tasan sama kaava kuin etusivun "Sisaltoa,
 * joka tekee kauppaa."
 *
 * MITTARI ON MUKANA MUTTA SE EI OLE PAAOSASSA. Sijoituskayra kelluu
 * kuvan paalla lasilevylla: se todistaa vaitteen heti, mutta se ei ole
 * se mita lukija nakee ensimmaisena. Ensin tunnelma, sitten todiste.
 */
export default function Hero() {
  return (
    <header className="seo-hero">
      {/* Taustakuva ja sen paalla tummennus. Tummennus on pakollinen:
          ilman sita valkoinen otsikko istuisi kuvion kirkkaiden
          kohtien paalla eika kontrasti olisi mitattavissa. */}
      <div className="hero-tausta" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hakukoneoptimointi/hf1.webp" alt="" data-par="0.075" data-parx="0.018" />
      </div>

      <div className="swrap hero-sisalto">
        <p className="hero-kick">Hakukoneoptimointi yritykselle</p>

        <h1 className="seo-h1 li d2">
          Löydy silloin,
          <br />
          kun asiakas <span className="accent">etsii palvelua.</span>
        </h1>

        <p className="hero-lead li d3">
          Tekninen hakukoneoptimointi, sisältö ja paikallinen näkyvyys yhdeltä tiimiltä. Sama työ
          nostaa sinut myös tekoälyhakujen vastauksiin.
        </p>

        <div className="heroctas li d4">
          <a className="btn mag" href="#tarjous">
            Pyydä maksuton kartoitus
          </a>
          <a className="tlink" href="#hinnoittelu">
            Katso hinnat
          </a>
        </div>

        <div className="hero-todiste li d5">
          <Sijoituskayra korkeus={210} />
        </div>
      </div>
    </header>
  );
}
