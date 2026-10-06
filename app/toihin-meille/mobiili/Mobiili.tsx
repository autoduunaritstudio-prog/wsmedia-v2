/* TOIHIN MEILLE, PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Toihin.dc.html: rakenne,
   tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on muunnettu
   koneellisesti (dc2jsx.mjs + _mobiili-design/tyokalut/toihin.py) ja
   vierityksen arvot on korvattu alkutilalla; Efektit.tsx ja Moottori.tsx
   kirjoittavat ne suoraan DOMiin. Valilehtien, karusellin ja UKK:n kaikki
   sisalto on HTML:ssa (suljetut hidden). Naytetaan vain max-width: 767px.

   Poikkeama suunnitelmasta: prosessin edistymispalkki animoi leveytta
   (width .3s); tassa sama nakyma transformilla (scaleX .3s). */
import "./mobiili.css";
import "./lisat.css";
import { Fragment } from "react";
import { mo, TYHJA } from "@/app/components/mobiili/mo";
import Kuori from "@/app/components/mobiili/Kuori";
import Alatunniste from "@/app/components/mobiili/Alatunniste";
import Moottori from "@/app/components/mobiili/Moottori";
import Efektit from "./Efektit";
import { HMALLIT, askelTyyli, hMalliTyyli, malliTyyli, rooliTyyli, taitoTyyli } from "./tilat";

