import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'; // Para mat-icon
import { MatListModule } from '@angular/material/list'; // Agregar MatListModule

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule],  // Asegúrate de incluir MatListModule aquí
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  expanded = true;
  selectedMenuItem: string = '';

  @Output() toggleSidebar = new EventEmitter<boolean>();

  toggle() {
    this.expanded = !this.expanded;
    this.toggleSidebar.emit(this.expanded);
  }

  selectMenuItem(menuItem: string) {
    this.selectedMenuItem = menuItem;
  }

  // Asegúrate de definir un método de logout
  logout() {
    console.log('Cerrando sesión...');
    // Aquí puedes agregar la lógica para cerrar sesión (limpiar tokens, redirigir, etc.)
  }
}
