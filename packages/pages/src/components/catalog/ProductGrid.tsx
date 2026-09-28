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

export const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products', {
          params: selectedCategory ? { category: selectedCategory } : {},
        });
        setProducts(response.data);
        
        // Extract unique categories
        const cats = [...new Set(response.data.map((p: Product) => p.category))] as string[];
        setCategories(cats);
      } catch (error: any) {
        console.error('Failed to fetch products:', error);
        setError(
          error.response?.data?.error ||
            error.message ||
            'Failed to load products. Please check your connection.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Lone Crafts Catalog</h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
          <p className="text-red-700">
            <strong>Error loading products:</strong> {error}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Please ensure the API server is running and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Lone Crafts Catalog</h1>

      {/* Category Filter */}
      <div className="mb-8 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded ${
            selectedCategory === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">Tag: {product.tagNumber}</p>
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  View Details
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
};
