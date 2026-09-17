/* NELJA KAAVIOPANEELIA, SIIRRETTY OMAAN TIEDOSTOONSA.
   Nama ovat sivun parhaat artefaktit: jokainen nayttaa sen ilmion
   josta sen oma kortti puhuu. Ne siirtyvat uuteen ilmeeseen
   muuttumattomina, koska ilme vaihtuu eivatka todisteet.

   Poimittu koneellisesti vanhasta sections.tsx:sta merkki merkilta. */

import type { ReactNode } from "react";

export /**
 * Kavijatietonakyma ensimmaisessa kortissa.
 *
 * NAKYMA ON TAUSTA JA TEKSTI SEN PAALLA. Luettavuus tulee tekstin
 * omasta valkoisesta kehasta (globals.css: .whycard-art h3/p
 * text-shadow), ei nakyman vaimentamisesta. Aiemmat yritykset
 * kaatuivat siihen etta molempia yritettiin saataa yhdesta arvosta:
 * opacity joutui palvelemaan seka nakyvyytta etta luettavuutta, eika
 * voinut riittaa kumpaankaan. Nyt niilla on omat saatonsa, joten
 * nakyma saa olla vahva ja teksti silti terava.
 *
 * VAIN YKSI LUKU, JA SE ON PYORISTETTY. Mallikuvan 3 115 848 ja
 * 93,2 % ovat tuntemattoman tilin lukuja. Kayrä on muoto ilman
 * asteikkoa: se nayttaa nousun vaittamatta sen suuruutta.
 */
function ReachPanel() {
  return (
    <div className="whypanel" aria-hidden="true">
      {/* Luku ylanurkkaan ilman laatikkoa: kortti lyheni numeromerkkien
          poiston myota, ja umpinainen laatikko olisi leikannut otsikon
          poikki. Pelkkana tekstina se on osa taustaa. */}
      <div className="wp-tile">
        <span>Katselukerrat</span>
        <b>1&#160;000&#160;000+</b>
      </div>
      <div className="wp-strip">
        {/* preserveAspectRatio="none": kayrä on kuvitus jonka on
            venyttava kaistan mittoihin, ei kaavio jonka mittasuhteet
            tarkoittaisivat jotain. */}
        <svg className="wp-chart" viewBox="0 0 300 60" preserveAspectRatio="none" focusable="false">
          <path className="wp-grid" d="M0 57H300" />
          {/* Asteittain nouseva, ei yhta piikkia: pohjataso nousee
              56:sta 20:een ja huiput 50:sta 4:aan, eli seka huiput
              etta niiden valit kasvavat. Yksi piikki olisi kertonut
              onnenkantamoisesta. */}
          <path
            className="wp-line"
            d="M0 56 12 55 24 54 36 55 48 52 60 53 72 50 84 46 96 50 108 43 120 40 132 45 144 36 156 31 168 38 180 28 192 22 204 29 216 19 228 13 240 21 252 11 264 6 276 15 288 8 300 4"
          
            pathLength={1}
          />
        </svg>
        <span className="wp-from">16.6.</span>
        <span className="wp-to">14.8.</span>
      </div>
    </div>
  );
}

export /**
 * Pysyvyyskayrä toisen kortin taustana.
 *
 * Sama rakenne ja samat tyylit kuin muissa korteissa - luku
 * ylanurkassa, kuvio alakaistalla, teksti valkoisen kehan takana -
 * jotta kortit lukevat sarjana eivatka neljana eri ideana.
 *
 * Kayrä NAYTTAA PYSYVYYDEN, EI SEN MENETTAMISTA. Aiempi versio
 * romahti heti alussa, eli se kuvasi ongelmaa: katsojat lahtevat. Se
 * luki vaarana lupauksena myyntisivulla, jonka kortin nimi on
 * "Pysyvyys 0:30". Nyt kayrä lahtee 100 %:sta, ohittaa kolmen sekunnin
 * merkin ilman pudotusta ja laskee loivasti koko keston yli - eli
 * koukku piti ja katsojat jaivat.
 *
 * Kolmen sekunnin merkki jaa paikalleen ja saa uuden roolin: se ei ole
 * enaa kohta jossa kayrä romahtaa vaan kohta jonka kayrä selvittaa.
 * Juuri sita otsikko lupaa.
 *
 * 3 SEKUNNIN MERKKI ON LASKETTU. Aika-akseli on 0:00-0:30 ja viewBoxin
 * leveys 300, joten yksi sekunti on 10 yksikkoa ja kolmen sekunnin
 * kohta on x = 30. Merkki ei siis ole sijoitettu silmalla vaan se
 * osoittaa tasan siihen kohtaan josta otsikko puhuu.
 *
 * EI KEKSITTYJA LUKUJA. Akselilla on vain kellonaika, ja kayrän muoto
 * on yleisesti tunnettu ilmio eika WS Median mittaus.
 */
