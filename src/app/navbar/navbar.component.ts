import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servicios/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  sesionActiva: boolean = false;
  private sesionSub!: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
   
    this.sesionSub = this.authService.sesionActiva$.subscribe((estado: boolean) => {
      this.sesionActiva = estado;
    });
  }

  cerrarSesion() {
    this.authService.cerrarSesion(); 
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.sesionSub.unsubscribe(); 
  }
}
