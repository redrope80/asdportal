import { User, ApiResponse } from '../types';

const API_BASE = '/api';

class AuthService {
  // Get current user info from SWA built-in auth
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('/.auth/me');
      const data = await response.json();
      
      if (data.clientPrincipal) {
        // Map SWA user to our User type
        const userResponse = await fetch(`${API_BASE}/users/profile`);
        if (userResponse.ok) {
          const userProfile = await userResponse.json();
          return userProfile.data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Login - redirect to SWA auth
  async login(email: string, password: string): Promise<void> {
    // For now, redirect to the built-in auth
    // In production, you'd integrate with Azure AD B2C
    window.location.href = '/.auth/login/aad';
  }

  // Logout
  async logout(): Promise<void> {
    window.location.href = '/.auth/logout';
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Register new user (for future implementation)
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    customerCode: string;
  }): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  }
}

export const authService = new AuthService();