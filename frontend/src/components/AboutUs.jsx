import "./AboutUs.css"; // Keep the existing styles
import React from "react";

function AboutUs() {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="heros">
        <div className="heros-content">
          <h1>About Us</h1>
          <p>
            Welcome to <strong>BOOK.COM</strong>, where we connect readers to the books they love
            and celebrate the power of storytelling.
          </p>
        </div>
        <div className="heros-shape">
          <div className="circle-shape"></div>
        </div>
      </section>

      {/* Symbolism of the Yellow Dot */}
      <section className="yellow-dot-section">
        <h2>The Yellow Dot: A Beacon of Knowledge and Connection</h2>
        <p>
          At the heart of our logo lies the **yellow dot**, symbolizing the
          boundless wisdom found in books. Its warm color represents the light
          of knowledge, the joy of discovery, and the connections that books
          foster among readers. 
        </p>
        <p>
          Just like books act as a medium to share stories
          and ideas, the yellow dot signifies the spark of wisdom that bridges
          cultures, experiences, and perspectives.
          It serves as a reminder of our mission: to make books accessible to
          everyone and to inspire curiosity, learning, and sharing through the
          timeless power of the written word.
        </p>
      </section>

      {/* Our Mission Section */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          At <strong>BOOK.COM</strong>, we aim to inspire and empower individuals
          through the power of storytelling. Whether you're a lover of fiction,
          a seeker of knowledge, or someone looking for their next great read,
          our mission is to make books accessible to everyone.
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Wide Range of Books</h3>
            <p>
              From the latest bestsellers to timeless classics, we have
              something for everyone.
            </p>
          </div>
          <div className="feature-card">
            <h3>Trusted by Thousands</h3>
            <p>
              Join the growing community of readers who trust us for their next
              read.
            </p>
          </div>
          <div className="feature-card">
            <h3>Excellent Customer Support</h3>
            <p>
              Our team is dedicated to ensuring your experience is as smooth and
              enjoyable as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>
          Have questions or need assistance? Reach out to us, and we'll be happy
          to help!
        </p>
        <button className="contact-button" onClick={() => alert("Redirecting to Contact Page!")}>
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
                <a href="about-us">About Us</a>
              </li>
              <li>
                <a href="privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="return-policy">Return Policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Guides</h4>
            <ul>
              <li>
                <a href="how-to-search">How to Search</a>
              </li>
              <li>
                <a href="making-payment">Making Payment</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li>
                <a href="FAQ">FAQ</a>
              </li>
              <li>
                <a href="contact-us">Contact Us</a>
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
}

export default AboutUs;