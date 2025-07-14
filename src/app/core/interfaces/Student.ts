export interface Student {
  idStudent?: number;
  documentType: 'DNI' | 'CNE';
  documentNumber: string;
  name: string;
  surname: string;
  dateBirth: string | Date;
  address: string;
  phone: string;
  email: string;
  status?: 'A' | 'I';
  course: string;
  location: {
    department: string;
    province: string;
    district: string;
  };
  academicCycle: string;
}
