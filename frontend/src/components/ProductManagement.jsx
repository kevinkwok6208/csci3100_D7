import React, { useEffect, useState } from 'react';
import productService from "../services/productService"; // Corrected import path
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newProduct, setNewProduct] = useState({
    productID: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productStorage: ''
  });

  const [editingProductId, setEditingProductId] = useState(null); // Track the product being edited

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
      setProducts(products.filter(product => product.id !== productId));
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
      await productService.updateProduct(productId, newProduct);
      setProducts(products.map(product => 
        product.productID === productId ? { ...product, ...newProduct } : product
      ));
      setEditingProductId(null); // Reset editing state
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
      productStorage: product.productStorage
    });
    setEditingProductId(product.productID); // Set the ID of the product being edited
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-management-container">
      <h1>Product Management</h1>
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
            <tr key={product.id}>
              <td>{product.productID}</td>
              <td>{product.productName}</td>
              <td>{product.productDescription}</td>
              <td>{product.productPrice}</td>
              <td>{product.productStorage}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProductId && (
        <div className="update-dropdown">
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
          <button onClick={() => handleUpdate(editingProductId)}>Confirm Update</button>
          <button className="delete-button" onClick={() => handleDelete(editingProductId)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
