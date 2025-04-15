import React from "react";
import "./FAQ.css";
import { useNavigate, Link } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();
  return (
    <div className="faq-container">
      {/* Hero Section */}
      <section className="heros">
        <div className="heros-content">
          <h1>Frequently Asked Questions</h1>
          <p>
            Find answers to some of the common questions about using our
            platform, making payments, and managing your orders.
          </p>
        </div>
        <div className="hero-shape">
          <div className="circle-shape"></div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>General Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>How can I create an account?</h3>
            <p>
              To create an account, click on the "Login" button on the
              navigation bar, fill out the registration form, and verify your
              email.
            </p>
          </div>
          <div className="faq-card">
            <h3>What if I forget my password?</h3>
            <p>
              Click on the "Forgot Password" link on the login page to reset
              your password. Follow the instructions sent to your email.
            </p>
          </div>
          <div className="faq-card">
            <h3>Can I update my account details?</h3>
            <p>
              Yes! Go to your profile page to update your personal details,
              including your email or password.
            </p>
          </div>
        </div>
      </section>

      {/* Payment FAQs */}
      <section className="faq-section">
        <h2>Payment Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>What payment methods are supported?</h3>
            <p>
              Currently, we only support PayPal for secure and fast
              transactions.
            </p>
          </div>
          <div className="faq-card">
            <h3>Is my payment information secure?</h3>
            <p>
              Yes, we use industry-standard encryption to ensure all your
              payment details are secure and processed through trusted
              platforms.
            </p>
          </div>
          <div className="faq-card">
            <h3>What should I do if my payment fails?</h3>
            <p>
              If your payment fails, try again or contact our support team for
              assistance. Ensure you have a stable internet connection.
            </p>
          </div>
        </div>
      </section>

      {/* Order Management FAQs */}
      <section className="faq-section">
        <h2>Order Management Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>How can I track my order?</h3>
            <p>
              After completing your payment, you can view your order details and
              tracking information on the "My Orders" page.
            </p>
          </div>
          <div className="faq-card">
            <h3>Can I cancel my order?</h3>
            <p>
              Orders can be canceled within 15 minutes of reservation. After
              that, please contact our support team for assistance.
            </p>
          </div>
          <div className="faq-card">
            <h3>What if I receive a damaged product?</h3>
            <p>
              If you receive a damaged product, please contact our support team
              within 7 days of delivery for a resolution.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="contact-support-section">
        <h2>Still Have Questions?</h2>
        <p>
          If your question is not listed here, feel free to contact our support
          team. We're here to help!
        </p>
        <button
          className="contact-button"
          onClick={() => navigate("/contact-us")}
        >
          Contact Us
        </button>
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
                <Link to="/FAQ">FAQ</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8">
          © 2025 BOOK.COM. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default FAQ;