function HookPanel() {
  return (
    <div className="whypanel" aria-hidden="true">
      <div className="wp-tile">
        <span>Pysyvyys</span>
        <b>0:30</b>
      </div>
      <div className="wp-strip">
        <svg className="wp-chart" viewBox="0 0 300 60" preserveAspectRatio="none" focusable="false">
          <path className="wp-grid" d="M0 5H300M0 31H300M0 57H300" />
          {/* Katkoviiva kolmen sekunnin kohdalle: 3 s x 10 yksikkoa. */}
          <path className="wp-mark" d="M30 3V57" />
          {/* Loiva, tasainen lasku: 100 %:sta noin puoleen koko keston
              aikana, ilman romahdusta missaan kohtaa. Kuutiokayrät eika
              murtoviiva, koska pysyvyyskayrä on jatkuva eika
              mittauspisteita ole. */}
          <path
            className="wp-line"
            d="M0 5C20 5 40 7 60 9C110 14 160 19 210 23C245 26 275 28 300 30"
          
            pathLength={1}
          />
        </svg>
        <span className="wp-from">0:00</span>
        <span className="wp-mid">3 s</span>
        <span className="wp-to">0:30</span>
      </div>
    </div>
  );
}

export /**
 * Kanavapylvaat kolmannen kortin taustana.
 *
 * TOINEN VERSIO. Ensimmainen oli vaakapalkkeja ilman ruudukkoa ja
 * akselia, ja juuri se oli vika: kaksi ensimmaista korttia ovat
 * kaavioita kehyksineen, joten kehyksettomat palkit lukivat eri
 * kuvakielella samassa rivissa. Nyt muoto on pylvaskaavio - ruudukko,
 * pohjaviiva ja nimet akselilla - eli sama kehys kuin kayrillä, mutta
 * eri kaaviotyyppi.
 *
 * HTML EIKA SVG. Pylvaissa on pyoristetyt paat ja akselilla tekstia,
 * ja kaistan svg:t venytetaan preserveAspectRatio="none":lla, mika
 * olisi vaantanyt seka pyoristykset etta kirjaimet leveyssuunnassa.
 *
 * KORKEUDET EIVAT OLE MITTAUS. Ne on porrastettu vain jotta rivi ei
 * lue neljana identtisena pylvaana; siksi mukana ei ole
 * arvoasteikkoa, joka tekisi niista vaitteen.
 */
function ChannelPanel() {
  const BARS = [
    { n: "TikTok", h: 100 },
    { n: "Reels", h: 86 },
    { n: "Shorts", h: 72 },
    { n: "LinkedIn", h: 45 },
  ];
  return (
    <div className="whypanel" aria-hidden="true">
      <div className="wp-tile">
        <span>Kanavat</span>
        <b>4</b>
      </div>
      <div className="wp-strip wp-ruled">
        <div className="wp-cols">
          {BARS.map((b) => (
            <s key={b.n}>
              <u style={{ height: b.h + "%" }} />
            </s>
          ))}
        </div>
        <div className="wp-axis4">
          {BARS.map((b) => (
            <span key={b.n}>{b.n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export /**
 * Kaksi kayrää neljannen kortin taustana.
 *
 * TOINEN VERSIO. Ensimmainen oli suppilo, ja se oli seka
 * kehyksettoman etta liian lahella kolmannen kortin palkkeja - kaksi
 * vierekkaista korttia lukivat saman kuvan kahtena kappaleena.
 *
 * Nyt kortti sanoo asiansa kahdella kayrällä: harmaa on nayttokerrat
 * ja sininen se mita niista seuraa. Sininen kulkee harmaan alapuolella
 * ja nousee sen mukana, mika on tasan kortin vaite - nayttokerrat ovat
 * valitavoite ja mitattava asia on alempi kayrä.
 *
 * Ero ensimmaiseen korttiin on VARI JA PARI, ei muoto: siella yksi
 * magenta kayrä, taalla harmaa ja sininen pari. Kaksi samanlaista
 * yksittaista kayrää samassa ruudukossa olisi lukenut toistona.
 */
function FunnelPanel() {
  return (
    <div className="whypanel" aria-hidden="true">
      <div className="wp-tile">
        <span>Yhteydenotot</span>
        <b>Mitattu</b>
      </div>
      <div className="wp-strip">
        <svg className="wp-chart" viewBox="0 0 300 60" preserveAspectRatio="none" focusable="false">
          <path className="wp-grid" d="M0 5H300M0 31H300M0 57H300" />
          {/* Ylempi: nayttokerrat. */}
          <path
            className="wp-line2"
            d="M0 47 25 44 50 45 75 38 100 34 125 36 150 28 175 22 200 25 225 16 250 11 275 13 300 6"
          
            pathLength={1}
          />
          {/* Alempi: yhteydenotot. Seuraa samaa nousua mutta jaa
              alemmas - suhde on se mita kortti kuvaa, ei etaisyys. */}
          <path
            className="wp-line3"
            d="M0 55 25 54 50 54 75 51 100 50 125 51 150 47 175 44 200 45 225 40 250 37 275 38 300 33"
          
            pathLength={1}
          />
        </svg>
        <span className="wp-from">
          <i className="k2" />
          Näyttökerrat
        </span>
        <span className="wp-to">
          <i className="k3" />
          Yhteydenotot
        </span>
      </div>
    </div>
  );
}

export const PANEELIT: Record<string, ReactNode> = {
  hook: <HookPanel />,
  channels: <ChannelPanel />,
  funnel: <FunnelPanel />,
  reach: <ReachPanel />,
};
