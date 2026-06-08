let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } else {
    console.warn('⚠️ Stripe Secret Key is missing. Stripe checkout will be disabled.');
  }
} catch (err) {
  console.error('⚠️ Failed to initialize Stripe:', err.message);
}
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../utils/db');

// Setup Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// Helper: Securely fulfill booking and payment details atomically in DB
const fulfillBookingRecord = async (orderId, paymentId, amountPaidUsd, userId) => {
  // 1. Fetch current payment details
  const paymentRes = await db.query(
    'SELECT * FROM payments WHERE provider_id = $1 OR provider_id = $2',
    [orderId, paymentId]
  );
  
  if (paymentRes.rows.length === 0) {
    console.error(`[PAYMENT ERROR] Payment record not found for provider_id: ${orderId} or ${paymentId}`);
    return null;
  }
  
  const payment = paymentRes.rows[0];
  
  // Idempotency check: if payment succeeded, skip double processing
  if (payment.status === 'succeeded') {
    console.log(`[PAYMENT INFO] Payment ${payment.id} already marked succeeded. Skipping.`);
    return payment.reference_id;
  }

  const bookingId = payment.reference_id;

  console.log(`[PAYMENT SUCCESS] Fulfilling booking #${bookingId} for user #${userId || payment.user_id}`);

  // 2. Update Payment status
  await db.query(
    "UPDATE payments SET status = 'succeeded', provider_id = $1 WHERE id = $2",
    [paymentId || payment.provider_id, payment.id]
  );

  // 3. Update Booking status to confirmed
  await db.query(
    "UPDATE bookings SET status = 'confirmed' WHERE id = $1",
    [bookingId]
  );

  // 4. Create Transaction record
  try {
    const walletRes = await db.query('SELECT id FROM wallets WHERE user_id = $1', [payment.user_id]);
    const walletId = walletRes.rows.length > 0 ? walletRes.rows[0].id : null;
    await db.query(
      'INSERT INTO transactions (wallet_id, payment_id, amount, type, status, description) VALUES ($1, $2, $3, $4, $5, $6)',
      [walletId, payment.id, amountPaidUsd || payment.amount, 'debit', 'completed', `Paid for virtual tour booking #${bookingId}`]
    );
  } catch (err) {
    console.error('[PAYMENT WARN] Failed to log transaction in wallets:', err.message);
  }

  // 5. Calculate Commission (e.g. 15% platform fee)
  try {
    const totalAmount = amountPaidUsd || payment.amount;
    const platformFee = totalAmount * 0.15;
    const guideAmount = totalAmount - platformFee;
    await db.query(
      'INSERT INTO commissions (payment_id, total_amount, platform_fee, guide_amount) VALUES ($1, $2, $3, $4)',
      [payment.id, totalAmount, platformFee, guideAmount]
    );
  } catch (err) {
    console.error('[PAYMENT WARN] Failed to create commission entry:', err.message);
  }

  // 6. Create Notification for guide
  try {
    const bookingRes = await db.query('SELECT tour_id FROM bookings WHERE id = $1', [bookingId]);
    if (bookingRes.rows.length > 0) {
      const tourRes = await db.query('SELECT guide_id, title FROM tours WHERE id = $1', [bookingRes.rows[0].tour_id]);
      if (tourRes.rows.length > 0) {
        const { guide_id, title } = tourRes.rows[0];
        await db.query(`
          INSERT INTO notifications (user_id, type, title, message, reference_id)
          VALUES ($1, 'booking_confirmed', 'New Booking Paid', $2, $3)
        `, [guide_id, `Tour "${title}" has been paid and confirmed!`, bookingId]);
      }
    }
  } catch (err) {
    console.error('[PAYMENT WARN] Failed to trigger guide notification:', err.message);
  }

  return bookingId;
};

