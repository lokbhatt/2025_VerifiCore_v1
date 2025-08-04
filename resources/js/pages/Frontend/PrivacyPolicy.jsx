import { useEffect } from 'react';
import '../../css/frontend/privacy_policy.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - VerifiCore";
  }, []);

  return (
    <section className="section">
      <div className="privacy-policy-wrapper">
        <h1>Privacy Policy</h1>
        <p>
          At <strong>VerifiCore</strong>, your privacy is of utmost importance to us. This Privacy Policy explains how we collect, use, and protect your information.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following types of personal information:</p>
        <ul>
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>KYC documents and identification data</li>
          <li>Usage data and technical information</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>Your data is used strictly for the following purposes:</p>
        <ul>
          <li>To verify your identity (KYC verification)</li>
          <li>To improve and personalize your experience</li>
          <li>To comply with legal and regulatory obligations</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data. This includes encryption, secure data storage, and restricted access controls.
        </p>

        <h2>4. Sharing of Information</h2>
        <p>
          VerifiCore does not sell or rent your data. Your information may be shared with government agencies or authorized third parties only as required by law.
        </p>

        <h2>5. Cookies and Tracking</h2>
        <p>
          We may use cookies and analytics tools to enhance user experience. You may disable cookies through your browser settings.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction or deletion</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this policy or your data, please contact us at: <br />
          <strong>Email:</strong> <a href="mailto:lokesh.bhatt.dev@gmail.com">lokesh.bhatt.dev@gmail.com</a> <br />
          <strong>Phone:</strong> <a href="tel:+9779822690580">+977 98226 90580</a>
        </p>

        <p>
          <em>Last Updated: July 3, 2025</em>
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
