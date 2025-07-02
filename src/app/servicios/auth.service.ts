
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  private sesionActivaSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  sesionActiva$ = this.sesionActivaSubject.asObservable();

  constructor(private http: HttpClient) {}

  registrarCliente(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  iniciarSesion(token: string) {
    localStorage.setItem('token', token);
    this.sesionActivaSubject.next(true);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.sesionActivaSubject.next(false);
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }
}
