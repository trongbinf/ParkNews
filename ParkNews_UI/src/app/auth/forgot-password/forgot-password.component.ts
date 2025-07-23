import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ForgotPasswordComponent {
  forgotData = {
    email: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    if (!this.forgotData.email) {
      this.toastr.warning('Vui lòng nhập email', 'Thiếu thông tin');
      return;
    }

    if (!this.authService.validateEmail(this.forgotData.email)) {
      this.toastr.warning('Email không hợp lệ', 'Lỗi');
      return;
    }

    this.loading = true;
    this.authService.forgotPassword(this.forgotData).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn', 'Thành công');
        this.router.navigate(['/auth/reset-password']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Forgot password error:', error);
        this.toastr.error(
          error.error?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.',
          'Lỗi'
        );
      }
    });
  }
} 