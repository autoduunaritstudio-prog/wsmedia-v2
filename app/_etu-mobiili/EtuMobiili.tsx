/* ETUSIVUN PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Puhelin.dc.html: rakenne,
   tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on muunnettu
   koneellisesti (dc2jsx.mjs + etu.py) ja vierityksen arvot on korvattu
   alkutilalla; EtuEfektit.tsx ja Moottori.tsx kirjoittavat ne suoraan
   DOMiin. Naytetaan vain max-width: 767px (mobiili.css).

   Kaksi tietoista poikkeamaa suunnitelmasta:
   - Heron elokuvaruutu skaalautuu nakyman leveyteen (suunnitelma 390 px).
     390 px:n leveydella tulos on sama pikselilleen.
   - Kartoituksen paivat ja ajat tulevat sivuston oikeasta
     varauskalenterista (ajat.ts, sama kuin tyopoydan BookingCal), eivat
     suunnitelman esimerkkipaivista. */
import "./mobiili.css";
import "./lisat.css";
import { Fragment } from "react";
import { mo, logoLeveys } from "@/app/components/mobiili/mo";
import Kuori from "@/app/components/mobiili/Kuori";
import Alatunniste from "@/app/components/mobiili/Alatunniste";
import Moottori from "@/app/components/mobiili/Moottori";
import { TYHJA } from "@/app/components/mobiili/mo";
import EtuEfektit from "./EtuEfektit";
import EtuKalenteri from "./EtuKalenteri";
import Latausruutu from "@/app/components/Latausruutu";

/* ---- Suunnitelman renderVals()-tiedot sellaisenaan ---- */
const logot = [
      { src: '/mobiili/logot/porsche-club-finland.webp', alt: 'Porsche Club Finland', h: 36 },
      { src: '/mobiili/logot/tesla-owners-finland-color.webp', alt: 'Tesla Owners Finland', h: 38 },
      { src: '/mobiili/logot/colormaster.webp', alt: 'Colormaster', h: 30 },
      { src: '/mobiili/logot/ydr-autohuolto.webp', alt: 'YDR Autohuolto', h: 32 },
      { src: '/mobiili/logot/ls-monogram-color.webp', alt: 'Laaksolahden Sähkö', h: 36 }
    ]
const LOGOT = logot.concat(logot, logot, logot);
const IK = {
      video: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 16.5zM16 10l4-2.5v9L16 14',
      sivu: 'M3.5 6.5A2 2 0 0 1 5.5 4.5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2zM3.5 9h17M7 6.8h.01M9.5 6.8h.01',
      haku: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20',
      ilme: 'M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.7 0-1 .8-1.6 1.8-1.6h2.1c2 0 3.8-1.6 3.8-3.8C20.5 6.5 16.7 3.5 12 3.5zM7.5 11.5h.01M9.5 7.5h.01M14 7h.01'
    }
const PAL = [
      { nimi: 'Lyhytvideot', kuva: '/kortti-hero-video.webp', alt: 'Lyhytvideot-sivun näkymä puhelimissa', ikoni: IK.video, otsikko: 'Videot, jotka algoritmi nostaa ja ihmiset katsovat loppuun.', teksti: 'TikTok, Instagram Reels ja YouTube Shorts. Strategia, käsikirjoitus, kuvaus ja editointi, julkaisuvalmiina sähköpostiisi.', nappi: 'Lue lisää lyhytvideoista', href: '/lyhytvideot' },
      { nimi: 'Verkkosivut', kuva: '/kortti-hero-site.webp', alt: 'Verkkosivut-sivun näkymä näytöllä', ikoni: IK.sivu, otsikko: 'Sivusto, joka latautuu heti ja muuttaa kävijät yhteydenotoiksi.', teksti: 'Käsin koodatut, hakukoneoptimoidut sivustot ilman raskaita sivupohjia. Tämä sivu jota katsot on työnäyte.', nappi: 'Lue lisää verkkosivuista', href: '/verkkosivut' },
      { nimi: 'Hakukoneoptimointi', kuva: '/kortti-hero-seo.webp', alt: 'Hakukoneoptimointi-sivun näkymä', ikoni: IK.haku, otsikko: 'Löydy silloin, kun asiakas etsii palvelua.', teksti: 'Tekninen optimointi, sisältö ja paikallinen näkyvyys yhdeltä tiimiltä. Sama työ nostaa sinut myös tekoälyhakujen vastauksiin.', nappi: 'Lue lisää hakukoneoptimoinnista', href: '/hakukoneoptimointi' },
      { nimi: 'Graafinen suunnittelu', kuva: '/kortti-hero-design.webp', alt: 'Graafinen suunnittelu -sivun näkymä', ikoni: IK.ilme, otsikko: 'Yksi ilme, joka toimii käyntikortista pakettiauton kylkeen.', teksti: 'Logo, värit ja graafinen ohjeisto. Sama ilme viedään painotuotteisiin, teippauksiin ja kyltteihin asennettuna. Yksi tarjous, yksi lasku.', nappi: 'Lue lisää graafisesta suunnittelusta', href: '/graafinen-suunnittelu' }
    ]
const PALVELUT = PAL.map((p, i) => Object.assign({}, p, { top: 84 + i * 14, skaala: "1.0000", himmea: "0.000" }));
const REF = [
      { nimi: 'ColorMaster', ala: 'Lyhytvideot · autojen maalaus', kuva: '/referenssit/colormaster.webp' },
      { nimi: 'YDR Autohuolto', ala: 'Lyhytvideot · autohuolto', kuva: '/referenssit/ydr-autohuolto.webp' },
      { nimi: 'White Star', ala: 'Lyhytvideot · auton muodonmuutos', kuva: '/referenssit/white-star.webp' },
      { nimi: 'VauhtiVeikot', ala: 'Lyhytvideot · autotarvikkeet', kuva: '/referenssit/vauhtiveikot.webp' },
      { nimi: 'Laaksolahden Sähkö', ala: 'Lyhytvideot · ilmalämpöpumput', kuva: '/referenssit/ilmalampopumput.webp' }
    ]
