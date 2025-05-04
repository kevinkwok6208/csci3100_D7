import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService'; // Adjust the import path
import './UserManagement.css'; // Import the CSS file for styling
import LoadingSpinner from './LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // New states for changing email and password
  const [currentUser, setCurrentUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [sortField, setSortField] = useState("username"); // Default sort field
  const [sortOrder, setSortOrder] = useState("Ascending"); // Default sort order

  const sortUsers = (users, field, order) => {
    return [...users].sort((a, b) => {
      let comparison = 0;
      if (field === "username") {
        comparison = a.username.localeCompare(b.username);
      } else if (field === "email") {
        comparison = a.email.localeCompare(b.email);
      } else if (field === "isadmin") {
        comparison = a.isadmin === b.isadmin ? 0 : a.isadmin ? 1 : -1;
      }
      return order === "Ascending" ? comparison : -comparison;
    });
  };
  
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "Ascending" ? "Descending" : "Ascending";
    setSortField(field);
    setSortOrder(newSortOrder);
  
    const sortedUsers = sortUsers(users, field, newSortOrder);
    setUsers(sortedUsers);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userData = await adminService.getAllUsers();
        setUsers(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userData = await adminService.getAllUsers();
      setUsers(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser(username, password, email, isAdmin);
      clearForm();
      await fetchUsers(); // Refetch users after creating
      setSuccessMessage('User created successfully!');
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteUser = async (usernameToDelete) => {
    try {
      await adminService.deleteUser(usernameToDelete);
      await fetchUsers(); // Refetch users after deletion
      setSuccessMessage('User deleted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePassword = async () => {

    if (newPassword.length<8){
      setError("Minimum length of password: 8 characters");
      setLoading(false);
      return;
    }

    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /\d/;
    if (!letterRegex.test(newPassword) || !numberRegex.test(newPassword)) {
        setError("Password must include at least one letter and one number.");
        setLoading(false);
        return;
    }

    try {
      await adminService.updateUserPassword(currentUser, newPassword);
      setSuccessMessage('Password updated successfully!');
      clearChangeForms();
      setError("");
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeEmail = async () => {
    // Validate the new email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Adjust regex as needed for your requirements

    if (!emailRegex.test(newEmail)) {
        setError("Please enter a valid email address.");
        return;
    }

    try {
        await adminService.updateUserEmail(currentUser, newEmail);
        setSuccessMessage('Email updated successfully!');
        clearChangeForms();
        setError("");
        await fetchUsers();
    } catch (err) {
        setError(err.message);
    }
};


  const clearForm = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setIsAdmin(false);
  };

  const clearChangeForms = () => {
    setCurrentUser(null);
    setNewPassword('');
    setNewEmail('');
    setChangingPassword(false);
    setChangingEmail(false);
  };
  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    
    <div className="user-list-container">
      <h1>User Management</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleCreateUser}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="create-user-input"/>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="create-user-input"/>
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="create-user-input"/>
        </div>
        <div>
          <label>
            Is Admin:
            <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          </label>
        </div>
        <button type="submit">Create User</button>
      </form>

      {changingPassword && (
        <div className="change-password-form">
          <h2>Change Password for {currentUser}</h2>
          <p>Current Email: {users.find(user => user.username === currentUser)?.email}</p>
          <div>
            <label>New Password:</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <button onClick={handleChangePassword}>Confirm Change</button>
          <button onClick={clearChangeForms}>Cancel</button>
        </div>
      )}

      {changingEmail && (
        <div className="change-email-form">
          <h2>Change Email for {currentUser}</h2>
          <p>Current Password: (hidden for security reasons)</p>
          <div>
            <label>New Email:</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
          </div>
          <button onClick={handleChangeEmail}>Confirm Change</button>
          <button onClick={clearChangeForms}>Cancel</button>
        </div>
      )}

      {!loading && users.length > 0 && (
<table>
  <thead>
    <tr>
      <th onClick={() => handleSort("username")}>
        Username {sortField === "username" && (
          <span className="sort-arrow">{sortOrder === "Ascending" ? "↑" : "↓"}</span>
        )}
      </th>
      <th onClick={() => handleSort("email")}>
        Email {sortField === "email" && (
          <span className="sort-arrow">{sortOrder === "Ascending" ? "↑" : "↓"}</span>
        )}
      </th>
      <th onClick={() => handleSort("isadmin")}>
        Admin {sortField === "isadmin" && (
          <span className="sort-arrow">{sortOrder === "Ascending" ? "↑" : "↓"}</span>
        )}
      </th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user) => (
      <tr key={user._id}>
        <td data-label="Username">{user.username}</td>
        <td data-label="Email">{user.email}</td>
        <td data-label="Admin">{user.isadmin ? "Yes" : "No"}</td>
        <td data-label="Actions">
          <button
            onClick={() => {
              setCurrentUser(user.username);
              setChangingEmail(true);
              setChangingPassword(false);
              setNewEmail(user.email);
            }}
          >
            Change Email
          </button>
          <button
            onClick={() => {
              setCurrentUser(user.username);
              setChangingEmail(false);
              setChangingPassword(true);
            }}
          >
            Change Password
          </button>
          <button onClick={() => handleDeleteUser(user.username)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>      )}
      {!loading && users.length === 0 && <p className="no-users-message">No users found.</p>}

    </div>
  );
};

export default UserManagement;
