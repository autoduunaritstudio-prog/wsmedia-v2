/* LYHYTVIDEOT-SIVUN PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Palvelusivu.dc.html:
   rakenne, tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on
   muunnettu koneellisesti (dc2jsx.mjs + tyokalut/lyhytvideot.py) ja
   vierityksen arvot on korvattu alkutilalla (y = 0); Efektit.tsx ja
   Moottori.tsx kirjoittavat ne suoraan DOMiin. Naytetaan vain
   max-width: 767px (app/components/mobiili/mobiili.css).

   Toteutuksen poikkeamat suunnitelmasta (ulkonako sama):
   - Heron puhelinten koot ja paikat ovat calc()-lausekkeita 100svh:sta
     (suunnitelma laski ne kiinteasta 844 px:n korkeudesta).
   - Prosessin aikajanan palkki on scaleY (suunnitelma: height %), ja
     referenssikortin edistymispalkki scaleX (suunnitelma: width), ks.
     lisat.css.
   - Videot: preload none, toisto vain nakyvissa, reduced motion = poster.
   - Logot ovat kevyet webp-versiot (public/mobiili/logot). */
import "./mobiili.css";
import "./lisat.css";
import { Fragment } from "react";
import { mo, TYHJA, logoLeveys } from "@/app/components/mobiili/mo";
import Kuori from "@/app/components/mobiili/Kuori";
import Alatunniste from "@/app/components/mobiili/Alatunniste";
import Moottori from "@/app/components/mobiili/Moottori";
import Efektit from "./Efektit";

/* ---- Suunnitelman renderVals()-tiedot sellaisenaan (alkutila y = 0) ---- */

/* HERO: lavaH = HV - 442, PW = lavaH * 0.47, PH = lavaH - 6, sivupuhelimet
   0.8-kertaiset. Vierityksen arvot (x, r, s, op) kirjoittaa Efektit.tsx. */
const PUH = [
  { video: '/hero/laaksolahti-hero.mp4', poster: '/hero/laaksolahti-hero-2x.webp', ava: '/hero/laaksolahti-ava.webp', kahva: 'laaksolahdensahko', teksti: 'TOP 3 mallit alle 1400 eurolla jotka tuovat viilennystä kesähelteille.', puoli: -1 },
  { video: '/hero/vauhtiveikot-hero.mp4', poster: '/hero/vauhtiveikot-hero-2x.webp', ava: '/hero/vauhtiveikot-ava.webp', kahva: 'vauhtiveikot.fi', teksti: 'Meiltä löydät yli 22 000 tuotetta auton virittämiseen ja huoltoon.', puoli: 1 },
  { video: '/hero/white-star-hero.mp4', poster: '/hero/white-star-hero-2x.webp', ava: '/hero/whitestar-ava.webp', kahva: 'whitestardetailing', teksti: 'Tarvitsetko nopean auton muodonmuutoksen? White Star hoitaa homman.', puoli: 0 }
];
const PUHELIMET = PUH.map((p) => {
  const paa = p.puoli === 0;
  return Object.assign({}, p, {
    paa,
    w: paa ? "calc((100svh - 442px) * 0.47)" : "calc((100svh - 442px) * 0.376)",
    hh: paa ? "calc(100svh - 448px)" : "calc((100svh - 448px) * 0.8)",
    ml: paa ? "calc((100svh - 442px) * -0.235)" : "calc((100svh - 442px) * -0.188)",
    top: paa ? "0px" : "calc((100svh - 448px) * 0.1 + 6px)",
    tf: `translateX(calc((100svh - 442px) * ${(p.puoli * 0.2914).toFixed(4)})) rotate(${(p.puoli * 6).toFixed(2)}deg) scale(1.0000)`,
    op: 1, z: paa ? 3 : 1, rad: paa ? 24 : 20, rad2: paa ? 21 : 17, saari: paa ? 34 : 26, saariP: paa ? 17 : 13,
  });
});
/* Logot: suunnitelman /logos/*.png -> samat kevyina webp-versioina.
   Leveys kuvasuhteesta, jottei nauha hyppaa kuvien latautuessa. */
