import React from "react";
import "./ReturnPolicy.css";

function ReturnPolicy() {
  return (
    <div className="return-policy-container">
      {/* Hero Section */}
      <section className="heros">
        <div className="heros-content">
          <h1>Return Policy</h1>
          <p>
            Your satisfaction is our priority. Read our return policy carefully to understand how we handle returns and refunds.
          </p>
        </div>
        <div className="heros-shape">
          <div className="circle-shape"></div>
        </div>
      </section>

      {/* Policy Introduction Section */}
      <section className="policy-intro-section highlight-dark">
        <h2>Our Commitment</h2>
        <p>
          At <strong>BOOK.COM</strong>, we strive to ensure the best experience for our customers. If you're not satisfied with your purchase, our return policy is designed to make the process as smooth as possible.
        </p>
      </section>

      {/* Return Eligibility Section */}
      <section className="return-eligibility-section highlight-yellow">
        <h2>Return Eligibility</h2>
        <ul className="eligibility-list">
          <li>Items must be returned within 30 days of purchase.</li>
          <li>The item must be in its original condition, unused, and with all original packaging.</li>
          <li>Digital products, such as eBooks, are non-refundable once downloaded.</li>
          <li>Proof of purchase is required for all returns.</li>
        </ul>
      </section>

      {/* Refund Process Section */}
      <section className="refund-process-section highlight-dark">
        <h2>How to Request a Refund</h2>
        <p>
          Follow these simple steps to request a refund for your purchase:
        </p>
        <ol className="refund-steps-list">
          <li>Contact us via our <strong>Contact Us</strong> page or email us at <a href="mailto:support@book.com">support@book.com</a>.</li>
          <li>Provide your order details and reason for the return.</li>
          <li>Ship the item back to our return address once your return is approved.</li>
          <li>Receive your refund within 5-7 business days after we receive and inspect the returned item.</li>
        </ol>
      </section>

      {/* Exceptions Section */}
      <section className="exceptions-section highlight-yellow">
        <h2>Exceptions and Non-Returnable Items</h2>
        <ul className="exceptions-list">
          <li>Gift cards and promotional items are non-refundable.</li>
          <li>Items marked as "final sale" cannot be returned.</li>
          <li>Returns that do not meet the eligibility criteria will not be processed.</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className="contact-section highlight-dark">
        <h2>Need Help?</h2>
        <p>
          If you have questions or need assistance with a return, feel free to reach out to us. We're here to help!
        </p>
        <button
          className="contact-button"
          onClick={() => alert("Redirecting to Contact Page!")}
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
              <li><a href="/about-us">About Us</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/return-policy">Return Policy</a></li>
            </ul>
          </div>

          <div>
            <h4>Guides</h4>
            <ul>
              <li><a href="/how-to-search">How to Search</a></li>
              <li><a href="/making-payment">Making Payment</a></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact-us">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          © 2025 BOOK.COM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default ReturnPolicy;