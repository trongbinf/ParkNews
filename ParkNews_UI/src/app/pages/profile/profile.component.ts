import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService, ProfileUpdateDTO, ChangePasswordDTO } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userProfile: ProfileUpdateDTO = {
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    Address: '',
    Email: ''
  };

  passwordData: ChangePasswordDTO = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  activeTab: 'info' | 'password' = 'info';
  loading = false;
  saving = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.userProfile = {
          FirstName: user.FirstName || '',
          LastName: user.LastName || '',
          PhoneNumber: user.PhoneNumber || '',
          Address: user.Address || '',
          Email: user.Email || ''
        };
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading user profile', error);
        this.toastr.error('Không thể tải thông tin người dùng', 'Lỗi');
      }
    });
  }

  setActiveTab(tab: 'info' | 'password'): void {
    this.activeTab = tab;
  }

  updateProfile(): void {
    this.saving = true;
    this.userService.updateProfile(this.userProfile).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success('Cập nhật thông tin thành công', 'Thành công');
        
        // Update user info in auth service
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.firstName = this.userProfile.FirstName;
          currentUser.lastName = this.userProfile.LastName;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
      },
      error: (error) => {
        this.saving = false;
        console.error('Error updating profile', error);
        this.toastr.error('Không thể cập nhật thông tin', 'Lỗi');
      }
    });
  }

  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastr.error('Mật khẩu mới và xác nhận mật khẩu không khớp', 'Lỗi');
      return;
    }

    this.saving = true;
    const userId = this.authService.getCurrentUser()?.id;
    
    if (!userId) {
      this.toastr.error('Không tìm thấy thông tin người dùng', 'Lỗi');
      this.saving = false;
      return;
    }

    this.passwordData.userId = userId;
    
    this.userService.changePassword(this.passwordData).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success('Đổi mật khẩu thành công', 'Thành công');
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        this.saving = false;
        console.error('Error changing password', error);
        this.toastr.error(
          error.error?.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.',
          'Lỗi'
        );
      }
    });
  }
}
