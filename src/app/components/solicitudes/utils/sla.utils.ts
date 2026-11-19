import { SlaNivel, Solicitud } from '../../../models/solicitud';

export interface SlaBadgeInfo {
  nivel: SlaNivel;
  texto: string;
}

/**
 * Calcula el estado visual del semáforo SLA para una solicitud.
 * - Respondido / Cerrado: se detiene el contador ('atendido').
 * - <= 0h: vencido ('rojo').
 * - <= 8h: por vencer ('amarillo').
 * - > 8h: en tiempo ('verde').
 */
export function getSlaBadgeInfo(sol: Solicitud): SlaBadgeInfo {
  if (sol.estado === 'Respondido' || sol.estado === 'Cerrado') {
    return { nivel: 'atendido', texto: 'Atendido' };
  }
  if (sol.slaHorasRestantes <= 0) {
    return {
      nivel: 'rojo',
      texto: `Vencido (${Math.abs(sol.slaHorasRestantes).toFixed(1)}h)`,
    };
  }
  if (sol.slaHorasRestantes <= 8) {
    return {
      nivel: 'amarillo',
      texto: `Quedan ${sol.slaHorasRestantes.toFixed(1)}h`,
    };
  }
  return {
    nivel: 'verde',
    texto: `Quedan ${sol.slaHorasRestantes.toFixed(1)}h`,
  };
}

/**
 * Devuelve las iniciales (máx. 2 letras) de un nombre para el avatar.
 */
export function getInitials(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

/**
 * Exporta una lista de solicitudes a un archivo CSV descargable.
 */
export function exportSolicitudesToCsv(
  solicitudes: Solicitud[],
  filename = 'solicitudes_intranet.csv'
): void {
  const headers = [
    'ID',
    'Categoria',
    'Canal',
    'Solicitante',
    'Email',
    'Telefono',
    'Clasificacion',
    'Tipo',
    'Responsable',
    'Plazo_Dias',
    'SLA_Horas_Restantes',
    'Estado',
    'Fecha_Recepcion',
  ];

  const escapeCsv = (val: string | number | undefined): string => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = solicitudes.map((s) =>
    [
      s.id,
      s.categoria,
      s.canal,
      s.nombre,
      s.email,
      s.telefono ?? '',
      s.cliente,
      s.tipo,
      s.responsable,
      s.slaLimiteDias,
      s.slaHorasRestantes,
      s.estado,
      s.fechaRecepcion,
    ]
      .map(escapeCsv)
      .join(',')
  );

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
