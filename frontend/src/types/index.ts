// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  customerCode: string;
  role: 'customer' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// News Types
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

// Product and Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  categoryId: string;
  categoryName: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  caption?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductSpecification {
  id: string;
  productId: string;
  name: string;
  value: string;
  unit?: string;
  sortOrder: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerCode: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}