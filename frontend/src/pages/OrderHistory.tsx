import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { Order } from '../types';

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.customerCode) return;
      
      try {
        const ordersData = await apiService.getCustomerOrders(user.customerCode, 30);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClass = 'px-2 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'pending': return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'processing': return `${baseClass} bg-blue-100 text-blue-800`;
      case 'shipped': return `${baseClass} bg-purple-100 text-purple-800`;
      case 'delivered': return `${baseClass} bg-green-100 text-green-800`;
      case 'cancelled': return `${baseClass} bg-red-100 text-red-800`;
      default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order History</h1>
          <p className="text-lg text-gray-600">
            View your recent orders from the last 30 days
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't placed any orders in the last 30 days.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.productName}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {item.productSku} • Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            ${item.totalPrice.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${item.unitPrice.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">Notes: </span>
                      <span className="text-gray-600">{order.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;