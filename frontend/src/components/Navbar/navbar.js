import "./navbar.css";
import { Link } from "react-router-dom";
import seccionesMap from "../seccionesMap";
import logo from "./logo.png";

function Navbar({ activeSection }) {
  return (
    <div className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo del Restaurante" />
        </Link>
      </div>
      <div className="sections-container">
        <div className="menu">
          {Object.keys(seccionesMap).map((seccion) => (
            <Link
              key={seccion}
              to={`/${seccion}`}
              className={seccion === activeSection ? "active" : ""}
            >
              {seccion.charAt(0).toUpperCase() + seccion.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
