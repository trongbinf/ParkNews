import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ArticleDetailComponent implements OnInit {
  article: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(+id);
    } else {
      this.error = true;
      this.loading = false;
      this.toastr.error('Không tìm thấy ID bài viết', 'Lỗi');
    }
  }

  loadArticle(id: number) {
    this.loading = true;
    this.error = false;
    this.articleService.getById(id).subscribe({
      next: (response: any) => {
        this.article = response;
        
        // Sanitize HTML content
        if (this.article && this.article.Content) {
          this.article.Content = this.sanitizer.bypassSecurityTrustHtml(this.article.Content);
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading article', err);
        this.toastr.error('Không thể tải thông tin bài viết', 'Lỗi');
        this.loading = false;
        this.error = true;
      }
    });
  }

  deleteArticle(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      this.loading = true;
      this.articleService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Bài viết đã được xóa thành công', 'Thành công');
          this.router.navigate(['/admin/articles']);
        },
        error: (err) => {
          console.error('Error deleting article', err);
          this.toastr.error('Không thể xóa bài viết', 'Lỗi');
          this.loading = false;
        }
      });
    }
  }
} 