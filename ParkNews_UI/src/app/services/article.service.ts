
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
  FeaturedImageUrl: string;
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
  CategoryId: number;
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

  constructor(private http: HttpClient) {}

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

  getByTag(tagId: number): Observable<Article[]> {
    return this.http.get<ArticleResponse>(`${API_URLS.article}/bytag/${tagId}`).pipe(
      map(response => response.$values)
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
}
