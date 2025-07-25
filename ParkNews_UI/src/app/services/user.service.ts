import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_URLS } from './api-urls';

export interface UserDTO {
  Id?: number;
  UserName?: string;
  Email?: string;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
  Address?: string;
  IsActive?: boolean;
  Role?: string;
  Roles?: string[];
  Password?: string;
  ConfirmPassword?: string;
}

export interface ChangePasswordDTO {
  userId?: number | string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ProfileUpdateDTO {
  Id?: string;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
  Address?: string;
  Email?: string;
}

export interface UpdateRoleDTO {
  userId: string;
  roles: string[];
}

export interface BasicUserInfoDTO {
  firstName: string;
  lastName: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = API_URLS.user;
  private defaultRoles = ['Admin', 'Editor', 'Reader'];

  constructor(private http: HttpClient) { }

  getAll(): Observable<UserDTO[]> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(response => {
        if (response && response.$values) {
          return response.$values;
        } else if (Array.isArray(response)) {
          return response;
        } else {
          console.error('Unexpected API response format:', response);
          return [];
        }
      })
    );
  }

  getById(id: string | number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<UserDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`).pipe(
      map(response => {
        if (response && response.$values) {
          return response.$values;
        } else if (Array.isArray(response)) {
          return response;
        } else {
          console.error('Unexpected API response format:', response);
          return [];
        }
      })
    );
  }

  create(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}`, user);
  }

  update(id: number | string, user: UserDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  updateBasicInfo(id: string, info: BasicUserInfoDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-basic/${id}`, info);
  }

  updateRoles(userId: string, roles: string[]): Observable<any> {
    const data: UpdateRoleDTO = {
      userId: userId,
      roles: roles
    };
    return this.http.post(`${this.apiUrl}/update-roles`, data);
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/roles`)
      .pipe(
        map(response => {
          if (response && response.$values) {
            return response.$values;
          } else if (Array.isArray(response)) {
            return response;
          } else {
            console.error('Unexpected API response format for roles:', response);
            return this.defaultRoles;
          }
        }),
        catchError(error => {
          console.error('Không thể tải danh sách vai trò', error);
          return of(this.defaultRoles);
        })
      );
  }

  toggleUserStatus(id: number | string): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle-status/${id}`, {});
  }

  changePassword(data: ChangePasswordDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  updateProfile(data: ProfileUpdateDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data);
  }

  getCurrentUserProfile(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/profile`);
  }
}
