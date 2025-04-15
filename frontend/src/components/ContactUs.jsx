import React from "react";
import "./ContactUs.css";
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      {/* Hero Section */}
      <section className="heros">
        <div className="heros-content">
          <h1>Contact Us</h1>
          <p>
            Have questions or need assistance? Feel free to reach out to us
            through email, phone, or our social media channels.
          </p>
        </div>
        <div className="hero-shape">
          <div className="circle-shape"></div>
        </div>
      </section>

      {/* Contact Info Box */}
      <section className="contact-info-box">
        <h2>Get In Touch With Us Now!</h2>
        <div className="contact-grid">
          {/* Phone Number */}
          <div className="contact-card">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-svg"
                fill="currentColor"
                viewBox="0 0 256 256"
                width="120"
                height="120"
              >
                <path
                  d="M 76.735 13.079 C 68.315 4.649 57.117 0.005 45.187 0 C 20.605 0 0.599 20.005 0.589 44.594 c -0.003 7.86 2.05 15.532 5.953 22.296 L 0.215 90 l 23.642 -6.202 c 6.514 3.553 13.848 5.426 21.312 5.428 h 0.018 c 0.001 0 -0.001 0 0 0 c 24.579 0 44.587 -20.007 44.597 -44.597 C 89.789 32.713 85.155 21.509 76.735 13.079 z M 27.076 46.217 c -0.557 -0.744 -4.55 -6.042 -4.55 -11.527 c 0 -5.485 2.879 -8.181 3.9 -9.296 c 1.021 -1.115 2.229 -1.394 2.972 -1.394 s 1.487 0.007 2.136 0.039 c 0.684 0.035 1.603 -0.26 2.507 1.913 c 0.929 2.231 3.157 7.717 3.436 8.274 c 0.279 0.558 0.464 1.208 0.093 1.952 c -0.371 0.743 -0.557 1.208 -1.114 1.859 c -0.557 0.651 -1.17 1.453 -1.672 1.952 c -0.558 0.556 -1.139 1.159 -0.489 2.274 c 0.65 1.116 2.886 4.765 6.199 7.72 c 4.256 3.797 7.847 4.973 8.961 5.531 c 1.114 0.558 1.764 0.465 2.414 -0.279 c 0.65 -0.744 2.786 -3.254 3.529 -4.369 c 0.743 -1.115 1.486 -0.929 2.507 -0.558 c 1.022 0.372 6.5 3.068 7.614 3.625 c 1.114 0.558 1.857 0.837 2.136 1.302 c 0.279 0.465 0.279 2.696 -0.65 5.299 c -0.929 2.603 -5.381 4.979 -7.522 5.298 c -1.92 0.287 -4.349 0.407 -7.019 -0.442 c -1.618 -0.513 -3.694 -1.199 -6.353 -2.347 C 34.934 58.216 27.634 46.961 27.076 46.217 z"
                />
              </svg>
            </div>
            <h3>Phone Number</h3>
            <p>+852 3943 8444</p>
          </div>

          {/* Email */}
          <div className="contact-card">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-svg"
                fill="currentColor"
                viewBox="-10 0 256 256"
                width="120"
                height="120"
              >
                <path
                  d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 67.511 58.015 c 0 1.8 -1.46 3.26 -3.26 3.26 H 25.749 c -1.8 0 -3.26 -1.46 -3.26 -3.26 V 39.692 L 45 47.34 l 22.511 -7.647 V 58.015 z M 67.511 35.013 L 45 42.66 l -22.511 -7.647 v -3.028 c 0 -1.8 1.46 -3.26 3.26 -3.26 h 38.501 c 1.8 0 3.26 1.46 3.26 3.26 V 35.013 z" 
                />
              </svg>
            </div>
            <h3>Email</h3>
            <p>support@book.com</p>
            <p>sales@book.com</p>
          </div>

          {/* Location */}
          <div className="contact-card">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-svg"
                fill="currentColor"
                viewBox="10 9 240 240"
                width="160"
                height="160"
              >
                <path
                  d="M 45 15 c -13.025 0 -23.583 10.559 -23.583 23.583 c 0 5.815 2.114 11.129 5.603 15.241 L 45 75 l 17.98 -21.177 c 3.489 -4.111 5.603 -9.426 5.603 -15.241 C 68.584 25.559 58.025 15 45 15 z M 45 47.47 c -5.357 0 -9.699 -4.342 -9.699 -9.699 c 0 -5.357 4.342 -9.699 9.699 -9.699 c 5.357 0 9.699 4.342 9.699 9.699 C 54.699 43.128 50.357 47.47 45 47.47 z"
                />
              </svg>
            </div>
            <h3>Location</h3>
            <p>Chung Chi Rd, Ma Liu Shui, HK</p>
          </div>

          {/* Working Hours */}
          <div className="contact-card">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-svg"
                fill="currentColor"
                viewBox="0 0 256 256"
                width="120"
                height="120"
                stroke="currentColor"
              >
                <path
                  d= "M 45 0 C 20.187 0 0 20.187 0 45 c 0 24.813 20.187 45 45 45 c 24.813 0 45 -20.187 45 -45 C 90 20.187 69.813 0 45 0 z M 66.124 61.696 L 41 47.319 V 19.044 h 8 V 42.68 l 21.097 12.073 L 66.124 61.696 z"
                />
              </svg>
            </div>
            <h3>Working Hours</h3>
            <p>Monday to Friday</p>
            <p>9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="social-media-section">
        <h2>Follow Us</h2>
        <p>Stay connected and updated by following us on social media:</p>
        <div className="social-media-links">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link facebook"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link instagram"
          >
            Instagram
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link twitter"
          >
            Twitter (X)
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="max-w-6xl mx-auto px-4">
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/return-policy">Return Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Guides</h4>
            <ul>
              <li>
                <Link to="/how-to-search">How to Search</Link>
              </li>
              <li>
                <Link to="/making-payment">Making Payment</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8">© 2025 BOOK.COM. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default ContactUs;