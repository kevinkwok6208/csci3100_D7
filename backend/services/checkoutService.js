const Cart = require("../models/Cart");
const Product = require("../models/Products");
const Reservation = require("../models/Reservation");
const authService = require("./authService");
const cartService = require("./CartService");
const paypalService = require("./paypalService");
const emailService = require("./emailService");
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");

class CheckoutService {
  /**
   * Initiates the checkout process by reserving cart items for a user.
   * @param {string} username - The username of the user initiating checkout.
   * @returns {Object} - Result object with success status, message, reservations, and expiry time.
   */
  async initiateCheckout(username) {
    try {
      // Step 1: Clean up expired reservations and remove existing pending reservations
      await this.cleanupExpiredReservations();
      await this.removeReservation(username);

      // Step 2: Retrieve the user's cart
      const user = await cartService.getUserProduct(username, 0);
      const cart = await Cart.findOne({ userId: user._id });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // Step 3: Set reservation timing
      const reservationExpiryTime = 15; // minutes
      const currentTime = authService.adjustDateForTimezone(new Date());
      const expiryDate = new Date(
        currentTime.getTime() + reservationExpiryTime * 60000
      );

      // Step 4: Process each item in the cart
      const reservationPromises = cart.items.map(async (item) => {
        // Retrieve the product
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        // Check available stock (excluding current reservations)
        const availableStock =
          product.productStorage - product.productReservation;
        if (item.quantity > availableStock) {
          throw new Error(
            `Not enough stock for ${product.productName}. Available: ${availableStock}`
          );
        }

        // Create or update the reservation
        const reservation = await Reservation.findOneAndUpdate(
          { userId: user._id, productId: product._id, status: "pending" },
          {
            quantity: item.quantity,
            reservationDate: currentTime,
            expiryDate,
          },
          { new: true, upsert: true }
        );

        // Explicitly update productReservation in the Products model
        await Product.findByIdAndUpdate(
          product._id,
          { $inc: { productReservation: item.quantity } },
          { new: true }
        );

        return reservation;
      });

      // Step 5: Execute all reservation operations concurrently
      const reservations = await Promise.all(reservationPromises);

      // Step 6: Return success response
      return {
        success: true,
        message: "Checkout initiated successfully",
        reservations,
        expiresIn: reservationExpiryTime * 60 * 1000, // milliseconds
      };
    } catch (error) {
      console.error("Error initiating checkout:", error);
      throw error;
    }
  }

  /**
   * Removes all pending reservations for a user and updates product stock.
   * @param {string} username - The username of the user.
   * @returns {Object|string} - Result object or message if no reservations exist.
   */
  async removeReservation(username) {
    try {
      const user = await cartService.getUserProduct(username, 0);
      const reservations = await Reservation.find({
        userId: user._id,
        status: "pending",
      });

      if (reservations.length === 0) {
        return "No reservations found";
      }

      // Update product reservation counts concurrently
      await Promise.all(
        reservations.map((reservation) =>
          Product.findByIdAndUpdate(
            reservation.productId,
            { $inc: { productReservation: -reservation.quantity } },
            { new: true }
          )
        )
      );

      await Reservation.deleteMany({ userId: user._id, status: "pending" });

      return {
        success: true,
        message: "Reservations removed successfully",
        reservations,
      };
    } catch (error) {
      console.error("Error removing reservations:", error);
      throw error;
    }
  }

  /**
   * Cleans up expired reservations and adjusts product reservation counts.
   * @returns {Object} - Result object with success status, message, and number of processed reservations.
   */
  async cleanupExpiredReservations() {
    try {
      const now = authService.adjustDateForTimezone(new Date());
      const expiredReservations = await Reservation.find({
        status: "pending",
        expiryDate: { $lt: now },
      });

      if (expiredReservations.length === 0) {
        return {
          success: true,
          message: "No expired reservations found",
          processed: 0,
        };
      }

      // Update product reservation counts concurrently
      await Promise.all(
        expiredReservations.map((reservation) =>
          Product.findByIdAndUpdate(
            reservation.productId,
            { $inc: { productReservation: -reservation.quantity } },
            { new: true }
          )
        )
      );

      await Reservation.deleteMany({
        status: "pending",
        expiryDate: { $lt: now },
      });

      return {
        success: true,
        message: "Expired reservations removed successfully",
        processed: expiredReservations.length,
      };
    } catch (error) {
      console.error("Error cleaning up expired reservations:", error);
      throw error;
    }
  }

