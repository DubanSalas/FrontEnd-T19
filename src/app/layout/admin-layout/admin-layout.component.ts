import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { RouterModule } from '@angular/router';  // Importa RouterModule
import { MatButtonModule } from '@angular/material/button';  // Si es necesario para los botones
import { MatIconModule } from '@angular/material/icon';  // Importa MatIconModule para los íconos

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    SidebarComponent, 
    HeaderComponent, 
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatIconModule  // Asegúrate de agregar MatIconModule aquí
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  isSidebarCollapsed = false;  // Inicialmente la barra lateral está visible

  // Método para alternar el estado de la barra lateral
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
