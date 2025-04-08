// src/components/Cart.jsx
import React, { useEffect, useState } from 'react';
import cartService from '../services/cartService';
// import productService from "../services/productService";
import './Cart.css'; // Import CSS for styling

const Cart = ({ username }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart(username);
        console.log('Cart data:', response); // Log the response data
        if (response.length > 0 && response[0].cart.items) {
          setCartItems(response[0].cart.items); // Set cart items from the first element
        } else {
          setCartItems([]); // Set to empty array if items are not present
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [username]);

  const handleRemove = async (productId) => {
    console.log('Removing product with ID:', productId); // Log the product ID
    try {
      const updatedCart = await cartService.removeFromCart(username, productId);
      setCartItems(updatedCart.items);
    } catch (err) {
      console.error('Error removing from cart:', err); // Log the error
      setError(err.message);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const updatedCart = await cartService.updateCart(username, productId, quantity);
      setCartItems(updatedCart.items);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!cartItems.length) return <p>Your cart is empty.</p>;

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item._id}>
              <td>{item.productId.productName}</td> {/* Display product ID for now */}
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleUpdateQuantity(item.productId.$oid, e.target.value)}
                />
              </td>
              <td>${(item.productPrice).toFixed(2)}</td>
              <td>
                <button onClick={() => handleRemove(item.productId.$oid)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-total">
        <h2>
          Total: $
          {cartItems.reduce((total, item) => total + item.productPrice, 0).toFixed(2)}
        </h2>
      </div>
    </div>
  );
};

export default Cart;
