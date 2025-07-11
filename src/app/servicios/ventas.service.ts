
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Cliente {
  id_cliente: number;
  nombre: string;
}

export interface DetalleVenta {
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;

}

export interface articulo{
    id_articulo: number;
    nombre: string;
    descripcion: string;
    precio: number;
    existencia: number;
}

@Injectable({
  providedIn: 'root',
})
export class VentasService {
   private apiUrl = 'http://localhost:3000/api/ventas';;

   private apiurlarticulos = 'http://localhost:3000/api/articulos';

  constructor(private http: HttpClient) {}


  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  
  crearVenta(id_admin: number, id_cliente: number): Observable<{ id_venta: number }> {
    return this.http.post<{ id_venta: number }>(`${this.apiUrl}`, { id_admin, id_cliente });
  }

 
  agregarDetalle(detalle: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/detalle`, detalle);
  }

  getventas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas`);
  }
  getarticulos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurlarticulos}/`);
  }

  actualizarTotal(id_venta: number) {
  return this.http.put(`${this.apiUrl}/ventas/actualizar-total/${id_venta}`, {});
}
getDetallesVenta(id_venta: number): Observable<DetalleVenta[]> {
  return this.http.get<DetalleVenta[]>(`${this.apiUrl}/detalle/${id_venta}`);
}
eliminarDetalle(id_detalle: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/detalle/${id_detalle}`);}

  editarDetalle(id_detalle: number, detalle: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/detalle/${id_detalle}`, detalle);
  }

  eliminarVenta(id_venta: number) {
  return this.http.delete(`${this.apiUrl}/ventas/${id_venta}`);
}
}
