import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  isAdmin = false;
  
  adminSections = [
    { name: 'Quản lý bài viết', route: '/admin/articles', icon: 'fa-newspaper' },
    { name: 'Quản lý danh mục', route: '/admin/categories', icon: 'fa-folder' },
    { name: 'Quản lý tag', route: '/admin/tags', icon: 'fa-tags' },
    { name: 'Quản lý người dùng', route: '/admin/users', icon: 'fa-users' },
    { name: 'Quản lý bình luận', route: '/admin/comments', icon: 'fa-comments' },
    { name: 'Quản lý nguồn', route: '/admin/sources', icon: 'fa-globe' },
    { name: 'Quản lý tác giả', route: '/admin/authors', icon: 'fa-user-edit' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    // Check if user is logged in and has admin role
    if (!this.currentUser || !this.isAdmin) {
      this.router.navigate(['/auth/login']);
    }
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

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
