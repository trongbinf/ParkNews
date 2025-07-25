import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseManagerComponent } from '../base-manager.component';
import { CategoryService, Category, CreateCategoryDTO, UpdateCategoryDTO } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';

export interface CategoryDTO {
  Id?: number;
  Name: string;
  Description?: string;
  ParentId?: number | null;
}

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent extends BaseManagerComponent<CategoryDTO> {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    toastr: ToastrService
  ) {
    super(toastr);
  }

  override loadItems(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (response: any) => {
        this.categories = response;
        this.items = response;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories', error);
        this.toastr.error('Không thể tải danh sách danh mục');
        this.loading = false;
      }
    });
  }

  override performSearch(query: string): void {
    this.loading = true;
    this.categoryService.search(query).subscribe({
      next: (response: any) => {
        this.categories = response;
        this.items = response;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching categories', error);
        this.toastr.error('Không thể tìm kiếm danh mục');
        this.loading = false;
      }
    });
  }

  override resetEditData(): void {
    this.editData = {
      Name: '',
      Description: ''
    };
  }

  override validateForm(): boolean {
    if (!this.editData.Name?.trim()) {
      this.toastr.error('Tên danh mục là bắt buộc');
      return false;
    }
    return true;
  }

  // Helper method to generate a slug from a name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
  }

  override createItem(): void {
    // Check if user is admin
    if (!this.authService.isAdmin()) {
      this.toastr.error('Bạn không có quyền thực hiện thao tác này', 'Lỗi phân quyền');
      return;
    }
    
    // Create a proper category object that matches the backend Category model
    const categoryData: CreateCategoryDTO = {
      Name: this.editData.Name,
      Description: this.editData.Description || '',
      Slug: this.generateSlug(this.editData.Name),
      ParentCategoryId: this.editData.ParentId
    };

    console.log('Sending category data:', categoryData);
    console.log('Auth token:', this.authService.getToken());

    this.categoryService.create(categoryData).subscribe({
      next: () => {
        this.toastr.success('Danh mục đã được tạo thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error creating category', error);
        console.error('Error details:', error.error);
        this.toastr.error('Không thể tạo danh mục: ' + (error.error?.message || error.message || 'Unknown error'));
        this.saving = false;
      }
    });
  }

  override updateItem(): void {
    // Check if user is admin
    if (!this.authService.isAdmin()) {
      this.toastr.error('Bạn không có quyền thực hiện thao tác này', 'Lỗi phân quyền');
      return;
    }
    
    if (!this.editData.Id) return;

    const id = typeof this.editData.Id === 'string' ? parseInt(this.editData.Id) : this.editData.Id;
    
    // Create a proper category object that matches the backend Category model
    const categoryData: UpdateCategoryDTO = {
      Id: id,
      Name: this.editData.Name,
      Description: this.editData.Description || '',
      Slug: this.generateSlug(this.editData.Name),
      ParentCategoryId: this.editData.ParentId
    };

    this.categoryService.update(id, categoryData).subscribe({
      next: () => {
        this.toastr.success('Danh mục đã được cập nhật thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating category', error);
        this.toastr.error('Không thể cập nhật danh mục');
        this.saving = false;
      }
    });
  }

  override performDelete(id: number | string): void {
    const categoryId = typeof id === 'string' ? parseInt(id) : id;
    this.categoryService.delete(categoryId).subscribe({
      next: () => {
        this.toastr.success('Danh mục đã được xóa thành công');
        this.loadItems();
        this.saving = false;
        this.showDeleteModal = false;
      },
      error: (error) => {
        console.error('Error deleting category', error);
        this.toastr.error('Không thể xóa danh mục');
        this.saving = false;
        this.showDeleteModal = false;
      }
    });
  }
}
