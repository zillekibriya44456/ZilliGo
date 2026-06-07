const express = require('express');
const router = express.Router();
const { 
  createStripeCheckout, 
  createRazorpayOrder, 
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  createPaypalOrder, 
  handleWebhook,
  refundPayment,
  confirmPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/stripe/create-checkout', protect, createStripeCheckout);
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/paypal/create-order', protect, createPaypalOrder);
router.post('/confirm', protect, confirmPayment);
router.post('/refund', protect, refundPayment);

// Webhooks
router.post('/webhook', handleWebhook); // Stripe Webhook (uses req.rawBody)
router.post('/razorpay/webhook', handleRazorpayWebhook); // Razorpay Webhook (uses req.rawBody)

module.exports = router;
