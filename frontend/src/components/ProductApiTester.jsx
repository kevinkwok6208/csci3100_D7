// src/components/ProductApiTester.jsx
import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

function ProductApiTester() {
  // State for product form inputs
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStorage, setProductStorage] = useState('');
  const [productImage, setProductImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [productReservation, setProductReservation] = useState(0);
  
  // State for response display
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Test API connectivity on component mount
  useEffect(() => {
    console.log('Testing Product API connection...');
    // Test by getting all products
    productService.getAllProducts()
      .then(data => {
        console.log('Product API test successful:', data);
        setResponse({test: 'Product API connection successful', data});
      })
      .catch(error => {
        console.error('Product API test error:', error);
        setError('Product API Test Error: ' + error.message);
      });
  }, []);

  // Helper to display JSON responses
  const displayResponse = (data) => {
    setResponse(data);
    setLoading(false);
    setError(null);
  };

  // Helper to handle errors
  const handleError = (err) => {
    setError(err.message || 'An error occurred');
    setLoading(false);
    setResponse(null);
  };

  // Get all products handler
  const handleGetAllProducts = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Get product by ID handler
  const handleGetProductById = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await productService.getProductById(productID);
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Add product handler
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        productID,
        productName,
        productDescription,
        productPrice: parseFloat(productPrice),
        productStorage: parseInt(productStorage, 10),
        productImage,
        featured,
        productReservation
      };
      const data = await productService.addProduct(productData);
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Update product handler
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {};
      if (productName) productData.productName = productName;
      if (productDescription) productData.productDescription = productDescription;
      if (productPrice) productData.productPrice = parseFloat(productPrice);
      if (productStorage) productData.productStorage = parseInt(productStorage, 10);
      if (productImage) productData.productImage = productImage;
      if (productReservation !== undefined) productData.productReservation = productReservation;
      productData.featured = featured; // Boolean can be false

      const data = await productService.updateProduct(productID, productData);
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Update price handler
  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await productService.updatePrice(productID, parseFloat(productPrice));
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Update storage handler
  const handleUpdateStorage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await productService.updateStorage(productID, parseInt(productStorage, 10));
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await productService.deleteProduct(productID);
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Clear form fields
  const handleClearForm = () => {
    setProductID('');
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductStorage('');
    setProductImage('');
    setFeatured(false);
    setProductReservation(0);
  };

  return (
    <div className="product-api-tester">
      <h1>Product API Tester</h1>
      
      {/* Test Product API Endpoint Section */}
      <div className="api-section">
        <h2>Product API Test Status</h2>
        <button onClick={handleGetAllProducts} disabled={loading}>
          Test Product API Connection
        </button>
      </div>
      
      {/* Get All Products Section */}
      <div className="api-section">
        <h2>Get All Products</h2>
        <button onClick={handleGetAllProducts} disabled={loading}>
          {loading ? 'Loading...' : 'Get All Products'}
        </button>
      </div>

      {/* Get Product By ID Section */}
      <div className="api-section">
        <h2>Get Product By ID</h2>
        <form onSubmit={handleGetProductById}>
          <div className="form-group">
            <label>Product ID:</label>
            <input 
              type="text" 
              value={productID} 
              onChange={(e) => setProductID(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Get Product'}
          </button>
        </form>
      </div>

      {/* Add Product Section */}
      <div className="api-section">
        <h2>Add New Product</h2>
        <form onSubmit={handleAddProduct}>
          <div className="form-group">
            <label>Product ID:</label>
            <input 
              type="text" 
              value={productID} 
              onChange={(e) => setProductID(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Product Name:</label>
            <input 
              type="text" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Product Description:</label>
            <textarea 
              value={productDescription} 
              onChange={(e) => setProductDescription(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Product Price:</label>
            <input 
              type="number" 
              step="0.01" 
              value={productPrice} 
              onChange={(e) => setProductPrice(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Product Storage:</label>
            <input 
              type="number" 
              value={productStorage} 
              onChange={(e) => setProductStorage(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Product Image:</label>
            <input 
              type="text" 
              value={productImage} 
              onChange={(e) => setProductImage(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Product Reservation:</label>
            <input 
              type="number" 
              value={productReservation} 
              onChange={(e) => setProductReservation(e.target.value)} 
            />
          </div>
          <div className="form-group checkbox">
            <label>
              <input 
                type="checkbox" 
                checked={featured} 
                onChange={(e) => setFeatured(e.target.checked)} 
              />
              Featured
            </label>
          </div>
          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Add Product'}
            </button>
            <button type="button" onClick={handleClearForm}>
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Update Product Section */}
      <div className="api-section">
        <h2>Update Product</h2>
        <form onSubmit={handleUpdateProduct}>
          <div className="form-group">
            <label>Product ID:</label>
            <input 
              type="text" 
              value={productID} 
              onChange={(e) => setProductID(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Product Name:</label>
            <input 
              type="text" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Product Description:</label>
            <textarea 
              value={productDescription} 
              onChange={(e) => setProductDescription(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Product Price:</label>
            <input 
              type="number" 
              step="0.01" 
              value={productPrice} 
              onChange={(e) => setProductPrice(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Product Storage:</label>
            <input 
              type="number" 
              value={productStorage} 
              onChange={(e) => setProductStorage(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Product Image:</label>
            <input 
              type="text" 
              value={productImage} 
              onChange={(e) => setProductImage(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Product Reservation:</label>
            <input 
              type="number" 
              value={productReservation} 
              onChange={(e) => setProductReservation(e.target.value)} 
            />
          </div>
          <div className="form-group checkbox">
            <label>
              <input 
                type="checkbox" 
                checked={featured} 
                onChange={(e) => setFeatured(e.target.checked)} 
              />
              Featured
            </label>
          </div>
          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Update Product'}
            </button>
            <button type="button" onClick={handleClearForm}>
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Update Price Section */}
      <div className="api-section">
        <h2>Update Price</h2>
        <form onSubmit={handleUpdatePrice}>
          <div className="form-group">
            <label>Product ID:</label>
            <input 
              type="text" 
              value={productID} 
              onChange={(e) => setProductID(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>New Product Price:</label>
            <input 
              type="number" 
              step="0.01" 
              value={productPrice} 
              onChange={(e) => setProductPrice(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Update Price'}
          </button>
        </form>
      </div>

      {/* Update Storage Section */}
      <div className="api-section">
        <h2>Update Storage</h2>
        <form onSubmit={handleUpdateStorage}>
          <div className="form-group">
            <label>Product ID:</label>
            <input 
              type="text" 
              value={productID} 
              onChange={(e) => setProductID(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>New Product Storage:</label>
            <input 
              type="number" 
              value={productStorage} 
              onChange={(e) => setProductStorage(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Update Storage'}
          </button>
        </form>
      </div>

      {/* Delete Product Section */}
      <div className="api-section">
        <h2>Delete Product</h2>
        <form onSubmit={handleDeleteProduct}>
          <div className="form-group">
            <label>Product ID:</label>
            <input 
              type="text" 
              value={productID} 
              onChange={(e) => setProductID(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="delete-button">
            {loading ? 'Loading...' : 'Delete Product'}
          </button>
        </form>
      </div>

      {/* Response Display */}
      <div className="api-section response-section">
        <h2>Response</h2>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Loading...</div>}
        {response && (
          <pre className="response-data">{JSON.stringify(response, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export default ProductApiTester;
