import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="navbar headerBackground text-primary-content fixed top-0 left-0">
      <Link to="/FinalMile/" className="pl-4 font-semibold text-xl hover:text-primary-content/80">
        Final Mile
      </Link>
    </div>
  );
}

export default Header;