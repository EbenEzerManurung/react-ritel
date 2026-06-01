import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

export default function CustomerList({ userRole }) {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ custcd: '', nama_customer: '', address: '', phone: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchCustomers(); }, []);
  useEffect(() => {
    const filtered = customers.filter(c => c.nama_customer?.toLowerCase().includes(search.toLowerCase()) || c.custcd?.toLowerCase().includes(search.toLowerCase()));
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [search, customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const role = localStorage.getItem('userRole');
      const response = await axios.get('http://localhost:8080/api/customers?page=1&limit=1000', { headers: { 'X-User-Role': role || '' } });
      setCustomers(response.data.data || []);
      setFilteredCustomers(response.data.data || []);
    } catch (error) { toast.error('Gagal mengambil data customer'); }
    finally { setLoading(false); }
  };

  const exportToExcel = () => {
    const exportData = filteredCustomers.map(customer => ({
      'Kode Customer': customer.custcd,
      'Nama Customer': customer.nama_customer,
      'Alamat': customer.address || '-',
      'Telepon': customer.phone || '-'
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, `customers_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data berhasil diexport');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = localStorage.getItem('userRole');
      if (editingCustomer) {
        await axios.put(`http://localhost:8080/api/customers/${editingCustomer.custcd}`, formData, { headers: { 'X-User-Role': role || '' } });
        toast.success('Customer berhasil diupdate');
      } else {
        await axios.post('http://localhost:8080/api/customers', formData, { headers: { 'X-User-Role': role || '' } });
        toast.success('Customer berhasil ditambahkan');
      }
      fetchCustomers();
      setShowModal(false);
      resetForm();
    } catch (error) { toast.error('Gagal menyimpan customer'); }
  };

  const handleDelete = async (custcd) => {
    if (confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      try {
        const role = localStorage.getItem('userRole');
        await axios.delete(`http://localhost:8080/api/customers/${custcd}`, { headers: { 'X-User-Role': role || '' } });
        toast.success('Customer berhasil dihapus');
        fetchCustomers();
      } catch (error) { toast.error('Gagal menghapus customer'); }
    }
  };

  const resetForm = () => { setFormData({ custcd: '', nama_customer: '', address: '', phone: '' }); setEditingCustomer(null); };
  const openEditModal = (customer) => { setEditingCustomer(customer); setFormData({ custcd: customer.custcd, nama_customer: customer.nama_customer, address: customer.address, phone: customer.phone }); setShowModal(true); };

  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Data Customer</h2>
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Cari customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64" />
          </div>
          <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Export Excel</span>
          </button>
          {userRole === 'admin' && (
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Tambah</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telepon</th>
                {userRole === 'admin' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.custcd} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.custcd}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.nama_customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.address?.substring(0, 50)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.phone || '-'}</td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => openEditModal(customer)} className="text-blue-600 hover:text-blue-900 mr-3">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(customer.custcd)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50">Previous</button>
          <span>Halaman {currentPage} dari {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50">Next</button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">{editingCustomer ? 'Edit Customer' : 'Tambah Customer'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Customer</label>
                  <input type="text" value={formData.custcd} onChange={(e) => setFormData({ ...formData, custcd: e.target.value })} className="input-field" disabled={!!editingCustomer} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Customer</label>
                  <input type="text" value={formData.nama_customer} onChange={(e) => setFormData({ ...formData, nama_customer: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-field" rows="3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Batal</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
