import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService, ResetPasswordRequest } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ResetPasswordComponent {
  resetData: ResetPasswordRequest = {
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    // Get token and email from URL
    this.route.queryParams.subscribe(params => {
      this.resetData.token = params['token'] || '';
      this.resetData.email = params['email'] || '';
    });

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
    this.authService.resetPassword(this.resetData).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Mật khẩu đã được đặt lại thành công', 'Thành công');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Reset password error:', error);
        this.toastr.error(
          error.error?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',
          'Lỗi'
        );
      }
    });
  }

  private validateForm(): boolean {
    if (!this.resetData.email?.trim()) {
      this.toastr.warning('Email không được để trống', 'Thiếu thông tin');
      return false;
    }

    if (!this.authService.validateEmail(this.resetData.email)) {
      this.toastr.warning('Email không hợp lệ', 'Lỗi');
      return false;
    }

    if (!this.resetData.token?.trim()) {
      this.toastr.warning('Token không hợp lệ', 'Thiếu thông tin');
      return false;
    }

    if (!this.resetData.newPassword) {
      this.toastr.warning('Vui lòng nhập mật khẩu mới', 'Thiếu thông tin');
      return false;
    }

    const passwordErrors = this.authService.validatePassword(this.resetData.newPassword);
    if (passwordErrors) {
      Object.values(passwordErrors).forEach(error => {
        this.toastr.warning(error, 'Lỗi mật khẩu');
      });
      return false;
    }

    if (this.resetData.newPassword !== this.resetData.confirmPassword) {
      this.toastr.warning('Mật khẩu xác nhận không khớp', 'Lỗi');
      return false;
    }

    return true;
  }
} 