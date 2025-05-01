import React, { useEffect, useState } from "react";
import cartService from "../services/cartService";
import productService from "../services/productService";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import StepIndicator from './StepIndicator';
import LoadingSpinner from './LoadingSpinner';

const Cart = ({ username }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productStocks, setProductStocks] = useState({});
  const [productPrice, setProductPrice] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedSubtotal, setSelectedSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate("/auth");
    }
  }, [username, navigate]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart(username);
        if (response.length > 0 && response[0].cart.items) {
          setCartItems(response[0].cart.items);
          setSubtotal(response[0].subtotal);
          await fetchProductStocks(response[0].cart.items);
          await fetchProductPrice(response[0].cart.items);

          const initialSelectedState = {};
          response[0].cart.items.forEach(
            (item) => (initialSelectedState[item.productId.productID] = false)
          );
          setSelectedItems(initialSelectedState);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [username]);

  useEffect(() => {
    let total = 0;
    cartItems.forEach((item) => {
      if (selectedItems[item.productId.productID]) {
        const price = productPrice[item.productId.productID] || 0;
        total += price * item.quantity;
      }
    });
    setSelectedSubtotal(total);
  }, [selectedItems, cartItems, productPrice]);

  const fetchProductStocks = async (items) => {
    const stocks = {};
    await Promise.all(
      items.map(async (item) => {
        try {
          const product = await productService.getProductById(
            item.productId.productID
          );
          stocks[item.productId.productID] =
            product.product.productStorage - product.product.productReservation;
  
          // Update the cart item with full product details
          item.productId = product.product;
        } catch (err) {
          console.error("Error fetching product stock:", err);
        }
      })
    );
    setProductStocks(stocks);
  };

  const fetchProductPrice = async (items) => {
    const price = {};
    await Promise.all(
      items.map(async (item) => {
        try {
          const product = await productService.getProductById(
            item.productId.productID
          );
          price[item.productId.productID] = product.product.productPrice;
        } catch (err) {
          console.error("Error fetching product price:", err);
        }
      })
    );
    setProductPrice(price);
  };

  const handleRemove = async (productId) => {
    try {
      const updatedCart = await cartService.removeFromCart(username, productId);
      if (updatedCart.items.length === 0) {
        setCartItems([]);
        setSubtotal(0);
        setError(null);
        setSelectedItems({});
      } else {
        setCartItems(updatedCart.items);
        await fetchProductStocks(updatedCart.items);
        await fetchProductPrice(updatedCart.items);

        const updatedSelectedItems = { ...selectedItems };
        delete updatedSelectedItems[productId];
        setSelectedItems(updatedSelectedItems);
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError(err.message);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await cartService.updateCart(username, productId, quantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId.productID === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedItems = {};
    cartItems.forEach(
      (item) => (newSelectedItems[item.productId.productID] = isChecked)
    );
    setSelectedItems(newSelectedItems);
  };

  const handleSelectItem = (productId, isChecked) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: isChecked,
    }));
  };

  const handleBuyNow = () => {
    const itemsToCheckout = cartItems.filter(
      (item) => selectedItems[item.productId.productID]
    );
    if (itemsToCheckout.length === 0) {
      setError("Please select at least one item to checkout");
    } else {
      navigate("/reservations", { state: { cartItems: itemsToCheckout } });
    }
  };

  if (loading) return <LoadingSpinner message="Loading your shopping cart..." />;

  return (
    <>
      <StepIndicator currentStep={1} />
      <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items">
        <header className="cart-items-header">
            <h1>Your Shopping Cart</h1>
            <h4>{cartItems.length} Items</h4>
          </header>

          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <p>The shopping cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <input
                  type="checkbox"
                  checked={selectedItems[item.productId.productID] || false}
                  onChange={(e) =>
                    handleSelectItem(item.productId.productID, e.target.checked)
                  }
                />
                <img
                  src={
                    item.productId.productImages?.[0] || "https://res.cloudinary.com/doigqstxw/image/upload/v1743099083/careless-people-7_fdqunw.jpg"
                  }
                  alt={item.productId.productName}
                />
                <div className="item-details">
                  <h3>{item.productId.productName}</h3>
                  <p>Ref. {item.productId.productID}</p>
                  <p>${productPrice[item.productId.productID]?.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId.productID,
                        item.quantity - 1
                      )
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId.productID,
                        item.quantity + 1
                      )
                    }
                    disabled={
                      item.quantity >= productStocks[item.productId.productID]
                    }
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(
                    (productPrice[item.productId.productID] || 0) *
                    item.quantity
                  ).toFixed(2)}
                </div>
                <button
                  className="remove-item"
                  onClick={() => handleRemove(item.productId.productID)}
                >
                  ×
                </button>
              </div>
            ))
          )}
          <button
            className="back-to-shop"
            onClick={() => navigate("/")}
          >
            &larr; Back
          </button>
        </div>

        <div className="order-summarys">
          <h2>Order Summary</h2>
          {cartItems.length > 0 ? (
            <>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${selectedSubtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr className="order-summarys-divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>${selectedSubtotal.toFixed(2)}</span>
              </div>
              <button
                className="proceed-checkout-button"
                onClick={handleBuyNow}
              >
                Checkout Selected Items
              </button>
            </>
          ) : (
            <p className="order-summarys-empty">No items to summarize.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Cart;