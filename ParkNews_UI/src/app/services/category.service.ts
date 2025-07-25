import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URLS } from './api-urls';

export interface CategoryResponse {
  $id: string;
  $values: Category[];
}

export interface Category {
  $id: string;
  Id: number;
  Name: string;
  Slug: string;
  Description: string;
  ParentCategoryId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = API_URLS.category;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<CategoryResponse>(this.apiUrl).pipe(
      map(response => {
        if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values;
        }
        return [];
      })
    );
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Category[]> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/search?q=${query}`).pipe(
      map(response => {
        if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values;
        }
        return [];
      })
    );
  }

  create(category: Omit<Category, '$id' | 'Id'>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}`, category);
  }

  update(id: number, category: Omit<Category, '$id' | 'Id'>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
