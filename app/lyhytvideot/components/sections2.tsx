import SmartLink from "../../components/SmartLink";

import { Fragment } from "react";
import type { CSSProperties } from "react";
import { FAQ_GROUPS } from "../faq-data";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ============ HINNOITTELU ============ */
const PLANS = [
  {
    tag: "",
    name: "[Paketti 1]",
    forWhom: "Yrityksille, jotka aloittavat lyhytvideotuotannon.",
    features: [
      "[X] lyhytvideota kuukaudessa",
      "1 kuvauspäivä",
      "Käsikirjoitus, editointi ja tekstitys",
      "Optimointi 1 kanavalle",
      "Toimitus [X] arkipäivässä",
    ],
  },
  {
    tag: "Suosituin",
    name: "[Paketti 2]",
    forWhom: "Yrityksille, jotka haluavat jatkuvaa näkyvyyttä.",
    features: [
      "[X] lyhytvideota kuukaudessa",
      "1 kuvauspäivä",
      "Monikanavainen optimointi",
      "Esiintyjä sovittaessa",
      "Julkaisu ja kuukausiraportti",
    ],
    pop: true,
  },
  {
    tag: "",
    name: "[Paketti 3]",
    forWhom: "Yrityksille, jotka haluavat koko näkyvyyden kerralla.",
    features: [
      "[X] lyhytvideota kuukaudessa",
      "[X] kuvauspäivää",
      "TikTok, Reels, Shorts ja LinkedIn",
      "Meta-mainonnan hallinnointi",
      "Kuukausittainen strategiapalaveri",
    ],
  },
];

export function Hinnoittelu() {
  return (
    <section id="hinnoittelu">
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Hinnoittelu</span>
          <h2>Paljonko lyhytvideotuotanto maksaa?</h2>
          <p className="sub">
            Kiinteä kuukausihinta, ei aloitusmaksuja eikä pitkiä sopimuksia. Irtisanominen kuukausi
            kerrallaan.
          </p>
        </div>
        <div className="plans stagger">
          {PLANS.map((p, n) => (
            <div className={`card plan${p.pop ? " pop" : ""} rv`} style={i(n)} key={p.name}>
              <span className="pt">{p.tag}</span>
              <h3>{p.name}</h3>
              <p className="for">{p.forWhom}</p>
              <div className="price">
                [HINTA] <small>€/kk + alv</small>
              </div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className={p.pop ? "btn" : "btn alt"} href="#tarjous">
                Pyydä suunnitelma
              </a>
            </div>
          ))}
        </div>
        <p className="pricenote rv">
          Yksittäiset lyhytvideot ja kampanjatuotannot hinnoitellaan projekteina alkaen [HINTA] €.
          Katso koko{" "}
          <SmartLink href="/hinnoittelu" className="tlink" style={{ fontSize: "12.5px" }}>
            hinnoittelu
          </SmartLink>
        </p>
      </div>
    </section>
  );
}

/* ============ KENELLE ============ */
const LINK_STYLE = { color: "var(--blue)", textDecoration: "none" };

