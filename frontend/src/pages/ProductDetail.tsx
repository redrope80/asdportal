import React from 'react';

const ProductDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Details</h1>
            <p className="text-gray-600">Product information will be displayed here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;