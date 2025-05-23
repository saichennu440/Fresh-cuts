import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Forgot Password | FreshCuts';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      console.error(error);
      showToast('Error sending reset email. Try again.', 'error');
    } else {
      showToast('Check your inbox for reset instructions', 'success');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-medium ${
              loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          <Link to="/login" className="text-primary-600 hover:underline">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
