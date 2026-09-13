import { useState, useEffect } from 'react';
import axios from 'axios';

interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  subtotal: number;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
}

interface Bill {
  id: string;
  customerId: string;
  billNumber: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  total: number;
  payments: Payment[];
  outstanding: number;
}

export const BillingSystem = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, productsRes] = await Promise.all([
          axios.get('/api/admin/customers', {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
          }),
          axios.get('/api/admin/products', {
            headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
          }),
        ]);
        setCustomers(customersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerBills();
    }
  }, [selectedCustomer]);

  const fetchCustomerBills = async () => {
    try {
      const response = await axios.get(
        `/api/admin/customers/${selectedCustomer}/bills`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        }
      );
      setBills(response.data);
    } catch (error) {
      console.error('Failed to fetch bills:', error);
    }
  };

  const handleAddItem = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = billItems.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.quantity * existingItem.rate;
      setBillItems([...billItems]);
    } else {
      setBillItems([
        ...billItems,
        {
          productId,
          productName: product.name,
          quantity: 1,
          rate: 0,
          subtotal: 0,
        },
      ]);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setBillItems(billItems.filter((item) => item.productId !== productId));
  };

  const handleUpdateItem = (
    productId: string,
    field: 'quantity' | 'rate',
    value: number
  ) => {
    const item = billItems.find((i) => i.productId === productId);
    if (!item) return;

    if (field === 'quantity') {
      item.quantity = value;
    } else {
      item.rate = value;
    }
    item.subtotal = item.quantity * item.rate;
    setBillItems([...billItems]);
  };

  const handleCreateBill = async () => {
    if (!selectedCustomer || billItems.length === 0) return;

    try {
      await axios.post(
        '/api/admin/bills',
        {
          customerId: selectedCustomer,
          items: billItems,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        }
      );
      setBillItems([]);
      fetchCustomerBills();
      alert('Bill created successfully!');
    } catch (error) {
      console.error('Failed to create bill:', error);
    }
  };

  const totalAmount = billItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Billing System</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Create Bill */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Create New Bill</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Customer</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Choose a customer...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.phone})
                </option>
              ))}
            </select>
          </div>

          {selectedCustomer && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Add Products</label>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddItem(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 border rounded px-3 py-2"
                  >
                    <option value="">Select product...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Tag: {product.tagNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2">Bill Items</h4>
                {billItems.length === 0 ? (
                  <p className="text-gray-600 text-sm">No items added yet</p>
                ) : (
                  <div className="space-y-2">
                    {billItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-2 items-center border rounded p-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateItem(
                                  item.productId,
                                  'quantity',
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 border rounded px-2 py-1 text-sm"
                            />
                            <span className="text-sm">x</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) =>
                                handleUpdateItem(
                                  item.productId,
                                  'rate',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              placeholder="Rate"
                              className="flex-1 border rounded px-2 py-1 text-sm"
                            />
                            <span className="text-sm">= ₹{item.subtotal.toFixed(2)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4 bg-gray-100 p-3 rounded">
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCreateBill}
                disabled={billItems.length === 0}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Create Bill
              </button>
            </>
          )}
        </div>

        {/* Right Panel: Bill History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Recent Bills</h3>
          {bills.length === 0 ? (
            <p className="text-gray-600 text-sm">No bills created yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bills.slice(0, 10).map((bill) => (
                <div key={bill.id} className="border rounded p-2 text-sm">
                  <p className="font-bold">{bill.billNumber}</p>
                  <p className="text-gray-600">{bill.date}</p>
                  <p className="text-right font-bold mt-1">₹{bill.total}</p>
                  <p className="text-right text-red-600 text-xs">
                    Outstanding: ₹{bill.outstanding}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
