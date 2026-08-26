export default function Nav() {
  return (
    <nav id="nav">
      <div className="navin">
        <span className="logo">WS Media</span>
        <div className="navlinks">
          <a href="#palvelut">Palvelut</a>
          <a href="#tyot">Työnäytteet</a>
          <a href="#prosessi">Prosessi</a>
          <a href="#paketit">Hinnoittelu</a>
          <a className="navcta" href="#lomake">
            Pyydä tarjous
          </a>
        </div>
      </div>
    </nav>
  );
}
