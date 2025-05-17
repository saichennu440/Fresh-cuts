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
  landmark: string;
  city: string;
  state: 'Andhra Pradesh' | 'Telangana';
  pincode: string;
  country: string;
  addressType: 'home' | 'work' | 'other';
  email: string;
}

export const CheckoutPage: React.FC = () => {
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: 'Andhra Pradesh',
    pincode: '',
    country: 'India',
    addressType: 'home',
    email: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

 // compute totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingTotal = cart.reduce((sum, item) => sum + item.product.shipping_price * item.quantity, 0);
  const packingTotal = cart.reduce((sum, item) => {
    return sum + (item.product.free_packing_pincodes.includes(form.pincode) ? 0 : item.product.packing_price) * item.quantity;
  }, 0);
  const grandTotal = subtotal + shippingTotal + packingTotal;

  useEffect(() => {
    document.title = 'Checkout | FreshCuts';

    if (cart.length === 0) {
      showToast('Your cart is empty', 'info');
      navigate('/cart');
      return;
    }
    if (user?.email) {
      setForm(f => ({ ...f, email: user.email }));
    }
  }, [cart, navigate, showToast, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (formErrors[name as keyof CheckoutForm]) {
      setFormErrors(f => ({ ...f, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CheckoutForm> = {};
    let ok = true;
    if (!form.name.trim()) { errors.name = 'Name is required'; ok = false; }
    if (!/^\d{10}$/.test(form.phone)) { errors.phone = 'Enter a valid 10-digit phone'; ok = false; }
    if (!form.address.trim()) { errors.address = 'Address is required'; ok = false; }
    if (!form.city.trim())    { errors.city = 'City is required'; ok = false; }
    if (!form.state.trim())   { errors.state = 'State is required'; ok = false; }
    if (!/^\d{5,6}$/.test(form.pincode)) { errors.pincode = 'Enter valid PIN code'; ok = false; }
     if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { errors.email = 'Valid email is required'; ok = false; }
    setFormErrors(errors);
    return ok;
  };

  const createOrder = async (): Promise<number> => {
    if (!user) throw new Error('Not authenticated');
    // 1) insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: form.name,
        phone: form.phone,
        address: `${form.address}, ${form.landmark ? form.landmark + ', ' : ''}${form.city}, ${form.state} ${form.pincode}, ${form.country}`,
        address_type: form.addressType,
        total_amount: grandTotal,
        status: 'Pending',
        user_id: user.id,
      })
      .select('id')
      .single();
    if (orderError) throw orderError;

    // 2) insert items
    const items = cart.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: parseInt(item.quantity as any, 10) || 0,
      price: parseFloat(item.product.price as any) || 0,
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(items);
    if (itemsError) throw itemsError;

    return order.id;
  };

  async function createRazorpayOrder(orderId: number): Promise<string> {
    const resp = await fetch(
      'https://fresh-cuts.onrender.com/api/create-razorpay-order',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseOrderId: orderId, amount: grandTotal }),
      }
    );
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Failed to create Razorpay order: ${text}`);
    }
    const { razorpayOrderId } = await resp.json();
    return razorpayOrderId;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderId = await createOrder();
      const razorpayOrderId = await createRazorpayOrder(orderId);

       initializeRazorpay(
        {
          orderId: razorpayOrderId,
          amount: grandTotal,
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
        {/* Shipping */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit}>

            {/* Name, Email, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                { label: 'Full Name*', name: 'name', type: 'text' },
                { label: 'Email*', name: 'email', type: 'email' },
                { label: 'Phone*', name: 'phone', type: 'tel' },
              ].map(fld => (
                <div key={fld.name}>
                  <label className="block mb-2">{fld.label}</label>
                  <input
                    name={fld.name}
                    type={fld.type}
                    value={(form as any)[fld.name]}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors[fld.name as keyof CheckoutForm] ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {formErrors[fld.name as keyof CheckoutForm] && (
                    <p className="text-red-500 text-sm">{formErrors[fld.name as keyof CheckoutForm]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Address Type */}
            <div className="mb-6">
              <label className="block mb-2">Address Type</label>
              <select
                name="addressType"
                value={form.addressType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Street & Landmark */}
            <div className="mb-6">
              <label className="block mb-2">Street Address *</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Street, building, etc."
                required
              />
              {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}
            </div>
            <div className="mb-6">
              <label className="block mb-2">Landmark</label>
              <input
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Nearby landmark (optional)"
              />
            </div>

            {/* City / State / PIN */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block mb-2">City*</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {formErrors.city && <p className="text-red-500 text-sm">{formErrors.city}</p>}
              </div>
              <div>
                <label className="block mb-2">State*</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                </select>
                {formErrors.state && <p className="text-red-500 text-sm">{formErrors.state}</p>}
              </div>
              <div>
                <label className="block mb-2">PIN Code*</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${formErrors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {formErrors.pincode && <p className="text-red-500 text-sm">{formErrors.pincode}</p>}
              </div>

            
            </div>

            {/* Country */}
            <div className="mb-6">
              <label className="block mb-2">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            {/* Info note */}
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
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                'Processing…'
              ) : (
                <span className="flex items-center justify-center">
                  <CreditCard size={20} className="mr-2" />
                  Proceed to Payment (₹{grandTotal.toFixed(2)})
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Summary */}
      
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between py-2">
                <div className="flex items-center">
                  <img src={item.product.image_url} alt={item.product.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p>Base: ₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  <p>Ship: ₹{(item.product.shipping_price * item.quantity).toFixed(2)}</p>
                  <p>Pack: ₹{((item.product.free_packing_pincodes.includes(form.pincode) ? 0 : item.product.packing_price) * item.quantity).toFixed(2)}</p>
                  <p className="font-semibold">₹{((item.product.price + item.product.shipping_price + (item.product.free_packing_pincodes.includes(form.pincode) ? 0 : item.product.packing_price)) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping Total</span><span>₹{shippingTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Packing Total</span><span>₹{packingTotal.toFixed(2)}</span></div>
            <div className="border-t pt-2 flex justify-between"><span className="font-semibold">Total</span><span className="text-xl font-bold">₹{grandTotal.toFixed(2)}</span></div>
          </div>
          <div className="mt-6 bg-gray-50 p-4 rounded-md text-sm text-gray-600"><Info size={16} className="mr-2 inline-block"/>Payment via Razorpay. All cards & UPI accepted.</div>
        </div>
        </div>
      </div>
    
  );
};

export default CheckoutPage;
