import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URLS } from './api-urls';

export interface Category {
  Id?: number;
  Name: string;
  Slug?: string;
  Description?: string;
  ParentCategoryId?: number | null;
}

export interface CreateCategoryDTO {
  Name: string;
  Description?: string;
  Slug?: string;
  ParentCategoryId?: number | null;
}

export interface UpdateCategoryDTO {
  Id: number;
  Name: string;
  Description?: string;
  Slug?: string;
  ParentCategoryId?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = API_URLS.category;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
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

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Category[]> {
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

  create(category: CreateCategoryDTO): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}`, category);
  }

  update(id: number, category: UpdateCategoryDTO): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
