import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { provideToastr } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';

// Interceptor function
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  // Lấy token từ AuthService
  const token = authService.getToken();

  // Nếu có token, thêm vào header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Xử lý request và bắt lỗi
  return next(req).pipe(
    catchError(error => {
      // Nếu lỗi 401 Unauthorized, xử lý đăng xuất
      if (error.status === 401) {
        // Nếu không phải request đăng nhập hoặc đăng ký
        if (!req.url.includes('/login') && !req.url.includes('/register')) {
          toastr.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', 'Lỗi xác thực');
          authService.logout();
        }
      }
      
      // Nếu lỗi 403 Forbidden, hiển thị thông báo không có quyền truy cập
      if (error.status === 403) {
        toastr.error('Bạn không có quyền truy cập vào tài nguyên này', 'Lỗi phân quyền');
      }
      
      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorFn])),
    provideAnimations(), // Cần thiết cho animations
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    importProvidersFrom(
      QuillModule.forRoot()
    )
  ]
};
