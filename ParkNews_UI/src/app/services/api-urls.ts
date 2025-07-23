import { environment } from '../../environments/environment';

export const API_URLS = {
  auth: `${environment.apiUrl}/auth`,
  article: `${environment.apiUrl}/Article`,
  category: `${environment.apiUrl}/Category`,
  user: `${environment.apiUrl}/Users`,
  tag: `${environment.apiUrl}/Tags`,
  author: `${environment.apiUrl}/Author`,
  comment: `${environment.apiUrl}/Comments`,
  source: `${environment.apiUrl}/Sources`
};
