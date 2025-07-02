import { Routes } from '@angular/router';
import { RegistroComponent } from './registros/registros.component'; 

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'registro', loadComponent: () => import('./registros/registros.component').then(m => m.RegistroComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  {path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
];
