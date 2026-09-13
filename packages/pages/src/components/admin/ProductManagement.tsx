import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  tagNumber: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  active: boolean;
}

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tagNumber: '',
    name: '',
    description: '',
    category: '',
    imageFile: null as File | null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('tagNumber', formData.tagNumber);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      if (editingId) {
        await axios.put(`/api/admin/products/${editingId}`, formDataToSend, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
      } else {
        await axios.post('/api/admin/products', formDataToSend, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
      }

      setFormData({ tagNumber: '', name: '', description: '', category: '', imageFile: null });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await axios.delete(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await axios.patch(`/api/admin/products/${id}`, { active: !active }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Product Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ tagNumber: '', name: '', description: '', category: '', imageFile: null });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Tag Number"
              value={formData.tagNumber}
              onChange={(e) => setFormData({ ...formData, tagNumber: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
              className="border rounded px-3 py-2"
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border rounded px-3 py-2 mb-4"
            rows={3}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingId ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <p className="text-sm text-gray-600">Tag: {product.tagNumber}</p>
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            <p className="text-sm mb-4">{product.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleActive(product.id, product.active)}
                className={`flex-1 py-1 rounded text-sm ${
                  product.active
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}
              >
                {product.active ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => {
                  setEditingId(product.id);
                  setFormData({
                    tagNumber: product.tagNumber,
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    imageFile: null,
                  });
                  setShowForm(true);
                }}
                className="flex-1 bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 bg-red-600 text-white py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
