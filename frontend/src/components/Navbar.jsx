import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  if (isAdminRoute) {
    return (
      <nav className="navbar admin-navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            <span className="navbar-logo-badge admin-navbar-logo-badge">TB</span>
            <span className="navbar-logo-text">
              Travel<span>Bharat</span>
            </span>
          </Link>

          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""} onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>

            <li>
              <Link
                to={location.pathname === "/admin/dashboard" ? "/admin/dashboard" : "/admin/login"}
                className="btn btn-primary admin-navbar-cta"
                onClick={() => setMenuOpen(false)}
              >
                {location.pathname === "/admin/dashboard" ? "Dashboard" : "Admin Panel"}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar user-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar-logo-badge">TB</span>
          <span className="navbar-logo-text">
            Travel<span>Bharat</span>
          </span>
        </Link>

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <li>
            <a href="/#top" onClick={() => setMenuOpen(false)}>Home</a>
          </li>
          <li>
            <a href="/#about" onClick={() => setMenuOpen(false)}>About</a>
          </li>
          <li>
            <a href="/#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </li>
          <li>
            <Link
              to="/admin/login"
              className="btn btn-outline navbar-admin-link"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
