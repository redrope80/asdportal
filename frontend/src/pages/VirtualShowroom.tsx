import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Product, Category } from '../types';

const VirtualShowroom: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          apiService.getCategories(),
          apiService.getProducts(selectedCategory || undefined)
        ]);
        setCategories(categoriesResponse);
        setProducts(productsResponse.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Virtual Showroom</h1>
          <p className="text-lg text-gray-600">
            Explore our beautiful shower enclosures with detailed photos and descriptions
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Collections
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {product.images.length > 0 && (
                <div className="relative">
                  <img 
                    src={product.images[0].url} 
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  {product.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      +{product.images.length - 1} more
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="text-sm text-blue-600 font-medium mb-2">
                  {product.categoryName}
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                {/* Specifications Preview */}
                {product.specifications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {product.specifications.slice(0, 3).map((spec) => (
                        <li key={spec.id}>
                          {spec.name}: {spec.value} {spec.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button className="btn-primary w-full">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this collection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualShowroom;