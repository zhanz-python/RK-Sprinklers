import "../../styles/footer.css";
import footerLogo from "../../src/images/RK Sprinklers.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* About section */}
        <div className="footer-about">
          <img src={footerLogo} alt="Logo" className="footer-logo" />
        </div>

        {/* Links section */}

        <div className="footer-links">
        <h3>Quick Links</h3>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
        </ul>
        </div>

        {/* Contact section */}
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>
            <a href="tel:+15867138783" className="footer-contact-link"> 📞 586-713-8783</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} RK Sprinklers. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;