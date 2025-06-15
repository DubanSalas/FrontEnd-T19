import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // Variable para controlar el estado del sidebar (colapsado o expandido)
  isCollapsed = false;

  // Método para alternar la visibilidad del sidebar
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
