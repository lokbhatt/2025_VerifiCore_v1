import {useEffect} from 'react';
import {Link} from  'react-router-dom';
import '../../css/frontend/about.css';

const About = () =>{
    useEffect(() => {
        document.title = "About Us - VerifiCore";
      }, []);
    return (
        <>
            <div className="about-wrapper">
            <div className="about-hero">
                <h1>About VerifiCore</h1>
                <p>Your Trusted KYC Verification System</p>
            </div>

            <section className="about-content">
                <div className="about-section">
                <h2>Our Mission</h2>
                <p>
                    VerifiCore is committed to streamlining and securing the KYC (Know Your Customer) process through
                    a robust digital system. Our goal is to make identity verification easy, fast, and reliable for both users and businesses.
                </p>
                </div>

                <div className="about-section">
                <h2>Why Choose Us?</h2>
                <ul>
                    <li><strong>Secure & Compliant:</strong> Built with end-to-end encryption and industry compliance.</li>
                    <li><strong>Fast Verification:</strong> Automated processes reduce manual bottlenecks.</li>
                    <li><strong>User-Friendly Interface:</strong> Designed for all user levels, from tech-savvy to first-timers.</li>
                    <li><strong>Real-Time Monitoring:</strong> Stay informed with up-to-date KYC status tracking.</li>
                </ul>
                </div>

                <div className="about-section">
                <h2>Who We Serve</h2>
                <p>
                    VerifiCore supports banks, fintech platforms, government agencies, and any organization that needs
                    secure identity verification. Whether you're a startup or an enterprise, VerifiCore scales with your needs.
                </p>
                </div>

                <div className="about-cta">
                <Link to="/register/member" className="btn-primary">Get Started with VerifiCore</Link>
                </div>
            </section>
        </div>
        </>
    )
};

export default About;
