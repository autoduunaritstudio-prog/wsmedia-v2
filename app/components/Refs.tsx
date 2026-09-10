"use client";

import type { ReactNode } from "react";

import GraphicsSurfaces from "./GraphicsSurfaces";
import SearchDemo from "./SearchDemo";
import MetalBackdrop from "./MetalBackdrop";
import SmartLink from "./SmartLink";
import StatBand, { type Stat } from "./StatBand";
import { CARDS, RefCard } from "./RefCards";

/**
 * REFERENSSIT: toinen sticky+cover-pari samalla sivulla.
 *
 * PINNATTAVANA ON YKSI PANEELI: Graafinen suunnittelu. Tapahtumat-paneeli
 * poistettiin kun tapahtumapalvelu jai pois tarjonnasta.
 * Molemmat on irrotettu Services.tsx:sta, jolloin #palvelut jaa kolmen
 * paneelin osioksi (Lyhytvideot, Verkkosivut, Graafinen -> ei, kolmas on
 * nyt taalla; #palvelutissa on Lyhytvideot ja Verkkosivut).
 *
 * MIKSI EI KOKO PALVELUT-RUUDUKKO:
 * hero+coverista opittu ehto on ettei cover saa olla pinnattavaa sisaltoa
 * matalampi - muuten pinnattu sisalto paljastuu coverin YLAPUOLELLE siina
 * hetkessa kun se irtoaa. Koko Palvelut-ruudukko on n. 3000px korkea,
 * joten Referenssit-osion olisi pitanyt olla yhta korkea. Yksittainen
 * paneeli on n. 500px, ja viiden 9:16-kortin ruudukko ylittaa sen
 * reilusti, joten ehto tayttyy luonnostaan.
 *
 * Paneeli on siksi irrotettu Services.tsx:sta omaksi lohkokseen: sticky-
 * elementti ja sen cover on oltava saman kaareen lapsia, jotta coverilla
 * on matkaa liukua pinnatun paalle. Palvelut-osion kolme muuta paneelia
 * vierivat normaalisti sen ylitse ennen kuin talle paastaan.
 *
 * PINOAMINEN: .refzone on position: relative ILMAN z-indexia, joten se ei
 * luo omaa pinoamiskontekstia ja lapset asettuvat .coverin kontekstiin:
 * .metalbd (0) < .refsticky (1) < .refs (2). Sama porrastus kuin
 * hero (1) / cover (2). Metallikuvion oma sticky-pane ei hairitse: sticky-
 * elementit ovat toisistaan riippumattomia ja kiinnittyvat kukin omaan
 * kaareensa. Yhtaan overflow-rajausta ei lisatty, koska se katkaisisi
 * metallikuvion paneen kiinnityksen.
 */

