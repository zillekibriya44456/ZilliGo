const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../utils/db');

// @desc    Create a Stripe Checkout Session for a Tour
// @route   POST /api/payments/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
  const { tourId, amount, tourTitle } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: tourTitle,
              description: `Booking for ${tourTitle} on ZillGO`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/tour/${tourId}?payment=cancelled`,
      metadata: {
        tourId,
        userId: req.user.id.toString(),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
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
    
    // Fulfill the booking in the database
    const { tourId, userId } = session.metadata;
    await db.query(
      'INSERT INTO bookings (user_id, tour_id, booking_date, booking_time, status, total_amount) VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, $3, $4)',
      [userId, tourId, 'confirmed', session.amount_total / 100]
    );
  }

  res.json({ received: true });
};
