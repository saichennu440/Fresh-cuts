import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useToast } from '../contexts/ToastContext';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.substring(1));
    const token = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (type !== 'recovery' || !token) {
      showToast('Invalid or expired link', 'error');
      navigate('/login');
      return;
    }

    setAccessToken(token);
    setLoading(false);
  }, [navigate, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !accessToken) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      console.error(error);
      showToast('Couldn’t reset password. Try again.', 'error');
    } else {
      showToast('Password reset! Please log in.', 'success');
      navigate('/login');
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Set a New Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">New Password</span>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-medium ${
              loading ? 'bg-gray-400' : 'bg-sea-500 hover:bg-sea-600'
            }`}
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
