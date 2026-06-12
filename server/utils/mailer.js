const nodemailer = require('nodemailer');

// Fallback to avoid crashing if SMTP env vars aren't provided
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'dummy_user',
    pass: process.env.SMTP_PASS || 'dummy_pass',
  },
});

/**
 * Sends a welcome email to new users
 */
exports.sendWelcomeEmail = async (email, name) => {
  if (!process.env.SMTP_USER) {
    console.log(`[Email Mock] Welcome Email sent to ${email}`);
    return;
  }
  
  try {
    await transporter.sendMail({
      from: '"ZilliGo Team" <noreply@zilligo.com>',
      to: email,
      subject: 'Welcome to ZilliGo! 🌍',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #00d4aa;">Welcome, ${name}!</h1>
          <p>We are thrilled to have you join ZilliGo.</p>
          <p>Get ready to explore the world through live and immersive virtual tours!</p>
          <a href="https://zilligo.com/explore" style="display: inline-block; padding: 10px 20px; background: #00d4aa; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Start Exploring</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

/**
 * Sends a booking confirmation
 */
exports.sendBookingConfirmation = async (email, tourTitle, date) => {
  if (!process.env.SMTP_USER) {
    console.log(`[Email Mock] Booking Confirmation sent to ${email} for tour: ${tourTitle}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: '"ZilliGo Bookings" <bookings@zilligo.com>',
      to: email,
      subject: `Booking Confirmed: ${tourTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Your Booking is Confirmed! 🎉</h2>
          <p>You are all set for <strong>${tourTitle}</strong> on ${date}.</p>
          <a href="https://zilligo.com/dashboard" style="display: inline-block; padding: 10px 20px; background: #00d4aa; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">View My Trips</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending booking email:', error);
  }
};
