import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleService, Article } from '../../services/article.service';
import { CategoryService, Category } from '../../services/category.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  categories: Category[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  
  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    this.isLoading = true;
    this.error = null;
    
    // Load articles
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
      console.log('Articles loaded:', articles);
      this.articles = articles;
    });

    // Load categories
    this.categoryService.getAll().pipe(
      catchError(error => {
        console.error('Error loading categories:', error);
        return of([]);
      })
    ).subscribe(categories => {
      console.log('Categories loaded:', categories);
      this.categories = categories;
    });
  }

  getExcerpt(content: string, maxLength: number = 150): string {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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