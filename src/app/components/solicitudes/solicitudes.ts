import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { CustomDropdown } from '../shared/custom-dropdown/custom-dropdown';
import { SolicitudDetalleDialog } from './solicitud-detalle-dialog/solicitud-detalle-dialog';
import { SolicitudesService } from '../../services/solicitudes/solicitudes.service';
import { Solicitud, SolicitudesKpi } from '../../models/solicitud';
import {
  exportSolicitudesToCsv,
  getInitials,
  getSlaBadgeInfo,
  SlaBadgeInfo,
} from './utils/sla.utils';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    CustomDropdown,
  ],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Solicitudes implements OnInit, OnDestroy {
  private sub?: Subscription;

  allSolicitudes: Solicitud[] = [];
  kpis: SolicitudesKpi = {
    total: 0,
    clientes: 0,
    formacion: 0,
    cv: 0,
    alertasPlazo: 0,
  };

  // Filtros
  searchTerm = '';
  clienteClasificacionFilter = '';
  canalFilter = '';
  activeTabIndex = 0;

  // Paginación por pestaña
  readonly pageSizeOptions = [10, 25, 50];
  clientesPageSize = 10;
  clientesPageIndex = 0;
  formacionPageSize = 10;
  formacionPageIndex = 0;
  cvPageSize = 10;
  cvPageIndex = 0;

  readonly clasificacionOptions = [
    { label: 'Lead / Prospecto', value: 'Lead / Prospecto' },
    { label: 'Cliente Existente', value: 'Cliente Existente' },
  ];

  readonly canalOptions = [
    { label: 'Formulario Web', value: 'Formulario Web' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'Correo Info', value: 'Correo Info' },
  ];

  constructor(
    private solicitudesService: SolicitudesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sub = this.solicitudesService.getSolicitudes$().subscribe((data) => {
      this.allSolicitudes = data;
      this.kpis = this.solicitudesService.calcularKpis(data);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get clientesFiltrados(): Solicitud[] {
    return this.filtrarPorTexto(
      this.allSolicitudes.filter((s) => s.categoria === 'CLIENTE')
    ).filter(
      (s) =>
        (!this.clienteClasificacionFilter ||
          s.cliente === this.clienteClasificacionFilter) &&
        (!this.canalFilter || s.canal === this.canalFilter)
    );
  }

  get clientesPaginados(): Solicitud[] {
    const start = this.clientesPageIndex * this.clientesPageSize;
    return this.clientesFiltrados.slice(start, start + this.clientesPageSize);
  }

  get formacionFiltrada(): Solicitud[] {
    return this.filtrarPorTexto(
      this.allSolicitudes.filter((s) => s.categoria === 'FORMACION')
    );
  }

  get formacionPaginada(): Solicitud[] {
    const start = this.formacionPageIndex * this.formacionPageSize;
    return this.formacionFiltrada.slice(start, start + this.formacionPageSize);
  }

  get cvFiltrados(): Solicitud[] {
    return this.filtrarPorTexto(
      this.allSolicitudes.filter((s) => s.categoria === 'CV')
    );
  }

  get cvPaginados(): Solicitud[] {
    const start = this.cvPageIndex * this.cvPageSize;
    return this.cvFiltrados.slice(start, start + this.cvPageSize);
  }

  onClientesPageChange(event: PageEvent): void {
    this.clientesPageIndex = event.pageIndex;
    this.clientesPageSize = event.pageSize;
  }

  onFormacionPageChange(event: PageEvent): void {
    this.formacionPageIndex = event.pageIndex;
    this.formacionPageSize = event.pageSize;
  }

  onCvPageChange(event: PageEvent): void {
    this.cvPageIndex = event.pageIndex;
    this.cvPageSize = event.pageSize;
  }

  onSearchChange(): void {
    this.clientesPageIndex = 0;
    this.formacionPageIndex = 0;
    this.cvPageIndex = 0;
  }

  private filtrarPorTexto(lista: Solicitud[]): Solicitud[] {
    const q = this.searchTerm.toLowerCase().trim();
    if (!q) return lista;
    return lista.filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.empresa?.toLowerCase().includes(q) ?? false)
    );
  }

  getSla(sol: Solicitud): SlaBadgeInfo {
    return getSlaBadgeInfo(sol);
  }

  getInitials(nombre: string): string {
    return getInitials(nombre);
  }

  exportarCsv(): void {
    const mapTab: Record<number, { data: Solicitud[]; file: string }> = {
      0: { data: this.clientesFiltrados, file: 'solicitudes_clientes.csv' },
      1: { data: this.formacionFiltrada, file: 'solicitudes_formacion.csv' },
      2: { data: this.cvFiltrados, file: 'postulaciones_cv.csv' },
    };
    const target = mapTab[this.activeTabIndex] ?? {
      data: this.allSolicitudes,
      file: 'solicitudes_intranet.csv',
    };

    if (!target.data.length) {
      this.snackBar.open('No hay registros para exportar en esta vista.', 'Cerrar', {
        duration: 2500,
      });
      return;
    }

    exportSolicitudesToCsv(target.data, target.file);
    this.snackBar.open(`Exportado ${target.file}`, 'OK', { duration: 2500 });
  }

  abrirDetalle(sol: Solicitud): void {
    this.dialog.open(SolicitudDetalleDialog, {
      width: '680px',
      maxWidth: '95vw',
      panelClass: 'solicitud-dialog-panel',
      data: { solicitud: sol },
    });
  }
}
