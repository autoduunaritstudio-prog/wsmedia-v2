/* HAKUKONEOPTIMOINNIN PUHELINVERSIO (6.10.2026).

   Porttaus suunnitelmasta _mobiili-design/sivut/Hakukoneoptimointi.dc.html:
   rakenne, tekstit, tyylit ja jarjestys sellaisenaan. Merkinta on muunnettu
   koneellisesti (dc2jsx.mjs + tyokalut/seo.py) ja vierityksen arvot on
   korvattu alkutilalla (y = 0); Efektit.tsx ja Moottori.tsx kirjoittavat
   ne suoraan DOMiin. Naytetaan vain max-width: 767px (mobiili.css).

   Tietoiset poikkeamat suunnitelman toteutustavasta (nakyma sama):
   - Heron hehku: suunnitelma vaihtoi gradientin alfaa ja top-arvoa joka
     kehys. Tassa alfa on kiintea (suunnitelman maksimi 0,26) ja liike on
     opacity + translateY.
   - SERP-kortin syaani hehku oli box-shadowin alfa joka kehys; tassa se on
     oma varjokerroksensa, jonka opacity muuttuu.
   - Tyorivin vihrea palkki: leveys -> scaleX.
   - Valilehdet, tasot ja UKK: kaikki sisalto on HTML:ssa (suljetut
     hidden), Efektit vaihtaa. */
import { Ansa, LomakeVirhe } from "@/app/components/mobiili/Lomakeosat";
import "./mobiili.css";
import "./lisat.css";
import { Fragment, type CSSProperties } from "react";
import { mo, TYHJA, logoLeveys } from "@/app/components/mobiili/mo";
import Kuori from "@/app/components/mobiili/Kuori";
import Alatunniste from "@/app/components/mobiili/Alatunniste";
import Moottori from "@/app/components/mobiili/Moottori";
import Latausruutu from "@/app/components/Latausruutu";
import Efektit from "./Efektit";

