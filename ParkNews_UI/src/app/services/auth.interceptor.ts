import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Lấy token từ AuthService
    const token = this.authService.getToken();

    // Nếu có token, thêm vào header Authorization
    if (token) {
      request = this.addToken(request, token);
    }

    // Xử lý request và bắt lỗi
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Nếu lỗi 401 Unauthorized, xử lý đăng xuất
        if (error.status === 401) {
          // Nếu không phải request đăng nhập hoặc đăng ký
          if (!request.url.includes('/login') && !request.url.includes('/register')) {
            this.toastr.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', 'Lỗi xác thực');
            this.authService.logout();
          }
        }
        
        // Nếu lỗi 403 Forbidden, hiển thị thông báo không có quyền truy cập
        if (error.status === 403) {
          this.toastr.error('Bạn không có quyền truy cập vào tài nguyên này', 'Lỗi phân quyền');
        }
        
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
} 