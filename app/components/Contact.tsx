import BudgetForm from "./BudgetForm";

/**
 * ETUSIVUN TARJOUSOSIO (5.10.2026): sama kokonaisuus kuin palvelusivujen
 * tarjousosiossa. Taustakuva (kayntikortit poydalla), vasemmalla otsikko,
 * yhteystiedot ja kolmen vaiheen aikajana, oikealla tumma lomakepaneeli
 * kiertavine reunavaloineen ja vaihtoehtoiset yhteystavat (varaus,
 * puhelin). Tyylit: #lomake.cta-palvelu globals.css:ssa, jaettu
 * palvelusivujen #tarjous-saantojen kanssa.
 */
export default function Contact() {
  return (
    <section id="lomake" className="cta-palvelu kuvapohja">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="pohjakuva"
        src="/kuvat/tarjous-kortit.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        data-par="0.028"
      />
      <div className="wrap">
        <p className="cta-selite">Vastaus 24 tunnissa</p>
        <div className="loc">
          <div>
            <h2 className="cta-h2 rv">
              Kerro, mitä <span className="korosta">tarvitset.</span>
            </h2>
            <p className="cta-lead rv">
              Kerromme suoraan, mitä ehdotamme ja mitä se maksaa, myös silloin kun vastaus on ei.
              Voit myös soittaa numeroon <a href="tel:+358405648770">040 564 8770</a> tai
              kirjoittaa osoitteeseen <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>.
            </p>
            <ol className="askel porras rv">
              <li>
                <b>24 h</b>
                <span>Luemme viestin ja vastaamme sähköpostilla.</span>
              </li>
              <li>
                <b>30 min</b>
                <span>Kartoitus: nykytila, tavoite ja mikä palvelu sopii.</span>
              </li>
              <li>
                <b>Tarjous</b>
                <span>Kirjallinen ehdotus hintoineen. Ei sitoumuksia ennen hyväksyntää.</span>
              </li>
            </ol>
          </div>
          {/* Ei budjettiliukuria: etusivun lomake on ensikosketus. */}
          <BudgetForm
            otsikko="Tarjouspyyntö"
            vaihtoehdot
            showBudget={false}
            messageLabel="Mitä haluaisit saada aikaan?"
            note="Ei sitoumuksia."
          />
        </div>
      </div>
    </section>
  );
}
