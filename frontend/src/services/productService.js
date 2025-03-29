
// src/services/productService.js
const productService = {
    // Get all products
    getAllProducts: async () => {
      const response = await fetch('/api/products', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get products');
      }
      
      return response.json();
    },
    
    // Get product by ID
    getProductById: async (productID) => {
      console.log('Fetching product by productID:', productID); // Debugging
      const response = await fetch(`/api/products/${productID}`, {
        credentials: 'include',
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData); // Debugging
        throw new Error(errorData.message || 'Failed to get product');
      }
    
      return response.json();
    },
    
    // Add a new product
    addProduct: async (productData) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
      
      return response.json();
    },
    
    // Update a product
    updateProduct: async (productID, productData) => {
      const response = await fetch(`/api/products/${productID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      
      return response.json();
    },
    
    // Update product price
    updatePrice: async (productID, price) => {
      const response = await fetch(`/api/products/${productID}/price`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update price');
      }
      
      return response.json();
    },
    
    // Update product stock
    updateStorage: async (productID, stock) => {
      const response = await fetch(`/api/products/${productID}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update stock');
      }
      
      return response.json();
    },
    
    // Delete a product
    deleteProduct: async (productID) => {
      const response = await fetch(`/api/products/${productID}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      return response.json();
    }
  };
  
  export default productService;
  