import { React, useEffect } from "react";
import {Link} from "react-router-dom";
import "../../css/frontend/home.css";

const Home = () => {
  useEffect(() => {
    document.title = "Home - VerifiCore";
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section className="section hero-section">
        <div className="container">
          <h2>VerifiCore - A KYC Verification System</h2>
          <p className="hero-text">
            VerifiCore is a secure and streamlined KYC (Know Your Customer)
            verification system designed to help businesses verify user
            identities efficiently and compliantly. Whether you're onboarding
            new users or managing regulatory requirements, VerifiCore provides a
            fast, reliable, and fully digital identity verification solution.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h3 className="features-title">Why Choose VerifiCore?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>Instant KYC Verification</h4>
              <p>
                Verify users in seconds with AI-powered document scanning and
                identity matching.
              </p>
            </div>
            <div className="feature-card">
              <h4>Secure & Compliant</h4>
              <p>
                We follow global KYC/AML standards to keep your data safe and
                compliant.
              </p>
            </div>
            <div className="feature-card">
              <h4>Easy Integration</h4>
              <p>
                Use our API or dashboard to seamlessly integrate verification
                into your platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta">
          <h3 className="cta-title">Ready to simplify your KYC process?</h3>
          <p className="cta-text">
            Join businesses that trust <strong>VerifiCore</strong> for fast, secure, and compliant identity verification.
          </p>
          <div className="cta-buttons">
            <Link to="/register/member" className="cta-btn">
              Get Started
            </Link>
            <Link to="/about-us" className="cta-link">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
