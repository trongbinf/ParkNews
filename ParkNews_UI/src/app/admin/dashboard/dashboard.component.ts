import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { TagService } from '../../services/tag.service';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { SourceService } from '../../services/source.service';
import { AuthorService } from '../../services/author.service';
import { forkJoin } from 'rxjs';
import { CommentDTO } from '../comment-manager/comment-manager.component';

interface DashboardSection {
  name: string;
  route: string;
  icon: string;
  count: number;
  loading: boolean;
}

interface RecentActivity {
  id: number;
  type: string;
  title: string;
  date: Date;
  user: string;
}

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
  isManager = false;
  
  adminSections: DashboardSection[] = [
    { name: 'Quản lý bài viết', route: '/admin/articles', icon: 'fa-newspaper', count: 0, loading: true },
    { name: 'Quản lý danh mục', route: '/admin/categories', icon: 'fa-folder', count: 0, loading: true },
    { name: 'Quản lý tag', route: '/admin/tags', icon: 'fa-tags', count: 0, loading: true },
    { name: 'Quản lý người dùng', route: '/admin/users', icon: 'fa-users', count: 0, loading: true },
    { name: 'Quản lý bình luận', route: '/admin/comments', icon: 'fa-comments', count: 0, loading: true },
    { name: 'Quản lý nguồn', route: '/admin/sources', icon: 'fa-globe', count: 0, loading: true },
    { name: 'Quản lý tác giả', route: '/admin/authors', icon: 'fa-user-edit', count: 0, loading: true }
  ];

  displaySections: DashboardSection[] = [];
  recentActivities: RecentActivity[] = [];
  loadingActivities = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private userService: UserService,
    private commentService: CommentService,
    private sourceService: SourceService,
    private authorService: AuthorService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.isManager = localStorage.getItem('isManager') === 'true';
    
    // Check if user is logged in and has admin or manager role
    if (!this.currentUser || (!this.isAdmin && !this.isManager)) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Filter sections based on role
    this.filterSectionsByRole();
    this.loadDashboardData();
  }

  filterSectionsByRole(): void {
    if (this.isAdmin) {
      // Admin only sees user management
      this.displaySections = this.adminSections.filter(section => 
        section.route === '/admin/users'
      );
    } else if (this.isManager) {
      // Manager sees everything except user management
      this.displaySections = this.adminSections.filter(section => 
        section.route !== '/admin/users'
      );
    }
  }

  loadDashboardData(): void {
    // Load counts for each section
    this.articleService.getAll().subscribe(articles => {
      const articleSection = this.adminSections.find(s => s.route === '/admin/articles');
      if (articleSection) {
        articleSection.count = articles.length;
        articleSection.loading = false;
      }
      
      // Add recent articles to activities
      const recentArticles = articles
        .sort((a, b) => new Date(b.PublishDate).getTime() - new Date(a.PublishDate).getTime())
        .slice(0, 3)
        .map(article => ({
          id: article.Id,
          type: 'article',
          title: article.Title,
          date: new Date(article.PublishDate),
          user: article.Author?.FullName || 'Unknown'
        }));
      
      this.recentActivities.push(...recentArticles);
      this.sortRecentActivities();
    });

    this.categoryService.getAll().subscribe(categories => {
      const categorySection = this.adminSections.find(s => s.route === '/admin/categories');
      if (categorySection) {
        categorySection.count = categories.length;
        categorySection.loading = false;
      }
    });

    this.tagService.getAll().subscribe(tags => {
      const tagSection = this.adminSections.find(s => s.route === '/admin/tags');
      if (tagSection) {
        tagSection.count = tags.length;
        tagSection.loading = false;
      }
    });

    if (this.isAdmin) {
      this.userService.getAll().subscribe(users => {
        const userSection = this.adminSections.find(s => s.route === '/admin/users');
        if (userSection) {
          userSection.count = users.length;
          userSection.loading = false;
        }
      });
    }

    this.commentService.getAll().subscribe((comments: CommentDTO[]) => {
      const commentSection = this.adminSections.find(s => s.route === '/admin/comments');
      if (commentSection) {
        commentSection.count = comments.length;
        commentSection.loading = false;
      }
      
      // Add recent comments to activities
      const recentComments = comments
        .filter(comment => comment.PostedAt) // Ensure PostedAt exists
        .sort((a, b) => new Date(b.PostedAt!).getTime() - new Date(a.PostedAt!).getTime())
        .slice(0, 3)
        .map(comment => ({
          id: comment.Id || 0, // Use 0 as fallback if Id is undefined
          type: 'comment',
          title: comment.Content.substring(0, 30) + (comment.Content.length > 30 ? '...' : ''),
          date: new Date(comment.PostedAt!),
          user: comment.UserName || 'Anonymous'
        }));
      
      this.recentActivities.push(...recentComments);
      this.sortRecentActivities();
    });

    this.sourceService.getAll().subscribe(sources => {
      const sourceSection = this.adminSections.find(s => s.route === '/admin/sources');
      if (sourceSection) {
        sourceSection.count = sources.length;
        sourceSection.loading = false;
      }
    });

    this.authorService.getAll().subscribe(authors => {
      const authorSection = this.adminSections.find(s => s.route === '/admin/authors');
      if (authorSection) {
        authorSection.count = authors.length;
        authorSection.loading = false;
      }
    });
    
    // Set loading to false after 3 seconds in case some API calls fail
    setTimeout(() => {
      this.adminSections.forEach(section => {
        section.loading = false;
      });
      this.loadingActivities = false;
    }, 3000);
  }

  sortRecentActivities(): void {
    this.recentActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
    this.loadingActivities = false;
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

  getUserRole(): string {
    if (this.isAdmin) return 'Admin';
    if (this.isManager) return 'Manager';
    return 'User';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
  getActivityIcon(type: string): string {
    switch (type) {
      case 'article': return 'fa-newspaper';
      case 'comment': return 'fa-comment';
      default: return 'fa-bell';
    }
  }
  
  getActivityRoute(activity: RecentActivity): string {
    switch (activity.type) {
      case 'article': return `/admin/articles/${activity.id}`;
      case 'comment': return `/admin/comments`;
      default: return '#';
    }
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
