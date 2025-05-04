import React, { useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
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
import authService from "./services/authService";
import HowToSearch from "./components/HowToSearch";
import MakingPayment from "./components/MakingPayment";
import FAQ from "./components/FAQ"
import ContactUs from "./components/ContactUs";
import CheckoutStatus from './components/CheckoutStatus';
import "./App.css";
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [pathname]); // Trigger when the route changes

  return null; // This component doesn't render anything
};

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
  };


  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUsername(storedUser.username);
      setIsLoggedIn(true);
      setIsAdmin(storedUser.isadmin === 1);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <header className="top-bar">
          <nav className="navigation">
            <ul>
              <li>
                <Link to="/" className="home-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 495.398 495.398"
                  fill="currentColor"
                  width="32"
                  height="32"
                >
                  <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391 v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158 c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747 c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z"></path> <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401 c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79 c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z"></path>                </svg>
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="contact-us-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="34"
                  height="34"
                >
                  <path d="M22,5V9L12,13,2,9V5A1,1,0,0,1,3,4H21A1,1,0,0,1,22,5ZM2,11.154V19a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V11.154l-10,4Z"/>
                  </svg>
                </Link>
              </li>
              {isAdmin && isLoggedIn && (
                <>
                  <li>
                    <Link to="/user-management" className="user-management-button">
                    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -5 100 100"
                  fill="currentColor"
                  width="100"
                  height="100"
                >
                  <path d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 45 22.007 c 8.899 0 16.14 7.241 16.14 16.14 c 0 8.9 -7.241 16.14 -16.14 16.14 c -8.9 0 -16.14 -7.24 -16.14 -16.14 C 28.86 29.248 36.1 22.007 45 22.007 z M 45 83.843 c -11.135 0 -21.123 -4.885 -27.957 -12.623 c 3.177 -5.75 8.144 -10.476 14.05 -13.341 c 2.009 -0.974 4.354 -0.958 6.435 0.041 c 2.343 1.126 4.857 1.696 7.473 1.696 c 2.615 0 5.13 -0.571 7.473 -1.696 c 2.083 -1 4.428 -1.015 6.435 -0.041 c 5.906 2.864 10.872 7.591 14.049 13.341 C 66.123 78.957 56.135 83.843 45 83.843 z" ></path> 
                  </svg>
                  </Link>
                  </li>
                  <li>
                    <Link to="/product-management" className="product-management-button">
                    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 90 90"
                  fill="currentColor"
                  width="100"
                  height="100"
                >
                  <path d="M 88.401 29.674 l -42 -22.196 c -0.876 -0.464 -1.926 -0.464 -2.803 0 l -42 22.196 c -1.219 0.644 -1.842 2.036 -1.51 3.375 C 0.42 34.387 1.621 35.327 3 35.327 h 6.292 v 44.542 c 0 1.657 1.343 3 3 3 h 65.417 c 1.657 0 3 -1.343 3 -3 V 35.327 H 87 c 1.379 0 2.58 -0.94 2.912 -2.278 C 90.244 31.71 89.621 30.318 88.401 29.674 z M 42.095 71.574 l -16 -7.695 V 48.015 l 16 7.695 V 71.574 z M 30 43.307 l 15 -7.214 l 15 7.214 l -15 7.214 L 30 43.307 z M 63.905 63.879 l -16 7.695 V 55.71 l 16 -7.695 V 63.879 z" ></path> 
                  </svg>
                  </Link>
                  </li>
                  <li>
                    <Link to="/sales-analytics" className="sales-analytics-button">
                    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-3 -3 104 104"
                  fill="currentColor"
                  width="100"
                  height="100"
                >
                  <path d="M 77.403 0 H 12.597 C 5.651 0 0 5.651 0 12.597 v 64.807 C 0 84.35 5.651 90 12.597 90 h 64.807 C 84.35 90 90 84.35 90 77.403 V 12.597 C 90 5.651 84.35 0 77.403 0 z M 31.429 68.429 c 0 2.209 -1.791 4 -4 4 s -4 -1.791 -4 -4 v -11.8 c 0 -2.209 1.791 -4 4 -4 s 4 1.791 4 4 V 68.429 z M 49 68.429 c 0 2.209 -1.791 4 -4 4 s -4 -1.791 -4 -4 V 45 c 0 -2.209 1.791 -4 4 -4 s 4 1.791 4 4 V 68.429 z M 66.571 68.429 c 0 2.209 -1.791 4 -4 4 s -4 -1.791 -4 -4 V 21.571 c 0 -2.209 1.791 -4 4 -4 s 4 1.791 4 4 V 68.429 z" ></path> 
                  </svg>
                  </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <Link to="/" className="logo">
            BOOK<span className="yellow-dot"></span>COM
          </Link>
          <div className="user-actions">
           {/* Order History Button with Paper Icon */}
           <Link to="/order" className="order-history" title="Order History">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
              >
              <path d="M88.6,40h45.2c8.3,0,15-6.7,15-15v0c0-8.3-6.7-15-15-15H88.6c-8.3,0-15,6.7-15,15v0 C73.6,33.3,80.3,40,88.6,40z M74.1,175.3h25.4c1.5-10.9,5.4-21.1,11-30H74.1c-4.2,0-7.5-3.4-7.5-7.6c0-4.2,3.4-7.6,7.5-7.6h49 c13.6-12.7,31.9-20.5,52-20.5c9.3,0,18.1,1.6,26.3,4.7V47.8c0-12.5-9.7-22.9-22.1-22.9H164v0.4c0,16.6-13.1,29.6-29.7,29.6H89.1 c-16.6,0-30.4-13-30.4-29.6v-0.4H44c-12.5,0-23,10.5-23,22.9v150.4c0,12.5,10.6,22.1,23,22.1h62.8c-4.6-9.1-7.4-19.3-8-30H74.1 c-4.2,0-7.5-3.3-7.5-7.5S69.9,175.3,74.1,175.3z M74.1,85h75.2c4.2,0,7.5,3.4,7.5,7.6c0,4.2-3.4,7.6-7.5,7.6H74.1 c-4.2,0-7.5-3.4-7.5-7.6C66.6,88.4,69.9,85,74.1,85z M174.7,125.3c-33.3,0-60.4,27-60.4,60.4c0,33.3,27,60.4,60.4,60.4 c33.3,0,60.4-27,60.4-60.4C235,152.3,208,125.3,174.7,125.3z M198.7,209.6c-2.9,2.9-7.7,2.9-10.7,0l-18.5-18.5 c-0.6-0.5-1.1-1.2-1.5-1.9c-0.7-1.1-1-2.4-1-3.7v0v-37.7c0-4.2,3.3-7.6,7.5-7.6c4.2,0,7.5,3.4,7.5,7.6v34.6l16.5,16.5 C201.6,201.9,201.7,206.7,198.7,209.6z"/>
              </svg>
            </Link>

            {/* Shopping Cart Button */}
            <Link to="/cart" className="shopping-cart" title="Shopping Cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
              <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
             </svg>
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

      {/* Dropdown Trigger */}
      <button className="dropdown-trigger" onClick={toggleDropdown}>
        Menu
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="dropdown">
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <Link to="/profile">Profile</Link>
          ) : (
            <Link to="/auth">Login/Sign up</Link>
          )}
          {isLoggedIn && (
            <Link to="/order">Order History</Link>)
          }
          {isLoggedIn && (
            <Link to="/cart">Shopping Cart</Link>)
          }
          {isAdmin && isLoggedIn && (
            <Link to="/user-management">User Management</Link>)
          }
          {isAdmin && isLoggedIn && (
            <Link to="/product-management">Product Management</Link>)
          }
          {isAdmin && isLoggedIn && (
            <Link to="/sales-analytics">Sales Analytics</Link>)
          }
          <Link to="/contact-us">Contact Us</Link>
        </div>
      )}
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
          <Route path="/cart" element={<Cart username={username}/>} />
          <Route path="/order" element={<Order username={username}/>} />
          <Route path="/products/:id" element={<ProductDetail username={username} />} />
          <Route path="/reservations" element={<Reservations username={username}/>} />
          <Route path="/CheckoutFinish" element={<CheckoutFinish username={username} />} />
          <Route path="/checkout-status" element={<CheckoutStatus />} />
          
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
          <Route path="/how-to-search" element={<HowToSearch />} />
          <Route path="/making-payment" element={<MakingPayment />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
