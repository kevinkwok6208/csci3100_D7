import React from "react";
import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-policy-container">
      {/* Hero Section */}
      <section className="heros">
        <div className="heros-content">
          <h1>Privacy Policy</h1>
          <p>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>
        <div className="heros-shape">
          <div className="circle-shape"></div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="policy-intro-section" style={{ backgroundColor: "#f8f9fc", padding: "30px", borderRadius: "12px" }}>
        <h2 style={{ color: "#333" }}>Introduction</h2>
        <p>
          At <strong>BOOK.COM</strong>, we are committed to safeguarding your personal data and ensuring transparency in how we handle it. This Privacy Policy outlines our practices for collecting, using, and protecting your information.
        </p>
      </section>

      {/* Data Collection Section */}
      <section
        className="data-collection-section"
        style={{
          backgroundColor: "#fffdf6",
          padding: "30px",
          borderRadius: "12px",
          marginTop: "40px",
        }}
      >
        <h2 style={{ color: "#333" }}>What Data We Collect</h2>
        <ul className="data-list">
          <li>
            <strong>Personal Information:</strong> Name, email address, and contact details.
          </li>
          <li>
            <strong>Order Details:</strong> Billing and shipping information for orders.
          </li>
          <li>
            <strong>Browsing Behavior:</strong> Preferences and activity to enhance your experience.
          </li>
        </ul>
      </section>

      {/* Usage of Data Section */}
      <section
        className="data-usage-section"
        style={{
          backgroundColor: "#f8f9fc",
          padding: "30px",
          borderRadius: "12px",
          marginTop: "40px",
        }}
      >
        <h2 style={{ color: "#333" }}>How We Use Your Data</h2>
        <p style={{ color: "#666" }}>
          We use the information we collect to:
        </p>
        <ul className="usage-list">
          <li>
            <strong>Order Processing:</strong> To process your orders and provide customer support.
          </li>
          <li>
            <strong>Personalization:</strong> To tailor your shopping experience to your preferences.
          </li>
          <li>
            <strong>Updates:</strong> To send updates about new products, offers, and services.
          </li>
        </ul>
      </section>

      {/* Security Section */}
      <section
        className="security-section"
        style={{
          backgroundColor: "#fffdf6",
          padding: "30px",
          borderRadius: "12px",
          marginTop: "40px",
        }}
      >
        <h2 style={{ color: "#333" }}>How We Protect Your Data</h2>
        <p style={{ color: "#666" }}>
          We take data protection seriously and implement the following measures:
        </p>
        <ul className="security-list">
          <li>
            <strong>Encryption:</strong> Sensitive information is encrypted to ensure its safety.
          </li>
          <li>
            <strong>Secure Payments:</strong> Payments are processed securely through trusted third-party platforms.
          </li>
          <li>
            <strong>Regular Audits:</strong> We conduct routine audits of our security practices.
          </li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className="contact-section" style={{ backgroundColor: "#f8f9fc", padding: "30px", borderRadius: "12px", marginTop: "40px" }}>
        <h2 style={{ color: "#333" }}>Contact Us</h2>
        <p style={{ color: "#666" }}>
          If you have any questions or concerns about this Privacy Policy, feel free to contact us.
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
          © 2025 BOOK.COM . All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;