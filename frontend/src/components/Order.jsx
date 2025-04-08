// src/components/Order.jsx
import React, { useState, useEffect } from "react";
import orderService from "../services/orderService"; // Service to fetch orders
import productService from "../services/productService"; // Service to fetch orders
import "./Order.css";

const Order = (username) => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  //const [username, setUsername] = useState(null); // State for userId
  const [token, setToken] = useState(null); // State for token
  const [allProducts, setAllProducts] = useState([]);
  const [filterId, setFilterId] = useState(""); // State for filter input
  const [filteredOrder, setFilteredOrder] = useState(null); // State for filtered order
  const [statusMessage, setStatusMessage] = useState(""); // State for status
  const [currentStatusFilter, setCurrentStatusFilter] = useState("All"); // State for status filter

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const userData = JSON.parse(storedUser);
  //     console.log("User data from local storage:", userData);
  //     setUsername(userData.username); // Set username
  //     setToken(userData.token); // Set token
  //   } else {
  //     console.error("No user data found in local storage");
  //   }
  // }, []);

  useEffect(() => {
    console.log("Username before API call:", username.username);
    console.log("Username:", username); // Log username for debugging
    console.log("Token:", token); // Log token for debugging

    // Ensure username and token are defined
    if (username.username ) {
      const fetchOrders = async () => {
          try {
              const data = await orderService.getOrdersByUserId(username.username);
              console.log("Fetched orders:", data);
              //console.log("Check order status:", data.productId)
              setOrders(data);
          } catch (err) {
              console.error("Error fetching orders:", err.message);
              setError(err.message || "Failed to fetch orders");
          } finally {
              setLoading(false);
          }
      };

      fetchOrders(); // Call fetch function
  } else {
      setLoading(false); // Stop loading if username/token are not set
  }
}, [username.username]);

useEffect(() => {
  const fetchProducts = async () => {
    
      try {
          const productsData = await productService.getAllProducts();
          console.log("Fetched products:", productsData); // Debugging
          console.log("Check Products:", productsData.products)

          // Ensure productsData contains a valid products array
          if (productsData && Array.isArray(productsData.products)) {
              //setAllProducts(productsData.products); // Store all products
              setAllProducts(productsData.products); // Store all products

          } else {
              console.error("Fetched productsData.products is not an array:", productsData.products);
              setAllProducts([]); // Fallback to empty array
          }
      } catch (err) {
          console.error("Error fetching products:", err.message);
      }
  
  };
  fetchProducts();

}, []);

const handleFilter = async () => {
  if (!filterId.trim()) {
    setError("Please enter a valid Order ID."); // Set an error message
    return; // Exit the function if the input is empty
  }
  try {
    const order = await orderService.getOrderById(filterId);
    if (!order) {
      setError("Order not found."); // Set error if order is not found
      setFilteredOrder(null); // Reset filtered order
      return; // Exit the function
    }
    setFilteredOrder(order); // Set the filtered order
    setError(null); // Reset error state
  } catch (err) {
    setError(err.message || "Failed to fetch order");
    setFilteredOrder(null); // Reset filtered order on error
  }
};
const handleUpdateStatus = async (orderId) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(orderId, true); // Set status to true
    
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.orderId === updatedOrder.orderId ? updatedOrder : order))
    );
    setStatusMessage("Order status updated successfully!");
    console.log('Order Staus:', updatedOrder.products);
    console.log('Order Staus:', updatedOrder.products[0].status); 

    // Update the filtered order if it matches the updated order
    if (filteredOrder && filteredOrder.orderId === updatedOrder.orderId) {
      setFilteredOrder(updatedOrder); // Update filtered order with the new status
      setOrders(updatedOrder);
    }
    setStatusMessage("Order status updated successfully!");
    console.log('Updated Order:', updatedOrder);
    console.log('Updated Order Order', orders);
    //console.log('Updated Order Advanced', orders.products[0].productId._id);
    
  } catch (err) {
    setError(err.message || "Failed to update order status");
    setStatusMessage(""); // Clear status message on error
  }
};

