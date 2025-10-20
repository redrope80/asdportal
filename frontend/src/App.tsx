import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import PriceBook from './pages/PriceBook';
import VirtualShowroom from './pages/VirtualShowroom';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import NewsDetail from './pages/NewsDetail';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              
              {/* Protected Routes */}
              <Route
                path="/pricebook"
                element={
                  <ProtectedRoute>
                    <PriceBook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/showroom"
                element={
                  <ProtectedRoute>
                    <VirtualShowroom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;