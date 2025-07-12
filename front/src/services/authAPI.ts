const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🌍 Environment:', import.meta.env.VITE_ENVIRONMENT || 'development');
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

class AuthAPI {
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(token: string): Promise<AuthUser> {
    return this.request('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async refreshToken(token: string): Promise<{ token: string }> {
    return this.request('/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authAPI = new AuthAPI();