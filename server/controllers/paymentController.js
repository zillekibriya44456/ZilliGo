const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
// const paypal = require('@paypal/checkout-server-sdk'); // Configured below
const db = require('../utils/db');

// Setup Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// Setup PayPal
// const paypalEnv = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
// const paypalClient = new paypal.core.PayPalHttpClient(paypalEnv);

// @desc    Create a Stripe Checkout Session
// @route   POST /api/payments/stripe/create-checkout
exports.createStripeCheckout = async (req, res) => {
  const { tourId, amount, tourTitle, type } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: tourTitle, description: `ZillGO ${type}` },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/tour/${tourId}?payment=cancelled`,
      metadata: { tourId, userId: req.user.id.toString(), type },
    });
    
    // Log pending payment
    await db.query(
      'INSERT INTO payments (user_id, provider, provider_id, amount, currency, status, payment_type, reference_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [req.user.id, 'stripe', session.id, amount, 'USD', 'pending', type || 'tour_booking', tourId]
    );

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Stripe error', error: error.message });
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay/create-order
exports.createRazorpayOrder = async (req, res) => {
  const { amount, currency = 'INR', type, referenceId } = req.body;
  try {
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    
    await db.query(
      'INSERT INTO payments (user_id, provider, provider_id, amount, currency, status, payment_type, reference_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [req.user.id, 'razorpay', order.id, amount, currency, 'pending', type, referenceId]
    );

    res.json({ id: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    res.status(500).json({ message: 'Razorpay error', error: error.message });
  }
};

// @desc    Create PayPal Order
// @route   POST /api/payments/paypal/create-order
exports.createPaypalOrder = async (req, res) => {
  const { amount, type, referenceId } = req.body;
  try {
    // let request = new paypal.orders.OrdersCreateRequest();
    // request.prefer("return=representation");
    // request.requestBody({ ... });
    // const order = await paypalClient.execute(request);
    
    // Stub for now
    const orderId = `PAYPAL_${Date.now()}`;
    await db.query(
      'INSERT INTO payments (user_id, provider, provider_id, amount, currency, status, payment_type, reference_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [req.user.id, 'paypal', orderId, amount, 'USD', 'pending', type, referenceId]
    );

    res.json({ id: orderId });
  } catch (error) {
    res.status(500).json({ message: 'PayPal error' });
  }
};

// @desc    Stripe Webhook to handle successful payments
// @route   POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { tourId, userId, type } = session.metadata;
    const amount = session.amount_total / 100;

    // 1. Update Payment Status
    await db.query('UPDATE payments SET status = $1 WHERE provider_id = $2', ['succeeded', session.id]);

    // 2. Fulfill Booking
    if (type === 'tour_booking') {
      const booking = await db.query(
        'INSERT INTO bookings (user_id, tour_id, booking_date, booking_time, status, total_amount) VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, $3, $4) RETURNING id',
        [userId, tourId, 'confirmed', amount]
      );
      
      // 3. Calculate Commission (e.g. 15% platform fee)
      const platformFee = amount * 0.15;
      const guideAmount = amount - platformFee;
      
      const paymentRes = await db.query('SELECT id FROM payments WHERE provider_id = $1', [session.id]);
      if(paymentRes.rows.length > 0) {
        const paymentId = paymentRes.rows[0].id;
        await db.query(
          'INSERT INTO commissions (payment_id, total_amount, platform_fee, guide_amount) VALUES ($1, $2, $3, $4)',
          [paymentId, amount, platformFee, guideAmount]
        );
      }
    }
  }

  res.json({ received: true });
};

// @desc    Refund a Payment
// @route   POST /api/payments/refund
exports.refundPayment = async (req, res) => {
  const { paymentId, reason } = req.body;
  try {
    const payment = await db.query('SELECT * FROM payments WHERE id = $1', [paymentId]);
    if(payment.rows.length === 0) return res.status(404).json({ message: 'Payment not found' });
    
    // Proceed with refund based on provider (Stripe/Razorpay/PayPal)
    // ... Integration logic ...

    await db.query(
      'INSERT INTO refunds (payment_id, amount, reason, status) VALUES ($1, $2, $3, $4)',
      [paymentId, payment.rows[0].amount, reason, 'processed']
    );
    await db.query('UPDATE payments SET status = $1 WHERE id = $2', ['refunded', paymentId]);

    res.json({ message: 'Refund processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Refund failed' });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/razorpay/verify
exports.verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const crypto = require('crypto');
  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder');
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      await db.query(
        "UPDATE payments SET status = 'succeeded' WHERE provider_id = $1",
        [razorpay_order_id]
      );
      res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ status: 'failure', message: 'Invalid signature verification' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};
