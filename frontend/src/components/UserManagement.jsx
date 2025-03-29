// src/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

function UserManagement() {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  
  // State for response display
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add this test code to verify API connectivity
  useEffect(() => {
    console.log('Testing Admin API connection...');
    // We'll test by trying to get all users
    adminService.getAllUsers()
      .then(data => {
        console.log('Admin API test successful:', data);
        setResponse({test: 'Admin API connection successful', data});
      })
      .catch(error => {
        console.error('Admin API test error:', error);
        setError('Admin API Test Error: ' + error.message);
      });
  }, []);

  // Helper to display JSON responses
  const displayResponse = (data) => {
    setResponse(data);
    setLoading(false);
    setError(null);
  };

  // Helper to handle errors
  const handleError = (err) => {
    setError(err.message || 'An error occurred');
    setLoading(false);
    setResponse(null);
  };

  // Create user handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminService.createUser(username, password, email, isAdmin);
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminService.deleteUser(username);
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Get all users handler
  const handleGetAllUsers = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Get user info handler
  const handleGetUserInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminService.getUserInfo(username);
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Update user password handler
  const handleUpdateUserPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminService.updateUserPassword(username, newPassword);
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  // Update user email handler
  const handleUpdateUserEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminService.updateUserEmail(username, newEmail);
      displayResponse(data);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div>
      <h1>Admin API Tester</h1>
      
      {/* Test Admin API Endpoint Section */}
      <div>
        <h2>Admin API Test Status</h2>
        <button onClick={handleGetAllUsers} disabled={loading}>
          Test Admin API Connection
        </button>
      </div>
      
      {/* Create User Form */}
      <div>
        <h2>Create User</h2>
        <form onSubmit={handleCreateUser}>
          <div>
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>
              <input 
                type="checkbox" 
                checked={isAdmin} 
                onChange={(e) => setIsAdmin(e.target.checked)} 
              />
              Is Admin
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Create User'}
          </button>
        </form>
      </div>

      {/* Delete User Form */}
      <div>
        <h2>Delete User</h2>
        <form onSubmit={handleDeleteUser}>
          <div>
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Delete User'}
          </button>
        </form>
      </div>

      {/* Get All Users Button */}
      <div>
        <h2>Get All Users</h2>
        <button onClick={handleGetAllUsers} disabled={loading}>
          {loading ? 'Loading...' : 'Get All Users'}
        </button>
      </div>

      {/* Get User Info Form */}
      <div>
        <h2>Get User Info</h2>
        <form onSubmit={handleGetUserInfo}>
          <div>
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Get User Info'}
          </button>
        </form>
      </div>

      {/* Update User Password Form */}
      <div>
        <h2>Update User Password</h2>
        <form onSubmit={handleUpdateUserPassword}>
          <div>
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>New Password:</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Update User Email Form */}
      <div>
        <h2>Update User Email</h2>
        <form onSubmit={handleUpdateUserEmail}>
          <div>
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>New Email:</label>
            <input 
              type="email" 
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Update Email'}
          </button>
        </form>
      </div>

      {/* Response Display */}
      <div>
        <h2>Response</h2>
        {error && <div style={{color: 'red'}}>{error}</div>}
        {response && (
          <pre>{JSON.stringify(response, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
