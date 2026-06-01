import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ nama_produk: '', stok_produk: 0 });
  const [prices, setPrices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchProducts(); fetchPrices(); }, []);
  useEffect(() => {
    const filtered = products.filter(p => p.nama_produk?.toLowerCase().includes(search.toLowerCase()));
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [search, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const role = localStorage.getItem('userRole');
      const response = await axios.get('http://localhost:8080/api/produk?page=1&limit=1000', { headers: { 'X-User-Role': role || '' } });
      setProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
    } catch (error) { toast.error('Gagal mengambil data produk'); }
    finally { setLoading(false); }
  };

  const fetchPrices = async () => {
    try {
      const role = localStorage.getItem('userRole');
      const response = await axios.get('http://localhost:8080/api/harga', { headers: { 'X-User-Role': role || '' } });
      setPrices(response.data);
    } catch (error) { console.error('Error fetching prices:', error); }
  };

  const getProductPrice = (productId, type) => {
    const price = prices.find(p => p.id_produk === productId && p.jenis_harga === type);
    return price ? price.harga_produk : 0;
  };

  const exportToExcel = () => {
    const exportData = filteredProducts.map(product => ({
      'ID Produk': product.id_produk,
      'Nama Produk': product.nama_produk,
      'Stok': product.stok_produk,
      'Harga Regular': `Rp ${getProductPrice(product.id_produk, 'R').toLocaleString('id-ID')}`,
      'Harga SW (25%)': `Rp ${getProductPrice(product.id_produk, 'SW').toLocaleString('id-ID')}`,
      'Harga D (35%)': `Rp ${getProductPrice(product.id_produk, 'D').toLocaleString('id-ID')}`
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, `products_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data berhasil diexport');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = localStorage.getItem('userRole');
      if (editingProduct) {
        await axios.put(`http://localhost:8080/api/produk/${editingProduct.id_produk}`, formData, { headers: { 'X-User-Role': role || '' } });
        toast.success('Produk berhasil diupdate');
      } else {
        await axios.post('http://localhost:8080/api/produk', formData, { headers: { 'X-User-Role': role || '' } });
        toast.success('Produk berhasil ditambahkan');
      }
      fetchProducts();
      setShowModal(false);
      resetForm();
    } catch (error) { toast.error('Gagal menyimpan produk'); }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const role = localStorage.getItem('userRole');
        await axios.delete(`http://localhost:8080/api/produk/${id}`, { headers: { 'X-User-Role': role || '' } });
        toast.success('Produk berhasil dihapus');
        fetchProducts();
      } catch (error) { toast.error('Gagal menghapus produk'); }
    }
  };

  const resetForm = () => { setFormData({ nama_produk: '', stok_produk: 0 }); setEditingProduct(null); };
  const openEditModal = (product) => { setEditingProduct(product); setFormData({ nama_produk: product.nama_produk, stok_produk: product.stok_produk }); setShowModal(true); };

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Data Produk</h2>
        <div className="flex gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64" />
          </div>
          <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Export Excel</span>
          </button>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" /><span>Tambah</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Produk</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga Regular</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga SW</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga D</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (<tr key={product.id_produk} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id_produk}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.nama_produk}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stok_produk}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {getProductPrice(product.id_produk, 'R').toLocaleString('id-ID')}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Rp {getProductPrice(product.id_produk, 'SW').toLocaleString('id-ID')}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">Rp {getProductPrice(product.id_produk, 'D').toLocaleString('id-ID')}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-900 mr-3"><PencilIcon className="h-5 w-5" /></button><button onClick={() => handleDelete(product.id_produk)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button></td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (<div className="flex justify-center items-center space-x-2 mt-6"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50">Previous</button><span>Halaman {currentPage} dari {totalPages}</span><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50">Next</button></div>)}
      {showModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg max-w-md w-full p-6"><h3 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h3><form onSubmit={handleSubmit}><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label><input type="text" value={formData.nama_produk} onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })} className="input-field" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Stok</label><input type="number" value={formData.stok_produk} onChange={(e) => setFormData({ ...formData, stok_produk: parseInt(e.target.value) })} className="input-field" min="0" required /></div></div><div className="flex justify-end space-x-3 mt-6"><button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary">Batal</button><button type="submit" className="btn-primary">Simpan</button></div></form></div></div>)}
    </div>
  );
}