export function Kenelle() {
  return (
    <section id="kenelle" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Kenelle</span>
          <h2>Kenelle lyhytvideotuotanto sopii?</h2>
        </div>
        <div className="fit rv">
          <div className="fitbox yes">
            <h3>Sopii sinulle, jos</h3>
            <ul>
              <li>Yrityksesi ei näy siellä missä asiakkaat viettävät aikansa</li>
              <li>Somekanavat ovat olemassa, mutta sisältöä ei ehdi tehdä</li>
              <li>
                Meta-mainonta on käynyt kalliiksi ja haluat orgaanista näkyvyyttä rinnalle
              </li>
              <li>Videoita on tehty itse, mutta katseluajat jäävät lyhyiksi</li>
              <li>
                Haluat saman kumppanin hoitavan myös{" "}
                <SmartLink href="/verkkosivut" style={LINK_STYLE}>
                  verkkosivut
                </SmartLink>
                , hakukoneoptimoinnin ja{" "}
                <SmartLink href="/meta-mainonta" style={LINK_STYLE}>
                  Meta-mainonnan
                </SmartLink>
              </li>
            </ul>
          </div>
          <div className="fitbox no">
            <h3>Ei ehkä vielä, jos</h3>
            <ul>
              <li>
                Etsit yhtä yksittäistä videota etkä jatkuvaa tuotantoa — silloin projektihinnoittelu
                on järkevämpi
              </li>
              <li>
                Odotat tuloksia ensimmäisestä kuukaudesta — käänne tulee tyypillisesti [X] kuukauden
                kohdalla
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ PAIKKAKUNNAT ============ */
const CITIES = [
  "Espoo",
  "Helsinki",
  "Vantaa",
  "Tampere",
  "Turku",
  "Oulu",
  "Jyväskylä",
  "Lahti",
  "Kuopio",
  "Pori",
  "Joensuu",
  "Vaasa",
];

const SLUGS: Record<string, string> = { Jyväskylä: "jyvaskyla" };
const slug = (city: string) => SLUGS[city] ?? city.toLowerCase();

export function Alueet() {
  return (
    <section id="alueet" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Toiminta-alue</span>
          <h2>Lyhytvideotuotantoa Espoosta koko Suomeen</h2>
          <p className="sub">
            Toimipisteemme on Espoossa ja kuvaamme päivittäin pääkaupunkiseudulla. Kuvauspäivät
            onnistuvat sovitusti myös muualla Suomessa, ja pelkkä editointi- ja käsikirjoituspalvelu
            toimii etänä minne tahansa.
          </p>
        </div>
        <div className="cities rv">
          {CITIES.map((c) => (
            <SmartLink href={`/lyhytvideot/${slug(c)}`} key={c}>
              Lyhytvideot {c}
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ UKK ============ */
export function Ukk() {
  return (
    <section id="ukk" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Usein kysyttyä</span>
          <h2>Usein kysytyt kysymykset lyhytvideotuotannosta</h2>
        </div>
        <div className="faq rv">
          {/* Fragment eika div: .faqgroup:first-child saa osua vain
              ensimmaiseen ryhmaan, joten .faq-elementin lapsirakenteen on
              vastattava mockupia tasmalleen. */}
          {FAQ_GROUPS.map((group) => (
            <Fragment key={group.label}>
              <p className="faqgroup">{group.label}</p>
              {group.items.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <div className="a">{item.answer}</div>
                </details>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ JUOKSEVA TEKSTI ============ */
export function Kaytannossa() {
  return (
    <section id="kaytannossa" style={{ paddingTop: "20px" }}>
      <div className="wrap-n">
        <div className="shead rv" data-par="0.03" style={{ marginBottom: "34px" }}>
          <span className="kick">Taustaa</span>
          <h2>Lyhytvideotuotanto käytännössä</h2>
        </div>
        <div className="prose rv">
          <p>
            Lyhytvideotuotanto yrityksille tarkoittaa alle minuutin pituisten pystyvideoiden
            suunnittelua, kuvaamista ja editointia sosiaalisen median kanaviin. Käytännössä kyse on
            jatkuvasta tuotannosta: yksittäinen video ei muuta mitään, mutta säännöllinen
            julkaisutahti kerryttää katseluaikaa, ja katseluaika on se signaali, jonka perusteella
            TikTokin, Instagram Reelsin ja YouTube Shortsin algoritmit päättävät kenelle sisältö
            näytetään.
          </p>
          <p>
            Tämä on myös syy siihen, miksi lyhytvideot ovat pk-yritykselle poikkeuksellisen edullinen
            kanava. Perinteisessä mainonnassa näkyvyys ostetaan budjetilla. Lyhytvideoissa se
            ansaitaan sisällöllä — ja koska algoritmi arvioi jokaisen videon erikseen, tuntemattoman
            yrityksen video voi levitä yhtä laajalle kuin vakiintuneen brändin. Maksettu mainonta ei
            häviä kuvasta, mutta sen rooli muuttuu: sitä käytetään vahvistamaan videoita, jotka ovat
            jo osoittautuneet toimiviksi orgaanisesti.
          </p>

          <h3>Mikä lyhytvideossa ratkaisee</h3>
          <p>
            Kolme asiaa toistuu jokaisessa videossa, joka toimii. <strong>Koukku</strong> —
            ensimmäiset kolme sekuntia, joiden aikana katsoja päättää jatkaako. <strong>Rytmi</strong>{" "}
            — leikkauspisteet, jotka pitävät katseen ruudussa loppuun asti.{" "}
            <strong>Selkeä lopetus</strong> — se, mitä katsojan halutaan tekevän, sanottuna ääneen.
            Tekniikka, valo ja ääni ovat perusedellytyksiä, mutta ne eivät yksin pelasta videota,
            jonka aloitus ei pysäytä.
          </p>

          <h3>Kannattaako tuotanto ulkoistaa</h3>
          <p>
            Itse tekeminen on halvinta silloin, kun yrityksessä on henkilö, jolla on sekä taito että
            aika pitää julkaisutahtia yllä kuukaudesta toiseen. Käytännössä juuri tahti on se, mikä
            katkeaa ensimmäisenä kiireisenä kuukautena — ja katkennut tahti nollaa kertyneen
            näkyvyyden nopeammin kuin sen rakentaminen kesti. Ulkoistamisen todellinen hyöty ei ole
            pelkkä tuotannon laatu vaan se, että sisältöä syntyy myös silloin kun yrityksellä on
            kiire.
          </p>

          <h3>Brändiarvo ja liidit ovat eri asioita</h3>
          <p>
            Yleisin pettymys lyhytvideoihin syntyy siitä, että niiltä odotetaan väärää asiaa.
            Orgaaninen lyhytvideo on brändityökalu: se kasvattaa tunnettuutta, rakentaa luottamusta
            ja tekee yrityksestä tutun ennen kuin katsojalla on ostotarvetta. Se on arvokasta, mutta
            se ei näy suoraan viikkotason tarjouspyyntöinä — eikä pidäkään.
          </p>
          <p>
            Liidit syntyvät kahdesta muusta kanavasta, ja molemmat johtavat samaan paikkaan.{" "}
            <strong>Meta-mainonta</strong> ottaa videot, jotka ovat jo osoittautuneet toimiviksi
            orgaanisesti, ja vie ne maksettuna Facebookiin ja Instagramiin tarkalla kohdennuksella —
            mainoseuro menee toistoihin sen sijaan, että sillä testattaisiin mikä sisältö puree.
            Mainonnan tehtävä ei ole myydä somessa vaan{" "}
            <strong>ohjata liikenne verkkosivullesi, jossa konversio tapahtuu</strong>.{" "}
            <strong>Hakukoneoptimointi</strong> puolestaan poimii sen kysynnän, jonka video on
            luonut: kun ostaja lopulta hakee palvelua Googlesta, hän löytää sivustosi eikä
            kilpailijaa — ilman klikkikohtaista hintaa.
          </p>
          <p>
            Ketju on siis kolmiosainen:{" "}
            <strong>
              video kasvattaa yleisöä ja tunnettuutta, Meta-mainonta ohjaa siitä syntyneen
              kiinnostuksen sivustolle, ja hakukoneoptimointi tuo lisäksi ne ostajat, jotka etsivät
              palvelua omatoimisesti.
            </strong>{" "}
            Konversio tapahtuu kaikissa tapauksissa verkkosivulla, ja siksi sivuston nopeus, viestin
            selkeys ja yhteydenoton helppous ratkaisevat lopulta sen, kuinka moni näyttökerta muuttuu
            tarjouspyynnöksi.
          </p>
          <p>
            WS Media tuottaa lyhytvideot Espoosta ja kuvaa päivittäin pääkaupunkiseudulla. Koska
            teemme myös <SmartLink href="/verkkosivut">verkkosivut</SmartLink>, hakukoneoptimoinnin,{" "}
            <SmartLink href="/meta-mainonta">Meta-mainonnan</SmartLink> ja <SmartLink href="/tapahtumat">tapahtumat</SmartLink>, sama
            kuvausmateriaali palvelee somen lisäksi sivustoasi ja mainontaasi — ja viesti pysyy
            yhtenäisenä kanavasta riippumatta.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============ BLOGI ============ */
const POSTS = [
  { href: "/blogi/lyhytvideon-hinta", tag: "Hinnoittelu", title: "Paljonko lyhytvideo maksaa vuonna 2026?" },
  {
    href: "/blogi/miten-aloittaa-lyhytvideot",
    tag: "Opas",
    title: "Miten aloittaa lyhytvideoiden tekeminen yrityksessä?",
  },
  {
    href: "/blogi/tiktok-vai-instagram-reels",
    tag: "Vertailu",
    title: "TikTok vai Instagram Reels — kumpi kannattaa valita?",
  },
];

export function Blogi() {
  return (
    <section id="blogi" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03" style={{ marginBottom: "30px" }}>
          <span className="kick">Blogi</span>
          <h2>Lue lisää lyhytvideoista</h2>
        </div>
        <div className="postrows rv">
          {POSTS.map((p) => (
            <a href={p.href} key={p.href}>
              <span>{p.tag}</span>
              <b>{p.title}</b>
              <i>→</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
