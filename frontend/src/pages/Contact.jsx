import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        Have questions, suggestions, or need support? We’d love to hear from you!
      </p>

      {/* Contact Info */}
      <div className="contact-info">
        <div className="info-card">
          <img src="/images/email.png" alt="Email" />
          <h3>Email</h3>
          <p>dypconnect@gmail.com</p>
        </div>
        <div className="info-card">
          <img src="/images/phone.png" alt="Phone" />
          <h3>Phone</h3>
          <p>+91 98765 43210</p>
        </div>
        <div className="info-card">
          <img src="/images/map.png" alt="Location" />
          <h3>Location</h3>
          <p>DYP College Campus, Kolhapur, India</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="contact-form">
        <h2>Send us a Message</h2>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
