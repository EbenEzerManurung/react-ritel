import { HomeIcon, UsersIcon, ShoppingBagIcon, CurrencyDollarIcon, ClockIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ userRole, activeMenu, setActiveMenu, onLogout }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, roles: ['admin', 'kasir'] },
    { id: 'customers', name: 'Customer', icon: UsersIcon, roles: ['admin', 'kasir'] },
    { id: 'products', name: 'Produk', icon: ShoppingBagIcon, roles: ['admin'] },
    { id: 'transaction', name: 'Transaksi Baru', icon: CurrencyDollarIcon, roles: ['admin', 'kasir'] },
    { id: 'history', name: 'Riwayat Transaksi', icon: ClockIcon, roles: ['admin', 'kasir'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b flex flex-col items-center text-center">
  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
    <span className="text-white text-xl font-bold">R</span>
  </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">React Ritel</h1>
          <p className="text-xs text-gray-500">Ritel App</p>
        </div>
      </div>
      <div className="p-4 border-b">
        <p className="text-sm text-gray-600">Role: <span className="font-semibold capitalize">{userRole}</span></p>
      </div>
      <nav className="p-4 space-y-2">
        {filteredMenu.map((item) => (
          <button key={item.id} onClick={() => setActiveMenu(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeMenu === item.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </button>
        ))}
        <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4">
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
