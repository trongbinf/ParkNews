import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryDTO } from '../admin/category-manager/category-manager.component';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/Category`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<CategoryDTO> {
    return this.http.get<CategoryDTO>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.apiUrl}/search?q=${query}`);
  }

  create(category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(`${this.apiUrl}`, category);
  }

  update(id: number, category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
