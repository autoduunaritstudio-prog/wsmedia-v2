import { FAQ, FAQ_GROUPS } from "./faq-data";

export function Ukk() {
  return (
    <section id="ukk" style={{ paddingTop: 20 }}>
      <div className="wrap-n">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Usein kysyttyä</span>
          <h2>Usein kysytyt kysymykset</h2>
        </div>
        <div className="faq rv">
          {FAQ_GROUPS.length > 0
            ? FAQ_GROUPS.map((g) => (
                <div key={g}>
                  <p className="faqgroup">{g}</p>
                  {FAQ.filter((f) => f.group === g).map((f) => (
                    <details key={f.q}>
                      <summary>{f.q}</summary>
                      <div className="a">{f.a}</div>
                    </details>
                  ))}
                </div>
              ))
            : FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <div className="a">{f.a}</div>
                </details>
              ))}
        </div>
      </div>
    </section>
  );
}
