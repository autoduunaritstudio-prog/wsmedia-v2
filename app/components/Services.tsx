import GraphicsSurfaces from "./GraphicsSurfaces";
import SmartLink from "./SmartLink";
import DemoVideo from "./DemoVideo";

export default function Services() {
  return (
    <section id="palvelut">
      <div className="wrap">
        <div className="shead shead-team rv" data-par="0.03">
          {/* TODO: korvaa oikealla tiimikuvalla kun saatavilla.
              Kun kuva tulee: vaihda .teamph-lohko <Image />:ksi, sailyta
              aspect-ratio 4/5 ja border-radius 20px, ja poista .teamph /
              .teamph-mark globals.css:sta. Katkoviivareunus on
              tarkoituksellinen: paikkamerkin pitaa nayttaa tilapaiselta
              eika viimeistellylta mockupilta. */}
          <div className="teamph" aria-hidden="true">
            <span className="teamph-mark">Tiimikuva tulossa</span>
          </div>
          <div className="shead-txt">
            <h2 className="big">Neljä tapaa erottua. Yksi tiimi.</h2>
            <p className="sub">
              Video tuo huomion, sivusto tekee kaupan, tapahtuma sinetöi suhteen. Rakennamme koko
              polun.
            </p>
          </div>
        </div>

        {/* 1. Lyhytvideot */}
        <div className="svc rv">
          <div className="svc-visual" data-par="0.02">
            <span className="deco deco-grid" style={{ left: "-30px", top: "-20px" }} />
            <span className="deco deco-ring" style={{ right: "6%", top: "-8px" }} />
            <span className="deco deco-dot" style={{ right: "2%", bottom: "30%" }} />
            <div className="mini-phones">
              {/* Sisalto kuuluu .scr:n sisaan, ei suoraan runkoon: rungon
                  reunus on inset-varjo, jonka lapset peittaisivat. */}
              <div className="mini" data-tilt="y">
                <div className="scr">
                  <DemoVideo
                    className="phone-video"
                    mp4="/reels-demo.mp4"
                    poster="/reels-demo-poster.jpg"
                    preload="metadata"
                    label="Esimerkki WS Median tuottamasta Reels-videosta"
                  />
                  <div className="tag">REELS</div>
                </div>
              </div>
              <div className="mini" data-tilt="-y">
                <div className="scr">
                  <DemoVideo
                    className="phone-video"
                    mp4="/tiktok-demo.mp4"
                    poster="/tiktok-demo-poster.jpg"
                    preload="metadata"
                    label="Esimerkki WS Median tuottamasta TikTok-videosta"
                  />
                  <div className="tag">TIKTOK</div>
                </div>
              </div>
              <div className="float-tag ft-a">
                <i />
                Näkymät
                <br />
                +312 %
              </div>
            </div>
          </div>
          <div className="svc-txt" data-par="0.035">
            <span className="kick">Lyhytvideot</span>
            <h3>Videot, jotka algoritmi nostaa ja ihmiset katsovat loppuun.</h3>
            <p>
              TikTok, Instagram Reels ja YouTube Shorts. Strategia, käsikirjoitus, kuvaus ja
              editointi, julkaisuvalmiina sähköpostiisi.
            </p>
            <ul>
              <li>Ensimmäiset 3 sekuntia ratkaisevat, me tiedämme miten ne tehdään</li>
              <li>Kuvaus sinun tiloissasi ammattikalustolla</li>
              <li>Tekstitykset, grafiikat ja alustakohtainen optimointi</li>
            </ul>
            <SmartLink className="tlink" href="/lyhytvideot">
              Lue lisää lyhytvideoista
            </SmartLink>
          </div>
        </div>

        {/* 2. Verkkosivut */}
        <div className="svc rev rv">
          <div className="svc-visual" data-par="0.02">
            <span className="deco deco-ring deco-ring-sm" style={{ left: "-4%", top: "-14px" }} />
            <span className="deco deco-plus" style={{ right: "-4%", bottom: "14%" }}>
              +
            </span>
            <div className="browser" data-tilt="-y" data-tilt-profile="mockup">
              <div className="bar">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="url">laaksolahdensahko.fi</span>
              </div>
              <div className="page demo">
                <div className="score" title="PageSpeed">
                  <i>
                    97<small>SPEED</small>
                  </i>
                </div>
                <DemoVideo
                  className="demo-video"
                  webm="/laaksolahti-demo.webm"
                  mp4="/laaksolahti-demo.mp4"
                  poster="/laaksolahti-poster.jpg"
                  label="Kuvakaappaus Laaksolahden Sähkön uudesta verkkosivustosta, jonka WS Media on toteuttanut"
                />
              </div>
            </div>
            <div className="float-tag ft-b">
              <i />
              Hakukonesijoitus
              <br />
              {"#1 paikallisesti"}
            </div>
          </div>
          <div className="svc-txt" data-par="0.035">
            <span className="kick">Verkkosivut</span>
            <h3>Sivusto, joka latautuu heti ja muuttaa kävijät yhteydenotoiksi.</h3>
            <p>
              Käsin koodatut, hakukoneoptimoidut sivustot ilman raskaita sivupohjia. Tämä sivu jota
              katsot on työnäyte.
            </p>
            <ul>
              <li>Nopeus edellä, myös mobiilissa</li>
              <li>Hakukoneoptimointi rakennettu sisään alusta asti</li>
              <li>Video ja sivusto samalta tiimiltä, viesti pysyy yhtenäisenä</li>
            </ul>
            <SmartLink className="tlink" href="/verkkosivut">
              Lue lisää verkkosivuista
            </SmartLink>
          </div>
        </div>

        {/* 3. Graafinen suunnittelu */}
        <div className="svc rv svc-graafinen">
          <div className="svc-visual" data-par="0.02">
            <span className="deco deco-ring deco-ring-sm" style={{ right: "-3%", top: "-10px" }} />
            <span className="deco deco-dot" style={{ left: "-2%", bottom: "18%" }} />
            <GraphicsSurfaces />
          </div>
          <div className="svc-txt" data-par="0.035">
            <span className="kick">Graafinen suunnittelu</span>
            <h3>Yksi ilme, joka toimii käyntikortista pakettiauton kylkeen.</h3>
            <p>
              Logo, värit ja graafinen ohjeisto — ja sama ilme viety painotuotteisiin,
              teippauksiin ja kyltteihin asennettuna. Yksi tarjous, yksi lasku.
            </p>
            <ul>
              <li>Saat alkuperäistiedostot ja täydet oikeudet</li>
              <li>Suunnittelu, materiaalit ja asennus samalta tiimiltä</li>
              <li>Hinta-arvion näet itse laskurilla ennen tarjousta</li>
            </ul>
            <SmartLink className="tlink" href="/graafinen-suunnittelu">
              Lue lisää graafisesta suunnittelusta
            </SmartLink>
          </div>
        </div>

        {/* 4. Tapahtumat */}
        <div className="svc rev rv">
          <div className="svc-visual" data-par="0.02">
            <span className="deco deco-dot" style={{ left: "-2%", top: "10%" }} />
            <span className="deco deco-ring deco-ring-sm" style={{ right: "4%", bottom: "-10px" }} />
            <div className="event" data-tilt="-y" data-tilt-profile="mockup">
              <div className="lights" />
              <div className="truss" />
              <span className="chip">[Tapahtuman nimi] · [pvm]</span>
              <div className="play" />
              <div className="crowd" />
              <div className="cap">
                <b>Aftermovie</b>
                <s>Täytetään tapahtumareferenssillä</s>
              </div>
            </div>
            <div className="float-tag ft-a">
              <i />
              Kävijät
              <br />
              {"[X] henkeä"}
            </div>
          </div>
          <div className="svc-txt" data-par="0.035">
            <span className="kick">Tapahtumat</span>
            <h3>Tapahtumat, joista puhutaan vielä viikkoja.</h3>
            <p>
              Suunnittelusta toteutukseen ja taltiointiin. Tapahtuma tuottaa samalla sisältöä someen
              ja sivuillesi, yksi ilta ruokkii koko vuoden markkinointia.
            </p>
            <ul>
              <li>[Tapahtumapalvelun sisältö 1, täytetään]</li>
              <li>[Tapahtumapalvelun sisältö 2, täytetään]</li>
              <li>Aftermovie ja some-nostot samasta tuotannosta</li>
            </ul>
            {/* Tapahtumat-sivua ei ole viela; ankkuri pitaa kayttajan
                paikallaan sen sijaan etta tyhja "#" hyppaisi sivun ylalaitaan. */}
            <a className="tlink" href="#palvelut">
              Lue lisää tapahtumista
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
