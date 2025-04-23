import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import productService from '../services/productService'; // Import productService
import './CheckoutFinish.css';
import StepIndicator from './StepIndicator';

const CheckoutFinish = ({ username }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]); // Add state for all products
  
  // Get the order ID from either location state, URL query parameter, or PayPal token
  const orderId = location.state?.orderId || 
                  new URLSearchParams(location.search).get('orderId') || 
                  new URLSearchParams(location.search).get('token');
                  

  // Fetch all products for name lookup
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productService.getAllProducts();
        if (productsData && Array.isArray(productsData.products)) {
          setAllProducts(productsData.products);
          console.log('Fetched all products for name lookup:', productsData.products.length);
        } else {
          console.error("Fetched productsData.products is not an array:", productsData);
          setAllProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setAllProducts([]);
      }
    };
    
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('URL search params:', location.search);
    console.log('Extracted order ID:', orderId);
    
    // First check if we have order details in location state
    if (location.state?.orderDetails) {
      console.log('Using order details from location state');
      setOrderDetails(location.state.orderDetails);
      setLoading(false);
      return;
    }
    
    // If not, fetch order details from API using the correct endpoint
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID found. Please check your order history.');
        setLoading(false);
        return;
      }

      try {
        // Try multiple endpoints to find the order
        console.log(`Attempting to fetch order details with ID: ${orderId}`);
        
        // First try the orderhistories endpoint
        let response;
        try {
          console.log(`Trying: /api/orderhistories/order/${orderId}`);
          response = await axios.get(`/api/orderhistories/order/${orderId}`);
        } catch (err) {
          console.log('First endpoint failed, trying alternative...');
          // If that fails, try the orders endpoint
          console.log(`Trying: /api/orders/${orderId}`);
          response = await axios.get(`/api/orders/${orderId}`);
        }
        
        console.log('API response:', response.data);
        
        if (response.data.success || response.data.order || response.data._id) {
          // Handle different response formats
          const orderData = response.data.order || response.data;
          setOrderDetails(orderData);
          console.log('Successfully set order details:', orderData);
        } else {
          setError(response.data.message || 'Failed to load order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        // More detailed error message
        let errorMessage = 'An error occurred while loading your order details.';
        if (err.response) {
          errorMessage += ` Server responded with: ${err.response.status}`;
          if (err.response.data && err.response.data.message) {
            errorMessage += ` - ${err.response.data.message}`;
          }
        } else if (err.request) {
          errorMessage += ' No response received from server. Please check your connection.';
        } else {
          errorMessage += ` Error: ${err.message}`;
        }
        setError(errorMessage);
        
        // Try to get order from orderService as a last resort
        try {
          console.log('Attempting to use orderService as fallback');
          const orderService = require('../services/orderService').default;
          const order = await orderService.getOrderById(orderId);
          if (order) {
            console.log('Successfully retrieved order via orderService:', order);
            setOrderDetails(order);
            setError(null);
          }
        } catch (serviceErr) {
          console.error('orderService fallback also failed:', serviceErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.state, orderId]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/order');
  };

  // Function to get product name
  const getProductName = (product) => {
    // First try to get product name directly from the product object
    if (typeof product.productId === 'object' && product.productId.productName) {
      return product.productId.productName;
    }
    
    // If not available, try to find it in allProducts
    const productId = typeof product.productId === 'object' ? product.productId._id : product.productId;
    const foundProduct = allProducts.find(p => p._id === productId);
    
    if (foundProduct) {
      return foundProduct.productName;
    }
    
    // Fallback
    return 'Product Name Not Available';
  };

  if (loading) {
    return (
      <div className="checkout-finish-container">
        <h2>Loading your order details...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-finish-container">
        <h2>Something went wrong</h2>
        <p className="error-message">{error}</p>
        <button onClick={handleContinueShopping}>Return to Home Page</button>
      </div>
    );
  }

  return (
    <>
      <StepIndicator currentStep={3} />
      <div className="checkout-finish-container">
      <div className="success-header">
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase.</p>
      </div>

      {orderDetails && (
        <div className="order-summary">
          <h2>Order Summary</h2>
          <p><strong>Order ID:</strong> {orderDetails.orderId || orderDetails._id}</p>
          <p><strong>Date:</strong> {new Date(orderDetails.createdAt).toISOString()}</p>

          {/* Items Purchased Table */}
          <div className="order-items">
            <h3>Items Purchased</h3>
            {orderDetails.products && orderDetails.products.length > 0 ? (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price (Each)</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.products.map((item, index) => (
                    <tr key={index}>
                      <td>{getProductName(item)}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price?.toFixed(2) || '0.00'}</td>
                      <td>${(item.quantity * (item.price || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No items found in this order.</p>
            )}
          </div>

          <p><strong>Total Amount:</strong> ${orderDetails.totalPrice?.toFixed(2) || '0.00'}</p>

          {/* Shipping and Payment Information Side-by-Side */}
          <div className="info-sections">
            {/* Shipping Information */}
            <div className="shipping-info">
              <h3>Shipping Information</h3>
              <p><strong>Name:</strong> {orderDetails.Name || username || 'Not available'}</p>
              <p><strong>Address:</strong> {orderDetails.ShippingAddress || 'Not available'}</p>
            </div>

            {/* Payment Information */}
            <div className="payment-info">
              <h3>Payment Information</h3>
              <p><strong>Payment Method:</strong> PayPal</p>
              <p><strong>Payment Status:</strong> Completed</p>
            </div>
          </div>
        </div>
      )}
      <div className="action-buttons">
        <button onClick={handleContinueShopping}>Continue Shopping</button>
        <button onClick={handleViewOrders}>View All Orders</button>
      </div>
    </div>
  </>
  );
};

export default CheckoutFinish;
