import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  user$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for stored token on initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Store token and user info
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        // Set isAdmin flag
        if (response.user.roles && response.user.roles.includes('Admin')) {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }
        
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  logout(): void {
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): ValidationErrors | null {
    const errors: ValidationErrors = {};

    if (password.length < 6) {
      errors['length'] = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!/[A-Z]/.test(password)) {
      errors['uppercase'] = 'Mật khẩu phải có ít nhất 1 chữ hoa';
    }

    if (!/[0-9]/.test(password)) {
      errors['number'] = 'Mật khẩu phải có ít nhất 1 chữ số';
    }

    return Object.keys(errors).length ? errors : null;
  }
}
