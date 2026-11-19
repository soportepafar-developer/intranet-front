import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  EstadoSolicitud,
  Solicitud,
  SolicitudesKpi,
} from '../../models/solicitud';

const MOCK_SOLICITUDES: Solicitud[] = [
  {
    id: 'SOL-105',
    nombre: 'Lucía Fernández',
    email: 'lucia.f@clinica.com',
    telefono: '+58 414 221 9834',
    empresa: 'Clínica Santa María',
    canal: 'LinkedIn',
    categoria: 'CLIENTE',
    cliente: 'Lead / Prospecto',
    tipo: 'Información Comercial',
    responsable: 'Yamile (Operaciones)',
    remitente: 'info@ponasociado.com',
    fechaRecepcion: '2026-11-19 08:30',
    slaHorasRestantes: 44.5,
    slaLimiteDias: 2,
    estado: 'Nuevo',
    intranetNotificada: true,
    mensaje:
      'Hola, vimos su publicación en LinkedIn y queremos cotizar servicios de laboratorio para nuestra clínica.',
    autoRespuesta:
      'Lucía, gracias por escribirnos. Tu requerimiento será atendido en un periodo no mayor a 2 días.',
    cv: null,
    historialPrevio: [
      {
        fecha: '2026-10-02',
        detalle: 'Descargó brochure de servicios desde Formulario Web.',
      },
    ],
  },
  {
    id: 'SOL-104',
    nombre: 'Marcos Rivas',
    email: 'mrivas@instituto.edu',
    telefono: '+58 412 889 1102',
    empresa: 'Instituto BioSalud',
    canal: 'Instagram',
    categoria: 'FORMACION',
    cliente: 'Cliente Existente',
    tipo: 'Formación / Cursos',
    responsable: 'Nicolás (Formación)',
    remitente: 'programacion@ponasociado.com',
    fechaRecepcion: '2026-11-17 11:15',
    slaHorasRestantes: 5.2,
    slaLimiteDias: 2,
    estado: 'En revisión',
    intranetNotificada: true,
    mensaje:
      'Ya somos clientes, necesitamos fechas del próximo curso de formación técnica para 10 personas.',
    autoRespuesta:
      'Marcos, gracias por escribirnos. Tu consulta fue derivada a Formación. Responderemos en máx. 2 días.',
    cv: null,
    historialPrevio: [
      {
        fecha: '2026-08-15',
        detalle: 'Curso completado: Bioseguridad Nivel II (8 participantes).',
      },
      {
        fecha: '2026-03-10',
        detalle: 'Cotización aprobada: Análisis de muestras.',
      },
    ],
  },
  {
    id: 'SOL-103',
    nombre: 'Ana Sofía Pérez',
    email: 'anaperez.bio@gmail.com',
    telefono: '+58 424 771 0043',
    canal: 'Correo Info',
    categoria: 'CV',
    cliente: 'Postulante',
    tipo: 'Empleo / Laboratorio',
    responsable: 'Isamar (Talento Humano)',
    remitente: 'talentohumano@ponasociado.com',
    fechaRecepcion: '2026-11-18 16:00',
    slaHorasRestantes: 62.0,
    slaLimiteDias: 3,
    estado: 'Nuevo',
    intranetNotificada: true,
    mensaje:
      'Adjunto mi hoja de vida para la vacante de tiempo completo en el laboratorio.',
    autoRespuesta:
      'Ana Sofía, hemos recibido tu postulación y CV. Administración responderá en un plazo máximo de 3 días.',
    cv: {
      archivo: 'CV_Ana_Sofia_Perez_2026.pdf',
      profesion: 'Bioanalista / Lic. en Biología',
      experiencia: '4 años en laboratorio clínico y control de calidad',
      disponibilidad: 'Inmediata (Tiempo completo)',
    },
    historialPrevio: [],
  },
  {
    id: 'SOL-102',
    nombre: 'Diego Torres',
    email: 'dtorres@correo.com',
    telefono: '+58 416 330 4412',
    canal: 'Formulario Web',
    categoria: 'FORMACION',
    cliente: 'Lead / Prospecto',
    tipo: 'Formación / Cursos',
    responsable: 'Nicolás (Formación)',
    remitente: 'programacion@ponasociado.com',
    fechaRecepcion: '2026-11-17 07:00',
    slaHorasRestantes: -2.5,
    slaLimiteDias: 2,
    estado: 'Nuevo',
    intranetNotificada: true,
    mensaje: 'Quisiera saber si tienen algún curso abierto este mes.',
    autoRespuesta:
      'Diego, gracias por escribirnos. Responderemos en un periodo no mayor a 2 días.',
    cv: null,
    historialPrevio: [],
  },
  {
    id: 'SOL-101',
    nombre: 'Valeria Gómez',
    email: 'vgomez.lab@gmail.com',
    telefono: '+58 412 901 3321',
    canal: 'Correo Info',
    categoria: 'CV',
    cliente: 'Postulante',
    tipo: 'Empleo / Administración',
    responsable: 'Isamar (Talento Humano)',
    remitente: 'talentohumano@ponasociado.com',
    fechaRecepcion: '2026-11-16 14:20',
    slaHorasRestantes: 7.5,
    slaLimiteDias: 3,
    estado: 'En revisión',
    intranetNotificada: true,
    mensaje: 'Postulación para auxiliar administrativo en laboratorio.',
    autoRespuesta:
      'Valeria, recibimos tu postulación. Plazo máximo de respuesta: 3 días.',
    cv: {
      archivo: 'CV_Valeria_Gomez.pdf',
      profesion: 'TSU en Administración / Asistente de Laboratorio',
      experiencia: '2 años en gestión de muestras y facturación',
      disponibilidad: 'Inmediata',
    },
    historialPrevio: [],
  },
  {
    id: 'SOL-100',
    nombre: 'Corporación Médica del Este',
    email: 'compras@corpomedica.com',
    telefono: '+58 212 993 4510',
    empresa: 'Corporación Médica del Este',
    canal: 'Correo Info',
    categoria: 'CLIENTE',
    cliente: 'Cliente Existente',
    tipo: 'Renovación de Contrato',
    responsable: 'Yamile (Operaciones)',
    remitente: 'info@ponasociado.com',
    fechaRecepcion: '2026-11-18 09:00',
    slaHorasRestantes: 24.0,
    slaLimiteDias: 2,
    estado: 'Respondido',
    intranetNotificada: true,
    mensaje:
      'Solicitamos actualización de tarifas 2027 para nuestro convenio anual de análisis.',
    autoRespuesta:
      'Gracias por contactarnos. Tu solicitud será atendida en un plazo máximo de 2 días.',
    cv: null,
    historialPrevio: [
      {
        fecha: '2026-11-18',
        detalle: 'Respuesta enviada con propuesta comercial adjunta.',
        remitente: 'info@ponasociado.com',
      },
      {
        fecha: '2025-11-20',
        detalle: 'Firma de convenio anual de análisis clínicos.',
      },
    ],
  },
];

