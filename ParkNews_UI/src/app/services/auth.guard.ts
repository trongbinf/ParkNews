import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      toastr.error('Bạn cần đăng nhập để truy cập trang này', 'Truy cập bị từ chối');
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return true;
      }
      
      // Nếu người dùng đã đăng nhập, chuyển hướng đến trang dashboard
      router.navigate(['/dashboard']);
      return false;
    })
  );
}; 