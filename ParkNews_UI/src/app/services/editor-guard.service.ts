import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs/operators';

export const editorGuard: CanActivateFn = (route, state) => {
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
    
      const isEditor = authService.isEditor();
    if (!isEditor) {
        toastr.error('Bạn không có quyền truy cập trang này', 'Truy cập bị từ chối');
        router.navigate(['/']);
      return false;
    }
    
    return true;
    })
  );
}; 