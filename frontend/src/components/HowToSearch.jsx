import React from "react";
import "./HowToSearch.css";
import { useNavigate, Link } from "react-router-dom";

function HowToSearch() {
  const navigate = useNavigate();
  return (
    <div className="how-to-search-container">
      <section className="spacing"></section>

      {/* Hero Section */}
      <section className="heros">
        <div className="heros-content">
          <h1>How to Search</h1>
          <p>
            Discover the easiest way to find your next read. With our search tools, you can explore a world of books in just a few clicks!
          </p>
        </div>
        <div className="heros-shape">
          <div className="circle-shape"></div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="steps-section">
        <h2>Follow These Steps to Search</h2>
        <div className="steps-grid">
          <div className="step-card">
            <h3>1. Use the Search Bar</h3>
            <p>
              At the top of the homepage, you'll find a search bar. Simply type the title, author, or keyword related to the book you’re looking for.
            </p>
          </div>
          <div className="step-card">
            <h3>2. Browse by Category</h3>
            <p>
              Navigate to the "Shop by Category" section to filter books by genres such as Fiction, Non-Fiction, Science, History, and more.
            </p>
          </div>
          <div className="step-card">
            <h3>3. Explore Featured Books</h3>
            <p>
              Check out the "Featured Books" section to see our handpicked recommendations and trending reads.
            </p>
          </div>
          <div className="step-card">
            <h3>4. Advanced Search</h3>
            <p>
              Combine keywords, such as title and author, to refine your search results. Use the search bar in the "Shop by Category" for more targeted results.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>Can I search by author?</h3>
            <p>
              Yes! Simply type the author's name in the search bar, and we'll show you all the books by that author in our collection.
            </p>
          </div>
          <div className="faq-card">
            <h3>How do I find the newest books?</h3>
            <p>
              Visit the "Featured Books" section or browse categories for the latest releases.
            </p>
          </div>
          <div className="faq-card">
            <h3>Can I combine multiple search terms?</h3>
            <p>
              Absolutely! Use keywords like "Author Name + Book Title" to refine your search results.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Still Need Help?</h2>
        <p>
          If you have trouble finding a book, feel free to contact our support team. We're here to help you discover your next favorite read!
        </p>
        <button className="contact-button" onClick={() => navigate("/contact-us")}>
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
}

export default HowToSearch;