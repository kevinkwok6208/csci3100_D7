import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import UserManagement from "./components/UserManagement";
import ProductApiTester from "./components/ProductApiTester";
import ProductManagement from "./components/ProductApiTester";
import SalesAnalytics from "./components/SalesAnalytics";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import ProductDetail from "./components/ProductDetail";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // To track if the user is an admin

  useEffect(() => {
    console.log("Testing API connection...");
    fetch("/api/test")
      .then((response) => response.json())
      .then((data) => console.log("Test endpoint response:", data))
      .catch((error) => console.error("Test endpoint error:", error));
  }, []);

  // Function to handle login
  const handleLogin = (user) => {
    setUsername(user.username);
    setIsLoggedIn(true);
    setIsAdmin(user.isadmin === 1); // Check if the user is an admin
  };

  return (
    <Router>
      <div className="app-container">
        <header className="top-bar">
          <nav className="navigation">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/product-api-tester">Product API Tester</Link>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <Link to="/user-management">User Account Management</Link>
                  </li>
                  <li>
                    <Link to="/product-management">Product Management</Link>
                  </li>
                  <li>
                    <Link to="/sales-analytics">Sales Analytic Views</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <Link to="/" className="logo">
            SHOP.COM
          </Link>
          <div className="user-actions">
            <Link to="/order" className="icon order-history" title="Order History">
              🕒
            </Link>
            <Link to="/cart" className="icon shopping-cart" title="Shopping Cart">
              🛒
            </Link>
            {isLoggedIn ? (
              <Link to="/profile" className="username">
                {username}
              </Link>
            ) : (
              <Link to="/login" className="login-button" title="Login">
                Login
              </Link>
            )}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-api-tester" element={<ProductApiTester />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/sales-analytics" element={<SalesAnalytics/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route
            path="/login"
            element={
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setIsAdmin={setIsAdmin}
              />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <Profile
                username={username}
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
              />
            }
          />
          <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;