export default function Refs({ children, stats }: { children: ReactNode; stats?: Stat[] }) {
  return (
    <div className="refzone">
      {/* Pinnautuva osa. Scrim on paneelin sisalla ja sen paalla
          (z-index 5), kuten #hero-scrim heron sisalla. */}
      <section className="refsticky" aria-label="Graafinen suunnittelu ja hakukoneoptimointi">
        <div className="wrap">
            {/* 3. Hakukoneoptimointi. Visuaalina SEO-sivun oma hakunayttamo:
                sama tyo nakyy seka hakutuloslistassa etta tekoalyn
                vastauksessa, ja se on koko palvelun ydinviesti. */}
            <div className="svc rv">
              <div className="svc-visual" data-par="0.02">
                <div className="sdemo">
                  <SearchDemo variant="simple" />
                </div>
                <div className="float-tag ft-d">
                  <i />
                  Orgaaninen näkyvyys
                  <br />
                  ei lopu kun budjetti loppuu
                </div>
              </div>
              <div className="svc-txt" data-par="0.035">
                <span className="kick">Hakukoneoptimointi</span>
                <h3>Löydy silloin, kun asiakas etsii palvelua.</h3>
                <p>
                  Tekninen optimointi, sisältö ja paikallinen näkyvyys yhdeltä tiimiltä — ja sama
                  työ nostaa sinut myös tekoälyhakujen vastauksiin.
                </p>
                <ul>
                  <li>Näkyvyys Googlessa ja tekoälyhauissa samalla työllä</li>
                  <li>Sovitut mittarit ja raportointi, ei sijoituslupauksia</li>
                  <li>Kuukausipaketit alkaen 390 €/kk</li>
                </ul>
                <div className="svc-cta">
                  <a className="btn mag" href="#lomake">
                    Pyydä tarjous
                  </a>
                  <SmartLink className="btn alt" href="/hakukoneoptimointi">
                    Lue lisää hakukoneoptimoinnista
                  </SmartLink>
                </div>
              </div>
            </div>

            {/* 4. Graafinen suunnittelu */}
            <div className="svc rev rv svc-graafinen">
            <div className="svc-visual" data-par="0.02">
              <GraphicsSurfaces />
              <div className="float-tag ft-c">
                <i />
                Avaimet käteen
                <br />
                suunnittelu, materiaalit, asennus
              </div>
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
              <div className="svc-cta">
                <a className="btn mag" href="#lomake">
                  Pyydä tarjous
                </a>
                <SmartLink className="btn alt" href="/graafinen-suunnittelu">
                  Lue lisää graafisesta suunnittelusta
                </SmartLink>
              </div>
            </div>
          </div>

        </div>
        <div className="refscrim" aria-hidden="true" />
      </section>

      {/* Lukuaika: tyhjaa scrollimatkaa ennen kuin Referenssit alkaa
          nousta paneelin paalle. Ilman tata cover lahtee nousemaan tasan
          samalla hetkella kun paneeli pinnautuu. Kaava ja mitatut luvut
          globals.cssn .refhold-saannossa. */}
      <div className="refhold" aria-hidden="true" />

      {/* Cover: nousee normaalissa dokumenttivirtauksessa pinnatun paneelin
          paalle. Tausta on lapinakymaton (--dark) kolmesta syysta: cover-
          mekanismi VAATII peittavan taustan, 9:16-videokortit lukeutuvat
          parhaiten tummalla, ja sivustolla on jo sama tumma kaista-idiomi
          (/lyhytvideot .work). */}
      <section className="refs" id="referenssit">
        {/* Kiintea tumma kuviokerros osion taustaksi. Sama circle-geometria
            (mbc-1..5) kuin vaaleassa versiossa ja sama SiteEffectsin ajama
            liike, vain varit kaannettyina. Ylareunassa kevyt maskihaivytys,
            ks. .metalbd-dark globals.css:ssa. */}
        <MetalBackdrop tone="dark" inSection />
        <div className="refsscrim" aria-hidden="true" />
        <div className="wrap">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Referenssit</span>
            <h2>Katso miltä työmme näyttää.</h2>
          </div>
          <div className="refgrid stagger">
            {CARDS.map((c, i) => (
              <RefCard c={c} i={i} key={c.title} />
            ))}
          </div>
          {/* Luvut kuuluvat todisteiden viereen, ei erilliseen lohkoon
              coverin alle: sama osio kertoo mita on tehty ja kuinka
              paljon. */}
          {stats && <StatBand stats={stats} />}
        </div>
      </section>

      {/* Kolmas pari: Referenssit on itse pinnattava ja tama on sen cover.
          Tausta on lapinakymaton (--bg), koska cover-mekanismi vaatii sen -
          metallikuvio jaa siis piiloon taman lohkon kohdalla ja palaa
          nakyviin heti sen jalkeen, kun sisalto muuttuu taas
          lapinakyvaksi. Korkeus pakotetaan JS:sta vahintaan Referenssit-
          osion korkuiseksi, jolloin ehto C >= H on rakenteellisesti
          taattu eika riipu sisallon maarasta tai ikkunan korkeudesta. */}
      {/* Tyhjaa scrollimatkaa ennen kuin .aftercover alkaa peittaa
          Referenssit. Pelkkaa dokumenttikorkeutta: .refs on pinnattuna
          nakyman korkuinen, joten vali jaa kokonaan sen taakse. */}
      <div className="refgap" aria-hidden="true" />
      {/* VAALEA KUVIOKERROS .aftercoverin SISAAN. Osion oma valkoinen
          tausta jaa koskemattomana sen ALLE, joten videoseinan peitto ei
          muutu lainkaan - kuvio vain maalataan peittavan pinnan paalle.

          Kerroksen korkeus on --metalbd-tail (tasta footeriin) eika osion
          korkeus: sticky-panen liikevaran on jatkuttava sauman yli, muuten
          pane pinnautuisi osion alareunaan ja kuvio irtoaisi nakymasta
          juuri siina kohdassa jonka pitaa olla saumaton. Maalaus rajataan
          takaisin osion mittaan mask-imagella, ks. globals.css. */}
      <div className="aftercover">
        <MetalBackdrop inSection />
        {children}
      </div>
    </div>
  );
}
