import { Component, OnInit } from '@angular/core';
import { VentasService, Cliente } from '../servicios/ventas.service'; 
import{ CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar ngModel
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './ventas.component.html',
})
export class VentasComponent implements OnInit {
  clientes: Cliente[] = [];
  articulos: any[] = [];

  ventaSeleccionada: number | null = null;
  
  id_clienteSeleccionado: number | null = null;

  id_admin: number = 1; 

  ventas: any[] = [];
  detallesVenta: any[] = [];

  mostrarFormulario = false;

  modoEdicion: { [id_detalle: number]: boolean } = {};

  ventaAEliminar: number | null = null;
  
  detalle = {
  id_articulo: null,
  nombre: null,
  cantidad: null,
  precio_u: null
  
};

  constructor(private api: VentasService, private toastr :ToastrService) {}

  ngOnInit() {
    this.cargarVentas();
    this.api.getarticulos().subscribe(articulos => {
    this.articulos = articulos;
    console.log('Artículos cargados:', articulos); // <-- agrega esto para debug
  });
    this.api.getClientes().subscribe((clientes) => {
      this.clientes = clientes;
    });
  }

   onArticuloChange() {
    const articuloSeleccionado = this.articulos.find(
      a => a.id_articulo === this.detalle.id_articulo
    );
    if (articuloSeleccionado) {
      this.detalle.precio_u = articuloSeleccionado.precio;
    } else {
      this.detalle.precio_u = null;
    }
  }

  crearVenta() {
    if (!this.id_clienteSeleccionado) {
      this.toastr.warning('Por favor, selecciona un cliente.', 'Advertencia');
      return;
    }

    this.api.crearVenta(this.id_admin, this.id_clienteSeleccionado).subscribe(
      (res) => {
        this.toastr.success('Venta creada con exito', 'Éxito');
        this.mostrarFormulario = false;
        this.cargarVentas();
      },
      (error) => {
        this.toastr.error('Error al crear la venta', 'Error');
        console.error('Error al crear la venta:', error);
      }
    );
  }
  cargarVentas() {
  this.api.getventas().subscribe((data) => {
    this.ventas = data;
    console.log('Ventas cargadas:', data);
  });
}
  abrirModalDetalle(id_venta: number) {
  if (this.ventaSeleccionada === id_venta) {
    this.ventaSeleccionada = null; 
     this.detallesVenta = [];
  } else {
    this.ventaSeleccionada = id_venta; // abre modal para esta venta
     this.api.getDetallesVenta(id_venta).subscribe((detalles) => {
      this.detallesVenta = detalles;
    });
  }

  this.detalle = { id_articulo: null, nombre:null , cantidad: null, precio_u: null };
}

agregarDetalle() {
   if (
    !this.detalle.id_articulo ||
    this.detalle.cantidad == null 
  ) {
    this.toastr.warning('Por favor, completa todos los campos.', 'Advertencia');
    return;
  }

  if (
    isNaN(this.detalle.cantidad) || this.detalle.cantidad <= 0 
  ) {
    this.toastr.warning('La cantidad debe ser un número valido y mayor a 0.', 'Advertencia');
    return;
  }

  const detalleCompleto = {
    id_venta: this.ventaSeleccionada, 
    ...this.detalle,
  };

  this.api.agregarDetalle(detalleCompleto).subscribe(
    (res) => {
      this.toastr.success('Detalle agregado con exito', 'Éxito');
      this.detalle = { id_articulo: null,nombre:null, cantidad: null,precio_u:null }; 
      this.cargarVentas(); 
    },
    (error) => {
      this.toastr.error('Error al agregar el detalle', 'Error');
    }
  );
}

   

verDetalles(id_venta: number) {
  this.api.getDetallesVenta(id_venta).subscribe((detalles) => {
    this.detallesVenta = detalles;
    this.ventaSeleccionada = id_venta;
  });
}

activarEdicion(id_detalle: number) {
  this.modoEdicion[id_detalle] = true;
}

guardarEdicion(detalle: any) {

  if(detalle.cantidad == null){
    this.toastr.warning('Por favor, completa todos los campos.', 'Advertencia');
    return;
  }


  if(isNaN(detalle.cantidad) || isNaN (detalle.precio_u)){
    this.toastr.warning('La cantidad y el precio deben ser números válidos.', 'Advertencia');
    return
  }

  if(detalle.cantidad <= 0 || detalle.precio_u <= 0) {
    this.toastr.warning('La cantidad y el precio deben ser mayores a 0.', 'Advertencia');
    return;
  }

  this.api.editarDetalle(detalle.id_detalle, detalle).subscribe(() => {
    this.toastr.success('Detalle actualizado con éxito', 'Éxito');
    this.modoEdicion[detalle.id_detalle] = false;
    this.cargarVentas();
    this.verDetalles(this.ventaSeleccionada!);
  });
}

eliminarDetalle(id_detalle: number) {
  if (confirm('¿Seguro que deseas eliminar este detalle?')) {
    this.api.eliminarDetalle(id_detalle).subscribe(() => {
      this.toastr.success('Detalle eliminado con éxito', 'Éxito');
      this.verDetalles(this.ventaSeleccionada!);
      this.cargarVentas();
    });
  }
}

confirmarEliminacionVenta(id: number): void {
  this.ventaAEliminar = id;
}

cancelarEliminacionVenta(): void {
  this.ventaAEliminar = null;
}

eliminarVentaConfirmada(): void {
  if (this.ventaAEliminar !== null) {
    this.api.eliminarVenta(this.ventaAEliminar).subscribe(() => {
      this.cargarVentas();
      this.ventaAEliminar = null;
      this.toastr.success('Venta eliminada con éxito', 'Éxito');
    });
  }
}

}

