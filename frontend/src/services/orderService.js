// src/services/orderService.js
const orderService = {
  // Fetch all orders for a specific user
  getOrdersByUserId: async (username) => {
    const response = await fetch(`/api/orderhistories/user/${username}`, { credentials: "include" });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch orders for user");
    }
    return response.json(); // Return the orders for the user
  },

  // Fetch a specific order by order ID
  getOrderById: async (orderId) => {
    const response = await fetch(`/api/orderhistories/order/${orderId}`, { credentials: "include" });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch order");
    }
    return response.json(); // Return the specific order
  },

  // Update the status of a specific order
  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`/api/orderhistories/order/${orderId}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update order status");
    }
    return response.json(); // Return the updated order
  },

  // Fetch orders filtered by status for a specific user
  getOrdersByStatus: async (userId, status) => {
    const response = await fetch(`/api/orderhistories/user/${userId}/status/${status}`, { credentials: "include" });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch orders by status");
    }
    return response.json(); // Return the filtered orders
  },

};

export default orderService;