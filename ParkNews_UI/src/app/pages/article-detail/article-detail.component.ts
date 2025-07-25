import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ArticleService, Article } from '../../services/article.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get article ID from route params
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(parseInt(id, 10));
    } else {
      this.error = 'Không tìm thấy bài viết';
      this.isLoading = false;
    }
  }
  
  loadArticle(id: number): void {
    this.isLoading = true;
    this.error = null;
    
    this.articleService.getById(id).pipe(
      catchError(error => {
        console.error('Error loading article:', error);
        this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(article => {
      if (article) {
        this.article = article;
        this.loadRelatedArticles();
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
      this.relatedArticles = articles
        .filter(a => a.Id !== this.article?.Id)
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