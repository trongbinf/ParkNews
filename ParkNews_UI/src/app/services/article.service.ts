
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/Article`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  create(article: CreateArticleDTO): Observable<any> {
    return this.http.post(this.apiUrl, article);
  }

  update(id: number, article: UpdateArticleDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, article);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
