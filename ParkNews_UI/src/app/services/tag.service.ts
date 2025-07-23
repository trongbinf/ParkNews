import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TagDTO } from '../admin/tag-manager/tag-manager.component';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/Tags`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TagDTO[]> {
    return this.http.get<TagDTO[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<TagDTO> {
    return this.http.get<TagDTO>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<TagDTO[]> {
    return this.http.get<TagDTO[]>(`${this.apiUrl}/search?q=${query}`);
  }

  create(tag: TagDTO): Observable<TagDTO> {
    return this.http.post<TagDTO>(`${this.apiUrl}`, tag);
  }

  update(id: number, tag: TagDTO): Observable<TagDTO> {
    return this.http.put<TagDTO>(`${this.apiUrl}/${id}`, tag);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
