import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { NewsItem } from '../types';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiService.getNews(1, 5);
        setNews(response.items);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Arizona Shower Door
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Your premier destination for custom shower enclosures and glass solutions
            </p>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Access Customer Portal
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Our Services
            </h2>
            <p className="text-lg text-gray-600">
              Discover our comprehensive range of shower door solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Price Book */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Price Book</h3>
              <p className="text-gray-600 mb-4">
                Browse our complete catalog with pricing for Desert Collection, Bypass, and Swing Enclosures
              </p>
              {isAuthenticated ? (
                <Link to="/pricebook" className="btn-primary">
                  View Price Book
                </Link>
              ) : (
                <Link to="/login" className="btn-secondary">
                  Login to View
                </Link>
              )}
            </div>

            {/* Virtual Showroom */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Virtual Showroom</h3>
              <p className="text-gray-600 mb-4">
                Explore detailed photos and descriptions of our beautiful shower enclosures
              </p>
              {isAuthenticated ? (
                <Link to="/showroom" className="btn-primary">
                  Visit Showroom
                </Link>
              ) : (
                <Link to="/login" className="btn-secondary">
                  Login to View
                </Link>
              )}
            </div>

            {/* Order History */}
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Order History</h3>
              <p className="text-gray-600 mb-4">
                Track your recent orders and view order details from the last 30 days
              </p>
              {isAuthenticated ? (
                <Link to="/orders" className="btn-primary">
                  View Orders
                </Link>
              ) : (
                <Link to="/login" className="btn-secondary">
                  Login to View
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest News & Updates
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed about our latest products and company updates
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <div key={item.id} className="news-card">
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {formatDate(item.publishedAt)}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {item.summary}
                    </p>
                    <Link 
                      to={`/news/${item.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help or Have Questions?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team is here to assist you with your shower door needs
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;