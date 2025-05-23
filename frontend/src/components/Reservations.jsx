import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Reservations.css";
import StepIndicator from "./StepIndicator";
import cartService from "../services/cartService"; // Import the cart service

const Reservations = ({ username: propUsername }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const [username, setUsername] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add shipping information state
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "HK",
  });

  // Calculate total with correct calculation using quantity and unitPrice
  const totalPrice = cartItems
    .reduce((total, item) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = item.productId?.productPrice || 0;
      const subtotal = unitPrice * quantity;
      return total + subtotal;
    }, 0)
    .toFixed(2);

  // Fetch cart items from API
  const fetchCartItems = async (user) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await cartService.getCart(user);
      
      if (response && response.cart && response.cart.items) {
        setCartItems(response.cart.items);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCheckoutError("Some product in cart is offlined. We will direct to shopping cart");
      
      // Add a short delay before redirecting to cart page
      setTimeout(() => {
        navigate("/cart");
      }, 2000); // 2 second delay to allow user to see the error message
    } finally {
      setIsLoading(false);
    }
  };


  // Set up username and cart items on component mount
  useEffect(() => {
    // First priority: Use username from props if available
    let currentUsername = "";
    
    if (propUsername) {
      currentUsername = propUsername;
      setUsername(propUsername);
    }
    // Second priority: Try from location state
    else if (location.state?.username) {
      currentUsername = location.state.username;
      setUsername(location.state.username);
    }
    // Third priority: Try from localStorage directly
    else if (localStorage.getItem("username")) {
      currentUsername = localStorage.getItem("username");
      setUsername(currentUsername);
    }
    // If all else fails, use a fallback for development
    else {
      if (process.env.NODE_ENV === "development") {
        currentUsername = "testuser";
        setUsername(currentUsername);
      }
    }

    // If we have a username, fetch cart items from API
    if (currentUsername) {
      fetchCartItems(currentUsername);
    }
    // If we still have location state cart items, use those while API loads
    else if (location.state?.cartItems && location.state.cartItems.length > 0) {
      setCartItems(location.state.cartItems);
    }
  }, [propUsername, location.state]);

  // Rest of the component remains the same...
  
  // Function to start the countdown timer (15 minutes = 900 seconds)
  const startCheckoutTimer = () => {
    let secondsLeft = 15 * 60;
    setTimeLeft(secondsLeft);

    const timer = setInterval(() => {
      secondsLeft -= 1;
      setTimeLeft(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(timer);
        removeReservation();
        alert("Checkout time expired. Your reservation has been released.");
        navigate("/cart");
      }
    }, 1000);

    setTimerId(timer);
    return timer;
  };

  // Function to clear the timer
  const clearCheckoutTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
      setTimeLeft(null);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    if (seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Remove reservation if user cancels or timeout
  const removeReservation = async () => {
    if (!username) {
      console.error("Cannot remove reservation: No username available");
      return;
    }

    try {
      await axios.post(`/api/checkout/remove-reservation/${username}`);
    } catch (error) {
      console.error("Failed to remove reservation:", error);
    }
  };

  // Helper function to simplify cart items for API
  const prepareCartItemsForAPI = (items) => {
    return items.map((item) => {
      // Create a simplified version of the item
      return {
        productId:
          typeof item.productId === "object"
            ? item.productId._id
            : item.productId,
        productName:
          typeof item.productId === "object"
            ? item.productId.productName
            : item.productName,
        productPrice: Number(item.productPrice) || 0,
        quantity: Number(item.quantity) || 1,
      };
    });
  };

  // Handle shipping form input changes
  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate shipping form
  const validateShippingInfo = () => {
    const { name, address, city, state, zipCode } = shippingInfo;
    if (!name.trim()) return "Name is required";
    if (!address.trim()) return "Address is required";

    return null;
  };

  const handleCheckout = async () => {
    // Use the username state which was set from props
    let checkoutUsername = username;

    if (!checkoutUsername) {
      // Prompt the user for their username as a last resort
      const promptedUsername = prompt(
        "Please enter your username to continue with checkout:"
      );
      if (promptedUsername && promptedUsername.trim()) {
        checkoutUsername = promptedUsername.trim();
        setUsername(checkoutUsername);
        console.log("Using prompted username:", checkoutUsername);
      } else {
        setCheckoutError("No username available. Please log in first.");
        return;
      }
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Validate shipping information
    const shippingError = validateShippingInfo();
    if (shippingError) {
      setCheckoutError(shippingError);
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);

    try {
      // Prepare simplified cart items for API
      const simplifiedCartItems = prepareCartItemsForAPI(cartItems);

      const initiateResponse = await axios.post(
        `/api/checkout/initiate-checkout/${checkoutUsername}`,
        {
          items: simplifiedCartItems,
          totalAmount: parseFloat(totalPrice),
        }
      );

      if (initiateResponse.data.success) {
        // Start the 15-minute countdown
        startCheckoutTimer();

        // Step 2: Create PayPal order with the shipping info from form
        const formattedShippingInfo = {
          name: shippingInfo.name,
          address: shippingInfo.address,
        };

        console.log("Creating PayPal order with:", {
          username: checkoutUsername,
          shippingInfo: formattedShippingInfo,
        });

        const createOrderResponse = await axios.post(
          `/api/checkout/create-paypal-order`,
          {
            username: checkoutUsername,
            shippingInfo: formattedShippingInfo,
          }
        );

        if (createOrderResponse.data.success) {
          // Get the PayPal order ID from the response
          const orderId = createOrderResponse.data.paypalOrderId;

          if (orderId) {
            // Determine the PayPal URL
            let paypalUrl;
            if (createOrderResponse.data.approvalUrl) {
              paypalUrl = createOrderResponse.data.approvalUrl;
            } else {
              paypalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`;
            }

            // Open PayPal in a new window instead of redirecting
            const paypalWindow = window.open(paypalUrl, "_blank");

            // If popup is blocked, provide a fallback
            if (
              !paypalWindow ||
              paypalWindow.closed ||
              typeof paypalWindow.closed === "undefined"
            ) {
              setCheckoutError(
                "Popup blocked! Please allow popups, refresh and try again!"
              );
              // Create a clickable link as fallback
              const linkElement = document.createElement("a");
              linkElement.href = paypalUrl;
              linkElement.target = "_blank";
              linkElement.textContent = "Open PayPal in a new window";
              linkElement.className = "paypal-fallback-link";

              const errorDiv = document.querySelector(".error-message");
              if (errorDiv) {
                errorDiv.appendChild(document.createElement("br"));
                errorDiv.appendChild(linkElement);
              }
            } else {
              // Set up polling to check when the PayPal window is closed
              const pollTimer = setInterval(() => {
                if (paypalWindow.closed) {
                  clearInterval(pollTimer);

                  // When PayPal window is closed, check if payment was completed
                  // We'll do this by attempting to process the payment
                  processPayment(checkoutUsername, orderId);
                }
              }, 200);

              // Also set a timeout to stop polling after 15 minutes (same as reservation timeout)
              setTimeout(() => {
                clearInterval(pollTimer);
                if (!paypalWindow.closed) {
                  paypalWindow.close();
                }
                setCheckoutError(
                  "Payment session timed out. Please try again."
                );
                setIsProcessing(false);
              }, 15 * 60 * 1000); // 15 minutes
            }
          } else {
            throw new Error("No PayPal order ID returned from server");
          }
        } else {
          throw new Error(
            createOrderResponse.data.message || "Failed to create PayPal order"
          );
        }
      } else {
        throw new Error("Sorry, items were sold out");
      }
    } catch (error) {
      console.error("Checkout error:", error);

      let errorMessage = "An error occurred during checkout";

      if (error.response) {
        // The server responded with an error status code
        console.error("Error response:", error.response);

        if (error.response.data && error.response.data.error) {
          // If the server sent a specific error message
          errorMessage = error.response.data.error;
        } else if (error.response.data && error.response.data.message) {
          // Alternative error message format
          errorMessage = error.response.data.message;
        } else {
          // Generic error with status code
          errorMessage = `Server error (${error.response.status}): Please try again later`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage =
          "No response received from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || "Unknown error occurred";
      }

      setCheckoutError(errorMessage);
      clearCheckoutTimer();
      setIsProcessing(false);
    }
  };

  // Function to process payment after PayPal window is closed
  const processPayment = async (checkoutUsername, orderId) => {
    try {
      setIsProcessing(true);

      console.log(
        "Processing payment for:",
        checkoutUsername,
        "with PayPal order ID:",
        orderId
      );

      const processResponse = await axios.post(
        `/api/checkout/process-payment`,
        {
          username: checkoutUsername,
          paypalOrderId: orderId,
        }
      );

      if (processResponse.data.success) {
        // Payment successfully processed
        clearCheckoutTimer(); // Clear the reservation timer

        // Clear the cart in localStorage and state
        localStorage.removeItem("cart");
        setCartItems([]);

        alert("Payment successful! Thank you for your order.");

        // Redirect to order confirmation page
        setTimeout(() => {
          navigate("/CheckoutFinish", {
            state: {
              orderId: processResponse.data.orderId,
              orderDetails: processResponse.data.orderDetails, // Pass the complete order details
              // Include any other necessary data
            },
            search: `?token=${processResponse.data.orderId}`, // Add the token as a query parameter
          });
        }); // Short delay to show success message
      } else {
        throw new Error(
          processResponse.data.message || "Failed to process payment"
        );
      }
    } catch (error) {
      console.error("Payment processing error:", error);

      let errorMessage = "An error occurred while processing your payment";
      if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${
          error.response.data?.message || error.message
        }`;
      } else if (error.request) {
        errorMessage =
          "No response received from server. Please check your connection.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }

      setCheckoutError(errorMessage);

      // Attempt to clean up reservations on error
      try {
        await axios.post(
          `/api/checkout/remove-reservation/${checkoutUsername}`
        );
      } catch (cleanupError) {
        console.error("Failed to clean up reservations:", cleanupError);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      clearCheckoutTimer();
    };
  }, []);

  // Handle cancellation of checkout
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel your reservation?")) {
      removeReservation();
      clearCheckoutTimer();
      navigate("/cart");
    }
  };

  return (
    <>
      <StepIndicator currentStep={2} />
      <div className="reservations-container">
        <h1>Your Reservations</h1>

        {timeLeft && (
          <div className="checkout-timer">
            Time remaining: <span className="timer">{formatTime(timeLeft)}</span>
          </div>
        )}
        {checkoutError && <div className="error-message">{checkoutError}</div>}
        <div className="cart-summary">
          <h2>Cart Summary</h2>
          {isLoading ? (
            <p>Loading cart items...</p>
          ) : cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => {
                    const productName =
                      item.productName ||
                      item.productId?.productName ||
                      "Unknown Product";
                    const quantity = Number(item.quantity) || 1;
                    // fetch unit price of products
                    const unitPrice = item.productId?.productPrice || 0;
                    // Calculate subtotal of each product
                    const productSubtotal = Number(unitPrice * quantity).toFixed(2);

                    return (
                      <tr key={index}>
                        <td>{productName}</td>
                        <td>${unitPrice.toFixed(2)}</td>
                        <td>{quantity}</td>
                        <td>${productSubtotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="total-label">
                      Total:
                    </td>
                    <td className="total-price">${totalPrice}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Shipping Information Form */}
              <div className="shipping-form">
                <h3>Shipping Information</h3>
                <div className="form-group">
                  <label htmlFor="name">Full Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Street Address:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </div>
              </div>

              <div className="checkout-actions">
                <button
                  className="checkout-button"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Proceed to PayPal"}
                </button>

                <button
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={isProcessing}
                >
                  Cancel Reservation
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Reservations;
