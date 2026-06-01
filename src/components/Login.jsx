import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login({ onLogin }) {
  const [namaUser, setNamaUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        nama_user: namaUser,
        password: password,
      });

      if (response.data.user) {
        localStorage.setItem('token', 'dummy-token');
        localStorage.setItem('userRole', response.data.user.role_user);
        localStorage.setItem('userName', response.data.user.nama_user);
        toast.success('Login berhasil!');
        onLogin(response.data.user.role_user);
      }
    } catch (error) {
      toast.error('Login gagal! Periksa username dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-4xl font-bold">R</span>
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Aplikasi Ritel</h1>
          <p className="text-gray-600 mt-2"></p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input type="text" value={namaUser} onChange={(e) => setNamaUser(e.target.value)} className="input-field" placeholder="Masukkan username" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Masukkan password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-semibold">Demo Account:</p>
          <p>Admin: Admin User / password123</p>
          <p>Kasir: Kasir User / password123</p>
        </div>
      </div>
    </div>
  );
}
