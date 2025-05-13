// Mock Razorpay interface for TypeScript
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: any) => void) => void;
    };
  }
}

// Dynamically load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initializeRazorpay = async (
  options: {
    orderId: string;
    amount: number;
    name: string;
    phone: string;
    email?: string;
  },
  onSuccess: (paymentId: string, orderId: string, signature: string) => void,
  onFailure: (error: any) => void
) => {
  // Check if Razorpay is loaded
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onFailure(new Error('Razorpay SDK failed to load'));
    return;
  }

  // Razorpay options
  const razorpayOptions: RazorpayOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    amount: options.amount * 100, // Convert to paise
    currency: 'INR',
    name: 'FreshCuts',
    description: 'Purchase from FreshCuts',
    image: '/meat-icon.svg',
    order_id: options.orderId,
    handler: function (response) {
      onSuccess(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    },
    prefill: {
      name: options.name,
      contact: options.phone,
      email: options.email,
    },
    theme: {
      color: '#10B981',
    },
  };

  // Create new Razorpay instance
  try {
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', onFailure);
    rzp.open();
  } catch (error) {
    onFailure(error);
  }
};