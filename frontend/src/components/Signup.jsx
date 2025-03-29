import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [username, setUsername] = useState(""); // For registration
  const [email, setEmail] = useState(""); // For registration and verification
  const [password, setPassword] = useState(""); // For registration
  const [confirmPassword, setConfirmPassword] = useState(""); // For confirmation
  const [otp, setOtp] = useState(""); // For email verification
  const [isRegistered, setIsRegistered] = useState(false); // Step tracking
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error messages
  const [statusMessage, setStatusMessage] = useState(""); // Success messages

  const navigate = useNavigate();

  // Handle registration
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

  // Handle email verification
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
      navigate("/login");
    } catch (err) {
      setError(err.message || "An error occurred during email verification.");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
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

  return (
    <div className="signup-page-container">
      <div className="signup-form-container">
        <h1 className="signup-title">{isRegistered ? "Verify Email" : "Sign Up"}</h1>
        {!isRegistered ? (
          <form onSubmit={handleRegister} className="signup-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmail} className="signup-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                disabled // Email is pre-filled from the registration step
              />
            </div>
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
                required
              />
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </button>
            <button
              type="button"
              className="resend-otp-button"
              onClick={handleResendOTP}
              disabled={loading}
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>
          </form>
        )}

        {/* Status or Error Messages */}
        {statusMessage && <p className="status-message success">{statusMessage}</p>}
        {error && <p className="status-message error">{error}</p>}
      </div>
    </div>
  );
}

export default Signup;