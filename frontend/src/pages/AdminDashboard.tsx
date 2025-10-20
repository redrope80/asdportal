import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">
            Manage news, products, and customer information
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">News Management</h3>
            <p className="text-gray-600 mb-4">Create and manage news articles</p>
            <button className="btn-primary">Manage News</button>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Product Management</h3>
            <p className="text-gray-600 mb-4">Add and edit product catalog</p>
            <button className="btn-primary">Manage Products</button>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Management</h3>
            <p className="text-gray-600 mb-4">View and manage customer accounts</p>
            <button className="btn-primary">Manage Customers</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;