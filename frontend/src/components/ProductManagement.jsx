import React, { useRef, useEffect, useState } from 'react';
import productService from "../services/productService"; // Corrected import path
import './ProductManagement.css';
import LoadingSpinner from './LoadingSpinner';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [addFileError, setAddFileError] = useState(null);
  const [addingProduct, setAddingProduct] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [editingProductId, setEditingProductId] = useState(null); // Track the product being edited
  const [uploadError, setUploadError] = useState(''); // State for upload error message
  const [updateLoading, setUpdateLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [sortField, setSortField] = useState("productName"); // Default sort field
  const [sortOrder, setSortOrder] = useState("Ascending");
  
  const [newProduct, setNewProduct] = useState({
    productID: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productStorage: '',
    categoryName: '',
    productImage: [] // Keep as is for now to avoid breaking existing code
  });

  const [addProduct, setAddProduct] = useState({
    productID: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productStorage: '',
    categoryName: '',
    productImage: [] // Keep as is for now to avoid breaking existing code
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await productService.getAllProducts();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    }
    
    async function fetchCategories() {
      try {
        setCategoriesLoading(true);
        const response = await fetch('/api/categories');
        const data = await response.json();
        console.log('Categories data:', data); // Debug log
        
        // Extract the categories array from the response
        if (data && data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }
    
    fetchProducts();
    fetchCategories();
  }, []);

  const sortProducts = (products, field, order) => {
    return [...products].sort((a, b) => {
      let comparison = 0;
      if (field === "productName") {
        comparison = a.productName.localeCompare(b.productName);
      } else if (field === "productPrice") {
        comparison = a.productPrice - b.productPrice;
      } else if (field === "productStorage") {
        comparison = a.productStorage - b.productStorage;
      } else if (field === "categoryName") {
        const nameA = a.category ? a.category.name : "";
        const nameB = b.category ? b.category.name : "";
        comparison = nameA.localeCompare(nameB);
      }
      return order === "Ascending" ? comparison : -comparison;
    });
  };

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "Ascending" ? "Descending" : "Ascending";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedProducts = sortProducts(products, field, newSortOrder);
    setProducts(sortedProducts);
  };

  const handleDelete = async (productId) => {
    try {
      // Call the delete API
      const response = await productService.deleteProduct(productId);
      
      // Instead of filtering out the product, fetch the updated product list
      const data = await productService.getAllProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
      
      // Reset editing state if needed
      if (editingProductId === productId) {
        setEditingProductId(null);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Failed to delete product.");
    }
  };
  
  

  const handleUpdate = async (productId) => {
    setUpdateLoading(true);
    try {
      // First, check if category is being updated
      const originalProduct = products.find(p => p.productID === productId);
      const originalCategoryName = originalProduct.category ? originalProduct.category.name : '';
      
      // If category name has changed, update it using the dedicated endpoint
      if (newProduct.categoryName && newProduct.categoryName !== originalCategoryName) {
        await productService.updateCategory(productId, newProduct.categoryName);
      }
      
      // Create a copy of newProduct without categoryName for the general update
      const productDataForUpdate = { ...newProduct };
      delete productDataForUpdate.categoryName; // Remove categoryName as it's handled separately
      
      // Then update the rest of the product data
      const response = await productService.updateProduct(productId, productDataForUpdate);
      
      // Fetch the updated product to ensure we have the latest data
      const updatedProductResponse = await productService.getProductById(productId);
      const updatedProduct = updatedProductResponse.product;
      
      // Update the products list with the updated product
      setProducts(products.map(product => 
        product.productID === productId ? updatedProduct : product
      ));
      
      setEditingProductId(null); // Reset editing state
      setUploadError(''); // Clear any previous upload error
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message || "Failed to update product.");
    }
    setUpdateLoading(false);
  };

  const handleEdit = (product) => {
    setNewProduct({
      productID: product.productID,
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: product.productPrice,
      productStorage: product.productStorage,
      categoryName: product.category ? product.category.name : '',
      productImage: product.productImages || []// Reset images array since we can't edit existing images directly
    });
    setFileError(null);
    setEditingProductId(product.productID);
    setUploadError('');
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const validFiles = [];
    let errorMessage = '';
        setFileError(null);

    if (newFiles.length > 1) {
      errorMessage = 'You can only upload ONE image.';
      setFileError(errorMessage);
      fileInputRef.current.value = '';
      return;
    }

    newFiles.forEach(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // < 2 MB

      if (isValidType && isValidSize) {
        validFiles.push(file);
        console.log(file);
      } else {
        errorMessage = 'Invalid file format or size. Please upload JPEG, JPG, or PNG files under 2MB.';
      }
    });
    setNewProduct({ ...newProduct, productImage: validFiles });
    // handleUpdate(productId);
    setUploadError(errorMessage); // Set the error message if there are invalid files

  };
 
  const handleFileChangeAdd = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    let errorMessage = '';
    setAddFileError(null);

    if (files.length > 1) {
      errorMessage = 'You can only upload ONE image.';
      setAddFileError(errorMessage);
      fileInputRef.current.value = '';
      return;
    }

    files.forEach(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // < 2 MB

      if (isValidType && isValidSize) {
        validFiles.push(file);
        console.log(file);
      } else {
        errorMessage = 'Invalid file format or size. Please upload JPEG, JPG, or PNG files under 2MB.';
      }
    });

    setAddProduct({ ...addProduct, productImage: validFiles });
    setUploadError(errorMessage); // Set the error message if there are invalid files
  };

  const handleDeleteImage = (imageIndex, isAddForm = false) => {
    if (isAddForm) {
      const updatedImages = addProduct.productImage.filter((_, index) => index !== imageIndex);
      setAddProduct({ ...addProduct, productImage: updatedImages });
    } else {
      const updatedImages = newProduct.productImage.filter((_, index) => index !== imageIndex);
      console.log(updatedImages);
      setNewProduct({ ...newProduct, productImage: updatedImages});
    }
    setUploadError(''); // Clear error message when an image is deleted
  };

  useEffect(() => {
    console.log('Updated newProduct:', newProduct);
  }, [newProduct]);

  const handleAddProduct = async () => {
    setAddLoading(true);
    try {
      const response = await productService.addProduct(addProduct);
      // Add the new product to the list
      setProducts([...products, response.product]);
      // Reset the form
      setAddProduct({
        productID: '',
        productName: '',
        productDescription: '',
        productPrice: '',
        productStorage: '',
        categoryName: '',
        productImage: []
      });
      setUploadError(''); // Clear any previous upload error
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message || "Failed to add product.");
    }
    setAddLoading(false);
  };

  const handleToggleAddProduct = () => {
    setAddingProduct(prevState => !prevState); // Toggle the state
  };

  if (loading) return <LoadingSpinner message="Loading your shopping cart..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-management-container">
      <section className="spacing"></section>
      <h1>Product Management</h1>
      <button 
        className="toggle-form-button"
        onClick={handleToggleAddProduct}
      >
        {addingProduct ? 'Hide Add Product Form' : 'Show Add Product Form'}
      </button>
      
      {/* Add New Product Form */}
      {addingProduct && (<div className="add-product-form">
        <h2>Add New Product</h2>
        <label>Product ID:</label>
        <input
          type="text"
          value={addProduct.productID}
          onChange={(e) => setAddProduct({ ...addProduct, productID: e.target.value })}
        />
        <label>Product Name:</label>
        <input
          type="text"
          value={addProduct.productName}
          onChange={(e) => setAddProduct({ ...addProduct, productName: e.target.value })}
        />
        <label>Product Description:</label>
        <input
          type="text"
          value={addProduct.productDescription}
          onChange={(e) => setAddProduct({ ...addProduct, productDescription: e.target.value })}
        />
        <label>Product Price:</label>
        <input
          type="number"
          value={addProduct.productPrice}
          onChange={(e) => setAddProduct({ ...addProduct, productPrice: e.target.value })}
        />
        <label>Product Stock:</label>
        <input
          type="number"
          value={addProduct.productStorage}
          onChange={(e) => setAddProduct({ ...addProduct, productStorage: e.target.value })}
        />
        
        <label>Category:</label>
        <select
          value={addProduct.categoryName}
          onChange={(e) => setAddProduct({ ...addProduct, categoryName: e.target.value })}
        >
          <option value="">Select a category</option>
          {categories && categories.length > 0 ? (
            categories.map(category => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>
        
        <label>Upload Images:</label>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChangeAdd}
          ref={fileInputRef}
        />
        <div className="image-preview">
          {Array.isArray(addProduct.productImage) && addProduct.productImage.map((image, index) => (
            <div key={index}>
              <span>{image.name}</span>
              <button onClick={() => handleDeleteImage(index, true)}>Delete</button>
            </div>
          ))}
        {setAddFileError && <p>{addFileError}</p>}
        </div>

        {uploadError && <div className="error-message">{uploadError}</div>} {/* Error message for invalid uploads */}
        
        <button onClick={handleAddProduct}>{addLoading?"Adding...":"Add Product"}</button>
      </div>)}

      {/* Existing Products Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("productName")}>
              Name {sortField === "productName" && (
    <span className="sort-arrow">{sortOrder === "Ascending" ? "↑" : "↓"}</span>
  )}
</th>
            <th onClick={() => handleSort("productDescription")}>
              Description
            </th>
            <th onClick={() => handleSort("productPrice")}>
              Price {sortField === "productPrice" && (
    <span className="sort-arrow">{sortOrder === "Ascending" ? "↑" : "↓"}</span>
  )}
</th>
            <th onClick={() => handleSort("productStorage")}>
              Stock {sortField === "productStorage" && (
    <span className="sort-arrow">{sortOrder === "Ascending" ? "↑" : "↓"}</span>
  )}
</th>
            <th onClick={() => handleSort("categoryName")}>
              Category {sortField === "categoryName" && (
    <span className="sort-arrow">{sortOrder === "Ascending" ? "↑" : "↓"}</span>
  )}
</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productID}>
              <td>{product.productName}</td>
              <td>{product.productDescription}</td>
              <td>${product.productPrice.toFixed(2)}</td>
              <td>{product.productStorage}</td>
              <td>{product.category ? product.category.name : "None"}</td>
              <td>
                <button onClick={() => console.log("Edit", product.productID)}>
                  Update
                </button>
                <button onClick={() => console.log("Delete", product.productID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Product Form */}
      {editingProductId && (
        <div className="update-product-form">
          <h2>Update Product: {newProduct.productName}</h2>
          <label>Update Name:</label>
          <input
            type="text"
            value={newProduct.productName}
            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
          />
          <label>Update Description:</label>
          <input
            type="text"
            value={newProduct.productDescription}
            onChange={(e) => setNewProduct({ ...newProduct, productDescription: e.target.value })}
          />
          <label>Update Price:</label>
          <input
            type="number"
            value={newProduct.productPrice}
            onChange={(e) => setNewProduct({ ...newProduct, productPrice: e.target.value })}
          />
          <label>Update Stock:</label>
          <input
            type="number"
            value={newProduct.productStorage}
            onChange={(e) => setNewProduct({ ...newProduct, productStorage: e.target.value })}
          />
          
          <label>Update Category:</label>
          <select
            value={newProduct.categoryName}
            onChange={(e) => setNewProduct({ ...newProduct, categoryName: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories && categories.length > 0 ? (
              categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
          
          <label>Upload Images:</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <div className="image-preview">
            {Array.isArray(newProduct.productImage) && newProduct.productImage.map((image, index) => (
              <div key={index}>
                <p>{index}</p>
                <img src = {image} alt={image.name}/>
                <button onClick={() => handleDeleteImage(index, false)}>Delete</button>
              </div>
            ))}
            {setFileError && <p>{fileError}</p>}
          </div>

          {uploadError && <div className="error-message">{uploadError}</div>} {/* Error message for invalid uploads */}
          
          <button onClick={() => handleUpdate(editingProductId)}>{updateLoading ? "Updating...":"Confirm Update"}</button>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
