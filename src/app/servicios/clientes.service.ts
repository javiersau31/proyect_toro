import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id_cliente: number;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    usuario: string;
}

@Injectable({
  providedIn : 'root',
})
export class ClientesService {
    private apiUrl = 'http://localhost:3000/api/clientes';
    constructor(private http: HttpClient) {}

    getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  
  getClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  
  crearCliente(cliente: Partial<Cliente>): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }

  
  actualizarCliente(id: number, cliente: Partial<Cliente>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente);
  }

  
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}