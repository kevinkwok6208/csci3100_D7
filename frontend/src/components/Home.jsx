import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await productService.getAllProducts();
        if (response.success) {
          setProducts(response.products);
          setFilteredProducts(response.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }
    if (minPrice) {
      filtered = filtered.filter((product) => product.productPrice >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((product) => product.productPrice <= parseFloat(maxPrice));
    }
    setFilteredProducts(filtered);
  }, [searchQuery, category, minPrice, maxPrice, products]);

  return (
    <div className="home-container">
      <h1>Products</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home-appliances">Home Appliances</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => navigate(`/products/${product.productID}`)}
          >
            <img
              src={product.productImage || "https://via.placeholder.com/150"}
              alt={product.productName}
              className="product-image"
            />
            <h2 className="product-name">{product.productName}</h2>
            <p className="product-description">{product.productDescription}</p>
            <p className="product-price">${product.productPrice.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;