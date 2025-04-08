import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Profile.css";

function Profile({ username, setIsLoggedIn, setUsername }) {
  const navigate = useNavigate();

  // State for user information
  const [email, setEmail] = useState(""); // Automatically retrieved email
  const [otp, setOtp] = useState(""); // OTP for password reset
  const [newPassword, setNewPassword] = useState(""); // New password
  const [showResetFields, setShowResetFields] = useState(false); // Toggle reset fields
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Handle OTP Request
  const handleRequestOtp = async () => {
    setLoading(true);
    setError(null);
    setStatusMessage("");

    try {
      await authService.requestPasswordResetOTP(email);
      setStatusMessage("OTP has been sent to your email.");
      setShowResetFields(true); // Show OTP and password fields
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage("");

    if (!otp || !newPassword) {
      setError("OTP and new password are required.");
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword(email, otp, newPassword);
      setStatusMessage("Password reset successfully! You can now log in with your new password.");
      setOtp("");
      setNewPassword("");
      setShowResetFields(false); // Hide OTP and password fields
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  return (
    <div className="profile-page-container">
      {/* Left Section */}
      <div className="profile-left">
        <div className="profile-logo">
          {/* Display the first letter of the username */}
          <span className="profile-initial">{username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="profile-username">
          <p>{username}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>

      {/* Right Section */}
      <div className="profile-right">
        <h1 className="profile-title">User Profile</h1>
        <div className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} disabled />
          </div>

          {/* Reset Password Button */}
          {!showResetFields && (
            <button
              className="request-otp-button"
              onClick={handleRequestOtp}
              disabled={loading}
            >
              {loading ? "Requesting..." : "Reset Password"}
            </button>
          )}

          {/* OTP and New Password Fields */}
          {showResetFields && (
            <>
              <p className="status-message success">OTP has been sent to your email.</p>
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label>OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="reset-password-button"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {/* Status and Error Messages */}
          {statusMessage && (
            <p className="status-message success">{statusMessage}</p>
          )}
          {error && <p className="status-message error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Profile;