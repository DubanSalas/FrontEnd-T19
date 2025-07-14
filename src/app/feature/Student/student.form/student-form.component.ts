import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { StudentService } from '../../../core/services/Student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;

  departamentos: { id: string; name: string }[] = [];
  provincias: { id: string; name: string; department_id: string }[] = [];
  distritos: { id: string; name: string; province_id: string }[] = [];

  filteredProvincias: { id: string; name: string; department_id: string }[] = [];
  filteredDistritos: { id: string; name: string; province_id: string }[] = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private studentService = inject(StudentService);

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      idStudent: [null],
      documentType: ['DNI', Validators.required],
      documentNumber: ['', [Validators.required, this.validateDocumentNumber.bind(this)]],
      name: ['', [Validators.required, Validators.pattern(/^(?!.*\s{2,})[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s[A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$/)]],
      surname: ['', [Validators.required, Validators.pattern(/^(?!.*\s{2,})[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s[A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$/)]],
      address: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚñáéíóú0-9\s\.,#\-]+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^9\d{8}$/), this.validatePhoneNumber]],
      email: ['', [Validators.required, Validators.email]],
      dateBirth: ['', [Validators.required, this.validateAge]],
      department: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      academicCycle: ['', Validators.required],
      course: ['', Validators.required]
    });

    this.loadUbigeoData();

    this.studentService.selectedStudent$.subscribe(student => {
      if (student) {
        this.studentForm.patchValue({
          idStudent: student.idStudent,
          documentType: student.documentType,
          documentNumber: student.documentNumber,
          name: student.name,
          surname: student.surname,
          address: student.address,
          phone: student.phone,
          email: student.email,
          dateBirth: student.dateBirth,
          academicCycle: student.academicCycle,
          course: student.course,
          department: student.location?.department,
          province: student.location?.province,
          district: student.location?.district
        });

        // Aplicar filtros si ya viene con ubicación seleccionada
        this.onDepartmentChange();
        this.onProvinceChange();
      }
    });
  }

  loadUbigeoData(): void {
    this.studentService.getRawDepartments().subscribe(data => this.departamentos = data);
    this.studentService.getRawProvinces().subscribe(data => {
      this.provincias = data;
      this.onDepartmentChange();
    });
    this.studentService.getRawDistricts().subscribe(data => {
      this.distritos = data;
      this.onProvinceChange();
    });
  }

  onDepartmentChange(): void {
    const selectedDept = this.studentForm.get('department')?.value;
    const deptObj = this.departamentos.find(d => d.name === selectedDept);
    this.filteredProvincias = deptObj
      ? this.provincias.filter(p => p.department_id === deptObj.id)
      : [];
    this.studentForm.get('province')?.setValue('');
    this.filteredDistritos = [];
    this.studentForm.get('district')?.setValue('');
  }

  onProvinceChange(): void {
    const selectedProv = this.studentForm.get('province')?.value;
    const provObj = this.provincias.find(p => p.name === selectedProv);
    this.filteredDistritos = provObj
      ? this.distritos.filter(d => d.province_id === provObj.id)
      : [];
    this.studentForm.get('district')?.setValue('');
  }

  validateAge(control: AbstractControl): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 18 ? { underage: true } : null;
  }

  validateDocumentNumber(control: AbstractControl): { [key: string]: boolean } | null {
    const documentType = this.studentForm?.get('documentType')?.value;
    const value = control.value;
    if (documentType === 'DNI') {
      return /^\d{8}$/.test(value) ? null : { invalidDNI: true };
    } else if (documentType === 'CNE') {
      return /^\d{1,20}$/.test(value) ? null : { invalidCNE: true };
    }
    return null;
  }

  validatePhoneNumber(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    const repeatedZeros = /(0)\1{5,}/;
    return repeatedZeros.test(value) ? { tooManyZeros: true } : null;
  }

  isInvalid(controlName: string): boolean {
    const control = this.studentForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.studentForm.get(controlName);
    return !!(control?.hasError(errorCode) && control?.touched);
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto o inválido',
        text: 'Por favor, completa todos los campos correctamente.'
      });
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value;
    const student = {
      idStudent: formValue.idStudent,
      documentType: formValue.documentType,
      documentNumber: formValue.documentNumber,
      name: formValue.name,
      surname: formValue.surname,
      address: formValue.address,
      phone: formValue.phone,
      email: formValue.email,
      dateBirth: formValue.dateBirth,
      academicCycle: formValue.academicCycle,
      course: formValue.course,
      location: {
        department: formValue.department,
        province: formValue.province,
        district: formValue.district
      }
    };

    const isUpdate = !!student.idStudent;
    const request$ = isUpdate
      ? this.studentService.update(student)
      : this.studentService.create(student);

    request$.subscribe({
      next: () => {
        this.studentService.setSelectedStudent(null);
        this.router.navigate(['/admin/student/list']);
        Swal.fire({
          icon: 'success',
          title: isUpdate ? 'Estudiante actualizado' : 'Estudiante registrado',
          text: isUpdate
            ? 'La información del estudiante se actualizó correctamente.'
            : 'El estudiante fue registrado exitosamente.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar la información del estudiante.'
        });
      }
    });
  }

  onCancel(): void {
    this.studentService.setSelectedStudent(null);
    this.router.navigate(['/admin/student/list']);
  }
}
