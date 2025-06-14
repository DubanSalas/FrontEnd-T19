import { Routes } from '@angular/router';
import { CustomerListHtmlComponent } from './feature/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './feature/customer/customer-form/customer-form.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customer-list', pathMatch: 'full' },
  {
    path: '',
    component: AdminLayoutComponent,  // AdminLayoutComponent actúa como contenedor
    children: [
      { path: 'customer-list', component: CustomerListHtmlComponent },
      { path: 'customer-form', component: CustomerFormComponent },
    ]
  }
];
