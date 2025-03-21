const checkoutService = require('../services/checkoutService');

class CheckoutController {
async initiateCheckout(req, res) {
        try {
            const { username } = req.params;
            const result = await checkoutService.initiateCheckout(username);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async cleanupExpriedReservations(req,res) {
        try {
            const result = await checkoutService.cleanupExpiredReservations();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async removeReservation(req,res) {
        try {
            const { username } = req.params;
            const result = await checkoutService.removeReservation(username);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new CheckoutController();