import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseManagerComponent } from '../base-manager.component';
import { UserService, UserDTO, ChangePasswordDTO, BasicUserInfoDTO } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent extends BaseManagerComponent<UserDTO> {
  users: UserDTO[] = [];
  roles: string[] = ['Admin', 'Editor', 'Reader'];
  showPasswordModal = false;
  passwordData: ChangePasswordDTO = {
    userId: 0,
    newPassword: '',
    confirmPassword: ''
  };
  selectedUser: UserDTO | null = null;
  disablePasswordChange = false;

  constructor(
    private userService: UserService,
    toastr: ToastrService
  ) {
    super(toastr);
    this.editData = {
      UserName: '',
      Email: '',
      FirstName: '',
      LastName: '',
      IsActive: true,
      Role: 'Reader',
      Roles: ['Reader'],
      Password: '',
      ConfirmPassword: ''
    };
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadRoles();
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        if (Array.isArray(roles) && roles.length > 0) {
          this.roles = roles;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Không thể tải danh sách vai trò', error);
      }
    });
  }

  override loadItems(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        // Process users to ensure roles are properly set
        this.users.forEach(user => {
          // If email matches specific users, assign correct roles
          if (user.Email === 'admin@parknews.com') {
            user.Roles = ['Admin'];
            user.Role = 'Admin';
          } else if (user.Email === 'editor@parknews.com') {
            user.Roles = ['Editor'];
            user.Role = 'Editor';
          } else if (user.Email === 'reader@parknews.com') {
            user.Roles = ['Reader'];
            user.Role = 'Reader';
          } else {
            // For other users, ensure they have at least a default role
            if (!user.Roles || user.Roles.length === 0) {
              if (user.Role) {
                user.Roles = [user.Role];
              } else {
                user.Roles = ['Reader'];
                user.Role = 'Reader';
              }
            }
          }
        });
        
        this.items = this.users;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading users', error);
        this.toastr.error('Không thể tải danh sách người dùng');
        this.loading = false;
      }
    });
  }

  override performSearch(query: string): void {
    this.loading = true;
    this.userService.search(query).subscribe({
      next: (users) => {
        this.users = users;
        // Process users to ensure roles are properly set
        this.users.forEach(user => {
          // If email matches specific users, assign correct roles
          if (user.Email === 'admin@parknews.com') {
            user.Roles = ['Admin'];
            user.Role = 'Admin';
          } else if (user.Email === 'editor@parknews.com') {
            user.Roles = ['Editor'];
            user.Role = 'Editor';
          } else if (user.Email === 'reader@parknews.com') {
            user.Roles = ['Reader'];
            user.Role = 'Reader';
          } else {
            // For other users, ensure they have at least a default role
            if (!user.Roles || user.Roles.length === 0) {
              if (user.Role) {
                user.Roles = [user.Role];
              } else {
                user.Roles = ['Reader'];
                user.Role = 'Reader';
              }
            }
          }
        });
        
        this.items = this.users;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error searching users', error);
        this.toastr.error('Không thể tìm kiếm người dùng');
        this.loading = false;
      }
    });
  }

  override openModal(user?: UserDTO): void {
    if (user) {
      // Create a deep copy of the user object
      this.editData = { ...user };
      
      // Ensure Roles is an array and correctly set
      if (user.Email === 'admin@parknews.com') {
        this.editData.Roles = ['Admin'];
        this.editData.Role = 'Admin';
      } else if (user.Email === 'editor@parknews.com') {
        this.editData.Roles = ['Editor'];
        this.editData.Role = 'Editor';
      } else if (user.Email === 'reader@parknews.com') {
        this.editData.Roles = ['Reader'];
        this.editData.Role = 'Reader';
      } else if (!this.editData.Roles || this.editData.Roles.length === 0) {
        if (this.editData.Role) {
          this.editData.Roles = [this.editData.Role];
        } else {
          this.editData.Roles = ['Reader'];
          this.editData.Role = 'Reader';
        }
      }
      
      // Clear password fields when editing
      this.editData.Password = '';
      this.editData.ConfirmPassword = '';
      
      // Disable password change in edit mode
      this.disablePasswordChange = true;
    } else {
      this.resetEditData();
      this.disablePasswordChange = false;
    }
    this.showModal = true;
  }

  override resetEditData(): void {
    this.editData = {
      UserName: '',
      Email: '',
      FirstName: '',
      LastName: '',
      IsActive: true,
      Role: 'Reader',
      Roles: ['Reader'],
      Password: '',
      ConfirmPassword: ''
    };
  }

  openPasswordModal(user: UserDTO): void {
    this.selectedUser = user;
    this.passwordData = {
      userId: user.Id!,
      newPassword: '',
      confirmPassword: ''
    };
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.selectedUser = null;
    this.passwordData = {
      userId: 0,
      newPassword: '',
      confirmPassword: ''
    };
  }

  toggleRole(role: string): void {
    if (!this.editData.Roles) {
      this.editData.Roles = [];
    }

    const index = this.editData.Roles.indexOf(role);
    if (index > -1) {
      this.editData.Roles.splice(index, 1);
    } else {
      this.editData.Roles.push(role);
    }
  }

  hasRole(role: string): boolean {
    return this.editData.Roles && this.editData.Roles.includes(role);
  }

  toggleUserStatus(user: UserDTO): void {
    if (!user.Id) return;

    this.userService.toggleUserStatus(user.Id).subscribe({
      next: () => {
        user.IsActive = !user.IsActive;
        this.toastr.success(`Trạng thái người dùng đã được ${user.IsActive ? 'kích hoạt' : 'vô hiệu hóa'}`);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error toggling user status', error);
        this.toastr.error('Không thể thay đổi trạng thái người dùng');
      }
    });
  }

  changePassword(): void {
    if (!this.selectedUser || !this.selectedUser.Id) return;
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastr.error('Mật khẩu xác nhận không khớp');
      return;
    }

    this.saving = true;
    this.userService.changePassword(this.passwordData).subscribe({
      next: () => {
        this.toastr.success('Mật khẩu đã được thay đổi thành công');
        this.closePasswordModal();
        this.saving = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error changing password', error);
        this.toastr.error('Không thể thay đổi mật khẩu');
        this.saving = false;
      }
    });
  }

  override validateForm(): boolean {
    if (!this.editData.Email) {
      this.toastr.error('Email là bắt buộc');
      return false;
    }

    // Ensure at least one role is selected
    if (!this.editData.Roles || this.editData.Roles.length === 0) {
      this.toastr.error('Phải chọn ít nhất một vai trò');
      return false;
    }

    // Update Role from Roles array
    if (this.editData.Roles && this.editData.Roles.length > 0) {
      this.editData.Role = this.editData.Roles[0];
    }

    return true;
  }

  override createItem(): void {
    this.userService.create(this.editData).subscribe({
      next: (user) => {
        this.toastr.success('Người dùng đã được tạo thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creating user', error);
        this.toastr.error('Không thể tạo người dùng');
        this.saving = false;
      }
    });
  }

  override updateItem(): void {
    if (!this.editData.Id) return;

    const id = typeof this.editData.Id === 'string' ? this.editData.Id : this.editData.Id.toString();
    
    // Create basic user info object
    const basicInfo: BasicUserInfoDTO = { 
      firstName: this.editData.FirstName || '',
      lastName: this.editData.LastName || '',
      isActive: this.editData.IsActive || false
    };

    console.log('Sending update data:', basicInfo);

    // First update the user's basic information
    this.userService.updateBasicInfo(id, basicInfo).subscribe({
      next: () => {
        // For system users, we don't update roles
        if (this.editData.Email === 'admin@parknews.com' || 
            this.editData.Email === 'editor@parknews.com' || 
            this.editData.Email === 'reader@parknews.com') {
          
          this.toastr.success('Người dùng đã được cập nhật thành công', 'Thành công');
          this.loadItems();
          this.closeModal();
          this.saving = false;
        } else {
          // For other users, update their roles
          this.updateUserRoles(id);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating user', error);
        this.toastr.error('Không thể cập nhật người dùng: ' + (error.error?.message || error.message), 'Lỗi');
        this.saving = false;
      }
    });
  }

  updateUserRoles(userId: string): void {
    // Only proceed if roles are defined
    if (!this.editData.Roles || this.editData.Roles.length === 0) {
      this.toastr.warning('Người dùng phải có ít nhất một vai trò', 'Cảnh báo');
      this.saving = false;
      return;
    }

    this.userService.updateRoles(userId, this.editData.Roles).subscribe({
      next: () => {
        this.toastr.success('Vai trò người dùng đã được cập nhật thành công', 'Thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating user roles', error);
        this.toastr.error('Không thể cập nhật vai trò người dùng: ' + (error.error?.message || error.message), 'Lỗi');
        this.saving = false;
      }
    });
  }

  override performDelete(id: number | string): void {
    const userId = typeof id === 'string' ? parseInt(id) : id;
    this.userService.delete(userId).subscribe({
      next: () => {
        this.toastr.success('Người dùng đã được xóa thành công');
        this.loadItems();
        this.saving = false;
        this.showDeleteModal = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting user', error);
        this.toastr.error('Không thể xóa người dùng');
        this.saving = false;
        this.showDeleteModal = false;
      }
    });
  }
}
