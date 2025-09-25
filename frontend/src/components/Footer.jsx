import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'; // Create this CSS file for custom styling

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white pt-4 pb-2">
      <div className="container text-center text-md-left">
        <div className="row">

          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold">Campus Connect</h5>
            <p>
              Your gateway to connecting with seniors, finding guidance, and celebrating campus life at DYP College.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="footer-link">Home</a></li>
              
              <li><a href="/signin" className="footer-link">Login</a></li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold">Contact</h5>
            <p>Email: support@CampusConnect.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Kolhapur, Maharashtra</p>
          </div>

        </div>
      </div>

      <div className="text-center py-3 footer-bottom">
        © {new Date().getFullYear()} Campus Connect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
