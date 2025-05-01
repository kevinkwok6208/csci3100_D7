import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedBooksSlider.css";

function FeaturedBooksSlider({ featuredBooks = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0); // Start with the first book
  const navigate = useNavigate();

  // Function to handle the "Next" button
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, featuredBooks.length - 1)
    );
  };

  // Function to handle the "Prev" button
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  // Handle cases where there are not enough books
  if (featuredBooks.length < 3) {
    return (
      <div className="featured-books-slider">
        <p>Not enough books to display a full slider.</p>
      </div>
    );
  }

  return (
    <section className="featured-books-slider">
      <div className="slider-container">
        {/* Left Arrow */}
        <button
          className="feature-slider-button-prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          &lt;
        </button>

        <div className="slider">
          {featuredBooks.map((book, index) => {
            const position = index - currentIndex; // Calculate position relative to the highlighted book
            const isActive = position === 0; // Check if the book is in the center

            return (
              <div
                key={book._id}
                className={`slider-item ${isActive ? "active" : ""}`}
                style={{
                  transform: `translateX(${position * 200}%) scale(${
                    isActive ? 1 : 0.8
                  })`,
                  opacity: isActive ? 1 : 0.6,
                  zIndex: isActive ? 2 : 1,
                  transition: "transform 1s ease, opacity 1s ease", // Smooth transitions
                }}
                onClick={() => isActive && navigate(`/products/${book.productID}`)}
              >
                <img
                  src={book.productImages[0]} // Default image fallback
                  alt={book.productName}
                  className={`slider-image ${isActive ? "highlighted" : ""}`}
                />
                <div className="book-details">
                  <h3>{book.productName}</h3>
                  {isActive && <p>${book.productPrice.toFixed(2)}</p>}
                  {isActive && (
                    <p>
                      {book.productDescription ||
                        "Explore the story of this book."}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          className="feature-slider-button-next"
          onClick={handleNext}
          disabled={currentIndex === featuredBooks.length - 1}
        >
          &gt;
        </button>
      </div>

      {/* Transparent Line Separator */}
      <div className="line-separator"></div>
    </section>
  );
}

export default FeaturedBooksSlider;