/* ---- Suunnitelman renderVals()-tiedot sellaisenaan (alkutila y = 0) ---- */
const MUUT = [
  { nimi: 'Kilpailija Oy', polku: 'kilpailija.fi', otsikko: 'Ilmalämpöpumput ja asennus | Kilpailija Oy', ik: 'K', vari: '#e8710a' },
  { nimi: 'Verkkokauppa', polku: 'verkkokauppa.example', otsikko: 'Lämpöpumput edullisesti verkosta', ik: 'V', vari: '#1e8e3e' },
  { nimi: 'Yrityshakemisto', polku: 'hakemisto.example', otsikko: 'LVI-yritykset Espoo, vertaa tarjouksia', ik: 'H', vari: '#7b61ff' },
  { nimi: 'Lämpöpumppuopas', polku: 'lampopumppu-opas.example', otsikko: 'Näin valitset ilmalämpöpumpun, opas', ik: 'L', vari: '#d93025' }
];
const RIVI = 38;
/* pf = 0: e = 0, sijaF = 5, pp = 4 */
const TULOKSET = [
  ...MUUT.map((m, i) => Object.assign({}, m, { oma: false, y: Math.round((i + Math.max(0, Math.min(1, i + 1 - 4))) * RIVI), bg: '#fff', reuna: 'none', z: 1, sk: 1, op: '1.000', rad: 0, luokka: 's-rivi' })),
  { nimi: 'Yrityksesi Oy', polku: 'yrityksesi.fi', otsikko: 'Ilmalämpöpumpun asennus Espoossa | Yrityksesi Oy', ik: 'Y', vari: '#0b8aa3', oma: true, y: 4 * RIVI, bg: '#e8f9fc', reuna: 'inset 0 0 0 1.5px #0b8aa3, 0 8px 26px -10px rgba(11,138,163,.65)', z: 3, sk: 1, op: 1, rad: 10, merkki: '#0b8aa3', merkkiT: 'SINÄ', luokka: 's-rivi s-odota' }
];
const KIPINAT = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const ang = -Math.PI * (0.1 + 0.8 * i / 7); return { luokka: 's-kipina', x: 40 + i * 38, dx: Math.round(Math.cos(ang) * 36), dy: Math.round(Math.sin(ang) * 30), c: i % 2 ? '#6fecff' : '#7ff0b0' }; });
const TY = ['Tekninen', 'Sisältö', 'Linkit', 'Paikallinen'];
const TYOT_PILLIT = TY.map((t) => ({ t, op: 0, bg: '#101a28', fg: '#8fa3b5', reuna: 'inset 0 0 0 1px rgba(255,255,255,.1)' }));
const logot = [
  { src: '/logos/porsche-club-finland.png', alt: 'Porsche Club Finland', h: 34, f: 'brightness(0) invert(1)' },
  { src: '/logos/tesla-owners-finland-color.png', alt: 'Tesla Owners Finland', h: 34, f: 'none' },
  { src: '/logos/colormaster.png', alt: 'Colormaster', h: 28, f: 'brightness(0) invert(1)' },
  { src: '/logos/ydr-autohuolto.png', alt: 'YDR Autohuolto', h: 30, f: 'brightness(0) invert(1)' },
  { src: '/logos/ls-monogram-color.png', alt: 'Laaksolahden Sähkö', h: 32, f: 'none' }
].map((l) => Object.assign({}, l, { src: l.src.replace('/logos/', '/mobiili/logot/').replace('.png', '.webp') }));
const LOGOT = logot.concat(logot, logot, logot);
const SERP_MUUT = MUUT.slice(0, 3).map((m, i) => Object.assign({}, m, { d: (0.12 * (i + 1)).toFixed(2) }));
const LAHTEET = [{ t: 'Asennus ja hinnat', u: 'yrityksesi.fi', ik: 'Y', vari: '#0b8aa3', oma: true }, { t: 'Lämpöpumppuopas', u: 'energiavirasto.example', ik: 'E', vari: '#5f6368', oma: false }, { t: 'Ilmalämpöpumput', u: 'kilpailija.fi', ik: 'K', vari: '#e8710a', oma: false }].map((l, i) => Object.assign({}, l, { d: (0.25 + 0.12 * i).toFixed(2), bg: l.oma ? 'rgba(111,236,255,.12)' : 'rgba(255,255,255,.04)', reuna: l.oma ? 'inset 0 0 0 1px rgba(111,236,255,.5)' : 'inset 0 0 0 1px rgba(255,255,255,.08)' }));
// NELJÄ TYÖTÄ
const TYOT = [
  { lyhyt: 'Tekninen', ikoni: 'M10.3 4.3a1 1 0 0 1 1.4 0l1.3 1.3 1.8-.5.5 1.8 1.8.5-.5 1.8 1.3 1.3a1 1 0 0 1 0 1.4L17 13.2l.5 1.8-1.8.5-.5 1.8-1.8-.5-1.3 1.3a1 1 0 0 1-1.4 0M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', otsikko: 'Tekninen hakukoneoptimointi', kuvaus: 'Tekninen SEO ratkaisee, pääseekö sisältösi ylipäätään hakukoneen indeksiin ja kuinka nopeasti sivu latautuu käyttäjälle. Tämä laitetaan kerran kuntoon ja pidetään kunnossa.', rivit: [['Indeksointi ja sivustokartta', 'Robots.txt, XML-sivustokartta ja Search Consolen virheiden korjaus'], ['Sivuston nopeus ja Core Web Vitals', 'Latausajat, kuvien optimointi ja renderöintiä estävät resurssit'], ['Otsikkorakenne ja metatiedot', 'H1–H3-hierarkia, title-tagit ja kuvaukset sivu kerrallaan'], ['Strukturoitu data', 'Schema.org-merkinnät: LocalBusiness, Service, FAQ ja artikkelit'], ['Sisäinen linkitys', 'Sivut linkitetään niin, että tärkeimmät saavat eniten painoarvoa'], ['Uudelleenohjaukset ja rikkinäiset linkit', '404-virheiden monitorointi ja vanhojen osoitteiden ohjaus']] },
  { lyhyt: 'Sisältö', ikoni: 'M5 6h14M5 10h14M5 14h9M5 18h6', otsikko: 'Sisältö ja avainsanat', kuvaus: 'Avainsanatutkimus on koko työn kivijalka: se kertoo mitä asiakkaasi oikeasti kirjoittavat hakukenttään ja millä hauilla on ostoaikomus. Sisältö rakennetaan niiden ympärille, ei toisin päin.', rivit: [['Avainsanatutkimus', 'Hakuvolyymit, kilpailutaso ja ostoaikomus jokaiselle hakusanalle'], ['Kilpailija-analyysi', 'Mitkä sivut rankkaavat nyt, millä sisällöllä ja mitä niistä puuttuu'], ['Sivukohtainen kohdistus', 'Yksi sivu, yksi pääavainsana, omat sivut eivät kilpaile keskenään'], ['Sisällön optimointi', 'Otsikot, väliotsikot, leipätekstit ja kuvien alt-tekstit'], ['Uusi sisältö', 'Palvelusivut, kaupunkisivut ja blogiartikkelit julkaisuvalmiina'], ['Vastausmuotoinen sisältö', 'Kysymys ja suora vastaus, sama muoto toimii FAQ-tuloksissa ja tekoälyvastauksissa']] },
  { lyhyt: 'Linkit', ikoni: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1', otsikko: 'Auktoriteetti ja linkit', kuvaus: 'Ulkoiset linkit ovat hakukoneoptimoinnin työläin ja hitain osa-alue, ja juuri siksi ne erottavat kilpaillut hakusanat helpoista. Teemme sen ansaitsemalla, emme ostamalla.', rivit: [['Linkkiprofiilin analyysi', 'Nykyiset linkit, niiden laatu ja mahdolliset haitalliset linkit'], ['Ansaitut maininnat', 'Toimialamediat, yhteistyökumppanit, hakemistot ja paikalliset lähteet'], ['Sisältö, joka kerää linkkejä', 'Oppaat ja vertailut, joihin muut viittaavat omasta aloitteestaan'], ['Ei ostettuja linkkejä', 'Epäilyttävistä lähteistä ostetut linkit voivat johtaa Googlen rangaistustoimiin']] },
  { lyhyt: 'Tekoäly', ikoni: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z', otsikko: 'Näkyvyys tekoälyhauissa', kuvaus: 'Yhä useampi haku päättyy valmiiseen vastaukseen listan sijaan. Sama tekninen ja sisällöllinen pohja ratkaisee sielläkin, mutta painotukset ovat hieman eri.', rivit: [['Selkeä, lainattava rakenne', 'Väliotsikko kysymyksenä ja vastaus heti sen alle, ei myyntipuhetta välissä'], ['Tarkistettavat faktat', 'Hinnat, aikataulut ja toimitusehdot sivulla, ei pelkästään puhelimessa'], ['Auktoriteetti ja maininnat', 'Mitä useammin sivustosi mainitaan luotettavissa lähteissä, sitä todennäköisemmin se päätyy vastaukseen'], ['Seuranta', 'Seuraamme, mainitaanko yrityksesi vastauksissa toimialasi tärkeimmillä kysymyksillä']] }
];
const tyoTyyli = (on: boolean) => ({ bg: on ? 'rgba(111,236,255,.14)' : 'rgba(255,255,255,.035)', fg: on ? '#eafcff' : '#9fb0bf', reuna: on ? 'inset 0 0 0 1.5px #6fecff' : 'inset 0 0 0 1px rgba(255,255,255,.08)' });
const TYO_TABIT = TYOT.map((t, i) => { const on = i === 0; return Object.assign({ lyhyt: t.lyhyt, ikoni: t.ikoni, maara: t.rivit.length, on }, tyoTyyli(on)); });
/* Kaikki nelja korttia HTML:aan, vain ensimmainen nakyvissa (Efektit vaihtaa). */
const TYO_AUKI = TYOT.map((ta, i) => Object.assign({ avain: i, v0: i === 0, v1: i === 1, v2: i === 2, v3: i === 3 }, ta, { rivit: ta.rivit.map((r) => ({ t: r[0], v: r[1] })) }));
const KOODIRIVIT = [['{', '', ''], ['  "@type": ', '"LocalBusiness"', ','], ['  "name": ', '"Yrityksesi Oy"', ','], ['  "areaServed": ', '"Espoo"', ','], ['  "priceRange": ', '"€€"', ','], ['  "aggregateRating": {', '', ''], ['    "ratingValue": ', '"4.9"', ''], ['  }', '', ''], ['}', '', '']];
const KOODI = KOODIRIVIT.map((k, i) => ({ n: String(i + 1).padStart(2, '0'), a: k[0], b: k[1], c: k[2], vari: '#c3e88d', d: (0.08 * i).toFixed(2) }));
const LINKIT = ([[74, 'rakennuslehti.example', 'Artikkeli'], [68, 'kauppakamari.example', 'Hakemisto'], [61, 'espoo.example', 'Listaus'], [57, 'toimialaliitto.example', 'Jäsensivu'], [44, 'paikallislehti.example', 'Haastattelu']] as [number, string, string][]).map((l, i) => ({ dr: l[0], u: l[1], t: l[2], w: l[0], d: (0.1 * i).toFixed(2) }));
const MAININNAT = [12, 20, 31, 46, 62, 88].map((v, i) => ({ h: v, k: (i + 1) + '. kk', d: (0.1 * i).toFixed(2) }));
// PAIKALLINEN
const KARTTA = [
  { n: 1, nimi: 'Yrityksesi Oy', tahdet: '4,9 ★★★★★', maara: '(127)', tieto: 'Avoinna · 1,2 km · Ilmalämpöpumput', oma: true, bg: '#e8f9fc', nroBg: '#0b8aa3' },
  { n: 2, nimi: 'Kilpailija Oy', tahdet: '4,5 ★★★★★', maara: '(58)', tieto: 'Avoinna · 2,8 km · LVI-palvelut', oma: false, bg: '#fff', nroBg: '#ea4335' },
  { n: 3, nimi: 'Toinen yritys', tahdet: '4,2 ★★★★★', maara: '(23)', tieto: 'Suljettu · 4,1 km · Asennuspalvelut', oma: false, bg: '#fff', nroBg: '#ea4335' }
];
const PAIKALLISET = [
  { t: 'Yritysprofiili', v: 'Kategoriat, palvelut, aukioloajat ja kuvat kuntoon', ikoni: 'M4 10l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM9 20v-6h6v6' },
  { t: 'Samat tiedot kaikkialla', v: 'Nimi, osoite ja puhelin täsmälleen samoina', ikoni: 'M4 7h16M4 12h16M4 17h10' },
  { t: 'Arvostelut', v: 'Tapa pyytää niitä tyytyväisiltä asiakkailta', ikoni: 'M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.3 7.2 18.9l.9-5.4-3.9-3.8 5.4-.8z' }
];
// HINNAT
const RIVIT = ['Seurattavat hakusanat', 'Tekninen ylläpito ja korjaukset', 'Sivujen optimointi kuukaudessa', 'Uutta sisältöä kuukaudessa', 'Google-yritysprofiili', 'Kaupunkisivut', 'Auktoriteetti ja linkit', 'Tekoälyhakunäkyvyys', 'Raportointi', 'Strategiapuhelu', 'Sitoutuminen'];
const TASOT: { nimi: string; hinta: number; suosittu?: boolean; kuvaus: string; arvot: string[] }[] = [
  { nimi: 'Perusta', hinta: 190, kuvaus: 'Sivuston kunnossapito ja perusnäkyvyys. Sama kokonaisuus kuin verkkosivujen ylläpitopaketissa.', arvot: ['10 hakusanaa', '✓', '1 sivu', '–', 'Käyttöönotto', '–', '–', '–', '3 kk välein', '–', 'Kuukausi kerrallaan'] },
  { nimi: 'Kasvu', hinta: 590, suosittu: true, kuvaus: 'Jatkuva sisältötyö ja paikallinen näkyvyys. Taso, jolla tulokset alkavat kertyä.', arvot: ['40 hakusanaa', '✓', '3 sivua', '2 artikkelia', 'Jatkuva optimointi', '5 paikkakuntaa', '–', 'Optimointi', 'Kuukausittain', 'Joka toinen kuukausi', 'Vähintään 6 kk'] },
  { nimi: 'Täysi', hinta: 1200, kuvaus: 'Kilpailluille toimialoille, joissa myös auktoriteetti pitää rakentaa.', arvot: ['100 hakusanaa', '✓', '6 sivua', '4 artikkelia', 'Optimointi ja arvosteluprosessi', 'Rajattomasti', '✓', 'Optimointi ja seuranta', 'Kuukausittain', 'Kuukausittain', 'Vähintään 6 kk'] }
];
const TASO_TABIT = TASOT.map((p, i) => { const on = i === 1; return { nimi: p.nimi, on, tabBg: on ? '#6fecff' : 'transparent', tabFg: on ? '#0b0f14' : '#c9d6e2' }; });
const fi = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
/* Kaikki kolme tasoa HTML:aan, Kasvu (suunnitelman alkutila) nakyvissa. */
const TASO_AUKI = TASOT.map((pa, i) => Object.assign({}, pa, { avain: i, suosittu: !!pa.suosittu, hintaN: fi(pa.hinta), bg: pa.suosittu ? 'linear-gradient(180deg, rgba(111,236,255,.1), rgba(255,255,255,.03))' : 'rgba(255,255,255,.04)', reuna: pa.suosittu ? 'inset 0 0 0 1px rgba(111,236,255,.4), 0 30px 60px -36px rgba(111,236,255,.35)' : 'inset 0 0 0 1px rgba(255,255,255,.1)', kickVari: pa.suosittu ? '#b4f5ff' : '#8fa3b5', rivit: RIVIT.map((l, k) => ({ l, v: pa.arvot[k], c: pa.arvot[k] === '–' ? '#4f5d6a' : (pa.arvot[k] === '✓' ? '#6fecff' : '#eef3f7') })) }));
// KENELLE
const OK = 'M5 12.5l4.2 4L19 7', EI = 'M7 7l10 10M17 7 7 17';
const SOP: { t: string; v?: string }[] = [{ t: 'Asiakkaasi etsivät palveluasi Googlesta, toimialallasi on hakuvolyymia' }, { t: 'Yhden asiakkaan arvo on satoja tai tuhansia euroja, ei muutamaa kymppiä' }, { t: 'Kestät kolmesta kuuteen kuukautta ilman näkyviä tuloksia' }, { t: 'Sivustosi on teknisesti kunnossa tai olet valmis laittamaan sen kuntoon' }, { t: 'Haluat kanavan, joka ei sammu kun mainosbudjetti loppuu' }];
const EIK: { t: string; v?: string }[] = [{ t: 'Tarvitset asiakkaita ensi viikolla', v: 'Silloin oikea kanava on maksettu mainonta.' }, { t: 'Toimialaasi ei haeta', v: 'Hakumäärät ovat lähellä nollaa alueellasi.' }, { t: 'Sivustolla on konversio-ongelma', v: 'Lisää liikennettä ei korjaa sitä.' }, { t: 'Liiketoimintamalli tai kohderyhmä on vielä auki' }, { t: 'Odotat takuuta ykkössijasta', v: 'Sellaista ei voi antaa kukaan.' }];
/* Molemmat listat HTML:aan, "Sopii, jos" nakyvissa. */
const KE_LISTA = [0, 1].map((k) => ({ avain: k, reuna: k === 0 ? 'rgba(111,236,255,.22)' : 'rgba(255,154,77,.28)', ikBg: k === 0 ? 'rgba(111,236,255,.16)' : 'rgba(255,154,77,.16)', ikVari: k === 0 ? '#6fecff' : '#ff9a4d', ikoni: k === 0 ? OK : EI, rivit: (k === 0 ? SOP : EIK).map((r, i) => ({ t: r.t, v: r.v || '', raja: i ? '1px solid rgba(255,255,255,.07)' : '0' })) }));
const UKK = [
  {"k": "Paljonko hakukoneoptimointi maksaa kuukaudessa?", "v": "Meillä jatkuva hakukoneoptimointi maksaa alkaen 190 euroa kuukaudessa + alv 25,5 %. Kasvu-taso alkaa 590 eurosta ja Täysi-taso 1 200 eurosta. Lopullinen hinta sovitaan kartoituksessa. Hintaan vaikuttavat eniten toimialan kilpailutilanne, sivuston lähtökunto ja tarvittavan uuden sisällön määrä."},
  {"k": "Miksi hakukoneoptimointi maksaa niin paljon?", "v": "Suurin osa hinnasta on ihmisen aikaa: avainsanatutkimusta, sisällön kirjoittamista, teknistä korjaamista ja seurantaa. Kuukausihinta vastaa käytännössä tiettyä tuntimäärää asiantuntijatyötä. Käyttämiemme työkalujen lisenssimaksut sisältyvät hintaan."},
  {"k": "Onko pakko sitoutua pitkäksi aikaa?", "v": "Perusta-taso jatkuu kuukausi kerrallaan yhden kuukauden irtisanomisajalla. Kasvu- ja Täysi-tasoilla vähimmäiskesto on kuusi kuukautta, koska lyhyemmässä ajassa työ ei ehdi tuottaa mitään mitattavaa. Kuuden kuukauden jälkeen yhteistyö jatkuu niin kauan kuin se tuottaa."},
  {"k": "Kannattaako valita halvin SEO-tarjous?", "v": "Halvin ja kannattavin ovat harvoin sama asia. Hyvin matalalla kuukausihinnalla ei ehdi tehdä juuri muuta kuin seurata sijoituksia ja lähettää raportti. Pahimmillaan edullinen työ tulee kalliiksi kahdesti: ensin maksat työstä joka ei tuota, sitten työstä jolla se korjataan."},
  {"k": "Mitä hakukoneoptimointi käytännössä sisältää?", "v": "Teknistä hakukoneoptimointia, sisältöä ja avainsanoja, auktoriteetin rakentamista sekä paikallista näkyvyyttä, ja nämä neljä tehdään rinnakkain eikä peräkkäin. Painotus riippuu siitä, missä kunnossa sivusto on lähtiessä: teknisesti rikkinäisellä sivustolla ensimmäiset kuukaudet ovat korjaamista, kunnossa olevalla päästään heti sisältöön."},
  {"k": "Mikä on avainsanatutkimus?", "v": "Selvitys siitä, mitä asiakkaasi oikeasti kirjoittavat hakukenttään, kuinka paljon niitä hakuja tehdään ja kuinka kilpailtuja ne ovat. Se on koko työn kivijalka: ilman sitä optimoidaan sanoja joita kukaan ei hae, tai sanoja joilla ei ole ostoaikomusta."},
  {"k": "Mikä on SEO-auditointi?", "v": "Sivuston nykytilan läpikäynti: indeksointi, sivurakenne, nopeus, metatiedot, sisäinen linkitys, sisältö ja linkkiprofiili. Auditoinnista syntyy priorisoitu korjauslista. Alustavan auditoinnin teemme maksutta ennen tarjousta."},
  {"k": "Pitääkö minun itse tehdä jotain?", "v": "Hyvin vähän. Tarvitsemme pääsyn sivustolle ja analytiikkaan sekä noin tunnin kuukaudessa aikaasi: sisältöjen hyväksynnän ja vastaukset toimialaa koskeviin kysymyksiin. Kirjoittaminen, tekniikka ja julkaisu hoituvat meiltä."},
  {"k": "Voinko tehdä hakukoneoptimoinnin itse?", "v": "Voit, ja pienellä sivustolla se on täysin realistista. Perusasiat, otsikot, metatiedot, sivurakenne ja Google-yritysprofiili, oppii viikossa. Ulkoistamisen etu ei ole salatieto vaan se, että työ jatkuu myös kiireisenä kuukautena, jolloin oma tekeminen tyypillisesti katkeaa."},
  {"k": "Teettekö myös verkkokaupan hakukoneoptimointia?", "v": "Teemme. Verkkokaupassa painottuvat tuote- ja kategoriasivujen rakenne, sisäinen linkitys, tuotetietojen strukturoitu data ja se, ettei sama sisältö toistu kymmenillä sivuilla. Työmäärä on tyypillisesti suurempi kuin palvelusivustolla, mikä näkyy hinnassa."},
  {"k": "Kuinka nopeasti hakukoneoptimointi tuo tuloksia?", "v": "Ensimmäiset merkit näkyvät tyypillisesti 3–6 kuukauden kuluttua ja selvä vaikutus liiketoiminnassa 6–12 kuukauden kohdalla. Nopeuteen vaikuttavat eniten toimialan kilpailutilanne ja sivuston lähtökunto."},
  {"k": "Voitteko luvata Googlen ykkössijan?", "v": "Emme. Kukaan vastuullisesti hakukoneoptimointia tekevä ei voi luvata tiettyä sijoitusta, koska tuloksiin vaikuttavat myös kilpailijoiden tekemiset ja algoritmipäivitykset. Sen sijaan sovimme etukäteen mittarit ja raportoimme ne rehellisesti myös silloin, kun kehitys on toivottua hitaampaa. Kannattaa olla varovainen toimijan kanssa, joka lupaa tietyn sijoituksen tai täyden tulostakuun."},
  {"k": "Miten hakukoneoptimointia mitataan ja raportoidaan?", "v": "Mittarit sovitaan ennen aloitusta ja raportti tulee sähköpostiin sovitussa syklissä. Saat myös pääsyn samoihin työkaluihin, Search Consoleen ja Analyticsiin, joista luvut tulevat, joten voit tarkistaa jokaisen luvun itse. Seurattavat hakusanat sovitaan yhdessä etukäteen, joten raportti mittaa niitä hakuja joilla yrityksesi haluaa näkyä."},
  {"k": "Mitä tekoälyhakunäkyvyys tarkoittaa käytännössä?", "v": "Tavoite on eri kuin hakutuloksissa: ei sijoitus vaan se, että sisältösi on riittävän täsmällistä ja tarkistettavaa lainattavaksi. Käytännössä se tarkoittaa hintojen, aikataulujen ja toimitusehtojen kirjoittamista sivulle eikä vain kertomista puhelimessa. Emme voi luvata mainintoja, mutta seuraamme niitä toimialasi tärkeimmillä kysymyksillä."},
  {"k": "Miten hakukoneoptimointi huomioidaan verkkosivu-uudistuksessa?", "v": "Uudistus on se hetki, jossa kertynyt näkyvyys joko säilyy tai katoaa. Vanhat osoitteet ohjataan uusiin, sivurakenne suunnitellaan hakusanojen pohjalta ja metatiedot siirretään hallitusti. Tämä tehdään ennen julkaisua eikä sen jälkeen, jälkikäteen korjaaminen maksaa moninkertaisesti. Lue lisää verkkosivujen toteutuksesta.", "linkki": {"teksti": "verkkosivujen toteutuksesta", "href": "/verkkosivut"}},
  {"k": "Teettekö myös verkkosivut ja lyhytvideot?", "v": "Kyllä. WS Media tekee hakukoneoptimoinnin lisäksi verkkosivut, lyhytvideot TikTokiin, Instagram Reelsiin ja YouTube Shortsiin sekä Meta-mainonnan. Kun sivusto, sisältö ja mainonta tulevat samalta tiimiltä, hakukoneoptimointi rakennetaan sisään jo sivuston rakenteeseen sen sijaan että se korjattaisiin jälkikäteen."}
];
/* Kaikki 16 HTML:aan (6 ensimmaista nakyvissa, ensimmainen auki).
   linkki = tekstilinkki vastauksen sisalla, kuten tyopoydan faq.tsx:ssa
   (SEO-tarkistus 2.4). FAQPage-merkinta tulee faq.tsx:sta eika muutu. */
const UKK_ = UKK.map((q, i) => { const auki = i === 0; return Object.assign({}, q, { auki, luokka: auki ? 'l-faq auki' : 'l-faq' }); });
const ALUEET = [
  { t: 'Espoo', v: 'Toimipisteemme on Espoossa, ja pääkaupunkiseudun yrityksiä tapaamme mielellämme paikan päällä.' },
  { t: 'Koko Suomi', v: 'Hakukoneoptimointi tehdään verkossa, joten sijainti ei vaikuta hintaan eikä aikatauluun.' },
  { t: 'Haussa', v: 'Sivut rakennetaan näkymään niillä paikkakunnilla, joilla yrityksesi oikeasti palvelee.' }
].map((a, i) => Object.assign({}, a, { raja: i ? '1px solid rgba(255,255,255,.07)' : '0' }));

export default function HakuMobiili() {
  return (
    <div className="mo-root mo-s-seo">
      {/* Heron taustakuva on LCP-elementti; CSS-taustana se loytyisi vasta
          tyylien jalkeen. Vain puhelimessa (media). */}
      <link rel="preload" as="image" href="/hakukoneoptimointi/korkeuskayrat.svg" media="(max-width: 767px)" fetchPriority="high" />
      {/* Sivuston latausruutu (sama kuin etusivun puhelinversiossa): nakyy
          vain hitaalla yhteydella. Ennen sisaltoa, jottei sisalto ehdi
          piirtya ennen ruutua. */}
      <Latausruutu />
      <div className="mo-e-root" style={{ position: "relative", background: "#0b0f14", color: "#f5f5f7" }}>
        {/* HERO: oma tulos nousee sijalta 5 ykköseksi */}
        {" "}
        <div data-seo="hero" style={{ height: "calc(340px + 200svh)", position: "relative" }}>
          {" "}
          <div data-teema="tumma" style={{ position: "sticky", top: "0", height: "100svh", overflow: "hidden", background: "radial-gradient(120% 55% at 50% 22%, #13305a 0%, #0c1a33 48%, #070e1d 100%)" }}>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", inset: "-40px", background: "url(/hakukoneoptimointi/korkeuskayrat.svg) center 20% / 1100px auto no-repeat", opacity: ".55", transform: "translateY(0px) scale(1)" }} data-seo="maasto" data-seo-wc=""></div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "70px", width: "420px", height: "300px", marginLeft: "-210px", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(111,236,255,0.26), rgba(111,236,255,0))", filter: "blur(10px)", opacity: "0.308", transform: "translateY(200px)" }} data-seo="hehku" data-seo-wc=""></div>
            {" "}
            <svg aria-hidden="true" viewBox="0 0 390 260" width="390" height="260" style={{ position: "absolute", left: "0", top: "120px", overflow: "visible" }}>
              {" "}
              <defs>
                <linearGradient id="m-s-kg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3ddc84" stopOpacity=".35"></stop>
                  <stop offset="1" stopColor="#3ddc84" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              {" "}
              <path d="M-10 230 C 60 228, 90 214, 130 200 S 200 150, 240 120 S 320 40, 400 20 L400 260 L-10 260 Z" fill="url(#m-s-kg)" opacity="0.250" data-seo="kayraala"></path>
              {" "}
              <path d="M-10 230 C 60 228, 90 214, 130 200 S 200 150, 240 120 S 320 40, 400 20" fill="none" stroke="#3ddc84" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="520" strokeDashoffset="520.0" opacity=".9" data-seo="kayra"></path>
              {" "}
            </svg>
            {" "}
            <div className="mo-s-tulo" style={{ position: "absolute", left: "16px", right: "16px", top: "72px", transform: "translateY(0px)", transformOrigin: "50% 0", perspective: "900px" }} data-seo="kortti">
              {" "}
              <div data-seo="stat" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", alignItems: "center", height: "54px", padding: "0 6px", borderRadius: "18px", background: "rgba(10,18,32,.92)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1)" }}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "8px" }}>
                  <b style={{ fontSize: "28px", lineHeight: "1", letterSpacing: "-.03em", fontWeight: "700", color: "#f5f5f7", transition: "color .3s" }} data-seo="sija">
                    {"#5"}
                  </b>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", height: "20px", padding: "0 7px", borderRadius: "999px", fontSize: "11px", fontWeight: "700", background: "rgba(61,220,132,.16)", color: "#7ff0b0", opacity: "0" }} data-seo="nousu">
                    {"↑ 0"}
                  </span>
                </div>
                {" "}
                <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,.08)" }}>
                  <span style={{ display: "block", fontSize: "9.5px", fontWeight: "650", letterSpacing: ".14em", color: "#8fa3b5" }}>
                    {"KLIKEISTÄ"}
                  </span>
                  <b style={{ display: "block", fontSize: "18px", lineHeight: "1.25", fontVariantNumeric: "tabular-nums" }} data-seo="klikit">
                    {"~6 %"}
                  </b>
                </div>
                {" "}
                <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,.08)" }}>
                  <span style={{ display: "block", fontSize: "9.5px", fontWeight: "650", letterSpacing: ".14em", color: "#8fa3b5" }}>
                    {"KUUKAUSI"}
                  </span>
                  <b style={{ display: "block", fontSize: "18px", lineHeight: "1.25", fontVariantNumeric: "tabular-nums" }}>
                    <span data-seo="kk">{"1"}</span>
                    <span style={{ fontSize: "11px", color: "#8fa3b5" }}>
                      {" / 12"}
                    </span>
                  </b>
                </div>
                {" "}
              </div>
              {" "}
              <div style={{ position: "relative", marginTop: "10px", transform: "rotateX(10.00deg)", transformOrigin: "50% 100%" }} data-seo="kallistus" data-seo-wc="">
              <span aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "20px", boxShadow: "0 0 60px -10px rgba(111,236,255,.45)", opacity: "0" }} data-seo="serphehku"></span>
              <div className="mo-s-serp" style={{ position: "relative", boxShadow: "0 40px 70px -30px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.12)" }}>
                {" "}
                <div data-seo="hakuala" style={{ padding: "8px 10px 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "30px", padding: "0 12px", borderRadius: "999px", boxShadow: "0 1px 6px rgba(32,33,36,.22)", fontSize: "12.5px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                      <path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20"></path>
                    </svg>
                    <span>
                      <span data-seo="haku"></span>
                      <i className="mo-s-kursori"></i>
                    </span>
                  </div>
                  {" "}
                  <div data-seo-valit="" style={{ display: "flex", gap: "14px", marginTop: "5px", padding: "0 6px", fontSize: "10.5px", color: "#5f6368" }}>
                    <span style={{ color: "#1a73e8", boxShadow: "inset 0 -2px 0 #1a73e8", paddingBottom: "3px" }}>
                      {"Kaikki"}
                    </span>
                    <span>
                      {"Kartat"}
                    </span>
                    <span>
                      {"Kuvat"}
                    </span>
                    <span>
                      {"Uutiset"}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      {"Noin 48 300 tulosta"}
                    </span>
                  </div>
                </div>
                {" "}
                <div data-seo="rivit" style={{ position: "relative", height: "192px", borderTop: "1px solid #ebebeb" }}>
                  {" "}
                  {(TULOKSET).map((t: any, tI: number) => (
                    <Fragment key={tI}>
                      {" "}
                      <div className={mo(t.luokka)} data-seo-rivi={tI} style={{ transform: `translateY(${t.y}px) scale(${t.sk})`, background: t.bg, boxShadow: t.reuna, zIndex: t.z, opacity: t.op, borderRadius: `${t.rad}px` }}>
                        {" "}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10.5px", color: "#202124" }}>
                          <span className="mo-s-ik" style={{ background: t.vari }}>
                            {t.ik}
                          </span>
                          <b style={{ fontWeight: "600" }}>
                            {t.nimi}
                          </b>
                          <span style={{ color: "#5f6368", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {t.polku}
                          </span>
                          {t.oma ? (
                            <>
                              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "3px", padding: "1px 7px", borderRadius: "999px", background: t.merkki, color: "#fff", fontSize: "9px", fontWeight: "700", letterSpacing: ".06em" }} data-seo="merkki">
                                {t.merkkiT}
                              </span>
                            </>
                          ) : null}
                        </div>
                        {" "}
                        <div style={{ marginTop: "1px", fontSize: "12.5px", color: "#1a0dab", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {t.otsikko}
                        </div>
                        {" "}
                      </div>
                      {" "}
                    </Fragment>
                  ))}
                  {" "}
                  {(KIPINAT).map((k: any, kI: number) => (
                    <Fragment key={kI}>
                      <i className={mo(k.luokka)} data-seo-kipina="" style={{ left: `${k.x}px`, top: "16px", "--dx": `${k.dx}px`, "--dy": `${k.dy}px`, background: k.c } as CSSProperties}></i>
                    </Fragment>
                  ))}
                  {" "}
                </div>
                {" "}
              </div>
              </div>
              {" "}
              <div data-seo="pillirivi" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "8px", marginTop: "10px" }}>
                {" "}
                <span aria-hidden="true" style={{ position: "absolute", left: "12%", right: "12%", top: "50%", height: "2px", marginTop: "-1px", background: "rgba(255,255,255,.08)" }}>
                  <i style={{ display: "block", height: "100%", width: "100%", background: "#3ddc84", transform: "scaleX(0)", transformOrigin: "0 50%", transition: "transform .3s" }} data-seo="tyop"></i>
                </span>
                {" "}
                {(TYOT_PILLIT).map((w: any, wI: number) => (
                  <Fragment key={wI}>
                    <span data-seo-pilli={wI} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", height: "28px", borderRadius: "999px", fontSize: "10.5px", fontWeight: "650", whiteSpace: "nowrap", background: w.bg, color: w.fg, boxShadow: w.reuna, transition: "background-color .3s, color .3s" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: w.op }} aria-hidden="true">
                        <path d="M5 12.5l4.2 4L19 7"></path>
                      </svg>
                      {w.t}
                    </span>
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "calc(100svh - 70px)", transform: "translateX(-50%) translateY(6.0px)", display: "flex", alignItems: "center", gap: "12px", height: "58px", padding: "0 8px 0 6px", borderRadius: "999px", background: "rgba(12,17,23,.92)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12), 0 10px 30px -12px rgba(0,0,0,.7)", opacity: "1", whiteSpace: "nowrap", pointerEvents: "none", zIndex: "6" }} data-seo="vihje">
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
                  {"ja nouse sijalta 5 ykköseksi"}
                </span>
              </span>
              {" "}
              <span style={{ position: "relative", width: "32px", height: "32px", marginLeft: "4px" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "block", transform: "rotate(-90deg)" }}>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2.5"></circle>
                  <circle cx="16" cy="16" r="13" fill="none" stroke="#6fecff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="81.7" strokeDashoffset="81.7" data-seo="rengas"></circle>
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
            <div aria-hidden="true" style={{ position: "absolute", left: "16px", right: "16px", top: "calc(100svh - 70px)", height: "58px", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px", borderRadius: "18px", background: "rgba(111,236,255,.1)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.35)", opacity: "0", transform: "translateY(8.0px)", zIndex: "6", pointerEvents: "none" }} data-seo="lopuksi">
              <span style={{ flex: "none", width: "26px", height: "26px", borderRadius: "50%", background: "#6fecff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0b0f14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.2 4L19 7"></path>
                </svg>
              </span>
              <span style={{ fontSize: "13.5px", lineHeight: "1.35", fontWeight: "600", color: "#eafcff" }}>
                {"Neljä työtä tehty. Esimerkki seurannasta, yritysten nimet keksittyjä."}
              </span>
            </div>
            {" "}
            <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "82px", transform: "translateY(0px)", zIndex: "6" }} data-seo="teksti">
              {" "}
              <h1 className="mo-s-tulo2" style={{ margin: "0", fontSize: "33px", lineHeight: "1.06", letterSpacing: "-.022em", fontWeight: "640", color: "#f5f5f7" }}>
                {"Löydy silloin, kun asiakas "}
                <span style={{ color: "#6fecff" }}>
                  {"etsii palvelua."}
                </span>
              </h1>
              {" "}
              <p className="mo-s-tulo3" style={{ margin: "12px 0 0", fontSize: "15.5px", lineHeight: "1.5", color: "#d6dce6" }}>
                {"Tekninen hakukoneoptimointi, sisältö ja paikallinen näkyvyys yhdeltä tiimiltä. Sama työ nostaa sinut myös tekoälyhakujen vastauksiin."}
              </p>
              {" "}
              <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                {" "}
                <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ flex: "1.25", padding: "0 12px", fontSize: "15px" }}>
                  {"Varaa kartoitus"}
                </a>
                {" "}
                <a data-ankkuri="hinnoittelu" role="link" tabIndex={0} className="mo-e-btn mo-e-o" style={{ flex: "1", padding: "0 12px", fontSize: "15px" }}>
                  {"Katso hinnat"}
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "#05080c", opacity: "0", pointerEvents: "none", zIndex: "7" }} data-seo="peitto"></div>
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
            <div style={{ position: "absolute", inset: "0", background: "#0c1830" }}></div>
            {" "}
            <canvas data-mo-verkko="" width="390" height="844" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100svh", display: "block" }}></canvas>
            {" "}
          </div>
          {" "}
          <section data-teema="tumma" data-verkko="alku" data-vari="#0c1830" style={{ position: "relative", zIndex: "1" }}>
            {" "}
            <div aria-label="Asiakkaitamme" className="mo-e-nauha-w mo-rv-n" style={{ position: "relative", height: "96px", overflow: "hidden", WebkitMask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", mask: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}>
              {" "}
              <div className="mo-e-nauha" style={{ position: "absolute", top: "32px", left: "0" }}>
                {" "}
                {(LOGOT).map((l: any, lI: number) => (
                  <Fragment key={lI}>
                    <img src={l.src} width={logoLeveys(l.src, l.h)} height={l.h} alt={l.alt} style={{ height: `${l.h}px`, width: "auto", display: "block", filter: l.f, opacity: ".78" }} decoding="async" />
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* NÄKYVYYS */}
          {" "}
          <section id="m-nakyvyys" data-teema="tumma" data-verkko="nakyvyys" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "22px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Asiakas ei enää kysy "}
                <span style={{ color: "#6fecff" }}>
                  {"pelkältä Googlelta."}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Osa hauista päättyy yhä hakutuloslistaan, osa tekoälyn koostamaan valmiiseen vastaukseen. Sama työ ratkaisee molemmissa, mutta vain jos sisältö on rakennettu niin, että kone löytää siitä vastauksen."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Hakutapa" style={{ marginTop: "20px" }}>
              {" "}
              <button type="button" role="tab" aria-selected={true} data-seo-nk="0" style={{ background: "#6fecff", color: "#0b0f14" }}>
                {"Hakutulokset"}
              </button>
              {" "}
              <button type="button" role="tab" aria-selected={false} data-seo-nk="1" style={{ background: "transparent", color: "#c9d6e2" }}>
                {"Tekoälyhaku"}
              </button>
              {" "}
            </div>
            {" "}
            <div className="mo-l-kortti-in" data-seo-nkp="0" style={{ marginTop: "12px" }}>
                  {" "}
                  <div className="mo-s-serp" style={{ padding: "12px" }}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "32px", padding: "0 12px", borderRadius: "999px", boxShadow: "0 1px 6px rgba(32,33,36,.22)", fontSize: "12.5px" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                        <path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20"></path>
                      </svg>
                      {"ilmalämpöpumppu asennus espoo"}
                    </div>
                    {" "}
                    <div className="mo-s-rv" style={{ marginTop: "10px", padding: "9px 10px", borderRadius: "12px", background: "#e8f9fc", boxShadow: "inset 0 0 0 1.5px #0b8aa3" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10.5px" }}>
                        <span className="mo-s-ik" style={{ background: "#0b8aa3" }}>
                          {"Y"}
                        </span>
                        <b style={{ fontWeight: "600" }}>
                          {"Yrityksesi Oy"}
                        </b>
                        <span style={{ marginLeft: "auto", padding: "1px 7px", borderRadius: "999px", background: "#0b8aa3", color: "#fff", fontSize: "9px", fontWeight: "700" }}>
                          {"SINÄ"}
                        </span>
                      </div>
                      <div style={{ marginTop: "3px", fontSize: "13.5px", color: "#1a0dab" }}>
                        {"Ilmalämpöpumpun asennus Espoossa | Yrityksesi Oy"}
                      </div>
                      <div style={{ marginTop: "2px", fontSize: "11px", color: "#e37400" }}>
                        {"4,9 ★★★★★ "}
                        <span style={{ color: "#70757a" }}>
                          {"(127)"}
                        </span>
                      </div>
                    </div>
                    {" "}
                    {(SERP_MUUT).map((r: any, rI: number) => (
                      <Fragment key={rI}>
                        <div className="mo-s-rv" style={{ padding: "9px 10px 0", animationDelay: `${r.d}s` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10.5px" }}>
                            <span className="mo-s-ik" style={{ background: r.vari }}>
                              {r.ik}
                            </span>
                            <b style={{ fontWeight: "600" }}>
                              {r.nimi}
                            </b>
                          </div>
                          <div style={{ marginTop: "3px", fontSize: "13px", color: "#1a0dab" }}>
                            {r.otsikko}
                          </div>
                        </div>
                      </Fragment>
                    ))}
                    {" "}
                  </div>
                  {" "}
                  <p style={{ margin: "12px 6px 0", fontSize: "14.5px", lineHeight: "1.5", color: "#c3d0dc" }}>
                    <b style={{ color: "#fff" }}>
                      {"Orgaaninen näkyvyys Googlessa."}
                    </b>
                    {" Sijoitus hakutuloksissa ratkaisee, kenen sivulle asiakas klikkaa."}
                  </p>
                  {" "}
                </div>
            {" "}
            <div className="mo-l-kortti-in" data-seo-nkp="1" hidden style={{ marginTop: "12px" }}>
                  {" "}
                  <div style={{ padding: "16px", borderRadius: "20px", background: "linear-gradient(160deg, #142640, #0e1824)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.25)" }}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "650", color: "#b4f5ff" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"></path>
                      </svg>
                      {"Tekoälyn yhteenveto"}
                    </div>
                    {" "}
                    <p className="mo-s-rv" style={{ margin: "10px 0 0", fontSize: "14px", lineHeight: "1.55", color: "#e6eef5" }}>
                      {"Espoossa ilmalämpöpumpun asennus maksaa tyypillisesti 1 200–2 400 € laitteineen. Asennus vie yleensä yhden työpäivän, ja moni paikallinen yritys antaa kiinteän hinnan."}
                    </p>
                    {" "}
                    <p style={{ margin: "14px 0 8px", fontSize: "10.5px", fontWeight: "650", letterSpacing: ".14em", color: "#8fa3b5" }}>
                      {"LÄHTEET"}
                    </p>
                    {" "}
                    <div className="mo-s-stag" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {" "}
                      {(LAHTEET).map((l: any, lI: number) => (
                        <Fragment key={lI}>
                          <div className="mo-s-rv" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "12px", background: l.bg, boxShadow: l.reuna, animationDelay: `${l.d}s` }}>
                            <span className="mo-s-ik" style={{ width: "22px", height: "22px", fontSize: "10px", background: l.vari }}>
                              {l.ik}
                            </span>
                            <span style={{ flex: "1", lineHeight: "1.25" }}>
                              <b style={{ display: "block", fontSize: "13px", fontWeight: "600" }}>
                                {l.t}
                              </b>
                              <span style={{ fontSize: "11.5px", color: "#8fa3b5" }}>
                                {l.u}
                              </span>
                            </span>
                            {l.oma ? (
                              <>
                                <span style={{ padding: "2px 8px", borderRadius: "999px", background: "#6fecff", color: "#0b0f14", fontSize: "9.5px", fontWeight: "700" }}>
                                  {"SINÄ"}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </Fragment>
                      ))}
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <p style={{ margin: "12px 6px 0", fontSize: "14.5px", lineHeight: "1.5", color: "#c3d0dc" }}>
                    <b style={{ color: "#fff" }}>
                      {"Näkyvyys vastauksissa, ei vain listassa."}
                    </b>
                    {" Tekoäly kokoaa vastauksen useasta lähteestä ja mainitsee ne. Kilpailu käydään siitä, kuka pääsee lähteeksi."}
                  </p>
                  {" "}
                </div>
            {" "}
            <p className="mo-rv" style={{ margin: "16px 6px 0", fontSize: "14px", lineHeight: "1.55", color: "#9fb0bf" }}>
              {"Käytännössä nämä eivät ole kaksi eri projektia. Selkeä sivurakenne, tekninen kunto, strukturoitu data ja sisältö, joka vastaa kysymykseen suoraan, parantavat molempia yhtä aikaa."}
            </p>
            {" "}
          </section>
          {" "}
          {/* VÄITE */}
          {" "}
          <section className="mo-l-vaite" data-teema="tumma" data-verkko="vaite1" data-vari="#0b131d" style={{ zIndex: "1", minHeight: "440px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 34px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z">
              <img data-px="1" src={TYHJA} data-mo-src="/hakukoneoptimointi/kuitu.webp" alt="Palvelinkaapin valokuitukaapelit" style={{ opacity: ".9", top: "10px", height: "320px", objectPosition: "30% 50%", WebkitMask: "linear-gradient(180deg, #000 70%, transparent 100%)", mask: "linear-gradient(180deg, #000 70%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <p className="mo-rv" style={{ position: "relative", margin: "0", fontSize: "33px", lineHeight: "1.06", letterSpacing: "-.026em", fontWeight: "680" }}>
              {"Hakukoneoptimointi ei ole temppu. "}
              <span style={{ color: "#6fecff" }}>
                {"Se on neljä työtä, joita tehdään yhtä aikaa."}
              </span>
            </p>
            {" "}
            <p className="mo-rv mo-d1" style={{ position: "relative", margin: "14px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#d6dee7" }}>
              {"Tekninen kunto, sisältö, auktoriteetti ja paikallinen näkyvyys. Yksikään niistä ei tuota tulosta yksin."}
            </p>
            {" "}
          </section>
          {" "}
          {/* SISÄLTÖ: neljä työtä välilehtinä */}
          {" "}
          <section id="m-sisalto" data-teema="tumma" data-verkko="sisalto" data-vari="#0d1824" style={{ position: "relative", zIndex: "1", padding: "30px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Mitä hakukoneoptimointi sisältää?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Hakukoneoptimointi yritykselle ei ole yksi toimenpide vaan neljä rinnakkaista työtä. Painotus vaihtelee sen mukaan, missä kunnossa sivusto on lähtiessä."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv-s" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "6px", marginTop: "20px" }}>
              {" "}
              {(TYO_TABIT).map((t: any, tI: number) => (
                <Fragment key={tI}>
                  <button type="button" className="mo-s-tab" role="tab" aria-selected={t.on} data-seo-tyo={tI} style={{ background: t.bg, color: t.fg, boxShadow: t.reuna }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={t.ikoni}></path>
                    </svg>
                    {t.lyhyt}
                    <span style={{ fontSize: "10px", fontWeight: "500", opacity: ".7" }}>
                      {t.maara}
                      {" tehtävää"}
                    </span>
                  </button>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            {(TYO_AUKI).map((t: any, tI: number) => (
              <Fragment key={tI}>
                {" "}
                <article className="mo-l-kortti-in" data-seo-tyop={tI} hidden={tI !== 0} style={{ marginTop: "12px", padding: "18px", borderRadius: "22px", background: "#0e161f", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.2)" }}>
                  {" "}
                  <h3 style={{ margin: "0", fontSize: "20px", lineHeight: "1.25", fontWeight: "640", letterSpacing: "-.012em" }}>
                    {t.otsikko}
                  </h3>
                  {" "}
                  <p style={{ margin: "8px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#b9c7d4" }}>
                    {t.kuvaus}
                  </p>
                  {" "}
                  <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "16px", background: "#070b10", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)", minHeight: "150px", boxSizing: "border-box" }}>
                    {" "}
                    {t.v0 ? (
                      <>
                        <div>
                          <span style={{ display: "block", marginBottom: "6px", fontSize: "10.5px", color: "#6f8191", fontFamily: "ui-monospace, Menlo, monospace" }}>
                            {"yrityksesi.fi/schema.jsonld"}
                          </span>
                          {(KOODI).map((k: any, kI: number) => (
                            <Fragment key={kI}>
                              <div className="mo-s-koodi mo-s-rv" style={{ animationDelay: `${k.d}s` }}>
                                <i style={{ color: "#3a4552" }}>
                                  {k.n}
                                  {" "}
                                </i>
                                {k.a}
                                <i style={{ color: k.vari }}>
                                  {k.b}
                                </i>
                                {k.c}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </>
                    ) : null}
                    {" "}
                    {t.v1 ? (
                      <>
                        <div style={{ padding: "4px 2px" }}>
                          <span style={{ fontSize: "11px", color: "#8fa3b5" }}>
                            {"yrityksesi.fi › palvelut › ilmalämpöpumput"}
                          </span>
                          <div className="mo-s-rv" style={{ marginTop: "3px", fontSize: "15px", color: "#8ab4f8" }}>
                            {"Ilmalämpöpumpun asennus Espoossa | Yrityksesi Oy"}
                          </div>
                          <div className="mo-s-rv" style={{ marginTop: "4px", fontSize: "12.5px", lineHeight: "1.45", color: "#bdc1c6", animationDelay: ".15s" }}>
                            {"Ilmalämpöpumpun asennus avaimet käteen Espoossa ja pääkaupunkiseudulla. Kiinteä hinta, asennus yhdessä päivässä, 5 vuoden takuu."}
                          </div>
                          {" "}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "#8fa3b5" }}>
                                <span>
                                  {"Title"}
                                </span>
                                <b style={{ color: "#3ddc84" }}>
                                  {"48 / 60"}
                                </b>
                              </div>
                              <i className="mo-s-palkki" style={{ display: "block", height: "4px", marginTop: "5px", borderRadius: "2px", background: "linear-gradient(90deg, #3ddc84 80%, rgba(255,255,255,.08) 80%)" }}></i>
                            </div>
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "#8fa3b5" }}>
                                <span>
                                  {"Kuvaus"}
                                </span>
                                <b style={{ color: "#3ddc84" }}>
                                  {"128 / 155"}
                                </b>
                              </div>
                              <i className="mo-s-palkki" style={{ display: "block", height: "4px", marginTop: "5px", borderRadius: "2px", background: "linear-gradient(90deg, #3ddc84 83%, rgba(255,255,255,.08) 83%)", animationDelay: ".2s" }}></i>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {" "}
                    {t.v2 ? (
                      <>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                            <span style={{ fontSize: "11px", color: "#8fa3b5" }}>
                              {"viittaavat verkkotunnukset"}
                            </span>
                            <b style={{ fontSize: "13px", color: "#3ddc84" }}>
                              {"+12 / 6 kk"}
                            </b>
                          </div>
                          {(LINKIT).map((l: any, lI: number) => (
                            <Fragment key={lI}>
                              <div style={{ display: "grid", gridTemplateColumns: "26px 1fr 64px", gap: "8px", alignItems: "center", padding: "4px 0", fontSize: "11.5px" }}>
                                <b style={{ color: "#6fecff", fontVariantNumeric: "tabular-nums" }}>
                                  {l.dr}
                                </b>
                                <span style={{ position: "relative", height: "18px", borderRadius: "5px", background: "rgba(255,255,255,.04)", overflow: "hidden" }}>
                                  <i className="mo-s-palkki" style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: `${l.w}%`, background: "rgba(111,236,255,.16)", animationDelay: `${l.d}s` }}></i>
                                  <span style={{ position: "relative", paddingLeft: "7px", lineHeight: "18px", color: "#dbe5ee" }}>
                                    {l.u}
                                  </span>
                                </span>
                                <span style={{ fontSize: "10.5px", color: "#8fa3b5", textAlign: "right" }}>
                                  {l.t}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </>
                    ) : null}
                    {" "}
                    {t.v3 ? (
                      <>
                        <div>
                          <span style={{ fontSize: "11px", color: "#8fa3b5" }}>
                            {"Maininnat tekoälyvastauksissa, kpl / kk"}
                          </span>
                          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "104px", marginTop: "10px" }}>
                            {(MAININNAT).map((m: any, mI: number) => (
                              <Fragment key={mI}>
                                <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%", justifyContent: "flex-end" }}>
                                  <i className="mo-s-pylv" style={{ display: "block", width: "100%", height: `${m.h}%`, borderRadius: "6px 6px 2px 2px", background: "linear-gradient(180deg, #6fecff, rgba(111,236,255,.2))", animationDelay: `${m.d}s` }}></i>
                                  <span style={{ fontSize: "9.5px", color: "#6f8191" }}>
                                    {m.k}
                                  </span>
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null}
                    {" "}
                  </div>
                  {" "}
                  <ul className="mo-s-stag" style={{ listStyle: "none", margin: "12px 0 0", padding: "0" }}>
                    {" "}
                    {(t.rivit).map((r: any, rI: number) => (
                      <Fragment key={rI}>
                        <li className="mo-l-li">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6fecff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12.5l4.2 4L19 7"></path>
                          </svg>
                          <span>
                            <b style={{ display: "block", fontSize: "14.5px", fontWeight: "620", color: "#eef3f7" }}>
                              {r.t}
                            </b>
                            <span style={{ fontSize: "13px", color: "#9fb0bf" }}>
                              {r.v}
                            </span>
                          </span>
                        </li>
                      </Fragment>
                    ))}
                    {" "}
                  </ul>
                  {" "}
                </article>
                {" "}
              </Fragment>
            ))}
            {" "}
            <div className="mo-rv" style={{ marginTop: "12px", padding: "16px 18px", borderRadius: "20px", background: "rgba(111,236,255,.06)", boxShadow: "inset 0 0 0 1px rgba(111,236,255,.18)" }}>
              {" "}
              <b style={{ fontSize: "15px", fontWeight: "630" }}>
                {"Neljä työtä, yksi tiimi"}
              </b>
              {" "}
              <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#c3d0dc" }}>
                {"Kartoituksessa käymme läpi, mikä näistä neljästä on sinun sivustollasi pahiten kesken ja mistä kannattaa aloittaa."}
              </p>
              {" "}
              <a href="/yhteystiedot" data-varaus="" className="mo-e-btn mo-e-p" style={{ width: "100%", height: "46px", marginTop: "12px" }}>
                {"Varaa maksuton kartoitus"}
              </a>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* PAIKALLINEN */}
          {" "}
          <section id="m-paikallinen" className="mo-l-vaite" data-teema="tumma" data-verkko="paikallinen" data-vari="#0b131d" style={{ zIndex: "1", padding: "150px 16px 40px" }}>
            {" "}
            <div className="mo-l-kuvaw mo-rv-z">
              <img data-px="1" src={TYHJA} data-mo-src="/mobiili/seo_kaupunki.webp" alt="Kaupungin katuverkko ilmasta yöllä" style={{ opacity: ".75", top: "0", height: "340px", objectPosition: "50% 50%", WebkitMask: "linear-gradient(180deg, #000 55%, transparent 100%)", mask: "linear-gradient(180deg, #000 55%, transparent 100%)" }} loading="lazy" decoding="async" />
              <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(5,9,14,.2) 0%, rgba(5,9,14,.25) 40%, rgba(5,9,14,.72) 78%, rgba(5,9,14,.9) 100%)" }}></span>
            </div>
            {" "}
            <div style={{ position: "relative", padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"”Palvelu + paikkakunta” on se haku, "}
                <span style={{ color: "#6fecff" }}>
                  {"jolla ostetaan."}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#d6dee7" }}>
                {"Kun asiakas kirjoittaa hakuun palvelun ja paikkakunnan, hän on jo päättänyt ostaa. Kolme ensimmäistä karttatulosta saa valtaosan klikkauksista."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-rv mo-rv-z" style={{ position: "relative", marginTop: "20px", borderRadius: "22px", overflow: "hidden", background: "#fff", color: "#202124", boxShadow: "0 30px 60px -30px rgba(0,0,0,.9)" }}>
              {" "}
              <div style={{ position: "relative", height: "120px", background: "#e8eef3", overflow: "hidden" }}>
                {" "}
                <svg viewBox="0 0 358 120" width="100%" height="120" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block" }}>
                  <path d="M0 70 C 80 60, 140 90, 220 70 S 330 40, 358 50" stroke="#fff" strokeWidth="9" fill="none"></path>
                  <path d="M120 0 L 150 120 M 260 0 L 230 120 M 0 30 L 358 20" stroke="#fff" strokeWidth="5" fill="none"></path>
                  <path d="M300 0 C 290 40, 320 80, 300 120" stroke="#aadaff" strokeWidth="12" fill="none"></path>
                </svg>
                {" "}
                <span style={{ position: "absolute", left: "140px", top: "44px", width: "18px", height: "18px", margin: "-9px", borderRadius: "50%", background: "rgba(11,138,163,.4)" }} className="mo-s-aalto"></span>
                {" "}
                <span className="mo-s-pin" style={{ position: "absolute", left: "131px", top: "22px", width: "18px", height: "24px" }}>
                  <svg viewBox="0 0 24 32" width="18" height="24" aria-hidden="true">
                    <path d="M12 31s10-11 10-19A10 10 0 0 0 2 12c0 8 10 19 10 19z" fill="#0b8aa3"></path>
                    <circle cx="12" cy="12" r="4" fill="#fff"></circle>
                  </svg>
                </span>
                {" "}
                <span style={{ position: "absolute", left: "238px", top: "66px" }}>
                  <svg viewBox="0 0 24 32" width="14" height="19" aria-hidden="true">
                    <path d="M12 31s10-11 10-19A10 10 0 0 0 2 12c0 8 10 19 10 19z" fill="#ea4335"></path>
                  </svg>
                </span>
                {" "}
                <span style={{ position: "absolute", left: "60px", top: "80px" }}>
                  <svg viewBox="0 0 24 32" width="14" height="19" aria-hidden="true">
                    <path d="M12 31s10-11 10-19A10 10 0 0 0 2 12c0 8 10 19 10 19z" fill="#ea4335"></path>
                  </svg>
                </span>
                {" "}
              </div>
              {" "}
              {(KARTTA).map((k: any, kI: number) => (
                <Fragment key={kI}>
                  <div className="mo-s-kartta-r" style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: "10px", padding: "10px 14px", borderTop: "1px solid #eee", background: k.bg }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: k.nroBg, color: "#fff", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {k.n}
                    </span>
                    <span style={{ lineHeight: "1.3" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <b style={{ fontSize: "13.5px", fontWeight: "600" }}>
                          {k.nimi}
                        </b>
                        {k.oma ? (
                          <>
                            <span style={{ padding: "1px 7px", borderRadius: "999px", background: "#0b8aa3", color: "#fff", fontSize: "9px", fontWeight: "700" }}>
                              {"SINÄ"}
                            </span>
                          </>
                        ) : null}
                      </span>
                      <span style={{ display: "block", fontSize: "11.5px", color: "#e37400" }}>
                        {k.tahdet}
                        {" "}
                        <span style={{ color: "#70757a" }}>
                          {k.maara}
                        </span>
                      </span>
                      <span style={{ display: "block", fontSize: "11.5px", color: "#70757a" }}>
                        {k.tieto}
                      </span>
                    </span>
                  </div>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div className="mo-rv-s" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px", marginTop: "12px" }}>
              {" "}
              {(PAIKALLISET).map((p: any, pI: number) => (
                <Fragment key={pI}>
                  <div className="mo-l-bento" style={{ padding: "12px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6fecff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={p.ikoni}></path>
                    </svg>
                    <b style={{ display: "block", marginTop: "8px", fontSize: "13px", lineHeight: "1.25", fontWeight: "620" }}>
                      {p.t}
                    </b>
                    <span style={{ display: "block", marginTop: "4px", fontSize: "11.5px", lineHeight: "1.4", color: "#9fb0bf" }}>
                      {p.v}
                    </span>
                  </div>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          {/* HINNOITTELU */}
          {" "}
          <section id="m-hinnoittelu" data-teema="tumma" data-verkko="hinnoittelu" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "30px 16px 36px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Paljonko hakukoneoptimointi maksaa?"}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Kolme tasoa ja maksuton kartoitus ennen aloitusta. Hinnat ovat alkaen-hintoja, ja lopullinen hinta sovitaan kartoituksessa ennen kuin mitään laskutetaan. Tasot eroavat siinä, kuinka paljon uutta sisältöä syntyy ja rakennetaanko myös auktoriteettia."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Tasot" style={{ marginTop: "20px" }}>
              {" "}
              {(TASO_TABIT).map((p: any, pI: number) => (
                <Fragment key={pI}>
                  <button type="button" role="tab" aria-selected={p.on} data-seo-taso={pI} style={{ background: p.tabBg, color: p.tabFg }}>
                    {p.nimi}
                  </button>
                </Fragment>
              ))}
              {" "}
            </div>
            {" "}
            {(TASO_AUKI).map((p: any, pI: number) => (
              <Fragment key={pI}>
                {" "}
                <article className="mo-l-kortti-in" data-seo-tasop={pI} hidden={pI !== 1} style={{ marginTop: "12px", padding: "20px 18px 18px", borderRadius: "24px", background: p.bg, boxShadow: p.reuna }}>
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
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "8px" }}>
                    <span style={{ fontSize: "14px", color: "#a9b8c6" }}>
                      {"alk."}
                    </span>
                    <b style={{ fontSize: "46px", lineHeight: "1", letterSpacing: "-.04em", fontWeight: "680", fontVariantNumeric: "tabular-nums" }} data-seo-hinta={p.hinta}>
                      {p.hintaN}
                    </b>
                    <span style={{ fontSize: "14px", color: "#a9b8c6" }}>
                      {"€/kk + alv"}
                    </span>
                  </div>
                  {" "}
                  <p style={{ margin: "8px 0 0", fontSize: "14.5px", lineHeight: "1.5", color: "#c3d0dc" }}>
                    {p.kuvaus}
                  </p>
                  {" "}
                  <div className="mo-s-stag" style={{ marginTop: "12px" }}>
                    {" "}
                    {(p.rivit).map((r: any, rI: number) => (
                      <Fragment key={rI}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,.07)", fontSize: "13.5px" }}>
                          <span style={{ color: "#a9b8c6" }}>
                            {r.l}
                          </span>
                          <b style={{ flex: "none", textAlign: "right", fontWeight: "600", color: r.c }}>
                            {r.v}
                          </b>
                        </div>
                      </Fragment>
                    ))}
                    {" "}
                  </div>
                  {" "}
                  <a data-ankkuri="tarjous" role="link" tabIndex={0} className="mo-e-btn mo-e-p" style={{ width: "100%", marginTop: "14px" }}>
                    {"Pyydä tarjous"}
                  </a>
                  {" "}
                </article>
                {" "}
              </Fragment>
            ))}
            {" "}
            <p className="mo-rv" style={{ margin: "14px 6px 0", fontSize: "13px", lineHeight: "1.55", color: "#8fa3b5" }}>
              {"Kaikki hinnat + alv 25,5 %. Ei aloitusmaksua eikä piilokuluja. Kuuden kuukauden vähimmäiskesto Kasvu- ja Täysi-tasoilla ei ole myyntikikka: hakukoneoptimointi ei ehdi tuottaa mitään lyhyemmässä ajassa."}
            </p>
            {" "}
          </section>
          {" "}
          {/* KENELLE */}
          {" "}
          <section id="m-kenelle" data-teema="tumma" data-verkko="kenelle" data-vari="#0c1520" style={{ position: "relative", zIndex: "1", padding: "20px 16px 40px" }}>
            {" "}
            <div style={{ padding: "0 6px" }}>
              {" "}
              <h2 className="mo-e-h2 mo-rv">
                {"Hakukoneoptimointi ei kannata kaikille."}
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d1" style={{ marginTop: "14px", fontSize: "16px", color: "#c3d0dc" }}>
                {"Jos tilanteesi kuuluu jälkimmäiseen ryhmään, sanomme sen suoraan jo kartoituksessa. Se säästää molempien aikaa ja rahaa."}
              </p>
              {" "}
            </div>
            {" "}
            <div className="mo-l-seg mo-rv" role="tablist" aria-label="Sopiiko" style={{ marginTop: "20px" }}>
              {" "}
              <button type="button" role="tab" aria-selected={true} data-seo-ke="0" style={{ background: "#6fecff", color: "#0b0f14" }}>
                {"Sopii, jos"}
              </button>
              {" "}
              <button type="button" role="tab" aria-selected={false} data-seo-ke="1" style={{ background: "transparent", color: "#c9d6e2" }}>
                {"Ei kannata, jos"}
              </button>
              {" "}
            </div>
            {" "}
            {(KE_LISTA).map((l: any, lI: number) => (
              <Fragment key={lI}>
                {" "}
                <ul className="mo-l-kortti-in mo-s-stag" data-seo-kep={lI} hidden={lI !== 0} style={{ listStyle: "none", margin: "12px 0 0", padding: "6px 18px", borderRadius: "22px", background: "rgba(255,255,255,.035)", boxShadow: `inset 0 0 0 1px ${l.reuna}` }}>
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
                {"Kysy meiltä. Vastaamme suoraan myös silloin, jos hakukoneoptimointi ei ole sinulle oikea ratkaisu."}
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
          <section id="m-ukk" data-teema="tumma" data-verkko="ukk" data-verkko-alfa="0.18" data-vari="#0b121a" style={{ position: "relative", zIndex: "1", padding: "24px 22px 40px" }}>
            {" "}
            <div className="mo-rv">
              {" "}
              <h2 className="mo-e-h2" style={{ fontSize: "30px" }}>
                {"Usein kysytyt kysymykset hakukoneoptimoinnista"}
              </h2>
              {" "}
              <p className="mo-e-lead" style={{ marginTop: "12px", fontSize: "16px", color: "#b9c7d4" }}>
                {"Hinta, aikataulu, takuut ja se mitä työhön oikeasti sisältyy."}
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
                          {q.linkki && q.v.includes(q.linkki.teksti) ? (
                            <>
                              {q.v.slice(0, q.v.indexOf(q.linkki.teksti))}
                              <a href={q.linkki.href}>{q.linkki.teksti}</a>
                              {q.v.slice(q.v.indexOf(q.linkki.teksti) + q.linkki.teksti.length)}
                            </>
                          ) : (
                            q.v
                          )}
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
                    {"Näytä kaikki 16 kysymystä"}
                  </button>
                </>
              ) : null}
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
          {/* ALUEET */}
          {" "}
          <section id="m-alueet" data-teema="tumma" data-verkko="alueet" data-vari="#0b131d" style={{ position: "relative", zIndex: "1", padding: "24px 16px 40px" }}>
            {" "}
            <h2 className="mo-e-h2 mo-rv" style={{ padding: "0 6px", fontSize: "28px" }}>
              {"Hakukoneoptimointi Espoosta koko Suomeen"}
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
                {"Valmis näkymään "}
                <span style={{ color: "#6fecff" }}>
                  {"Googlessa?"}
                </span>
              </h2>
              {" "}
              <p className="mo-e-lead mo-rv mo-d2" style={{ marginTop: "16px", color: "#c9d6e2" }}>
                {"Käymme läpi sivustosi nykytilan, toimialasi hakuvolyymit ja kilpailutilanteen. Saat suoran näkemyksen siitä, kannattaako hakukoneoptimointi juuri sinun tapauksessasi, myös silloin kun vastaus on ei. Voit myös soittaa numeroon "}
                <a href="tel:+358405648770">
                  {"040 564 8770"}
                </a>
                {", ja tekijät esittelemme "}
                <a href="/meista">
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
                      {"Kartoitus: nykytila, hakuvolyymit ja kilpailijoiden näkyvyys."}
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
              <form className="mo-rv mo-rv-s" data-seo="lomake" style={{ marginTop: "30px", padding: "22px 18px 20px", borderRadius: "24px", background: "linear-gradient(180deg, rgba(22,34,48,.88), rgba(12,19,28,.92))", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1), 0 40px 80px -40px rgba(0,0,0,.9)", display: "flex", flexDirection: "column", gap: "14px" }}>
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
                  {"Millä hauilla haluaisit näkyä? Kerro myös toimialasi."}
                  <textarea name="viesti" rows={4} style={{ height: "112px", paddingTop: "13px", resize: "none" }} />
                </label>
                {" "}
                <p className="mo-e-vast" data-seo="kiitos" role="status" hidden style={{ margin: "0", padding: "12px 14px", borderRadius: "12px", background: "rgba(111,236,255,.1)", color: "#b4f5ff", fontSize: "14.5px" }}>
                      {"Kiitos, tarjouspyyntö on perillä. Vastaamme arkisin 24 tunnin sisällä."}
                    </p>
                {" "}
                <Ansa />
                <button type="submit" className="mo-e-btn mo-e-p" style={{ width: "100%", height: "54px", marginTop: "4px", fontSize: "16.5px", fontWeight: "600" }}>
                  {"Lähetä tarjouspyyntö"}
                </button>
                <LomakeVirhe />
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
          {" "}
        </div>
      </div>
      <Kuori reitti="/hakukoneoptimointi" palvelu="Hakukoneoptimointi" />
      <Moottori otsake={{ tapa: "iso", ka: 340, piilo: 150, lasi: -30 }} verkko={{ siemen: 41, tila: "syaani", pohja: [12, 24, 48] }} />
      <Efektit />
    </div>
  );
}
