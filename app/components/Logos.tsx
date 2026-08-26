export default function Logos() {
  return (
    <div className="logos rv">
      <p className="t">Yrityksiä joiden kanssa työskentelemme</p>
      <div className="row">
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="slot" key={i}>
            [Asiakas]
          </div>
        ))}
      </div>
    </div>
  );
}
