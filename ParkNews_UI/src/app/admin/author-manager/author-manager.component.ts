import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseManagerComponent } from '../base-manager.component';
import { AuthorService } from '../../services/author.service';

export interface AuthorDTO {
  Id?: number;
  FullName: string;
  Email: string;
  Bio?: string;
  AvatarUrl?: string;
}

@Component({
  selector: 'app-author-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './author-manager.component.html',
  styleUrls: ['./author-manager.component.css']
})
export class AuthorManagerComponent extends BaseManagerComponent<AuthorDTO> {
  authors: AuthorDTO[] = [];

  constructor(
    private authorService: AuthorService,
    toastr: ToastrService
  ) {
    super(toastr);
  }

  override loadItems(): void {
    this.loading = true;
    this.authorService.getAll().subscribe({
      next: (response: any) => {
        let authors: AuthorDTO[] = [];
        
        if (response && response.$values) {
          authors = response.$values;
        } else if (Array.isArray(response)) {
          authors = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.authors = authors;
        this.items = authors;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading authors', error);
        this.toastr.error('Không thể tải danh sách tác giả');
        this.loading = false;
      }
    });
  }

  override performSearch(query: string): void {
    this.loading = true;
    this.authorService.search(query).subscribe({
      next: (response: any) => {
        let authors: AuthorDTO[] = [];
        
        if (response && response.$values) {
          authors = response.$values;
        } else if (Array.isArray(response)) {
          authors = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.authors = authors;
        this.items = authors;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching authors', error);
        this.toastr.error('Không thể tìm kiếm tác giả');
        this.loading = false;
      }
    });
  }

  override resetEditData(): void {
    this.editData = {
      FullName: '',
      Email: '',
      Bio: '',
      AvatarUrl: ''
    };
  }

  override validateForm(): boolean {
    if (!this.editData.FullName?.trim()) {
      this.toastr.error('Tên tác giả là bắt buộc');
      return false;
    }
    if (!this.editData.Email?.trim()) {
      this.toastr.error('Email tác giả là bắt buộc');
      return false;
    }
    return true;
  }

  override createItem(): void {
    this.authorService.create(this.editData).subscribe({
      next: () => {
        this.toastr.success('Tác giả đã được tạo thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error creating author', error);
        this.toastr.error('Không thể tạo tác giả');
        this.saving = false;
      }
    });
  }

  override updateItem(): void {
    if (!this.editData.Id) return;

    const id = typeof this.editData.Id === 'string' ? parseInt(this.editData.Id) : this.editData.Id;
    this.authorService.update(id, this.editData).subscribe({
      next: () => {
        this.toastr.success('Tác giả đã được cập nhật thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating author', error);
        this.toastr.error('Không thể cập nhật tác giả');
        this.saving = false;
      }
    });
  }

  override performDelete(id: number | string): void {
    const authorId = typeof id === 'string' ? parseInt(id) : id;
    this.authorService.delete(authorId).subscribe({
      next: () => {
        this.toastr.success('Tác giả đã được xóa thành công');
        this.loadItems();
        this.saving = false;
        this.showDeleteModal = false;
      },
      error: (error) => {
        console.error('Error deleting author', error);
        this.toastr.error('Không thể xóa tác giả');
        this.saving = false;
        this.showDeleteModal = false;
      }
    });
  }
} 