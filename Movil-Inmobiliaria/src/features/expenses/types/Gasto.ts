export interface Gasto {
  id: string;
  fecha: string;
  descripcion: string;
  monto: string;
  estado: "Aprobado" | "Pendiente" | "Rechazado";
  comprobante?: string;
}
