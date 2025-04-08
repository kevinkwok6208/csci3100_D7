import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import cartService from "../services/cartService";
import reviewService from "../services/reviewService";
import "./ProductDetail.css";

function ProductDetail({ username }) {
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
  
    try {
      if (quantity > (product.productStorage - product.productReservation)) {
        setCartMessage("Out of stock, please lower the quantity");
        return;
      }
      await cartService.addToCart(username, product.productID, quantity);
      const message = `Product ${product.productName} added to cart!`;
      setCartMessage(message);
  
      // Clear the message after 2 seconds
      setTimeout(() => {
        setCartMessage("");
      }, 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage(err.message || "Failed to add product to cart");
      
      // Clear the error message after 2 seconds
      setTimeout(() => {
        setCartMessage("");
      }, 2000);
    }
  };
  

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail-container">
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
      <div className="product-detail">
        <img
          src={product.productImage || "https://via.placeholder.com/300"}
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
            Add to Cart
          </button>
          
          {/* Display the cart message */}
          {cartMessage && <p className="cart-message">{cartMessage}</p>}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {reviewError && <p className="error-message">{reviewError}</p>}
        {reviews.length === 0 ? (
          <p>No reviews available for this product.</p>
        ) : (
          <ul className="reviews-list">
            {reviews.map((review) => (
              <li key={review.id} className="review-item">
                <p><strong>Rating: {review.Rating > 0 ? review.Rating : "No Rating"}</strong></p>
                <p>{review.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
