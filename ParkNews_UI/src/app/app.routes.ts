import { Routes } from '@angular/router';
import { adminGuard } from './services/admin-guard.service';
import { editorGuard } from './services/editor-guard.service';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'article-list',
    loadComponent: () => import('./pages/article-list/article-list.component').then(c => c.ArticleListComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(c => c.SearchComponent)
  },
  {
    path: 'tag/slug/:slug',
    loadComponent: () => import('./pages/tag/tag.component').then(c => c.TagComponent)
  },
  {
    path: 'tag/:id',
    loadComponent: () => import('./pages/tag/tag.component').then(c => c.TagComponent)
  },
  {
    path: 'category',
    loadComponent: () => import('./pages/category/category.component').then(c => c.CategoryComponent)
  },
  {
    path: 'category/:id',
    loadComponent: () => import('./pages/category/category.component').then(c => c.CategoryComponent)
  },
  {
    path: 'article/slug/:slug',
    loadComponent: () => import('./pages/article-detail/article-detail.component').then(c => c.ArticleDetailComponent)
  },
  {
    path: 'article/:id',
    loadComponent: () => import('./pages/article-detail/article-detail.component').then(c => c.ArticleDetailComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/favorites/favorites.component').then(c => c.FavoritesComponent)
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
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'articles',
        loadComponent: () => import('./admin/article-manager/article-manager.component').then(c => c.ArticleManagerComponent)
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
    path: 'editor',
    canActivate: [editorGuard],
    children: [
      {
        path: 'articles',
        loadComponent: () => import('./editor/editor-article-manager/editor-article-manager.component').then(c => c.EditorArticleManagerComponent)
      },
      {
        path: 'article/new',
        loadComponent: () => import('./editor/editor-article-detail/editor-article-detail.component').then(c => c.EditorArticleDetailComponent)
      },
      {
        path: 'article/:id',
        loadComponent: () => import('./editor/editor-article-detail/editor-article-detail.component').then(c => c.EditorArticleDetailComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
