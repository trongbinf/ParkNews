
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { API_URLS } from './api-urls';

export interface ArticleResponse {
  $id: string;
  $values: Article[];
}

export interface Article {
  $id: string;
  Id: number;
  Title: string;
  Slug: string;
  Summary: string;
  Content: string;
  PublishDate: string;
  IsFeatured: boolean;
  IsPublished: boolean;
  FeaturedImageUrl: string;
  CreatedByUserId?: string;
  Category?: {
    $id: string;
    Id: number;
    Name: string;
  } | null;
  Author?: {
    $id: string;
    Id: number;
    FullName: string;
    Email: string;
  } | null;
  Source?: {
    $id: string;
    Id: number;
    Name: string;
  } | null;
  ArticleTags?: {
    $id: string;
    $values: {
      $id: string;
      ArticleId: number;
      TagId: number;
      Tag: {
        $id: string;
        Id: number;
        Name: string;
      };
    }[];
  } | null;
}

export interface CreateArticleDTO {
  Title: string;
  Content: string;
  Description: string;
  ImageUrl: string;
  IsPublished: boolean;
  IsFeatured: boolean;
  CategoryId: number;
  AuthorId: number;
  SourceId?: number;
  Tags: string[];
}

export interface UpdateArticleDTO extends CreateArticleDTO {
  // Same properties as CreateArticleDTO
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = API_URLS.article;
  private readonly FAVORITES_KEY = 'favoriteArticles';
  
  // BehaviorSubject để theo dõi thay đổi danh sách yêu thích
  private favoritesSubject = new BehaviorSubject<number[]>(this.getFavoriteIds());
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Các phương thức hiện có

  getAll(): Observable<Article[]> {
    return this.http.get<ArticleResponse>(this.apiUrl).pipe(
      map(response => {
        if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values;
        }
        return [];
      })
    );
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  getFeatured(): Observable<Article[]> {
    return this.getAll().pipe(
      map(articles => articles.filter(article => article.IsFeatured))
    );
  }

  getLatest(count: number = 8): Observable<Article[]> {
    return this.getAll().pipe(
      map(articles => {
        return [...articles]
          .sort((a, b) => new Date(b.PublishDate).getTime() - new Date(a.PublishDate).getTime())
          .slice(0, count);
      })
    );
  }

  getTrending(count: number = 4): Observable<Article[]> {
    // For now, just return the latest articles as trending
    return this.getLatest(count);
  }
  
  getByCategory(categoryId: number): Observable<Article[]> {
    return this.getAll().pipe(
      map(articles => articles.filter(article => article.Category && article.Category.Id === categoryId))
    );
  }

  getByAuthor(authorId: number | string): Observable<Article[]> {
    // First try to use the API endpoint
    return this.http.get<ArticleResponse>(`${this.apiUrl}/byauthor/${authorId}`).pipe(
      map(response => {
        if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values;
        }
        return [];
      }),
      // If the API call fails, fallback to filtering locally
      // This is handled in the error callback in the component
    );
  }

  getByUser(userId: string): Observable<Article[]> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/byuser/${userId}`).pipe(
      map(response => {
        if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values;
        }
        return [];
      })
    );
  }

  getByEditor(userId: string): Observable<Article[]> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/byeditor/${userId}`).pipe(
      map(response => {
        if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values;
        }
        return [];
      })
    );
  }

  getByTag(tagId: number): Observable<Article[]> {
    return this.http.get<ArticleResponse>(`${API_URLS.article}/bytag/${tagId}`).pipe(
      map(response => {
        console.log('Tag API response:', response);
        if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values.filter(article => article.IsPublished);
        } else if (Array.isArray(response)) {
          return response.filter(article => article.IsPublished);
        }
        return [];
      }),
      catchError(error => {
        console.error('Error getting articles by tag:', error);
        return of([]);
      })
    );
  }

  search(query: string): Observable<Article[]> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`).pipe(
      map(response => {
        if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values;
        }
        return [];
      })
    );
  }

  create(article: CreateArticleDTO): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  update(id: number, article: UpdateArticleDTO): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, article);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Phương thức quản lý bài viết yêu thích
  
  /**
   * Lấy danh sách ID bài viết yêu thích từ localStorage
   */
  getFavoriteIds(): number[] {
    const favoritesJson = localStorage.getItem(this.FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  }
  
  /**
   * Lưu danh sách ID bài viết yêu thích vào localStorage
   */
  private saveFavoriteIds(ids: number[]): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(ids));
    this.favoritesSubject.next(ids);
  }
  
  /**
   * Kiểm tra xem bài viết có trong danh sách yêu thích không
   */
  isFavorite(articleId: number): boolean {
    return this.getFavoriteIds().includes(articleId);
  }
  
  /**
   * Thêm bài viết vào danh sách yêu thích
   */
  addToFavorites(articleId: number): void {
    const favorites = this.getFavoriteIds();
    if (!favorites.includes(articleId)) {
      favorites.push(articleId);
      this.saveFavoriteIds(favorites);
    }
  }
  
  /**
   * Xóa bài viết khỏi danh sách yêu thích
   */
  removeFromFavorites(articleId: number): void {
    const favorites = this.getFavoriteIds();
    const index = favorites.indexOf(articleId);
    if (index !== -1) {
      favorites.splice(index, 1);
      this.saveFavoriteIds(favorites);
    }
  }
  
  /**
   * Toggle trạng thái yêu thích của bài viết
   */
  toggleFavorite(articleId: number): void {
    if (this.isFavorite(articleId)) {
      this.removeFromFavorites(articleId);
    } else {
      this.addToFavorites(articleId);
    }
  }
  
  /**
   * Lấy danh sách bài viết yêu thích
   */
  getFavoriteArticles(): Observable<Article[]> {
    const favoriteIds = this.getFavoriteIds();
    if (favoriteIds.length === 0) {
      return of([]);
    }
    
    return this.getAll().pipe(
      map(articles => articles.filter(article => favoriteIds.includes(article.Id)))
    );
  }
  
  /**
   * Đếm số lượng bài viết yêu thích
   */
  getFavoriteCount(): number {
    return this.getFavoriteIds().length;
  }
}
