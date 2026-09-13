// Enhanced Billing System for Kashmiri Products Peddler
// Features: PDF generation, WhatsApp sharing, outstanding balance tracking

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
  method: string;
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

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
}

export const BillingSystem = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewBillForm, setShowNewBillForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const [customersRes, productsRes] = await Promise.all([
          axios.get('/api/admin/customers', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/admin/products', {
            headers: { Authorization: `Bearer ${token}` },
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

  // Fetch customer bills when selected
  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerBills();
    }
  }, [selectedCustomer]);

  const fetchCustomerBills = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `/api/admin/customers/${selectedCustomer?.id}/bills`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBills(response.data);
      setSelectedBill(null);
    } catch (error) {
      console.error('Failed to fetch bills:', error);
    }
  };

  // Add item to bill
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

  // Remove item from bill
  const handleRemoveItem = (productId: string) => {
    setBillItems(billItems.filter((item) => item.productId !== productId));
  };

  // Update item quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const item = billItems.find((i) => i.productId === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      item.subtotal = item.quantity * item.rate;
      setBillItems([...billItems]);
    }
  };

  // Update item rate
  const handleUpdateRate = (productId: string, rate: number) => {
    const item = billItems.find((i) => i.productId === productId);
    if (item) {
      item.rate = Math.max(0, rate);
      item.subtotal = item.quantity * item.rate;
      setBillItems([...billItems]);
    }
  };

  // Calculate bill total
  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Create new bill
  const handleCreateBill = async () => {
    if (!selectedCustomer || billItems.length === 0) {
      alert('Please select a customer and add items');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        '/api/admin/bills',
        {
          customerId: selectedCustomer.id,
          items: billItems,
          total: calculateTotal(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Bill created successfully!');
      setBillItems([]);
      setShowNewBillForm(false);
      await fetchCustomerBills();
      
      // Auto-share to WhatsApp
      const billId = response.data.id;
      setTimeout(() => {
        handleShareBillWhatsApp(response.data);
      }, 500);
    } catch (error) {
      console.error('Failed to create bill:', error);
      alert('Error creating bill');
    }
  };

  // Record payment
  const handleRecordPayment = async (bill: Bill) => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Enter valid payment amount');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `/api/admin/bills/${bill.id}/payments`,
        {
          amount: parseFloat(paymentAmount),
          payment_method: paymentMethod,
          reference: `Payment-${Date.now()}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Payment recorded!');
      setPaymentAmount('');
      setShowPaymentForm(false);
      await fetchCustomerBills();
    } catch (error) {
      console.error('Failed to record payment:', error);
      alert('Error recording payment');
    }
  };

  // Generate bill PDF (simple HTML table version)
  const generateBillPDF = (bill: Bill) => {
    const billHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill ${bill.billNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #8B4513; }
          .subtitle { color: #666; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; }
          .total { font-weight: bold; font-size: 16px; }
          .footer { margin-top: 40px; text-align: center; color: #666; }
          .item-row:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🧣 Lone Crafts</div>
          <div class="subtitle">Premium Kashmiri Products</div>
          <div style="margin-top: 20px;">BILL # ${bill.billNumber}</div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Date:</strong> ${new Date(bill.date).toLocaleDateString()}
        </div>
        
        <table>
          <tr>
            <th>Product</th>
            <th style="text-align: right;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
          ${bill.items.map((item) => `
            <tr class="item-row">
              <td>${item.productName}</td>
              <td style="text-align: right;">${item.quantity}</td>
              <td style="text-align: right;">₹${item.rate.toFixed(2)}</td>
              <td style="text-align: right;">₹${item.subtotal.toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="3" style="text-align: right; font-weight: bold;">Subtotal:</td>
            <td style="text-align: right; font-weight: bold;">₹${bill.total.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right; font-weight: bold;">Total Paid:</td>
            <td style="text-align: right; font-weight: bold;">₹${(bill.total - bill.outstanding).toFixed(2)}</td>
          </tr>
          <tr style="background-color: #ffffcc;">
            <td colspan="3" style="text-align: right; font-weight: bold;">Outstanding:</td>
            <td style="text-align: right; font-weight: bold;">₹${bill.outstanding.toFixed(2)}</td>
          </tr>
        </table>
        
        <div class="footer">
          <p>Thank you for your order!</p>
          <p>For queries, contact: WhatsApp Business</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write(billHTML);
    printWindow?.document.close();
    printWindow?.print();
  };

  // Share bill to WhatsApp
  const handleShareBillWhatsApp = (bill: Bill) => {
    const customer = customers.find((c) => c.id === bill.customerId);
    if (!customer) return;

    const billSummary = `
*📄 Bill #${bill.billNumber}*

*Items:*
${bill.items.map((item) => `• ${item.productName} ×${item.quantity} @ ₹${item.rate} = ₹${item.subtotal.toFixed(2)}`).join('\n')}

*Total: ₹${bill.total.toFixed(2)}*
${bill.outstanding > 0 ? `*Outstanding: ₹${bill.outstanding.toFixed(2)}*` : '*Status: PAID ✅*'}

Click below to view full bill details.
    `.trim();

    const whatsappMessage = encodeURIComponent(billSummary);
    const whatsappLink = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${whatsappMessage}`;

    window.open(whatsappLink, '_blank');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">💰 Billing System</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Customer Selection & Balance */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Select Customer</h2>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search customer..."
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-3 border rounded cursor-pointer transition ${
                    selectedCustomer?.id === customer.id
                      ? 'bg-indigo-100 border-indigo-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold">{customer.name}</div>
                  <div className="text-sm text-gray-600">📞 {customer.phone}</div>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>Bills: ₹{customer.totalBilled}</span>
                    <span className="text-green-600">Paid: ₹{customer.totalPaid}</span>
                    <span className={customer.outstanding > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                      Outstanding: ₹{customer.outstanding}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Outstanding Balance Card */}
        {selectedCustomer && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow p-6 border-2 border-red-200">
            <h3 className="text-lg font-bold mb-4 text-red-700">⚠️ Outstanding Balance</h3>
            <div className="text-4xl font-bold text-red-600 mb-4">
              ₹{selectedCustomer.outstanding.toFixed(2)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Billed:</span>
                <span className="font-bold">₹{selectedCustomer.totalBilled.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span className="font-bold text-green-600">₹{selectedCustomer.totalPaid.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create New Bill Section */}
      {selectedCustomer && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📝 Create New Bill</h2>
            <button
              onClick={() => setShowNewBillForm(!showNewBillForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {showNewBillForm ? 'Cancel' : '+ Add Items'}
            </button>
          </div>

          {showNewBillForm && (
            <div>
              {/* Product Selection */}
              <div className="mb-6">
                <h3 className="font-bold mb-3">Available Products:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddItem(product.id)}
                      className="p-3 border rounded hover:bg-indigo-50 text-left"
                    >
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-gray-600">Tag #{product.tag_number}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Items */}
              {billItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Bill Items:</h3>
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Product</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Rate</th>
                        <th className="p-2 text-right">Amount</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billItems.map((item) => (
                        <tr key={item.productId} className="border-t">
                          <td className="p-2">{item.productName}</td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateQuantity(
                                  item.productId,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 px-2 py-1 border rounded text-center"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              min="0"
                              step="10"
                              value={item.rate}
                              onChange={(e) =>
                                handleUpdateRate(
                                  item.productId,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-20 px-2 py-1 border rounded text-right"
                              placeholder="₹"
                            />
                          </td>
                          <td className="p-2 text-right font-bold">
                            ₹{item.subtotal.toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <div className="text-right text-lg font-bold">
                      Total: ₹{calculateTotal().toFixed(2)}
                    </div>
                    <button
                      onClick={handleCreateBill}
                      className="w-full mt-4 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700"
                    >
                      ✅ Create & Share Bill (WhatsApp)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bills History */}
      {selectedCustomer && bills.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">📋 Billing History</h2>
          <div className="space-y-3">
            {bills.map((bill) => (
              <div key={bill.id} className="border rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">Bill #{bill.billNumber}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(bill.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">₹{bill.total.toFixed(2)}</div>
                    <div
                      className={
                        bill.outstanding > 0
                          ? 'text-red-600 font-bold'
                          : 'text-green-600'
                      }
                    >
                      {bill.outstanding > 0
                        ? `Due: ₹${bill.outstanding.toFixed(2)}`
                        : 'PAID ✅'}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => generateBillPDF(bill)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    📥 Download PDF
                  </button>
                  <button
                    onClick={() => handleShareBillWhatsApp(bill)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    📱 Share WhatsApp
                  </button>
                  {bill.outstanding > 0 && (
                    <button
                      onClick={() => {
                        setSelectedBill(bill);
                        setShowPaymentForm(true);
                      }}
                      className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                    >
                      💳 Add Payment
                    </button>
                  )}
                </div>

                {/* Payment Form */}
                {showPaymentForm && selectedBill?.id === bill.id && (
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full px-3 py-2 border rounded mb-2"
                    />
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border rounded mb-2"
                    >
                      <option>UPI</option>
                      <option>Bank Transfer</option>
                      <option>Cash</option>
                      <option>Check</option>
                    </select>
                    <button
                      onClick={() => handleRecordPayment(bill)}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      Record Payment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
