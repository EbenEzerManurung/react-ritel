import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import CustomerList from './CustomerList';
import ProductList from './ProductList';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';

export default function Dashboard({ userRole, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return <DashboardContent userRole={userRole} />;
      case 'customers': return <CustomerList userRole={userRole} />;
      case 'products': return <ProductList />;
      case 'transaction': return <TransactionForm />;
      case 'history': return <TransactionHistory />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole={userRole} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto p-8">{renderContent()}</main>
    </div>
  );
}
