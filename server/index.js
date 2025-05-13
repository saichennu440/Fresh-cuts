// server/index.js

require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// ————————————————————————————————————————————————
// Import our new WhatsApp‑notification router
// ————————————————————————————————————————————————
const notifyRouter = require('./notifyWhatsApp');

const app = express();

// parse JSON bodies + enable CORS
app.use(express.json());
app.use(cors());

// mount all /api routes
app.use('/api', notifyRouter);

// ————————————————————————————————————————————————
// Razorpay setup
// ————————————————————————————————————————————————
const razorpay = new Razorpay({
  key_id:     process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
});

// ————————————————————————————————————————————————
// Supabase setup
// ————————————————————————————————————————————————
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -------------------
// Create a Razorpay order
// POST /create-razorpay-order
// -------------------
app.post('/create-razorpay-order', async (req, res) => {
  try {
    const { supabaseOrderId, amount } = req.body;
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),
      currency: 'INR',
      receipt:  `receipt_${supabaseOrderId}`,
    });
    return res.json({ razorpayOrderId: order.id });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    return res.status(500).json({ error: 'Error creating Razorpay order' });
  }
});

// (Optional) If you ever still need a “send‑whatsapp” route that pulls the phone
// from Supabase rather than passing it in, you can do this:
//
// const sendWhatsAppHelper = require('./sendWhatsApp');
// app.post('/api/send-whatsapp', async (req, res) => {
//   const { orderId } = req.body;
//   try {
//     const { data: order, error } = await supabase
//       .from('orders')
//       .select('phone')
//       .eq('id', orderId)
//       .single();
//
//     if (error || !order?.phone) {
//       return res.status(400).json({ error: 'Order not found or missing phone' });
//     }
//
//     const msg = await sendWhatsAppHelper(order.phone, orderId);
//     return res.json({ success: true, sid: msg.sid });
//   } catch (err) {
//     console.error('Error in /api/send-whatsapp:', err);
//     return res.status(502).json({ error: 'Failed to send WhatsApp', details: err.message });
//   }
// });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
