import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import cartService from "../services/cartService";
import reviewService from "../services/reviewService";
import "./ProductDetail.css";

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
  const [loadingSubmitReview, setLoadingSubmitReview] = useState(false);

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

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail-container">
      <section className="spacing"></section>
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
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
              Average Rating: {avgRating > 0 ? avgRating.toFixed(1) : "No Rating"}
              {avgRating > 0 && (
                <span className="star-rating">
                  {[...Array(5)].map((_, index) => (
                    <span 
                      key={index} 
                      className={`star ${index < Math.floor(avgRating) ? "filled" : ""} 
                                  ${index === Math.floor(avgRating) && avgRating % 1 >= 0.5 ? "half-filled" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </span>
              )}
            </p>

          
          {/* Input for quantity */}
          <input
            type="number"
            value={quantity}
            min="1"
            max={product.productStorage - product.productReservation}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            {loadingAddToCart ? "Adding to Cart...":"Add to Cart"}
          </button>
          
          {/* Display the cart message */}
          {cartMessage && <p className="cart-message">{cartMessage}</p>}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
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
            <select
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
            </select>
            <button type="submit">
              {loadingSubmitReview ? "Submitting Review...":"Submit Review"}
            </button>
          </form>
        {reviewError && <p className="error-message">{reviewError}</p>}
        {reviews.length === 0 ? (
          <p>No reviews available for this product.</p>
        ) : (
          <ul className="reviews-list">
            {reviews.map((review) => (
              <li key={review.id} className="review-item">
                <div className="review-rating">
                  <strong>Rating: {review.Rating > 0 ? review.Rating : "No Rating"}</strong>
                  {review.Rating > 0 && (
                    <span className="star-rating">
                      {[...Array(5)].map((_, index) => (
                        <span 
                          key={index} 
                          className={`star ${index < review.Rating ? "filled" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                  )}
                </div>
                <p className="review-content">{review.content}</p>
              </li>
            ))}
          </ul>

        )}
      </div>
    </div>
  );
}

export default ProductDetail;
