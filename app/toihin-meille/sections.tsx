import type { CSSProperties } from "react";

export function Miksi() {
  return (
      <section id="miksi" style={{ paddingTop: 96 }}>
        <div className="wrap">
          <div className="hsplit rv">
            <div>
              <span className="kick">Miksi meille</span>
              <h2>Neljä syytä, miksi tekijät jäävät meille pidemmäksi aikaa</h2>
            </div>
            <p className="sub">Emme ole suurin emmekä tunnetuin. Nämä neljä asiaa saamme kuitenkin kuntoon, ja ne ovat käytännössä ne, joita freelancerit alalta kaipaavat.</p>
          </div>

          <div className="why rv">
            <div>
              <span className="n">01</span>
              <div>
                <h3>Työ ei lopu yhteen kanavaan</h3>
                <p>Sama asiakas tarvitsee usein videot, verkkosivuston, hakukoneoptimoinnin ja teippaukset. Kun yksi projekti päättyy, seuraava alkaa yleensä samasta talosta — sinun ei tarvitse etsiä uutta toimeksiantoa joka kuukausi.</p>
              </div>
            </div>
            <div>
              <span className="n">02</span>
              <div>
                <h3>Teet sitä mitä osaat parhaiten</h3>
                <p>Emme odota, että sama ihminen kuvaa, koodaa ja piirtää. Etsimme kapean alan osaajia ja kokoamme tiimin projektin mukaan. Jos olet erinomainen editoija, sinun ei tarvitse opetella hakukoneoptimointia.</p>
              </div>
            </div>
            <div>
              <span className="n">03</span>
              <div>
                <h3>Briefit ovat valmiiksi mietittyjä</h3>
                <p>Saat käyttöösi tavoitteen, aikataulun, tekniset vaatimukset ja tarvittavan aineiston. Emme lähetä toimeksiantoa, jonka sisältö selviää vasta kolmannessa puhelussa.</p>
              </div>
            </div>
            <div>
              <span className="n">04</span>
              <div>
                <h3>Maksamme ajallaan</h3>
                <p>Laskun maksuaika on 14 päivää eikä sitä venytetä. Sovittu hinta on se hinta, joka maksetaan — myös silloin kun projekti venyy asiakkaan takia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export function Roolit() {
  return (
      <section id="roolit" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="shead rv" data-par="0.03">
            <span className="kick">Keitä etsimme</span>
            <h2>Neljä osaamisaluetta</h2>
            <p className="sub">Haemme näihin jatkuvasti. Jos oma osaamisesi osuu johonkin näistä edes osittain, kannattaa jättää hakemus.</p>
          </div>

          <div className="roles stagger">
            <div className="role rv" style={{ "--i": 0 } as CSSProperties}>
              <p className="rk">Video</p>
              <h3>Kuvaajat, editoijat ja motion designerit</h3>
              <p>Lyhytvideotuotanto on suurin yksittäinen palvelumme. Kuvaamme asiakkaiden tiloissa ja tuotamme jatkuvia videosarjoja kuukaudesta toiseen.</p>
              <ul>
                <li>Lyhytvideoiden kuvaus asiakkaan tiloissa</li>
                <li>Editointi, tekstitys ja alustakohtaiset versiot</li>
                <li>Motion graphics ja animoidut grafiikat</li>
                <li>Tapahtuma- ja yritysvideokuvaus</li>
              </ul>
              <div className="tags">
                <span>Premiere Pro</span><span>After Effects</span><span>DaVinci Resolve</span>
                <span>9:16</span><span>Tekstitys</span><span>Värimäärittely</span>
              </div>
            </div>

            <div className="role rv" style={{ "--i": 1 } as CSSProperties}>
              <p className="rk">Verkko ja näkyvyys</p>
              <h3>Kehittäjät, hakukoneoptimoijat ja sisällöntuottajat</h3>
              <p>Rakennamme verkkosivustoja käsin koodattuna ja WordPressillä, ja teemme niille jatkuvaa hakukoneoptimointia ja sisältöä.</p>
              <ul>
                <li>Next.js- ja React-toteutukset</li>
                <li>WordPress-teemat, lisäosat ja ylläpito</li>
                <li>Tekninen hakukoneoptimointi ja auditoinnit</li>
                <li>Hakukoneoptimoitu sisällöntuotanto suomeksi</li>
              </ul>
              <div className="tags">
                <span>Next.js</span><span>React</span><span>WordPress</span>
                <span>Search Console</span><span>Core Web Vitals</span><span>Schema.org</span>
              </div>
            </div>

            <div className="role rv" style={{ "--i": 2 } as CSSProperties}>
              <p className="rk">Graafinen suunnittelu</p>
              <h3>Graafiset suunnittelijat</h3>
              <p>Suunnittelemme yritysilmeitä ja viemme ne kaikille pinnoille: painotuotteisiin, ajoneuvoteippauksiin ja julkisivuihin.</p>
              <ul>
                <li>Logot, yritysilmeet ja graafiset ohjeistot</li>
                <li>Painovalmiit aineistot ja taitto</li>
                <li>Ajoneuvo- ja julkisivuteippausten suunnittelu</li>
                <li>Some- ja mainosmateriaalien pohjat</li>
              </ul>
              <div className="tags">
                <span>Illustrator</span><span>InDesign</span><span>Figma</span>
                <span>CMYK</span><span>Vektorointi</span><span>Painoaineistot</span>
              </div>
            </div>

            <div className="role rv" style={{ "--i": 3 } as CSSProperties}>
              <p className="rk">Tuotanto ja kumppanit</p>
              <h3>Asentajat, painotalot ja materiaalitoimittajat</h3>
              <p>Emme teippaa emmekä paina itse, vaan käytämme alihankintaverkostoa. Etsimme luotettavia kumppaneita eri paikkakunnilta.</p>
              <ul>
                <li>Ajoneuvo- ja julkisivuteippausten asennus</li>
                <li>Digipainot ja suurkuvatulostus</li>
                <li>Valomainosten valmistus ja asennus</li>
                <li>Tapahtumatekniikka ja rakenteet</li>
              </ul>
              <div className="tags">
                <span>Koko Suomi</span><span>Tarrakalvot</span><span>Suurkuva</span>
                <span>Valomainokset</span><span>Asennus</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export function ValiCta() {
  return (
      <section style={{ paddingTop: 20 }}>
        <div className="closer rv">
          <div>
            <h2>Näytä mitä olet <span style={{ color: "#6fb1ff" }}>tehnyt.</span></h2>
            <p>Yksi linkki työnäytteisiin riittää. Luemme jokaisen hakemuksen ja vastaamme viikon sisällä.</p>
          </div>
          <div>
            <a className="btn mag" href="#hakemus">Jätä avoin hakemus</a>
            <p className="cnote">Vastaus viikon sisällä</p>
          </div>
        </div>
      </section>
  );
}

export function Tyomalli() {
  return (
      <section id="tyomalli" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="shead rv" data-par="0.03">
            <span className="kick">Työmalli</span>
            <h2>Freelancerina vai työsuhteessa?</h2>
            <p className="sub">Molemmat käyvät. Suurin osa tekijöistämme laskuttaa toimeksiannoista, mutta hyvälle tekijälle voi järjestyä myös vakituinen paikka.</p>
          </div>

          <div className="rv">
            <div className="switch" role="tablist" aria-label="Työmallin valinta">
              <button role="tab" id="sw1" aria-controls="pa1" aria-selected="true">Freelancerina</button>
              <button role="tab" id="sw2" aria-controls="pa2" aria-selected="false">Työsuhteessa</button>
            </div>

            <div className="path on" id="pa1" role="tabpanel" aria-labelledby="sw1">
              <div className="pbox hl">
                <h3>Sinä</h3>
                <ul>
                  <li>Laskutat tehdystä työstä — <strong>kevytyrittäjyys käy</strong>, y-tunnusta ei tarvita</li>
                  <li>Sovimme hinnan aina ennen toimeksiannon aloittamista</li>
                  <li>Valitset itse mitkä keikat otat vastaan</li>
                  <li>Työskentelet omilla välineilläsi ja omassa aikataulussasi</li>
                  <li>Maksuaika laskulle on 14 päivää</li>
                </ul>
              </div>
              <div className="pbox">
                <h3>Me</h3>
                <ul>
                  <li>Toimitamme valmiiksi mietityn briefin ja tarvittavan aineiston</li>
                  <li>Annamme suoran yhteyshenkilön, ei ketjutettua viestintää</li>
                  <li>Tarjoamme jatkuvia toimeksiantoja, emme yksittäisiä keikkoja</li>
                  <li>Kerromme palautteen siitä, miten työ meni asiakkaalla</li>
                  <li>Emme kilpailuta samaa työtä viidellä tekijällä</li>
                </ul>
              </div>
            </div>

            <div className="path" id="pa2" role="tabpanel" aria-labelledby="sw2">
              <div className="pbox hl">
                <h3>Sinä</h3>
                <ul>
                  <li>Kuukausipalkka ja työterveyshuolto</li>
                  <li>Työvälineet ja ohjelmistolisenssit talon puolesta</li>
                  <li>Etätyö tai toimisto Espoossa — sinä valitset</li>
                  <li>Selkeä rooli, ei kaikkea kaikille</li>
                </ul>
              </div>
              <div className="pbox">
                <h3>Me</h3>
                <ul>
                  <li>Vakituinen paikka kasvavassa yrityksessä</li>
                  <li>Mahdollisuus vaikuttaa siihen, mitä ja miten tehdään</li>
                  <li>Koulutus ja aika oman osaamisen kehittämiseen</li>
                  <li>Ei mikromanagerointia — vastaat omasta työstäsi</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="pricenote rv" style={{ textAlign: "left", marginLeft: 0 }}>Aloitamme lähes aina toimeksiannoilla, koska se on molemmille pienin riski. Työsuhteesta keskustellaan siinä vaiheessa, kun yhteistyötä on takana muutama projekti.</p>
        </div>
      </section>
  );
}

export function Prosessi() {
  return (
      <section id="prosessi" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Näin haku etenee</span>
            <h2>Kolme vaihetta, ei kahdeksan</h2>
            <p className="sub">Emme järjestä persoonallisuustestejä emmekä neljää haastattelukierrosta. Työnäyte kertoo enemmän.</p>
          </div>

          <div className="steps3 stagger rv">
            <div className="s3" style={{ "--i": 0 } as CSSProperties}>
              <h3>Lähetä hakemus</h3>
              <p>Täytä lomake ja liitä linkki työnäytteisiin. Ansioluetteloa ei tarvita — portfolio, showreel tai GitHub riittää.</p>
              <span className="t">5 minuuttia</span>
            </div>
            <div className="s3" style={{ "--i": 1 } as CSSProperties}>
              <h3>Lyhyt puhelu</h3>
              <p>Käymme läpi mitä osaat, mitä haluat tehdä ja millä hinnalla. Kerromme rehellisesti, onko meillä sinulle töitä juuri nyt.</p>
              <span className="t">Noin 30 minuuttia</span>
            </div>
            <div className="s3" style={{ "--i": 2 } as CSSProperties}>
              <h3>Ensimmäinen toimeksianto</h3>
              <p>Aloitamme pienellä ja selkeärajaisella työllä. Jos se sujuu molemmin puolin, jatkoa tulee ilman erillistä hakuprosessia.</p>
              <span className="t">Sovitusti</span>
            </div>
          </div>
        </div>
      </section>
  );
}

export function Odotukset() {
  return (
      <section id="odotukset" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="hsplit rv">
            <div>
              <span className="kick">Rehellisesti</span>
              <h2>Mitä odotamme — ja mitä emme vaadi</h2>
            </div>
            <p className="sub">Nämä kannattaa lukea ennen hakemista. Ne säästävät molempien aikaa.</p>
          </div>
          <div className="twopanel stagger">
            <div className="pan yes rv" style={{ "--i": 0 } as CSSProperties}>
              <h3>Odotamme</h3>
              <ul>
                <li>Että osaat oman alasi hyvin — yksi asia erittäin hyvin on parempi kuin viisi keskinkertaisesti</li>
                <li>Että vastaat viesteihin arkipäivän sisällä</li>
                <li>Että kerrot ajoissa, jos aikataulu ei pidä</li>
                <li>Että työnäytteet ovat sinun omaa työtäsi</li>
                <li>Suomen kielen taitoa, koska asiakastyö tehdään suomeksi</li>
              </ul>
            </div>
            <div className="pan dark rv" style={{ "--i": 1 } as CSSProperties}>
              <h3>Emme vaadi</h3>
              <ul>
                <li>Tutkintoa. Portfolio ratkaisee, ei paperi.</li>
                <li>Kokopäiväistä sitoutumista — yksikin keikka kuukaudessa käy</li>
                <li>Että asut pääkaupunkiseudulla. Työ tehdään etänä, kuvaukset ja asennukset paikan päällä.</li>
                <li>Että osaat kaikkea. Emme etsi yleismiehiä.</li>
                <li>Valmista y-tunnusta — kevytyrittäjyys riittää</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
  );
}

export function Tyonkuva() {
  return (
      <section id="tyonkuva" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Mitä työ käytännössä on</span>
            <h2>Freelancerina mainosalan toimeksiannoissa</h2>
          </div>
          <div className="prose rv">
            <p>WS Media on espoolainen mainostoimisto, jonka asiakkaat ovat pääosin pieniä ja keskisuuria yrityksiä: rakennus- ja LVI-alan yrityksiä, terveys- ja hyvinvointipalveluita, erikoisliikkeitä ja ammattipalveluita. Suurin osa asiakkuuksista on jatkuvia kuukausisopimuksia, ei kertaluonteisia kampanjoita. Käytännössä se tarkoittaa, että toimeksiantoja tulee samalta asiakkaalta uudelleen kuukaudesta toiseen.</p>

            <h3>Videotuotanto</h3>
            <p>Suurin osa toimeksiannoista liittyy <a href="/lyhytvideot">lyhytvideoihin</a>: kuvauspäivä asiakkaan tiloissa, ja siitä editoidaan useita videoita eri kanaviin pystymuodossa. Haemme sekä kuvaajia että editoijia — samaa ihmistä ei tarvita molempiin. Motion designerille on työtä animoiduissa grafiikoissa ja tekstityksissä.</p>

            <h3>Verkkosivut ja hakukoneoptimointi</h3>
            <p>Rakennamme <a href="/verkkosivut">verkkosivuja yrityksille</a> sekä käsin koodattuna että WordPressillä, ja teemme niille jatkuvaa <a href="/hakukoneoptimointi">hakukoneoptimointia</a>. Kehittäjälle työ on selkeärajaista: valmis suunnitelma, tekninen määrittely ja tavoitteet sivun latausnopeudelle. Hakukoneoptimoijalle työ on avainsanatutkimusta, teknisiä auditointeja ja sisällön suunnittelua suomenkielisille hakusanoille.</p>

            <h3>Graafinen suunnittelu ja tuotanto</h3>
            <p>Suunnittelemme asiakkaille koko <a href="/graafinen-suunnittelu">yritysilmeen</a> ja viemme sen kaikille pinnoille — käyntikorteista ja flyereista ajoneuvoteippauksiin ja julkisivuihin. Emme teippaa emmekä paina itse, joten tarvitsemme rinnallemme asentajia, digipainoja ja materiaalitoimittajia eri paikkakunnilta. Jos yrityksesi tekee suurkuvatulostusta, tarrakalvoasennuksia tai valomainoksia, kannattaa ottaa yhteyttä myös kumppanina.</p>

            <h3>Mistä päin Suomea</h3>
            <p>Suunnittelu, editointi, koodaus ja sisällöntuotanto tehdään etänä, joten asuinpaikkakunta ei ratkaise. Kuvaukset painottuvat pääkaupunkiseudulle — Espooseen, Helsinkiin ja Vantaalle — mutta teemme työtä koko Suomessa, ja asennuskumppaneita etsimme jokaiselta paikkakunnalta, jossa asiakkaitamme on.</p>
          </div>
        </div>
      </section>
  );
}
