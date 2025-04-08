import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import cartService from '../services/cartService';
import './Cart.css';

const Cart = ({ username }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart(username);
        console.log('Cart data:', response);
        if (response.length > 0 && response[0].cart.items) {
          setCartItems(response[0].cart.items);
        } else {
          setCartItems([]);
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
    console.log('Removing product with ID:', productId);
    try {
      const updatedCart = await cartService.removeFromCart(username, productId);
      setCartItems(updatedCart.items);
    } catch (err) {
      console.error('Error removing from cart:', err);
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

  // Add this function to handle payment button click
  const handlePayment = () => {
    // Navigate to the reservation page and pass cart items as state
    navigate('/reservations', { state: { cartItems } });
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
              <td>{item.productId.productName}</td>
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
        {/* Add the Pay button */}
        <button 
          className="pay-button" 
          onClick={handlePayment}
        >
          Confirm to Pay
        </button>
      </div>
    </div>
  );
};

export default Cart;
