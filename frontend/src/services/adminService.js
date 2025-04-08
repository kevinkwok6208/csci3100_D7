const adminService = {
  // Create a new user
  createUser: async (username, password, email, isAdmin) => {
    const response = await fetch(`api/admin-user/create-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password, email, isadmin: isAdmin }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }

    return response.json(); // Return the created user data
  },

  // Delete a user
  deleteUser: async (username) => {
    const response = await fetch(`api/admin-user/delete-users/${username}`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }

    return response.json(); // Return the result of the deletion
  },

  // Get all users
  getAllUsers: async () => {
    const response = await fetch(`api/admin-user/get-allusers`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    return response.json(); // Return the list of users
  },

  // Get user info by username
  getUserInfo: async (username) => {
    const response = await fetch(`api/admin-user/get-userinfo/${username}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user info');
    }

    return response.json(); // Return the user info
  },

  // Update user password
  updateUserPassword: async (username, newPassword) => {
    const response = await fetch(`api/admin-user/update-userpassword/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user password');
    }

    return response.json(); // Return the result of the update
  },

  // Update user email
  updateUserEmail: async (username, newEmail) => {
    const response = await fetch(`api/admin-user/update-useremail/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ newEmail }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user email');
    }

    return response.json(); // Return the result of the update
  },
};

export default adminService;