  /**
   * Creates a PayPal order for the user's cart with shipping information.
   * @param {string} username - The username of the user.
   * @param {Object} shippingInfo - Shipping details (name and address).
   * @returns {Object} - Result object with PayPal order ID and approval URL.
   */
  async createPayPalOrder(username, shippingInfo) {
    try {
      if (!shippingInfo?.name || !shippingInfo?.address) {
        throw new Error("Name and shipping address are required");
      }

      const user = await cartService.getUserProduct(username, 0);
      const cartData = await cartService.getCart(username);
      const cart = cartData[0].cart;
      const subtotal = cartData[0].subtotal;

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      const cartItems = await Promise.all(
        cart.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          return {
            productId: item.productId,
            productName: product.productName,
            productPrice: item.productPrice,
            quantity: item.quantity,
          };
        })
      );

      await Reservation.updateMany(
        { userId: user._id, status: "pending" },
        {
          $set: {
            shippingName: shippingInfo.name,
            shippingAddress: shippingInfo.address,
          },
        }
      );

      const paypalOrder = await paypalService.createOrder(
        cartItems,
        subtotal,
        shippingInfo
      );

      return {
        success: true,
        paypalOrderId: paypalOrder.id,
        approvalUrl: paypalOrder.links.find((link) => link.rel === "approve")
          .href,
      };
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  }

  /**
   * Processes a PayPal payment and creates an order upon success.
   * @param {string} username - The username of the user.
   * @param {string} paypalOrderId - The PayPal order ID to capture.
   * @returns {Object} - Result object with order ID and payment details.
   */
  async processPayment(username, paypalOrderId) {
    try {
      const user = await cartService.getUserProduct(username, 0);
      const captureResult = await paypalService.capturePayment(paypalOrderId);

      if (captureResult.status !== "COMPLETED") {
        throw new Error("Payment was not completed");
      }

      const reservations = await Reservation.find({
        userId: user._id,
        status: "pending",
      });
      if (reservations.length === 0) {
        throw new Error("No pending reservations found");
      }

      const { shippingName, shippingAddress } = reservations[0];
      if (!shippingName || !shippingAddress) {
        throw new Error("Shipping information not found");
      }

      const orderProducts = await Promise.all(
        reservations.map(async (reservation) => {
          const product = await Product.findById(reservation.productId);
          return {
            productId: reservation.productId,
            productName: product.productName,
            quantity: reservation.quantity,
            price: product.productPrice,
          };
        })
      );

      const createdAt = authService.adjustDateForTimezone(new Date());
      const newOrder = new Order({
        orderId: uuidv4(),
        userId: user._id,
        Name: shippingName,
        ShippingAddress: shippingAddress,
        createdAt,
        products: orderProducts.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
          status: false,
        })),
      });

      await newOrder.save();

      // Update product storage and reservation counts concurrently
      await Promise.all(
        reservations.map((reservation) =>
          Product.findByIdAndUpdate(
            reservation.productId,
            {
              $inc: {
                productStorage: -reservation.quantity,
                productReservation: -reservation.quantity,
              },
            },
            { new: true }
          )
        )
      );

      await Reservation.deleteMany({ userId: user._id, status: "pending" });
      await Cart.findOneAndDelete({ userId: user._id });
      await emailService.sendOrderConfirmation(
        user.email,
        newOrder,
        orderProducts
      );

      return {
        success: true,
        message: "Payment processed successfully",
        orderId: newOrder.orderId,
        paypalDetails: captureResult,
      };
    } catch (error) {
      console.error("Error processing payment:", error);
      try {
        await this.removeReservation(username);
      } catch (cleanupError) {
        console.error("Error cleaning up after payment failure:", cleanupError);
      }
      throw error;
    }
  }
}

module.exports = new CheckoutService();
