// src/pages/OrderSuccessPage.tsx

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, List } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface LocationState {
  orderId: string;
  paymentId: string;
}

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const state = location.state as LocationState;

  const [notificationSent, setNotificationSent] = useState(false);
  const [sendingError, setSendingError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Order Confirmation | FreshCuts';

    if (!state?.orderId) {
      navigate('/');
      return;
    }

    const notifyWhatsApp = async () => {
      try {
        // 1) Look up the phone number in your Supabase "orders" table:
        const { data: order, error: fetchErr } = await supabase
          .from('orders')
          .select('phone')
          .eq('id', state.orderId)
          .single();

        if (fetchErr || !order?.phone) {
          throw new Error(fetchErr?.message || 'No phone number on order');
        }

        // 2) Send to your Express/Twilio endpoint:
        const res = await fetch(
          'https://fresh-cuts.onrender.com/api/notify-whatsapp',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone:   order.phone,
              orderId: state.orderId,
            }),
          }
        );

        if (!res.ok) {
          const errPayload = await res.json().catch(() => ({}));
          throw new Error(
            errPayload.error || 'HTTP ' + res.status
          );
        }

        console.log('✅ WhatsApp notification sent');
        setNotificationSent(true);
      } catch (err: any) {
        console.error('❌ Error sending WhatsApp message:', err);
        setSendingError(err.message || 'Unknown error');
      }
    };

    // only fire once
    if (!notificationSent && !sendingError) {
      notifyWhatsApp();
    }
  }, [state, navigate, notificationSent, sendingError]);

  if (!state?.orderId) return null;

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-primary-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>

        <p className="text-lg text-gray-700 mb-6">
          Your order has been received and is being processed.
        </p>

        <div className="bg-gray-50 p-6 rounded-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <p className="text-gray-600 text-sm mb-1">Order ID</p>
              <p className="font-medium">{state.orderId}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-gray-600 text-sm mb-1">Payment ID</p>
              <p className="font-medium">{state.paymentId}</p>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 p-4 rounded-md mb-8">
          {notificationSent ? (
            <p className="text-primary-800">
              ✅ A confirmation message has been sent to your WhatsApp number.
            </p>
          ) : sendingError ? (
            <p className="text-red-600">
              ❌ Failed to send confirmation: {sendingError}
            </p>
          ) : (
            <p className="text-primary-800">
              ⏳ Sending WhatsApp confirmation...
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/my-orders"
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition flex items-center justify-center"
          >
            <List size={18} className="mr-2" />
            View My Orders
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
          >
            <ShoppingBag size={18} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
