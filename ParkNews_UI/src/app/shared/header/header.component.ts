import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="park-header">
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
              <li class="nav-item"><a routerLink="/danh-muc" routerLinkActive="active">Danh mục</a></li>
              <li class="nav-item"><a routerLink="/the" routerLinkActive="active">Thẻ</a></li>
              <li class="nav-item"><a routerLink="/gioi-thieu" routerLinkActive="active">Giới thiệu</a></li>
              <li class="nav-item"><a routerLink="/lien-he" routerLinkActive="active">Liên hệ</a></li>
              <li class="nav-item" *ngIf="isAdmin"><a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a></li>
            </ul>
          </nav>
          
          <div class="auth-buttons" *ngIf="!isLoggedIn">
            <a routerLink="/auth/login" class="btn btn-login">Đăng nhập</a>
            <a routerLink="/auth/register" class="btn btn-register">Đăng ký</a>
          </div>

          <div class="user-menu" *ngIf="isLoggedIn">
            <div class="user-info">
              <span class="user-name">{{ getUserDisplayName() }}</span>
              <div class="user-dropdown">
                <ul class="dropdown-menu">
                  <li *ngIf="isAdmin"><a routerLink="/admin/dashboard">Dashboard</a></li>
                  <li><a routerLink="/profile">Hồ sơ</a></li>
                  <li><a href="javascript:void(0)" (click)="logout()">Đăng xuất</a></li>
                </ul>
              </div>
            </div>
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
      color: #4CAF50;
    }
    
    .nav-item a::after {
      content: '';
      position: absolute;
      left: 0;
      right: 100%;
      bottom: 0;
      height: 2px;
      background-color: #4CAF50;
      transition: right 0.3s ease;
    }
    
    .nav-item a:hover::after,
    .nav-item a.active::after {
      right: 0;
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
      border-color: #4CAF50;
      color: #4CAF50;
    }
    
    .btn-register {
      color: #fff;
      background-color: #4CAF50;
      border: 1px solid #4CAF50;
    }
    
    .btn-register:hover {
      background-color: #45a049;
      box-shadow: 0 2px 5px rgba(76, 175, 80, 0.3);
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
      border: 1px solid #4CAF50;
      transition: all 0.3s ease;
    }
    
    .user-info:hover {
      background-color: rgba(76, 175, 80, 0.1);
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
      color: #4CAF50;
    }
    
    @media (max-width: 992px) {
      .main-nav {
        margin-left: 20px;
      }
      
      .nav-list {
        gap: 15px;
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
    }
    
    @media (max-width: 576px) {
      .nav-list {
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  currentUser: any = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.updateAuthStatus();
    
    // Subscribe to auth changes
    this.authService.user$.subscribe(() => {
      this.updateAuthStatus();
    });
  }
  
  updateAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
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
  
  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
} 