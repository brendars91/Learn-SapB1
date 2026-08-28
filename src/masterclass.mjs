// masterclass.mjs — Contenido de nivel experto por skill.
// Estructura por entrada: screen (mockup B1 real), cfg (configuración exacta),
// e2e (proceso end-to-end con cifras encadenadas), war (war story producción:
// síntoma→causa raíz→resolución), bp (best practices senior).
// La evaluación sigue siendo la existente — esta capa es la MASTERCLASS de aprendizaje.

export const MASTERCLASS = {
'SYN-SK-L0-01': {
  screen: { title: { es: 'Menú principal de SAP Business One', en: 'SAP Business One Main Menu' }, menu: false, tabs: ['Módulos'], activeTab: 0,
    header: [['Usuario', 'manager', 'sys'], ['Base de datos', 'SBODEMOGE', 'sys'], ['Versión', '10.0 FP 2408', 'lock']],
    cols: ['Módulo', 'Módulos', 'Vistas recientes'], rows: [
      ['Ventas – CRM', '✔', 'Pedido de cliente (2)'],
      ['Compras – CRM', '✔', 'Factura de proveedor'],
      ['Comprobantes', '✔', 'Asiento (5)'],
      [' Socios de negocio', '✔', ''],
      ['Existencias', '✔', ''],
      ['Finanzas', '✔', ''],
      ['Recursos humanos', '✔', ''],
      ['Administración', '✔', '']
    ],
    status: ['Conectado a: SBODEMOGE', 'Usuario: manager'],
    note: { es: 'Menú de módulos real de B1 10.0: todo cuelga de aquí. Cada skill de este nivel te enseña a moverte por este árbol sin perderte.', en: 'Real B1 10.0 module menu: everything hangs from here. Each skill in this level teaches you to navigate this tree without getting lost.' } },
  cfg: [
    { es: 'El menú principal es un árbol por módulo: Ventas–CRM, Compras–CRM, Comprobantes, Socios, Existencias, Finanzas, Administración.', en: 'The main menu is a per-module tree: Sales–CRM, Purchasing–CRM, Documents, Partners, Inventory, Finance, Administration.' },
    { es: 'Arrastra cualquier pantalla a "Vistas recientes" para acceso rápido. Los drag&drop de menús son por usuario, no globales.', en: 'Drag any screen to "Recent Views" for quick access. Menu drag&drop is per-user, not global.' },
    { es: 'Ventana > Arrastrar aquí para añadir: personaliza el menú por usuario. Menú principal editable solo desde Administración.', en: 'Drag to add: customize menu per user. Main menu editable only from Administration.' }
  ],
  e2e: [
    { es: '1. Inicia sesión en B1 → menú Ventas–CRM → Pedido de cliente.', en: '1. Log into B1 → Sales–CRM menu → Sales Order.' },
    { es: '2. En el árbol, despliega Ventas–CRM → Pedido de cliente. El formulario abre en modo Añadir.', en: '2. In the tree, expand Sales–CRM → Sales Order. The form opens in Add mode.' },
    { es: '3. Navegación por caminos cortos: Ctrl+Tab entre campos, Alt+Shift+F abre búsquedas.', en: '3. Short paths: Ctrl+Tab between fields, Alt+Shift+F opens search.' }
  ],
  war: { q: { es: 'El cliente llama: "el sistema está lento".', en: 'Client calls: "the system is slow".' },
    sympt: [{ es: 'Los usuarios reportan lentitud difusa: todo va lento, nadie sabe qué.', en: 'Users report diffuse slowness: everything is slow, nobody knows what.' }],
    root: [{ es: '(1) Un día de cierre genera miles de asientos pesados; (2) license monitor + dashboards por usuario.', en: '(1) A closing day generates thousands of heavy journal entries; (2) license monitor + per-user dashboards.' }],
    fix: [{ es: 'Leer el hilo del cierre, no el sistema entero: Query de cancelación + revisar licencias activas.', en: 'Read the closing thread, not the whole system: cancellation query + review active licenses.' }] },
  bp: [
    { es: 'Aprende la ruta de menú de cada documento a frío: Ventas→Pedido, Ventas→Entrega, Ventas→Factura...', en: 'Learn each document\'s menu path cold: Sales→Order, Sales→Delivery, Sales→Invoice...' },
    { practice: true, es: 'Práctica pro: pon un hábito de 2 minutos: antes de operar, dibuja el módulo en papel y sus 3 pantallas clave.', en: 'Pro practice: build a 2-minute habit: before operating, sketch the module and its 3 key screens on paper.' }
  ]
},
'SYN-SK-L0-02': {
  screen: { title: { es: 'Socios de negocio – Datos maestros', en: 'Business Partners – Master Data' }, tabs: ['General', 'Relaciones', 'Moneda', 'Pagos'], activeTab: 0,
    header: [['Código', 'SYN-C20000', 'sys'], ['Nombre', 'SYN-Licht Demo AG', 'sys'], ['Tipo', 'Proveedor', 'sys'], ['NIF', 'SYN-DEMO-TAX', 'sys'], ['Grupo', 'Local', 'sys'], ['Saldo', '12.480,00', 'lock']],
    cols: ['Dirección', 'Calle', 'CP', 'Ciudad', 'País'], rows: [
      ['Facturación', 'SYN-Demostrasse 14', '00000', 'Demo-City', 'DE'],
      ['Entrega', 'SYN-Testweg 2', '00000', 'Demo-City', 'DE']
    ],
    status: ['Modo: Actualizar', 'Conectado a: SBODEMOGE'],
    note: { es: 'Ficha real de socio: los campos blancos/sys son del sistema, los amarillos editables. El código lo asigna B1 por serie.', en: 'Real partner card: white/sys fields are system, yellow editable. Code is assigned by B1 series.' } },
  cfg: [
    { es: 'Administración > Definir > Socios de negocio > Grupos de socios: aquí se definen los grupos (Clientes internacionales, Proveedores locales...).', en: 'Administration > Define > Business Partners > Partner groups: groups are defined here.' },
    { es: 'Ventas > Configuración de ventas: grupos de clientes, territorios, vendedores y comisiones.', en: 'Sales > Sales configuration: customer groups, territories, sales employees and commissions.' },
    { es: 'Chequeo de duplicados por NIF (federal tax ID) y no por nombre — la razón social muta, el NIF no.', en: 'Duplicate check by tax ID, not name — legal names mutate, tax IDs don\'t.' }
  ],
  cards: {
    es: [
      { k: 'Claves de la ficha', v: 'Código (B1 lo genera), Nombre, NIF, Grupo, Condiciones de pago, Lista de precios, Cuenta asociada (puente al plan)' },
      { k: 'No tocar sin pensar', v: 'El código tras crear la ficha; fusionar socios borra el historial de uno' }
    ],
    en: [
      { k: 'Card keys', v: 'Code (B1 generates it), Name, Tax ID, Group, Payment terms, Price list, Linked account (bridge to the chart)' },
      { k: 'Don\'t touch without thinking', v: 'The code after creating; merging partners deletes one side\'s history' }
    ]
  },
  e2e: [
    { es: '1. Socios de negocio > Maestro de socios > Cliente (o Proveedor): abre el formulario de alta.', en: '1. Business Partners > Master data > Customer (or Vendor): opens the create form.' },
    { es: '2. Ficha mínima viable: Nombre + NIF + Grupo + Condiciones de pago. Todo lo demás se puede completar después.', en: '2. Minimum viable card: Name + Tax ID + Group + Payment terms. Everything else can be completed later.' },
    { es: '3. Abre la pestaña Pagos: condiciones de pago, cuenta bancaria, método de pago. Esta pestaña alimenta la gestión de cobros.', en: '3. Open the Payments tab: payment terms, bank account, payment method. This tab feeds collections management.' }
  ],
  war: { q: { es: 'Auditoría encuentra dos fichas del mismo proveedor con diferente saldo.', en: 'Audit finds two cards of the same vendor with different balances.' },
    sympt: [{ es: 'P-SYN-001 y P-SYN-001-dup: 48.000 + 12.000 = 60.000 reales, invisibles al ranking de compras.', en: 'P-SYN-001 and P-SYN-001-dup: 48,000 + 12,000 = 60,000 real, invisible to the purchasing ranking.' }],
    root: [{ es: 'Alta manual por dos personas distintas sin chequeo de duplicados por NIF.', en: 'Manual creation by two different people without tax-ID duplicate check.' }],
    fix: [{ es: 'Exporta el maestro, agrupa por NIF normalizado, fusiona hacia la ficha más antigua (conserva historial).', en: 'Export the master, group by normalised tax ID, merge into the oldest card (preserves history).' }] },
  bp: [
    { es: 'Un socio = un NIF. Sin excepciones. Los duplicados rompen análisis, conciliación y ranking.', en: 'One partner = one tax ID. No exceptions. Duplicates break analysis, reconciliation, rankings.' },
    { es: 'Ficha mínima viable primero, enriquecer después. La perfección de ficha al alta mata la adopción.', en: 'Minimum viable card first, enrich later. Card perfection at creation kills adoption.' },
    { es: 'Antes de fusionar, exporta ambas fichas a Excel y verifica que ningún documento abierto quede huérfano.', en: 'Before merging, export both cards to Excel and verify no open document is orphaned.' }
  ]
},
'SYN-SK-L0-03': { screen: { title: { es: 'Artículo – Datos maestros', en: 'Item Master Data' }, tabs: ['General', 'Planificación', 'Pricing'], activeTab: 0,
    header: [['Código', 'A00001', 'sys'], ['Nombre', 'Lámpara LED 12W', 'in'], ['Grupo', 'Electrónica', 'sys'], ['Tipo', 'Artículo', 'sys'], ['Nº serie', 'S', 'lock']],
    cols: ['Almacén', 'En stock', 'Comprometido', 'Disponible'], rows: [
      ['01 Principal', '120', '30', '90'],
      ['02 Norte', '400', '50', '350']
    ],
    status: ['Modo: Actualizar', '10.0 FP 2408'],
    note: { es: 'Ficha de artículo real: la pestaña Planificación alimenta MRP (método, mrp-1, cantidad de pedido).', en: 'Real item card: the Planning tab feeds MRP (method, mrp-1, order quantity).' } },
  cfg: [
    { es: 'Administración > Definir > Artículos > Grupos de artículos: define grupo → cuentas contables y funciones (lote/serie/almacenes).', en: 'Administration > Define > Items > Item groups: group → G/L accounts and features (batch/serial/warehouse).' },
    { es: 'Administración > Definir > Artículos > Propiedades: hasta 64 propiedades booleanas por artículo para filtros y aprobaciones.', en: 'Administration > Define > Items > Properties: up to 64 boolean properties per item for filters and approvals.' },
    { es: 'Existencias > Definir > Almacenes: cada almacén es una fila en OILM por defecto; los ajustes de stock generan asientos automáticos.', en: 'Inventory > Define > Warehouses: each warehouse is a row; stock adjustments generate automatic journals.' }
  ],
  e2e: [
    { es: '1. Existencias > Maestro de artículos: formulario de alta en modo Añadir.', en: '1. Inventory > Item Master Data: create form in Add mode.' },
    { es: '2. Pestaña Planificación: Método de planificación = MRP; Cantidad de pedido mínimo = 20; múltiplos de pedido = 10.', en: 'Planning tab: Planning method = MRP; Min order qty = 20; Order multiples = 10.' },
    { es: '3. Existencias > Transacciones de inventario > Ajuste de stock: +10 unidades para alinear stock contable al físico tras recuento.', en: '3. Inventory transactions > Stock adjustment: +10 units to align ledger stock to physical after count.' }
  ],
  cardNote: { es: 'El grupo de artículos decide el comportamiento contable y funcional del artículo entero.', en: 'The item group decides the accounting and functional behaviour of the whole item.' },
  bp: [
    { es: 'Define grupos ANTES de crear artículos masivamente — el grupo hereda cuentas y funciones.', en: 'Define groups BEFORE mass-creating items — the group inherits accounts and features.' },
    { es: 'Gestión por series para trazabilidad electrónica (S), lotes para química/alimentos (L), ninguno para commodities.', en: 'Serial numbers for electronics traceability (S), batches for chemicals/food (L), none for commodities.' },
    { es: 'El método de valoración (media móvil vs FIFO) se hereda del grupo y es caro de cambiar con stock en tránsito.', en: 'Valuation method (moving average vs FIFO) inherits from the group and is expensive to change with in-transit stock.' }
  ]
}
};

import { MC_BATCH1 } from './masterclass-data-1.mjs';
import { MC_BATCH2 } from './masterclass-data-2.mjs';
import { MC_BATCH3 } from './masterclass-data-3.mjs';
import { MC_BATCH4 } from './masterclass-data-4.mjs';
import { MC_BATCH5 } from './masterclass-data-5.mjs';
import { MC_BATCH6 } from './masterclass-data-6.mjs';
Object.assign(MASTERCLASS, MC_BATCH1, MC_BATCH2, MC_BATCH3, MC_BATCH4, MC_BATCH5, MC_BATCH6);
