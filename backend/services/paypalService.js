const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const {getIpv4Address} = require('../config/iphost');
// Load PayPal configuration
dotenv.config({ path: path.join(__dirname, '../config/paypal.env') });

const currentIpv4=getIpv4Address();
class PayPalService {
  constructor() {
    this.baseURL = process.env.PAYPAL_SANDBOX_API_URL;
    this.clientId = process.env.PAYPAL_CLIENT_ID;
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    this.returnUrl = `https://${currentIpv4}:3000${process.env.PAYPAL_RETURN_URL}`;
    this.cancelUrl = `https://${currentIpv4}:3000${process.env.PAYPAL_CANCEL_URL}`;
  }

  // Get access token from PayPal
  async getAccessToken() {
    try {
      const response = await axios({
        method: 'post',
        url: `${this.baseURL}/v1/oauth2/token`,
        auth: {
          username: this.clientId,
          password: this.clientSecret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials'
      });
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting PayPal access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with PayPal');
    }
  }

  // Create a PayPal order with shipping address
  async createOrder(cartItems, totalAmount, shippingInfo) {
    try {
      const accessToken = await this.getAccessToken();
      
      // Format items for PayPal
      const items = cartItems.map(item => ({
        name: item.productName || `Product ${item.productId}`,
        unit_amount: {
          currency_code: 'HKD',
          value: ((item.productPrice / item.quantity) || 0).toFixed(2)
        },
        quantity: item.quantity
      }));

      // Calculate the exact item total from the formatted items
      const calculatedItemTotal = items.reduce((total, item) => {
        return total + (parseFloat(item.unit_amount.value) * item.quantity);
      }, 0).toFixed(2);

      // Parse the shipping address
      const [streetAddress, city, country] = this.parseShippingAddress(shippingInfo.address);

      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'HKD',
              value: calculatedItemTotal, // Use calculated total
              breakdown: {
                item_total: {
                  currency_code: 'HKD',
                  value: calculatedItemTotal // Use same calculated total
                }
              }
            },
            items: items,
            shipping: {
              name: {
                full_name: shippingInfo.name
              },
              address: {
                address_line_1: streetAddress,
                admin_area_2: city,
                country_code: country || 'HK' // Default to Hong Kong
              }
            }
          }
        ],
        application_context: {
          return_url: this.returnUrl,
          cancel_url: this.cancelUrl,
          brand_name: 'CSCI3100 D7 Store',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'PAY_NOW'
        }
      };

      console.log('Creating PayPal order with data:', JSON.stringify(orderData, null, 2));

      const response = await axios({
        method: 'post',
        url: `${this.baseURL}/v2/checkout/orders`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        data: orderData
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating PayPal order:', error.response?.data || error.message);
      throw new Error('Failed to create PayPal order');
    }
  }

  // Helper method to parse shipping address
  parseShippingAddress(addressString) {
    // Simple address parser - assumes format: "street, city, country"
    const parts = addressString.split(',').map(part => part.trim());
    const streetAddress = parts[0] || '';
    const city = parts[1] || '';
    const country = parts[2] || 'HK'; // Default to Hong Kong if not specified
    
    return [streetAddress, city, country];
  }

  // Capture payment for an order (when the user has approved the payment)
  async capturePayment(orderId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios({
        method: 'post',
        url: `${this.baseURL}/v2/checkout/orders/${orderId}/capture`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error capturing PayPal payment:', error.response?.data || error.message);
      throw new Error('Failed to capture payment');
    }
  }

  // Get order details
  async getOrderDetails(orderId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios({
        method: 'get',
        url: `${this.baseURL}/v2/checkout/orders/${orderId}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting PayPal order details:', error.response?.data || error.message);
      throw new Error('Failed to get order details');
    }
  }
}

module.exports = new PayPalService();
