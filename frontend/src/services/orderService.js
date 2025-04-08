// src/services/orderService.js
const orderService = {
  getAllOrders: async () => {
    const response = await fetch("/api/orders", { credentials: "include" }); // Adjust the API endpoint
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch orders");
    }
    return response.json(); // Return the orders
  },
};

export default orderService;