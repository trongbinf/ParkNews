import { Routes } from '@angular/router';
import { AdminGuard } from './services/admin-guard.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'articles',
        loadComponent: () => import('./admin/article-manager/article-manager.component').then(c => c.ArticleManagerComponent)
      },
      {
        path: 'articles/:id',
        loadComponent: () => import('./admin/article-detail/article-detail.component').then(c => c.ArticleDetailComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./admin/category-manager/category-manager.component').then(c => c.CategoryManagerComponent)
      },
      {
        path: 'tags',
        loadComponent: () => import('./admin/tag-manager/tag-manager.component').then(c => c.TagManagerComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/user-manager/user-manager.component').then(c => c.UserManagerComponent)
      },
      {
        path: 'comments',
        loadComponent: () => import('./admin/comment-manager/comment-manager.component').then(c => c.CommentManagerComponent)
      },
      {
        path: 'sources',
        loadComponent: () => import('./admin/source-manager/source-manager.component').then(c => c.SourceManagerComponent)
      },
      {
        path: 'authors',
        loadComponent: () => import('./admin/author-manager/author-manager.component').then(c => c.AuthorManagerComponent)
      }
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(c => c.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./auth/reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
