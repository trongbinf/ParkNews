import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ArticleService, Article } from '../../services/article.service';
import { CategoryService, Category } from '../../services/category.service';
import { HttpClientModule } from '@angular/common/http';
import { catchError, finalize, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  articles: Article[] = [];
  categories: Category[] = [];
  currentCategory: Category | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  
  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    // Subscribe to route params to get category ID
    this.route.paramMap.pipe(
      switchMap(params => {
        this.isLoading = true;
        const categoryId = params.get('id');
        
        if (categoryId) {
          // If we have a category ID, load articles for that category
          const id = parseInt(categoryId, 10);
          return this.articleService.getByCategory(id).pipe(
            catchError(error => {
              console.error('Error loading articles by category:', error);
              this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
              return of([]);
            }),
            finalize(() => {
              this.isLoading = false;
            })
          );
        } else {
          // If no category ID, load all articles
          return this.articleService.getAll().pipe(
            catchError(error => {
              console.error('Error loading all articles:', error);
              this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
              return of([]);
            }),
            finalize(() => {
              this.isLoading = false;
            })
          );
        }
      })
    ).subscribe(articles => {
      this.articles = articles;
      
      // Get the current category
      const categoryId = this.route.snapshot.paramMap.get('id');
      if (categoryId && this.categories.length > 0) {
        const id = parseInt(categoryId, 10);
        this.currentCategory = this.categories.find(c => c.Id === id) || null;
      }
    });
  }
  
  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        
        // After loading categories, check if we need to set the current category
        const categoryId = this.route.snapshot.paramMap.get('id');
        if (categoryId) {
          const id = parseInt(categoryId, 10);
          this.currentCategory = this.categories.find(c => c.Id === id) || null;
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
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