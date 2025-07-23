import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { QuillModule } from 'ngx-quill';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { importProvidersFrom } from '@angular/core';

// Interceptor function
function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
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
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    }),
    importProvidersFrom(QuillModule.forRoot())
  ]
};
