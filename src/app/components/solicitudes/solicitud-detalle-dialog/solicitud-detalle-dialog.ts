import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EstadoSolicitud, Solicitud } from '../../../models/solicitud';
import { SolicitudesService } from '../../../services/solicitudes/solicitudes.service';
import { getInitials, getSlaBadgeInfo, SlaBadgeInfo } from '../utils/sla.utils';

@Component({
  selector: 'app-solicitud-detalle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
  ],
  templateUrl: './solicitud-detalle-dialog.html',
  styleUrl: './solicitud-detalle-dialog.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SolicitudDetalleDialog implements OnInit, OnDestroy {
  solicitud: Solicitud;
  respuestaTexto = '';
  estadoSeleccionado: EstadoSolicitud;
  responsableSeleccionado: string;

  pdfSafeUrl: SafeResourceUrl | null = null;
  private generatedBlobUrl: string | null = null;

  readonly estados: EstadoSolicitud[] = [
    'Nuevo',
    'En revisión',
    'Respondido',
    'Cerrado',
  ];

  readonly responsables = [
    'Yamile (Operaciones)',
    'Nicolás (Formación)',
    'Isamar (Talento Humano)',
    'Jaime / Kevin (Admin)',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { solicitud: Solicitud },
    private dialogRef: MatDialogRef<SolicitudDetalleDialog>,
    private solicitudesService: SolicitudesService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {
    this.solicitud = structuredClone(data.solicitud);
    this.estadoSeleccionado = this.solicitud.estado;
    this.responsableSeleccionado = this.solicitud.responsable;
  }

  ngOnInit(): void {
    if (this.solicitud.categoria === 'CV' && this.solicitud.cv) {
      if (this.solicitud.cv.pdfUrl) {
        this.pdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.solicitud.cv.pdfUrl
        );
      } else {
        this.generatedBlobUrl = this.crearPdfMockUrl(this.solicitud);
        this.pdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.generatedBlobUrl
        );
      }
    }
  }

  ngOnDestroy(): void {
    if (this.generatedBlobUrl) {
      URL.revokeObjectURL(this.generatedBlobUrl);
    }
  }

  get sla(): SlaBadgeInfo {
    return getSlaBadgeInfo({
      ...this.solicitud,
      estado: this.estadoSeleccionado,
    });
  }

  get initials(): string {
    return getInitials(this.solicitud.nombre);
  }

  get tituloModal(): string {
    if (this.solicitud.categoria === 'CV') return 'Ficha de Postulante y CV';
    if (this.solicitud.categoria === 'FORMACION') {
      return 'Bandeja de Formación · Responder Consulta';
    }
    return 'Ficha CRM · Cliente / Lead';
  }

  onEstadoChange(nuevoEstado: EstadoSolicitud): void {
    this.estadoSeleccionado = nuevoEstado;
    this.solicitud.estado = nuevoEstado;
    this.solicitudesService.updateEstado(this.solicitud.id, nuevoEstado);
    this.snackBar.open(`Estado actualizado a "${nuevoEstado}"`, 'OK', {
      duration: 2200,
    });
  }

  onResponsableChange(nuevoResponsable: string): void {
    this.responsableSeleccionado = nuevoResponsable;
    this.solicitud.responsable = nuevoResponsable;
    this.solicitudesService.updateResponsable(
      this.solicitud.id,
      nuevoResponsable
    );
    this.snackBar.open(`Asignado a ${nuevoResponsable}`, 'OK', {
      duration: 2200,
    });
  }

  enviarRespuesta(): void {
    const texto = this.respuestaTexto.trim();
    if (!texto) {
      this.snackBar.open('Escribe una respuesta antes de enviar.', 'Cerrar', {
        duration: 2200,
      });
      return;
    }

    this.solicitudesService.registrarRespuesta(
      this.solicitud.id,
      texto,
      this.solicitud.remitente
    );
    this.snackBar.open(
      `Respuesta enviada desde ${this.solicitud.remitente}`,
      'OK',
      { duration: 2800 }
    );
    this.dialogRef.close(true);
  }

  marcarAtendido(): void {
    this.onEstadoChange('Respondido');
    this.dialogRef.close(true);
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  /**
   * Genera un PDF 1.4 válido en memoria para previsualizar el CV en el visor
   * mientras no exista un archivo real servido desde el backend.
   */
  private crearPdfMockUrl(sol: Solicitud): string {
    const clean = (s: string) =>
      s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[()\\]/g, '');

    const lines = [
      `CURRICULUM VITAE - ${clean(sol.nombre)}`,
      `ID Solicitud: ${clean(sol.id)}`,
      `Correo: ${clean(sol.email)}`,
      `Telefono: ${clean(sol.telefono ?? 'No registrado')}`,
      `Archivo: ${clean(sol.cv?.archivo ?? 'CV.pdf')}`,
      `Perfil: ${clean(sol.cv?.profesion ?? '')}`,
      `Experiencia: ${clean(sol.cv?.experiencia ?? '')}`,
      `Disponibilidad: ${clean(sol.cv?.disponibilidad ?? '')}`,
    ];

    const textOps = lines
      .map(
        (line, idx) =>
          `BT /F1 ${idx === 0 ? 15 : 11} Tf 50 ${750 - idx * 24} Td (${line}) Tj ET`
      )
      .join('\n');

    const streamLength = textOps.length;
    const pdf = [
      '%PDF-1.4',
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
      `4 0 obj << /Length ${streamLength} >> stream\n${textOps}\nendstream endobj`,
      '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      'xref',
      '0 6',
      '0000000000 65535 f ',
      'trailer << /Size 6 /Root 1 0 R >>',
      'startxref',
      '0',
      '%%EOF',
    ].join('\n');

    const blob = new Blob([pdf], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }
}
