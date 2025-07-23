import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseManagerComponent } from '../base-manager.component';
import { UserService, UserDTO, ChangePasswordDTO } from '../../services/user.service';
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
  roles: string[] = ['User', 'Admin', 'Editor', 'Author'];
  showPasswordModal = false;
  passwordData: ChangePasswordDTO = {
    userId: 0,
    newPassword: '',
    confirmPassword: ''
  };
  selectedUser: UserDTO | null = null;

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
      Role: 'User',
      Roles: ['User'],
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
        this.items = users;
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
        this.items = users;
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
      this.editData = { ...user };
      // Ensure Roles is an array
      if (!this.editData.Roles) {
        if (this.editData.Role) {
          this.editData.Roles = [this.editData.Role];
        } else {
          this.editData.Roles = ['User'];
        }
      }
    } else {
      this.resetEditData();
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
      Role: 'User',
      Roles: ['User'],
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

    const id = typeof this.editData.Id === 'string' ? parseInt(this.editData.Id) : this.editData.Id;
    this.userService.update(id, this.editData).subscribe({
      next: () => {
        this.toastr.success('Người dùng đã được cập nhật thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating user', error);
        this.toastr.error('Không thể cập nhật người dùng');
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
