import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ArticleService, Article } from '../../services/article.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="park-header">
      <!-- Breaking News Banner -->
      <div class="breaking-news" *ngIf="featuredArticles.length > 0">
        <div class="container">
          <div class="breaking-news-content">
            <div class="breaking-news-label">
              <i class="fas fa-bolt"></i> TIN NÓNG
            </div>
            <div class="breaking-news-slider">
              <div class="breaking-news-items">
                <a *ngFor="let article of featuredArticles" [routerLink]="['/article/slug', article.Slug]" class="breaking-news-item">
                  {{article.Title}}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a routerLink="/" class="logo-link">
              <h1>ParkNews</h1>
            </a>
          </div>
          
          <nav class="main-nav">
            <ul class="nav-list">
              <li class="nav-item"><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Trang chủ</a></li>
              <li class="nav-item"><a routerLink="/category" routerLinkActive="active">Danh mục</a></li>
              <li class="nav-item"><a routerLink="/article-list" routerLinkActive="active">Bài viết</a></li>
              <li class="nav-item" *ngIf="isAdmin || isManager"><a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a></li>
              <li class="nav-item" *ngIf="isEditor"><a routerLink="/editor/articles" routerLinkActive="active">Quản lý bài viết</a></li>
            </ul>
          </nav>
          
          <div class="header-actions">
            <div class="search-button-wrapper">
              <button class="search-btn" (click)="toggleSearch()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
            
            <div class="auth-buttons" *ngIf="!isLoggedIn">
              <a routerLink="/auth/login" class="btn btn-login">Đăng nhập</a>
              <a routerLink="/auth/register" class="btn btn-register">Đăng ký</a>
            </div>

            <div class="user-menu" *ngIf="isLoggedIn">
              <div class="user-info">
                <span class="user-name">{{ getUserDisplayName() }}</span>
                <div class="user-dropdown">
                  <ul class="dropdown-menu">
                    <li *ngIf="isAdmin || isManager"><a routerLink="/admin/dashboard">Dashboard</a></li>
                    <li *ngIf="isEditor"><a routerLink="/editor/articles">Quản lý bài viết</a></li>
                    <li><a routerLink="/profile">Hồ sơ</a></li>
                    <li *ngIf="isReader && !isManager"><a routerLink="/favorites">
                      <span class="favorite-menu-item">
                        Bài viết yêu thích
                        <span class="favorite-count" *ngIf="favoriteCount > 0">{{favoriteCount}}</span>
                      </span>
                    </a></li>
                    <li><a href="javascript:void(0)" (click)="logout()">Đăng xuất</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Search Overlay -->
      <div class="search-overlay" *ngIf="isSearchOpen" (click)="closeSearch()"></div>
      
      <!-- Search Modal -->
      <div class="search-modal" *ngIf="isSearchOpen">
        <div class="search-modal-content">
          <div class="search-modal-header">
            <h3>Tìm kiếm</h3>
            <button class="close-btn" (click)="closeSearch()">×</button>
          </div>
          <div class="search-modal-body">
            <form (submit)="submitSearch()" class="search-form">
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                name="search" 
                placeholder="Nhập từ khóa tìm kiếm..." 
                autocomplete="off"
                autofocus
              >
              <button type="submit" class="search-submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .park-header {
      background-color: #222;
      color: #fff;
      padding: 15px 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    /* Breaking News Styles */
    .breaking-news {
      background-color: #f44336;
      color: white;
      padding: 8px 0;
      margin-bottom: 15px;
      overflow: hidden;
    }
    
    .breaking-news-content {
      display: flex;
      align-items: center;
    }
    
    .breaking-news-label {
      background-color: #d32f2f;
      color: white;
      font-weight: bold;
      padding: 5px 15px;
      margin-right: 15px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
    
    .breaking-news-label i {
      margin-right: 5px;
    }
    
    .breaking-news-slider {
      flex: 1;
      overflow: hidden;
      position: relative;
    }
    
    .breaking-news-items {
      display: flex;
      animation: scroll 30s linear infinite;
    }
    
    .breaking-news-item {
      color: white;
      text-decoration: none;
      padding: 0 20px;
      white-space: nowrap;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .breaking-news-item:hover {
      color: #ffeb3b;
    }
    
    @keyframes scroll {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo-link {
      text-decoration: none;
      color: inherit;
    }
    
    .logo h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #fff;
    }
    
    .main-nav {
      flex: 1;
      margin-left: 40px;
    }
    
    .nav-list {
      list-style: none;
      display: flex;
      margin: 0;
      padding: 0;
      gap: 20px;
    }
    
    .nav-item a {
      text-decoration: none;
      color: #ccc;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 0;
      position: relative;
      transition: color 0.3s ease;
    }
    
    .nav-item a:hover,
    .nav-item a.active {
      color: #2ecc71;
    }
    
    .nav-item a::after {
      content: '';
      position: absolute;
      left: 0;
      right: 100%;
      bottom: 0;
      height: 2px;
      background-color: #2ecc71;
      transition: right 0.3s ease;
    }
    
    .nav-item a:hover::after,
    .nav-item a.active::after {
      right: 0;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .search-button-wrapper {
      margin-right: 5px;
    }
    
    .search-btn {
      background-color: #2ecc71;
      color: #fff;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .search-btn:hover {
      background-color: #27ae60;
      transform: scale(1.05);
    }
    
    .auth-buttons {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .btn-login {
      color: #fff;
      background-color: transparent;
      border: 1px solid #ccc;
    }
    
    .btn-login:hover {
      border-color: #2ecc71;
      color: #2ecc71;
    }
    
    .btn-register {
      color: #fff;
      background-color: #2ecc71;
      border: 1px solid #2ecc71;
    }
    
    .btn-register:hover {
      background-color: #27ae60;
      box-shadow: 0 2px 5px rgba(46, 204, 113, 0.3);
    }
    
    /* User Menu Styles */
    .user-menu {
      position: relative;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 4px;
      border: 1px solid #2ecc71;
      transition: all 0.3s ease;
    }
    
    .user-info:hover {
      background-color: rgba(46, 204, 113, 0.1);
    }
    
    .user-name {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
    }
    
    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 200px;
      background-color: #333;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      margin-top: 8px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1001;
    }
    
    .user-info:hover .user-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-menu {
      list-style: none;
      padding: 8px 0;
      margin: 0;
    }
    
    .dropdown-menu li {
      padding: 0;
    }
    
    .dropdown-menu a {
      display: block;
      padding: 8px 16px;
      color: #ccc;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .dropdown-menu a:hover {
      background-color: #444;
      color: #2ecc71;
    }
    
    /* Favorite menu item styles */
    .favorite-menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .favorite-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: #2ecc71;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      font-weight: bold;
    }
    
    /* Search Modal */
    .search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1001;
    }
    
    .search-modal {
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      max-width: 90%;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
      z-index: 1002;
    }
    
    .search-modal-content {
      padding: 20px;
    }
    
    .search-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .search-modal-header h3 {
      margin: 0;
      color: #333;
      font-size: 20px;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #95a5a6;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    
    .close-btn:hover {
      color: #e74c3c;
    }
    
    .search-form {
      display: flex;
      gap: 10px;
    }
    
    .search-form input {
      flex: 1;
      padding: 12px 15px;
      border: 2px solid #ecf0f1;
      border-radius: 4px;
      font-size: 16px;
      outline: none;
    }
    
    .search-form input:focus {
      border-color: #2ecc71;
    }
    
    .search-submit {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #2ecc71;
      color: #fff;
      border: none;
      padding: 0 20px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .search-submit:hover {
      background-color: #27ae60;
    }
    
    @media (max-width: 992px) {
      .main-nav {
        margin-left: 20px;
      }
      
      .nav-list {
        gap: 15px;
      }
      
      .breaking-news-label {
        padding: 5px 10px;
        margin-right: 10px;
      }
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
      }
      
      .nav-list {
        justify-content: center;
      }
      
      .header-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .auth-buttons, .user-menu {
        margin-top: 10px;
      }
      
      .user-dropdown {
        right: 50%;
        transform: translateX(50%) translateY(-10px);
      }
      
      .user-info:hover .user-dropdown {
        transform: translateX(50%) translateY(0);
      }
      
      .breaking-news-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .breaking-news-label {
        margin-bottom: 5px;
      }
    }
    
    @media (max-width: 576px) {
      .nav-list {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .search-modal {
        width: 95%;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  isEditor = false;
  isReader = false;
  isManager = false;
  currentUser: any = null;
  isSearchOpen = false;
  searchTerm = '';
  favoriteCount = 0;
  featuredArticles: Article[] = [];
  
  constructor(
    private authService: AuthService,
    private articleService: ArticleService
  ) {}
  
  ngOnInit(): void {
    this.updateAuthStatus();
    this.loadFeaturedArticles();
    
    // Subscribe to auth changes
    this.authService.user$.subscribe(() => {
      this.updateAuthStatus();
    });
    
    // Subscribe to favorites changes
    this.articleService.favorites$.subscribe(() => {
      this.updateFavoriteCount();
    });
  }
  
  loadFeaturedArticles(): void {
    this.articleService.getFeatured().subscribe(articles => {
      if (articles && articles.length > 0) {
        // Lấy tối đa 5 bài viết nổi bật
        this.featuredArticles = articles
          .filter(article => article.IsPublished)
          .slice(0, 5);
      }
    });
  }
  
  updateAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.isEditor = this.authService.isEditor();
    this.isManager = this.authService.isManager();
    this.isReader = this.authService.hasRole('Reader') || 
                    (!this.isAdmin && !this.isEditor && !this.isManager && this.isLoggedIn);
    
    if (this.isLoggedIn) {
      this.updateFavoriteCount();
    }
  }
  
  updateFavoriteCount(): void {
    this.favoriteCount = this.articleService.getFavoriteCount();
  }
  
  getUserDisplayName(): string {
    if (!this.currentUser) return 'User';
    
    if (this.currentUser.firstName) {
      return this.currentUser.firstName;
    } else if (this.currentUser.email) {
      return this.currentUser.email;
    } else {
      return 'User';
    }
  }
  
  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }
  
  closeSearch(): void {
    this.isSearchOpen = false;
  }
  
  submitSearch(): void {
    if (this.searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(this.searchTerm)}`;
      this.closeSearch();
    }
  }
  
  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
} 