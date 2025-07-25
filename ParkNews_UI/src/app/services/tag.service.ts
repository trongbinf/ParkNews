import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URLS } from './api-urls';

export interface TagResponse {
  $id: string;
  $values: Tag[];
}

export interface Tag {
  $id: string;
  Id: number;
  Name: string;
  ArticleTags?: {
    $id: string;
    $values: any[];
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Tag[]> {
    return this.http.get<TagResponse>(`${API_URLS.tag}`).pipe(
      map(response => response.$values)
    );
  }

  getById(id: number): Observable<Tag> {
    return this.http.get<Tag>(`${API_URLS.tag}/${id}`);
  }

  search(term: string): Observable<Tag[]> {
    return this.http.get<TagResponse>(`${API_URLS.tag}/search?term=${term}`).pipe(
      map(response => response.$values)
    );
  }

  create(tag: Omit<Tag, '$id' | 'Id'>): Observable<Tag> {
    return this.http.post<Tag>(`${API_URLS.tag}`, tag);
  }

  update(id: number, tag: Omit<Tag, '$id' | 'Id'>): Observable<Tag> {
    return this.http.put<Tag>(`${API_URLS.tag}/${id}`, tag);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API_URLS.tag}/${id}`);
  }
}
