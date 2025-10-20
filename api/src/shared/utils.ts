import { ApiResponse } from './types';

export function createResponse<T>(
    success: boolean, 
    data?: T, 
    message?: string, 
    error?: string
): ApiResponse<T> {
    return {
        success,
        data,
        message,
        error
    };
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return createResponse(true, data, message);
}

export function createErrorResponse(error: string): ApiResponse<null> {
    return createResponse(false, null, undefined, error);
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateRequired(value: any, fieldName: string): string | null {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        return `${fieldName} is required`;
    }
    return null;
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

export function generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ASD-${timestamp.slice(-6)}-${random}`;
}

export function parseIntOrDefault(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}