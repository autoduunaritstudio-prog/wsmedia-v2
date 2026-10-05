import HakuNousu from "./HakuNousu";

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
    /* .hk-pin: desktopilla hero pysyy paikallaan vierityskaaren ajan,
       jolloin tuloslista ehtii nousta. Ks. globals.css. */
    <div className="hk-pin">
    <header className="seo-hero">
      {/* Taustakuva ja sen paalla tummennus. Tummennus on pakollinen:
          ilman sita valkoinen otsikko istuisi kuvion kirkkaiden
          kohtien paalla eika kontrasti olisi mitattavissa. */}
      {/* KORKEUSKAYRAKARTTA (3.10.2026). Sivun oma kuvio: hakutulokset
          ovat maasto jossa noustaan, ja paikallinen haku on kartta.
          Pohja on sama yonsininen kuin muilla palvelusivuilla, ei musta. */}

      <div className="swrap hero-sisalto hk-hero">
        <div className="hk-teksti">
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
              Varaa maksuton kartoitus
            </a>
            <a className="tlink" href="#hinnoittelu">
              Katso hinnat
            </a>
          </div>
        </div>

        {/* Oikea palsta: hakutulos nousee vierityksen mukana, ks. HakuNousu.tsx. */}
        <div className="hk-visu li d5">
          <HakuNousu />
        </div>
      </div>
      {/* Vierintavihje: kertoo etta hero on vieritettava eika valmis
          kuva. Piiloutuu kun tulos lahtee nousemaan (HakuNousu). */}
      <div className="hk-vihje" data-n="vihje" aria-hidden="true">
        <span className="hk-hiiri">
          <i />
        </span>
        <span className="hk-vihje-teksti">
          <b>Vieritä alas</b>
          <small>ja katso, miten yrityksesi nousee sijalta 5 ykköseksi</small>
        </span>
        <span className="hk-vihje-sija">
          <em>#5</em>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          <em className="yksi">#1</em>
        </span>
      </div>
    </header>
    </div>
  );
}
