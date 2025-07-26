import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleService, Article } from '../../services/article.service';
import { ZooToastService } from '../../shared/components/zoo-toast/zoo-toast.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="favorites-container">
      <div class="page-header">
        <h1>Bài viết yêu thích</h1>
        <p>Danh sách các bài viết bạn đã đánh dấu yêu thích</p>
      </div>

      <div class="loading-spinner" *ngIf="isLoading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải...
      </div>

      <div class="empty-state" *ngIf="!isLoading && favoriteArticles.length === 0">
        <div class="empty-icon">
          <i class="fas fa-heart"></i>
        </div>
        <h3>Chưa có bài viết yêu thích</h3>
        <p>Bạn chưa thêm bài viết nào vào danh sách yêu thích.</p>
        <a routerLink="/" class="btn btn-primary">
          <i class="fas fa-home"></i> Khám phá bài viết
        </a>
      </div>

      <div class="favorites-list" *ngIf="!isLoading && favoriteArticles.length > 0">
        <div class="favorite-card" *ngFor="let article of favoriteArticles">
          <div class="favorite-image" [ngStyle]="{'background-image': 'url(' + article.FeaturedImageUrl + ')'}">
            <span class="favorite-category" *ngIf="article.Category">{{article.Category.Name}}</span>
          </div>
          <div class="favorite-content">
            <h3 class="favorite-title">
              <a [routerLink]="['/article/slug', article.Slug]">{{article.Title}}</a>
            </h3>
            <p class="favorite-summary">{{article.Summary}}</p>
            <div class="favorite-meta">
              <span class="favorite-date">{{formatDate(article.PublishDate)}}</span>
              <span class="favorite-author" *ngIf="article.Author">{{article.Author.FullName}}</span>
            </div>
            <div class="favorite-actions">
              <a [routerLink]="['/article/slug', article.Slug]" class="btn btn-sm btn-outline-primary">
                <i class="fas fa-eye"></i> Xem
              </a>
              <button class="btn btn-sm btn-outline-danger" (click)="removeFromFavorites(article.Id)">
                <i class="fas fa-trash"></i> Xóa khỏi yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favorites-container {
      max-width: 1000px;
      margin: 80px auto 40px;
      padding: 20px;
    }
    
    .page-header {
      margin-bottom: 30px;
      text-align: center;
    }
    
    .page-header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      color: #333;
    }
    
    .page-header p {
      color: #666;
      font-size: 16px;
    }
    
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 50px;
      font-size: 18px;
      color: #666;
    }
    
    .loading-spinner i {
      margin-right: 10px;
      color: #4CAF50;
    }
    
    .empty-state {
      text-align: center;
      padding: 50px 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .empty-icon {
      font-size: 48px;
      color: #ddd;
      margin-bottom: 20px;
    }
    
    .empty-state h3 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #333;
    }
    
    .empty-state p {
      color: #666;
      margin-bottom: 20px;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .btn-primary {
      background-color: #4CAF50;
      color: white;
      border: none;
    }
    
    .btn-primary:hover {
      background-color: #45a049;
    }
    
    .favorites-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .favorite-card {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .favorite-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .favorite-image {
      height: 180px;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    
    .favorite-category {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: rgba(76, 175, 80, 0.9);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .favorite-content {
      padding: 20px;
    }
    
    .favorite-title {
      margin: 0 0 10px;
      font-size: 18px;
      line-height: 1.4;
    }
    
    .favorite-title a {
      color: #333;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    
    .favorite-title a:hover {
      color: #4CAF50;
    }
    
    .favorite-summary {
      color: #666;
      font-size: 14px;
      margin-bottom: 15px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .favorite-meta {
      display: flex;
      justify-content: space-between;
      color: #888;
      font-size: 12px;
      margin-bottom: 15px;
    }
    
    .favorite-actions {
      display: flex;
      gap: 10px;
    }
    
    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }
    
    .btn-outline-primary {
      color: #4CAF50;
      border: 1px solid #4CAF50;
      background-color: transparent;
    }
    
    .btn-outline-primary:hover {
      background-color: #4CAF50;
      color: white;
    }
    
    .btn-outline-danger {
      color: #f44336;
      border: 1px solid #f44336;
      background-color: transparent;
    }
    
    .btn-outline-danger:hover {
      background-color: #f44336;
      color: white;
    }
    
    @media (max-width: 768px) {
      .favorites-list {
        grid-template-columns: 1fr;
      }
      
      .favorite-image {
        height: 220px;
      }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favoriteArticles: Article[] = [];
  isLoading = true;
  
  constructor(
    private articleService: ArticleService,
    private zooToast: ZooToastService
  ) {}
  
  ngOnInit(): void {
    this.loadFavoriteArticles();
  }
  
  loadFavoriteArticles(): void {
    this.isLoading = true;
    this.articleService.getFavoriteArticles().subscribe({
      next: (articles) => {
        this.favoriteArticles = articles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading favorite articles:', error);
        this.zooToast.error('Không thể tải danh sách bài viết yêu thích');
        this.isLoading = false;
      }
    });
  }
  
  removeFromFavorites(articleId: number): void {
    this.articleService.removeFromFavorites(articleId);
    this.favoriteArticles = this.favoriteArticles.filter(article => article.Id !== articleId);
    this.zooToast.success('Đã xóa bài viết khỏi danh sách yêu thích');
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
} 