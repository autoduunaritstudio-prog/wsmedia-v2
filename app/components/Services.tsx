import SmartLink from "./SmartLink";
import { Kaiku } from "./Maasto";
import PalveluMerkki from "./PalveluMerkki";
import KorttiHero from "./KorttiHero";

export default function Services() {
  return (
    <section id="palvelut">
      <Kaiku sana="PALVELUT" puoli="vas" luokka="etu" />
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <h2 className="big">Neljä tapaa erottua. Yksi tiimi.</h2>
          <p className="sub">
            Video tuo huomion, sivusto tekee kaupan, hakunäkyvyys tuo ne jotka jo etsivät. Yksi
            ilme pitää kaiken kasassa.
          </p>
        </div>

        {/* 1. Lyhytvideot */}
        <div className="svc rv svc-video">
          <div className="svc-visual">
            <KorttiHero nimi="video" kuvaus="Lyhytvideot-sivun hero: puhelimissa pyörivät asiakasvideot" />
          </div>
          <div className="svc-txt" data-par="0.035">
            <span className="kick">
              <PalveluMerkki p="video" className="svc-merkki" />
              Lyhytvideot
            </span>
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
            <div className="svc-cta">
              <SmartLink className="btn" href="/lyhytvideot">
                Lue lisää lyhytvideoista
              </SmartLink>
            </div>
          </div>
        </div>

        {/* 2. Verkkosivut */}
        <div className="svc rev rv svc-site">
          <div className="svc-visual">
            <KorttiHero nimi="site" kuvaus="Verkkosivut-sivun hero" pysakuva />
          </div>
          <div className="svc-txt" data-par="0.035">
            <span className="kick">
              <PalveluMerkki p="site" className="svc-merkki" />
              Verkkosivut
            </span>
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
            <div className="svc-cta">
              <SmartLink className="btn" href="/verkkosivut">
                Lue lisää verkkosivuista
              </SmartLink>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
