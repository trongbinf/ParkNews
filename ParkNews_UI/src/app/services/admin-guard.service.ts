import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Add your authentication logic here
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