const REFIT = REF.map((r, i) => { const on = i === 0; return Object.assign({}, r, { alt: r.nimi + ", lyhytvideon kansikuva", href: "#m-tulokset", sk: on ? 1 : 0.9, op: on ? 1 : 0.55, toisto: on ? "running" : "paused", piste: on ? 22 : 6, pisteVari: on ? "#6fecff" : "rgba(255,255,255,.28)" }); });
const IG = 'M7 3.5h10A3.5 3.5 0 0 1 20.5 7v10a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 17V7A3.5 3.5 0 0 1 7 3.5zM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM17 7h.01';
const TT = 'M14 4v10.5a3.3 3.3 0 1 1-3.3-3.3M14 4c.5 2.3 2 3.8 4.6 4.1';
const WEB = 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM3.5 12h17M12 3.5c2.4 2.4 3.4 5.2 3.4 8.5s-1 6.1-3.4 8.5c-2.4-2.4-3.4-5.2-3.4-8.5s1-6.1 3.4-8.5z';
const IGBG = 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)';
type Rivi = { l: string; nyt: string; ennen?: string };
type Tulos = { id: string; nimi: string; palvelu: string; luku: string; selite: string; logo: string; logoH: number; kick: string; tausta: string; video: boolean; sivusto: boolean; kuva?: string; alt?: string; kahva?: string; teimme: string; rivit: Rivi[]; linkit: { nimi: string; url: string; ikoni: string; bg: string }[] };
const TUL: Tulos[] = [
      { id: 'colormaster', nimi: 'Colormaster', palvelu: 'Lyhytvideot', luku: '1,6 milj.', selite: 'katselukertaa neljässä kuukaudessa', logo: '/mobiili/logot/colormaster.webp', logoH: 22, kick: 'Colormaster · automaalaamo', tausta: '/referenssit/colormaster-tausta.webp', video: true, sivusto: false, kuva: '/referenssit/colormaster.webp', alt: 'Colormasterin lyhytvideo puhelimessa', kahva: 'colormaster.fi',
        teimme: 'Suunnittelimme, kuvasimme ja editoimme lyhytvideot Instagramiin ja TikTokiin. Näkyvyys tuli pelkällä sisällöllä, ilman maksettua mainontaa.',
        rivit: [{ l: 'Katselukerrat, 4 kk', nyt: '1,6 milj.' }, { l: 'Seuraajat Instagramissa', nyt: '1 600' }, { l: 'Seuraajat TikTokissa', nyt: '2 651' }],
        linkit: [{ nimi: 'Instagram', url: 'https://www.instagram.com/colormaster.fi/', ikoni: IG, bg: IGBG }, { nimi: 'TikTok', url: 'https://www.tiktok.com/@color.master.oy', ikoni: TT, bg: '#000' }] },
      { id: 'ydr', nimi: 'YDR Autohuolto', palvelu: 'Lyhytvideot', luku: '1 milj.', selite: 'katselukertaa kolmessa kuukaudessa', logo: '/mobiili/logot/ydr-autohuolto.webp', logoH: 22, kick: 'YDR Autohuolto · autohuolto, Tuusula', tausta: '/referenssit/ydr-tausta.webp', video: true, sivusto: false, kuva: '/referenssit/ydr-autohuolto.webp', alt: 'YDR Autohuollon lyhytvideo puhelimessa', kahva: 'ydr_autohuolto',
        teimme: 'Some lähti liikkeelle lähes tyhjästä: TikTokissa ei ollut seuraajia lainkaan. Teemme korjaamon lyhytvideot Instagramiin ja TikTokiin alusta loppuun.',
        rivit: [{ l: 'Katselukerrat, 3 kk', nyt: '1 milj.' }, { l: 'Seuraajat Instagramissa', ennen: '250', nyt: '824' }, { l: 'Seuraajat TikTokissa', ennen: '0', nyt: '300' }],
        linkit: [{ nimi: 'Instagram', url: 'https://www.instagram.com/ydr_autohuolto/', ikoni: IG, bg: IGBG }, { nimi: 'TikTok', url: 'https://www.tiktok.com/@ydr_autohuolto', ikoni: TT, bg: '#000' }] },
      { id: 'laaksolahti', nimi: 'Laaksolahden Sähkö', palvelu: 'Verkkosivut ja SEO', luku: '35 → 10', selite: 'huoltosivun sija Googlessa kahdessa viikossa', logo: '/mobiili/logot/ls-monogram-color.webp', logoH: 26, kick: 'Laaksolahden Sähkö · sähkötyöt ja ilmalämpöpumput', tausta: '/referenssit/laaksolahti-tausta.webp', video: false, sivusto: true,
        teimme: 'Rakensimme sähköliikkeelle oman sivuston sähkötöille, ilmalämpöpumpuille, latausasemille ja aurinkopaneeleille. Vieritykseen sidotut videot esittelevät pumput, tuotekortista lähtee tarjouspyyntö ja kartoituksen voi varata suoraan kalenterista. Vanhat osoitteet siirrettiin niin, ettei hakuliikenne katkennut.',
        rivit: [{ l: 'Ilmalämpöpumpun huolto, sija Googlessa', ennen: '35', nyt: '10' }, { l: 'Sivuja', nyt: 'noin 50' }, { l: 'Kartoituksen ajanvaraus', nyt: 'verkossa' }, { l: 'Hakuklikit sivustonvaihdossa', nyt: 'ennallaan' }],
        linkit: [{ nimi: 'Avaa sivusto', url: 'https://laaksolahdensahko.fi/', ikoni: WEB, bg: '#007c8f' }] }
    ]
