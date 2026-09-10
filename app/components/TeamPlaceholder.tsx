/**
 * VALIAIKAINEN TIIMIKUVAN PAIKKAMERKKI.
 *
 * Paikkamerkki saa nayttaa paikkamerkilta: kolme hahmoa samalla
 * viivapiirroskielella jota navipalkin kantajat kayttavat, eika
 * oikean nakoinen kuvituskuva joka jaisi sivulle huomaamatta. Kun oikea
 * tiimikuva on olemassa, tama korvataan <Image>-elementilla eika mitaan
 * muuta tarvitse muuttaa.
 *
 * Omana komponenttinaan eika Contactin sisalla, koska sama CTA-rakenne
 * on nyt myos palvelusivuilla.
 */
export default function TeamPlaceholder() {
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

