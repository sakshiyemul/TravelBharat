import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <footer className="footer admin-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>TravelBharat</h3>
            <p>
              Your digital travel encyclopedia for exploring India state by
              state. Discover heritage, nature, adventure, and spiritual
              destinations.
            </p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/admin/login">Admin Panel</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Categories</h4>
            <ul>
              <li><a href="#">Heritage Sites</a></li>
              <li><a href="#">Nature & Wildlife</a></li>
              <li><a href="#">Adventure Sports</a></li>
              <li><a href="#">Spiritual Places</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          {"\u00A9"} 2026 TravelBharat {"\u2014"} Explore India State by State. Built with {"\u2764\uFE0F"}
          {" "}for Incredible India.
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer user-footer" id="contact">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>TravelBharat</h3>
          <p>
            Discover India through image-led travel inspiration, scenic destinations,
            and thoughtfully presented regional guides.
          </p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/#top">Home</a></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/#states-list">Destinations</a></li>
            <li><Link to="/admin/login">Admin Panel</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:hello@travelbharat.com">hello@travelbharat.com</a></li>
            <li><a href="tel:+911234567890">+91 82084 24861</a></li>
            <li>Maharashtra, India</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        {"\u00A9"} 2026 TravelBharat. Explore India with a clean, modern travel experience.
      </div>
    </footer>
  );
}

export default Footer;
