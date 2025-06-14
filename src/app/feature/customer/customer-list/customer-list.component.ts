import { Component, OnInit, inject } from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Customer } from '../../../core/interfaces/customer-interfaces';

@Component({
  selector: 'app-customer-list-html',
  standalone: true,
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterModule,
  ]
})
export class CustomerListHtmlComponent implements OnInit {
  state: string = 'A';  // Estado de los clientes (activo, inactivo, etc.)
  customers: Customer[] = [];  // Lista de clientes
  filteredCustomers: Customer[] = []; // Lista de clientes filtrados según búsqueda
  searchQuery: string = ''; // Query para buscar clientes

  displayedColumns: string[] = [
    'idCustomer', 'documentType', 'documentNumber', 'firstName', 'lastName', 'district', 'email', 'phone', 'status', 'actions'
  ];

  router = inject(Router);
  customerService = inject(CustomerService);

  ngOnInit(): void {
    this.loadCustomers(); // Carga los clientes al inicializar
  }

  // Método para cargar los clientes según el estado
  loadCustomers(): void {
    this.customerService.findByState(this.state).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.customers = response;
          this.filteredCustomers = response; // Inicializa el filtro
        } else {
          console.warn('No se encontraron clientes con el estado: ', this.state);
        }
      },
      error: (err) => {
        console.error('Error al cargar los clientes:', err);
      }
    });
  }

  // Filtra los clientes según el texto de búsqueda
  filterCustomers(): void {
    if (!this.searchQuery) {
      this.filteredCustomers = this.customers;  // Si no hay búsqueda, muestra todos
      return;
    }
    this.filteredCustomers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      customer.surname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      customer.documentNumber.includes(this.searchQuery)
    );
  }

  // Lógica para editar un cliente
  onEdit(customer: Customer): void {
    this.customerService.setSelectedCustomer(customer); // Establece el cliente seleccionado en el servicio
    this.router.navigate(['/customer-form']);  // Navega al formulario de cliente
  }

  // Lógica para eliminar un cliente con confirmación de SweetAlert
  delete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar este cliente?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Sí, eliminar',
      denyButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminando...', '', 'success');
        this.customerService.delete(id).subscribe({
          next: () => {
            this.loadCustomers();  // Recarga la lista de clientes después de eliminar
            console.log('Cliente eliminado con éxito');
          },
          error: (err) => {
            Swal.fire('Error', 'Hubo un problema al eliminar el cliente.', 'error');
            console.error('Error al eliminar cliente:', err);
          }
        });
      }
    });
  }

  // Lógica para cambiar el estado entre "Activo" e "Inactivo"
  toggleStatus(customer: Customer): void {
    const newStatus = customer.status === 'A' ? 'I' : 'A'; // Cambiar el estado entre 'A' (Activo) e 'I' (Inactivo)

    // Actualiza el estado del cliente en el backend
    this.customerService.updateStatus(customer.idCustomer, newStatus).subscribe({
      next: () => {
        customer.status = newStatus;  // Actualiza el estado en la vista
        Swal.fire(
          'Estado actualizado',
          `El cliente ahora está ${newStatus === 'A' ? 'activo' : 'inactivo'}`,
          'success'
        );
      },
      error: (err) => {
        Swal.fire('Error', 'Hubo un problema al actualizar el estado del cliente.', 'error');
        console.error('Error al actualizar estado:', err);
      }
    });
  }
}
