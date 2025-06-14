export interface Customer {
  idCustomer: number;      // ID del cliente
  documentType: string;    // Tipo de documento (DNI, CNE, etc.)
  documentNumber: string;  // Número de documento
  name: string;            // Nombre
  surname: string;         // Apellido
  address: string;         // Dirección
  phone: number;           // Teléfono (puedes usar number o string dependiendo de cómo lo almacenes)
  email: string;           // Correo electrónico
  dateBirth: string;       // Fecha de nacimiento
  status: string;          // Estado (A = Activo, I = Inactivo)
  role: string;            // Rol del cliente (si lo manejas)
}
