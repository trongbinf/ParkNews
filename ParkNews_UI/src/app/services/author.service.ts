import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URLS } from './api-urls';

export interface Author {
  Id?: number;
  FullName: string;
  Email: string;
  Bio?: string;
  AvatarUrl?: string;
}

export interface CreateAuthorDTO {
  FullName: string;
  Email: string;
  Bio?: string;
  AvatarUrl?: string;
}

export interface UpdateAuthorDTO {
  Id: number;
  FullName: string;
  Email: string;
  Bio?: string;
  AvatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = `${API_URLS.author}`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Author[]> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(response => {
        if (response && response.$values) {
          return response.$values;
        } else if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }

  getById(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Author[]> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`).pipe(
      map(response => {
        if (response && response.$values) {
          return response.$values;
        } else if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }

  create(author: CreateAuthorDTO): Observable<Author> {
    return this.http.post<Author>(`${this.apiUrl}`, author);
  }

  update(id: number, author: UpdateAuthorDTO): Observable<Author> {
    return this.http.put<Author>(`${this.apiUrl}/${id}`, author);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: string): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/byuser/${userId}`);
  }
} 