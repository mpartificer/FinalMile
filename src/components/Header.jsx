import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="navbar headerBackground shadow-sm text-primary-content fixed top-0 left-0 border-b border-gray-200">
      <Link to="/FinalMile/" className="pl-4 z-100 font-semibold text-xl hover:text-primary-content/80">
        Final Mile
      </Link>
    </div>
  );
}

export default Header;