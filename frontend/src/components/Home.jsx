import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
import reviewService from "../services/reviewService";
import FeaturedBooksSlider from "./FeaturedBooksSlider";
import "./Home.css";

function Home({ isLoggedIn }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingFeatured, setLoadingFeatured] = useState(true); // Loading state for Featured Books
  const [loadingTopRatings, setLoadingTopRatings] = useState(true); // Loading state for Top Ratings
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading state for Shop by Category
  const navigate = useNavigate();

  const itemsPerPage = 6;

  // Fetch books and set loading states
  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await productService.getAllProducts();
        if (response.success) {
          setBooks(response.products);
          setFilteredBooks(response.products);

          // Filter featured books
          const featured = response.products.filter((book) => book.featured === true);
          setFeaturedBooks(featured);

          // Simulate loading for Featured Books
          setLoadingFeatured(false);

          // Simulate loading for Shop by Category
          setLoadingCategories(false);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
    fetchBooks();
  }, []);

  // Fetch best sellers and set loading state
  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const productsWithRatings = await Promise.all(
          books.map(async (book) => {
            const reviewsResponse = await reviewService.getProductReviews(book.productID);
            const reviews = reviewsResponse.reviews || [];
            const avgRating = reviewsResponse.avgRating || 0;
            const highestRatedComment = reviews.reduce(
              (max, review) => (review.Rating > (max?.Rating || 0) ? review : max),
              null
            );

            return {
              ...book,
              avgRating,
              highestComment: highestRatedComment,
            };
          })
        );

        const sortedBestSellers = productsWithRatings
          .filter((p) => p.avgRating > 0)
          .sort((a, b) => b.avgRating - a.avgRating)
          .slice(0, 5);

        setBestSellers(sortedBestSellers);

        // Simulate loading for Top Ratings
        setLoadingTopRatings(false);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    }

    if (books.length > 0) {
      fetchBestSellers();
    }
  }, [books]);

  const handleSearch = () => {
    const filtered = books.filter((book) =>
      book.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleCategoryFilter = (category) => {
    if (category === "all") {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter((book) => book.category === category));
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredBooks.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Helper function to generate star symbols for rating
  const generateStars = (rating) => {
    const validRating = Math.max(0, Math.min(5, rating)); // Ensure rating is between 0 and 5
    const fullStars = Math.floor(validRating);
    const halfStar = validRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {"★".repeat(fullStars)}
        {halfStar ? "☆" : ""}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>The Store That Feeds Your Mind. Visit Us Today</h1>
          <p>Where you can browse, buy, and read books in minutes.</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by Title or Author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => {
                handleSearch(); // Filter books
                const categorySection = document.querySelector(".categories");
                categorySection.scrollIntoView({ behavior: "smooth" }); // Scroll to "Shop by Category"
              }}
            >
              Search
            </button>
          </div>
        </div>
        <div className="hero-shape">
          <div className="circle-shape"></div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="featured-books">
      {loadingFeatured ? (
        <p>Loading featured books...</p>
      ) : (
        <FeaturedBooksSlider featuredBooks={featuredBooks} />
      )}
      </section>

      {/* Top Ratings */}
      <section className="best-sellers">
        <h2 className="best-sellers-title">Top Ratings</h2>
        {loadingTopRatings ? (
          <p>Loading top-rated books...</p>
        ) : (
          <div className="product-grid best-sellers-grid">
            {bestSellers.map((book) => (
              <div
                key={book._id}
                className="best-seller-card"
                onClick={() => navigate(`/products/${book.productID}`)}
              >
                <div className="tilted-book-wrapper">
                  <img
                    src="https://res.cloudinary.com/doigqstxw/image/upload/v1743099083/careless-people-7_fdqunw.jpg"
                    alt={book.productName}
                    className="tilted-book-image"
                  />
                </div>
                <div className="book-info">
                  <h3>{book.productName}</h3>
                  <div className="rating">{generateStars(book.avgRating)}</div>
                  {book.highestComment && (
                    <p className="comment">{book.highestComment.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shop by Category */}
      <section className="categories">
        <h2>Shop by Category</h2>
        {loadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <>
            <div className="category-buttons">
              {["All", "Fiction", "Non-Fiction", "Science", "History", "Biography"].map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category.toLowerCase())}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
            <div className="product-grid">
              {filteredBooks
                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                .map((book) => (
                  <div
                    key={book._id}
                    className="product-card"
                    onClick={() => navigate(`/products/${book.productID}`)}
                  >
                    <img
                      src="https://res.cloudinary.com/doigqstxw/image/upload/v1743099083/careless-people-7_fdqunw.jpg"
                      alt={book.productName}
                      className="product-image"
                    />
                    <h3>{book.productName}</h3>
                    <p>${book.productPrice.toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </>
        )}
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            &lt;
          </button>
          <button
            onClick={handleNextPage}
            disabled={(currentPage + 1) * itemsPerPage >= filteredBooks.length}
          >
            &gt;
          </button>
        </div>
      </section>
      {!isLoggedIn && (
        <section className="sign-in-prompt featured-books">
          <h2>Sign In Today to Enjoy Exclusive Benefits!</h2>
          <p>Get access to your shopping cart, order tracking, and more.</p>
          <button onClick={() => navigate("/auth")}>Sign In</button>
        </section>
      )}
      {/* Footer */}
      <footer class="footer">
        <div class="max-w-6xl mx-auto px-4">
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="about-us">About Us</a></li>
              <li><a href="privacy-policy">Privacy Policy</a></li>
              <li><a href="return-policy">Return Policy</a></li>
            </ul>
          </div>

          <div>
            <h4>Guides</h4>
            <ul>
              <li><a href="how-to-search">How to Search</a></li>
              <li><a href="making-payment">Making Payment</a></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li><a href="FAQ">FAQ</a></li>
              <li><a href="contact-us">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div class="mt-8">
          © 2025 BOOK.COM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;