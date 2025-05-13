import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useToast } from '../../contexts/ToastContext';
import { Search, ChevronDown, ChevronUp, Phone, Mail, MapPin } from 'lucide-react';
import { Database } from '../../utils/database.types';

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

const orderStatuses = [
  'Pending',
  'Paid',
  'Packed',
  'Out for Delivery',
  'Delivered',
  'Failed',
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orderBy, setOrderBy] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: 'created_at',
    direction: 'desc',
  });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Manage Orders | Admin Dashboard';
    fetchOrders();
  }, []);

  // Filter and sort orders whenever filters change
  useEffect(() => {
    if (!orders.length) return;

    let result = [...orders];

    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(search) ||
          order.customer_name.toLowerCase().includes(search) ||
          order.phone.includes(search)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      if (orderBy.column === 'created_at') {
        comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (orderBy.column === 'total_amount') {
        comparison = a.total_amount - b.total_amount;
      } else if (orderBy.column === 'customer_name') {
        comparison = a.customer_name.localeCompare(b.customer_name);
      }

      return orderBy.direction === 'asc' ? comparison : -comparison;
    });

    setFilteredOrders(result);
  }, [orders, statusFilter, searchTerm, orderBy]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(name, image_url, category))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (column: string) => {
    setOrderBy((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Send WhatsApp notification (simulated)
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        console.log(`Sending WhatsApp notification to ${order.phone} about status update to ${newStatus}`);
      }
      
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Failed to update order status', 'error');
    }
  };

  const handleSendWhatsAppNotification = (phone: string, orderId: string) => {
    // Simulated WhatsApp notification - would integrate with actual WhatsApp Business API
    const message = `Update about your order ${orderId.toString().slice(0, 8).toUpperCase()} from FreshCuts`;
    const whatsappUrl = `https://wa.me/91${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast('WhatsApp notification link opened', 'success');
  };

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
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, order ID, or phone..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="All">All Statuses</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          
          {/* Order Count */}
          <div className="flex items-center justify-end">
            <span className="text-gray-500">
              Showing <span className="font-semibold">{filteredOrders.length}</span> of{' '}
              <span className="font-semibold">{orders.length}</span> orders
            </span>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No orders found</p>
            <p className="text-sm mt-2">Try changing your search filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => toggleSort('created_at')}
                    >
                      Order Date & ID
                      {orderBy.column === 'created_at' ? (
                        orderBy.direction === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      ) : null}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => toggleSort('customer_name')}
                    >
                      Customer
                      {orderBy.column === 'customer_name' ? (
                        orderBy.direction === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      ) : null}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => toggleSort('total_amount')}
                    >
                      Total
                      {orderBy.column === 'total_amount' ? (
                        orderBy.direction === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      ) : null}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        expandedOrder === order.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          #{order.id.toString().slice(0, 8).toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">{order.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            order.status === 'Delivered' || order.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'Failed'
                              ? 'bg-red-100 text-red-800'
                              : order.status === 'Packed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ₹{order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            {/* Customer Details */}
                            <div>
                              <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer Details</h3>
                              <div className="bg-white p-4 rounded-md shadow-sm">
                                <div className="flex items-start mb-2">
                                  <User size={18} className="text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">{order.customer_name}</p>
                                  </div>
                                </div>
                                <div className="flex items-start mb-2">
                                  <Phone size={18} className="text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p>{order.phone}</p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendWhatsAppNotification(order.phone, order.id);
                                      }}
                                      className="text-green-600 text-sm hover:text-green-800 mt-1"
                                    >
                                      Send WhatsApp Notification
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <MapPin size={18} className="text-gray-400 mr-2 mt-0.5" />
                                  <p className="text-gray-600">{order.address}</p>
                                </div>
                              </div>
                            </div>

                            {/* Order Details */}
                            <div>
                              <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Details</h3>
                              <div className="bg-white p-4 rounded-md shadow-sm">
                                <div className="grid grid-cols-2 gap-y-2">
                                  <p className="text-gray-500">Order ID:</p>
                                  <p className="font-medium">#{order.id.toString().slice(0, 8).toUpperCase()}</p>
                                  
                                  <p className="text-gray-500">Date:</p>
                                  <p>{formatDate(order.created_at)}</p>
                                  
                                  <p className="text-gray-500">Status:</p>
                                  <p>{order.status}</p>
                                  
                                  <p className="text-gray-500">Payment ID:</p>
                                  <p>{order.payment_id || 'N/A'}</p>
                                  
                                  <p className="text-gray-500">Total Amount:</p>
                                  <p className="font-medium">₹{order.total_amount.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Items</h3>
                          <div className="bg-white rounded-md shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subtotal
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {order.items.map((item) => (
                                  <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                          <img
                                            className="h-10 w-10 rounded-md object-cover"
                                            src={item.product.image_url || 'https://via.placeholder.com/40'}
                                            alt={item.product.name}
                                            onError={(e) => {
                                              e.currentTarget.src = 'https://via.placeholder.com/40';
                                            }}
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            {item.product.name}
                                          </div>
                                          <div className="text-xs text-gray-500 capitalize">
                                            {item.product.category}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      ₹{item.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal component for TypeScript type
const User: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default AdminOrders;