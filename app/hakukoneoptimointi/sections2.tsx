import type { CSSProperties, ReactNode } from "react";

import BudgetForm from "../components/BudgetForm";
import { FAQ_GROUPS } from "./faq";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ---------- Hinnoittelu ----------
   Kolme tasoa vertailutaulukkona. Yksikaan rivi ei lupaa tulosta: taulukko
   kertoo mita tehdaan ja kuinka usein raportoidaan, ei mita saavutetaan. */

const TIERS = [
  { name: "Perusta", price: "390", tag: "", for: "Sivuston kunnossapito ja perusnäkyvyys. Sama kokonaisuus kuin verkkosivujen ylläpitopaketissa." },
  { name: "Kasvu", price: "890", tag: "Suosituin", for: "Jatkuva sisältötyö ja paikallinen näkyvyys. Taso, jolla tulokset alkavat kertyä.", hl: true },
  { name: "Täysi", price: "1 690", tag: "", for: "Kilpailluille toimialoille, joissa myös auktoriteetti pitää rakentaa." },
];

const YES = <span className="yes">✓</span>;
const NO = <span className="no">–</span>;

const ROWS: { label: string; cells: [ReactNode, ReactNode, ReactNode] }[] = [
  { label: "Seurattavat hakusanat", cells: ["10 hakusanaa", "40 hakusanaa", "100 hakusanaa"] },
  { label: "Tekninen ylläpito ja korjaukset", cells: [YES, YES, YES] },
  { label: "Sivujen optimointi kuukaudessa", cells: ["1 sivu", "3 sivua", "6 sivua"] },
  { label: "Uutta sisältöä kuukaudessa", cells: [NO, "2 artikkelia", "4 artikkelia"] },
  { label: "Google-yritysprofiili ja karttatulokset", cells: ["Käyttöönotto", "Jatkuva optimointi", "Optimointi ja arvosteluprosessi"] },
  { label: "Kaupunkisivut", cells: [NO, "5 paikkakuntaa", "Rajattomasti"] },
  { label: "Auktoriteetti ja linkkien hankinta", cells: [NO, NO, YES] },
  { label: "Tekoälyhakunäkyvyys", cells: [NO, "Optimointi", "Optimointi ja seuranta"] },
  { label: "Raportointi", cells: ["3 kk välein", "Kuukausittain", "Kuukausittain"] },
  { label: "Strategiapuhelu", cells: [NO, "Joka toinen kuukausi", "Kuukausittain"] },
  { label: "Sitoutuminen", cells: ["Kuukausi kerrallaan", "Vähintään 6 kk", "Vähintään 6 kk"] },
];

export function Hinnoittelu() {
  return (
    <section id="hinnoittelu">
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Hinnoittelu</span>
          <h2>Paljonko hakukoneoptimointi maksaa?</h2>
          <p className="sub">
            Kolme tasoa, kiinteä kuukausihinta ja maksuton kartoitus ennen aloitusta. Suomessa
            tuloksiin tähtäävä hakukoneoptimointi asettuu tyypillisesti 400–2 000 euroon
            kuukaudessa — tässä on meidän tasomme siitä haarukasta.
          </p>
        </div>

        <div className="ptable rv">
          <div className="prow head">
            <div />
            {TIERS.map((t) => (
              <div className={t.hl ? "hl" : undefined} key={t.name}>
                <p className="pt">{t.tag}</p>
                <h3>{t.name}</h3>
                <div className="pp">
                  {t.price} <small>€/kk</small>
                </div>
                <p className="pf">{t.for}</p>
              </div>
            ))}
          </div>

          {ROWS.map((r) => (
            <div className="prow" key={r.label}>
              <div>{r.label}</div>
              {r.cells.map((c, idx) => (
                <div
                  key={idx}
                  className={TIERS[idx].hl ? "hl" : undefined}
                  data-l={TIERS[idx].name}
                >
                  {c}
                </div>
              ))}
            </div>
          ))}

          <div className="prow foot">
            <div />
            {TIERS.map((t) => (
              <div className={t.hl ? "hl" : undefined} key={t.name}>
                <a className={t.hl ? "btn" : "btn alt"} href="#tarjous">
                  Pyydä tarjous
                </a>
              </div>
            ))}
          </div>
        </div>

        <p className="pricenote rv">
          Kaikki hinnat + alv 25,5 %. Ei aloitusmaksua eikä piilokuluja. Kartoitus ja alustava
          auditointi ovat maksuttomia eivätkä sido mihinkään. Kuuden kuukauden vähimmäiskesto Kasvu-
          ja Täysi-tasoilla ei ole myyntikikka: hakukoneoptimointi ei ehdi tuottaa mitään
          lyhyemmässä ajassa, emmekä halua laskuttaa työstä jota ei ehditä viedä maaliin.
        </p>
      </div>
    </section>
  );
}

