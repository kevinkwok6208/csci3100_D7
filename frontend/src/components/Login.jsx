// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Login.css"; // Keep the existing styles

function Login({ setIsLoggedIn, setUsername, setIsAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To navigate to another page after login

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      console.log("Login successful:", response);

      // Update state in the parent component
      setIsLoggedIn(true);
      setUsername(response.username);
      setIsAdmin(response.isadmin === 1); // Check if the user is an admin

      // Redirect to the home page or other desired location
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-div">
        <h2>Welcome Back</h2>
        <p>Login to your account</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Username"
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
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="right-div">
        <p>Don't have an account?</p>
        <Link to="/signup" className="signup-button">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;