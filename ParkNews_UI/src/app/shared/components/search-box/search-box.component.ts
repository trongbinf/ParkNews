import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService, Article } from '../../../services/article.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  searchTerm = '';
  searchResults: Article[] = [];
  isSearching = false;
  isSearchOpen = false;
  noResults = false;
  private searchSubject = new Subject<string>();
  private subscription: Subscription | null = null;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) {
          return of([]);
        }
        this.isSearching = true;
        return this.articleService.search(term).pipe(
          catchError(error => {
            console.error('Error searching articles:', error);
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.searchResults = results;
      this.isSearching = false;
      this.noResults = results.length === 0 && this.searchTerm.length >= 2;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.searchTerm = '';
      this.searchResults = [];
      this.noResults = false;
    }
  }

  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchTerm = '';
    this.searchResults = [];
    this.noResults = false;
  }

  submitSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
      this.closeSearch();
    }
  }

  getExcerpt(content: string, maxLength: number = 100): string {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
} 