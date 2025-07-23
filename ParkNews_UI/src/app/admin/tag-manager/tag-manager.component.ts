import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseManagerComponent } from '../base-manager.component';
import { TagService } from '../../services/tag.service';

export interface TagDTO {
  Id?: number;
  Name: string;
  Description?: string;
}

@Component({
  selector: 'app-tag-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tag-manager.component.html',
  styleUrls: ['./tag-manager.component.css']
})
export class TagManagerComponent extends BaseManagerComponent<TagDTO> {
  tags: TagDTO[] = [];

  constructor(
    private tagService: TagService,
    toastr: ToastrService
  ) {
    super(toastr);
  }

  override loadItems(): void {
    this.loading = true;
    this.tagService.getAll().subscribe({
      next: (response: any) => {
        let tags: TagDTO[] = [];
        
        if (response && response.$values) {
          tags = response.$values;
        } else if (Array.isArray(response)) {
          tags = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.tags = tags;
        this.items = tags;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tags', error);
        this.toastr.error('Không thể tải danh sách thẻ');
        this.loading = false;
      }
    });
  }

  override performSearch(query: string): void {
    this.loading = true;
    this.tagService.search(query).subscribe({
      next: (response: any) => {
        let tags: TagDTO[] = [];
        
        if (response && response.$values) {
          tags = response.$values;
        } else if (Array.isArray(response)) {
          tags = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.tags = tags;
        this.items = tags;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching tags', error);
        this.toastr.error('Không thể tìm kiếm thẻ');
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
      this.toastr.error('Tên thẻ là bắt buộc');
      return false;
    }
    return true;
  }

  override createItem(): void {
    this.tagService.create(this.editData).subscribe({
      next: () => {
        this.toastr.success('Tag đã được tạo thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error creating tag', error);
        this.toastr.error('Không thể tạo tag');
        this.saving = false;
      }
    });
  }

  override updateItem(): void {
    if (!this.editData.Id) return;

    const id = typeof this.editData.Id === 'string' ? parseInt(this.editData.Id) : this.editData.Id;
    this.tagService.update(id, this.editData).subscribe({
      next: () => {
        this.toastr.success('Tag đã được cập nhật thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating tag', error);
        this.toastr.error('Không thể cập nhật tag');
        this.saving = false;
      }
    });
  }

  override performDelete(id: number | string): void {
    const tagId = typeof id === 'string' ? parseInt(id) : id;
    this.tagService.delete(tagId).subscribe({
      next: () => {
        this.toastr.success('Tag đã được xóa thành công');
        this.loadItems();
        this.saving = false;
        this.showDeleteModal = false;
      },
      error: (error) => {
        console.error('Error deleting tag', error);
        this.toastr.error('Không thể xóa tag');
        this.saving = false;
        this.showDeleteModal = false;
      }
    });
  }
}
