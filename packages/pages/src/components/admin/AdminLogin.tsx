import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('adminToken', token);
        onLogin(token);
        navigate('/admin/products');
      } else {
        const data = await res.json().catch(() => ({ error: 'Invalid password' }));
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      console.error(err);
      setError('Network error – check that the API is running');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-8 rounded shadow-md w-full max-w-md ${loading ? 'opacity-50' : ''} cursor-${loading ? 'not-allowed' : 'pointer'}`}
      >
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 disabled' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}
