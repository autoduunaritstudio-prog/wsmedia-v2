import BudgetForm from "./BudgetForm";

export default function Contact() {
  return (
    <section id="lomake">
      <div className="wrap-n">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Tarjous</span>
          <h2>Kerro budjettisi.</h2>
          <p className="sub">
            Saat räätälöidyn suunnitelman juuri sinun yrityksellesi, 24 tunnin sisällä ja ilmaiseksi.
          </p>
        </div>
        <BudgetForm />
      </div>
    </section>
  );
}
