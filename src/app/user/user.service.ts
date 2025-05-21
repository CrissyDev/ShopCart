// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { user } from '../models/users.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl = 'https://dummyjson.com/user/me';

//   constructor(private http: HttpClient) {}

//   getCurrentUser(): Observable<user> {
//     const token = localStorage.getItem('access_token');
//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`
//     });

//     return this.http.get<user>(this.apiUrl, { headers, withCredentials: true });
//   }
// }
