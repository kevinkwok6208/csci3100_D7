// src/components/Order.jsx
import React, { useState, useEffect } from "react";
import orderService from "../services/orderService"; // Service to fetch orders
import "./Order.css";

function Order() {
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch orders on component mount
  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await orderService.getAllOrders(); // Fetch all orders
        console.log("Fetched orders:", data);
        setOrders(data); // Set the fetched orders
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (orders.length === 0) return <p>No orders found</p>;

  return (
    <div className="order-container">
      <h1>Order History</h1>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.orderId} className="order-card">
            {/* Order details */}
            <h2>Order ID: {order.orderId}</h2>
            <p>User ID: {order.userId}</p>
            <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
            <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>

            {/* List of products */}
            <h3>Products:</h3>
            <ul>
              {order.products.map((product, index) => (
                <li key={index}>
                  {product.productName || `Product ${index + 1}`} - Quantity:{" "}
                  {product.quantity || 1}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Order;
