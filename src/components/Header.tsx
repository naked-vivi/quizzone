import { Link, NavLink } from "react-router-dom";
import quizzoneLogo from "../assets/quizzone.svg";

function Header() {
  return (
    <header className="app-header">
      <Link className="brand" to="/" aria-label="Quizzone home">
        <img src={quizzoneLogo} alt="" />
        <h1>Quizzone</h1>
      </Link>
      <nav aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/import">Import</NavLink>
      </nav>
    </header>
  );
}

export default Header;
