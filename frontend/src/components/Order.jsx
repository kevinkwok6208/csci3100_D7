// src/components/Order.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../services/orderService";
import productService from "../services/productService";
import "./Order.css";
import LoadingSpinner from './LoadingSpinner';

const Order = ({ username }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortField, setSortField] = useState("Date");
  const [sortOrder, setSortOrder] = useState("Ascending");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusMessage, setStatusMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate("/auth");
    }
  }, [username, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrdersByUserId(username);
        if (data && Array.isArray(data)) {
          const sortedData = sortOrders(data, "Date", "Ascending");
          setOrders(sortedData);
          setFilteredOrders(sortedData);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchOrders();
    }
  }, [username]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productService.getAllProducts();
        if (productsData && Array.isArray(productsData.products)) {
          setAllProducts(productsData.products);
        } else {
          setAllProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err.message);
      }
    };
    fetchProducts();
  }, []);

  const sortOrders = (orders, field, order) => {
    return [...orders].sort((a, b) => {
      let comparison = 0;
      if (field === "Date") {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (field === "Price") {
        comparison = a.totalPrice - b.totalPrice;
      } else if (field === "Product") {
        const nameA = a.products[0]?.productId?.productName || "";
        const nameB = b.products[0]?.productId?.productName || "";
        comparison = nameA.localeCompare(nameB);
      }
      return order === "Ascending" ? comparison : -comparison;
    });
  };

  const handleFilter = () => {
    const query = filterInput.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      const matchesOrderId = order.orderId.toLowerCase().startsWith(query);
      const matchesProductName = order.products.some((product) => {
        const productName =
          product.productId.productName ||
          allProducts.find((p) => p._id === product.productId)?.productName;
        return productName && productName.toLowerCase().startsWith(query);
      });

      return query === "" || matchesOrderId || matchesProductName;
    });

    const filteredByStatus =
      statusFilter === "All"
        ? filtered
        : filtered.filter((order) =>
            order.products[0].status === (statusFilter === "Received")
          );

    setFilteredOrders(filteredByStatus);
  };

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "Ascending" ? "Descending" : "Ascending";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sorted = sortOrders(filteredOrders, field, newSortOrder);
    setFilteredOrders(sorted);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    const filteredByStatus =
      status === "All"
        ? orders
        : orders.filter((order) =>
            order.products[0].status === (status === "Received")
          );
    setFilteredOrders(filteredByStatus);
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, true);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.orderId === updatedOrder.orderId ? updatedOrder : order))
      );
      setFilteredOrders((prevFilteredOrders) =>
        prevFilteredOrders.map((order) =>
          order.orderId === updatedOrder.orderId ? updatedOrder : order
        )
      );
      setStatusMessage("Order status updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update order status");
      setStatusMessage("");
    }
  };

  if (loading) return <LoadingSpinner message="Loading your order history..." />;

  return (
    <div className="order-container">
      <h1 className="order-title">Order History</h1>

      {/* Filters and Sorting Section */}
      <div className="filter-sort-section">
        <div className="filter-section">
          <div className="filter-input-wrapper">
            <input
              type="text"
              placeholder="Search by Order ID or Product Name"
              value={filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
              className="filter-input"
            />
            <button onClick={handleFilter} className="filter-button">
              Search
            </button>
          </div>
        </div>
        <div className="status-filter-section">
          <button
            onClick={() => handleStatusFilter("All")}
            className={`status-filter-button ${
              statusFilter === "All" ? "active" : ""
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter("Shipped")}
            className={`status-filter-button ${
              statusFilter === "Shipped" ? "active" : ""
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => handleStatusFilter("Received")}
            className={`status-filter-button ${
              statusFilter === "Received" ? "active" : ""
            }`}
          >
            Received
          </button>
        </div>
      </div>

      {/* Order List */}
      <div className="order-list">
        {filteredOrders.length === 0 ? (
          <p className="empty-history-message">No order history available.</p>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("Date")}>
                  Date {sortField === "Date" && (sortOrder === "Ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("Product")}>
                  Product {sortField === "Product" && (sortOrder === "Ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("Price")}>
                  Total Price {sortField === "Price" && (sortOrder === "Ascending" ? "↑" : "↓")}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <ol className="product-list">
                      {order.products.map((product, index) => {
                        const productName =
                          product.productId.productName ||
                          allProducts.find((p) => p._id === product.productId)?.productName;
                        return (
                          <li key={`${order.orderId}-${index}`} className="product-list-item">
                            <span className="product-name">{productName}</span>
                            <span className="product-quantity">
                              (Quantity: {product.quantity || 1})
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                    <div className="order-id">Order ID: {order.orderId}</div>
                  </td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.products[0].status ? (
                      <span className="status-received">Received</span>
                    ) : (
                      <span className="status-shipped">Shipped</span>
                    )}
                  </td>
                  <td>
                    {!order.products[0].status && (
                      <button
                        onClick={() => handleUpdateStatus(order.orderId)}
                        className="update-status-button"
                      >
                        Update Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>
    </div>
  );
};

export default Order;