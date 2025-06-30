export interface Customer {
  idCustomer?: number;
  clientCode: string;  // Nuevo campo ClientCode
  documentType: string;
  documentNumber: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  dateBirth: string;
  status?: string;
  role?: string;
}
