import SmartLink from "../../components/SmartLink";

import type { CSSProperties } from "react";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ============ MIKSI LYHYTVIDEOT ============ */
const REASONS = [
  {
    h: "Orgaaninen näkyvyys ilman mainosbudjettia",
    p: "Lyhytvideoiden algoritmi jakaa sisältöä kiinnostuksen, ei seuraajamäärän mukaan. Uusi tili voi tavoittaa saman yleisön kuin vakiintunut brändi.",
  },
  {
    h: "Ensimmäiset kolme sekuntia ratkaisevat",
    p: "Koukku, rytmi ja leikkauspisteet määrittävät katseluajan. Rakennamme jokaisen videon aloituksen niin, että skrollaus pysähtyy.",
  },
  {
    h: "Yksi kuvauspäivä, useita kanavia",
    p: "Samasta kuvauspäivästä syntyy sisältö TikTokiin, Reelsiin, Shortsiin ja LinkedIniin. Tuotantokustannus jakautuu monelle kanavalle.",
  },
  {
    h: "Sisältö, joka tekee myös kauppaa",
    p: "Näyttökerrat ovat välitavoite. Ohjaamme katsojan verkkosivuille, yhteydenottolomakkeelle tai myymälään — ja mittaamme mitä siitä seuraa.",
  },
];

