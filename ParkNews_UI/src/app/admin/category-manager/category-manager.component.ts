import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseManagerComponent } from '../base-manager.component';
import { CategoryService } from '../../services/category.service';

export interface CategoryDTO {
  Id?: number;
  Name: string;
  Description?: string;
}

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent extends BaseManagerComponent<CategoryDTO> {
  categories: CategoryDTO[] = [];

  constructor(
    private categoryService: CategoryService,
    toastr: ToastrService
  ) {
    super(toastr);
  }

  override loadItems(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (response: any) => {
        let categories: CategoryDTO[] = [];
        
        if (response && response.$values) {
          categories = response.$values;
        } else if (Array.isArray(response)) {
          categories = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.categories = categories;
        this.items = categories;
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
        let categories: CategoryDTO[] = [];
        
        if (response && response.$values) {
          categories = response.$values;
        } else if (Array.isArray(response)) {
          categories = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.categories = categories;
        this.items = categories;
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

  override createItem(): void {
    this.categoryService.create(this.editData).subscribe({
      next: () => {
        this.toastr.success('Danh mục đã được tạo thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error creating category', error);
        this.toastr.error('Không thể tạo danh mục');
        this.saving = false;
      }
    });
  }

  override updateItem(): void {
    if (!this.editData.Id) return;

    const id = typeof this.editData.Id === 'string' ? parseInt(this.editData.Id) : this.editData.Id;
    this.categoryService.update(id, this.editData).subscribe({
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
