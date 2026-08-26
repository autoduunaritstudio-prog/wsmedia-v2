import type { CSSProperties } from "react";

const ITEMS = [
  { cls: "w-site", title: "[Asiakkaan verkkosivusto]", meta: "Verkkosivut · [toimiala]" },
  { cls: "w-video", title: "[Asiakkaan videokampanja]", meta: "Lyhytvideot · [tulos]" },
  { cls: "w-event", title: "[Tapahtuma]", meta: "Tapahtumat · [pvm ja paikka]" },
  { cls: "w-site2", title: "[Asiakkaan verkkosivusto]", meta: "Verkkosivut · [toimiala]" },
];

export default function Work() {
  return (
    <section id="tyot" style={{ paddingTop: 0 }}>
      <div className="work">
        <div className="wrap">
          <div className="shead rv">
            <span className="kick" style={{ color: "#6fb1ff" }}>
              Työnäytteet
            </span>
            <h2 style={{ color: "#f5f5f7" }}>Näytämme mieluummin kuin kerromme.</h2>
            <p className="sub">
              Neljä paikkaa parhaille töille. Täytetään referensseillä ennen julkaisua.
            </p>
          </div>
          <div className="workgrid stagger">
            {ITEMS.map((item, i) => (
              <div
                className={`w-item ${item.cls} rv`}
                style={{ "--i": i } as CSSProperties}
                key={item.cls}
              >
                <div className="thumb" />
                <span className="go">→</span>
                <span className="fillchip">Täytetään</span>
                <div className="lbl">
                  <b>{item.title}</b>
                  <s>{item.meta}</s>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
