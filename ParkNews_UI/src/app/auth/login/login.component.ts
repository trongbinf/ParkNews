import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  loading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // If already logged in, redirect to appropriate page
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user?.roles?.includes('Admin')) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.loginData.email || !this.loginData.password) {
      this.toastr.warning('Vui lòng nhập đầy đủ thông tin', 'Thiếu thông tin');
      return;
    }

    if (!this.authService.validateEmail(this.loginData.email)) {
      this.toastr.warning('Email không hợp lệ', 'Lỗi');
      return;
    }

    this.loading = true;
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastr.success('Đăng nhập thành công', 'Thành công');
        
        // Check if the user has Admin role and store it
        if (response.user.roles && response.user.roles.includes('Admin')) {
          localStorage.setItem('isAdmin', 'true');
          this.router.navigate(['/admin/dashboard']);
        } else {
          localStorage.removeItem('isAdmin');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        
        // Check if this is an inactive account error
        if (error.error?.message && error.error.message.includes('Tài khoản của bạn đã bị khóa')) {
          this.toastr.error(error.error.message, 'Tài khoản bị khóa');
        } else {
          this.toastr.error(
            error.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.',
            'Lỗi'
          );
        }
      }
    });
  }
} 