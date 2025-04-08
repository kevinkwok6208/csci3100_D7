import React, { useEffect, useState } from 'react';
import productService from "../services/productService"; // Corrected import path
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingProduct, setAddingProduct] = useState(true);
  
  const [newProduct, setNewProduct] = useState({
    productID: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productStorage: '',
    productImage: [] // Keep as is for now to avoid breaking existing code
  });

  const [addProduct, setAddProduct] = useState({
    productID: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productStorage: '',
    productImage: [] // Keep as is for now to avoid breaking existing code
  });

  const [editingProductId, setEditingProductId] = useState(null); // Track the product being edited
  const [uploadError, setUploadError] = useState(''); // State for upload error message

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
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(product => product.productID !== productId)); // Changed from product.id to product.productID
      if (editingProductId === productId) {
        setEditingProductId(null); // Reset editing state if the deleted product was being edited
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Failed to delete product.");
    }
  };

  const handleUpdate = async (productId) => {
    try {
      const response = await productService.updateProduct(productId, newProduct);
      // Update the products list with the updated product
      setProducts(products.map(product => 
        product.productID === productId ? response.product : product
      ));
      setEditingProductId(null); // Reset editing state
      setUploadError(''); // Clear any previous upload error
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message || "Failed to update product.");
    }
  };

  const handleEdit = (product) => {
    setNewProduct({
      productID: product.productID,
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: product.productPrice,
      productStorage: product.productStorage,
      productImage: [] // Reset images array since we can't edit existing images directly
    });
    setEditingProductId(product.productID); // Set the ID of the product being edited
    setUploadError(''); // Reset upload error on edit
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    let errorMessage = '';

    files.forEach(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // < 2 MB

      if (isValidType && isValidSize) {
        validFiles.push(file);
      } else {
        errorMessage = 'Invalid file format or size. Please upload JPEG, JPG, or PNG files under 2MB.';
      }
    });

    setNewProduct({ ...newProduct, productImage: validFiles });
    setUploadError(errorMessage); // Set the error message if there are invalid files
  };
 
  const handleFileChangeAdd = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    let errorMessage = '';

    files.forEach(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // < 2 MB

      if (isValidType && isValidSize) {
        validFiles.push(file);
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
      setNewProduct({ ...newProduct, productImage: updatedImages });
    }
    setUploadError(''); // Clear error message when an image is deleted
  };

  const handleAddProduct = async () => {
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
        productImage: []
      });
      setUploadError(''); // Clear any previous upload error
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message || "Failed to add product.");
    }
  };

  const handleToggleAddProduct = () => {
    setAddingProduct(prevState => !prevState); // Toggle the state
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-management-container">
      <h1>Product Management</h1>
      <button onClick={handleToggleAddProduct}>
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
        
        <label>Upload Images:</label>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChangeAdd}
        />
        <div className="image-preview">
          {Array.isArray(addProduct.productImage) && addProduct.productImage.map((image, index) => (
            <div key={index}>
              <span>{image.name}</span>
              <button onClick={() => handleDeleteImage(index, true)}>Delete</button>
            </div>
          ))}
        </div>

        {uploadError && <div className="error-message">{uploadError}</div>} {/* Error message for invalid uploads */}
        
        <button onClick={handleAddProduct}>Add Product</button>
      </div>)}

      {/* Existing Products Table */}
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.productID}>
              <td>{product.productID}</td>
              <td>{product.productName}</td>
              <td>{product.productDescription}</td>
              <td>{product.productPrice}</td>
              <td>{product.productStorage}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Update</button>
                <button onClick={() => handleDelete(product.productID)}>Delete</button>
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
          
          <label>Upload Images:</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
          />
          <div className="image-preview">
            {Array.isArray(newProduct.productImage) && newProduct.productImage.map((image, index) => (
              <div key={index}>
                <span>{image.name}</span>
                <button onClick={() => handleDeleteImage(index, false)}>Delete</button>
              </div>
            ))}
          </div>

          {uploadError && <div className="error-message">{uploadError}</div>} {/* Error message for invalid uploads */}
          
          <button onClick={() => handleUpdate(editingProductId)}>Confirm Update</button>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