// @desc    Create a Stripe Checkout Session
// @route   POST /api/payments/stripe/create-checkout
exports.createStripeCheckout = async (req, res) => {
  const { tourId, amount, tourTitle, type } = req.body;
  if (!stripe) {
    return res.status(400).json({ message: 'Stripe is not configured on this server.' });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: tourTitle, description: `ZilliGO ${type}` },
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

// @desc    Create Razorpay Order (Securely validated on backend)
// @route   POST /api/payments/razorpay/create-order
exports.createRazorpayOrder = async (req, res) => {
  const { bookingId } = req.body;
  
  if (!bookingId) {
    return res.status(400).json({ message: 'Booking ID is required' });
  }

  try {
    // 1. Fetch booking details directly from database to prevent price tampering
    const bookingRes = await db.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [bookingId, req.user.id]
    );

    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookingRes.rows[0];

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: `Booking status is already '${booking.status}'` });
    }

    const usdAmount = parseFloat(booking.total_amount);
    
    // Convert USD to INR (Standard exchange rate of 83 INR per USD)
    const inrAmount = Math.round(usdAmount * 83);
    const amountInPaise = inrAmount * 100;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `booking_${bookingId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Log pending Razorpay Order reference
    await db.query(
      'INSERT INTO payments (user_id, provider, provider_id, amount, currency, status, payment_type, reference_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [req.user.id, 'razorpay', order.id, usdAmount, 'USD', 'pending', 'tour_booking', bookingId]
    );

    res.json({
      id: order.id,
      currency: 'INR',
      amount: order.amount, // in paise
    });
  } catch (error) {
    console.error('[RAZORPAY ORDER ERROR]:', error.message);
    res.status(500).json({ message: 'Razorpay order creation failed', error: error.message });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/razorpay/verify
exports.verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing Razorpay parameters' });
  }

  try {
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.warn(`[SECURITY WARNING] Invalid signature attempt for order: ${razorpay_order_id}`);
      
      // Update status to failed
      await db.query(
        "UPDATE payments SET status = 'failed' WHERE provider_id = $1",
        [razorpay_order_id]
      );
      
      return res.status(400).json({ status: 'failure', message: 'Signature verification failed' });
    }

    // Process fulfillment atomically
    const bookingId = await fulfillBookingRecord(razorpay_order_id, razorpay_payment_id, null, req.user.id);
    
    res.json({
      status: 'success',
      message: 'Payment verified and booking confirmed successfully',
      bookingId,
    });
  } catch (error) {
    console.error('[RAZORPAY VERIFICATION ERROR]:', error.message);
    res.status(500).json({ message: 'Verification process failed', error: error.message });
  }
};

// @desc    Razorpay Webhook Handler (Security signature verified backend-to-backend)
// @route   POST /api/payments/razorpay/webhook
exports.handleRazorpayWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return res.status(400).send('Webhook Secret or Signature header missing');
  }

  try {
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(req.rawBody ? req.rawBody : JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      console.error('[SECURITY WARNING] Webhook signature verification failed');
      return res.status(400).send('Invalid webhook signature');
    }

    const event = req.body;
    console.log(`[PAYMENT INFO] Razorpay Webhook Event Received: ${event.event}`);

    // Handle order paid event
    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentPayload = event.payload.payment.entity;
      const orderId = paymentPayload.order_id;
      const paymentId = paymentPayload.id;

      await fulfillBookingRecord(orderId, paymentId, null, null);
    } else if (event.event === 'payment.failed') {
      const paymentPayload = event.payload.payment.entity;
      const orderId = paymentPayload.order_id;
      
      await db.query(
        "UPDATE payments SET status = 'failed' WHERE provider_id = $1",
        [orderId]
      );
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('[WEBHOOK ERROR]:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

// @desc    Stripe Webhook to handle successful payments
// @route   POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (!stripe) {
    return res.status(400).send('Stripe is not configured on this server.');
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody ? req.rawBody : req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { tourId, userId, type } = session.metadata;
    const amount = session.amount_total / 100;

    // Fulfill booking
    if (type === 'tour_booking') {
      const booking = await db.query(
        'INSERT INTO bookings (user_id, tour_id, booking_date, booking_time, status, total_amount) VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, $3, $4) RETURNING id',
        [userId, tourId, 'confirmed', amount]
      );
      
      const paymentIdRes = await db.query(
        'INSERT INTO payments (user_id, provider, provider_id, amount, currency, status, payment_type, reference_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [userId, 'stripe', session.id, amount, 'USD', 'succeeded', 'tour_booking', booking.rows[0].id]
      );

      const platformFee = amount * 0.15;
      const guideAmount = amount - platformFee;
      
      await db.query(
        'INSERT INTO commissions (payment_id, total_amount, platform_fee, guide_amount) VALUES ($1, $2, $3, $4)',
        [paymentIdRes.rows[0].id, amount, platformFee, guideAmount]
      );
    }
  }

  res.json({ received: true });
};

// @desc    Refund a Payment
// @route   POST /api/payments/refund
exports.refundPayment = async (req, res) => {
  const { paymentId, reason } = req.body;
  try {
    const paymentRes = await db.query('SELECT * FROM payments WHERE id = $1', [paymentId]);
    if (paymentRes.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    const payment = paymentRes.rows[0];

    if (payment.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment must be succeeded to trigger refund' });
    }

    if (payment.provider === 'razorpay') {
      // Razorpay refund
      const refundAmountInINR = Math.round(payment.amount * 83 * 100);
      await razorpay.payments.refund(payment.provider_id, {
        amount: refundAmountInINR,
        notes: { reason: reason || 'Traveler cancellation' }
      });
    } else if (payment.provider === 'stripe') {
      // Stripe refund
      if (!stripe) {
        return res.status(400).json({ message: 'Stripe is not configured on this server.' });
      }
      await stripe.refunds.create({
        payment_intent: payment.provider_id,
        reason: 'requested_by_customer'
      });
    }

    // Insert refund log
    await db.query(
      'INSERT INTO refunds (payment_id, amount, reason, status) VALUES ($1, $2, $3, $4)',
      [paymentId, payment.amount, reason || 'Refund requested', 'processed']
    );

    // Update payment status
    await db.query('UPDATE payments SET status = $1 WHERE id = $2', ['refunded', paymentId]);

    // Cancel matching booking
    await db.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [payment.reference_id]);

    res.json({ status: 'success', message: 'Refund processed successfully and booking cancelled' });
  } catch (error) {
    console.error('[REFUND ERROR]:', error.message);
    res.status(500).json({ message: 'Refund transaction failed', error: error.message });
  }
};

// @desc    Confirm Payment (Securely verify mock payments for development ONLY)
// @route   POST /api/payments/confirm
exports.confirmPayment = async (req, res) => {
  const { bookingId, paymentMethod, amount, transactionId } = req.body;

  // Protect against non-verified checkout updates in production environment
  if (process.env.NODE_ENV === 'production' && paymentMethod !== 'wallet') {
    return res.status(403).json({
      message: 'Direct booking updates are disabled in production. Payments must use verified gateway callbacks.'
    });
  }

  try {
    const bookingRes = await db.query(
      "UPDATE bookings SET status = 'confirmed' WHERE id = $1 RETURNING *",
      [bookingId]
    );

    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookingRes.rows[0];
    const txnId = transactionId || `TXN_${Date.now()}`;

    // Log the payment
    const paymentRes = await db.query(
      'INSERT INTO payments (user_id, provider, provider_id, amount, currency, status, payment_type, reference_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [req.user.id, paymentMethod, txnId, amount, 'USD', 'succeeded', 'tour_booking', bookingId]
    );

    // Platform commission
    const platformFee = amount * 0.15;
    const guideAmount = amount - platformFee;
    await db.query(
      'INSERT INTO commissions (payment_id, total_amount, platform_fee, guide_amount) VALUES ($1, $2, $3, $4)',
      [paymentRes.rows[0].id, amount, platformFee, guideAmount]
    );

    res.json({ status: 'success', message: 'Booking confirmed successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
};

// @desc    Create PayPal Order (Placeholder)
// @route   POST /api/payments/paypal/create-order
exports.createPaypalOrder = async (req, res) => {
  res.status(501).json({ message: 'PayPal integration is not fully configured on this server.' });
};
