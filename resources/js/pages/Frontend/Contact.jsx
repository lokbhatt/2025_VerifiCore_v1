import {useEffect} from 'react';
import '../../css/frontend/contact.css';

const Contact = () => {
    useEffect(() => {
        document.title = "Contact Us - VerifiCore";
      }, []);
    return (
        <>
        <section className="section">
            <div className="contact-wrapper">
                <div className="contact-header">
                    <h1>Contact Us</h1>
                    <p>Have questions or need help? We're here for you.</p>
                </div>

                <div className="contact-content">
                    <div className="contact-info">
                    <h2>Get in Touch</h2>
                    <p><strong>Address:</strong> Kathmandu Nepal</p>
                    <p><strong>Phone:</strong> <a href="tel:+9779822690580">+977 98226 90580</a></p>
                    <p><strong>Email:</strong> <a href="mailto:lokesh.bhatt.dev@gmail.com">lokesh.bhatt.dev@gmail.com</a></p>
                    </div>

                    <div className="contact-form">
                    <h2>Send a Message</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="text" name="name" placeholder="Enter Your Name" required />
                        <input type="text" name="phone" placeholder="Enter Your Phone" required />
                        <input type="email" name="email" placeholder="Enter Your Email" required />
                        <textarea name="message" placeholder="Enter Your Message" rows="5" required></textarea>
                        <button type="submit">Submit</button>
                    </form>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
};
export default Contact;