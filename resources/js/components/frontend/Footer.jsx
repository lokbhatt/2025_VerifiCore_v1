import '../../css/frontend/footer.css';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import logo from '../../../../public/img/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section contact">
          <img src={logo} alt="footerLogo" className="footer-logo" />
          <p>Verificore - a secure and streamlined KYC (Know Your Customer) verification system</p>
          <p><strong>Mobile:</strong> <a href="tel:9822690580">9822690580</a></p>
          <p><strong>Email:</strong> <a href="mailto:lokesh.bhatt.dev@gmail.com">lokesh.bhatt.dev@gmail.com</a></p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/"><strong>Home</strong></Link></li>
            <li><Link to="/about-us"><strong>About Us</strong></Link></li>
            <li><Link to="/contact-us"><strong>Contact Us</strong></Link></li>
            <li><Link to="/privacy-policy"><strong>Privacy Policy</strong></Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <ul>
            <li>
              <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                <FaFacebookF /><strong>Facebook</strong>
              </a>
            </li>
            <li>
              <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                <FaTwitter /><strong>Twitter</strong>
              </a>
            </li>
            <li>
              <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                <FaInstagram /><strong>Instagram</strong>
              </a>
            </li>
            <li>
              <a href="https://youtube.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                <FaYoutube /><strong>Youtube</strong>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 A KYC Verification System (VerifiCore) | Powered By Lokesh Bhatt</p>
      </div>
    </footer>
  );
};

export default Footer;
