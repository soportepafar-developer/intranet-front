# DESIGN.md — Intranet Uvi (JPL)

Sistema de diseño unificado para todos los módulos de la intranet corporativa.

## 1. Principio visual (Modo Operate)
- **Prioridad:** legibilidad, escaneabilidad, jerarquía clara y consistencia entre módulos.
- **Superficies sobre sombras:** separar bloques mediante contraste sutil de superficie (`#F8FAFC` / `#FFFFFF` / `#F1F5F9`) y bordes de `1px solid var(--border-color)` en lugar de sombras pesadas o halos de color.
- **Sin ruido decorativo:** evitar gradientes saturados en botones, cards o navegación; usar el color primario y los semánticos con intención.

## 2. Paleta de colores

### Identidad y acentos
| Token | Valor | Uso |
|---|---|---|
| `--primary-color` | `#233876` | Acciones principales, item activo del sidebar, enlaces clave |
| `--primary-hover` | `#1A2B5C` | Estado hover/active de acciones primarias |
| `--primary-light` | `#EEF2FF` | Fondos tintados suaves, focus rings, selecciones |
| `--accent-color` | `#0F766E` | Acento secundario, etiquetas de apoyo, avatares secundarios |
| `--accent-light` | `#F0FDFA` | Fondo suave para badges/chips secundarios |

### Neutrales y superficies
| Token | Valor | Uso |
|---|---|---|
| `--bg-main` | `#F8FAFC` | Fondo general de la aplicación |
| `--bg-card` | `#FFFFFF` | Tarjetas, tablas, modales, inputs |
| `--bg-secondary` | `#F1F5F9` | Columnas Kanban, cabeceras de tabla, hover sutil |
| `--text-dark` | `#0F172A` | Títulos principales y texto de máximo énfasis |
| `--text-main` | `#334155` | Texto de cuerpo y celdas de tabla |
| `--text-muted` | `#64748B` | Subtítulos, metadatos, placeholders |
| `--text-light` | `#94A3B8` | Iconos secundarios y texto deshabilitado |
| `--border-color` | `#E2E8F0` | Bordes estándar de tarjetas, inputs y tablas |
| `--border-subtle` | `#F1F5F9` | Divisores internos suaves |
| `--border-dark` | `#CBD5E1` | Bordes en hover/focus o controles secundarios |

### Sidebar (Navegación lateral)
| Token | Valor | Uso |
|---|---|---|
| `--sidebar-bg` | `#0F172A` | Fondo principal del sidebar |
| `--sidebar-surface` | `#1E293B` | Tarjeta de usuario, hover de controles |
| `--sidebar-hover` | `rgba(255, 255, 255, 0.07)` | Hover en ítems de navegación |
| `--sidebar-active` | `#233876` | Ítem activo |
| `--sidebar-text` | `#CBD5E1` | Texto e iconos en reposo (contraste WCAG) |
| `--sidebar-text-hover` | `#FFFFFF` | Texto e iconos en hover/activo |

### Semánticos (Badges y estados)
| Estado | Texto | Fondo | Borde |
|---|---|---|---|
| **Éxito** | `#065F46` | `#ECFDF5` | `#A7F3D0` |
| **Advertencia** | `#92400E` | `#FFFBEB` | `#FDE68A` |
| **Peligro** | `#991B1B` | `#FEF2F2` | `#FECACA` |
| **Info** | `#1E40AF` | `#EFF6FF` | `#BFDBFE` |

## 3. Tipografía y escala
- **Familia principal:** `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Datos numéricos / tablas / folios:** `font-variant-numeric: tabular-nums`
- **Base:** `14px`–`15px` (`line-height: 1.5`)
- **Títulos de página:** `1.35rem`–`1.5rem`, `font-weight: 700`, `letter-spacing: -0.02em`, `color: var(--text-dark)`

## 4. Radios y espaciado
- **Inputs, botones, nav-items:** `8px` (`--radius-sm`)
- **Tarjetas, tablas, paneles:** `12px` (`--radius-md`)
- **Modales:** `16px` (`--radius-lg`)
- **Pills / avatares:** `9999px` (`--radius-full`)

## 5. Reglas de implementación
1. Prohibido hardcodear colores hexadecimales en CSS de componentes; usar siempre variables `var(--...)`.
2. Todo elemento interactivo debe tener estado `:focus-visible` claro usando `--primary-color` y `--primary-light`.
3. Todos los módulos deben respetar las reglas responsivas en `<= 768px` y `<= 480px`.
4. **Badges en listas y tablas:** limitar a máximo 1 badge semántico por fila (solo para el estado principal); usar texto plano con peso/color sutil para categorías, tipos o fechas.
