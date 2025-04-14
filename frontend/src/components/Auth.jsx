import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Auth.css";

function Auth({ setIsLoggedIn, setUsername, setIsAdmin }) {
  const [isSignUp, setIsSignUp] = useState(false); // For toggling between login and signup
  const [username, setLocalUsername] = useState(""); // For signup
  const [email, setEmail] = useState(""); // For signup and login
  const [password, setPassword] = useState(""); // For signup and login
  const [confirmPassword, setConfirmPassword] = useState(""); // For signup
  const [otp, setOtp] = useState(""); // For email verification
  const [isRegistered, setIsRegistered] = useState(false); // Step tracking for signup verification
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error messages
  const [statusMessage, setStatusMessage] = useState(""); // Temporary success messages
  const [successMessage, setSuccessMessage] = useState(""); // Persistent success message for login form

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await authService.login(email, password);
      console.log("Login successful:", response);
  
      // Update parent state
      setIsLoggedIn(true);
      setUsername(response.username);
      setIsAdmin(response.isadmin === 1);
  
      // Store email in localStorage
      localStorage.setItem("userEmail", email);
  
      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await authService.register(username, email, password);
      setStatusMessage("Registration successful! Please verify your email.");
      setIsRegistered(true); // Proceed to OTP verification step
    } catch (err) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Verification
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage("");

    // Validate inputs
    if (!email || !otp) {
      setError("Email and OTP are required.");
      setLoading(false);
      return;
    }

    try {
      await authService.verifyEmail(email, otp);
      setStatusMessage("Email verified successfully! Redirecting to login...");
      
      // Slide back to the login form
      setIsRegistered(false); // Reset registration step
      setIsSignUp(false); // Slide back to the login form
      setSuccessMessage("Registration successful! You can now log in."); // Set persistent success message
    } catch (err) {
      setError(err.message || "An error occurred during email verification.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError(null);
    setStatusMessage("");

    try {
      await authService.resendEmailOTP(email);
      setStatusMessage("OTP has been resent to your email.");
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Form
  const toggleForm = () => {
    setIsSignUp((prevState) => !prevState);
    setError(null); // Clear errors when toggling
    setStatusMessage("");
    setSuccessMessage(""); // Clear persistent success message when toggling to signup
  };

  return (
    <div className="auth-wrapper">
      {/* Forms Container */}
      <div className={`forms-container ${isSignUp ? "sign-up-active" : ""}`}>
        {/* Login Form */}
        <div className="form login-form">
          <h2>Login</h2>
          <p>Welcome back! Login to access your account.</p>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email Or Username"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Signup Form */}
        <div className="form signup-form">
          <h2>{isRegistered ? "Verify Email" : "Sign Up"}</h2>
          {!isRegistered ? (
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                className="input-field"
                value={username}
                onChange={(e) => setLocalUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button className="auth-button" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyEmail}>
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                disabled // Email is pre-filled
              />
              <input
                type="text"
                placeholder="Enter OTP"
                className="input-field"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button className="auth-button" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </button>
              <button
                type="button"
                className="auth-button"
                onClick={handleResendOTP}
                disabled={loading}
              >
                {loading ? "Resending..." : "Resend OTP"}
              </button>
            </form>
          )}
          {statusMessage && <p className="status-message success">{statusMessage}</p>}
          {error && <p className="status-message error">{error}</p>}
        </div>
      </div>

      {/* Overlay */}
      <div className="auth-overlay">
        <div className="overlay-content">
          <h1>{isSignUp ? "Welcome Back!" : "Hello, Friend!"}</h1>
          <p>
            {isSignUp
              ? "Already have an account? Login to stay connected."
              : "Don't have an account? Sign up and join us today!"}
          </p>
          <button className="auth-button toggle-overlay" onClick={toggleForm}>
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;