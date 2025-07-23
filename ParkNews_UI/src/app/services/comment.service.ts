import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from './api-urls';
import { CommentDTO } from '../admin/comment-manager/comment-manager.component';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${API_URLS.comment}`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<CommentDTO> {
    return this.http.get<CommentDTO>(`${this.apiUrl}/${id}`);
  }

  getByArticle(articleId: number): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.apiUrl}/article/${articleId}`);
  }

  getApproved(): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.apiUrl}/approved`);
  }

  getPending(): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.apiUrl}/pending`);
  }

  search(query: string): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.apiUrl}/search?q=${query}`);
  }

  create(comment: CommentDTO): Observable<CommentDTO> {
    return this.http.post<CommentDTO>(`${this.apiUrl}`, comment);
  }

  update(id: number, comment: CommentDTO): Observable<CommentDTO> {
    return this.http.put<CommentDTO>(`${this.apiUrl}/${id}`, comment);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  approve(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, {});
  }
} 