// src/components/Profile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Profile.css";

function Profile({ username, setIsLoggedIn, setUsername }) {
  const navigate = useNavigate();

  // State for password reset inputs
  const [email, setEmail] = useState(""); // For requesting OTP
  const [otp, setOtp] = useState(""); // For entering OTP
  const [newPassword, setNewPassword] = useState(""); // For entering new password

  // State for response display and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Helper to display messages
  const displayMessage = (message) => {
    setStatusMessage(message);
    setLoading(false);
    setError(null);
  };

  // Helper to handle errors
  const handleError = (err) => {
    setError(err.message || "An error occurred");
    setLoading(false);
    setStatusMessage("");
  };

  // Request Password Reset OTP handler
  const handleRequestPasswordResetOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage("");

    // Validate email input
    if (!email || !email.includes("@")) {
      handleError({ message: "Please enter a valid email address." });
      return;
    }

    try {
      const data = await authService.requestPasswordResetOTP(email);
      displayMessage("OTP sent to your email. Please check your inbox.");
      console.log("Request OTP Response:", data);
    } catch (err) {
      handleError(err);
    }
  };

  // Reset Password handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage("");

    // Validate inputs
    if (!email || !otp || !newPassword) {
      handleError({ message: "All fields are required for password reset." });
      return;
    }

    try {
      const data = await authService.resetPassword(email, otp, newPassword);
      displayMessage("Password reset successfully! You can now log in with your new password.");
      console.log("Reset Password Response:", data);
      // Optionally, log the user out
      handleLogout();
    } catch (err) {
      handleError(err);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <h1>User Profile</h1>

      {/* User Information */}
      <div className="profile-details">
        <p>
          <strong>Username:</strong> {username}
        </p>
      </div>

      {/* Request Password Reset OTP Form */}
      <div>
        <h2>Request Password Reset OTP</h2>
        <form onSubmit={handleRequestPasswordResetOTP}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Request OTP"}
          </button>
        </form>
      </div>

      {/* Reset Password Form */}
      <div>
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
              required
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>

      {/* Logout Button */}
      <div>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>

      {/* Response Display */}
      <div>
        {statusMessage && <p className="status-message success">{statusMessage}</p>}
        {error && <p className="status-message error">{error}</p>}
      </div>
    </div>
  );
}

export default Profile;