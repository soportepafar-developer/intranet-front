export type CategoriaSolicitud = 'CLIENTE' | 'FORMACION' | 'CV';

export type ClasificacionCliente = 'Lead / Prospecto' | 'Cliente Existente' | 'Postulante';

export type CanalOrigen = 'Formulario Web' | 'Instagram' | 'LinkedIn' | 'Correo Info';

export type EstadoSolicitud = 'Nuevo' | 'En revisión' | 'Respondido' | 'Cerrado';

export type SlaNivel = 'verde' | 'amarillo' | 'rojo' | 'atendido';

export interface InteraccionCliente {
  fecha: string;
  detalle: string;
  remitente?: string;
}

export interface CurriculumInfo {
  archivo: string;
  profesion: string;
  experiencia: string;
  disponibilidad: string;
  pdfUrl?: string;
}

export interface Solicitud {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  canal: CanalOrigen;
  categoria: CategoriaSolicitud;
  cliente: ClasificacionCliente;
  tipo: string;
  responsable: string;
  remitente: string;
  fechaRecepcion: string;
  slaHorasRestantes: number;
  slaLimiteDias: 2 | 3;
  estado: EstadoSolicitud;
  intranetNotificada: boolean;
  mensaje: string;
  autoRespuesta: string;
  cv: CurriculumInfo | null;
  historialPrevio: InteraccionCliente[];
}

export interface SolicitudesKpi {
  total: number;
  clientes: number;
  formacion: number;
  cv: number;
  alertasPlazo: number;
}
