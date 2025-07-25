import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ArticleService, Article } from '../../services/article.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  articles: Article[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  
  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      if (this.searchTerm) {
        this.searchArticles();
      } else {
        this.isLoading = false;
      }
    });
  }
  
  searchArticles(): void {
    this.isLoading = true;
    this.error = null;
    
    this.articleService.search(this.searchTerm).pipe(
      catchError(error => {
        console.error('Error searching articles:', error);
        this.error = 'Không thể tìm kiếm bài viết. Vui lòng thử lại sau.';
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(articles => {
      this.articles = articles;
    });
  }
  
  submitSearch(): void {
    if (this.searchTerm.trim()) {
      this.searchArticles();
    }
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