const TULOKSET = TUL.map((t) => Object.assign({}, t, {
  rivit: t.rivit.map((r) => ({ l: r.l, nyt: r.nyt, ennen: r.ennen || "" })),
  d: "/referenssit/laaksolahdensahko-case.webp", m: "/referenssit/ls-m-etu.webp", dAlt: "Laaksolahden Sähkön etusivu tietokoneella", mAlt: "Laaksolahden Sähkön etusivu puhelimella",
  rivit3: 3, sarakkeet: t.rivit.length === 4 ? 2 : 3, avaaTeksti: "Lue lisää",
}));
const TULOS_PISTEET = TUL.map((x, i) => ({ w: i === 0 ? 22 : 6, c: i === 0 ? "#6fecff" : "rgba(255,255,255,.25)" }));
const UKK = [
      { k: 'Paljonko lyhytvideotuotanto maksaa?', v: 'Jatkuva lyhytvideotuotanto alkaa 1 500 eurosta kuukaudessa + alv, ja hinta määräytyy videoiden määrän, kuvauspäivien ja kanavien mukaan. Yksittäiset videot ja kampanjatuotannot hinnoitellaan projekteina.', linkki: 'Lue lisää lyhytvideoista', href: '/lyhytvideot' },
      { k: 'Saanko samasta videosta versiot TikTokiin ja Instagram Reelsiin?', v: 'Saat. Sama kuvausmateriaali leikataan alustakohtaisiksi versioiksi TikTokiin, Instagram Reelsiin ja YouTube Shortsiin, ja tekstitykset, grafiikat ja alustakohtainen optimointi sisältyvät hintaan.', linkki: 'Lue lisää lyhytvideoista', href: '/lyhytvideot' },
      { k: 'Paljonko verkkosivut maksavat yritykselle?', v: 'Kiinteä projektihinta alkaa 1 490 eurosta + alv 25,5 %. Useamman sivun yrityssivusto asettuu 2 990–4 900 euroon ja täysin räätälöity toteutus alkaa 5 900 eurosta. Hinta sisältää suunnittelun, tekstit, teknisen hakukoneoptimoinnin ja julkaisun.', linkki: 'Lue lisää verkkosivuista', href: '/verkkosivut' },
      { k: 'Näkyykö hakukoneoptimoitu verkkosivu Googlessa heti julkaisun jälkeen?', v: 'Sivusto indeksoituu yleensä muutamassa päivässä, mutta sijoitukset kilpailluilla hauilla kertyvät kuukausien kuluessa. Realistinen aikajänne on 3–6 kuukautta, ja lopputulos riippuu siitä, tehdäänkö sisältötyötä myös julkaisun jälkeen.', linkki: 'Lue lisää verkkosivuista', href: '/verkkosivut' },
      { k: 'Kuinka nopeasti hakukoneoptimointi tuo tuloksia?', v: 'Ensimmäiset merkit näkyvät tyypillisesti 3–6 kuukauden kuluttua ja selvä vaikutus liiketoiminnassa 6–12 kuukauden kohdalla. Suunta näkyy kuitenkin ennen tuloksia: näyttökerrat hakutuloksissa kasvavat ennen kuin klikkaukset ja yhteydenotot kasvavat.', linkki: 'Lue lisää hakukoneoptimoinnista', href: '/hakukoneoptimointi' },
      { k: 'Paljonko graafinen suunnittelu maksaa?', v: 'Logo alkaa 690 eurosta ja yritysilme graafisine ohjeistoineen 1 490 eurosta. Painotuotteen suunnittelu alkaa 190 eurosta. Suomessa kokeneen graafisen suunnittelijan tuntihinta on tyypillisesti 70–120 euroa. Hintoihin lisätään alv 25,5 %.', linkki: 'Lue lisää graafisesta suunnittelusta', href: '/graafinen-suunnittelu' },
      { k: 'Mitä auton mainosteippaus maksaa?', v: 'Hinta riippuu laajuudesta: markkinoilla logoteippaus asettuu 200–500 euroon, osateippaus 400–1 500 euroon ja koko auton yliteippaus 1 500–4 000 euroon. Meidän hintamme alkaa 590 eurosta ja sisältää suunnittelun, materiaalit ja asennuksen.', linkki: 'Lue lisää graafisesta suunnittelusta', href: '/graafinen-suunnittelu' },
      { k: 'Kuka omistaa valmiit aineistot?', v: 'Sinä. Saat täydet käyttöoikeudet valmiisiin videoihin ja raakamateriaaliin sekä muokattavat alkuperäistiedostot ilmetyöstä, ja niistä sovitaan kirjallisesti ennen työn aloittamista. Voit käyttää aineistoja myös maksetussa mainonnassa, verkkosivuilla ja messuilla ilman lisäkorvausta.', linkki: 'Lue lisää lyhytvideoista', href: '/lyhytvideot' },
      { k: 'Onko pakko sitoutua pitkäksi aikaa?', v: 'Ei. Jatkuva yhteistyö jatkuu kuukausi kerrallaan ja irtisanomisaika on yksi kuukausi. Verkkosivut ja ilmetyöt ovat kiinteähintaisia projekteja, joissa ei ole kuukausisitoumusta lainkaan.', linkki: 'Lue lisää lyhytvideoista', href: '/lyhytvideot' },
      { k: 'Meillä ei ole ketään kameran eteen. Mitä teemme?', v: 'Tämä on yleisin huoli, eikä se ole este. Voimme hankkia esiintyjän puolestasi tai rakentaa sisällöt ilman puhuvaa päätä: tuote-, prosessi- ja kulissien takaa -sisällöt, tekstivetoiset videot ja asiakastarinat toimivat monella toimialalla jopa paremmin.', linkki: 'Lue lisää lyhytvideoista', href: '/lyhytvideot' }
    ]
const UKK_ = UKK.map((q, i) => { const auki = i === 0; return Object.assign({}, q, { auki, luokka: auki ? "e-faq auki" : "e-faq" }); });

