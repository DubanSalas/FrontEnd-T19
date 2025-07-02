export interface Supplier {
  idSupplier?: number;           // ID generado automáticamente
  documentType: string;          // ej. "DNI", "RUC", etc.
  documentNumber: string;
  name: string;
  surname: string;
  address?: string | null;
  email: string;
  phone?: string | null;
  status?: 'A' | 'I';            // opcionalmente podrías usar union types
}