export function Miksi() {
  return (
    <section id="miksi" style={{ paddingTop: "90px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Miksi lyhytvideot</span>
          <h2 className="big">
            Lyhytvideot ovat pk-yrityksen kustannustehokkain tapa tulla löydetyksi.
          </h2>
          <p className="sub">
            TikTokissa, Instagram Reelsissä ja YouTube Shortsissa näkyvyys ei enää seuraa
            seuraajamäärää vaan sisällön laatua. Se on pienen yrityksen etu — jos sisältö on tehty
            oikein.
          </p>
        </div>
        <div className="rows rv">
          {REASONS.map((r) => (
            <div key={r.h}>
              <h3>{r.h}</h3>
              <p>{r.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ MITÄ SISÄLTYY ============ */
export function Sisalto() {
  return (
    <section id="sisalto" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Palvelun sisältö</span>
          <h2>Mitä lyhytvideotuotanto sisältää?</h2>
          <p className="sub">
            Avaimet käteen -tuotanto tarkoittaa sitä, että sinun ei tarvitse keksiä ideoita,
            kirjoittaa käsikirjoituksia tai opetella editointia. Sinä hyväksyt, me hoidamme loput.
          </p>
        </div>
        <div className="incl rv">
          <div>
            <b>Lyhytvideostrategia, ideointi ja käsikirjoitus</b>
            <s>
              Kartoitamme kohderyhmän, kilpailijat ja kanavat, ja kirjoitamme koukut sekä
              käsikirjoitukset valmiiksi. Saat ne hyväksyttäväksi ennen kuvauspäivää.
            </s>
          </div>
          <div>
            <b>Kuvaus sinun tiloissasi, esiintyjä tarvittaessa</b>
            <s>
              Ammattikalusto, valot ja ääni. Yksi kuvauspäivä riittää tyypillisesti kuukauden
              sisältöihin. Jos yrityksestä ei löydy kameran edessä viihtyvää henkilöä, hoidamme
              esiintyjän puolestasi.
            </s>
          </div>
          <div>
            <b>Editointi, tekstitys ja grafiikat</b>
            <s>
              Leikkaus, tempo, äänisuunnittelu, tekstitykset ja brändin mukaiset grafiikat jokaiseen
              videoon.
            </s>
          </div>
          <div>
            <b>Alustakohtainen optimointi ja julkaisu</b>
            <s>
              Oikea kuvasuhde, kesto, kansikuva ja kuvausteksti jokaiselle kanavalle erikseen — ei
              samaa tiedostoa kaikkialle. Julkaisemme sovitusti tai toimitamme videot
              julkaisuvalmiina.
            </s>
          </div>
          <div>
            <b>Kuukausiraportti ja jatkokehitys</b>
            <s>
              Katseluaika, tavoittavuus ja konversiot. Seuraavan kuukauden sisältö rakennetaan datan
              päälle.
            </s>
          </div>
          <div>
            <b>Täydet käyttöoikeudet, myös verkkosivuille</b>
            <s>
              Valmiit videot ja raakamateriaali ovat sinun. Sama tuotanto palvelee myös{" "}
              <SmartLink href="/verkkosivut">verkkosivujesi</SmartLink> etusivua ja palvelusivuja, ei pelkkää somea.
            </s>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ ALUSTAT ============ */
const PLATFORMS = [
  {
    href: "/lyhytvideot/tiktok",
    chip: "TikTok",
    h: "TikTok-videot yritykselle",
    p: "Nopein kanava tavoittaa uusi yleisö nollasta. Toimii, kun sisältö on aitoa, rytmikästä ja puhuu katsojan kielellä — ei mainospuhetta.",
    link: "TikTok-videotuotanto",
  },
  {
    href: "/lyhytvideot/instagram-reels",
    chip: "Instagram",
    h: "Instagram Reels yritykselle",
    p: "Laajin ikäjakauma ja vahvin ostopolku Suomessa. Reels tuo uudet katsojat, feed ja tarinat hoitavat luottamuksen rakentamisen.",
    link: "Reels-tuotanto",
  },
  {
    href: "/lyhytvideot/youtube-shorts",
    chip: "YouTube",
    h: "YouTube Shorts yritykselle",
    p: "Shorts tuo uudet katsojat kanavalle ja pidemmät videot syventävät asiantuntijuutta. Sisältö löytyy myös haulla vielä kuukausien päästä.",
    link: "Shorts-tuotanto",
  },
  {
    href: "/lyhytvideot/linkedin",
    chip: "LinkedIn",
    h: "LinkedIn-videot B2B-yritykselle",
    p: "Asiantuntijabrändi, työnantajamielikuva ja myynnin tuki. Lyhytvideo erottuu LinkedInissä, koska kilpailu videosisällöistä on yhä vähäistä.",
    link: "LinkedIn-videot",
  },
];

export function Alustat() {
  return (
    <section id="alustat" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Kanavat</span>
          <h2>TikTok, Instagram Reels vai YouTube Shorts?</h2>
          <p className="sub">
            Vastaus on yleensä kaikki kolme. Sama kuvausmateriaali leikataan ja optimoidaan
            jokaiselle kanavalle erikseen, koska yleisö, kesto ja algoritmi eroavat toisistaan.
          </p>
        </div>
        <div className="grid4 stagger">
          {PLATFORMS.map((p, n) => (
            <a className="card plat rv" style={i(n)} href={p.href} key={p.href}>
              <span className="pchip">{p.chip}</span>
              <h3>{p.h}</h3>
              <p>{p.p}</p>
              <span className="tlink">{p.link}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SUPPILO ============ */
export function Kokonaisuus() {
  return (
    <section id="kokonaisuus" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Kokonaisuus</span>
          <h2>Lyhytvideo rakentaa brändin. Mainonta ja hakukoneoptimointi tuovat liidit.</h2>
          <p className="sub">
            Orgaaninen lyhytvideo tekee yrityksestäsi tunnetun ja luotettavan — se on arvoa, jota ei
            voi ostaa suoraan. Mutta tunnettuus ei yksin täytä kalenteria. Siksi rakennamme
            lyhytvideoiden rinnalle kaksi kanavaa, jotka muuttavat huomion yhteydenotoiksi.
          </p>
        </div>
        <div className="flow rv">
          <div>
            <p className="role">Brändiarvo</p>
            <h3>Lyhytvideot</h3>
            <p>
              Orgaaninen näkyvyys TikTokissa, Reelsissä ja Shortsissa. Ihmiset oppivat kuka olet ja
              mitä teet, ennen kuin heillä on tarve. Kun tarve tulee, sinä olet se nimi joka
              muistetaan.
            </p>
          </div>
          <div>
            <p className="role">Kysyntä</p>
            <h3>Meta-mainonta</h3>
            <p>
              Parhaiten orgaanisesti toimineet videot viedään Facebook- ja Instagram-mainonnaksi.
              Sisältö on jo todistettu yleisöllä, joten mainoseuro menee toistoihin ja tarkkaan
              kohdennukseen. Mainonta ohjaa liikenteen verkkosivullesi, jossa konversio tapahtuu.
            </p>
          </div>
          <div>
            <p className="role">Liidit</p>
            <h3>Hakukoneoptimointi</h3>
            <p>
              Video luo kysynnän, hakukone korjaa sadon. Kun ostaja googlaa palveluasi,
              hakukoneoptimoitu sivusto vie hänet yhteydenottolomakkeelle. Tämä kanava tuottaa
              liikennettä myös silloin, kun videot eivät pyöri eikä mainosbudjettia käytetä.
            </p>
            <span className="soon">
              Oma sivu tulossa ·{" "}
              <SmartLink href="/verkkosivut" style={{ color: "var(--blue)", textDecoration: "none" }}>
                verkkosivut
              </SmartLink>
            </span>
          </div>
        </div>
        <p className="flownote rv">
          Molemmat kanavat päätyvät samaan paikkaan: <SmartLink href="/verkkosivut">verkkosivullesi</SmartLink>.
          Siksi sivuston nopeus, selkeys ja yhteydenoton helppous ratkaisevat lopulta koko ketjun
          tuloksen — paraskaan video ei pelasta sivustoa, joka ei muuta kävijää yhteydenotoksi.
        </p>
      </div>
    </section>
  );
}

/* ============ PROSESSI ============ */
const STEPS = [
  {
    h: "Aloituspalaveri",
    p: "Käydään läpi tavoitteet, kohderyhmä ja kanavat. Saat konkreettisen sisältösuunnitelman ja hinnan ennen kuin mitään sovitaan.",
  },
  {
    h: "Ideointi ja käsikirjoitus",
    p: "Rakennamme kuukauden sisällöt teemoiksi ja kirjoitamme käsikirjoitukset. Hyväksyt ne ennen kuvauspäivää.",
  },
  {
    h: "Kuvauspäivä",
    p: "Kuvaamme sinun tiloissasi tai sovitussa paikassa. Yhdestä päivästä syntyy tyypillisesti [X] lyhytvideota.",
  },
  {
    h: "Editointi ja julkaisu",
    p: "Leikkaus, tekstitykset ja alustakohtainen optimointi. Julkaisemme sovitusti tai toimitamme videot julkaisuvalmiina.",
  },
];

export function Prosessi() {
  return (
    <section id="prosessi" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Prosessi</span>
          <h2>Näin lyhytvideotuotanto etenee</h2>
          <p className="sub">
            Ensimmäisestä puhelusta valmiisiin videoihin tyypillisesti [X] arkipäivää. Sinun aikaasi
            kuluu noin [X] tuntia kuukaudessa.
          </p>
        </div>
        <div className="steps stagger">
          {STEPS.map((s, n) => (
            <div className="card step rv" style={i(n)} key={s.h}>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ REFERENSSIT ============ */
const CASES = [
  { n: "[LUKU]", b: "[Asiakas ja toimiala]", s: "Näyttökertaa orgaanisesti, ilman maksettua mainontaa" },
  { n: "[LUKU]", b: "[Asiakas ja toimiala]", s: "Uutta seuraajaa ensimmäisen [X] kuukauden aikana" },
  { n: "[LUKU]", b: "[Asiakas ja toimiala]", s: "Yhteydenottoa lyhytvideoiden kautta" },
];

export function Tulokset() {
  return (
    <section id="tulokset" style={{ paddingTop: "20px", paddingBottom: 0 }}>
      <div className="work">
        <div className="wrap">
          <div className="shead rv">
            <span className="kick" style={{ color: "#6fb1ff" }}>
              Tulokset
            </span>
            <h2 style={{ color: "#f5f5f7" }}>Näytämme mieluummin kuin kerromme.</h2>
            <p className="sub">Kolme lyhytvideocasea täytetään oikeilla luvuilla ennen julkaisua.</p>
          </div>
          <div className="wgrid stagger">
            {CASES.map((c, n) => (
              <div className="w-item rv" style={i(n)} key={c.s}>
                <div className="thumb" />
                <span className="fillchip">Täytetään</span>
                <div className="n">{c.n}</div>
                <b>{c.b}</b>
                <s>{c.s}</s>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
