import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/users.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://dummyjson.com/auth/me';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token found in localStorage'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(this.apiUrl, { headers });
  }
}
