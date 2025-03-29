// src/services/adminService.js
const adminService = {
    // Create a new user
    createUser: async (username, password, email, isAdmin) => {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, isAdmin }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
      
      return response.json();
    },
    
    // Delete a user
    deleteUser: async (username) => {
      const response = await fetch(`/api/admin/users/${username}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      return response.json();
    },
    
    // Get all users
    getAllUsers: async () => {
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get users');
      }
      
      return response.json();
    },
    
    // Get user information
    getUserInfo: async (username) => {
      const response = await fetch(`/api/admin/users/${username}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get user info');
      }
      
      return response.json();
    },
    
    // Update user password
    updateUserPassword: async (username, newPassword) => {
      const response = await fetch(`/api/admin/users/${username}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
      
      return response.json();
    },
    
    // Update user email
    updateUserEmail: async (username, newEmail) => {
      const response = await fetch(`/api/admin/users/${username}/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update email');
      }
      
      return response.json();
    }
  };
  
  export default adminService;
  