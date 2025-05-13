// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { initializeRazorpay } from '../utils/razorpay';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CreditCard, Info } from 'lucide-react';

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  email: string;
}

const CheckoutPage: React.FC = () => {
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    phone: '',
    address: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Compute cartTotal safely as a number
  const cartTotal = cart.reduce((sum, item) => {
    const priceNum = parseFloat(item.product.price as any) || 0;
    const qtyNum = parseInt(item.quantity as any, 10) || 0;
    return sum + priceNum * qtyNum;
  }, 0);

  useEffect(() => {
    document.title = 'Checkout | FreshCuts';

    if (cart.length === 0) {
      showToast('Your cart is empty', 'info');
      navigate('/cart');
      return;
    }
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [cart, navigate, showToast, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof CheckoutForm]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CheckoutForm> = {};
    let isValid = true;
    if (!form.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      errors.phone = 'Enter a valid 10-digit phone number';
      isValid = false;
    }
    if (!form.address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }
    if (!form.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Enter a valid email';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const createOrder = async (): Promise<number> => {
    if (!user) throw new Error('Not authenticated');

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        total_amount: cartTotal,
        status: 'Pending',
        user_id: user.id,
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    const items = cart.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: parseInt(item.quantity as any, 10) || 0,
      price: parseFloat(item.product.price as any) || 0,
    }));
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(items);
    if (itemsError) throw itemsError;

    return order.id;
  };

  async function createRazorpayOrder(orderId: number): Promise<string> {
    const resp = await fetch('https://fresh-cuts.onrender.com/...'
, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supabaseOrderId: orderId, amount: cartTotal }),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Failed to create Razorpay order: ${errText}`);
    }
    const { razorpayOrderId } = await resp.json();
    return razorpayOrderId;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const orderId = await createOrder();
      const razorpayOrderId = await createRazorpayOrder(orderId);

      initializeRazorpay(
        {
          orderId: razorpayOrderId,
          amount: cartTotal,
          name: form.name,
          phone: form.phone,
          email: form.email,
        },
        async (paymentId, _rzpOrderId, _sig) => {
          try {
            // 1. Update order status
            await supabase
              .from('orders')
              .update({ status: 'Paid', payment_id: paymentId })
              .eq('id', orderId);

            // 2. Clear cart
            clearCart();

            // 3. Notify via WhatsApp (best-effort)
            try {
              const resp = await fetch(
                'https://fresh-cuts.onrender.com/api/notify-whatsapp',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ phone: form.phone, orderId }),
                }
              );
              if (!resp.ok) {
                console.error(
                  'WhatsApp notify failed',
                  await resp.text()
                );
              }
            } catch (err) {
              console.error('WhatsApp notify network error', err);
            }

            // 4. Navigate to success
            navigate('/order-success', {
              state: { orderId, paymentId },
            });
          } catch (err) {
            console.error('Order update failed:', err);
            showToast(
              'Payment succeeded but order update failed',
              'error'
            );
            setIsSubmitting(false);
          }
        },
        async (error) => {
          console.error('Payment failed:', error);
          await supabase
            .from('orders')
            .update({ status: 'Failed' })
            .eq('id', orderId);
          showToast('Payment failed. Please try again.', 'error');
          setIsSubmitting(false);
        }
      );
    } catch (error: any) {
      console.error('Error during checkout:', error);
      showToast(error.message || 'Checkout error', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">
            Shipping Information
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2">Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${
                    formErrors.name
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Your full name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-2">
                  Phone Number *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${
                    formErrors.phone
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="10-digit mobile"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm">
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>
            {/* Email */}
            <div className="mb-6">
              <label className="block mb-2">Email Address *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md ${
                  formErrors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Your email"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm">
                  {formErrors.email}
                </p>
              )}
            </div>
            {/* Address */}
            <div className="mb-6">
              <label className="block mb-2">
                Delivery Address *
              </label>
              <textarea
                name="address"
                rows={3}
                value={form.address}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md ${
                  formErrors.address
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Complete address"
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm">
                  {formErrors.address}
                </p>
              )}
            </div>
            {/* Info */}
            <div className="bg-gray-50 p-4 rounded-md flex items-start mb-6">
              <Info size={20} className="text-blue-500 mr-3" />
              <p className="text-gray-700 text-sm">
                Delivered in 24h. Our courier will call before delivery.
              </p>
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md text-white font-semibold ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                'Processing…'
              ) : (
                <span className="flex items-center justify-center">
                  <CreditCard size={20} className="mr-2" />
                  Proceed to Payment (₹{cartTotal.toFixed(2)})
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>
          <div className="mb-6">
            {cart.map((item) => {
              const priceNum =
                parseFloat(item.product.price as any) || 0;
              const qtyNum =
                parseInt(item.quantity as any, 10) || 0;
              return (
                <div
                  key={item.id}
                  className="flex justify-between py-2"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        item.product.image_url ||
                        'https://via.placeholder.com/50'
                      }
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-md mr-3"
                    />
                    <div>
                      <p className="font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Qty: {qtyNum}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    ₹{(priceNum * qtyNum).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-gray-800 font-semibold">
                Total
              </span>
              <span className="text-xl font-bold">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mt-6 bg-gray-50 p-4 rounded-md text-sm text-gray-600">
            Payment via Razorpay. All cards & UPI accepted.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
