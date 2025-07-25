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
  $id?: string;
  Id?: number;
  Name: string;
  Slug?: string;
}

export interface CreateTagDTO {
  Name: string;
  Description: string;
  Slug: string;
}

export interface UpdateTagDTO {
  Name: string;
  Description: string;
  Slug: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Tag[]> {
    return this.http.get<any>(`${API_URLS.tag}`).pipe(
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

  getById(id: number): Observable<Tag> {
    return this.http.get<Tag>(`${API_URLS.tag}/${id}`);
  }

  search(term: string): Observable<Tag[]> {
    return this.http.get<any>(`${API_URLS.tag}/search?q=${term}`).pipe(
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

  create(tag: CreateTagDTO): Observable<Tag> {
    return this.http.post<Tag>(`${API_URLS.tag}`, tag);
  }

  update(id: number, tag: UpdateTagDTO): Observable<Tag> {
    return this.http.put<Tag>(`${API_URLS.tag}/${id}`, tag);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API_URLS.tag}/${id}`);
  }
}
