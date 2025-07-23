import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseManagerComponent } from '../base-manager.component';
import { CommentService } from '../../services/comment.service';

export interface CommentDTO {
  Id?: number;
  Content: string;
  UserName: string;
  ArticleId: number;
  ArticleTitle?: string;
  PostedAt?: Date;
  IsApproved?: boolean;
}

@Component({
  selector: 'app-comment-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './comment-manager.component.html',
  styleUrls: ['./comment-manager.component.css']
})
export class CommentManagerComponent extends BaseManagerComponent<CommentDTO> {
  comments: CommentDTO[] = [];
  filterStatus: 'all' | 'approved' | 'pending' = 'all';

  constructor(
    private commentService: CommentService,
    toastr: ToastrService
  ) {
    super(toastr);
  }

  override loadItems(): void {
    this.loading = true;
    
    let request;
    switch (this.filterStatus) {
      case 'approved':
        request = this.commentService.getApproved();
        break;
      case 'pending':
        request = this.commentService.getPending();
        break;
      default:
        request = this.commentService.getAll();
        break;
    }

    request.subscribe({
      next: (response: any) => {
        let comments: CommentDTO[] = [];
        
        if (response && response.$values) {
          comments = response.$values;
        } else if (Array.isArray(response)) {
          comments = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.comments = comments;
        this.items = comments;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading comments', error);
        this.toastr.error('Không thể tải danh sách bình luận');
        this.loading = false;
      }
    });
  }

  override performSearch(query: string): void {
    this.loading = true;
    this.commentService.search(query).subscribe({
      next: (response: any) => {
        let comments: CommentDTO[] = [];
        
        if (response && response.$values) {
          comments = response.$values;
        } else if (Array.isArray(response)) {
          comments = response;
        } else {
          console.error('Unexpected API response format:', response);
        }
        
        this.comments = comments;
        this.items = comments;
        this.calculateTotalPages();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching comments', error);
        this.toastr.error('Không thể tìm kiếm bình luận');
        this.loading = false;
      }
    });
  }

  filterComments(status: 'all' | 'approved' | 'pending'): void {
    this.filterStatus = status;
    this.loadItems();
  }

  getStatusClass(isApproved?: boolean): string {
    return isApproved ? 'status-badge status-badge-approved' : 'status-badge status-badge-pending';
  }

  getStatusText(isApproved?: boolean): string {
    return isApproved ? 'Đã duyệt' : 'Chờ duyệt';
  }

  override resetEditData(): void {
    this.editData = {
      Content: '',
      UserName: '',
      ArticleId: 0,
      IsApproved: false
    };
  }

  override validateForm(): boolean {
    if (!this.editData.Content?.trim()) {
      this.toastr.error('Nội dung bình luận là bắt buộc');
      return false;
    }
    if (!this.editData.UserName?.trim()) {
      this.toastr.error('Tên người dùng là bắt buộc');
      return false;
    }
    if (!this.editData.ArticleId) {
      this.toastr.error('ID bài viết là bắt buộc');
      return false;
    }
    return true;
  }

  override createItem(): void {
    this.commentService.create(this.editData).subscribe({
      next: () => {
        this.toastr.success('Bình luận đã được tạo thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error creating comment', error);
        this.toastr.error('Không thể tạo bình luận');
        this.saving = false;
      }
    });
  }

  override updateItem(): void {
    if (!this.editData.Id) return;

    const id = typeof this.editData.Id === 'string' ? parseInt(this.editData.Id) : this.editData.Id;
    this.commentService.update(id, this.editData).subscribe({
      next: () => {
        this.toastr.success('Bình luận đã được cập nhật thành công');
        this.loadItems();
        this.closeModal();
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating comment', error);
        this.toastr.error('Không thể cập nhật bình luận');
        this.saving = false;
      }
    });
  }

  override performDelete(id: number | string): void {
    const commentId = typeof id === 'string' ? parseInt(id) : id;
    this.commentService.delete(commentId).subscribe({
      next: () => {
        this.toastr.success('Bình luận đã được xóa thành công');
        this.loadItems();
        this.saving = false;
        this.showDeleteModal = false;
      },
      error: (error) => {
        console.error('Error deleting comment', error);
        this.toastr.error('Không thể xóa bình luận');
        this.saving = false;
        this.showDeleteModal = false;
      }
    });
  }

  approveComment(comment: CommentDTO): void {
    if (!comment.Id) return;

    const id = typeof comment.Id === 'string' ? parseInt(comment.Id) : comment.Id;
    this.commentService.approve(id).subscribe({
      next: () => {
        comment.IsApproved = true;
        this.toastr.success('Bình luận đã được duyệt');
      },
      error: (error) => {
        console.error('Error approving comment', error);
        this.toastr.error('Không thể duyệt bình luận');
      }
    });
  }

  rejectComment(comment: CommentDTO): void {
    if (!comment.Id) return;

    const id = typeof comment.Id === 'string' ? parseInt(comment.Id) : comment.Id;
    this.commentService.reject(id).subscribe({
      next: () => {
        comment.IsApproved = false;
        this.toastr.success('Bình luận đã được từ chối');
      },
      error: (error) => {
        console.error('Error rejecting comment', error);
        this.toastr.error('Không thể từ chối bình luận');
      }
    });
  }
} 