const logot = [
  { src: '/mobiili/logot/porsche-club-finland.webp', alt: 'Porsche Club Finland', h: 34, s: 265 / 80, f: 'brightness(0) invert(1)' },
  { src: '/mobiili/logot/tesla-owners-finland-color.webp', alt: 'Tesla Owners Finland', h: 34, s: 83 / 80, f: 'none' },
  { src: '/mobiili/logot/colormaster.webp', alt: 'Colormaster', h: 28, s: 188 / 80, f: 'brightness(0) invert(1)' },
  { src: '/mobiili/logot/ydr-autohuolto.webp', alt: 'YDR Autohuolto', h: 30, s: 265 / 80, f: 'brightness(0) invert(1)' },
  { src: '/mobiili/logot/ls-monogram-color.webp', alt: 'Laaksolahden Sähkö', h: 32, s: 1, f: 'none' }
].map((l) => Object.assign({}, l, { w: Math.round(l.h * l.s * 10) / 10 }));
const LOGOT = logot.concat(logot, logot, logot);
const IKO = {
  tt: 'M14 4v10.5a3.3 3.3 0 1 1-3.3-3.3M14 4c.5 2.3 2 3.8 4.6 4.1',
  ig: 'M7 3.5h10A3.5 3.5 0 0 1 20.5 7v10a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 17V7A3.5 3.5 0 0 1 7 3.5zM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM17 7h.01',
  yt: 'M3.5 8.5a3.5 3.5 0 0 1 3.4-3.4C8.6 5 10.3 5 12 5s3.4 0 5.1.1a3.5 3.5 0 0 1 3.4 3.4v7a3.5 3.5 0 0 1-3.4 3.4c-1.7.1-3.4.1-5.1.1s-3.4 0-5.1-.1a3.5 3.5 0 0 1-3.4-3.4zM10 9.2v5.6l4.8-2.8z'
};
const KANAVAT = [
  { nimi: 'TikTok-videot yritykselle', teksti: 'Uusikin tili voi tavoittaa paljon katsojia. Sopii, kun näkyvyyttä vasta rakennetaan.', tag: 'Rento ja suora', vari: '#6fecff', kuva: '/referenssit/ydr-autohuolto.webp', alt: 'YDR Autohuollon video', pos: '50% 14%', ikBg: '#000', ikoni: IKO.tt },
  { nimi: 'Instagram Reels yritykselle', teksti: 'Moni katsoo yrityksen tilin ennen kuin ottaa yhteyttä. Reels tuo uusia katsojia.', tag: 'Yrityksen käyntikortti', vari: '#ff9a4d', kuva: '/referenssit/colormaster.webp', alt: 'Colormasterin video', pos: '50% 40%', ikBg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', ikoni: IKO.ig },
  { nimi: 'YouTube Shorts yritykselle', teksti: 'Löytyvät YouTuben ja Googlen hauista vielä kuukausien päästä.', tag: 'Pitkä elinikä', vari: '#ff4d5e', kuva: '/mobiili/kuvauskeikka-k.webp', alt: 'Kuvaajat kuvaamassa lyhytvideota kadulla', pos: '50% 18%', ikBg: '#ff0033', ikoni: IKO.yt }
];
const KANAVA_PISTEET = KANAVAT.map((x, i) => ({ w: i === 0 ? 22 : 6, c: i === 0 ? '#6fecff' : 'rgba(255,255,255,.25)' }));
const REF = [
  { nimi: 'ColorMaster', ala: 'Lyhytvideot · autojen maalaus', kuva: '/referenssit/colormaster.webp', video: '/referenssit/colormaster.mp4' },
  { nimi: 'YDR Autohuolto', ala: 'Lyhytvideot · autohuolto', kuva: '/referenssit/ydr-autohuolto.webp', video: '/referenssit/ydr-autohuolto.mp4' },
  { nimi: 'White Star', ala: 'Lyhytvideot · auton muodonmuutos', kuva: '/referenssit/white-star.webp', video: '/referenssit/white-star.mp4' },
  { nimi: 'VauhtiVeikot', ala: 'Lyhytvideot · autotarvikkeet', kuva: '/referenssit/vauhtiveikot.webp', video: '/referenssit/vauhtiveikot.mp4' },
  { nimi: 'Laaksolahden Sähkö', ala: 'Lyhytvideot · ilmalämpöpumput', kuva: '/referenssit/ilmalampopumput.webp', video: '/referenssit/ilmalampopumput.mp4' }
];
const REFIT = REF.map((r, i) => { const on = i === 0; return Object.assign({}, r, { i, alt: r.nimi + ', lyhytvideon kansikuva', sk: on ? 1 : 0.9, op: on ? 1 : 0.55, vOp: on ? 1 : 0, toisto: on ? 'running' : 'paused', piste: on ? 22 : 6, pisteVari: on ? '#6fecff' : 'rgba(255,255,255,.28)' }); });
const ASK = [
  { t: 'Aloituspalaveri', v: 'Käydään läpi tavoitteet, kohderyhmä ja kanavat. Saat konkreettisen sisältösuunnitelman ja hinnan, ennen kuin mitään sovitaan.' },
  { t: 'Ideointi ja käsikirjoitus', v: 'Rakennamme kuukauden sisällöt teemoiksi ja kirjoitamme käsikirjoitukset. Hyväksyt ne ennen kuvauspäivää.' },
  { t: 'Kuvauspäivä', v: 'Kuvaamme sinun tiloissasi tai sovitussa paikassa. Yhdestä kuvauspäivästä syntyvät koko kuukauden videot.' },
  { t: 'Editointi ja julkaisu', v: 'Leikkaus, tekstitykset ja musiikki. Julkaisemme videot puolestasi tai toimitamme ne valmiina julkaistavaksi.' }
];
/* Alkutila prosessi = 0; Efektit.tsx paivittaa vierityksen mukaan. */
const ASKELEET = ASK.map((a, i) => { const on = 0 >= i / 3 - 0.02; return Object.assign({}, a, { n: i + 1, bg: on ? '#6fecff' : '#0b131d', fg: on ? '#0b0f14' : '#8fa3b5', reuna: on ? '0 0 0 5px rgba(111,236,255,.14)' : 'inset 0 0 0 1.5px rgba(255,255,255,.18)', op: on ? 1 : 0.45 }); });
const KETJU = [
  { n: 1, kick: 'TUNNETTUUS', nimi: 'Lyhytvideot', teksti: 'Näkyvyys TikTokissa, Reelsissä ja Shortsissa ilman mainoksia. Ihmiset oppivat, kuka olet ja mitä teet, jo ennen kuin he tarvitsevat palveluasi.', ikoni: 'M3 18c4 0 5-2 7-6s4-7 11-7M3 21h18', linkki: false },
  { n: 2, kick: 'KYSYNTÄ', nimi: 'Meta-mainonta', teksti: 'Parhaiten toimineista videoista tehdään Facebook- ja Instagram-mainoksia. Mainosrahaa ei kulu kokeiluun, koska tiedät jo, mikä video kiinnostaa katsojia.', ikoni: 'M4 20v-5M8.5 20v-8M13 20v-4M15.5 10.5a4 4 0 1 0 0-.01M18.5 13.5 21 16', linkki: false },
  { n: 3, kick: 'YHTEYDENOTOT', nimi: 'Hakukoneoptimointi', teksti: 'Kun videon nähnyt ihminen myöhemmin hakee palvelua Googlesta, hänen pitää löytää sinun sivusi eikä kilpailijan. Hakukoneoptimoitu sivusto tuo kävijöitä myös kuukausina, jolloin videoita ei julkaista.', ikoni: 'M3.5 9.5 12 15l8.5-5.5M4.5 8h15a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 3v6M9.5 6.5 12 9l2.5-2.5', linkki: true }
];
type Paketti = { nimi: string; hinta: string; yks: string; koko: number; suosittu?: boolean; kuvaus: string; rivit: string[] };
const PAK: Paketti[] = [
  { nimi: 'Aloitus', hinta: '1 500', yks: '€/kk + alv', koko: 48, kuvaus: 'Yrityksille, jotka aloittavat lyhytvideotuotannon.', rivit: ['4 lyhytvideota kuukaudessa', 'Esiintyjä videoille', '1 kuvauspäivä', 'Käsikirjoitus, editointi ja tekstitys', 'Toimitus noin 7 päivässä kuvauksesta'] },
  { nimi: 'Ylläpito', hinta: '2 200', yks: '€/kk + alv', koko: 48, suosittu: true, kuvaus: 'Yrityksille, jotka haluavat koko Instagram-tilin hoidettuna.', rivit: ['Kaikki Aloitus-paketin sisältö', 'Tarinat eli stoorit', 'Karusellit ja kuvajulkaisut', 'Tilin ylläpito ja julkaisut puolestasi'] },
  { nimi: 'Räätälöity', hinta: 'Tarpeen mukaan', yks: '', koko: 32, kuvaus: 'Yrityksille, jotka haluavat kasvattaa tiliä nopeammin.', rivit: ['Kaikki Ylläpito-paketin sisältö', 'Yhteisjulkaisukumppanien etsiminen', 'Koukkujen testaus: sama video eri aloituksilla', 'Videomäärä ja kuvauspäivät tarpeen mukaan', 'Meta-mainonnan hallinnointi', 'Kuukausittainen suunnittelupalaveri'] }
];
/* Alkutila paketti = 1 (Yllapito). Kaikki kortit ovat HTML:ssa, muut hidden. */
const PAKETIT = PAK.map((p, i) => { const on = i === 1; return { nimi: p.nimi, on, tabBg: on ? '#6fecff' : 'transparent', tabFg: on ? '#0b0f14' : '#c9d6e2' }; });
const PAKETIT_AUKI = PAK.map((pa, i) => Object.assign({}, pa, { on: i === 1, suosittu: !!pa.suosittu, bg: pa.suosittu ? 'linear-gradient(180deg, rgba(111,236,255,.1), rgba(255,255,255,.03))' : 'rgba(255,255,255,.04)', reuna: pa.suosittu ? 'inset 0 0 0 1px rgba(111,236,255,.4), 0 30px 60px -36px rgba(111,236,255,.35)' : 'inset 0 0 0 1px rgba(255,255,255,.1)', kickVari: pa.suosittu ? '#b4f5ff' : '#8fa3b5' }));
const SOP: { t: string; v?: string }[] = [{ t: 'Yrityksesi ei näy siellä missä asiakkaat viettävät aikansa' }, { t: 'Somekanavat ovat olemassa, mutta sisältöä ei ehdi tehdä' }, { t: 'Somemainonta on käynyt kalliiksi ja haluat näkyvyyttä myös ilman mainoksia' }, { t: 'Videoita on tehty itse, mutta niitä katsotaan harvoin loppuun' }];
const EI: { t: string; v?: string }[] = [{ t: 'Etsit yhtä yksittäistä videota etkä jatkuvaa tuotantoa', v: 'Kysy projektihinta, se on tähän järkevämpi' }, { t: 'Odotat tuloksia jo ensimmäisestä kuukaudesta', v: 'Selvä muutos näkyy tyypillisesti toisen kuukauden aikana' }];
/* Molemmat listat HTML:ssa (kenelle 0 ja 1), toinen hidden. */
const KE_LISTAT = [0, 1].map((k) => ({ reuna: k === 0 ? 'rgba(111,236,255,.22)' : 'rgba(255,154,77,.28)', ikBg: k === 0 ? 'rgba(111,236,255,.16)' : 'rgba(255,154,77,.16)', ikVari: k === 0 ? '#6fecff' : '#ff9a4d', ikoni: k === 0 ? 'M5 12.5l4.2 4L19 7' : 'M7 7l10 10M17 7 7 17', rivit: (k === 0 ? SOP : EI).map((r, i) => ({ t: r.t, v: r.v || '', raja: i ? '1px solid rgba(255,255,255,.07)' : '0' })) }));
const UKK = [
  {"k": "Paljonko lyhytvideotuotanto maksaa?", "v": "Jatkuva lyhytvideotuotanto alkaa 1 500 eurosta kuukaudessa + alv, ja siihen sisältyy neljä valmista videota esiintyjineen. Kun myös Instagram-tilin tarinat, karusellit ja kuvajulkaisut hoidetaan, hinta on 2 200 € kuukaudessa + alv. Yksittäiset videot ja kampanjatuotannot hinnoitellaan projekteina."},
  {"k": "Kuinka monta lyhytvideota kannattaa julkaista kuukaudessa?", "v": "Säännöllisyys ratkaisee enemmän kuin määrä. Neljä videota kuukaudessa eli noin yksi viikossa on hyvä alku, ja sillä tahdilla tulokset alkavat kertyä."},
  {"k": "Kuinka nopeasti saan valmiit videot?", "v": "Valmiit videot tulevat keskimäärin noin 7 päivässä kuvauspäivästä. Sisältösuunnitelman ja käsikirjoitukset saa nähtäväksi jo ennen kuvauksia."},
  {"k": "Kuinka nopeasti lyhytvideot tuottavat tulosta?", "v": "Ensimmäiset näyttökerrat tulevat heti, mutta luotettava kuva syntyy vasta useamman kuukauden datasta. Tyypillisesti selvä muutos näkyy toisen kuukauden aikana."},
  {"k": "Kuinka pitkä somevideon pitää olla?", "v": "Tekemämme videot ovat yleensä 15–60 sekuntia. Lyhyt video katsotaan todennäköisemmin loppuun, ja se ratkaisee, kuinka monelle video näytetään. Pidempikin video toimii, kun aihe pitää katsojan mukana, esimerkiksi ohje tai ennen ja jälkeen -video."},
  {"k": "Meillä ei ole ketään kameran eteen. Mitä teemme?", "v": "Pakettiin sisältyy esiintyjä, ja voimme myös rakentaa sisällöt ilman puhuvaa päätä: tuote-, prosessi- ja kulissien takaa -sisällöt, tekstivetoiset videot ja asiakastarinat toimivat monella toimialalla jopa paremmin."},
  {"k": "Missä kuvaukset tehdään?", "v": "Lähtökohtaisesti asiakkaan omissa tiloissa. Kuvaamme viikoittain Espoossa, Helsingissä ja Vantaalla, ja kuvauspäivät onnistuvat sovitusti myös muualla Suomessa."},
  {"k": "Sisältyvätkö tekstitykset, musiikki ja grafiikat hintaan?", "v": "Kyllä. Tekstitykset, käyttöoikeudellinen taustamusiikki, äänisuunnittelu ja brändin mukaiset grafiikat sisältyvät jokaiseen videoon."},
  {"k": "Saanko samasta videosta versiot eri kanaviin?", "v": "Saat. Sama video toimii TikTokissa, Instagram Reelsissä ja YouTube Shortsissa, koska kaikki kolme käyttävät samaa pystykuvaa. Tarkistamme silti, ettei tekstitys jää sovelluksen painikkeiden alle, ja kirjoitamme jokaiseen kanavaan oman saatetekstin."},
  {"k": "Kuka omistaa valmiit videot?", "v": "Sinä. Saat täydet käyttöoikeudet sekä valmiisiin videoihin että raakamateriaaliin, ja voit käyttää niitä myös maksetussa mainonnassa, verkkosivuilla ja messuilla."},
  {"k": "Kuinka paljon aikaani menee yhteistyöhön?", "v": "Korkeintaan 1–2 tuntia kuukaudessa: kuvauspäivä ja lyhyt hyväksyntäkierros käsikirjoituksiin. Ideointi, käsikirjoitus, editointi, tekstitys ja julkaisu hoituvat meiltä."},
  {"k": "Sopivatko lyhytvideot B2B-yritykselle?", "v": "Sopivat. Asiantuntijasisällöt, usein kysyttyihin kysymyksiin vastaaminen ja asiakastarinat toimivat erityisen hyvin, ja LinkedInissä kilpailu videosisällöistä on yhä vähäisempää kuin TikTokissa."},
  {"k": "Takaatteko katselukerrat?", "v": "Emme. Kukaan ei voi rehellisesti luvata katselukertoja, koska somepalvelu päättää, kenelle video näytetään. Lupaamme sovitun julkaisutahdin, huolella tehdyt käsikirjoitukset ja kuukausittaisen katsauksen siitä, mitkä videot toimivat."},
  {"k": "Onko pakko sitoutua pitkäksi aikaa?", "v": "Ei. Sopimus jatkuu kuukausi kerrallaan ja irtisanomisaika on yksi kuukausi. Suosittelemme kuitenkin varaamaan vähintään 3 kuukautta, koska lyhytvideoiden tulokset kertyvät kumulatiivisesti."},
  {"k": "Mitä jos emme ole tyytyväisiä ensimmäiseen versioon?", "v": "Jokaiseen videoon sisältyy palautekierros. Käymme muutokset läpi ja toimitamme korjatun version yleensä saman tai seuraavan arkipäivän aikana."},
  {"k": "Voitteko hoitaa myös julkaisun ja Meta-mainonnan?", "v": "Voimme. Julkaisu kuuluu Ylläpito-pakettiin tarinoiden, karusellien ja kuvajulkaisujen kanssa. Mainonnan hallinnointi hinnoitellaan erikseen kanavakohtaisesti, mainosbudjetin päälle, ja mainosbudjetin määrää aina asiakas itse."},
  {"k": "Teettekö myös hakukoneoptimointia?", "v": "Teemme. Lyhytvideot rakentavat tunnettuutta ja brändiarvoa, mutta mitattavat liidit syntyvät useimmiten silloin, kun ostaja hakee palvelua Googlesta. Siksi hakukoneoptimointi kuuluu samaan kokonaisuuteen: optimoimme verkkosivut niille hauille, joita asiakkaasi oikeasti tekevät."},
  {"k": "Kannattaako lyhytvideotuotanto ulkoistaa vai tehdä itse?", "v": "Itse tekeminen on halvinta silloin, kun yrityksestä löytyy henkilö, jolla on aikaa opetella kuvaus, editointi ja alustakohtainen optimointi sekä pitää julkaisutahtia yllä kuukaudesta toiseen. Ulkoistamisen etu ei ole pelkkä laatu vaan se, että tahti ei katkea kiireisenä kuukautena."},
  {"k": "Teettekö myös verkkosivut ja yritysilmeen?", "v": "Kyllä. WS Media tekee lyhytvideoiden lisäksi hakukoneoptimoidut verkkosivut, Meta-mainonnan ja graafisen suunnittelun. Kun sisältö, sivusto ja mainonta tulevat samalta tiimiltä, viesti pysyy yhtenäisenä ja sama kuvausmateriaali palvelee kaikkia kolmea."}
];
/* Alkutila auki = 0; kaikki 19 HTML:ssa, 6 ensimmaista nakyvissa. */
const UKK_ = UKK.map((q, i) => { const auki = i === 0; return Object.assign({}, q, { auki, luokka: auki ? 'l-faq auki' : 'l-faq' }); });
const ALUEET = [
  { t: 'Espoo', v: 'Toimipisteemme on Espoossa, ja kuvaamme päivittäin pääkaupunkiseudulla.' },
  { t: 'Koko Suomi', v: 'Mitä kauempana olet, sitä enemmän kuvauspäivä vaatii sopimista, mutta etäisyys ei ole este.' },
  { t: 'Etänä', v: 'Käsikirjoitus, editointi ja julkaisu toimivat etänä minne tahansa Suomessa.' }
].map((a, i) => Object.assign({}, a, { raja: i ? '1px solid rgba(255,255,255,.07)' : '0' }));

export default function LyhytvideotMobiili() {
  return (
    <div className="mo-root mo-s-lyhytvideot">
      {/* Heron paapuhelimen kansikuva (LCP) heti, vain puhelimessa. */}
      <link rel="preload" as="image" href="/hero/white-star-hero-2x.webp" media="(max-width: 767px)" fetchPriority="high" />
      <div className="mo-e-root" style={{ position: "relative", background: "#0b0f14", color: "#f5f5f7" }}>
        {/* HERO: kolme puhelinta, vieritys levittää ne ja kerää tykkäyksiä */}
        {" "}
        <div style={{ height: "calc(200px + 200svh)", position: "relative" }} data-lv="kaari">
          {" "}
          <div data-teema="tumma" data-lv="hero" style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden", background: "#0b0f14" }}>
            {" "}
            <div aria-label="Esimerkkejä WS Median tuottamista lyhytvideoista" style={{ position: "absolute", left: "0", right: "0", top: "62px", height: "calc(100svh - 442px)", transform: "translateY(0px)" }} data-lv="lava">
              {" "}
              {(PUHELIMET).map((p: any, pI: number) => (
                <Fragment key={pI}>
                  {" "}
                  <div className="mo-l-puh" style={{ left: "50%", top: p.top, width: p.w, height: p.hh, marginLeft: p.ml, transform: p.tf, opacity: p.op, zIndex: p.z, borderRadius: `${p.rad}px` }} data-lv-puh={pI}>
                    {" "}
                    <video src={p.video} poster={p.poster} loop playsInline preload="none" data-lv-video="" style={{ borderRadius: `${p.rad2}px` }}></video>
                    {" "}
                    <div className="mo-l-ui" style={{ borderRadius: `${p.rad2}px` }}>
                      {" "}
                      <span style={{ position: "absolute", top: "9px", left: "50%", width: `${p.saari}px`, height: "9px", marginLeft: `-${p.saariP}px`, borderRadius: "999px", background: "#000" }}></span>
                      {" "}
                      {p.paa ? (
                        <>
                          {" "}
                          <b style={{ position: "absolute", left: "10px", top: "24px", fontSize: "10.5px", fontWeight: "650" }}>
                            {"Reels"}
                          </b>
                          {" "}
                          <div style={{ position: "absolute", right: "7px", bottom: "138px", display: "flex", flexDirection: "column", gap: "9px" }}>
                            {" "}
                            <span className="mo-l-ik">
                              <svg className="mo-l-sydan" width="17" height="17" viewBox="0 0 24 24" fill="#ff3b5c" aria-hidden="true">
                                <path d="M12 20.5s-7.5-4.6-7.5-10.3A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z"></path>
                              </svg>
                              <span data-lv-tyk="l">{"1,2 t."}</span>
                            </span>
                            {" "}
                            <span className="mo-l-ik">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4A8 8 0 1 1 20 12z"></path>
                              </svg>
                              <span data-lv-tyk="k">{"86"}</span>
                            </span>
                            {" "}
                            <span className="mo-l-ik">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                                <path d="M21 4 10 14M21 4l-6.5 16-4.5-6-6-4.5z"></path>
                              </svg>
                              <span data-lv-tyk="j">{"41"}</span>
                            </span>
                            {" "}
                          </div>
                          {" "}
                          <div style={{ position: "absolute", left: "9px", right: "30px", bottom: "84px" }}>
                            {" "}
                            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "9px", fontWeight: "650" }}>
                              <img src={TYHJA} data-mo-src={p.ava} alt="" style={{ width: "16px", height: "16px", borderRadius: "50%", display: "block", boxShadow: "0 0 0 1px rgba(255,255,255,.6)" }} loading="lazy" decoding="async" />
                              {p.kahva}
                              <span style={{ padding: "1px 5px", borderRadius: "4px", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.7)", fontSize: "8px" }}>
                                {"Seuraa"}
                              </span>
                            </span>
                            {" "}
                            <span style={{ display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", marginTop: "4px", fontSize: "8.5px", lineHeight: "1.3", color: "#eef2f6" }}>
                              {p.teksti}
                            </span>
                            {" "}
                          </div>
                          {" "}
                        </>
                      ) : null}
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </Fragment>
              ))}
              {" "}
              <div style={{ position: "absolute", left: "0", right: "0", bottom: "-2px", height: "130px", background: "linear-gradient(180deg, rgba(11,15,20,0) 0%, rgba(11,15,20,.7) 45%, #0b0f14 85%)", zIndex: "5" }}></div>
              {" "}
            </div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "calc(100svh - 140px)", transform: "translateX(-50%) translateY(6px)", display: "flex", alignItems: "center", gap: "12px", height: "58px", padding: "0 8px 0 6px", borderRadius: "999px", background: "rgba(12,17,23,.92)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12), 0 10px 30px -12px rgba(0,0,0,.7)", opacity: "1", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "6" }} data-lv="vihje">
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
                  {"hinnat, työt ja prosessi"}
                </span>
              </span>
              {" "}
              <span style={{ position: "relative", width: "32px", height: "32px", marginLeft: "4px" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "block", transform: "rotate(-90deg)" }}>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2.5"></circle>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#6fecff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="81.7" strokeDashoffset="81.7" data-lv="rengas"></circle>
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
            <div style={{ position: "absolute", left: "22px", right: "22px", top: "calc(100svh - 450px)", textAlign: "left", transform: "translateY(0px)", zIndex: "6" }} data-lv="teksti">
              {" "}
              <h1 style={{ margin: "0", fontSize: "33px", lineHeight: "1.06", letterSpacing: "-.022em", fontWeight: "640", color: "#f5f5f7" }}>
                {"Lyhytvideot yrityksille, jotka"}
                <span style={{ display: "block", height: "38px", color: "#6fecff", whiteSpace: "nowrap" }}>
                  {" "}
                  <span className="mo-e-sana" data-sana="0" hidden>{"katsotaan loppuun."}</span>
                  {" "}
                  <span className="mo-e-sana" data-sana="1">{"näyttävät, mitä teette."}</span>
                  {" "}
                  <span className="mo-e-sana" data-sana="2" hidden>{"pysäyttävät selaajan."}</span>
                  {" "}
                  <span className="mo-e-sana" data-sana="3" hidden>{"tekevät teistä tutun."}</span>
                  {" "}
                </span>
              </h1>
              {" "}
              <p style={{ margin: "6px 0 0", fontSize: "15.5px", lineHeight: "1.5", color: "#d6d9e0" }}>
                {"Suunnittelemme, kuvaamme ja editoimme yrityksesi somevideot TikTokiin, Instagram Reelsiin ja YouTube Shortsiin. Sinun ei tarvitse keksiä ideoita eikä osata editoida, ja hinta on sama joka kuukausi."}
              </p>
              {" "}
              <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                {" "}
                <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ flex: "1.25", padding: "0 12px", fontSize: "15px" }}>
                  {"Varaa kartoitus"}
                </a>
                {" "}
                <a data-ankkuri="hinnoittelu" role="link" tabIndex={0} className="mo-e-btn mo-e-o" style={{ flex: "1", padding: "0 12px", fontSize: "15px" }}>
                  {"Katso paketit"}
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#05080c", opacity: "0", pointerEvents: "none", zIndex: "7" }} data-lv="peitto"></div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        {/* COVER: yksi tumma kerros, verkosto sävyttyy osioittain */}
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
          <section data-teema="tumma" data-verkko="alku" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "0 0 8px" }}>
            {" "}
            <div aria-label="Asiakkaitamme" className="mo-e-nauha-w mo-rv-n" style={{ position: "relative", height: "96px", overflow: "hidden", WebkitMask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", mask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
              {" "}
              <div className="mo-e-nauha" style={{ position: "absolute", top: "32px", left: "0" }}>
                {" "}
                {(LOGOT).map((l: any, lI: number) => (
                  <Fragment key={lI}>
                    <img src={l.src} width={logoLeveys(l.src, l.h)} height={l.h} alt={l.alt} style={{ height: `${l.h}px`, width: `${l.w}px`, display: "block", filter: l.f, opacity: ".78" }} decoding="async" />
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-rv-z" data-laske="1" style={{ position: "relative", margin: "6px 16px 0", padding: "20px 20px 4px", borderRadius: "24px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
              {" "}
              <p className="mo-l-bk">
                {"Katselukertaa yhteensä"}
              </p>
              {" "}
              <div style={{ marginTop: "6px", fontSize: "48px", lineHeight: "1", letterSpacing: "-.045em", fontWeight: "680", color: "#6fecff", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                <span data-luku="5000000" data-luku-jalki="+">{"5 000 000+"}</span>
              </div>
              {" "}
              <div style={{ marginTop: "14px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
                <i data-luku-palkki="" style={{ display: "block", height: "100%", width: "100%", transform: "scaleX(1)", transformOrigin: "0 50%", borderRadius: "2px", background: "linear-gradient(90deg, #6fecff, #ff9a4d)" }}></i>
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "baseline", gap: "12px", padding: "14px 0", marginTop: "14px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                <span style={{ fontSize: "14px", lineHeight: "1.35", color: "#c9d6e2" }}>
                  {"katselukertaa yhdelle asiakkaalle 3 kk:ssa"}
                </span>
                <b style={{ fontSize: "25px", letterSpacing: "-.03em", fontWeight: "660", color: "#f5f5f7", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  <span data-luku="1000000" data-luku-jalki="+">{"1 000 000+"}</span>
                </b>
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                {" "}
                <div style={{ padding: "14px 12px 14px 0", borderRight: "1px solid rgba(255,255,255,.08)" }}>
                  <b style={{ display: "block", fontSize: "25px", letterSpacing: "-.03em", fontWeight: "660", fontVariantNumeric: "tabular-nums" }}>
                    <span data-luku="150" data-luku-jalki="+">{"150+"}</span>
                  </b>
                  <span style={{ display: "block", marginTop: "3px", fontSize: "13px", lineHeight: "1.35", color: "#a9b8c6" }}>
                    {"toteutettua projektia"}
                  </span>
                </div>
                {" "}
                <div style={{ padding: "14px 0 14px 16px" }}>
                  <b style={{ display: "block", fontSize: "25px", letterSpacing: "-.03em", fontWeight: "660", fontVariantNumeric: "tabular-nums" }}>
                    <span data-luku="7">{"7"}</span>
                  </b>
                  <span style={{ display: "block", marginTop: "3px", fontSize: "13px", lineHeight: "1.35", color: "#a9b8c6" }}>
                    {"päivää keskim. toimitusaika"}
                  </span>
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* MIKSI */}
          {" "}
          <section id="m-miksi" data-teema="tumma" data-verkko="miksi" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "56px 16px 64px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Miksi lyhytvideot sopivat pienelle yritykselle?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16.5px", color: "#c3d0dc" }}>
                {"Moni asiakkaasi selaa lyhytvideoita joka päivä. Kun yrityksesi video osuu hänen eteensä ennen kuin hän tarvitsee palveluasi, olet se tuttu nimi silloin, kun tarve tulee."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv-s" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px", marginTop: "26px" }}>
              {" "}
              <div className="mo-l-bento mo-rv" style={{ gridColumn: "1 / -1", paddingBottom: "6px" }}>
                {" "}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  {" "}
                  <div>
                    <p className="mo-l-bk">
                      {"Pysyvyys"}
                    </p>
                    <b style={{ display: "block", marginTop: "6px", fontSize: "34px", lineHeight: "1", letterSpacing: "-.03em", fontWeight: "660" }}>
                      {"3 s"}
                    </b>
                    <p style={{ margin: "8px 0 0", fontSize: "15px", fontWeight: "600" }}>
                      {"Alku ratkaisee"}
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: "13.5px", lineHeight: "1.45", color: "#a9b8c6" }}>
                      {"Katsoja päättää muutamassa sekunnissa, jatkaako hän."}
                    </p>
                  </div>
                  {" "}
                </div>
                {" "}
                <svg viewBox="0 0 320 92" width="100%" height="92" style={{ display: "block", marginTop: "8px" }} aria-hidden="true">
                  <line x1="34" y1="4" x2="34" y2="80" stroke="rgba(111,236,255,.35)" strokeDasharray="3 3"></line>
                  <text x="38" y="12" fontSize="9" fill="#6fecff" fontFamily="inherit">
                    {"3 s"}
                  </text>
                  <path className="mo-l-viiva" d="M4 10 C 20 12, 28 14, 34 34 S 60 52, 110 56 S 220 62, 316 66" fill="none" stroke="#ff4d8d" strokeWidth="2.2" strokeLinecap="round"></path>
                  <path d="M4 10 C 20 12, 28 14, 34 34 S 60 52, 110 56 S 220 62, 316 66 L316 84 L4 84 Z" fill="url(#m-lgp)" opacity=".35"></path>
                  <defs>
                    <linearGradient id="m-lgp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ff4d8d" stopOpacity=".5"></stop>
                      <stop offset="1" stopColor="#ff4d8d" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <text x="4" y="91" fontSize="8.5" fill="#6f8191" fontFamily="inherit">
                    {"0:00"}
                  </text>
                  <text x="296" y="91" fontSize="8.5" fill="#6f8191" fontFamily="inherit">
                    {"0:30"}
                  </text>
                </svg>
                {" "}
              </div>
              {" "}
              <div className="mo-l-bento mo-rv">
                {" "}
                <p className="mo-l-bk">
                  {"Samasta kuvauksesta"}
                </p>
                {" "}
                <b style={{ display: "block", marginTop: "6px", fontSize: "26px", lineHeight: "1", letterSpacing: "-.03em", fontWeight: "660" }}>
                  {"4 kanavaa"}
                </b>
                {" "}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "56px", marginTop: "12px" }}>
                  {" "}
                  <i className="mo-l-pylv" style={{ flex: "1", height: "100%", borderRadius: "5px 5px 2px 2px", background: "linear-gradient(180deg, #6fecff, rgba(111,236,255,.25))" }}></i>
                  {" "}
                  <i className="mo-l-pylv" style={{ flex: "1", height: "88%", borderRadius: "5px 5px 2px 2px", background: "linear-gradient(180deg, #6fecff, rgba(111,236,255,.25))" }}></i>
                  {" "}
                  <i className="mo-l-pylv" style={{ flex: "1", height: "74%", borderRadius: "5px 5px 2px 2px", background: "linear-gradient(180deg, #6fecff, rgba(111,236,255,.25))" }}></i>
                  {" "}
                  <i className="mo-l-pylv" style={{ flex: "1", height: "52%", borderRadius: "5px 5px 2px 2px", background: "linear-gradient(180deg, #6fecff, rgba(111,236,255,.25))" }}></i>
                  {" "}
                </div>
                {" "}
                <p style={{ display: "flex", justifyContent: "space-between", margin: "5px 0 0", fontSize: "8.5px", color: "#8fa3b5" }}>
                  <span>
                    {"TikTok"}
                  </span>
                  <span>
                    {"Reels"}
                  </span>
                  <span>
                    {"Shorts"}
                  </span>
                  <span>
                    {"LinkedIn"}
                  </span>
                </p>
                {" "}
                <p style={{ margin: "10px 0 0", fontSize: "13px", lineHeight: "1.4", color: "#a9b8c6" }}>
                  {"Yksi kuvauspäivä riittää kaikkiin neljään."}
                </p>
                {" "}
              </div>
              {" "}
              <div className="mo-l-bento mo-rv">
                {" "}
                <p className="mo-l-bk">
                  {"Yhteydenotot"}
                </p>
                {" "}
                <b style={{ display: "block", marginTop: "6px", fontSize: "26px", lineHeight: "1", letterSpacing: "-.03em", fontWeight: "660" }}>
                  {"Mitattu"}
                </b>
                {" "}
                <svg viewBox="0 0 140 62" width="100%" height="62" style={{ display: "block", marginTop: "10px" }} aria-hidden="true">
                  <path d="M2 50 L30 48 L58 51 L86 47 L114 49 L138 46" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.6" strokeDasharray="3 3"></path>
                  <path className="mo-l-viiva" d="M2 52 L24 50 L46 44 L68 38 L90 26 L112 20 L138 8" fill="none" stroke="#6fecff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <circle cx="138" cy="8" r="3" fill="#6fecff"></circle>
                </svg>
                {" "}
                <p style={{ display: "flex", gap: "10px", margin: "6px 0 0", fontSize: "8.5px", color: "#8fa3b5" }}>
                  <span>
                    {"- - ennen"}
                  </span>
                  <span style={{ color: "#6fecff" }}>
                    {"videoiden jälkeen"}
                  </span>
                </p>
                {" "}
                <p style={{ margin: "8px 0 0", fontSize: "13px", lineHeight: "1.4", color: "#a9b8c6" }}>
                  {"Tavoite on yhteydenotto, ei pelkkä katselu."}
                </p>
                {" "}
              </div>
              {" "}
              <div className="mo-l-bento mo-rv" style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 118px", gap: "10px", alignItems: "center" }}>
                {" "}
                <div>
                  <p className="mo-l-bk">
                    {"Yhdelle asiakkaalle"}
                  </p>
                  <b style={{ display: "block", marginTop: "6px", fontSize: "30px", lineHeight: "1", letterSpacing: "-.035em", fontWeight: "680", color: "#6fecff", whiteSpace: "nowrap" }}>
                    {"1 000 000+"}
                  </b>
                  <p style={{ margin: "8px 0 0", fontSize: "15px", fontWeight: "600" }}>
                    {"Näkyvyyttä ilman mainosbudjettia"}
                  </p>
                  <p style={{ margin: "3px 0 0", fontSize: "13.5px", lineHeight: "1.45", color: "#a9b8c6" }}>
                    {"Uuden tilin video voi levitä yhtä laajalle kuin tunnetun yrityksen."}
                  </p>
                </div>
                {" "}
                <svg viewBox="0 0 118 90" width="118" height="90" aria-hidden="true">
                  <path className="mo-l-viiva" d="M2 84 C 30 82, 46 76, 60 60 S 86 18, 116 6" fill="none" stroke="#ff4d8d" strokeWidth="2.4" strokeLinecap="round"></path>
                  <circle cx="116" cy="6" r="3.5" fill="#ff4d8d" className="mo-l-pulssi" style={{ borderRadius: "50%" }}></circle>
                </svg>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* VÄITE 1 */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="vaite1" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "520px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 44px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z" aria-hidden="false">
              <img data-px="1" src={TYHJA} data-mo-src="/kuvat/fx9-k.webp" alt="Kuvaaja ja kamera kuvauspäivänä" style={{ opacity: ".9", top: "10px", height: "370px", objectPosition: "43% 50%", WebkitMask: "linear-gradient(180deg, #000 72%, transparent 100%)", mask: "linear-gradient(180deg, #000 72%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "34px", lineHeight: "1.06", letterSpacing: "-.025em", fontWeight: "660" }}>
              {"Algoritmi jakaa sisältöä kiinnostuksen, ei "}
              <span style={{ color: "#6fecff" }}>
                {"seuraajamäärän mukaan."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Uusi tili voi tavoittaa saman yleisön kuin vakiintunut brändi. Se on pienen yrityksen etu."}
            </p>
            {" "}
          </section>
          {" "}
          {/* KANAVAT */}
          {" "}
          <section id="m-alustat" data-teema="tumma" data-verkko="alustat" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "28px 0 36px" }}>
            {" "}
            <div style={{ padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"TikTok, Instagram Reels vai YouTube Shorts?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16.5px", color: "#c3d0dc" }}>
                {"Vastaus on yleensä kaikki kolme, ja sama video toimii niissä kaikissa. Ratkaiseva ero ei ole alusta vaan käsikirjoitus: se päättää, pysähtyykö katsoja."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-e-x mo-rv mo-d1" data-lv="kanavat" style={{ gap: "12px", padding: "24px 22px 6px", scrollPaddingLeft: "22px" }}>
              {" "}
              {(KANAVAT).map((k: any, kI: number) => (
                <Fragment key={kI}>
                  {" "}
                  <article className="mo-l-kanava">
                    {" "}
                    <div style={{ position: "relative", height: "150px", overflow: "hidden" }}>
                      <img src={TYHJA} data-mo-src={k.kuva} alt={k.alt} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: k.pos }} loading="lazy" decoding="async" />
                      <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(8,13,19,.1) 30%, rgba(14,22,31,.96) 100%)" }}></span>
                      <div className="mo-l-raita" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "14px", backgroundImage: `repeating-linear-gradient(-55deg, ${k.vari} 0 9px, transparent 9px 18px)`, backgroundSize: "28px 14px" }}></div>
                    </div>
                    {" "}
                    <div style={{ position: "relative", padding: "0 18px 20px", marginTop: "-22px" }}>
                      {" "}
                      <span style={{ display: "flex", width: "44px", height: "44px", borderRadius: "13px", alignItems: "center", justifyContent: "center", background: k.ikBg, boxShadow: "0 10px 24px -8px rgba(0,0,0,.8), 0 0 0 3px #0e161f" }}>
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={k.ikoni}></path>
                        </svg>
                      </span>
                      {" "}
                      <h3 style={{ margin: "14px 0 0", fontSize: "20px", lineHeight: "1.2", letterSpacing: "-.012em", fontWeight: "630" }}>
                        {k.nimi}
                      </h3>
                      {" "}
                      <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#b9c7d4" }}>
                        {k.teksti}
                      </p>
                      {" "}
                      <span className="mo-e-chip" style={{ height: "28px", marginTop: "14px", padding: "0 11px", fontSize: "12.5px", color: k.vari, boxShadow: `inset 0 0 0 1px ${k.vari}` }}>
                        {k.tag}
                      </span>
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
              {(KANAVA_PISTEET).map((p: any, pI: number) => (
                <Fragment key={pI}>
                  <span style={{ width: `${p.w}px`, height: "6px", borderRadius: "3px", background: p.c, transition: "width .35s, background-color .35s" }}></span>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ margin: "22px 16px 0", padding: "18px 18px", borderRadius: "20px", background: "rgba(111,236,255,.06)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.18)" }}>
              {" "}
              <p className="mo-l-bk" style={{ color: "#b4f5ff" }}>
                {"Kaikki kolme, yhdestä kuvauksesta"}
              </p>
              {" "}
              <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#dbe5ee" }}>
                {"Kartoituksessa katsotaan, mitkä kanavat sinun asiakkaasi oikeasti käyttävät ja mitä niihin kannattaa tehdä."}
              </p>
              {" "}
              <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ width: "100%", height: "48px", marginTop: "14px" }}>
                {"Varaa maksuton kartoitus"}
              </a>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* TYÖT */}
          {" "}
          <section id="m-tyot" data-teema="tumma" data-verkko="tyot" data-vari="#0a1119" style={{ position: "relative", zIndex: "1", overflow: "hidden", padding: "30px 0 56px" }}>
            {" "}
            <div style={{ padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Esimerkkejä tekemistämme somevideoista"}
              </h2>
              {" "}
            </div>
            {" "}
            <div className="mo-e-x mo-rv mo-d1" data-lv="refit" style={{ position: "relative", gap: "14px", padding: "30px 95px 22px" }}>
              {" "}
              {(REFIT).map((r: any, rI: number) => (
                <Fragment key={rI}>
                  {" "}
                  <div className="mo-l-ref mo-e-ref-w" style={{ transform: `scale(${r.sk})`, opacity: r.op }}>
                    {" "}
                    <img src={TYHJA} data-mo-src={r.kuva} alt={r.alt} loading="lazy" decoding="async" />
                    {" "}
                    <video data-ref={r.i} src={r.video} data-mo-poster={r.kuva} loop playsInline preload="none" style={{ opacity: r.vOp, transition: "opacity .4s" }}></video>
                    {" "}
                    <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 52%, rgba(0,0,0,.82) 100%)" }}></span>
                    {" "}
                    <span className="mo-e-prog">
                      <i style={{ animationPlayState: r.toisto }}></i>
                    </span>
                    {" "}
                    <span style={{ position: "absolute", left: "14px", right: "14px", bottom: "16px" }}>
                      <b style={{ display: "block", fontSize: "16px", fontWeight: "600" }}>
                        {r.nimi}
                      </b>
                      <span style={{ display: "block", marginTop: "2px", fontSize: "13px", lineHeight: "1.4", color: "#d2d2d7" }}>
                        {r.ala}
                      </span>
                    </span>
                    {" "}
                  </div>
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
          </section>
          {" "}
          {/* KUVAUSPÄIVÄ */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="laatta" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "480px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 40px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z" aria-hidden="false">
              <img data-px="1" src={TYHJA} data-mo-src="/kuvat/halli.webp" alt="Kuvauspäivä hallissa" style={{ opacity: ".8" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "0", fontSize: "40px", lineHeight: "1.02", letterSpacing: "-.03em", fontWeight: "680" }}>
              {"Yksi päivä, "}
              <span style={{ color: "#6fecff" }}>
                {"useita kanavia."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d2" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Kuvaamme kerralla usean videon materiaalit, joten sinun ei tarvitse varata aikaa kuvauksiin joka viikko."}
            </p>
            {" "}
          </section>
          {" "}
          {/* PROSESSI */}
          {" "}
          <section id="m-prosessi" data-teema="tumma" data-verkko="prosessi" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "48px 22px 60px" }}>
            {" "}
            <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
              {"Näin lyhytvideotuotanto etenee."}
            </h2>
            {" "}
            <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16.5px", color: "#c3d0dc" }}>
              {"Ensimmäisestä puhelusta valmiisiin videoihin kuluu tyypillisesti noin 10 päivää. Sinun aikaasi kuluu korkeintaan 1–2 tuntia kuukaudessa."}
            </p>
            {" "}
            <ol data-aikajana="1" style={{ position: "relative", listStyle: "none", margin: "30px 0 0", padding: "0" }}>
              {" "}
              <span aria-hidden="true" style={{ position: "absolute", left: "19px", top: "20px", bottom: "40px", width: "2px", background: "rgba(255,255,255,.08)" }}>
                <i data-lv="aikajana-palkki" style={{ display: "block", width: "100%", height: "100%", transform: "scaleY(0)", transformOrigin: "50% 0", background: "linear-gradient(#6fecff, #ff9a4d)", borderRadius: "1px" }}></i>
              </span>
              {" "}
              {(ASKELEET).map((a: any, aI: number) => (
                <Fragment key={aI}>
                  {" "}
                  <li className="mo-l-askel">
                    {" "}
                    <span className="mo-l-nro" data-lv-nro={aI} style={{ position: "relative", background: a.bg, color: a.fg, boxShadow: a.reuna }}>
                      {a.n}
                    </span>
                    {" "}
                    <div data-lv-askel={aI} style={{ paddingTop: "8px", opacity: a.op, transition: "opacity .5s" }}>
                      <b style={{ fontSize: "18px", fontWeight: "630", letterSpacing: "-.01em" }}>
                        {a.t}
                      </b>
                      <p style={{ margin: "5px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#b9c7d4" }}>
                        {a.v}
                      </p>
                    </div>
                    {" "}
                  </li>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </ol>
            {" "}
            <div className="mo-rv-s" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              {" "}
              <div className="mo-l-bento" style={{ display: "grid", gridTemplateColumns: "34px minmax(0, 1fr)", gap: "12px" }}>
                <span style={{ width: "34px", height: "34px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(111,236,255,.1)", color: "#6fecff" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"></path>
                    <circle cx="12" cy="10" r="2.4"></circle>
                  </svg>
                </span>
                <div>
                  <p className="mo-l-bk">
                    {"Missä kuvaamme"}
                  </p>
                  <p style={{ margin: "5px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#dbe5ee" }}>
                    {"Kuvaamme viikoittain Espoossa, Helsingissä ja Vantaalla ja muualla Suomessa sovitusti. Käsikirjoitus, editointi ja julkaisu hoituvat etänä."}
                  </p>
                </div>
              </div>
              {" "}
              <div className="mo-l-bento" style={{ background: "rgba(111,236,255,.06)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.18)" }}>
                <p className="mo-l-bk" style={{ color: "#b4f5ff" }}>
                  {"Et tarvitse käsikirjoitusta valmiiksi"}
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#dbe5ee" }}>
                  {"Kartoituksessa käymme läpi, mitä yritys tekee ja kenelle, ja rakennamme ensimmäisen kuukauden sisällöt sen pohjalta."}
                </p>
                <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ width: "100%", height: "46px", marginTop: "14px" }}>
                  {"Varaa maksuton kartoitus"}
                </a>
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* KOKONAISUUS */}
          {" "}
          <section id="m-kokonaisuus" data-teema="tumma" data-verkko="kokonaisuus" data-vari="#0d1824" style={{ position: "relative", zIndex: "1", padding: "30px 22px 64px" }}>
            {" "}
            <h2 className="mo-e-h2 mo-rv mo-d1" style={{ fontSize: "30px" }}>
              {"Lyhytvideo tekee yrityksesi tutuksi. "}
              <span style={{ color: "#9fb0bf" }}>
                {"Mainonta ja Google-haku tuovat yhteydenotot."}
              </span>
            </h2>
            {" "}
            <div className="mo-rv-s" style={{ position: "relative", marginTop: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>
              {" "}
              {(KETJU).map((k: any, kI: number) => (
                <Fragment key={kI}>
                  {" "}
                  <div className="mo-l-bento mo-l-ketju" style={{ display: "grid", gridTemplateColumns: "56px minmax(0, 1fr)", gap: "14px", padding: "16px", overflow: "visible" }}>
                    {" "}
                    <div style={{ position: "relative", width: "56px", height: "56px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,154,77,.09)", boxShadow: "inset 0 0 0 1px rgba(255,154,77,.25)", color: "#ff9a4d" }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={k.ikoni}></path>
                      </svg>
                      <span style={{ position: "absolute", right: "-6px", top: "-6px", width: "20px", height: "20px", borderRadius: "50%", background: "#ff9a4d", color: "#0b0f14", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {k.n}
                      </span>
                    </div>
                    {" "}
                    <div>
                      <p style={{ margin: "0", fontSize: "11.5px", fontWeight: "650", letterSpacing: ".14em", color: "#ff9a4d" }}>
                        {k.kick}
                      </p>
                      <b style={{ display: "block", marginTop: "3px", fontSize: "18px", fontWeight: "630" }}>
                        {k.nimi}
                      </b>
                      <p style={{ margin: "5px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#b9c7d4" }}>
                        {k.teksti}
                      </p>
                      {k.linkki ? (
                        <>
                          <a href="/hakukoneoptimointi" className="mo-osuma" style={{ display: "inline-flex", minHeight: "36px", alignItems: "center", fontSize: "14.5px", fontWeight: "600", textDecoration: "none" }}>
                            {"Hakukoneoptimointi →"}
                          </a>
                        </>
                      ) : null}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* VÄITE 2 */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="vaite2" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "500px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 44px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z" aria-hidden="false">
              <img data-px="1" src={TYHJA} data-mo-src="/mobiili/huoltoasema-terava.webp" alt="Kuvaus huoltoasemalla" style={{ opacity: ".85", objectPosition: "60% 50%" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "40px", lineHeight: "1.02", letterSpacing: "-.03em", fontWeight: "680" }}>
              {"Näyttökerrat ovat "}
              <span style={{ color: "#6fecff" }}>
                {"välitavoite."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Ohjaamme katsojan verkkosivuille, yhteydenottolomakkeelle tai myymälään ja mittaamme, mitä siitä seuraa."}
            </p>
            {" "}
          </section>
          {" "}
          {/* HINNOITTELU */}
          {" "}
          <section id="m-hinnoittelu" data-teema="tumma" data-verkko="hinnoittelu" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "48px 16px 36px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Paljonko somevideot ja lyhytvideot maksavat?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Kiinteä kuukausihinta, ei aloitusmaksuja eikä pitkiä sopimuksia. Irtisanominen kuukausi kerrallaan."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Paketit" style={{ marginTop: "22px" }}>
              {" "}
              {(PAKETIT).map((p: any, pI: number) => (
                <Fragment key={pI}>
                  <button type="button" role="tab" aria-selected={p.on} data-lv-paketti={pI} style={{ background: p.tabBg, color: p.tabFg }}>
                    {p.nimi}
                  </button>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            {(PAKETIT_AUKI).map((p: any, pI: number) => (
              <Fragment key={pI}>
                {" "}
                <article className="mo-l-kortti-in" data-lv-paketti-kortti={pI} hidden={!p.on} style={{ position: "relative", marginTop: "12px", padding: "22px 20px 20px", borderRadius: "24px", background: p.bg, boxShadow: p.reuna }}>
                  {" "}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="mo-l-bk" style={{ color: p.kickVari }}>
                      {p.nimi}
                    </span>
                    {p.suosittu ? (
                      <>
                        <span className="mo-e-chip" style={{ height: "26px", padding: "0 10px", fontSize: "12px", background: "#6fecff", color: "#0b0f14" }}>
                          {"Suosituin"}
                        </span>
                      </>
                    ) : null}
                  </div>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "10px" }}>
                    <b style={{ fontSize: `${p.koko}px`, lineHeight: "1", letterSpacing: "-.04em", fontWeight: "680" }}>
                      {p.hinta}
                    </b>
                    <span style={{ fontSize: "14px", color: "#a9b8c6" }}>
                      {p.yks}
                    </span>
                  </div>
                  {" "}
                  <p style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#c3d0dc" }}>
                    {p.kuvaus}
                  </p>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "16px 0 0", padding: "0" }}>
                    {" "}
                    {(p.rivit).map((r: any, rI: number) => (
                      <Fragment key={rI}>
                        <li className="mo-l-li">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6fecff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12.5l4.2 4L19 7"></path>
                          </svg>
                          <span>
                            {r}
                          </span>
                        </li>
                      </Fragment>
                    ))}
                    {" "}
                  </ul>
                  {" "}
                  <a data-ankkuri="tarjous" role="link" tabIndex={0} className="mo-e-btn mo-e-p" style={{ width: "100%", marginTop: "16px" }}>
                    {"Pyydä tarjous"}
                  </a>
                  {" "}
                </article>
                {" "}
              </Fragment>
            ))}
            {" "}
            <p className="mo-rv" style={{ margin: "14px 6px 0", fontSize: "13.5px", lineHeight: "1.5", color: "#8fa3b5" }}>
              {"Yksittäiset lyhytvideot ja kampanjatuotannot hinnoitellaan projekteina. Kaikki hinnat + alv 25,5 %."}
            </p>
            {" "}
          </section>
          {" "}
          {/* KENELLE */}
          {" "}
          <section id="m-kenelle" data-teema="tumma" data-verkko="kenelle" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "30px 16px 60px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ marginTop: "12px" }}>
                {"Kenelle lyhytvideotuotanto sopii?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Jos tilanteesi kuuluu jälkimmäiseen ryhmään, sanomme sen suoraan jo kartoituksessa. Se säästää molempien aikaa ja rahaa."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Sopiiko" style={{ marginTop: "20px" }}>
              {" "}
              <button type="button" role="tab" aria-selected={true} data-lv-kenelle="0" style={{ background: "#6fecff", color: "#0b0f14" }}>
                {"Sopii, jos"}
              </button>
              {" "}
              <button type="button" role="tab" aria-selected={false} data-lv-kenelle="1" style={{ background: "transparent", color: "#c9d6e2" }}>
                {"Ei kannata, jos"}
              </button>
              {" "}
            </div>
            {" "}
            {(KE_LISTAT).map((l: any, lI: number) => (
              <Fragment key={lI}>
                {" "}
                <ul className="mo-l-kortti-in" data-lv-kenelle-lista={lI} hidden={lI !== 0} style={{ listStyle: "none", margin: "12px 0 0", padding: "6px 18px", borderRadius: "22px", background: "rgba(255,255,255,.035)", boxShadow: `inset 0 0 0 1px ${l.reuna}` }}>
                  {" "}
                  {(l.rivit).map((r: any, rI: number) => (
                    <Fragment key={rI}>
                      {" "}
                      <li style={{ display: "grid", gridTemplateColumns: "24px minmax(0, 1fr)", gap: "12px", padding: "14px 0", borderTop: r.raja }}>
                        <span style={{ width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: l.ikBg }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={l.ikVari} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={l.ikoni}></path>
                          </svg>
                        </span>
                        <span>
                          <span style={{ display: "block", fontSize: "15.5px", lineHeight: "1.45", color: "#eef3f7" }}>
                            {r.t}
                          </span>
                          {r.v ? (
                            <>
                              <span style={{ display: "block", marginTop: "3px", fontSize: "13.5px", lineHeight: "1.45", color: "#9fb0bf" }}>
                                {r.v}
                              </span>
                            </>
                          ) : null}
                        </span>
                      </li>
                      {" "}
                    </Fragment>
                  ))}
                  {" "}
                </ul>
                {" "}
              </Fragment>
            ))}
            {" "}
            <div className="mo-rv" style={{ marginTop: "12px", padding: "18px", borderRadius: "22px", background: "rgba(111,236,255,.06)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.18)" }}>
              {" "}
              <b style={{ fontSize: "17px", fontWeight: "630" }}>
                {"Etkö ole varma, kumpaan ryhmään kuulut?"}
              </b>
              {" "}
              <p style={{ margin: "6px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#c3d0dc" }}>
                {"Kysy meiltä. Vastaamme suoraan myös silloin, jos lyhytvideot eivät ole sinulle oikea ratkaisu."}
              </p>
              {" "}
              <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ flex: "1.4", height: "46px", padding: "0 12px", fontSize: "14.5px" }}>
                  {"Varaa kartoitus"}
                </a>
                <a data-ankkuri="tarjous" role="link" tabIndex={0} className="mo-e-btn mo-e-o" style={{ flex: "1", height: "46px", padding: "0 12px", fontSize: "14.5px" }}>
                  {"Kysy viestillä"}
                </a>
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* UKK */}
          {" "}
          <section id="m-ukk" data-teema="tumma" data-verkko="ukk" data-verkko-alfa="0.18" data-vari="#0b121a" style={{ position: "relative", zIndex: "1", padding: "30px 22px 44px" }}>
            {" "}
            <div className="mo-rv">
              {" "}
              <h2 className="mo-e-h2" style={{ fontSize: "30px" }}>
                {"Usein kysytyt kysymykset lyhytvideotuotannosta"}
              </h2>
              {" "}
              <p className="mo-e-lead" style={{ marginTop: "12px", fontSize: "16px", color: "#b9c7d4" }}>
                {"Hinta, määrä, aikataulu ja se mitä työhön oikeasti sisältyy."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-d1" style={{ marginTop: "16px" }}>
              {" "}
              {(UKK_).map((q: any, qI: number) => (
                <div key={qI} data-ukk-rivi={qI} hidden={qI >= 6}>
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
              <button type="button" data-ukk-kaikki="" className="mo-e-btn mo-e-o" style={{ width: "100%", marginTop: "16px" }}>
                    {"Näytä kaikki " + UKK.length + " kysymystä"}
                  </button>
              {" "}
              <p style={{ margin: "22px 0 0", fontSize: "11.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8fa3b5" }}>
                {"Etkö löytänyt vastausta?"}
              </p>
              {" "}
              <a data-ankkuri="tarjous" role="link" tabIndex={0} className="mo-osuma" style={{ display: "inline-flex", alignItems: "center", minHeight: "40px", fontSize: "16.5px", fontWeight: "600", textDecoration: "none" }}>
                {"Kysy suoraan, vastaamme 24 tunnissa"}
              </a>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* ALUEET + KÄYTÄNNÖSSÄ */}
          {" "}
          <section id="m-alueet" data-teema="tumma" data-verkko="alueet" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "30px 16px 56px" }}>
            {" "}
            <h2 className="mo-e-h2 mo-rv" style={{ padding: "0 6px", fontSize: "28px" }}>
              {"Lyhytvideotuotantoa Espoosta koko Suomeen"}
            </h2>
            {" "}
            <div className="mo-rv-s" style={{ marginTop: "18px", borderRadius: "22px", background: "rgba(255,255,255,.035)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)", overflow: "hidden" }}>
              {" "}
              {(ALUEET).map((a: any, aI: number) => (
                <Fragment key={aI}>
                  <div style={{ display: "grid", gridTemplateColumns: "96px minmax(0, 1fr)", gap: "12px", padding: "16px 18px", borderTop: a.raja }}>
                    <b style={{ fontSize: "17px", fontWeight: "630", color: "#6fecff" }}>
                      {a.t}
                    </b>
                    <span style={{ fontSize: "14.5px", lineHeight: "1.5", color: "#c3d0dc" }}>
                      {a.v}
                    </span>
                  </div>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div className="mo-rv" style={{ marginTop: "40px", padding: "0 6px" }}>
              {" "}
              <h3 style={{ margin: "0 0 0", fontSize: "22px", lineHeight: "1.2", letterSpacing: "-.015em", fontWeight: "640" }}>
                {"Mitä lyhytvideotuotanto tarkoittaa käytännössä?"}
              </h3>
              {" "}
              <p style={{ margin: "12px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                {"Lyhytvideotuotanto eli somevideoiden tekeminen yritykselle tarkoittaa alle minuutin pituisten pystyvideoiden suunnittelua, kuvaamista ja editointia sosiaalisen median kanaviin. Käytännössä kyse on jatkuvasta tuotannosta: yksittäinen video ei muuta mitään, mutta säännöllinen julkaisutahti kerryttää katseluaikaa, ja katseluaika on se signaali, jonka perusteella algoritmit päättävät, kenelle sisältö näytetään."}
              </p>
              {" "}
              <div className="mo-e-vast" data-lv="seo" hidden>
                    {" "}
                    <p style={{ margin: "14px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Tämä on myös syy siihen, miksi lyhytvideot ovat pk-yritykselle poikkeuksellisen edullinen kanava. Perinteisessä mainonnassa näkyvyys ostetaan budjetilla. Lyhytvideoissa se ansaitaan sisällöllä, ja koska algoritmi arvioi jokaisen videon erikseen, tuntemattoman yrityksen video voi levitä yhtä laajalle kuin vakiintuneen brändin. Maksettu mainonta ei häviä kuvasta, mutta sen rooli muuttuu: sitä käytetään vahvistamaan videoita, jotka ovat jo osoittautuneet toimiviksi orgaanisesti."}
                    </p>
                    {" "}
                    <h3 style={{ margin: "22px 0 0", fontSize: "19px", lineHeight: "1.25", fontWeight: "630" }}>
                      {"Mikä lyhytvideossa ratkaisee?"}
                    </h3>
                    {" "}
                    <p style={{ margin: "10px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Kolme asiaa toistuu jokaisessa videossa, joka toimii. "}
                      <b style={{ color: "#fff" }}>
                        {"Koukku"}
                      </b>
                      {" eli ensimmäiset kolme sekuntia, joiden aikana katsoja päättää, jatkaako. "}
                      <b style={{ color: "#fff" }}>
                        {"Rytmi"}
                      </b>
                      {" eli leikkauspisteet, jotka pitävät katseen ruudussa loppuun asti. "}
                      <b style={{ color: "#fff" }}>
                        {"Selkeä lopetus"}
                      </b>
                      {" eli se, mitä katsojan halutaan tekevän, sanottuna ääneen. Tekniikka, valo ja ääni ovat perusedellytyksiä, mutta ne eivät yksin pelasta videota, jonka aloitus ei pysäytä."}
                    </p>
                    {" "}
                    <h3 style={{ margin: "22px 0 0", fontSize: "19px", lineHeight: "1.25", fontWeight: "630" }}>
                      {"Kannattaako lyhytvideotuotanto ulkoistaa?"}
                    </h3>
                    {" "}
                    <p style={{ margin: "10px 0 0", fontSize: "15.5px", lineHeight: "1.65", color: "#b9c7d4" }}>
                      {"Itse tekeminen on halvinta silloin, kun yrityksessä on henkilö, jolla on sekä taito että aika pitää julkaisutahtia yllä kuukaudesta toiseen. Käytännössä juuri tahti on se, mikä katkeaa ensimmäisenä kiireisenä kuukautena, ja katkennut tahti nollaa kertyneen näkyvyyden nopeammin kuin sen rakentaminen kesti. Ulkoistamisen todellinen hyöty ei ole pelkkä tuotannon laatu vaan se, että sisältöä syntyy myös silloin, kun yrityksellä on kiire."}
                    </p>
                    {" "}
                  </div>
              {" "}
              <button type="button" data-lv="seo-nappi" className="mo-e-btn mo-e-o mo-osuma" style={{ height: "42px", marginTop: "16px", padding: "0 16px", fontSize: "14.5px" }}>
                {"Lue koko teksti"}
              </button>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* TARJOUS */}
          {" "}
          <section id="m-tarjous" data-teema="tumma" data-verkko="lomake" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", overflow: "hidden", padding: "56px 0 44px", background: "#080d13" }}>
            {" "}
            <img src={TYHJA} data-mo-src="/kuvat/tarjous-kortit-k.webp" alt="" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "620px", objectFit: "cover", objectPosition: "14% 0%", opacity: ".5", WebkitMask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)", mask: "linear-gradient(180deg, #000 0%, #000 50%, transparent 100%)" }} loading="lazy" decoding="async" />
            {" "}
            <div style={{ position: "relative", padding: "0 22px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv mo-d1" style={{ color: "#fff" }}>
                {"Valmis aloittamaan "}
                <span style={{ color: "#6fecff" }}>
                  {"lyhytvideotuotannon?"}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "16px", color: "#c9d6e2" }}>
                {"Vastaamme 24 tunnin sisällä ja kerromme suoraan, mitä ehdotamme ja mitä se maksaa. Voit myös soittaa numeroon "}
                <a href="tel:+358405648770" className="mo-osuma">
                  {"040 564 8770"}
                </a>
                {", ja tekijät esittelemme "}
                <a href="/meista" className="mo-osuma">
                  {"Meistä-sivulla"}
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
                      {"Puhelu tai etäpalaveri: tavoite, kanavat ja kuvausten käytäntö."}
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
              <form className="mo-rv mo-rv-s" data-lv="lomake" style={{ marginTop: "30px", padding: "22px 18px 20px", borderRadius: "24px", background: "linear-gradient(180deg, rgba(22,34,48,.88), rgba(12,19,28,.92))", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1), 0 40px 80px -40px rgba(0,0,0,.9)", display: "flex", flexDirection: "column", gap: "14px" }}>
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
                  {"Mitä tavoittelet lyhytvideoilla?"}
                  <textarea name="viesti" rows={4} style={{ height: "112px", paddingTop: "13px", resize: "none" }} />
                </label>
                {" "}
                <p className="mo-e-vast" data-lv="kiitos" hidden style={{ margin: "0", padding: "12px 14px", borderRadius: "12px", background: "rgba(111,236,255,.1)", color: "#b4f5ff", fontSize: "14.5px" }}>
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
          <Alatunniste />
        </div>
      </div>
      <Kuori reitti="/lyhytvideot" palvelu="Lyhytvideot" />
      <Moottori otsake={{ tapa: "iso", ka: 200, piilo: 150, lasi: -30 }} verkko={{ siemen: 11, tila: "syaani", pohja: [11, 19, 29] }} />
      <Efektit />
    </div>
  );
}
