const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const Order = require('../models/Order');  // Import the Order model
const router = express.Router();

// Route to create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;  // Amount should be passed in cents (e.g., $10 = 1000)

    if (!amount || amount <= 0) {
      return res.status(400).send({ error: 'Invalid amount' });
    }

    // Create a payment intent using the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',  // You can change the currency if needed
    });

    // Return the client secret to the frontend
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: error.message });
  }
});

// Function to update payment status
const updatePaymentStatus = async (orderId, paymentIntent) => {
  try {
    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return { error: 'Order not found' };
    }

    // Update the order with the payment status and Stripe payment result
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: paymentIntent.receipt_email,  // Stripe email address
    };

    await order.save();
    return { success: 'Order payment updated successfully' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update order payment status' };
  }
};

// Route to update payment status of an order
router.post('/update-payment-status', async (req, res) => {
  const { orderId, paymentIntent } = req.body;

  try {
    const result = await updatePaymentStatus(orderId, paymentIntent);

    if (result.error) {
      return res.status(400).send({ error: result.error });
    }

    res.status(200).send({ message: result.success });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).send({ error: 'Failed to update payment status' });
  }
});

module.exports = router;
