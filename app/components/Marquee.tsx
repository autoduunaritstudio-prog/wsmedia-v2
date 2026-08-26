import { Fragment } from "react";

/**
 * Yksi kaistan puolikas. Vain suorat span-lapset saavat .marq span -tyylit.
 *
 * Lopun sitomaton valilyonti on mockupista eika ole koristetta: .marq span on
 * flex-container, jossa jokainen tekstijakso on oma anonyymi flex-item. Tavallinen
 * valilyonti kollapsoituisi rivin lopussa ja kaista jaisi yhden 26px gapin
 * kapeammaksi, jolloin silmukan saumakohta siirtyisi.
 */
function Track({ items }: { items: string[] }) {
  return (
    <span>
      {items.map((item) => (
        <Fragment key={item}>
          {item} <b>·</b>{" "}
        </Fragment>
      ))}
      {"\u00A0"}
    </span>
  );
}

export default function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marq" aria-hidden="true">
      <div className="track">
        <Track items={items} />
        <Track items={items} />
      </div>
    </div>
  );
}
