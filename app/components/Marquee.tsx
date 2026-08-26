import { Fragment } from "react";

const ITEMS = [
  "Lyhytvideot",
  "Verkkosivut",
  "Tapahtumat",
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Espoo",
  "Helsinki",
];

/** Yksi kaistan puolikas. Vain suorat span-lapset saavat .marq span -tyylit. */
function Track() {
  return (
    <span>
      {ITEMS.map((item) => (
        <Fragment key={item}>
          {item} <b>·</b>{" "}
        </Fragment>
      ))}
      {" "}
    </span>
  );
}

export default function Marquee() {
  return (
    <div className="marq" aria-hidden="true">
      <div className="track">
        <Track />
        <Track />
      </div>
    </div>
  );
}
