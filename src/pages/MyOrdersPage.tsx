import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ChevronRight, Package, Search, Truck, CheckCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface OrderItem {
  id: string;
  product_id: string;
  order_id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url: string;
    category: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  status: string;
  payment_id: string | null;
  items: OrderItem[];
}

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'My Orders | FreshCuts';
    
    if (user) {
      // If user is logged in, fetch their orders directly
      fetchOrders();
      setPhoneVerified(true);
    }
  }, [user]);

  const fetchOrders = async (phone?: string) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(name, image_url, category))')
        .order('created_at', { ascending: false });
      
      // Filter by user_id if logged in or by phone if provided
      if (user) {
        query = query.eq('user_id', user.id);
      } else if (phone) {
        query = query.eq('phone', phone);
      } else {
        throw new Error('User not authenticated or phone not provided');
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyPhone = () => {
    // Simple validation for 10-digit phone number
    if (!/^\d{10}$/.test(phoneInput)) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }
    
    setPhoneVerified(true);
    fetchOrders(phoneInput);
  };

  const toggleOrderDetails = (orderId: string) => {
    setActiveOrder(activeOrder === orderId ? null : orderId);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
      case 'packed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Packed</span>;
      case 'out for delivery':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Out for Delivery</span>;
      case 'delivered':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>;
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Package className="text-yellow-500" size={20} />;
      case 'packed':
        return <Package className="text-blue-500" size={20} />;
      case 'out for delivery':
        return <Truck className="text-purple-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'paid':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  // Setup realtime subscription to orders
  useEffect(() => {
    if (!user && !phoneVerified) return;

    const subscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders', 
          filter: user ? `user_id=eq.${user.id}` : `phone=eq.${phoneInput}`
        }, 
        (payload) => {
          // Update orders when a status changes
          setOrders((currentOrders) => 
            currentOrders.map((order) => 
              order.id === payload.new.id 
                ? { ...order, ...payload.new } 
                : order
            )
          );
          
          showToast(`Order status updated to: ${payload.new.status}`, 'info');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, phoneVerified, phoneInput, showToast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {!phoneVerified && !user ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">Verify Your Phone Number</h2>
          <p className="text-gray-600 mb-6">
            Enter your phone number to view your order history.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Enter your 10-digit phone number"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <button
              onClick={verifyPhone}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition sm:whitespace-nowrap"
            >
              View Orders
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-8 bg-gray-300 w-1/3 mb-6 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="h-6 bg-gray-300 w-1/4 mb-4 rounded"></div>
                <div className="h-4 bg-gray-300 w-2/3 mb-2 rounded"></div>
                <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Package size={64} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">No Orders Found</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg overflow-hidden">
                  {/* Order Header */}
                  <div 
                    className="p-4 bg-gray-50 flex flex-wrap items-center justify-between cursor-pointer"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-medium">Order #{order.id.toString().slice(0, 8).toUpperCase()}</h3>
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(order.status)}
                      <span className="font-semibold">₹{order.total_amount.toFixed(2)}</span>
                      <ChevronRight 
                        size={20} 
                        className={`transform transition-transform ${activeOrder === order.id ? 'rotate-90' : ''}`} 
                      />
                    </div>
                  </div>
                  
                  {/* Order Details */}
                  {activeOrder === order.id && (
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                          <p className="text-gray-800">{order.customer_name}</p>
                          <p className="text-gray-800">{order.phone}</p>
                          <p className="text-gray-800">{order.address}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Order Information</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-gray-500">Status:</p>
                            <p className="text-gray-800 capitalize">{order.status}</p>
                            
                            <p className="text-gray-500">Payment ID:</p>
                            <p className="text-gray-800">
                              {order.payment_id || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center border-b pb-3">
                            <img
                              src={item.product.image_url || 'https://via.placeholder.com/50'}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-md mr-4"
                            />
                            <div className="flex-grow">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.quantity} × ₹{item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">₹{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;