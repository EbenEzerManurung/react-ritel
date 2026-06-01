import { useState, useEffect } from 'react';
import axios from 'axios';
import { UsersIcon, ShoppingBagIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function DashboardContent({ userRole }) {
  const [stats, setStats] = useState({ customers: 0, products: 0, transactions: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const role = localStorage.getItem('userRole');
        const [customersRes, productsRes, transactionsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/customers?page=1&limit=1', { headers: { 'X-User-Role': role || '' } }),
          axios.get('http://localhost:8080/api/produk?page=1&limit=1', { headers: { 'X-User-Role': role || '' } }),
          axios.get('http://localhost:8080/api/transaksi?page=1&limit=100', { headers: { 'X-User-Role': role || '' } }),
        ]);
        const totalRevenue = transactionsRes.data.data?.reduce((sum, t) => sum + t.total_harga, 0) || 0;
        setStats({
          customers: customersRes.data.total || 0,
          products: productsRes.data.total || 0,
          transactions: transactionsRes.data.total || 0,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-600 text-sm">Total Customer</p><p className="text-2xl font-bold mt-1">{stats.customers}</p></div>
            <UsersIcon className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-600 text-sm">Total Produk</p><p className="text-2xl font-bold mt-1">{stats.products}</p></div>
            <ShoppingBagIcon className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-600 text-sm">Total Transaksi</p><p className="text-2xl font-bold mt-1">{stats.transactions}</p></div>
            <CurrencyDollarIcon className="h-10 w-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-600 text-sm">Total Pendapatan</p><p className="text-2xl font-bold mt-1">Rp {stats.revenue.toLocaleString('id-ID')}</p></div>
            <ClockIcon className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
