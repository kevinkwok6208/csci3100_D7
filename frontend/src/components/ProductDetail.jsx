import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import cartService from "../services/cartService";
import reviewService from "../services/reviewService";
import "./ProductDetail.css";
import LoadingSpinner from './LoadingSpinner';

function ProductDetail({ username, token }) {
  const { id: productID } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewError, setReviewError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [newReview, setNewReview] = useState({ content: "", rating: 5 });
  const [submitError, setSubmitError] = useState("");
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loadingSubmitReview, setLoadingSubmitReview] = useState(false);
  const [currentCommentsPage, setCurrentCommentsPage] = useState(0);
  const commentsPerPage = 5; // Maximum 5 comments per page
  const [sortOption, setSortOption] = useState("time");


  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await productService.getProductById(productID);
        console.log("API Response for Product Detail:", response);
        const productData = response.product;
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productID]);

  // Fetch reviews for the product
  useEffect(() => {
    async function fetchReviews() {
      try {
        const reviewsResponse = await reviewService.getProductReviews(productID);
        setReviews(Array.isArray(reviewsResponse.reviews) ? reviewsResponse.reviews : []);
        setAvgRating(reviewsResponse.avgRating || null);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
        setReviewError(err.message || "Failed to fetch reviews");
      }
    }

    if (productID) {
      fetchReviews();
    }
  }, [productID]);

  const handleAddToCart = async () => {
    if (!username) {
      // Redirect to login page if the user is not logged in
      navigate("/login");
      return;
    }
    setLoadingAddToCart(true);
    try {
      if (quantity > (product.productStorage - product.productReservation)) {
        setCartMessage("Out of stock, please lower the quantity");
        setLoadingAddToCart(false);
        return;
      }
      await cartService.addToCart(username, product.productID, quantity);
      const message = `Product ${product.productName} added to cart!`;
      setCartMessage(message);
  
      // Clear the message after 2 seconds
      setTimeout(() => {
        setCartMessage("");
      }, 2000);
      setLoadingAddToCart(false);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage(err.message || "Failed to add product to cart");
      
      // Clear the error message after 2 seconds
      setTimeout(() => {
        setCartMessage("");
      }, 2000);
      setLoadingAddToCart(true);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      navigate("/login");
      return;
    }
    setLoadingSubmitReview(true);
    try {
      await reviewService.addProductReview(productID, newReview, username);
      setNewReview({ content: "", rating: 0 }); // Reset the form
      setHoveredRating(0); // Reset hover state
      const response = await reviewService.getProductReviews(productID); // Refresh reviews
      setReviews(response.reviews);
      setAvgRating(response.avgRating || 0);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setLoadingSubmitReview(false);
    }
  };

  const renderInteractiveStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starValue = i; //- 0.5; // Midpoint for half-star
      stars.push(
        <span
          key={`star-${i}`}
          onMouseEnter={() => setHoveredRating(starValue)} // Highlight stars on hover
          onMouseLeave={() => setHoveredRating(newReview.rating)} // Reset to selected rating
          onClick={() => setNewReview({ ...newReview, rating: starValue })} // Set rating on click
          onChange={handleReviewChange}
          className="interactive-star"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="star-icon"
            fill={hoveredRating >= starValue ? "#ffcc00" : "#ddd"} // Highlight based on hover
          >
            <path d="M12 .587l3.668 7.431 8.2 1.194-5.934 5.786 1.4 8.171L12 18.896l-7.334 3.863 1.4-8.171L.132 9.212l8.2-1.194L12 .587z" />
          </svg>
        </span>
      );
    }
    return stars;
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!username) {
      navigate("/login");
      return;
    }
    setLoadingSubmitReview(true);
    try {
      const reviewData = {
        username: username,
        content: newReview.content,
        rating: newReview.rating,
      };
      console.log(reviewData);
      await reviewService.addProductReview(productID, reviewData, username);
      setNewReview({ content: "", rating: 5 }); // Reset the review form
      setSubmitError(""); // Clear previous errors
      // Re-fetch reviews
      const reviewsResponse = await reviewService.getProductReviews(productID);
      setReviews(reviewsResponse.reviews);
      setAvgRating(reviewsResponse.avgRating || null);
      setLoadingSubmitReview(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      setSubmitError(err.message || "Failed to submit review");
      setLoadingSubmitReview(false);
    }
  };

  const generateStars = (rating) => {
    const roundedRating = Number(rating.toFixed(1)); // Ensure only one decimal place for accuracy
    const fullStars = Math.floor(roundedRating); // Full stars
    const hasHalfStar = roundedRating - fullStars >= 0.5; // Check if a half star is needed
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars
  
    return (
      <>
        {/* Full stars */}
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`full-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="#ffcc00"
              viewBox="0 0 24 24"
              className="star-icon"
            >
              <path d="M12 .587l3.668 7.431 8.2 1.194-5.934 5.786 1.4 8.171L12 18.896l-7.334 3.863 1.4-8.171L.132 9.212l8.2-1.194L12 .587z" />
            </svg>
          ))}
  
        {/* Half star */}
        {hasHalfStar && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="star-icon"
          >
            <defs>
              <linearGradient id="half-gradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" stopColor="#ffcc00" /> {/* Gold color for the filled half */}
                <stop offset="50%" stopColor="#ddd" /> {/* Gray color for the empty half */}
              </linearGradient>
            </defs>
            <path
              fill="url(#half-gradient)"
              d="M12 .587l3.668 7.431 8.2 1.194-5.934 5.786 1.4 8.171L12 18.896l-7.334 3.863 1.4-8.171L.132 9.212l8.2-1.194L12 .587z"
            />
          </svg>
        )}
  
        {/* Empty stars */}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <svg
              key={`empty-${index}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="#ddd"
              viewBox="0 0 24 24"
              className="star-icon"
            >
              <path d="M12 .587l3.668 7.431 8.2 1.194-5.934 5.786 1.4 8.171L12 18.896l-7.334 3.863 1.4-8.171L.132 9.212l8.2-1.194L12 .587z" />
            </svg>
          ))}
      </>
    );
  };
  
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "stars-asc") {
      return a.Rating - b.Rating; // Low to high
    } else if (sortOption === "stars-desc") {
      return b.Rating - a.Rating; // High to low
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt); // Default: Newest first
    }
  });

  const handleNextCommentsPage = () => {
    if ((currentCommentsPage + 1) * commentsPerPage < sortedReviews.length) {
      setCurrentCommentsPage(currentCommentsPage + 1);
    }
  };

  const handlePrevCommentsPage = () => {
    if (currentCommentsPage > 0) {
      setCurrentCommentsPage(currentCommentsPage - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  
  if (loading) return <LoadingSpinner message="Loading your shopping cart..." />;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail-container">
      <section className="spacing"></section>
      <button className="back-button" onClick={() => navigate("/")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      <div className="product-detail">
        
        <img
          src={product.productImages[0] || "https://via.placeholder.com/300"}
          alt={product.productName || "Product Image"}
          className="product-image"
        />
        <div className="product-info">
          <h1 className="product-name">{product.productName || "No Name Available"}</h1>
          <p className="product-description">{product.productDescription || "No Description Available"}</p>
          <p className="product-price">
            Price: ${product.productPrice ? product.productPrice.toFixed(2) : "N/A"}
          </p>
          <p className="product-stock">
            Available Stock:{" "}
            {product.productStorage != null && product.productReservation != null
              ? product.productStorage - product.productReservation
              : "N/A"}
          </p>
          <p className="product-featured">
            Featured: {product.featured ? "Yes" : "No"}
          </p>
          <p className="product-id">Product ID: {product.productID || "N/A"}</p>
          <p className="product-avg-rating">
          Average Rating:
          <span className="stars">
            {avgRating > 0 ? generateStars(avgRating) : " No Rating"}
          </span>
        </p>
          
          {/* Input for quantity */}
          {/* <input
            type="number"
            value={quantity}
            min="1"
            max={product.productStorage - product.productReservation}
            onChange={(e) => setQuantity(e.target.value)}
          /> */}
            <div className="product-quantity">
            <div className="quantity-controls">
              {/* Decrement Button */}
              <button
                className="quantity-arrow"
                onClick={handleDecrement}
                disabled={quantity === 1} // Disable if quantity is 1
              >
                &minus;
              </button>

              {/* Quantity Display */}
              <span className="quantity-display">{quantity}</span>

              {/* Increment Button */}
              <button className="quantity-arrow" onClick={handleIncrement}>
              &#43;
              </button>
            </div>
          </div>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            {loadingAddToCart ? "Adding to Cart...":"Add to Cart"}
          </button>
          
          {/* Display the cart message */}
          {cartMessage && <p className="cart-message">{cartMessage}</p>}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
          {/* Add Review Form */}
          <form onSubmit={handleSubmitReview} className="review-form">
            <h3>Add a Review</h3>
            {submitError && <p className="error-message">{submitError}</p>}
            <textarea
              name="content"
              value={newReview.content}
              onChange={handleReviewChange}
              placeholder="Write your review here..."
              required
            />
            {/* <select
              name="rating"
              value={newReview.rating}
              onChange={handleReviewChange}
              required
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select> */}
            <div className="interactive-stars-container">
            {renderInteractiveStars()}
          </div>
            <button type="submit">
              {loadingSubmitReview ? "Submitting Review...":"Submit Review"}
            </button>
          </form>
        <h2>Customer Reviews</h2>
        <div className="sorting-container">
          <label htmlFor="sort-comments">Sort by:</label>
          <select
            id="sort-comments"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="time">Latest</option>
            <option value="stars-desc">Stars (Highest First)</option>
            <option value="stars-asc">Stars (Lowest First)</option>
          </select>
        </div>

        {reviews.length > 0 ? (
          <div className="reviews-container">
            {sortedReviews
              .slice(
                currentCommentsPage * commentsPerPage,
                (currentCommentsPage + 1) * commentsPerPage
              )
              .map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="review-rating">
                      {generateStars(review.Rating)} {/* Display stars */}
                    </div>
                    <p className="reviewer-name">{review.username}</p>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}
            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={handlePrevCommentsPage}
                disabled={currentCommentsPage === 0}
              >
                &lt;
              </button>
              <button
                onClick={handleNextCommentsPage}
                disabled={
                  (currentCommentsPage + 1) * commentsPerPage >=
                  sortedReviews.length
                }
              >
                &gt;
              </button>
            </div>
          </div>
        ) : (
          <p>No reviews available for this product.</p>
        )}
        </div>
    </div>
  );
}

export default ProductDetail;
