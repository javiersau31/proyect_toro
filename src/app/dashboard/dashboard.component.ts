
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servicios/auth.service'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  sesionActiva: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.sesionActiva$.subscribe((estado) => {
      this.sesionActiva = estado;
    });

    console.log('Token recuperado en Dashboard:', localStorage.getItem('token'));
  }
}