/* ---------- Kenelle ---------- */
export function Kenelle() {
  return (
    <section id="kenelle" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="hsplit rv">
          <div>
            <span className="kick">Rehellisesti</span>
            <h2>Hakukoneoptimointi ei kannata kaikille.</h2>
          </div>
          <p className="sub">
            Jos tilanteesi on oikean palstan kaltainen, sanomme sen kartoituksessa ja ohjaamme sinut
            muualle. Se on halvempaa meille molemmille.
          </p>
        </div>
        <div className="twopanel stagger">
          <div className="pan yes rv" style={i(0)}>
            <h3>Kannattaa, jos</h3>
            <ul>
              {[
                "Asiakkaasi etsivät palveluasi Googlesta — toimialallasi on hakuvolyymia",
                "Yhden asiakkaan arvo on satoja tai tuhansia euroja, ei muutamaa kymppiä",
                "Kestät kolmesta kuuteen kuukautta ilman näkyviä tuloksia",
                "Sivustosi on teknisesti kunnossa tai olet valmis laittamaan sen kuntoon",
                "Haluat kanavan, joka ei sammu kun mainosbudjetti loppuu",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="pan dark rv" style={i(1)}>
            <h3>Ei kannata, jos</h3>
            <ul>
              {[
                "Tarvitset asiakkaita ensi viikolla — silloin oikea kanava on maksettu mainonta",
                "Toimialaasi ei haeta: hakumäärät ovat lähellä nollaa alueellasi",
                "Sivustolla on konversio-ongelma — lisää liikennettä ei korjaa sitä",
                "Liiketoimintamalli tai kohderyhmä on vielä auki",
                "Odotat takuuta sijasta yksi. Sellaista ei voi antaa kukaan.",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- UKK ---------- */
export function Ukk() {
  return (
    <section id="ukk" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Usein kysyttyä</span>
          <h2>Usein kysytyt kysymykset hakukoneoptimoinnista</h2>
        </div>
        <div className="faq rv">
          {FAQ_GROUPS.map((g) => (
            <div key={g.title}>
              <p className="faqgroup">{g.title}</p>
              {g.items.map((it) => (
                <details key={it.q}>
                  <summary>{it.q}</summary>
                  <div className="a">{it.a}</div>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Taustaa ---------- */
export function Taustaa() {
  return (
    <section id="kaytannossa" style={{ paddingTop: "20px" }}>
      <div className="wrap-n">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Taustaa</span>
          <h2>Hakukoneoptimointi käytännössä</h2>
        </div>
        <div className="prose rv">
          <h3>Mitä hakukoneoptimointi oikeasti on</h3>
          <p>
            Hakukoneoptimointi yritykselle eli SEO tarkoittaa sitä joukkoa toimenpiteitä, joilla
            verkkosivusto saadaan näkymään paremmin hakukoneiden{" "}
            <strong>orgaanisissa eli ei-maksetuissa hakutuloksissa</strong>. Ero maksettuun
            mainontaan on olennainen: mainos lakkaa näkymästä sinä päivänä kun budjetti loppuu, kun
            taas orgaaninen sijoitus jää voimaan ja tuottaa liikennettä myös sen jälkeen, kun
            aktiivinen työ päättyy.
          </p>
          <p>
            Käytännössä työ jakautuu kolmeen: tekniikkaan, sisältöön ja auktoriteettiin. Tekniikka
            ratkaisee pääseekö sivu hakukoneen indeksiin, sisältö ratkaisee vastaako se hakijan
            kysymykseen, ja auktoriteetti ratkaisee uskotaanko juuri sinun sivuasi enemmän kuin
            kilpailijan. Yksikään näistä ei yksin riitä.
          </p>

          <h3>Miksi kertaoptimointi ei riitä</h3>
          <p>
            Kertaluonteinen optimointi on järkevä aloitus silloin, kun sivustoa ei ole koskaan
            optimoitu: tekniset virheet korjataan, metatiedot laitetaan kuntoon ja tärkeimmät sivut
            kohdistetaan oikeille hakusanoille. Sen jälkeen tilanne kuitenkin muuttuu ilman että sinä
            teet mitään — kilpailijat julkaisevat uutta sisältöä, Google päivittää algoritmiaan ja
            hakukäyttäytyminen muuttuu.
          </p>
          <p>
            Siksi hakukoneoptimointi on luonteeltaan jatkuvaa työtä eikä projekti, jolla on
            valmistumispäivä. Se on myös syy siihen, miksi kuuden kuukauden vähimmäiskesto ei ole
            myyntikikka: lyhyemmässä ajassa ei ehdi syntyä mitään, mitä voisi mitata.
          </p>

          <h3>Mistä hakukoneoptimoinnin hinta muodostuu</h3>
          <p>
            Hinta on käytännössä työtunteja. Suomessa laadukkaan SEO-työn tuntihinta asettuu
            tyypillisesti sadan euron molemmin puolin, joten kuukausihinta kertoo suoraan sen, kuinka
            monta tuntia asiaasi käytetään. Suurimmat yksittäiset hintaan vaikuttavat tekijät ovat{" "}
            <strong>toimialan kilpailutilanne</strong>, <strong>sivuston lähtökunto</strong> ja{" "}
            <strong>tarvittavan uuden sisällön määrä</strong>.
          </p>
          <p>
            Tästä seuraa myös se, miksi hyvin halpa hakukoneoptimointi on harvoin hyvä kauppa. Jos
            kuukausihinta riittää kahteen tuntiin, ne kaksi tuntia menevät raportin tekemiseen.
            Mitään ei ehditä korjata eikä kirjoittaa.
          </p>

          <p>
            Pienelle ja keskisuurelle yritykselle hakukoneoptimointi on käytännössä ainoa
            markkinointikanava, jonka arvo kasvaa ajan myötä sen sijaan että se kuluisi loppuun.
            Mainoksesta maksetaan joka kerta uudestaan, mutta kerran kirjoitettu ja hyvin sijoittuva
            palvelusivu tuo yhteydenottoja kuukaudesta toiseen ilman lisäkustannusta. Juuri siksi työ
            kannattaa aloittaa niistä hakusanoista, joilla on selvä ostoaikomus — ei niistä, joilla
            on suurin hakuvolyymi.
          </p>

          <h3>Hakukoneoptimointi ja tekoälyhaku</h3>
          <p>
            Osa hauista päättyy nykyään tekoälyn koostamaan vastaukseen, jossa käyttäjä ei
            välttämättä klikkaa yhtäkään linkkiä. Se ei tee hakukoneoptimoinnista turhaa, mutta se
            muuttaa tavoitetta: pelkän sijoituksen sijaan tavoitellaan sitä, että{" "}
            <strong>sisältösi päätyy vastauksen lähteeksi</strong>.
          </p>
          <p>
            Hyvä uutinen on, että sama työ palvelee molempia. Selkeä sivurakenne, strukturoitu data,
            tarkistettavat faktat ja sisältö joka vastaa kysymykseen suoraan ovat juuri niitä
            asioita, jotka auttavat sekä hakukonetta että kieltä käsittelevää mallia löytämään
            vastauksen. Tätä ei tarvitse ostaa erillisenä palveluna — se on tapa tehdä sama työ
            ajatellen kahta lukijaa.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Blogi ---------- */
const POSTS = [
  ["Hintaopas", "Hakukoneoptimoinnin hinta — mistä kuukausihinta oikeasti muodostuu"],
  ["Paikallinen SEO", "Google-yritysprofiili kuntoon: näin nouset karttatuloksiin"],
  ["Tekoälyhaku", "Näkyvyys tekoälyn vastauksissa — mitä se vaatii sivustolta"],
  ["Tekninen SEO", "Avainsanatutkimus askel askeleelta pienyrittäjälle"],
];

export function Blogi() {
  return (
    <section id="blogi" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="hsplit rv">
          <div>
            <span className="kick">Blogi</span>
            <h2>Lue lisää hakukoneoptimoinnista</h2>
          </div>
          <p className="sub">Ne kysymykset, jotka tulevat vastaan ennen tarjouspyyntöä.</p>
        </div>
        <div className="postrows rv">
          {POSTS.map(([tag, title]) => (
            <a href="#" key={title}>
              <span>{tag}</span>
              <b>{title}</b>
              <i>→</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Tarjous ---------- */
export function Tarjous() {
  return (
    <section id="tarjous" style={{ paddingTop: "20px" }}>
      <div className="wrap-n">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Maksuton kartoitus</span>
          <h2>Katsotaan ensin, kannattaako se</h2>
          <p className="sub">
            Käymme läpi sivustosi nykytilan, toimialasi hakuvolyymit ja kilpailutilanteen. Saat
            suoran näkemyksen siitä, kannattaako hakukoneoptimointi juuri sinun tapauksessasi — myös
            silloin kun vastaus on ei.
          </p>
        </div>
        <BudgetForm
          budgetLabel="Kuukausibudjetti"
          messageLabel="Millä hauilla haluaisit näkyä? Kerro myös toimialasi."
          submitLabel="Pyydä maksuton kartoitus"
          extraField={{ id: "sivu", label: "Verkkosivusi osoite", placeholder: "yrityksesi.fi" }}
          note="Vastaamme 24 tunnin sisällä. Kartoitus ei sido mihinkään."
          min={200}
          max={5000}
          step={50}
          initial={890}
          unit="€/kk"
        />
      </div>
    </section>
  );
}

/* ---------- Final ---------- */
export function Loppu() {
  return (
    <section className="final">
      <div className="wrap">
        <h2 className="rv" data-par="0.04">
          Näy siellä, missä <span className="accent">ostopäätös syntyy.</span>
        </h2>
        <p className="sub rv">
          Varaa maksuton 30 minuutin kartoitus. Käymme läpi nykytilan, kilpailijoiden näkyvyyden ja
          sen, mitä kannattaa tehdä ensin.
        </p>
        <a className="btn rv mag" href="#tarjous">
          Varaa maksuton kartoitus
        </a>
        <p className="fn rv">Ei sitoumuksia · Vastaus 24 tunnissa</p>
      </div>
    </section>
  );
}
