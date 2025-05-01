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
  
  // Get all categories
  getAllCategories: async () => {
    const response = await fetch('/api/categories', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get categories');
    }
    
    const data = await response.json();
    return data.categories; // Return just the categories array
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
  
  // Add a new product with image upload
  addProduct: async (productData) => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('productID', productData.productID);
    formData.append('productName', productData.productName);
    formData.append('productDescription', productData.productDescription);
    formData.append('productPrice', productData.productPrice);
    formData.append('productStorage', productData.productStorage);
    formData.append('categoryName', productData.categoryName);
    
    // Add image files
    if (productData.productImage && productData.productImage.length > 0) {
      productData.productImage.forEach(file => {
        formData.append('productImages', file); // Note: using 'productImages' to match backend
      });
    }
    
    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData, // Don't set Content-Type header - browser will set it with boundary
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add product');
    }
    
    return response.json();
  },
  
  // Update a product with image upload
  updateProduct: async (productID, productData) => {
    const formData = new FormData();
    
    // Add text fields
    if (productData.productName) formData.append('productName', productData.productName);
    if (productData.productDescription) formData.append('productDescription', productData.productDescription);
    if (productData.productPrice) formData.append('productPrice', productData.productPrice);
    if (productData.productStorage) formData.append('productStorage', productData.productStorage);
    if (productData.categoryName) formData.append('categoryName', productData.categoryName);
    if (productData.featured) formData.append('featured', productData.featured);

    // Add image files
    if (productData.productImage && productData.productImage.length > 0) {
      productData.productImage.forEach(file => {
        formData.append('productImages', file); // Note: using 'productImages' to match backend
      });
    }
    
    const response = await fetch(`/api/products/${productID}`, {
      method: 'PUT',
      body: formData, // Don't set Content-Type header
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
      body: JSON.stringify({ productPrice: price }), // Changed to match backend field name
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
    const response = await fetch(`/api/products/${productID}/storage`, { // Changed to match backend route
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productStorage: stock }), // Changed to match backend field name
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
  },

  //update category
  updateCategory: async (productID, categoryName) => {
    const response = await fetch(`/api/products/${productID}/category`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryName }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update category');
    }
    
    return response.json();
  }
};

export default productService;
