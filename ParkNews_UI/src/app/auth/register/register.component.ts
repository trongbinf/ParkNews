import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // If already logged in, redirect to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    const registerPayload: RegisterRequest = {
      firstName: this.registerData.firstName.trim(),
      lastName: this.registerData.lastName.trim(),
      email: this.registerData.email.trim(),
      password: this.registerData.password,
      confirmPassword: this.registerData.confirmPassword
    };

    this.authService.register(registerPayload).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Đăng ký thành công', 'Thành công');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Register error:', error);
        this.toastr.error(
          error.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
          'Lỗi'
        );
      }
    });
  }

  private validateForm(): boolean {
    if (!this.registerData.firstName?.trim()) {
      this.toastr.warning('Vui lòng nhập họ tên', 'Thiếu thông tin');
      return false;
    }

    if (!this.registerData.email?.trim()) {
      this.toastr.warning('Vui lòng nhập email', 'Thiếu thông tin');
      return false;
    }

    if (!this.authService.validateEmail(this.registerData.email)) {
      this.toastr.warning('Email không hợp lệ', 'Lỗi');
      return false;
    }

    if (!this.registerData.password) {
      this.toastr.warning('Vui lòng nhập mật khẩu', 'Thiếu thông tin');
      return false;
    }

    const passwordErrors = this.authService.validatePassword(this.registerData.password);
    if (passwordErrors) {
      Object.values(passwordErrors).forEach(error => {
        this.toastr.warning(error, 'Lỗi mật khẩu');
      });
      return false;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.toastr.warning('Mật khẩu xác nhận không khớp', 'Lỗi');
      return false;
    }

    return true;
  }
} 