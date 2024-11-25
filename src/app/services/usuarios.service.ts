import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Usuario {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly USERS_ENDPOINT = "https://api.escuelajs.co/api/v1/users";
  
  constructor(private httpClient: HttpClient) { }
  login(email: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.httpClient.get(this.USERS_ENDPOINT).subscribe((users: any) => {
        const user: Usuario = users.find((user: Usuario) => user.email === email && user.password === password);
        if (user) {
          localStorage.setItem('auth.isAuthenticated', 'true');
          localStorage.setItem('auth.user.name', user.name);
          localStorage.setItem('auth.user.avatar', user.avatar);
          
          observer.next(true); 
        } else observer.next(false);
        observer.complete();
      });
    });
  }
}