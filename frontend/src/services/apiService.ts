import { NewsItem, Product, Category, Order, ApiResponse, PaginatedResponse } from '../types';

const API_BASE = '/api';

class ApiService {
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response;
  }

  // News API
  async getNews(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<NewsItem>> {
    const response = await this.fetchWithAuth(`${API_BASE}/news?page=${page}&pageSize=${pageSize}`);
    const data = await response.json();
    return data.data;
  }

  async getNewsItem(id: string): Promise<NewsItem> {
    const response = await this.fetchWithAuth(`${API_BASE}/news/${id}`);
    const data = await response.json();
    return data.data;
  }

  // Admin: Create news item
  async createNews(newsData: Partial<NewsItem>): Promise<ApiResponse<NewsItem>> {
    const response = await this.fetchWithAuth(`${API_BASE}/admin/news`, {
      method: 'POST',
      body: JSON.stringify(newsData),
    });
    return response.json();
  }

  // Admin: Update news item
  async updateNews(id: string, newsData: Partial<NewsItem>): Promise<ApiResponse<NewsItem>> {
    const response = await this.fetchWithAuth(`${API_BASE}/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    });
    return response.json();
  }

  // Admin: Delete news item
  async deleteNews(id: string): Promise<ApiResponse<void>> {
    const response = await this.fetchWithAuth(`${API_BASE}/admin/news/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    const response = await this.fetchWithAuth(`${API_BASE}/categories`);
    const data = await response.json();
    return data.data;
  }

  // Products API
  async getProducts(categoryId?: string, page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Product>> {
    let url = `${API_BASE}/products?page=${page}&pageSize=${pageSize}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    const response = await this.fetchWithAuth(url);
    const data = await response.json();
    return data.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.fetchWithAuth(`${API_BASE}/products/${id}`);
    const data = await response.json();
    return data.data;
  }

  // Orders API
  async getCustomerOrders(customerCode: string, days: number = 30): Promise<Order[]> {
    const response = await this.fetchWithAuth(`${API_BASE}/orders/customer/${customerCode}?days=${days}`);
    const data = await response.json();
    return data.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.fetchWithAuth(`${API_BASE}/orders/${id}`);
    const data = await response.json();
    return data.data;
  }

  // Contact API
  async submitContactForm(formData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse<void>> {
    const response = await this.fetchWithAuth(`${API_BASE}/contact`, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return response.json();
  }
}

export const apiService = new ApiService();