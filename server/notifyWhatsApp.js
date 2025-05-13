// server/notifyWhatsApp.js

const express = require('express');
const twilio = require('twilio');
require('dotenv').config();

const router = express.Router();

// ————————————————————————————————————————————————
// 1) Twilio setup
// ————————————————————————————————————————————————
const accountSid = process.env.TWILIO_SID;
const authToken  = process.env.TWILIO_TOKEN;
const whatsappFrom =
  process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

if (!accountSid || !authToken) {
  console.error('❌ Missing TWILIO_SID or TWILIO_TOKEN in .env');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

/**
 * helper: send a WhatsApp message via Twilio
 * @param {string} toRaw  – raw user input (may contain spaces, dashes, etc)
 * @param {string} orderId
 * @returns {Promise<object>}  – Twilio message object
 */
async function sendWhatsApp(toRaw, orderId) {
  // strip non‑digits, then ensure E.164
  const digits = String(toRaw).replace(/\D/g, '');
  const e164 =
    digits.startsWith('91')
      ? `whatsapp:+${digits}`
      : `whatsapp:+91${digits}`;

  console.log(`📲  Sending WhatsApp to ${e164}, order ${orderId}`);

  return client.messages.create({
    from: whatsappFrom,
    to:   e164,
    body: `✅ FreshCuts Order Confirmed!\n\nYour order (${orderId}) was successfully placed. We’ll update you when it’s out for delivery.`,
  });
}

// ————————————————————————————————————————————————
// 2) POST /api/notify-whatsapp
// ————————————————————————————————————————————————
router.post('/notify-whatsapp', async (req, res) => {
  const { phone, orderId } = req.body;

  if (!phone || !orderId) {
    return res.status(400).json({
      error: 'Both `phone` and `orderId` must be supplied in the JSON body.'
    });
  }

  try {
    const msg = await sendWhatsApp(phone, orderId);
    console.log('✅ Twilio SID:', msg.sid);
    return res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error('❌ Twilio error:', err);
    return res.status(502).json({
      error:   'Failed to send WhatsApp message.',
      details: err.message
    });
  }
});

module.exports = router;
