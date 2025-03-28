const checkoutService = require('../services/checkoutService');

class CheckoutController {
    // Click and inistiate checkout, create reservation
    async initiateCheckout(req, res) {
        try {
            const { username } = req.params;
            const result = await checkoutService.initiateCheckout(username);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Remove expired reservations
    async cleanupExpriedReservations(req,res) {
        try {
            const result = await checkoutService.cleanupExpiredReservations();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Remove reservation of user
    async removeReservation(req,res) {
        try {
            const { username } = req.params;
            const result = await checkoutService.removeReservation(username);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Create PayPal order
    async createPayPalOrder(req, res) {
      try {
          const { username, shippingInfo } = req.body;
          
          if (!username || !shippingInfo) {
              return res.status(400).json({ 
                  message: 'Username and shipping information are required' 
              });
          }
          
          const result = await checkoutService.createPayPalOrder(username, shippingInfo);
          res.json(result);
      } catch (error) {
          console.error('Error creating PayPal order:', error);
          res.status(500).json({ 
              message: error.message || 'Failed to create PayPal order'
          });
      }
  }

  // Process PayPal payment
  async processPayment(req, res) {
      try {
          const { username, paypalOrderId } = req.body;
          
          if (!username || !paypalOrderId) {
              return res.status(400).json({ 
                  message: 'Username and PayPal order ID are required' 
              });
          }
          
          const result = await checkoutService.processPayment(username, paypalOrderId);
          res.json(result);
      } catch (error) {
          console.error('Error processing payment:', error);
          res.status(500).json({ 
              message: error.message || 'Failed to process payment'
          });
      }
  }
}
module.exports = new CheckoutController();