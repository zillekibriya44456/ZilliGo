const express = require('express');
const router = express.Router();
const { 
  createStripeCheckout, 
  createRazorpayOrder, 
  createPaypalOrder, 
  handleWebhook,
  refundPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/stripe/create-checkout', protect, createStripeCheckout);
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/paypal/create-order', protect, createPaypalOrder);
router.post('/refund', protect, refundPayment);

// Webhook must be raw
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
