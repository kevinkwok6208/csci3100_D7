import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import "./ProductDetail.css";

function ProductDetail() {
  const { id: productID } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await productService.getProductById(productID);
        console.log("API Response for Product Detail:", response); // Debugging

        // Extract the product data from the response
        const productData = response.product;
        console.log("Extracted Product Data:", productData); // Debugging

        setProduct(productData); // Set the actual product data
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productID]);

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
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;