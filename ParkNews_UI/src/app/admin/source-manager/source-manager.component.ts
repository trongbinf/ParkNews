import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseManagerComponent } from '../base-manager.component';
import { SourceService } from '../../services/source.service';

export interface SourceDTO {
  Id?: number;
  Name: string;
  WebsiteUrl: string;
  LogoUrl?: string;
}

@Component({
  selector: 'app-source-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './source-manager.component.html',
  styleUrls: ['./source-manager.component.css']
})
export class SourceManagerComponent extends BaseManagerComponent<SourceDTO> {
  sources: SourceDTO[] = [];

  constructor(
    private sourceService: SourceService,
    toastr: ToastrService
  ) {
    super(toastr);
  }

  override loadItems(): void {
    this.loading = true;
    this.sourceService.getAll().subscribe({
      next: (response: any) => {
        let sources: SourceDTO[] = [];
        
        if (response && response.$values) {
          sources = response.$values;
        } else if (Array.isArray(response)) {
          sources = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.sources = sources;
        this.items = sources;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sources', error);
        this.toastr.error('Không thể tải danh sách nguồn');
        this.loading = false;
      }
    });
  }

  override performSearch(query: string): void {
    this.loading = true;
    this.sourceService.search(query).subscribe({
      next: (response: any) => {
        let sources: SourceDTO[] = [];
        
        if (response && response.$values) {
          sources = response.$values;
        } else if (Array.isArray(response)) {
          sources = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.sources = sources;
        this.items = sources;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching sources', error);
        this.toastr.error('Không thể tìm kiếm nguồn');
        this.loading = false;
      }
    });
  }

  override resetEditData(): void {
    this.editData = {
      Name: '',
      WebsiteUrl: '',
      LogoUrl: ''
    };
  }

  override validateForm(): boolean {
    if (!this.editData.Name?.trim()) {
      this.toastr.error('Tên nguồn là bắt buộc');
      return false;
    }
    if (!this.editData.WebsiteUrl?.trim()) {
      this.toastr.error('URL website là bắt buộc');
      return false;
    }
    return true;
  }

  override createItem(): void {
    this.sourceService.create(this.editData).subscribe({
      next: () => {
        this.toastr.success('Nguồn đã được tạo thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error creating source', error);
        this.toastr.error('Không thể tạo nguồn');
        this.saving = false;
      }
    });
  }

  override updateItem(): void {
    if (!this.editData.Id) return;

    const id = typeof this.editData.Id === 'string' ? parseInt(this.editData.Id) : this.editData.Id;
    this.sourceService.update(id, this.editData).subscribe({
      next: () => {
        this.toastr.success('Nguồn đã được cập nhật thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating source', error);
        this.toastr.error('Không thể cập nhật nguồn');
        this.saving = false;
      }
    });
  }

  override performDelete(id: number | string): void {
    const sourceId = typeof id === 'string' ? parseInt(id) : id;
    this.sourceService.delete(sourceId).subscribe({
      next: () => {
        this.toastr.success('Nguồn đã được xóa thành công');
        this.loadItems();
        this.saving = false;
        this.showDeleteModal = false;
      },
      error: (error) => {
        console.error('Error deleting source', error);
        this.toastr.error('Không thể xóa nguồn');
        this.saving = false;
        this.showDeleteModal = false;
      }
    });
  }
} 