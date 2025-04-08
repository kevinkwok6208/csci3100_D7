import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import UserManagement from "./components/UserManagement";
import ProductApiTester from "./components/ProductApiTester";
import ProductManagement from "./components/ProductManagement";
import SalesAnalytics from "./components/SalesAnalytics";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Profile from "./components/Profile";
import ProductDetail from "./components/ProductDetail";
import Auth from "./components/Auth"; // Unified Login/Signup Component
import Login from "./components/Login";
import Signup from "./components/Signup";
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ReturnPolicy from "./components/ReturnPolicy";
import Reservations from "./components/Reservations";
import CheckoutFinish from './components/CheckoutFinish';
import PrivateRoute from "./components/PrivateRoute"; 
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Testing API connection...");
    fetch("/api/test")
      .then((response) => response.json())
      .then((data) => console.log("Test endpoint response:", data))
      .catch((error) => console.error("Test endpoint error:", error));
  }, []);

  const handleLogin = (user) => {
    setUsername(user.username);
    setIsLoggedIn(true);
    setIsAdmin(user.isadmin === 1);
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
            BOOK<span className="yellow-dot"></span>COM
          </Link>
          <div className="user-actions">
            <Link to="/order" className="order-history">
              Order History
            </Link>
            <Link to="/cart" className="shopping-cart">
              Shopping Cart
            </Link>
            {isLoggedIn ? (
              <Link to="/profile" className="username">
                {username}
              </Link>
            ) : (
              <Link to="/auth" className="login-button" title="Login">
                Login
              </Link>
            )}
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={<Home isLoggedIn={isLoggedIn} />}
          />
          <Route path="/product-api-tester" element={<ProductApiTester />} />
          <Route 
            path="/user-management" 
            element={<PrivateRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} element={<UserManagement />} />} 
          />
          <Route 
            path="/product-management" 
            element={<PrivateRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} element={<ProductManagement />} />} 
          />
          <Route 
            path="/sales-analytics" 
            element={<PrivateRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin} element={<SalesAnalytics />} />} 
          />
          <Route path="/cart" element={<Cart username={username} />} />
          <Route path="/order" element={<Order />} />
          <Route path="/products/:id" element={<ProductDetail username={username} />} />
          <Route path="/reservations" element={<Reservations username={username}/>} />
          <Route path="/CheckoutFinish" element={<CheckoutFinish username={username} />} />
          
          {/* Auth routes - supporting both unified and separate components */}
          <Route
            path="/auth"
            element={
              <Auth
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
                setIsAdmin={setIsAdmin}
              />
            }
          />
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
          
          {/* Additional policy pages */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
