import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { CustomerListComponent } from './feature/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './feature/customer/customer-form/customer-form.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'customer-list',
        component: CustomerListComponent
      },
      {
        path: 'customers-form',
        component: CustomerFormComponent
      }
    ]
  }
];
