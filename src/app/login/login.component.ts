import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

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
    private router: Router
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
          alert('Inicio de sesión exitoso');
          this.loginForm.reset();
          this.router.navigate(['/dashboard']);
        } else {
          alert('No se recibió el token en la respuesta');
        }
      },
      error: err => {
        alert(err.error?.mensaje || 'Error en el inicio de sesión');
      }
    });

}
}
