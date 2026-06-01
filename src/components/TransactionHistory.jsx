import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchTransactions(); }, []);
  useEffect(() => {
    const filtered = transactions.filter(t => t.nama_produk?.toLowerCase().includes(search.toLowerCase()) || t.nama_customer?.toLowerCase().includes(search.toLowerCase()));
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [search, transactions]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const role = localStorage.getItem('userRole');
      const response = await axios.get('http://localhost:8080/api/transaksi?page=1&limit=1000', { headers: { 'X-User-Role': role || '' } });
      setTransactions(response.data.data || []);
      setFilteredTransactions(response.data.data || []);
    } catch (error) { toast.error('Gagal mengambil data transaksi'); }
    finally { setLoading(false); }
  };

  const exportToExcel = () => {
    const exportData = filteredTransactions.map(t => ({
      'ID Transaksi': t.id_transaksi,
      'Produk': t.nama_produk,
      'Customer': t.nama_customer,
      'Quantity': t.qty,
      'Total Harga': `Rp ${t.total_harga?.toLocaleString('id-ID')}`,
      'Metode Pembayaran': t.metode_pembayaran?.toUpperCase(),
      'Tanggal': new Date(t.created_at).toLocaleString('id-ID')
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data berhasil diexport');
  };

  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Riwayat Transaksi</h2>
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Cari transaksi..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64" />
          </div>
          <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pembayaran</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.map((t) => (<tr key={t.id_transaksi} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.id_transaksi}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.nama_produk}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.nama_customer}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.qty}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">Rp {t.total_harga?.toLocaleString('id-ID')}</td><td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-xs font-medium ${t.metode_pembayaran === 'cash' ? 'bg-green-100 text-green-800' : t.metode_pembayaran === 'qris' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{t.metode_pembayaran?.toUpperCase()}</span></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.created_at).toLocaleString('id-ID')}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (<div className="flex justify-center items-center space-x-2 mt-6"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50">Previous</button><span>Halaman {currentPage} dari {totalPages}</span><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50">Next</button></div>)}
    </div>
  );
}
