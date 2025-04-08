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

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await productService.getProductById(productID);
        setProduct(response.product);
      } catch (err) {
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productID]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const reviewsResponse = await reviewService.getProductReviews(productID);
        setReviews(Array.isArray(reviewsResponse.reviews) ? reviewsResponse.reviews : []);
        setAvgRating(reviewsResponse.avgRating || null);
      } catch (err) {
        setReviewError(err.message || "Failed to fetch reviews");
      }
    }

    if (productID) {
      fetchReviews();
    }
  }, [productID]);

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(username, product.productID, quantity);
      alert("Product added to cart!");
    } catch (err) {
      alert(err.message || "Failed to add product to cart");
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>Product not found</p>;

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
        {/* Display Average Rating in Stars */}
        <p className="product-avg-rating">
          Average Rating: {avgRating > 0 ? <span className="stars">{generateStars(avgRating)}</span> : "No Rating"}
        </p>
        {/* Quantity Selector with Plus and Minus Buttons */}
        <div className="quantity-selector">
          <button
            className="minus-button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))} // Prevent going below 1
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            min="1"
            max={product.productStorage - product.productReservation}
            readOnly
          />
          <button
            className="plus-button"
            onClick={() =>
              setQuantity(
                Math.min(product.productStorage - product.productReservation, quantity + 1)
              ) // Prevent exceeding available stock
            }
          >
            +
          </button>
        </div>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Add to Cart
        </button>
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
                <div className="rating">{generateStars(review.Rating)}</div>
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