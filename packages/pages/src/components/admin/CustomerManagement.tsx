import { useState, useEffect } from 'react';
import axios from 'axios';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  totalPayments: number;
  outstandingBalance: number;
  billCount: number;
}

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/admin/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.post('/api/admin/customers', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setFormData({ name: '', email: '', phone: '' });
      setShowForm(false);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to add customer:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Customer Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddCustomer} className="bg-gray-100 p-6 rounded mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Customer
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Phone</th>
              <th className="border border-gray-300 p-2 text-right">Bills</th>
              <th className="border border-gray-300 p-2 text-right">Total Purchases</th>
              <th className="border border-gray-300 p-2 text-right">Total Payments</th>
              <th className="border border-gray-300 p-2 text-right">Outstanding</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{customer.name}</td>
                <td className="border border-gray-300 p-2">{customer.email}</td>
                <td className="border border-gray-300 p-2">{customer.phone}</td>
                <td className="border border-gray-300 p-2 text-right">{customer.billCount}</td>
                <td className="border border-gray-300 p-2 text-right">₹{customer.totalPurchases}</td>
                <td className="border border-gray-300 p-2 text-right">₹{customer.totalPayments}</td>
                <td className="border border-gray-300 p-2 text-right font-bold text-red-600">
                  ₹{customer.outstandingBalance}
                </td>
                <td className="border border-gray-300 p-2">
                  <button className="text-blue-600 hover:text-blue-800">View Bills</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