export default function EtuMobiili() {
  return (
    <div className="mo-root mo-s-etu">
      {/* Heron ensimmainen elokuvaruutu heti (vain puhelimessa, media). */}
      <link rel="preload" as="image" href="/mobiili/film-ikkuna-0.webp" media="(max-width: 767px)" fetchPriority="high" />
      {/* Sivuston latausruutu (tyopoydan etusivulla heron oma). Ennen
          sisaltoa, jottei sisalto ehdi piirtya ennen ruutua. */}
      <Latausruutu />
      <div className="mo-e-root" style={{ position: "relative", background: "#0b0f14", color: "#f5f5f7" }}>
        {" "}
        {/* HERO: viesti näkyy heti, elokuva kelautuu ikkunassa vierityksen mukana */}
        {" "}
        <div style={{ height: "calc(650px + 200svh)", position: "relative" }}>
          {" "}
          <div data-teema="tumma" data-etu="hero" style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden", background: "#0b0f14" }}>
            {" "}
            <div style={{ position: "absolute", left: "0", right: "0", top: "0", height: "calc(100vw * 44 / 39)", transform: "translateY(0px)" }} data-etu="film">
              {" "}
              <div className="mo-e-film" role="img" aria-label="WS Media -tunnus syttyy ja kytkee puhelimen ja näytön yhteen" style={{ position: "absolute", inset: "0", backgroundPosition: "0% 0%" }} data-etu="ruutu"></div>
              {" "}
              <div style={{ position: "absolute", left: "0", right: "0", top: "0", height: "120px", background: "linear-gradient(180deg, rgba(11,15,20,.62), rgba(11,15,20,0))" }}></div>
              {" "}
              <div style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "190px", background: "linear-gradient(180deg, rgba(11,15,20,0) 0%, rgba(11,15,20,.55) 45%, #0b0f14 100%)" }}></div>
              {" "}
            </div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "calc(100svh - 70px)", transform: "translateX(-50%) translateY(6px)", display: "flex", alignItems: "center", gap: "12px", height: "58px", padding: "0 8px 0 6px", borderRadius: "999px", background: "rgba(12,17,23,.92)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12), 0 10px 30px -12px rgba(0,0,0,.7)", opacity: "1", whiteSpace: "nowrap", pointerEvents: "none" }} data-etu="vihje">
              {" "}
              <span style={{ position: "relative", width: "46px", height: "46px", borderRadius: "50%", overflow: "hidden", background: "#05090d", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.22)" }}>
                <i className="mo-e-kasi" style={{ position: "absolute", inset: "0", background: "url(/mobiili/hint-sormi-r.webp) 0 0 / 2300px 46px no-repeat", mixBlendMode: "screen" }}></i>
              </span>
              {" "}
              <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.15" }}>
                <b style={{ fontSize: "13.5px", fontWeight: "600", color: "#f5f5f7", letterSpacing: "-.005em" }}>
                  {"Vieritä alas"}
                </b>
                <span style={{ fontSize: "11.5px", color: "#a9b8c6" }}>
                  {"palvelut, työt ja hinnat"}
                </span>
              </span>
              {" "}
              <span style={{ position: "relative", width: "32px", height: "32px", marginLeft: "4px" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "block", transform: "rotate(-90deg)" }}>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2.5"></circle>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#6fecff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="81.7" strokeDashoffset="81.7" data-etu="rengas"></circle>
                </svg>
                <span style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5f5f7" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5"></path>
                  </svg>
                </span>
              </span>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "82px", textAlign: "left", transform: "translateY(0px)" }} data-etu="teksti">
              {" "}
              <h1 className="mo-e-tulo" style={{ margin: "0", fontSize: "40px", lineHeight: "1.06", letterSpacing: "-.02em", fontWeight: "640", color: "#f5f5f7" }}>
                {"Sisältöä, joka"}
                <span style={{ display: "block", height: "86px", color: "#6fecff" }}>
                  {" "}
                  {/* H1:ssa vain ensimmainen muoto. Muut sanat ovat
                      data-sanat-attribuutissa, josta EtuEfektit vaihtaa
                      tekstin ja kaynnistaa sisaantulon uudelleen. */}
                  <span className="mo-e-sana" data-sanat="tuo asiakkaita.|pysäyttää skrollauksen.|tekee kauppaa.|jää mieleen.">{"tuo asiakkaita."}</span>
                  {" "}
                </span>
              </h1>
              {" "}
              <p className="mo-e-tulo mo-e-t2" style={{ margin: "4px 0 0", fontSize: "16.5px", lineHeight: "1.55", color: "#d6d9e0" }}>
                {"Espoolainen mainostoimisto, jolta saat lyhytvideot, verkkosivut ja graafisen ilmeen. Kiinteä hinta, ei pitkiä sopimuksia. Sinä hyväksyt, me hoidamme loput."}
              </p>
              {" "}
              <div className="mo-e-tulo mo-e-t3" style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                {" "}
                <a data-ankkuri="lomake" role="link" tabIndex={0} className="mo-e-btn mo-e-p" style={{ flex: "1" }}>
                  {"Pyydä tarjous"}
                </a>
                {" "}
                <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-o" style={{ flex: "1" }}>
                  {"Varaa kartoitus"}
                </a>
                {" "}
              </div>
              {" "}
              <a data-ankkuri="tulokset" role="link" tabIndex={0} className="mo-e-tulo mo-e-t3" style={{ display: "inline-flex", alignItems: "center", gap: "4px", height: "44px", marginTop: "6px", fontSize: "16px", fontWeight: "500", color: "#b4f5ff", textDecoration: "none" }}>
                {"Katso tuloksia"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6"></path>
                </svg>
              </a>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#05080c", opacity: "0", pointerEvents: "none" }} data-etu="peitto"></div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        {/* VAALEA COVER: logonauha karjessa, sitten palvelut */}
        {" "}
        <div data-kerros="1" style={{ position: "relative", zIndex: "2", marginTop: "calc(-1 * 100svh)", borderRadius: "30px 30px 0 0", boxShadow: "0 -30px 70px -20px rgba(0,0,0,.65)", overflow: "clip" }}>
          {" "}
          <div aria-hidden="true" style={{ position: "sticky", top: "0", height: "100svh", marginBottom: "calc(-1 * 100svh)", zIndex: "0", pointerEvents: "none" }}>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#e1e8ef" }}></div>
            {" "}
            <canvas data-mo-verkko="" width="390" height="844" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100svh", display: "block" }}></canvas>
            {" "}
          </div>
          {" "}
          <section id="m-palvelut" data-teema="vaalea" data-verkko="palvelut" data-vari="#e1e8ef" style={{ position: "relative", zIndex: "1", color: "#1d1d1f" }}>
            {" "}
            <div aria-label="Asiakkaitamme" className="mo-e-nauha-w mo-rv-n" style={{ position: "relative", height: "104px", overflow: "hidden", WebkitMask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", mask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
              {" "}
              <div className="mo-e-nauha" style={{ position: "absolute", top: "34px", left: "0" }}>
                {" "}
                {(LOGOT).map((l: any, lI: number) => (
                  <Fragment key={lI}>
                    <img src={l.src} width={logoLeveys(l.src, l.h)} height={l.h} alt={l.alt} style={{ height: `${l.h}px`, width: "auto", display: "block" }} decoding="async" />
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "relative", padding: "18px 22px 0" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Neljä tapaa erottua. Yksi tiimi."}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "16px", fontSize: "18px", color: "#616166" }}>
                {"Video tuo huomion, sivusto tekee kaupan, hakunäkyvyys tuo ne jotka jo etsivät. Yksi ilme pitää kaiken kasassa."}
              </p>
              {" "}
            </div>
            {" "}
            <div data-pino='{"alku":84,"askel":14,"matka":-40,"sk":0.06,"hi":0.45}' style={{ position: "relative", padding: "24px 18px 28px" }}>
              {" "}
              <div data-verkko="tumma-alku" data-teema="tummaa" data-vari="#0b131d" aria-hidden="true" style={{ position: "absolute", left: "0", top: "42%", width: "1px", height: "1px", pointerEvents: "none" }}></div>
              {" "}
              {(PALVELUT).map((k: any, kI: number) => (
                <Fragment key={kI}>
                  {" "}
                  <article data-kortti="1" className="mo-e-svc mo-rv-k" style={{ top: `${k.top}px`, marginBottom: "22px", transform: `scale(${k.skaala})` }}>
                    {" "}
                    <div className="mo-e-svc-img">
                      <img src={TYHJA} data-mo-src={k.kuva} alt={k.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" decoding="async" />
                      <span data-kortti-himmea="" style={{ position: "absolute", inset: "0", background: "#05080c", opacity: k.himmea }}></span>
                    </div>
                    {" "}
                    <div className="mo-e-svc-txt" style={{ padding: "20px 22px 24px" }}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <span className="mo-e-ikoni" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d={k.ikoni}></path>
                          </svg>
                        </span>
                        <span className="mo-e-kick" style={{ color: "#007c8f" }}>
                          {k.nimi}
                        </span>
                      </div>
                      {" "}
                      <h3 style={{ margin: "0", fontSize: "21px", lineHeight: "1.2", letterSpacing: "-.014em", fontWeight: "620", color: "#1d1d1f" }}>
                        {k.otsikko}
                      </h3>
                      {" "}
                      <p style={{ margin: "10px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#616166" }}>
                        {k.teksti}
                      </p>
                      {" "}
                      <a href={k.href} className="mo-e-btn mo-e-p" style={{ height: "46px", marginTop: "20px", fontSize: "15.5px", boxShadow: "none" }}>
                        {k.nappi}
                      </a>
                      {" "}
                    </div>
                    {" "}
                  </article>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* REFERENSSIT */}
          {" "}
          <section id="m-referenssit" data-teema="tumma" data-verkko="referenssit" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", overflow: "hidden", padding: "48px 0 40px" }}>
            {" "}
            <div style={{ position: "relative", padding: "0 22px", textAlign: "center" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ color: "#f5f5f7" }}>
                {"Katso miltä työmme näyttää."}
              </h2>
              {" "}
            </div>
            {" "}
            <div className="mo-e-x mo-rv mo-d1" data-etu="refit" style={{ position: "relative", gap: "14px", padding: "34px 90px 26px" }}>
              {" "}
              {(REFIT).map((r: any, rI: number) => (
                <Fragment key={rI}>
                  {" "}
                  <a href={r.href} className="mo-e-ref mo-e-ref-w" style={{ transform: `scale(${r.sk})`, opacity: r.op }}>
                    {" "}
                    <img src={TYHJA} data-mo-src={r.kuva} alt={r.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" decoding="async" />
                    {" "}
                    <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 52%, rgba(0,0,0,.82) 100%)" }}></span>
                    {" "}
                    <span className="mo-e-prog">
                      <i style={{ animationPlayState: r.toisto }}></i>
                    </span>
                    {" "}
                    <span style={{ position: "absolute", left: "14px", right: "14px", bottom: "16px", textAlign: "left" }}>
                      <b style={{ display: "block", fontSize: "16px", fontWeight: "600" }}>
                        {r.nimi}
                      </b>
                      <span style={{ display: "block", marginTop: "2px", fontSize: "13px", lineHeight: "1.4", color: "#d2d2d7" }}>
                        {r.ala}
                      </span>
                    </span>
                    {" "}
                  </a>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
              {" "}
              {(REFIT).map((r: any, rI: number) => (
                <Fragment key={rI}>
                  <span style={{ width: `${r.piste}px`, height: "6px", borderRadius: "3px", background: r.pisteVari, transition: "width .35s, background-color .35s" }}></span>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-rv-z" data-laske="1" style={{ position: "relative", margin: "30px 16px 0", padding: "22px 20px 6px", borderRadius: "24px", background: "rgba(255,255,255,.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)" }}>
              {" "}
              <p style={{ margin: "0", fontSize: "11.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#8fa3b5" }}>
                {"Katselukertaa yhteensä"}
              </p>
              {" "}
              <div style={{ marginTop: "6px", fontSize: "50px", lineHeight: "1", letterSpacing: "-.045em", fontWeight: "680", color: "#6fecff", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                <span data-luku="5000000" data-luku-jalki="+">{"5 000 000+"}</span>
              </div>
              {" "}
              <div style={{ marginTop: "14px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
                <i style={{ display: "block", height: "100%", width: "100%", transform: "scaleX(1)", transformOrigin: "0 50%", borderRadius: "2px", background: "linear-gradient(90deg, #6fecff, #ff9a4d)" }} data-luku-palkki=""></i>
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "baseline", gap: "12px", padding: "16px 0", marginTop: "16px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                <span style={{ fontSize: "14px", lineHeight: "1.35", color: "#c9d6e2" }}>
                  {"katselukertaa yhdelle asiakkaalle 3 kk:ssa"}
                </span>
                <b style={{ fontSize: "26px", letterSpacing: "-.03em", fontWeight: "660", color: "#f5f5f7", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  <span data-luku="1000000" data-luku-jalki="+">{"1 000 000+"}</span>
                </b>
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                {" "}
                <div style={{ padding: "16px 12px 16px 0", borderRight: "1px solid rgba(255,255,255,.08)" }}>
                  <b style={{ display: "block", fontSize: "26px", letterSpacing: "-.03em", fontWeight: "660", color: "#f5f5f7", fontVariantNumeric: "tabular-nums" }}>
                    <span data-luku="150" data-luku-jalki="+">{"150+"}</span>
                  </b>
                  <span style={{ display: "block", marginTop: "4px", fontSize: "13px", lineHeight: "1.35", color: "#a9b8c6" }}>
                    {"toteutettua projektia"}
                  </span>
                </div>
                {" "}
                <div style={{ padding: "16px 0 16px 16px" }}>
                  <b style={{ display: "block", fontSize: "26px", letterSpacing: "-.03em", fontWeight: "660", color: "#f5f5f7", fontVariantNumeric: "tabular-nums" }}>
                    <span data-luku="8">{"8"}</span>
                  </b>
                  <span style={{ display: "block", marginTop: "4px", fontSize: "13px", lineHeight: "1.35", color: "#a9b8c6" }}>
                    {"arkipäivää keskim. toimitusaika"}
                  </span>
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* KARTOITUS: tiivis varauskortti, päivät ja ajat pyyhkäistävinä */}
          {" "}
          <section id="m-kartoitus" data-teema="tumma" data-verkko="kartoitus" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "20px 16px 72px" }}>
            {" "}
            <div className="mo-rv" style={{ position: "relative", overflow: "hidden", borderRadius: "28px", padding: "26px 20px 20px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.16)", color: "#fff" }}>
              {" "}
              <h2 style={{ position: "relative", margin: "0", fontSize: "27px", lineHeight: "1.1", letterSpacing: "-.018em", fontWeight: "640" }}>
                {"Katsotaan mitä sinun yrityksellesi "}
                <span style={{ color: "#6fecff" }}>
                  {"kannattaa tehdä."}
                </span>
              </h2>
              {" "}
              <p style={{ position: "relative", margin: "10px 0 0", fontSize: "15.5px", lineHeight: "1.55", color: "#b9c7d4" }}>
                {"Varaa aika suoraan kalenterista. Käymme läpi yrityksesi tarpeet ja kerromme rehellisesti, voimmeko auttaa. Ilman myyntipuhetta."}
              </p>
              {" "}
              <ul className="mo-rv-s" style={{ position: "relative", listStyle: "none", margin: "14px 0 0", padding: "0", display: "flex", gap: "6px" }}>
                <li className="mo-e-chip" style={{ height: "30px", padding: "0 11px", fontSize: "13px", color: "#eafcff", background: "rgba(111,236,255,.08)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.22)" }}>
                  {"30 minuuttia"}
                </li>
                <li className="mo-e-chip" style={{ height: "30px", padding: "0 11px", fontSize: "13px", color: "#eafcff", background: "rgba(111,236,255,.08)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.22)" }}>
                  {"Maksuton"}
                </li>
                <li className="mo-e-chip" style={{ height: "30px", padding: "0 11px", fontSize: "13px", color: "#eafcff", background: "rgba(111,236,255,.08)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.22)" }}>
                  {"Ei sitoumuksia"}
                </li>
              </ul>
              {" "}
              <EtuKalenteri />
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* TULOKSET: pyyhkäistävät tuloskortit */}
          {" "}
          <section id="m-tulokset" data-teema="tumma" data-verkko="tulokset" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "0 0 48px", color: "#f5f5f7" }}>
            {" "}
            <div className="mo-rv" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px", margin: "0 22px 18px" }}>
              {" "}
              <h2 className="mo-e-h2" style={{ color: "#f5f5f7" }}>
                {"Tulokset, joilla on väliä."}
              </h2>
              {" "}
              <span style={{ flex: "none", fontSize: "13px", fontWeight: "600", color: "#8fa3b5", fontVariantNumeric: "tabular-nums", paddingBottom: "4px" }}>
                <span data-etu="tulosnro">{"1"}</span>
                {" / 3"}
              </span>
              {" "}
            </div>
            {" "}
            <div className="mo-e-x mo-rv mo-d1" data-etu="tulokset" style={{ gap: "12px", padding: "4px 22px 8px", scrollPaddingLeft: "22px" }}>
              {" "}
              {(TULOKSET).map((t: any, tI: number) => (
                <Fragment key={tI}>
                  {" "}
                  <article className="mo-e-tk" style={{ flex: "0 0 318px", scrollSnapAlign: "start", position: "relative", borderRadius: "28px", overflow: "hidden", background: "#111a24", color: "#fff", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.14)" }}>
                    {" "}
                    <div style={{ position: "relative", height: "236px", overflow: "hidden" }}>
                      {" "}
                      <img src={TYHJA} data-mo-src={t.tausta} alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.15)" }} loading="lazy" decoding="async" />
                      {" "}
                      <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(14,20,27,.15) 0%, rgba(17,26,36,.35) 55%, #111a24 100%)" }}></span>
                      {" "}
                      <span style={{ position: "absolute", left: "14px", top: "14px", height: "32px", padding: "0 10px", borderRadius: "10px", background: "rgba(255,255,255,.94)", display: "flex", alignItems: "center" }}>
                        <img src={TYHJA} data-mo-src={t.logo} alt={t.nimi} style={{ height: `${t.logoH}px`, width: "auto", display: "block" }} loading="lazy" decoding="async" />
                      </span>
                      {" "}
                      <span style={{ position: "absolute", right: "14px", top: "17px", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#eafcff", background: "rgba(8,12,17,.55)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)", padding: "6px 10px", borderRadius: "999px", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14)" }}>
                        {t.palvelu}
                      </span>
                      {" "}
                      {t.video ? (
                        <>
                          {" "}
                          <div className="mo-e-puh" style={{ position: "absolute", left: "50%", bottom: "-40px", width: "106px", height: "222px", marginLeft: "-53px", borderRadius: "26px", padding: "4px", boxSizing: "border-box", background: "#05070a", boxShadow: "0 0 0 1px #2c323b, 0 26px 40px -16px rgba(0,0,0,.95)" }}>
                            {" "}
                            <img src={TYHJA} data-mo-src={t.kuva} alt={t.alt} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "22px", display: "block" }} loading="lazy" decoding="async" />
                            {" "}
                            <span style={{ position: "absolute", top: "11px", left: "50%", width: "36px", height: "10px", marginLeft: "-18px", borderRadius: "999px", background: "#000" }}></span>
                            {" "}
                            <span className="mo-e-prog" style={{ top: "auto", bottom: "56px", left: "14px", right: "14px" }}>
                              <i></i>
                            </span>
                            {" "}
                          </div>
                          {" "}
                        </>
                      ) : null}
                      {" "}
                      {t.sivusto ? (
                        <>
                          {" "}
                          <div className="mo-e-puh" style={{ position: "absolute", left: "22px", bottom: "18px", width: "214px", borderRadius: "9px", overflow: "hidden", background: "#05070a", boxShadow: "0 0 0 1px #2c323b, 0 24px 36px -16px rgba(0,0,0,.95)" }}>
                            <div style={{ height: "12px", display: "flex", alignItems: "center", gap: "3px", padding: "0 6px", background: "#1a1f27" }}>
                              <i style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#ff5f57" }}></i>
                              <i style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#febc2e" }}></i>
                              <i style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#28c840" }}></i>
                            </div>
                            <img src={TYHJA} data-mo-src={t.d} alt={t.dAlt} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", objectPosition: "top", display: "block" }} loading="lazy" decoding="async" />
                          </div>
                          {" "}
                          <div className="mo-e-puh" style={{ position: "absolute", right: "26px", bottom: "-30px", width: "80px", height: "166px", borderRadius: "16px", padding: "3px", boxSizing: "border-box", background: "#05070a", boxShadow: "0 0 0 1px #2c323b, 0 20px 30px -12px rgba(0,0,0,.95)" }}>
                            <img src={TYHJA} data-mo-src={t.m} alt={t.mAlt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", borderRadius: "13px", display: "block" }} loading="lazy" decoding="async" />
                          </div>
                          {" "}
                        </>
                      ) : null}
                      {" "}
                    </div>
                    {" "}
                    <div style={{ position: "relative", padding: "18px 20px 20px" }}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
                        <b style={{ fontSize: "40px", lineHeight: "1", letterSpacing: "-.035em", fontWeight: "680", color: "#6fecff", whiteSpace: "nowrap" }}>
                          {t.luku}
                        </b>
                      </div>
                      {" "}
                      <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.4", color: "#dbe5ee" }}>
                        {t.selite}
                      </p>
                      {" "}
                      <div style={{ display: "grid", gridTemplateColumns: `repeat(${t.sarakkeet}, minmax(0, 1fr))`, gap: "6px", marginTop: "16px" }}>
                        {" "}
                        {(t.rivit).map((r: any, rI: number) => (
                          <Fragment key={rI}>
                            {" "}
                            <div style={{ padding: "10px 10px 11px", borderRadius: "14px", background: "rgba(255,255,255,.045)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)" }}>
                              <span style={{ display: "block", fontSize: "11px", lineHeight: "1.3", color: "#9fb0bf", minHeight: "28px" }}>
                                {r.l}
                              </span>
                              <span style={{ display: "flex", alignItems: "baseline", gap: "5px", marginTop: "4px", whiteSpace: "nowrap" }}>
                                {r.ennen ? (
                                  <>
                                    <s style={{ fontSize: "12px", fontWeight: "600", color: "#6f8091" }}>
                                      {r.ennen}
                                    </s>
                                  </>
                                ) : null}
                                <b style={{ fontSize: "16px", fontWeight: "650", color: "#f4f7fa" }}>
                                  {r.nyt}
                                </b>
                              </span>
                            </div>
                            {" "}
                          </Fragment>
                        ))}
                        {" "}
                      </div>
                      {" "}
                      <p style={{ margin: "16px 0 0", fontSize: "14.5px", lineHeight: "1.55", color: "#c3d0dc", display: "-webkit-box", WebkitLineClamp: t.rivit3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        <b style={{ color: "#fff", fontWeight: "600" }}>
                          {"Mitä teimme. "}
                        </b>
                        {t.teimme}
                      </p>
                      {" "}
                      <button type="button" data-etu-avaa={tI} style={{ marginTop: "2px", height: "34px", padding: "0", border: "0", background: "none", font: "inherit", fontSize: "13.5px", fontWeight: "600", color: "#6fecff", cursor: "pointer" }}>
                        {t.avaaTeksti}
                      </button>
                      {" "}
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                        {" "}
                        {(t.linkit).map((l: any, lI: number) => (
                          <Fragment key={lI}>
                            {" "}
                            <a href={l.url} style={{ flex: "1", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "44px", borderRadius: "14px", background: "rgba(255,255,255,.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)", color: "#f4f7fa", fontSize: "13.5px", fontWeight: "600", textDecoration: "none" }}>
                              <span style={{ width: "22px", height: "22px", borderRadius: "6px", background: l.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d={l.ikoni}></path>
                                </svg>
                              </span>
                              {l.nimi}
                            </a>
                            {" "}
                          </Fragment>
                        ))}
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </article>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>
              {" "}
              {(TULOS_PISTEET).map((p: any, pI: number) => (
                <Fragment key={pI}>
                  <span style={{ width: `${p.w}px`, height: "6px", borderRadius: "3px", background: p.c, transition: "width .35s, background-color .35s" }}></span>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* UKK */}
          {" "}
          <section id="m-ukk" data-teema="vaalea" data-verkko="ukk" data-verkko-alfa="0.12" data-vari="#dae2eb" style={{ position: "relative", zIndex: "1", padding: "56px 22px 48px", color: "#11151a" }}>
            {" "}
            <div className="mo-rv">
              {" "}
              <h2 className="mo-e-h2" style={{ fontSize: "30px", color: "#11151a" }}>
                {"Usein kysytyt kysymykset"}
              </h2>
              {" "}
              <p className="mo-e-lead" style={{ marginTop: "14px", color: "#4a5560" }}>
                {"Hinnat, tulosten aikataulu, aineistojen omistus ja sitoutuminen. Nämä kysytään useimmin ensimmäisessä puhelussa."}
              </p>
              {" "}
              <p style={{ margin: "20px 0 0", fontSize: "11.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#4a5560" }}>
                {"Etkö löytänyt vastausta?"}
              </p>
              {" "}
              <a data-ankkuri="lomake" role="link" tabIndex={0} style={{ display: "inline-flex", alignItems: "center", minHeight: "40px", fontSize: "17px", fontWeight: "600", color: "#007c8f", textDecoration: "none" }}>
                {"Kysy suoraan, vastaamme 24 tunnissa"}
              </a>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-d1" style={{ marginTop: "18px" }}>
              {" "}
              {(UKK_).map((q: any, qI: number) => (
                <div data-ukk-rivi={qI} hidden={qI >= 5}>
                  {" "}
                  <button type="button" className={mo(q.luokka)} data-ukk={qI} aria-expanded={q.auki}>
                    {q.k}
                    <span className="mo-e-plus" aria-hidden="true"></span>
                  </button>
                  {" "}
                  <div className="mo-e-vast" data-ukk-vast={qI} hidden={!q.auki} style={{ padding: "0 0 20px" }}>
                        <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.65", color: "#4a5560" }}>
                          {q.v}
                        </p>
                        <a href={q.href} style={{ display: "inline-flex", alignItems: "center", minHeight: "40px", marginTop: "4px", fontSize: "16px", fontWeight: "500", color: "#007c8f", textDecoration: "none" }}>
                          {q.linkki}
                          {" →"}
                        </a>
                      </div>
                  {" "}
                </div>
              ))}
              {" "}
              <div style={{ borderTop: "1px solid rgba(17,21,26,.12)" }}></div>
              {" "}
              {true ? (
                <>
                  <button type="button" data-ukk-kaikki="" className="mo-e-btn" style={{ width: "100%", marginTop: "18px", background: "rgba(255,255,255,.6)", color: "#11151a", boxShadow: "inset 0 0 0 1px rgba(17,21,26,.12)" }}>
                    {"Näytä kaikki 10 kysymystä"}
                  </button>
                </>
              ) : null}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* YHTEYDENOTTO */}
          {" "}
          <section id="m-lomake" data-teema="tumma" data-verkko="lomake" data-vari="#dae2eb" style={{ position: "relative", zIndex: "1", overflow: "hidden", padding: "56px 0 44px", background: "#080d13" }}>
            {" "}
            <img src={TYHJA} data-mo-src="/kuvat/tarjous-kortit.webp" alt="" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "620px", objectFit: "cover", objectPosition: "14% 0%", opacity: ".5", WebkitMask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)", mask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)" }} loading="lazy" decoding="async" />
            {" "}
            <div style={{ position: "relative", padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ color: "#fff" }}>
                {"Kerro, mitä "}
                <span style={{ color: "#6fecff" }}>
                  {"tarvitset."}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "16px", color: "#c9d6e2" }}>
                {"Kerromme suoraan, mitä ehdotamme ja mitä se maksaa, myös silloin kun vastaus on ei. Voit myös soittaa numeroon "}
                <a href="tel:+358405648770">
                  {"040 564 8770"}
                </a>
                {" tai kirjoittaa osoitteeseen "}
                <a href="mailto:info@wsmedia.fi">
                  {"info@wsmedia.fi"}
                </a>
                {"."}
              </p>
              {" "}
              <ol className="mo-rv mo-d2" style={{ listStyle: "none", margin: "28px 0 0", padding: "0", display: "flex", flexDirection: "column" }}>
                {" "}
                <li className="mo-e-askel" style={{ display: "grid", gridTemplateColumns: "32px minmax(0, 1fr)", gap: "14px" }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: "32px", height: "32px", borderRadius: "50%", boxShadow: "inset 0 0 0 1.5px #6fecff", color: "#6fecff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600" }}>
                      {"1"}
                    </span>
                    <span style={{ flex: "1", width: "1.5px", minHeight: "22px", background: "linear-gradient(#6fecff, rgba(111,236,255,.15))" }}></span>
                  </span>
                  <div style={{ paddingBottom: "18px" }}>
                    <b style={{ fontSize: "19px", fontWeight: "620" }}>
                      {"24 h"}
                    </b>
                    <p style={{ margin: "2px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#a9b8c6" }}>
                      {"Luemme viestin ja vastaamme sähköpostilla."}
                    </p>
                  </div>
                </li>
                {" "}
                <li className="mo-e-askel" style={{ display: "grid", gridTemplateColumns: "32px minmax(0, 1fr)", gap: "14px" }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: "32px", height: "32px", borderRadius: "50%", boxShadow: "inset 0 0 0 1.5px rgba(111,236,255,.55)", color: "#6fecff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600" }}>
                      {"2"}
                    </span>
                    <span style={{ flex: "1", width: "1.5px", minHeight: "22px", background: "rgba(111,236,255,.15)" }}></span>
                  </span>
                  <div style={{ paddingBottom: "18px" }}>
                    <b style={{ fontSize: "19px", fontWeight: "620" }}>
                      {"30 min"}
                    </b>
                    <p style={{ margin: "2px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#a9b8c6" }}>
                      {"Kartoitus: nykytila, tavoite ja mikä palvelu sopii."}
                    </p>
                  </div>
                </li>
                {" "}
                <li className="mo-e-askel" style={{ display: "grid", gridTemplateColumns: "32px minmax(0, 1fr)", gap: "14px" }}>
                  <span style={{ width: "32px", height: "32px", borderRadius: "50%", boxShadow: "inset 0 0 0 1.5px rgba(111,236,255,.4)", color: "#6fecff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600" }}>
                    {"3"}
                  </span>
                  <div>
                    <b style={{ fontSize: "19px", fontWeight: "620" }}>
                      {"Tarjous"}
                    </b>
                    <p style={{ margin: "2px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#a9b8c6" }}>
                      {"Kirjallinen ehdotus hintoineen. Ei sitoumuksia ennen hyväksyntää."}
                    </p>
                  </div>
                </li>
                {" "}
              </ol>
              {" "}
              <form className="mo-rv mo-rv-s" data-etu="lomake" style={{ marginTop: "30px", padding: "22px 18px 20px", borderRadius: "24px", background: "linear-gradient(180deg, rgba(22,34,48,.88), rgba(12,19,28,.92))", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1), 0 40px 80px -40px rgba(0,0,0,.9)", display: "flex", flexDirection: "column", gap: "14px" }}>
                {" "}
                <div>
                  <b style={{ fontSize: "22px", fontWeight: "620", letterSpacing: "-.01em" }}>
                    {"Tarjouspyyntö"}
                  </b>
                  <p style={{ margin: "4px 0 0", display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#a9b8c6" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3ddc84" }}></span>
                    {"Vastaamme 24 tunnin sisällä"}
                  </p>
                </div>
                {" "}
                <label className="mo-e-in">
                  {"Nimi"}
                  <input type="text" name="nimi" autoComplete="name" />
                </label>
                {" "}
                <label className="mo-e-in">
                  {"Sähköposti"}
                  <input type="email" name="email" autoComplete="email" inputMode="email" />
                </label>
                {" "}
                <label className="mo-e-in">
                  {"Puhelinnumero"}
                  <input type="tel" name="puhelin" autoComplete="tel" inputMode="tel" />
                </label>
                {" "}
                <label className="mo-e-in">
                  {"Paikkakunta"}
                  <input type="text" name="paikkakunta" autoComplete="address-level2" />
                </label>
                {" "}
                <label className="mo-e-in">
                  {"Mitä haluaisit saada aikaan?"}
                  <textarea name="viesti" rows={4} style={{ height: "112px", paddingTop: "13px", resize: "none" }} />
                </label>
                {" "}
                <p className="mo-e-vast" data-etu="kiitos" hidden style={{ margin: "0", padding: "12px 14px", borderRadius: "12px", background: "rgba(111,236,255,.1)", color: "#b4f5ff", fontSize: "14.5px" }}>
                      {"Kiitos. Vastaamme 24 tunnin sisällä."}
                    </p>
                {" "}
                <button type="submit" className="mo-e-btn mo-e-p" style={{ width: "100%", height: "54px", marginTop: "4px", fontSize: "16.5px", fontWeight: "600" }}>
                  {"Lähetä tarjouspyyntö"}
                </button>
                {" "}
                <p style={{ margin: "0", textAlign: "center", fontSize: "12.5px", color: "#8fa3b3" }}>
                  {"Ei sitoumuksia."}
                </p>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12.5px", color: "#6f8191" }}>
                  <span style={{ flex: "1", height: "1px", background: "rgba(255,255,255,.1)" }}></span>
                  {"tai"}
                  <span style={{ flex: "1", height: "1px", background: "rgba(255,255,255,.1)" }}></span>
                </div>
                {" "}
                <a href="/yhteystiedot" data-varaus="" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)", color: "#e6f6fa", fontSize: "14.5px", fontWeight: "600", textDecoration: "none" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5"></rect>
                    <path d="M3.5 10h17M8 3v4M16 3v4"></path>
                  </svg>
                  {"Varaa 30 min kartoitus"}
                </a>
                {" "}
                <a href="tel:+358405648770" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)", color: "#e6f6fa", fontSize: "14.5px", fontWeight: "600", textDecoration: "none" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path>
                  </svg>
                  {"040 564 8770"}
                </a>
                {" "}
              </form>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <Alatunniste etusivu />
        </div>
      </div>
      <Kuori reitti="/" />
      <Moottori otsake={{ tapa: "iso", ka: 650, piilo: 156, lasi: -14, teema: true }} verkko={{ siemen: 7, tila: "etu", pohja: [225, 232, 239] }} />
      <EtuEfektit />
    </div>
  );
}
