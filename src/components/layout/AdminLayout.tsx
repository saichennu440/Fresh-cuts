import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Clipboard,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                to="/admin"
                className="flex items-center px-6 py-3 hover:bg-gray-700"
              >
                <LayoutDashboard size={18} className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="flex items-center px-6 py-3 hover:bg-gray-700"
              >
                <Package size={18} className="mr-3" />
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center px-6 py-3 hover:bg-gray-700"
              >
                <Clipboard size={18} className="mr-3" />
                Orders
              </Link>
            </li>
            <li className="border-t border-gray-700 mt-6">
              <Link
                to="/"
                className="flex items-center px-6 py-3 hover:bg-gray-700"
              >
                <ArrowLeft size={18} className="mr-3" />
                Go to Site
              </Link>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full text-left px-6 py-3 hover:bg-gray-700"
              >
                <LogOut size={18} className="mr-3" />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow z-10">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>

        {/* Page Content */}
        <main className="p-6 mt-0 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
