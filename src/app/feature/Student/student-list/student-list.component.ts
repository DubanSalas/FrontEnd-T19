import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { StudentService } from '../../../core/services/Student.service';
import { Student } from '../../../core/interfaces/Student';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  state: 'A' | 'I' = 'A';
  displayedColumns: string[] = [
    'idStudent', 'documentType', 'documentNumber', 'name', 'surname',
    'address', 'phone', 'email', 'dateBirth', 'course', 'location', 'academicCycle', 'actions'
  ];
  dataSource: Student[] = [];
  searchTerm = '';
  filterDepartment = '';
  filterProvince = '';
  filterDistrict = '';
  filterAge: number | null = null;

  uniqueDepartments: string[] = [];
  uniqueProvinces: string[] = [];
  uniqueDistricts: string[] = [];

  allDepartments: any[] = [];
  allProvinces: any[] = [];
  allDistricts: any[] = [];

  enableProvince = false;
  enableDistrict = false;

  private studentService = inject(StudentService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadUbigeo();
    this.loadStudentsByState();
  }

  loadUbigeo(): void {
    this.studentService.getRawDepartments().subscribe((deps: any[]) => {
      this.allDepartments = deps;
      this.uniqueDepartments = deps.map(d => d.name);
    });

    this.studentService.getRawProvinces().subscribe((provs: any[]) => {
      this.allProvinces = provs;
    });

    this.studentService.getRawDistricts().subscribe((dists: any[]) => {
      this.allDistricts = dists;
    });
  }

  onDepartmentChange(): void {
    const selectedDep = this.allDepartments.find(d => d.name === this.filterDepartment);
    if (selectedDep) {
      const depId = selectedDep.id;
      const provs = this.allProvinces.filter(p => p.department_id === depId);
      this.uniqueProvinces = provs.map(p => p.name);
      this.enableProvince = true;
    } else {
      this.uniqueProvinces = [];
      this.enableProvince = false;
    }

    this.filterProvince = '';
    this.filterDistrict = '';
    this.uniqueDistricts = [];
    this.enableDistrict = false;

    this.onSearchChange();
  }

  onProvinceChange(): void {
    const selectedDep = this.allDepartments.find(d => d.name === this.filterDepartment);
    const selectedProv = this.allProvinces.find(p => p.name === this.filterProvince && p.department_id === selectedDep?.id);

    if (selectedProv) {
      const provId = selectedProv.id;
      const dists = this.allDistricts.filter(d => d.province_id === provId);
      this.uniqueDistricts = dists.map(d => d.name);
      this.enableDistrict = true;
    } else {
      this.uniqueDistricts = [];
      this.enableDistrict = false;
    }

    this.filterDistrict = '';
    this.onSearchChange();
  }

  loadStudentsByState(): void {
    const callback = (data: Student[]) => {
      data.sort((a, b) => `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`));
      this.dataSource = this.applyFilters(data);
    };

    if (this.filterAge !== null && this.filterAge >= 0) {
      this.studentService.getByAge(this.filterAge).subscribe({
        next: callback,
        error: () => Swal.fire('Error', 'No se pudo filtrar por edad', 'error')
      });
    } else {
      this.studentService.findByStatus(this.state).subscribe({
        next: callback,
        error: () => Swal.fire('Error', 'No se pudieron cargar los estudiantes', 'error')
      });
    }
  }

  applyFilters(data: Student[]): Student[] {
    return data.filter(s => {
      const fullName = `${s.name} ${s.surname}`.toLowerCase();
      const searchMatch = !this.searchTerm || fullName.includes(this.searchTerm.toLowerCase());

      const departmentMatch = !this.filterDepartment || s.location?.department?.toLowerCase() === this.filterDepartment.toLowerCase();
      const provinceMatch = !this.filterProvince || s.location?.province?.toLowerCase() === this.filterProvince.toLowerCase();
      const districtMatch = !this.filterDistrict || s.location?.district?.toLowerCase() === this.filterDistrict.toLowerCase();

      return searchMatch && departmentMatch && provinceMatch && districtMatch;
    });
  }

  onSearchChange(): void {
    this.loadStudentsByState();
  }

  setState(newState: 'A' | 'I'): void {
    if (this.state !== newState) {
      this.state = newState;
      this.loadStudentsByState();
    }
  }

  goStudentForm(): void {
    this.studentService.setSelectedStudent(null);
    this.router.navigate(['/admin/student/form']);
  }

  onEdit(student: Student): void {
    this.studentService.setSelectedStudent(student);
    this.router.navigate(['/admin/student/form']);
  }

  delete(id: number | undefined): void {
    if (!id) return;
    Swal.fire({
      title: '¿Eliminar estudiante?',
      text: 'Esta acción es irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(res => {
      if (res.isConfirmed) {
        this.studentService.delete(id).subscribe(() => {
          this.loadStudentsByState();
          Swal.fire('Eliminado', 'Estudiante eliminado', 'success');
        });
      }
    });
  }

  restore(id: number | undefined): void {
    if (!id) return;
    this.studentService.restore(id).subscribe(() => {
      this.loadStudentsByState();
      Swal.fire('Restaurado', 'Estudiante restaurado', 'success');
    });
  }

  reportPdf(): void {
    this.studentService.reportPdf().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte_estudiantes.pdf';
      a.click();
      URL.revokeObjectURL(url);
    }, error => {
      Swal.fire('Error', 'Hubo un problema al generar el reporte', 'error');
      console.error('Error al generar el reporte:', error);
    });
  }
}
