import { Component, OnInit } from '@angular/core';
import { ArticulosService, Articulo } from '../servicios/articulos.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-articulos',
  standalone: true,
  templateUrl: './articulos.component.html',
  styleUrl: './articulos.component.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class ArticulosComponent implements OnInit {
  articulos: Articulo[] = [];
  articuloForm: FormGroup;
  modoEditar: boolean = false;
  idEditando: number | null = null;

  constructor(private servicio: ArticulosService, private fb: FormBuilder) {
    this.articuloForm = this.fb.group({
      nombre: [''],
      descripcion: [''],
      precio: [''],
      existencia: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerArticulos();
  }

  obtenerArticulos() {
    this.servicio.getArticulos().subscribe(data => {
      this.articulos = data;
    });
  }

  guardarArticulo() {
    const articulo = this.articuloForm.value;
    if (this.modoEditar && this.idEditando !== null) {
      this.servicio.actualizarArticulo(this.idEditando, articulo).subscribe(() => {
        this.obtenerArticulos();
        this.cancelarEditar();
      });
    } else {
      this.servicio.crearArticulo(articulo).subscribe(() => {
        this.obtenerArticulos();
        this.articuloForm.reset();
      });
    }
  }

  editarArticulo(articulo: Articulo) {
    this.modoEditar = true;
    this.idEditando = articulo.id_articulo!;
    this.articuloForm.patchValue(articulo);
  }

  cancelarEditar() {
    this.modoEditar = false;
    this.idEditando = null;
    this.articuloForm.reset();
  }

  eliminarArticulo(id: number) {
    if (confirm('¿Estás seguro de eliminar este artículo?')) {
      this.servicio.eliminarArticulo(id).subscribe(() => {
        this.obtenerArticulos();
      });
    }
  }
}
