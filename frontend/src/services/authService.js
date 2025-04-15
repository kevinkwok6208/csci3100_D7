// src/services/authService.js

// Use relative URL since proxy is configured in package.json
const API_BASE_URL = '/api/auth';

const authService = {
  // Login function
  async login(usernameOrEmail, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data in localStorage
      localStorage.setItem('authUser', JSON.stringify({
        username: data.username,
        isadmin: data.isadmin,
        token: data.token
      }));

      return {
        username: data.username,
        isadmin: data.isadmin,
        token: data.token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register function
  async register(username, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout function
  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }
      
      // Clear localStorage on logout
      localStorage.removeItem('authUser');
      
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Check authentication status
  async checkAuth() {
    try {
      const response = await fetch("/api/auth/check-auth", {
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to check authentication status");
      }
  
      return data;
    } catch (error) {
      console.error("Auth check error:", error);
      throw error;
    }
  },

  async verifyEmail(usernameOrEmail, otp) {
    try {
      if (!usernameOrEmail || !otp) {
        throw new Error('Username/Email and OTP are required');
      }

      const response = await fetch(`${API_BASE_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      return data;
    } catch (error) {
      console.error('OTP Verification error:', error);
      throw error;
    }
  },

  async resendEmailOTP(email) {
    const response = await fetch(`${API_BASE_URL}/resend-email-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernameOrEmail: email }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to resend OTP");
    }
  
    return response.json();
  },

  async requestPasswordResetOTP(usernameOrEmail) {
    try {
      const response = await fetch(`${API_BASE_URL}/password-update-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request OTP");
      }
  
      return response.json();
    } catch (error) {
      console.error("Request OTP error:", error);
      throw error;
    }
  },

  async resetPassword(usernameOrEmail, otp, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail, otp, newPassword }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }
  
      return response.json();
    } catch (error) {
      console.error("Reset Password error:", error);
      throw error;
    }
  },

  // Add this method to the authService object
  async authByCookie() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth-by-cookie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication by cookie failed');
      }

      // Store auth data in localStorage
      localStorage.setItem('authUser', JSON.stringify({
        username: data.username,
        isadmin: data.isadmin,
        token: data.token
      }));

      return {
        username: data.username,
        isadmin: data.isadmin,
        token: data.token,
      };
    } catch (error) {
      console.error('Cookie auth error:', error);
      throw error;
    }
  },

  // Get user from localStorage
  getStoredUser() {
    const authUser = localStorage.getItem('authUser');
    return authUser ? JSON.parse(authUser) : null;
  }
};

export default authService;
