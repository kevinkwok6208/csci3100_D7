const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config/OTP_Host.env' });
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });
    }

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOTP(email, otp) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`
        };

        await this.transporter.sendMail(mailOptions);
    }

    //Order confirmation email
    async sendOrderConfirmation(email, order, products) {
        // Create a formatted product list
        const productsList = products.map(item => 
            `- ${item.productName} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        // Calculate order total
        const orderTotal = products.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        ).toFixed(2);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Order Confirmation #${order.orderId}`,
            text: 
            `Dear ${order.Name},

            Thank you for your order! We're pleased to confirm that your order has been received and is being processed.

            Order Details:
            Order Number: ${order.orderId}
            Date: ${order.createdAt}
            Shipping Address: ${order.ShippingAddress}

            Products:
            ${productsList}

            Order Total: $${orderTotal}

            We will notify you when your order ships. If you have any questions, please contact our customer service.

            Thank you for shopping with us!

            Best regards,
            The CSCI3100_D7 Team`
        };

        await this.transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService();
