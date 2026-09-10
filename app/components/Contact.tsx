import BudgetForm from "./BudgetForm";
import TeamPlaceholder from "./TeamPlaceholder";

/**
 * KAKSI PALSTAA: kuva vasemmalla, lomake oikealla. Sama rakenne kuin
 * verkkosivujen .formsplitissa, mutta omalla nimella - se saanto on
 * rajattu .page-verkkosivut-luokkaan eika pade etusivulla.
 *
 * Palsta vaihtuu .wrap-n:sta (820px) .wrapiin (1080px): kahdelle
 * palstalle 820px ei riita, lomake yksin jaisi alle 400px levealle.
 *
 * Kuva on valiaikainen paikkamerkki, ks. TeamPlaceholder.
 */
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
