// src/services/cartService.js

const cartService = {
    // Add a product to the cart
    addToCart: async (username, productId, quantity) => {
      const response = await fetch('/api/cart/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, productId, quantity }),
        credentials: 'include', // Include credentials for cookie-based authentication
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }
  
      return response.json(); // Return the updated cart data
    },
  
    // Get the user's cart
    getCart: async (username) => {
      const response = await fetch(`/api/cart/get-cart/${username}`, {
        credentials: 'include', // Include credentials for cookie-based authentication
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cart');
      }
  
      return response.json(); // Return the cart data
    },
  
    // Remove a product from the cart
    removeFromCart: async (username, productId) => {
      const response = await fetch(`/api/cart/remove-from-cart/${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }), // Send productId in the body
        credentials: 'include', // Include credentials for cookie-based authentication
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove from cart');
      }
  
      return response.json(); // Return updated cart data
    },
  
    // Update the quantity of a product in the cart
    updateCart: async (username, productId, quantity) => {
      const response = await fetch(`/api/cart/update-cart/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
        credentials: 'include', // Include credentials for cookie-based authentication
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart');
      }
  
      return response.json(); // Return updated cart data
    },
  };
  
  export default cartService;
  