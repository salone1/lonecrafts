import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductGrid } from './components/catalog/ProductGrid';
import { Cart } from './components/catalog/Cart';
import { ProductManagement } from './components/admin/ProductManagement';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { BillingSystem } from './components/admin/BillingSystem';
import AdminLogin from './components/admin/AdminLogin';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = (token: string) => {
    localStorage.setItem('adminToken', token);
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Lone Crafts</h1>
            <div className="flex gap-4">
              {isAdmin ? (
                <>
                  <a href="/admin/products" className="text-blue-600 hover:text-blue-800">
                    Products
                  </a>
                  <a href="/admin/customers" className="text-blue-600 hover:text-blue-800">
                    Customers
                  </a>
                  <a href="/admin/billing" className="text-blue-600 hover:text-blue-800">
                    Billing
                  </a>
                  <button
                    onClick={handleAdminLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/" className="text-blue-600 hover:text-blue-800">
                    Shop
                  </a>
                  <a href="/cart" className="text-blue-600 hover:text-blue-800">
                    Cart
                  </a>
                  <a href="/admin-login" className="text-blue-600 hover:text-blue-800">
                    Admin
                  </a>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<ProductGrid />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={handleAdminLogin} />} />
          {isAdmin && (
            <>
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/customers" element={<CustomerManagement />} />
              <Route path="/admin/billing" element={<BillingSystem />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
