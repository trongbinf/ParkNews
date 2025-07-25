import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from './api-urls';
import { SourceDTO } from '../admin/source-manager/source-manager.component';

export interface SourceUpdateDTO {
  Name: string;
  WebsiteUrl: string;
  LogoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  private apiUrl = `${API_URLS.source}`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<SourceDTO[]> {
    return this.http.get<SourceDTO[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<SourceDTO> {
    return this.http.get<SourceDTO>(`${this.apiUrl}/${id}`);
  }

  getPopular(): Observable<SourceDTO[]> {
    return this.http.get<SourceDTO[]>(`${this.apiUrl}/popular`);
  }

  getArticles(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/articles`);
  }

  search(query: string): Observable<SourceDTO[]> {
    return this.http.get<SourceDTO[]>(`${this.apiUrl}/search?q=${query}`);
  }

  create(source: SourceDTO): Observable<SourceDTO> {
    return this.http.post<SourceDTO>(`${this.apiUrl}`, source);
  }

  update(id: number, source: SourceDTO): Observable<SourceDTO> {
    return this.http.put<SourceDTO>(`${this.apiUrl}/${id}`, source);
  }

  updateBasic(id: number, source: SourceUpdateDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-basic/${id}`, source);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 