import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';  // Importa el Router para la navegación
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    RouterOutlet,
  ]
})
export class AppComponent {
  title = 'delipedidos';

  constructor(private router: Router) {}  // Inyecta Router en el constructor

  // Método para redirigir al formulario de cliente
  goCustomerForm(): void {
    this.router.navigate(['/register-customer']); // Redirige a la ruta de registro de cliente
  }

  // Método para togglear el sidebar
  toggleSidebar() {
    console.log('Toggling sidebar');
  }
}
