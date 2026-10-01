import Stage from "../Stage";

/**
 * PINNATTU HERO, SAMA RAKENNE KUIN LYHYTVIDEOILLA.
 *
 * Kaksi palstaa: teksti vasemmalle, pintanayttamo oikealle. Sama syy
 * kuin Lyhytvideoilla: pystysuuntainen jarjestys toimii vain jos
 * jokin osa saa jaada taitteen alle, ja rinnakkain lukija saa
 * otsikon, lupauksen, napin JA todisteen yhdella silmayksella.
 *
 * Nayttamo on sivun oma todiste: sama tunnus neljalla pinnalla yhta
 * aikaa, ja brandivari vaihtuu niissa kaikissa samalla hetkella.
 * Lyhytvideoilla todiste on asiakkaan video, verkkosivuilla
 * vierityselokuva, tassa se on ilme itse.
 */
export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap hero-split">
        <div className="hero-copy">
          <p className="kick li d1">Graafinen suunnittelu · Espoo</p>
          <h1 className="li d2" id="paasisalto" tabIndex={-1}>
            Graafinen suunnittelu yritykselle, <span className="accent">logosta auton kylkeen.</span>
          </h1>
          <p className="sub li d3">
            Suunnittelemme logon, värit ja graafisen ohjeiston ja viemme ilmeen käyntikortteihin,
            roll-upeihin, ikkunoihin ja pakettiauton kylkeen. Painotaloa tai teippaajaa ei
            tarvitse etsiä itse: saat yhden tarjouksen, yhden yhteyshenkilön ja yhden laskun.
          </p>
          <div className="heroctas li d4">
            <a className="btn mag" href="#tarjous">
              Pyydä tarjous
            </a>
            <a className="tlink" href="#hinta">
              Laske arvio hinnasta
            </a>
          </div>
          <p className="herotrust li d4">
            <span>
              <i />
              Logo alk. 490 € + alv
            </span>
            <span>
              <i />
              Alkuperäistiedostot sinulle
            </span>
            <span>
              <i />
              Asennus koko Suomessa
            </span>
          </p>
        </div>

        <Stage />
      </div>
    </header>
  );
}
