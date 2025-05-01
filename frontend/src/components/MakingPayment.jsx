import React from "react";
import "./MakingPayment.css";
import { useNavigate, Link } from "react-router-dom";


const MakingPayment = () => {
  const navigate = useNavigate();
  return (
    <div className="making-payment-container">
      <section className="spacing"></section>

      {/* Hero Section */}
      <section className="heros">
        <div className="heros-content">
          <h1>Making Payment</h1>
          <p>
            A quick guide to help you complete your payment securely and
            effortlessly.
          </p>
        </div>
        <div className="hero-shape">
          <div className="circle-shape"></div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="steps-section">
        <h2>Follow These Steps to Complete Your Payment</h2>
        <div className="steps-grid">
          <div className="step-card">
            <h3>1. Review Your Cart</h3>
            <p>
              Go to your <strong>Shopping Cart</strong> and ensure all the items
              you want to purchase are selected. Click "Checkout Selected
              Items" to proceed.
            </p>
          </div>
          <div className="step-card">
            <h3>2. Fill in Shipping Details</h3>
            <p>
              Provide accurate shipping information, including your full name
              and address. This ensures your order is shipped to the correct
              location.
            </p>
          </div>
          <div className="step-card">
            <h3>3. Choose PayPal</h3>
            <p>
              Select PayPal as your preferred payment method. You will be
              redirected to the PayPal platform to complete your payment.
            </p>
          </div>
          <div className="step-card">
            <h3>4. Confirm Payment</h3>
            <p>
              After reviewing the order summary on PayPal, confirm your payment.
              You'll be redirected back to the website to see your order
              confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>Is PayPal the only payment method?</h3>
            <p>
              Yes, for now, PayPal is the only supported payment method. It
              ensures secure and fast transactions.
            </p>
          </div>
          <div className="faq-card">
            <h3>What if my payment fails?</h3>
            <p>
              Don't worry! If your payment fails, you can retry the process or
              contact our support team for assistance.
            </p>
          </div>
          <div className="faq-card">
            <h3>Can I change my payment method?</h3>
            <p>
              Once you proceed to PayPal, the payment method cannot be changed.
              Ensure you've selected the correct method before proceeding.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="contact-support-section">
        <h2>Need Help?</h2>
        <p>
          If you encounter any issues during the payment process, feel free to
          reach out to our support team.
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

export default MakingPayment;