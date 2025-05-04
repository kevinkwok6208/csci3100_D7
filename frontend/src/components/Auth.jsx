import React, { useState, useRef } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false); // Toggle forget password form
  const [newPassword, setNewPassword] = useState(""); // New password for reset
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // Confirm new password
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle visibility of new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle visibility of confirm password

  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  // Function to toggle password visibility for New Password
  const toggleNewPasswordVisibility = (e) => {
    e.preventDefault();
    setShowNewPassword((prev) => !prev);
  };

  // Function to toggle password visibility for Confirm New Password
  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault();
    setShowConfirmPassword((prev) => !prev);
  };
  
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

    if (password.length < 8) {
      setError("Minimum length of password: 8 characters");
      setLoading(false);
      return;
    }

    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /\d/;
    if (!letterRegex.test(password) || !numberRegex.test(password)) {
        setError("Password must include at least one letter and one number.");
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
  // Handle Request OTP for Forget Password
  const handleRequestForgetPasswordOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage("");
  
    try {
      await authService.requestPasswordResetOTP(email); // Call backend to request OTP
      setStatusMessage("OTP has been sent to your email."); // Notify user
      setOtpRequested(true); // Show OTP and password fields
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage("");

    // Validate inputs
    if (!otp || !newPassword) {
      setError("OTP and new password are required.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword(email, otp, newPassword); // Backend call to reset password
      setStatusMessage("Password reset successfully! You can now log in.");
      setShowForgetPassword(false); // Hide forget password form
      setNewPassword("");
      setConfirmNewPassword("");
      setOtp("");
    } catch (err) {
      setError(err.message || "Failed to reset password.");
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

  const toggleForgetPassword = () => {
    setShowForgetPassword((prev) => !prev);
    setError(null);
    setStatusMessage("");
  };

  return (
    <div className="auth-wrapper">
      {/* Forms Container */}
      <div className={`forms-container ${isSignUp ? "sign-up-active" : ""}`}>
        {/* Login Form */}
        {!showForgetPassword && (
          <div className="form login-form">
            <h2>Login</h2>
            <p>Welcome back! Login to access your account.</p>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
              </div>
              <button className="auth-button" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                className="toggle-link"
                onClick={toggleForgetPassword}
              >
                Forgot Password?
              </button>
            </form>
            {statusMessage && <p className="status-message success">{statusMessage}</p>}
            {error && <p className="status-message error">{error}</p>}
          </div>
        )}

        {/* Forget Password Form */}
        {showForgetPassword && (
          <div className="form forget-password-form">
          <h2>Forgot Password</h2>
          <p>
            {otpRequested
              ? "Enter the OTP sent to your email and reset your password."
              : "Enter your email to reset your password."}
          </p>

          {/* Forget Password Form */}
          <form onSubmit={otpRequested ? handleResetPassword : handleRequestForgetPasswordOTP}>
            {/* Email Input (always visible) */}
            <input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={otpRequested} // Disable email input after OTP is sent
            />

            {/* OTP Input Field (visible only after OTP is requested) */}
            {otpRequested && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            )}

            {/* New Password Field with Eye Button */}
        {otpRequested && (
          <div className="input-group">
            <input
              type={showNewPassword ? "text" : "password"} // Toggle field type
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggleNewPasswordVisibility}
              tabIndex="-1"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              <i className={showNewPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </button>
          </div>
        )}

        {/* Confirm New Password Field with Eye Button */}
        {otpRequested && (
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"} // Toggle field type
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggleConfirmPasswordVisibility}
              tabIndex="-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
            </button>
          </div>
        )}

            {/* Submit Button */}
            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? otpRequested
                  ? "Resetting..."
                  : "Requesting..."
                : otpRequested
                ? "Reset Password"
                : "Send OTP"}
            </button>
          </form>

          {/* Back to Login Link */}
          <button
            type="button"
            className="toggle-link"
            onClick={toggleForgetPassword}
          >
            Back to Login
          </button>

          {/* Status and Error Messages */}
          {statusMessage && <p className="status-message success">{statusMessage}</p>}
          {error && <p className="status-message error">{error}</p>}
        </div>
        )}

        {/* Signup Form */}
        <div className="form signup-form">
          <h2>{isRegistered ? "Verify Email" : "Sign Up"}</h2>
          {!isRegistered ? (
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setLocalUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    togglePasswordVisibility(e);
                  }}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                </button>
              </div>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  className="input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    togglePasswordVisibility(e);
                  }}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                </button>
              </div>
              <button className="auth-button" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyEmail}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                disabled // Email is pre-filled
              />
              <input
                type="text"
                placeholder="Enter OTP"
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

