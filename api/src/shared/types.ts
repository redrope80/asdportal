export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    customerCode: string;
    role: 'customer' | 'admin';
    passwordHash?: string;
    createdAt: Date;
    lastLoginAt?: Date;
}

export interface NewsItem {
    id: string;
    title: string;
    content: string;
    summary: string;
    imageUrl?: string;
    publishedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
    authorId: string;
    authorName?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    shortDescription: string;
    price: number;
    categoryId: string;
    categoryName?: string;
    images: ProductImage[];
    specifications: ProductSpecification[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
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

export interface Order {
    id: string;
    orderNumber: string;
    customerCode: string;
    customerName: string;
    orderDate: Date;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress: Address;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
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

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
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