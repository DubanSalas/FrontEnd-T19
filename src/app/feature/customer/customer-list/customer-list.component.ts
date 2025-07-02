import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/interfaces/customer-interfaces';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  state: string = 'A';
  searchTerm: string = '';
  displayedColumns: string[] = [
    'idCustomer', 'documentType', 'documentNumber', 'name', 'surname',
    'address', 'phone', 'email', 'dateBirth', 'status', 'actions'
  ];
  dataSource: Customer[] = [];
  filteredData: Customer[] = [];

  private customerService = inject(CustomerService);
  private router = inject(Router);

  ngOnInit(): void {
    this.showActionAlert();
    this.loadCustomersByState();
  }

  showActionAlert(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { action?: string };

    if (state?.action === 'created') {
      Swal.fire('Cliente registrado', 'El nuevo cliente fue registrado exitosamente.', 'success');
    } else if (state?.action === 'updated') {
      Swal.fire('Cliente actualizado', 'El cliente fue editado exitosamente.', 'info');
    }
  }

  loadCustomersByState(): void {
    this.customerService.findByStatus(this.state).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.applyFilter();
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los clientes.', 'error');
      }
    });
  }

  setState(newState: string): void {
    if (this.state !== newState) {
      this.state = newState;
      this.loadCustomersByState();
    }
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredData = this.dataSource;
      return;
    }
    this.filteredData = this.dataSource.filter(customer =>
      customer.name.toLowerCase().includes(term) ||
      customer.surname.toLowerCase().includes(term) ||
      customer.documentNumber.toLowerCase().includes(term)
    );
  }

  goCustomerForm(): void {
    this.customerService.setSelectedCustomer(null);
    this.router.navigate(['/admin/customer/form']);
  }

  onEdit(customer: Customer): void {
    if (!customer.idCustomer) {
      Swal.fire('Error', 'El cliente no tiene un ID válido.', 'error');
      return;
    }
    this.customerService.setSelectedCustomer(customer);
    this.router.navigate(['/admin/customer/form']);
  }

  delete(idCustomer: number): void {
    if (!idCustomer) {
      Swal.fire('Error', 'No se puede eliminar un cliente sin un ID válido.', 'error');
      return;
    }
    Swal.fire({
      title: '¿Deseas inactivar este cliente?',
      text: 'El cliente no se eliminará, solo cambiará a estado inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, inactivar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.customerService.delete(idCustomer).subscribe({
          next: () => {
            Swal.fire('Inactivado', 'Cliente inactivado correctamente.', 'success');
            this.loadCustomersByState();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo inactivar el cliente.', 'error');
          }
        });
      }
    });
  }

  restore(idCustomer: number): void {
    Swal.fire({
      title: '¿Deseas restaurar este cliente?',
      text: 'El cliente será marcado como activo nuevamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.customerService.restore(idCustomer).subscribe({
          next: () => {
            Swal.fire('Restaurado', 'Cliente restaurado correctamente.', 'success');
            this.loadCustomersByState();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo restaurar el cliente.', 'error');
          }
        });
      }
    });
  }

  // 📄 Generar y descargar reporte PDF
  reportPdf(): void {
    this.customerService.reportPdf().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'reporte_clientes.pdf';
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo generar el reporte.', 'error');
      }
    });
  }
}
