export interface Customer {
  idCustomer?: number;  // ID único del cliente en la base de datos, opcional en caso de que no se haya asignado
  clientCode: string;  // Código único del cliente, ahora obligatorio
  documentType: string;  // Tipo de documento (por ejemplo, DNI, CNE)
  documentNumber: string;  // Número de documento del cliente
  name: string;  // Nombre del cliente
  surname: string;  // Apellido del cliente
  email: string;  // Email del cliente
  phone: string;  // Teléfono del cliente
  address: string;  // Dirección del cliente
  dateBirth: string | Date;  // Fecha de nacimiento del cliente, puede ser un string o Date
  status?: string;  // Estado del cliente (A: activo, I: inactivo), opcional
  role?: string;  // Rol del cliente, opcional
}
