import { useStore } from '../../store';
import { useState } from 'react';
import axios from 'axios';

export const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();
  const [loading, setLoading] = useState(false);

  const handleOrderNow = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      // Generate WhatsApp message with products
      const messageLines = cart.map(
        (item) =>
          `• ${item.product.name} (Tag: ${item.product.tagNumber}) x ${item.quantity}\nProduct Link: ${window.location.origin}/product/${item.product.id}`
      );

      const message = `Hi! I'd like to order the following items:\n\n${messageLines.join('\n\n')}`;

      // Get WhatsApp number from API
      const settingsResponse = await axios.get('/api/settings');
      const whatsappNumber = settingsResponse.data.whatsappNumber;

      // Redirect to WhatsApp
      const encodedMessage = encodeURIComponent(message);
      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      clearCart();
    } catch (error) {
      console.error('Failed to process order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.product.id} className="border rounded-lg p-4 flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold">{item.product.name}</h3>
              <p className="text-sm text-gray-600">Tag: {item.product.tagNumber}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateCartQuantity(item.product.id, parseInt(e.target.value))
                  }
                  className="w-16 border rounded px-2 py-1"
                />
                <span className="text-sm text-gray-600">Quantity</span>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleOrderNow}
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Order Now via WhatsApp`}
        </button>
        <button
          onClick={clearCart}
          className="flex-1 bg-gray-300 text-gray-800 py-3 rounded hover:bg-gray-400"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};
