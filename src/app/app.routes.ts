import { Routes } from '@angular/router';

// Componentes de Cliente
import { StudentListComponent } from './feature/Student/student-list/student-list.component';
import { StudentFormComponent } from './feature/Student/student.form/student-form.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'student/list',
        pathMatch: 'full'
      },
      {
        path: 'student/list',
        component: StudentListComponent
      },
      {
        path: 'student/form',
        component: StudentFormComponent
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'admin/student/list',
    pathMatch: 'full'
  }
];