@Injectable({
  providedIn: 'root',
})
export class SolicitudesService {
  private readonly solicitudesSubject = new BehaviorSubject<Solicitud[]>(
    structuredClone(MOCK_SOLICITUDES)
  );

  getSolicitudes$(): Observable<Solicitud[]> {
    return this.solicitudesSubject.asObservable();
  }

  getSnapshot(): Solicitud[] {
    return this.solicitudesSubject.getValue();
  }

  calcularKpis(lista: Solicitud[]): SolicitudesKpi {
    const pendientes = lista.filter(
      (s) => s.estado === 'Nuevo' || s.estado === 'En revisión'
    );
    return {
      total: lista.length,
      clientes: lista.filter((s) => s.categoria === 'CLIENTE').length,
      formacion: lista.filter((s) => s.categoria === 'FORMACION').length,
      cv: lista.filter((s) => s.categoria === 'CV').length,
      alertasPlazo: pendientes.filter((s) => s.slaHorasRestantes <= 8).length,
    };
  }

  updateEstado(id: string, estado: EstadoSolicitud): void {
    const updated = this.getSnapshot().map((s) =>
      s.id === id ? { ...s, estado } : s
    );
    this.solicitudesSubject.next(updated);
  }

  updateResponsable(id: string, responsable: string): void {
    const updated = this.getSnapshot().map((s) =>
      s.id === id ? { ...s, responsable } : s
    );
    this.solicitudesSubject.next(updated);
  }

  registrarRespuesta(id: string, texto: string, remitente: string): void {
    const hoy = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const updated = this.getSnapshot().map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        estado: 'Respondido' as EstadoSolicitud,
        historialPrevio: [
          {
            fecha: hoy,
            detalle: `Respuesta enviada desde ${remitente}: "${texto}"`,
            remitente,
          },
          ...s.historialPrevio,
        ],
      };
    });
    this.solicitudesSubject.next(updated);
  }
}
