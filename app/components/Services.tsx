import SmartLink from "./SmartLink";
import DemoVideo from "./DemoVideo";

export default function Services() {
  return (
    <section id="palvelut">
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Palvelut</span>
          <h2 className="big">Kolme tapaa erottua. Yksi tiimi.</h2>
          <p className="sub">
            Video tuo huomion, sivusto tekee kaupan, tapahtuma sinetöi suhteen. Rakennamme koko
            polun.
          </p>
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
              <div className="mini">
                <div className="scr">
                  <DemoVideo
                    className="reels-video"
                    mp4="/reels-demo.mp4"
                    poster="/reels-demo-poster.jpg"
                    label="Esimerkki WS Median tuottamasta Reels-videosta"
                  />
                  <div className="tag">REELS</div>
                </div>
              </div>
              <div className="mini">
                <div className="scr">
                  <div className="vid" style={{ animationDelay: "-5s" }} />
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
            <div className="browser">
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
            <a className="tlink" href="#">
              Lue lisää verkkosivuista
            </a>
          </div>
        </div>

        {/* 3. Tapahtumat */}
        <div className="svc rv">
          <div className="svc-visual" data-par="0.02">
            <span className="deco deco-dot" style={{ left: "-2%", top: "10%" }} />
            <span className="deco deco-ring deco-ring-sm" style={{ right: "4%", bottom: "-10px" }} />
            <div className="event">
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
            <a className="tlink" href="#">
              Lue lisää tapahtumista
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