/* ---- Suunnitelman renderVals()-tiedot sellaisenaan ---- */
const LUOTTO = [{ t: 'Toimeksianto tai työsuhde', ikoni: 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 7h16v12H4zM4 12h16' }, { t: 'Etätyö, koko Suomi', ikoni: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z' }, { t: 'Vastaamme viikon sisällä', ikoni: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2' }];
const SYY = [
      { t: 'Työ ei lopu yhteen kanavaan', v: 'Sama asiakas tarvitsee usein videot, verkkosivuston, hakukoneoptimoinnin ja teippaukset. Kun yksi projekti päättyy, seuraava alkaa yleensä samasta talosta, joten uutta toimeksiantoa ei tarvitse etsiä joka kuukausi.', ikoni: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4' },
      { t: 'Teet sitä, mitä osaat parhaiten', v: 'Emme odota, että sama ihminen kuvaa, koodaa ja piirtää. Kokoamme tiimin projektin mukaan. Jos olet erinomainen editoija, sinun ei tarvitse opetella hakukoneoptimointia.', ikoni: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.7 6.7 19.6l1.1-6L3.4 9.4l6-.8z' },
      { t: 'Briefit ovat valmiiksi mietittyjä', v: 'Saat tavoitteen, aikataulun, tekniset vaatimukset ja tarvittavan aineiston. Emme lähetä toimeksiantoa, jonka sisältö selviää vasta kolmannessa puhelussa.', ikoni: 'M8 3h8l4 4v14H4V3h4zM16 3v4h4M8 12h8M8 16h5' },
      { t: 'Maksamme ajallaan', v: 'Laskun maksuaika on 14 päivää, eikä sitä venytetä. Sovittu hinta on se hinta, joka maksetaan, myös silloin kun projekti venyy asiakkaan takia.', ikoni: 'M3 7h18v10H3zM3 10h18M7 14h3' }
    ];
const SYYT = SYY.map((v, i) => Object.assign({}, v, { nro: '0' + (i + 1), top: 76 + i * 12 }));
const ROO = [
      { lyhyt: 'Video', kick: 'VIDEO', otsikko: 'Kuvaajat, editoijat ja motion designerit', kuvaus: 'Lyhytvideotuotanto on suurin yksittäinen palvelumme. Kuvaamme asiakkaiden tiloissa ja tuotamme jatkuvia videosarjoja kuukaudesta toiseen.', rivit: ['Lyhytvideoiden kuvaus asiakkaan tiloissa', 'Editointi, tekstitys ja alustakohtaiset versiot', 'Motion graphics ja animoidut grafiikat', 'Yritysvideokuvaus ja haastattelut'], tyokalut: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', '9:16', 'Värimäärittely'], ikoni: 'M11 4h10a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM14 12l6 4-6 4z' },
      { lyhyt: 'Verkko', kick: 'VERKKO JA NÄKYVYYS', otsikko: 'Kehittäjät, hakukoneoptimoijat ja sisällöntuottajat', kuvaus: 'Rakennamme verkkosivustoja käsin koodattuna ja WordPressillä, ja teemme niille jatkuvaa hakukoneoptimointia ja sisältöä.', rivit: ['Next.js- ja React-toteutukset', 'WordPress-teemat, lisäosat ja ylläpito', 'Tekninen hakukoneoptimointi ja auditoinnit', 'Hakukoneoptimoitu sisällöntuotanto suomeksi'], tyokalut: ['Next.js', 'React', 'WordPress', 'Search Console', 'Schema.org'], ikoni: 'M5 7a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM5 11h22M13 16l-3 2 3 2M19 16l3 2-3 2' },
      { lyhyt: 'Grafiikka', kick: 'GRAAFINEN SUUNNITTELU', otsikko: 'Graafiset suunnittelijat', kuvaus: 'Suunnittelemme yritysilmeitä ja viemme ne kaikille pinnoille: painotuotteisiin, ajoneuvoteippauksiin ja julkisivuihin.', rivit: ['Logot, yritysilmeet ja graafiset ohjeistot', 'Painovalmiit aineistot ja taitto', 'Ajoneuvo- ja julkisivuteippausten suunnittelu', 'Some- ja mainosmateriaalien pohjat'], tyokalut: ['Illustrator', 'InDesign', 'Figma', 'CMYK', 'Vektorointi'], ikoni: 'M16 4a12 12 0 1 0 0 24c1.6 0 2.4-1 2.4-2.2 0-1.8-1.4-2.1-1.4-3.6 0-1.3 1-2.2 2.4-2.2h2.8c2.7 0 5-2.1 5-5C27.2 8 22.2 4 16 4zM10 15h.01M13 10h.01M19 9h.01' },
      { lyhyt: 'Tuotanto', kick: 'TUOTANTO JA KUMPPANIT', otsikko: 'Asentajat, painotalot ja materiaalitoimittajat', kuvaus: 'Emme teippaa emmekä paina itse, vaan käytämme alihankintaverkostoa. Etsimme luotettavia kumppaneita eri paikkakunnilta.', rivit: ['Ajoneuvo- ja julkisivuteippausten asennus', 'Digipainot ja suurkuvatulostus', 'Valomainosten valmistus ja asennus'], tyokalut: ['Koko Suomi', 'Tarrakalvot', 'Suurkuva', 'Valomainokset', 'Asennus'], ikoni: 'M4 22l8-8M14 6l6-2-2 6-8 8-4-4zM20 20l4 4M18 26l8-8' }
    ];
const ROOLIT = ROO.map((r, i) => Object.assign({ lyhyt: r.lyhyt, ikoni: r.ikoni, on: i === 0 }, rooliTyyli(i === 0)));
const MAL = [
      { nimi: 'Freelancerina', tag: 'Yleisin aloitus', kuvaus: 'Laskutat tehdystä työstä. Kevytyrittäjyys käy, y-tunnusta ei tarvita.', sina: ['Sovimme hinnan aina ennen toimeksiannon aloittamista', 'Valitset itse, mitkä keikat otat vastaan', 'Työskentelet omilla välineilläsi ja omassa aikataulussasi', 'Laskun maksuaika on 14 päivää'], me: ['Toimitamme valmiiksi mietityn briefin ja tarvittavan aineiston', 'Annamme suoran yhteyshenkilön, ei ketjutettua viestintää', 'Tarjoamme jatkuvia toimeksiantoja, emme yksittäisiä keikkoja', 'Kerromme, miten työ meni asiakkaalla', 'Emme kilpailuta samaa työtä viidellä tekijällä'] },
      { nimi: 'Työsuhteessa', tag: 'Muutaman projektin jälkeen', kuvaus: 'Vakituinen paikka, kun yhteistyötä on takana muutama projekti.', sina: ['Kuukausipalkka ja työterveyshuolto', 'Työvälineet ja ohjelmistolisenssit talon puolesta', 'Etätyö tai toimisto Espoossa, sinä valitset', 'Selkeä rooli, ei kaikkea kaikille'], me: ['Vakituinen paikka kasvavassa yrityksessä', 'Mahdollisuus vaikuttaa siihen, mitä ja miten tehdään', 'Koulutus ja aika oman osaamisen kehittämiseen', 'Ei mikromanagerointia, vastaat omasta työstäsi'] }
    ];
const MALLIT = MAL.map((m, i) => Object.assign({ nimi: m.nimi, on: i === 0 }, malliTyyli(i === 0)));
const ASK = [{ t: 'Lähetä hakemus', v: 'Täytä lomake ja liitä linkki työnäytteisiin. Ansioluetteloa ei tarvita: portfolio, showreel tai GitHub riittää.', aika: '5 minuuttia' }, { t: 'Lyhyt puhelu', v: 'Käymme läpi, mitä osaat, mitä haluat tehdä ja millä hinnalla. Kerromme rehellisesti, onko meillä sinulle töitä juuri nyt.', aika: 'Noin 30 min' }, { t: 'Ensimmäinen toimeksianto', v: 'Aloitamme pienellä ja selkeärajaisella työllä. Jos se sujuu molemmin puolin, jatkoa tulee ilman erillistä hakuprosessia.', aika: 'Sovitusti' }];
const ASKELEET = ASK.map((a, i) => Object.assign({}, a, { n: i + 1 }, askelTyyli(i, 0)));
const OK = 'M5 12.5l4.2 4L19 7', EI = 'M7 7l10 10M17 7 7 17';
const ODO = [['', 'Että osaat oman alasi hyvin. Yksi asia erittäin hyvin on parempi kuin viisi keskinkertaisesti.'], ['', 'Että vastaat viesteihin arkipäivän sisällä'], ['', 'Että kerrot ajoissa, jos aikataulu ei pidä'], ['', 'Että työnäytteet ovat omaa työtäsi'], ['', 'Suomen kielen taitoa, koska asiakastyö tehdään suomeksi']];
const EIV = [['Tutkintoa. ', 'Portfolio ratkaisee, ei paperi.'], ['Kokopäiväistä sitoutumista. ', 'Yksikin keikka kuukaudessa käy.'], ['Että asut pääkaupunkiseudulla. ', 'Työ tehdään etänä, kuvaukset ja asennukset paikan päällä.'], ['Että osaat kaikkea. ', 'Emme etsi yleismiehiä.'], ['Valmista y-tunnusta. ', 'Kevytyrittäjyys riittää.']];
/* Molemmat listat HTML:ssa (suunnitelmassa vain valittu): od 0 ja od 1. */
const OD_LISTAT = [0, 1].map((od) => ({ avain: od, reuna: od === 0 ? 'rgba(111,236,255,.22)' : 'rgba(255,154,77,.28)', ikBg: od === 0 ? 'rgba(111,236,255,.16)' : 'rgba(255,154,77,.16)', ikVari: od === 0 ? '#6fecff' : '#ff9a4d', ikoni: od === 0 ? OK : EI, rivit: (od === 0 ? ODO : EIV).map((r, i) => ({ a: r[0], b: r[1], raja: i ? '1px solid rgba(255,255,255,.07)' : '0' })) }));
const FAKTAT = [['Asiakkaat', 'Pienet ja keskisuuret yritykset'], ['Sopimukset', 'Pääosin jatkuvia kuukausisopimuksia'], ['Työ', 'Etänä, kuvaukset ja asennukset paikan päällä'], ['Kuvaukset', 'Painottuvat pääkaupunkiseudulle'], ['Laskutus', 'Kevytyrittäjyys käy, maksuaika 14 pv'], ['Haku', 'Jatkuva, vastaus viikon sisällä']].map((f) => ({ l: f[0], v: f[1] }));
const UKK_ = [
      {"k": "Onko teillä juuri nyt avoimia työpaikkoja?", "v": "Meillä on jatkuva avoin haku. Emme ilmoita erikseen määräaikaisia hakuja, vaan otamme yhteyttä silloin kun sopiva toimeksianto tulee vastaan. Siksi hakemus kannattaa jättää, vaikka juuri nyt ei olisi mitään auki."},
      {"k": "Voinko hakea, vaikka olen vasta aloittelija?", "v": "Voit. Emme katso työvuosia vaan työnäytteitä. Jos portfoliosta näkee, että osaat asian, kokemuksen pituudella ei ole väliä. Aloitamme silloin pienemmällä toimeksiannolla."},
      {"k": "Tarvitseeko minulla olla y-tunnus?", "v": "Ei tarvitse. Kevytyrittäjyyspalvelun kautta laskuttaminen käy täysin. Jos et ole vielä laskuttanut kenellekään, neuvomme miten se hoituu."},
      {"k": "Missä työ tehdään?", "v": "Suunnittelu, editointi, koodaus ja sisällöntuotanto tehdään etänä, joten paikkakunnalla ei ole väliä. Kuvaukset tehdään asiakkaan tiloissa ja teippausten asennukset siellä missä ajoneuvot ja toimitilat ovat."},
      {"k": "Kuinka paljon töitä voin odottaa?", "v": "Se riippuu osaamisalueesta ja siitä, kuinka paljon otat vastaan. Emme lupaa tiettyä määrää etukäteen. Videopuolella toimeksiantoja on eniten, koska useimmat asiakkuudet ovat jatkuvia kuukausisopimuksia."},
      {"k": "Miten hinnoittelu toimii freelancerina?", "v": "Kerrot oman tuntihintasi tai projektihintasi, ja sovimme hinnan ennen jokaisen toimeksiannon aloittamista. Emme tingi jälkikäteen emmekä pyydä tekemään lisätyötä samalla hinnalla."},
      {"k": "Milloin lasku maksetaan?", "v": "Maksuaika on 14 päivää laskun päiväyksestä. Jos toimeksianto on pitkä, sovimme osalaskutuksesta etukäteen."},
      {"k": "Millaisia työnäytteitä odotatte?", "v": "Sellaisia, jotka olet itse tehnyt. Yksi hyvin tehty työ kertoo enemmän kuin kymmenen keskinkertaista. Kerro myös lyhyesti, mikä osuus työstä oli sinun, jos se on tehty tiimissä."},
      {"k": "Voinko tehdä töitä oman päivätyöni ohella?", "v": "Voit, ja moni tekeekin. Toimeksiannot sovitaan aina erikseen, joten voit ottaa vastaan sen verran kuin kalenteriisi mahtuu."},
      {"k": "Milloin kuulen hakemuksestani?", "v": "Vastaamme viikon sisällä, myös silloin kun vastaus on ei. Jos sopivaa toimeksiantoa ei ole heti, säilytämme hakemuksen ja otamme yhteyttä myöhemmin."}
    ];
const UKK = UKK_.map((q, i) => { const auki = i === 0; return Object.assign({}, q, { auki, luokka: auki ? 'l-faq auki' : 'l-faq' }); });
const TAI = ['Videokuvaus', 'Editointi', 'Motion graphics', 'Verkkokehitys', 'Hakukoneoptimointi', 'Sisällöntuotanto', 'Graafinen suunnittelu', 'Teippaus tai asennus'];
const TAIDOT = TAI.map((n) => Object.assign({ n, on: false }, taitoTyyli(false)));
const HMALLI = HMALLIT.map((n, i) => Object.assign({ n }, hMalliTyyli(i === 0)));

export default function ToihinMobiili() {
  return (
    <div className="mo-root mo-s-toihin">
      {/* Heron ainoa kuva on vieritysvihjeen sormisprite (inline-tausta, jonka
          selain loytaisi vasta tyylien jalkeen). Heron tekstit nousevat
          sisaantuloanimaatiolla, joten Chrome kirjaa LCP:ksi taman kuvan:
          haetaan heti, vain puhelimessa. */}
      <link rel="preload" as="image" href="/mobiili/hint-sormi-r.webp" media="(max-width: 767px)" fetchPriority="high" />
      <div className="mo-e-root" style={{ position: "relative", background: "#0b0f14", color: "#f5f5f7" }}>
        {" "}
        {/* HERO: työkalut kerääntyvät tiimiksi vierityksen mukana */}
        {" "}
        <div style={{ height: "calc(300px + 200svh)", position: "relative" }}>
          {" "}
          <div data-teema="tumma" style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden", background: "radial-gradient(120% 70% at 80% 0%, #1d3453 0%, #0b0f14 64%)" }}>
            {" "}
            <svg className="mo-t-net" viewBox="0 0 390 844" width="390" height="844" aria-hidden="true" style={{ position: "absolute", inset: "0", opacity: ".5" }}>
              <g fill="none" stroke="rgba(111,236,255,.28)" strokeWidth="1">
                <path d="M30 150 L140 90 L262 170 L360 110"></path>
                <path d="M140 90 L196 260 L262 170"></path>
                <path d="M20 420 L120 330 L196 260 L330 330 L372 470"></path>
                <path d="M120 330 L60 560 L210 640 L330 330"></path>
                <path d="M210 640 L360 720"></path>
              </g>
              <g fill="#6fecff">
                <circle cx="140" cy="90" r="2.5"></circle>
                <circle cx="262" cy="170" r="2.5" style={{ animationDelay: "-.8s" }}></circle>
                <circle cx="196" cy="260" r="3" style={{ animationDelay: "-1.6s" }}></circle>
                <circle cx="120" cy="330" r="2.5" style={{ animationDelay: "-2.2s" }}></circle>
                <circle cx="330" cy="330" r="2.5" style={{ animationDelay: "-.4s" }}></circle>
                <circle cx="60" cy="560" r="2.5" style={{ animationDelay: "-1.2s" }}></circle>
                <circle cx="210" cy="640" r="2.5" style={{ animationDelay: "-2.6s" }}></circle>
                <circle cx="360" cy="110" r="2" style={{ animationDelay: "-2s" }}></circle>
              </g>
            </svg>
            {" "}
            <div className="mo-t-glow" style={{ left: "-60px", top: "150px", opacity: ".55" }}></div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "calc(100svh - 140px)", transform: "translateX(-50%) translateY(6px)", display: "flex", alignItems: "center", gap: "12px", height: "58px", padding: "0 8px 0 6px", borderRadius: "999px", background: "rgba(12,17,23,.62)", WebkitBackdropFilter: "blur(14px) saturate(1.3)", backdropFilter: "blur(14px) saturate(1.3)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12), 0 10px 30px -12px rgba(0,0,0,.7)", opacity: "1", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "6" }} data-toihin="vihje">
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
                  {"roolit, työmalli ja haku"}
                </span>
              </span>
              {" "}
              <span style={{ position: "relative", width: "32px", height: "32px", marginLeft: "4px" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "block", transform: "rotate(-90deg)" }}>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2.5"></circle>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#6fecff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="81.7" strokeDashoffset="81.7" data-toihin="rengas"></circle>
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
            <div style={{ position: "absolute", left: "20px", right: "20px", top: "112px", display: "flex", flexDirection: "column", gap: "14px", transform: "translateY(0px)", zIndex: "6" }} data-toihin="teksti">
              {" "}
              <h1 className="mo-t-li mo-t-d1" style={{ margin: "0", fontSize: "40px", lineHeight: "1.06", letterSpacing: "-0.035em", fontWeight: "700", color: "#fff" }}>
                {"Töihin WS Medialle"}
              </h1>
              {" "}
              <p className="mo-t-li mo-t-d2" style={{ margin: "0", display: "flex", alignItems: "center", gap: "14px", fontSize: "52px", lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "700", color: "#6fecff", textShadow: "0 0 40px rgba(111,236,255,.35)", whiteSpace: "nowrap" }}>
                {"Avoin haku"}
                <i className="mo-t-live" style={{ flex: "none", width: "12px", height: "12px" }}></i>
              </p>
              {" "}
              <p className="mo-t-li mo-t-d2" style={{ margin: "0", fontSize: "17px", lineHeight: "1.55", color: "rgba(255,255,255,.8)" }}>
                {"Etsimme jatkuvasti tekijöitä videoon, verkkosivuihin, hakukoneoptimointiin ja grafiikkaan. Töitä voi tehdä freelancerina tai työsuhteessa."}
              </p>
              {" "}
              <div className="mo-t-li mo-t-d3" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px", marginTop: "6px" }}>
                {" "}
                <a data-ankkuri="hakemus" role="link" tabIndex={0} className="mo-t-tile" style={{ background: "#6fecff", color: "#0b1320", borderColor: "#6fecff" }}>
                  <span className="mo-t-tile-i" style={{ background: "rgba(11,19,32,.12)", color: "#0b1320" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path>
                      <path d="M14 3v5h5M9 13h6M9 17h4"></path>
                    </svg>
                  </span>
                  <span>
                    <b style={{ display: "block", fontSize: "17px" }}>
                      {"Jätä hakemus"}
                    </b>
                    <span style={{ display: "block", fontSize: "13.5px", opacity: ".75", marginTop: "2px" }}>
                      {"Vie viisi minuuttia"}
                    </span>
                  </span>
                </a>
                {" "}
                <a data-ankkuri="roolit" role="link" tabIndex={0} className="mo-t-tile">
                  <span className="mo-t-tile-i">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="9" cy="8" r="3.2"></circle>
                      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M17.5 14.2a5 5 0 0 1 3 4.8"></path>
                    </svg>
                  </span>
                  <span>
                    <b style={{ display: "block", fontSize: "17px" }}>
                      {"Keitä etsimme"}
                    </b>
                    <span style={{ display: "block", fontSize: "13.5px", color: "rgba(255,255,255,.7)", marginTop: "2px" }}>
                      {"Neljä osa-aluetta"}
                    </span>
                  </span>
                </a>
                {" "}
              </div>
              {" "}
              <a href="mailto:info@wsmedia.fi?subject=Kysymys%20t%C3%B6ist%C3%A4" className="mo-t-li mo-t-d4 mo-t-obtn">
                {"Kysy ensin sähköpostilla"}
              </a>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#05080c", opacity: "0", pointerEvents: "none", zIndex: "7" }} data-toihin="peitto"></div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        {/* COVER */}
        {" "}
        <div data-kerros="1" style={{ position: "relative", zIndex: "2", marginTop: "calc(-1 * 100svh)", borderRadius: "30px 30px 0 0", boxShadow: "0 -30px 70px -20px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.06)", overflow: "clip" }}>
          {" "}
          <div aria-hidden="true" style={{ position: "sticky", top: "0", height: "100svh", marginBottom: "calc(-1 * 100svh)", zIndex: "0", pointerEvents: "none" }}>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#0b131d" }}></div>
            {" "}
            <canvas data-mo-verkko="" width="390" height="844" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100svh", display: "block" }}></canvas>
            {" "}
          </div>
          {" "}
          {/* LUOTTO */}
          {" "}
          <section data-teema="tumma" data-verkko="alku" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "26px 16px 0" }}>
            {" "}
            <div className="mo-rv-s" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
              {" "}
              {(LUOTTO).map((l: any, lI: number) => (
                <Fragment key={lI}>
                  <div style={{ padding: "12px 10px", borderRadius: "16px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)", textAlign: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6fecff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={l.ikoni}></path>
                    </svg>
                    <b style={{ display: "block", marginTop: "6px", fontSize: "12.5px", lineHeight: "1.3", fontWeight: "620" }}>
                      {l.t}
                    </b>
                  </div>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* MIKSI */}
          {" "}
          <section id="m-miksi" data-teema="tumma" data-verkko="miksi" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "40px 16px 26px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Miksi tekijät jäävät meille "}
                <span style={{ color: "#6fecff" }}>
                  {"pidemmäksi aikaa"}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Emme ole suurin emmekä tunnetuin. Nämä neljä asiaa saamme kuitenkin kuntoon, ja juuri niitä freelancerit alalta kaipaavat."}
              </p>
              {" "}
            </div>
            {" "}
            <div data-pino='{"alku":76,"askel":12,"matka":-30,"sk":0.05,"hi":0.55}' style={{ marginTop: "22px" }}>
              {" "}
              {(SYYT).map((v: any, vI: number) => (
                <Fragment key={vI}>
                  {" "}
                  <article data-kortti="1" className="mo-t-pino mo-rv-k" style={{ top: `${v.top}px`, transform: "scale(1)", marginBottom: "14px", padding: "18px", overflow: "hidden" }}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ width: "42px", height: "42px", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(111,236,255,.1)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.25)" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6fecff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={v.ikoni}></path>
                        </svg>
                      </span>
                      <span style={{ fontSize: "11.5px", fontWeight: "650", letterSpacing: ".14em", color: "#8fa3b5" }}>
                        {v.nro}
                        {" / 04"}
                      </span>
                    </div>
                    {" "}
                    <h3 style={{ margin: "14px 0 0", fontSize: "19px", lineHeight: "1.25", fontWeight: "630" }}>
                      {v.t}
                    </h3>
                    {" "}
                    <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#b9c7d4" }}>
                      {v.v}
                    </p>
                    {" "}
                    <span aria-hidden="true" data-kortti-himmea="" style={{ position: "absolute", inset: "0", background: "#070b10", opacity: "0", pointerEvents: "none" }}></span>
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
          {/* ROOLIT */}
          {" "}
          <section id="m-roolit" data-teema="tumma" data-verkko="roolit" data-vari="#0d1824" style={{ position: "relative", zIndex: "1", padding: "30px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Keitä etsimme"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Haemme näille neljälle alueelle jatkuvasti. Jos oma osaamisesi osuu johonkin niistä edes osittain, kannattaa jättää hakemus."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv-s" role="tablist" aria-label="Keitä etsimme" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "6px", marginTop: "20px" }}>
              {" "}
              {(ROOLIT).map((r: any, rI: number) => (
                <Fragment key={rI}>
                  <button type="button" role="tab" aria-selected={r.on} data-rooli={rI} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 4px", border: "0", borderRadius: "14px", font: "inherit", fontSize: "11.5px", fontWeight: "600", lineHeight: "1.2", cursor: "pointer", background: r.bg, color: r.fg, boxShadow: r.reuna, transition: "background-color .25s, color .25s" }}>
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={r.ikoni}></path>
                    </svg>
                    {r.lyhyt}
                  </button>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            {(ROO).map((r: any, rI: number) => (
              <Fragment key={rI}>
                {" "}
                <article className="mo-l-kortti-in" data-rooli-paneeli={rI} hidden={rI !== 0} style={{ marginTop: "12px", padding: "18px", borderRadius: "22px", background: "#0e161f", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.2)" }}>
                  {" "}
                  <span style={{ fontSize: "11.5px", fontWeight: "650", letterSpacing: ".14em", color: "#ff9a4d" }}>
                    {r.kick}
                  </span>
                  {" "}
                  <h3 style={{ margin: "4px 0 0", fontSize: "20px", lineHeight: "1.25", fontWeight: "640", letterSpacing: "-.012em" }}>
                    {r.otsikko}
                  </h3>
                  {" "}
                  <p style={{ margin: "8px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#b9c7d4" }}>
                    {r.kuvaus}
                  </p>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "12px 0 0", padding: "0" }}>
                    {" "}
                    {(r.rivit).map((x: any, xI: number) => (
                      <Fragment key={xI}>
                        <li className="mo-l-li">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6fecff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12.5l4.2 4L19 7"></path>
                          </svg>
                          <span>
                            {x}
                          </span>
                        </li>
                      </Fragment>
                    ))}
                    {" "}
                  </ul>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                    {(r.tyokalut).map((x: any, xI: number) => (
                      <Fragment key={xI}>
                        <span className="mo-t-chip">
                          {x}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  {" "}
                </article>
                {" "}
              </Fragment>
            ))}
            {" "}
            <div className="mo-rv" style={{ marginTop: "12px", padding: "16px 18px", borderRadius: "20px", background: "rgba(111,236,255,.06)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.18)" }}>
              {" "}
              <b style={{ fontSize: "16px", fontWeight: "630" }}>
                {"Tunnistitko oman osaamisesi?"}
              </b>
              {" "}
              <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#c3d0dc" }}>
                {"Jätä avoin hakemus. Se vie viisi minuuttia, ja ansioluetteloa ei tarvita."}
              </p>
              {" "}
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <a data-ankkuri="hakemus" role="link" tabIndex={0} className="mo-e-btn mo-e-p" style={{ flex: "1.4", height: "46px", padding: "0 12px", fontSize: "14.5px" }}>
                  {"Jätä avoin hakemus"}
                </a>
                <a href="mailto:info@wsmedia.fi" className="mo-e-btn mo-e-o" style={{ flex: "1", height: "46px", padding: "0 12px", fontSize: "14.5px" }}>
                  {"Kysy ensin"}
                </a>
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* VÄITE */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="vaite1" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "440px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 34px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z">
              <img data-px="1" src={TYHJA} data-mo-src="/mobiili/autossa-terava.webp" alt="Videokuvausta auton sisällä" style={{ opacity: ".9", top: "0", height: "380px", objectPosition: "45% 50%", WebkitMask: "linear-gradient(180deg, #000 70%, transparent 100%)", mask: "linear-gradient(180deg, #000 70%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "40px", lineHeight: "1.02", letterSpacing: "-.03em", fontWeight: "680" }}>
              {"Näytä, mitä "}
              <span style={{ color: "#6fecff" }}>
                {"olet tehnyt."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Yksi linkki työnäytteisiin riittää. Luemme jokaisen hakemuksen ja vastaamme viikon sisällä."}
            </p>
            {" "}
          </section>
          {" "}
          {/* TYÖMALLI */}
          {" "}
          <section id="m-tyomalli" data-teema="tumma" data-verkko="tyomalli" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "30px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Freelancerina vai "}
                <span style={{ color: "#6fecff" }}>
                  {"työsuhteessa?"}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Molemmat käyvät. Suurin osa tekijöistämme laskuttaa toimeksiannoista, mutta hyvälle tekijälle voi järjestyä myös vakituinen paikka."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Työmalli" style={{ marginTop: "20px" }}>
              {" "}
              {(MALLIT).map((m: any, mI: number) => (
                <Fragment key={mI}>
                  <button type="button" role="tab" aria-selected={m.on} data-malli={mI} style={{ background: m.tabBg, color: m.tabFg }}>
                    {m.nimi}
                  </button>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            {(MAL).map((m: any, mI: number) => (
              <Fragment key={mI}>
                {" "}
                <article className="mo-l-kortti-in" data-malli-paneeli={mI} hidden={mI !== 0} style={{ marginTop: "12px", padding: "18px", borderRadius: "22px", background: "linear-gradient(180deg, rgba(111,236,255,.08), rgba(255,255,255,.02))", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.25)" }}>
                  {" "}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <b style={{ fontSize: "19px", fontWeight: "640" }}>
                      {m.nimi}
                    </b>
                    <span className="mo-e-chip" style={{ height: "26px", padding: "0 10px", fontSize: "11.5px", background: "rgba(255,154,77,.14)", color: "#ffc79c" }}>
                      {m.tag}
                    </span>
                  </div>
                  {" "}
                  <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#b9c7d4" }}>
                    {m.kuvaus}
                  </p>
                  {" "}
                  <p className="mo-l-bk" style={{ marginTop: "16px", color: "#b4f5ff" }}>
                    {"Sinä"}
                  </p>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "4px 0 0", padding: "0" }}>
                    {(m.sina).map((x: any, xI: number) => (
                      <Fragment key={xI}>
                        <li className="mo-l-li">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6fecff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12.5l4.2 4L19 7"></path>
                          </svg>
                          <span>
                            {x}
                          </span>
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                  {" "}
                  <p className="mo-l-bk" style={{ marginTop: "14px", color: "#ffc79c" }}>
                    {"Me"}
                  </p>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "4px 0 0", padding: "0" }}>
                    {(m.me).map((x: any, xI: number) => (
                      <Fragment key={xI}>
                        <li className="mo-l-li">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff9a4d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12.5l4.2 4L19 7"></path>
                          </svg>
                          <span>
                            {x}
                          </span>
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                  {" "}
                </article>
                {" "}
              </Fragment>
            ))}
            {" "}
            <p className="mo-rv" style={{ margin: "14px 6px 0", fontSize: "13.5px", lineHeight: "1.55", color: "#9fb0bf" }}>
              {"Aloitamme lähes aina toimeksiannoilla, koska se on molemmille pienin riski. Työsuhteesta keskustellaan siinä vaiheessa, kun yhteistyötä on takana muutama projekti."}
            </p>
            {" "}
          </section>
          {" "}
          {/* PROSESSI */}
          {" "}
          <section id="m-prosessi" data-teema="tumma" data-verkko="prosessi" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "26px 0 40px" }}>
            {" "}
            <div style={{ padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Kolme vaihetta, "}
                <span style={{ color: "#6fecff" }}>
                  {"ei kahdeksan"}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Emme järjestä persoonallisuustestejä emmekä neljää haastattelukierrosta. Työnäyte kertoo enemmän."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-d1" style={{ position: "relative", margin: "22px 22px 0", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,.08)" }}>
              <i style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "100%", transform: "scaleX(0)", transformOrigin: "0 50%", borderRadius: "2px", background: "linear-gradient(90deg, #6fecff, #ff9a4d)", transition: "transform .3s" }} data-toihin="askelpalkki"></i>
            </div>
            {" "}
            <div className="mo-e-x mo-rv mo-d1" data-toihin="askeleet" style={{ gap: "12px", padding: "18px 22px 6px", scrollPaddingLeft: "22px" }}>
              {" "}
              {(ASKELEET).map((a: any, aI: number) => (
                <Fragment key={aI}>
                  {" "}
                  <article className="mo-t-askel" data-askel={aI} style={{ background: a.bg, boxShadow: a.reuna }}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="mo-l-nro" data-askel-nro="" style={{ width: "36px", height: "36px", fontSize: "14px", background: a.nBg, color: a.nFg }}>
                        {a.n}
                      </span>
                      <span className="mo-e-chip" style={{ height: "26px", padding: "0 10px", fontSize: "11.5px", color: "#b4f5ff", background: "rgba(111,236,255,.08)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.2)" }}>
                        {a.aika}
                      </span>
                    </div>
                    {" "}
                    <b style={{ display: "block", marginTop: "16px", fontSize: "18px", fontWeight: "630" }}>
                      {a.t}
                    </b>
                    {" "}
                    <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#b9c7d4" }}>
                      {a.v}
                    </p>
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
          {/* ODOTUKSET */}
          {" "}
          <section id="m-odotukset" data-teema="tumma" data-verkko="odotukset" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "20px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Mitä odotamme ja "}
                <span style={{ color: "#6fecff" }}>
                  {"mitä emme vaadi"}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Nämä kannattaa lukea ennen hakemista. Ne säästävät molempien aikaa."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Odotukset" style={{ marginTop: "20px" }}>
              {" "}
              <button type="button" role="tab" aria-selected={true} data-od={0} style={{ background: "#6fecff", color: "#0b0f14" }}>
                {"Odotamme"}
              </button>
              {" "}
              <button type="button" role="tab" aria-selected={false} data-od={1} style={{ background: "transparent", color: "#c9d6e2" }}>
                {"Emme vaadi"}
              </button>
              {" "}
            </div>
            {" "}
            {(OD_LISTAT).map((l: any, lI: number) => (
              <Fragment key={lI}>
                {" "}
                <ul className="mo-l-kortti-in" data-od-paneeli={lI} hidden={lI !== 0} style={{ listStyle: "none", margin: "12px 0 0", padding: "6px 18px", borderRadius: "22px", background: "rgba(255,255,255,.035)", boxShadow: `inset 0 0 0 1px ${l.reuna}` }}>
                  {" "}
                  {(l.rivit).map((r: any, rI: number) => (
                    <Fragment key={rI}>
                      <li style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: "12px", padding: "14px 0", borderTop: r.raja }}>
                        <span style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: l.ikBg }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={l.ikVari} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={l.ikoni}></path>
                          </svg>
                        </span>
                        <span style={{ fontSize: "15px", lineHeight: "1.45", color: "#eef3f7" }}>
                          <b style={{ fontWeight: "620" }}>
                            {r.a}
                          </b>
                          {r.b}
                        </span>
                      </li>
                    </Fragment>
                  ))}
                  {" "}
                </ul>
                {" "}
              </Fragment>
            ))}
            {" "}
          </section>
          {" "}
          {/* TYÖNKUVA */}
          {" "}
          <section id="m-tyonkuva" data-teema="tumma" data-verkko="tyonkuva" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "20px 16px 40px" }}>
            {" "}
            <h2 className="mo-e-h2 mo-rv" style={{ padding: "0 6px", fontSize: "28px" }}>
              {"Mitä työ käytännössä on"}
            </h2>
            {" "}
            <div className="mo-rv-s" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px", marginTop: "18px" }}>
              {" "}
              {(FAKTAT).map((f: any, fI: number) => (
                <Fragment key={fI}>
                  <div style={{ padding: "12px 14px", borderRadius: "16px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
                    <span style={{ display: "block", fontSize: "10.5px", fontWeight: "650", letterSpacing: ".12em", textTransform: "uppercase", color: "#8fa3b5" }}>
                      {f.l}
                    </span>
                    <b style={{ display: "block", marginTop: "4px", fontSize: "14px", lineHeight: "1.35", fontWeight: "600", color: "#eef3f7" }}>
                      {f.v}
                    </b>
                  </div>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ marginTop: "18px", padding: "0 6px" }}>
              {" "}
              <p style={{ margin: "0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                {"WS Media on espoolainen mainostoimisto, jonka asiakkaat ovat pääosin pieniä ja keskisuuria yrityksiä: rakennus- ja LVI-alan yrityksiä, terveys- ja hyvinvointipalveluita, erikoisliikkeitä ja ammattipalveluita. Suurin osa asiakkuuksista on jatkuvia kuukausisopimuksia, joten toimeksiantoja tulee samalta asiakkaalta kuukaudesta toiseen."}
              </p>
              {" "}
              <div className="mo-e-vast" data-toihin="seo" hidden>
                    {" "}
                    <h3 style={{ margin: "20px 0 0", fontSize: "18px", fontWeight: "630" }}>
                      {"Videotuotanto"}
                    </h3>
                    <p style={{ margin: "8px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Suurin osa toimeksiannoista liittyy lyhytvideoihin: kuvauspäivä asiakkaan tiloissa, ja siitä editoidaan useita pystymuotoisia videoita eri kanaviin. Haemme sekä kuvaajia että editoijia, eikä samaa ihmistä tarvita molempiin. Motion designerille on työtä animoiduissa grafiikoissa ja tekstityksissä."}
                    </p>
                    {" "}
                    <h3 style={{ margin: "20px 0 0", fontSize: "18px", fontWeight: "630" }}>
                      {"Verkkosivut ja hakukoneoptimointi"}
                    </h3>
                    <p style={{ margin: "8px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Rakennamme verkkosivuja yrityksille sekä käsin koodattuna että WordPressillä, ja teemme niille jatkuvaa hakukoneoptimointia. Kehittäjälle työ on selkeärajaista: valmis suunnitelma, tekninen määrittely ja tavoitteet sivun latausnopeudelle. Hakukoneoptimoijalle työ on avainsanatutkimusta, teknisiä auditointeja ja sisällön suunnittelua suomenkielisille hakusanoille."}
                    </p>
                    {" "}
                    <h3 style={{ margin: "20px 0 0", fontSize: "18px", fontWeight: "630" }}>
                      {"Graafinen suunnittelu ja tuotanto"}
                    </h3>
                    <p style={{ margin: "8px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Suunnittelemme asiakkaille koko yritysilmeen ja viemme sen kaikille pinnoille käyntikorteista ja flyereista ajoneuvoteippauksiin ja julkisivuihin. Emme teippaa emmekä paina itse, joten tarvitsemme rinnallemme asentajia, digipainoja ja materiaalitoimittajia eri paikkakunnilta."}
                    </p>
                    {" "}
                    <h3 style={{ margin: "20px 0 0", fontSize: "18px", fontWeight: "630" }}>
                      {"Mistä päin Suomea"}
                    </h3>
                    <p style={{ margin: "8px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Suunnittelu, editointi, koodaus ja sisällöntuotanto tehdään etänä, joten asuinpaikkakunta ei ratkaise. Kuvaukset painottuvat pääkaupunkiseudulle, Espooseen, Helsinkiin ja Vantaalle, mutta teemme työtä koko Suomessa."}
                    </p>
                    {" "}
                  </div>
              {" "}
              <button type="button" data-toihin="seo-nappi" aria-expanded={false} className="mo-e-btn mo-e-o" style={{ height: "42px", marginTop: "16px", padding: "0 16px", fontSize: "14.5px" }}>
                {"Lue koko teksti"}
              </button>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* UKK */}
          {" "}
          <section id="m-ukk" data-teema="tumma" data-verkko="ukk" data-verkko-alfa="0.18" data-vari="#0b121a" style={{ position: "relative", zIndex: "1", padding: "24px 22px 40px" }}>
            {" "}
            <div className="mo-rv">
              {" "}
              <h2 className="mo-e-h2" style={{ fontSize: "30px" }}>
                {"Usein kysytyt kysymykset työstä WS Medialla"}
              </h2>
              {" "}
              <p className="mo-e-lead" style={{ marginTop: "12px", fontSize: "16px", color: "#b9c7d4" }}>
                {"Haku, laskutus, työnteon paikka ja se, mitä meiltä voi odottaa."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-d1" style={{ marginTop: "16px" }}>
              {" "}
              {(UKK).map((q: any, qI: number) => (
                <div key={qI} data-ukk-rivi={qI} hidden={qI >= 5}>
                  {" "}
                  <button type="button" className={mo(q.luokka)} data-ukk={qI} aria-expanded={q.auki}>
                    {q.k}
                    <span className="mo-e-plus" aria-hidden="true"></span>
                  </button>
                  {" "}
                  <div className="mo-e-vast" data-ukk-vast={qI} hidden={!q.auki} style={{ padding: "0 0 18px" }}>
                        <p style={{ margin: "0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                          {q.v}
                        </p>
                      </div>
                  {" "}
                </div>
              ))}
              {" "}
              <div style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}></div>
              {" "}
              {true ? (
                <>
                  <button type="button" data-ukk-kaikki="" className="mo-e-btn mo-e-o" style={{ width: "100%", marginTop: "16px" }}>
                    {"Näytä kaikki 10 kysymystä"}
                  </button>
                </>
              ) : null}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* HAKEMUS */}
          {" "}
          <section id="m-hakemus" data-teema="tumma" data-verkko="lomake" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", overflow: "hidden", padding: "56px 0 44px", background: "#080d13" }}>
            {" "}
            <img src={TYHJA} data-mo-src="/kuvat/tarjous-kortit.webp" alt="" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "620px", objectFit: "cover", objectPosition: "14% 0%", opacity: ".5", WebkitMask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)", mask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)" }} loading="lazy" decoding="async" />
            {" "}
            <div style={{ position: "relative", padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv" style={{ color: "#fff" }}>
                {"Kerro, "}
                <span style={{ color: "#6fecff" }}>
                  {"mitä osaat."}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "16px", color: "#c9d6e2" }}>
                {"Hakemus vie viisi minuuttia. Luemme jokaisen ja vastaamme myös silloin, kun vastaus on ei. Voit myös kirjoittaa osoitteeseen "}
                <a href="mailto:info@wsmedia.fi">
                  {"info@wsmedia.fi"}
                </a>
                {"."}
              </p>
              {" "}
              <form className="mo-rv mo-rv-s" data-toihin="lomake" noValidate style={{ marginTop: "26px", padding: "22px 18px 20px", borderRadius: "24px", background: "linear-gradient(180deg, rgba(22,34,48,.9), rgba(12,19,28,.94))", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1), 0 40px 80px -40px rgba(0,0,0,.9)", display: "flex", flexDirection: "column", gap: "14px" }}>
                {" "}
                <div>
                  <b style={{ fontSize: "22px", fontWeight: "620", letterSpacing: "-.01em" }}>
                    {"Avoin hakemus"}
                  </b>
                  <p style={{ margin: "4px 0 0", display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#a9b8c6" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3ddc84" }}></span>
                    {"Vastaamme viikon sisällä"}
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
                <div className="mo-e-in">
                  {"Mitä osaat? Valitse yksi tai useampi"}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "2px" }}>
                    {(TAIDOT).map((t: any, tI: number) => (
                      <Fragment key={tI}>
                        <button type="button" className="mo-t-taito" aria-pressed={t.on} data-taito={t.n} style={{ background: t.bg, color: t.fg, boxShadow: t.reuna }}>
                          <svg data-taito-ok="" style={{ display: "none" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12.5l4.2 4L19 7"></path>
                              </svg>
                          {t.n}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                {" "}
                <label className="mo-e-in">
                  {"Linkki työnäytteisiin"}
                  <input type="url" name="linkki" inputMode="url" placeholder="https://" />
                  <span style={{ fontSize: "12px", fontWeight: "400", color: "#8fa3b5" }}>
                    {"Ansioluetteloa ei tarvita. Yksi linkki riittää."}
                  </span>
                </label>
                {" "}
                <div className="mo-e-in">
                  {"Toimeksianto vai työsuhde?"}
                  <div className="mo-l-seg" style={{ marginTop: "2px" }}>
                    {(HMALLI).map((m: any, mI: number) => (
                      <Fragment key={mI}>
                        <button type="button" data-hmalli={mI} aria-pressed={mI === 0} style={{ background: m.bg, color: m.fg, fontSize: "13px" }}>
                          {m.n}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                {" "}
                <label className="mo-e-in">
                  {"Tuntihinta tai palkkatoive"}
                  <input type="text" name="hinta" />
                </label>
                {" "}
                <label className="mo-e-in">
                  {"Kerro lyhyesti, mitä olet tehnyt ja mitä haluaisit tehdä"}
                  <textarea name="viesti" rows={4} style={{ height: "112px", paddingTop: "13px", resize: "none" }} />
                </label>
                {" "}
                <label style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "14px", border: "1.5px dashed rgba(111,236,255,.35)", background: "rgba(111,236,255,.04)", cursor: "pointer" }}>
                  <span style={{ width: "38px", height: "38px", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(111,236,255,.12)", color: "#6fecff" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 16V4M7 9l5-5 5 5M5 20h14"></path>
                    </svg>
                  </span>
                  <span style={{ lineHeight: "1.3" }}>
                    <b style={{ display: "block", fontSize: "14px", color: "#eef3f7" }}>
                      {"Lisää liite"}
                    </b>
                    <span style={{ fontSize: "12px", color: "#8fa3b5" }}>
                      {"CV, portfolio tai työnäyte (PDF, kuva, Word, zip)"}
                    </span>
                  </span>
                  <input type="file" name="liite" multiple style={{ display: "none" }} />
                </label>
                {" "}
                <p className="mo-e-vast" data-toihin="kiitos" role="status" hidden style={{ margin: "0", padding: "12px 14px", borderRadius: "12px", background: "rgba(111,236,255,.1)", color: "#b4f5ff", fontSize: "14.5px" }}>
                      {"Kiitos hakemuksesta. Vastaamme viikon sisällä."}
                    </p>
                {" "}
                <button type="submit" className="mo-e-btn mo-e-p" style={{ width: "100%", height: "54px", marginTop: "4px", fontSize: "16.5px", fontWeight: "600" }}>
                  {"Lähetä hakemus"}
                </button>
                {" "}
                <p style={{ margin: "0", textAlign: "center", fontSize: "12.5px", color: "#8fa3b3" }}>
                  {"Käsittelemme hakemukset luottamuksellisesti."}
                </p>
                {" "}
              </form>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <Alatunniste />
          {" "}
        </div>      </div>
      <Kuori reitti="/toihin-meille" ikkuna="hakemus" />
      <Moottori otsake={{ tapa: "iso", ka: 300, piilo: 150, lasi: -30 }} verkko={{ siemen: 67, tila: "toihin", pohja: [11, 19, 29] }} />
      <Efektit />
    </div>
  );
}
