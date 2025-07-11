import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

   this.authService.login(this.loginForm.value)
    .subscribe({
      next: (resp) => {
        if (resp && resp.token) {
          this.authService.iniciarSesion(resp.token);
          this.toastr.success('Inicio de sesion exitoso', 'Éxito');
          this.loginForm.reset();
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error('Credenciales invalidas', 'Error');
        }
      },
      error: err => {
        this.toastr.error(err.error?.mensaje || 'Error al iniciar sesion', 'Error');
      }
    });

}
}
