import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ArticleService, Article } from '../../services/article.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';
import { ZooToastService } from '../../shared/components/zoo-toast/zoo-toast.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  relatedArticles: Article[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  
  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private zooToast: ZooToastService
  ) {}

  ngOnInit(): void {
    // Get article identifier from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const slug = params.get('slug');
      
      if (slug) {
        // Nếu có slug, ưu tiên sử dụng slug
        this.loadArticleBySlug(slug);
      } else if (id) {
        // Kiểm tra xem id có phải là số hay không
        if (!isNaN(Number(id))) {
          // Nếu id là số, tải bài viết theo id
          this.loadArticleById(parseInt(id, 10));
        } else {
          // Nếu id không phải là số, coi như đó là slug
          this.loadArticleBySlug(id);
        }
      } else {
        this.error = 'Không tìm thấy bài viết';
        this.isLoading = false;
      }
    });
  }
  
  loadArticleById(id: number): void {
    this.isLoading = true;
    this.error = null;
    
    this.articleService.getById(id).pipe(
      catchError(error => {
        console.error('Error loading article by ID:', error);
        this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(article => {
      if (article) {
        // Kiểm tra xem bài viết có được xuất bản không
        if (!article.IsPublished) {
          this.zooToast.warning('Bài viết này chưa được xuất bản', 'Thông báo');
          this.router.navigate(['/']);
          return;
        }
        
        this.article = article;
        this.loadRelatedArticles();
      } else {
        this.error = 'Không tìm thấy bài viết';
        this.zooToast.error('Không tìm thấy bài viết', 'Lỗi');
      }
    });
  }
  
  loadArticleBySlug(slug: string): void {
    this.isLoading = true;
    this.error = null;
    
    // Gọi API để lấy tất cả bài viết
    this.articleService.getAll().pipe(
      catchError(error => {
        console.error('Error loading articles:', error);
        this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(articles => {
      // Tìm bài viết theo slug
      const foundArticle = articles.find(a => a.Slug === slug);
      
      if (foundArticle) {
        // Kiểm tra xem bài viết có được xuất bản không
        if (!foundArticle.IsPublished) {
          this.zooToast.warning('Bài viết này chưa được xuất bản', 'Thông báo');
          this.router.navigate(['/']);
          return;
        }
        
        this.article = foundArticle;
        this.loadRelatedArticles();
      } else {
        this.error = 'Không tìm thấy bài viết';
        this.zooToast.error('Không tìm thấy bài viết', 'Lỗi');
      }
    });
  }
  
  loadRelatedArticles(): void {
    if (!this.article || !this.article.Category) return;
    
    this.articleService.getByCategory(this.article.Category.Id).pipe(
      catchError(error => {
        console.error('Error loading related articles:', error);
        return of([]);
      })
    ).subscribe(articles => {
      // Filter out the current article and limit to 3 related articles
      // Also filter out unpublished articles
      this.relatedArticles = articles
        .filter(a => a.Id !== this.article?.Id && a.IsPublished)
        .slice(0, 3);
    });
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }
} 