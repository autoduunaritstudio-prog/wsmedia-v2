import BudgetForm from "./BudgetForm";

/**
 * KAKSI PALSTAA: kuva vasemmalla, lomake oikealla. Sama rakenne kuin
 * verkkosivujen .formsplitissa, mutta omalla nimella - se saanto on
 * rajattu .page-verkkosivut-luokkaan eika pade etusivulla.
 *
 * Palsta vaihtuu .wrap-n:sta (820px) .wrapiin (1080px): kahdelle
 * palstalle 820px ei riita, lomake yksin jaisi alle 400px levealle.
 *
 * KUVA ON VALIAIKAINEN. Paikalla on tarkoituksella tunnistettava
 * paikkamerkki eika oikean nakoinen kuvituskuva: kolme hahmoa samalla
 * viivapiirroskielella jota navipalkin kantajat kayttavat. Kun oikea
 * tiimikuva on olemassa, tama lohko korvataan <Image>-elementilla eika
 * mitaan muuta tarvitse muuttaa.
 */
function TeamPlaceholder() {
  return (
    <div className="ctashot" aria-hidden="true">
      <svg viewBox="0 0 300 380" preserveAspectRatio="xMidYMax meet">
        {[
          { x: 80, s: 0.94 },
          { x: 150, s: 1 },
          { x: 220, s: 0.94 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x} 330) scale(${p.s}) translate(0 -330)`}>
            <circle cx="0" cy="150" r="15" />
            <path d="M0 165 V245" />
            <path d="M0 180 L-30 215 M0 180 L30 215" />
            <path d="M0 245 L-22 320 M0 245 L22 320" />
          </g>
        ))}
        <path className="ctashot-floor" d="M20 330 H280" />
      </svg>
      <span className="ctashot-tag">Tiimikuva tulossa</span>
    </div>
  );
}

export default function Contact() {
  return (
    <section id="lomake">
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Tarjous</span>
          <h2>Kerro mitä tarvitset.</h2>
          <p className="sub">
            Vastaamme 24 tunnin sisällä ja kerromme suoraan mitä ehdotamme ja mitä se maksaa.
          </p>
        </div>
        <div className="ctasplit">
          <TeamPlaceholder />
          {/* Ei budjettiliukuria: etusivun lomake on ensikosketus, ja
              budjetin kysyminen ennen kuin kavija tietaa mita han on
              ostamassa karsii yhteydenottoja. Palvelusivuilla liukuri jaa
              paikalleen, koska sinne tullaan tietyn palvelun perassa. */}
          <BudgetForm showBudget={false} note="Ei sitoumuksia." tilt="-y" />
        </div>
      </div>
    </section>
  );
}
