import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutFinish = ({ username }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the order ID from either location state or URL query parameter
  const orderId = location.state?.orderId || new URLSearchParams(location.search).get('token');
  const apiBaseUrl = 'http://localhost:5001'; // Hardcoded for simplicity

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
        // Use the orderId field instead of _id for lookup
        console.log(`Fetching order details from: ${apiBaseUrl}/api/orderhistories/order/${orderId}`);
        const response = await axios.get(`${apiBaseUrl}/api/orderhistories/order/${orderId}`);
        console.log('API response:', response.data);
        
        if (response.data.success) {
          setOrderDetails(response.data.order);
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
    navigate('/profile');
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
    <div className="checkout-finish-container">
      <div className="success-header">
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase.</p>
      </div>

      {orderDetails && (
        <div className="order-summary">
          <h2>Order Summary</h2>
          <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
          <p><strong>Date:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> ${orderDetails.totalPrice?.toFixed(2) || '0.00'}</p>
          
          <div className="order-items">
            <h3>Items Purchased</h3>
            {orderDetails.products && orderDetails.products.length > 0 ? (
              <ul>
                {orderDetails.products.map((item, index) => (
                  <li key={index}>
                    Product ID: {item.productId.toString()} - Qty: {item.quantity} - ${item.price?.toFixed(2) || '0.00'} each
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items found in this order.</p>
            )}
          </div>
          
          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <p><strong>Name:</strong> {orderDetails.Name}</p>
            <p><strong>Address:</strong> {orderDetails.ShippingAddress}</p>
          </div>
          
          <div className="payment-info">
            <h3>Payment Information</h3>
            <p><strong>Payment Method:</strong> PayPal</p>
            <p><strong>Payment Status:</strong> Completed</p>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button onClick={handleContinueShopping}>Continue Shopping</button>
        <button onClick={handleViewOrders}>View All Orders</button>
      </div>
    </div>
  );
};

export default CheckoutFinish;