const toggleStatusFilter = () => {
  setCurrentStatusFilter((prev) => (prev === "Received" ? "Shipping" : "Received"));
};

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="error-popup">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const closePopup = () => {
  setError(null); // Close the pop-up
};

const filteredOrders = currentStatusFilter === "All"
  ? orders
  : orders.filter(order => order.products[0].status === (currentStatusFilter === "Received"));

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (orders.length === 0) return <p>No orders found</p>;

  return (
    <div className="order-container">
      <h1>Order History</h1>
      {/* Status Filter Button */}
      <button onClick={toggleStatusFilter}>
        {currentStatusFilter === "Received" ? "Show Shipping" : "Show Received"}
      </button>
      {/* Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
        />
        <button onClick={handleFilter}
                disabled={!filterId.trim()}>Get Order</button>
      </div>
      {error && <ErrorPopup message={error} onClose={closePopup} />} {/* Display error pop-up */}
      {filteredOrder ? (
        <div className="filtered-order">
          <h2>Filtered Order Details</h2>
          <p>Order ID: {filteredOrder.orderId}</p>
          <p>User ID: {filteredOrder.userId}</p>
          <p>Total Price: ${filteredOrder.totalPrice.toFixed(2)}</p>
          <p>Shipping Status: {filteredOrder.products[0].status? 'Received' : 'Shipping'}</p>
          <p>Order Date: {new Date(filteredOrder.createdAt).toLocaleString()}</p>
          <h3>Products:</h3>
          <ul>
            {filteredOrder.products.map((product, productIndex) => {
              const productId = filteredOrder.products[0].productId._id || filteredOrder.products[0].productId;
              const foundProduct = allProducts.find(p => p._id === productId);
              console.log("Filter Order:",filteredOrder ? 'Received' : 'Shipping');
              console.log('Check status:', filteredOrder.products[0].status)
              return (
                <li key={`${filteredOrder.orderId}-${productIndex}`}>
                  Product Name: {foundProduct.productName} - Quantity: {product.quantity || 1}
                </li>
              );
            })}
          </ul>
          {filteredOrder.products[0].status === false && ( // Hide button when status is true
            <div className="status-update">
              <button onClick={() => handleUpdateStatus(filteredOrder.orderId)}>Update Status</button>
            </div>
          )}
          
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
      ) : (
      <div className="order-list">
        {
        orders.filter(order => {
          if (currentStatusFilter === "All") return true; // Show all orders
          return order.products[0].status === (currentStatusFilter === "Received"); // Filter by status
        }).
        // orders.map((order) => (
        map((order) => (
          <div key={order.orderId} className="order-card">
            {/* Order details */}
            <h2>Order ID: {order.orderId}</h2>
            <p>User ID: {order.userId}</p>
            <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
            <p>Shipping Status: {order.products[0].status ? 'Received' : 'Shipping'}</p>
            <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>

            {/* List of products */}
            <h3>Products:</h3>
            <ul>  
            {order.products.map((product, productIndex) => {  
              const productId = order.products[0].productId._id || order.products[0].productId;
              const foundProduct = allProducts.find(p => p._id === productId);
              //console.log('Check product Status:',order.products[0].productId._id);
              console.log('Check All Product productID:',allProducts[0].productID);
              console.log('Check All Product ._id:',allProducts[0]._id);
              console.log('Check All Product:',allProducts);
              console.log('Check Found Product:',foundProduct);
              console.log('Check Order .products[0].productId', order.products[0].productId._id);
              console.log('Check Order', order);
              
              return (
                <li key={`${order.orderId}-${productIndex}`}>
                  Product Name: {foundProduct.productName} - Quantity: {product.quantity || 1}
                  {/* Product Name: {order.products[0].productId.productName} - Quantity: ${product.quantity || 1} */}
                  {/* Show button for each product if the order status is false   .products[0].productId.productName */}
                  {product.status === false && (
                    <div className="status-update">
                      <button onClick={() => handleUpdateStatus(order.orderId)}>Update Status</button>
                    </div>
                  )}
                </li>
              );
        })}
            </ul>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default Order;
