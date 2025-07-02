import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './registros.component.html'
})
export class RegistroComponent {
  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      nombre:      ['', Validators.required],
      direccion:   [''],
      telefono:    [''],
      email:       ['', [Validators.required, Validators.email]],
      usuario:     ['', Validators.required],
      contrasena:  ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registrar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.authService.registrarCliente(this.formulario.value)
      .subscribe({
        next: ({ mensaje }) => {
          alert(mensaje);
          this.formulario.reset();
          this.router.navigate(['/login']);
        },
        error: err => {
          alert(err.error?.mensaje || 'Error en el registro');
        }
      });
  }
}
