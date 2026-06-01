import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function TransactionForm() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedPriceType, setSelectedPriceType] = useState('R');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const role = localStorage.getItem('userRole');
    try {
      const [productsRes, customersRes, pricesRes] = await Promise.all([
        axios.get('http://localhost:8080/api/produk?page=1&limit=100', { headers: { 'X-User-Role': role } }),
        axios.get('http://localhost:8080/api/customers?page=1&limit=100', { headers: { 'X-User-Role': role } }),
        axios.get('http://localhost:8080/api/harga', { headers: { 'X-User-Role': role } }),
      ]);
      setProducts(productsRes.data.data || []);
      setCustomers(customersRes.data.data || []);
      setPrices(pricesRes.data);
    } catch (error) { toast.error('Gagal mengambil data'); }
  };

  const getProductPrice = () => {
    const price = prices.find(p => p.id_produk === parseInt(selectedProduct) && p.jenis_harga === selectedPriceType);
    return price ? price.harga_produk : 0;
  };

  const getProductStock = () => {
    const product = products.find(p => p.id_produk === parseInt(selectedProduct));
    const existingItem = cart.find(item => item.id_produk === parseInt(selectedProduct) && item.jenis_harga === selectedPriceType);
    return product ? product.stok_produk - (existingItem?.qty || 0) : 0;
  };

  const getProductName = () => {
    const product = products.find(p => p.id_produk === parseInt(selectedProduct));
    return product ? product.nama_produk : '';
  };

  const addToCart = () => {
    if (!selectedProduct) { toast.error('Pilih produk terlebih dahulu'); return; }
    const price = getProductPrice();
    const maxStock = getProductStock();
    if (quantity < 1) { toast.error('Quantity minimal 1'); return; }
    if (quantity > maxStock) { toast.error(`Stok tidak mencukupi. Tersisa ${maxStock} unit`); return; }
    const existingIndex = cart.findIndex(item => item.id_produk === parseInt(selectedProduct) && item.jenis_harga === selectedPriceType);
    if (existingIndex !== -1) {
      const newQty = cart[existingIndex].qty + quantity;
      if (newQty > getProductStock() + cart[existingIndex].qty) { toast.error('Total quantity melebihi stok'); return; }
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty = newQty;
      updatedCart[existingIndex].subtotal = newQty * updatedCart[existingIndex].harga_satuan;
      setCart(updatedCart);
    } else {
      setCart([...cart, { id_produk: parseInt(selectedProduct), nama_produk: getProductName(), qty: quantity, harga_satuan: price, jenis_harga: selectedPriceType, subtotal: price * quantity }]);
    }
    setSelectedProduct(''); setQuantity(1); toast.success('Produk ditambahkan ke keranjang');
  };

  const removeFromCart = (index) => { setCart(cart.filter((_, i) => i !== index)); toast.success('Produk dihapus dari keranjang'); };
  const totalHarga = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async () => {
    if (!selectedCustomer) { toast.error('Pilih customer terlebih dahulu'); return; }
    if (cart.length === 0) { toast.error('Tambahkan produk ke keranjang'); return; }
    setLoading(true);
    const role = localStorage.getItem('userRole');
    try {
      for (const item of cart) {
        await axios.post('http://localhost:8080/api/transaksi', { id_produk: item.id_produk, qty: item.qty, custcd: selectedCustomer, metode_pembayaran: paymentMethod, jenis_harga: item.jenis_harga }, { headers: { 'X-User-Role': role } });
      }
      toast.success(`Transaksi berhasil! Total: Rp ${totalHarga.toLocaleString('id-ID')}`);
      setCart([]); setSelectedCustomer(''); setPaymentMethod('cash'); fetchData();
    } catch (error) { toast.error('Gagal melakukan transaksi'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Transaksi Baru</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Informasi Transaksi</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Customer</label>
                <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="input-field">
                  <option value="">Pilih Customer</option>
                  {customers.map(c => (<option key={c.custcd} value={c.custcd}>{c.nama_customer} ({c.custcd})</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field">
                  <option value="cash">Cash</option>
                  <option value="qris">QRIS</option>
                  <option value="transfer">Transfer Bank</option>
                </select>
              </div>
            </div>
            <div className="border-t mt-6 pt-6">
              <h3 className="text-lg font-semibold mb-4">Tambah Produk</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Produk</label>
                  <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="input-field">
                    <option value="">Pilih Produk</option>
                    {products.map(p => (<option key={p.id_produk} value={p.id_produk}>{p.nama_produk} (Stok: {p.stok_produk})</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Harga</label>
                  <select value={selectedPriceType} onChange={(e) => setSelectedPriceType(e.target.value)} className="input-field">
                    <option value="R">Regular</option>
                    <option value="SW">Special Weekday (25% off)</option>
                    <option value="D">Discount (35% off)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))} className="input-field" min="1" />
                </div>
                <div className="flex items-end">
                  <button onClick={addToCart} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                    <PlusIcon className="h-5 w-5" /><span>Tambah ke Keranjang</span>
                  </button>
                </div>
              </div>
              {selectedProduct && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">Harga: <span className="font-bold">Rp {getProductPrice().toLocaleString('id-ID')}</span> / unit</p>
                  <p className="text-sm text-blue-800 mt-1">Stok tersedia: {getProductStock()} unit</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Keranjang Belanja</h3>
            {cart.length === 0 ? <p className="text-gray-500 text-center py-8">Belum ada produk</p> : (
              <div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.nama_produk}</p>
                          <p className="text-sm text-gray-600">{item.qty} x Rp {item.harga_satuan.toLocaleString('id-ID')} = Rp {item.subtotal.toLocaleString('id-ID')}</p>
                        </div>
                        <button onClick={() => removeFromCart(index)} className="text-red-600"><TrashIcon className="h-5 w-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">Rp {totalHarga.toLocaleString('id-ID')}</span>
                  </div>
                  <button onClick={handleSubmit} disabled={loading || cart.length === 0 || !selectedCustomer} className="w-full btn-primary py-3 text-lg disabled:opacity-50">
                    {loading ? 'Memproses...' : `Bayar Rp ${totalHarga.toLocaleString('id-ID')}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
