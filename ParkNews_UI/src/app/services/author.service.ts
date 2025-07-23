import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from './api-urls';
import { AuthorDTO } from '../admin/author-manager/author-manager.component';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = `${API_URLS.author}`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<AuthorDTO[]> {
    return this.http.get<AuthorDTO[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<AuthorDTO> {
    return this.http.get<AuthorDTO>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<AuthorDTO[]> {
    return this.http.get<AuthorDTO[]>(`${this.apiUrl}/search?q=${query}`);
  }

  create(author: AuthorDTO): Observable<AuthorDTO> {
    return this.http.post<AuthorDTO>(`${this.apiUrl}`, author);
  }

  update(id: number, author: AuthorDTO): Observable<AuthorDTO> {
    return this.http.put<AuthorDTO>(`${this.apiUrl}/${id}`, author);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 