import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';

const Footer = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  // Inline styles
  const linkHoverStyle = {
    textDecoration: 'underline',
    color: '#17c1e8',
  };

  const paragraphStyle = {
    fontSize: '14px',
  };

  return (
    <footer className="bg-dark text-light pt-5 pb-4">
      <div className="container">
        {/* Row with 3 Columns */}
        <div className="row text-center text-md-start">
          {/* About */}
          <div className="col-md-4 mb-4" data-aos="fade-up">
            <h5 className="text-uppercase fw-bold mb-3">About Us</h5>
            <p style={paragraphStyle}>
              eAuto is your one-stop shop for genuine two-wheeler spare parts.
              We deliver top-quality products to meet your automotive needs with unmatched convenience and reliability.
            </p>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="100">
            <h5 className="text-uppercase fw-bold mb-3">Contact Us</h5>
            <ul className="list-unstyled" style={paragraphStyle}>
              <li>Email: <a
                href="mailto:support@eauto.com"
                className="text-info text-decoration-none"
                onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.target.style, { color: '', textDecoration: 'none' })}
              >
                support@eauto.com
              </a></li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: 101 Auto Street, Gujarat, India</li>
            </ul>
          </div>

          {/* Reviews */}
          <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
            <h5 className="text-uppercase fw-bold mb-3">Customer Reviews</h5>
            <p style={paragraphStyle}>
              "Fast delivery and authentic parts! Highly recommended." <br />
              <small>- Ankit Patel</small>
            </p>
            <p style={paragraphStyle}>
              "Saved 10% on my prepaid order, love it!" <br />
              <small>- Priya Desai</small>
            </p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="row">
          <div className="col text-center mt-3">
            <small>&copy; 2025 <strong>eAuto</strong>. All Rights Reserved.</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
