import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs/operators';

export const managerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        toastr.error('Bạn cần đăng nhập để truy cập trang này', 'Truy cập bị từ chối');
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      
      const isManager = authService.isManager();
      if (!isManager) {
        toastr.error('Bạn không có quyền truy cập trang này', 'Truy cập bị từ chối');
        router.navigate(['/']);
        return false;
      }
      
      return true;
    })
  );
};

export const adminOrManagerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        toastr.error('Bạn cần đăng nhập để truy cập trang này', 'Truy cập bị từ chối');
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      
      const isAdmin = authService.isAdmin();
      const isManager = authService.isManager();
      
      if (!isAdmin && !isManager) {
        toastr.error('Bạn không có quyền truy cập trang này', 'Truy cập bị từ chối');
        router.navigate(['/']);
        return false;
      }
      
      return true;
    })
  );
}; 