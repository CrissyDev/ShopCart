import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/users.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private loginUrl = environment.apiUrl + '/auth/login';
  private userUrl = environment.apiUrl + '/auth/me';

  
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      tap(response => {
       
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

 
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userCart');
    localStorage.removeItem('authUser');
    this.router.navigate(['/']);
  }

  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  
  getCurrentUser(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<User>(this.userUrl, { headers }).pipe(
      tap(user => {
        this.saveAuthUserToStorage(user); 
      })
    );
  }

  
  saveAuthUserToStorage(user: any): void {
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  
  readAuthUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}
