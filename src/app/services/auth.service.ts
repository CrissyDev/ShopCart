import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/users.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'https://dummyjson.com/auth/login';
  private userUrl = 'https://dummyjson.com/auth/me';

  private http = inject(HttpClient);
  private router = inject(Router);

  
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('id', response.id); 
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.router.navigate(['/']);
  }

 
  getToken(): string | null {
    return localStorage.getItem('token');
  }

 
  getCurrentUser(): Observable<User> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<User>(this.userUrl, { headers });
  }
}
