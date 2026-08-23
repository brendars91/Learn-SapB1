// masterclass-data-4.mjs — Lote 4: L5-01..08 (implementación)
export const MC_BATCH4 = {
'SYN-SK-L5-01': {
  screen: { title: { es: 'Discovery – mapa de procesos', en: 'Discovery – process map' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Cliente', 'Mittelstand AG', 'in'], ['Sede', 'Bonn', 'in'], ['Usuarios', '35', 'in']],
    cols: ['Proceso', 'Volumen', 'Dolor actual', 'Prioridad'], rows: [
      ['O2C', '1.200 facturas/mes', 'Facturas en papel, 3 días de retraso', 'Alta'],
      ['P2P', '800 pedidos/mes', 'Doble entrada con Excel', 'Alta'],
      ['Inventario', '4 recuentos/año', 'Mermas 4%', 'Media'],
      ['Finanzas', 'Cierre 10 días', 'Conciliación manual', 'Media']
    ],
    status: ['Fase 1 del método SAP: Discovery'],
    note: { es: 'Documento real de discovery: procesos, volúmenes y dolores priorizados. Sin esto, la implementación es a ciegas.', en: 'Real discovery document: processes, volumes, prioritized pains. Without it, implementation is blind.' } },
  cfg: [ { es: 'El método SAP en 5 fases: Discovery → Blueprint → Realización (config+custom) → Go-live preparación → Soporte.', en: 'The SAP method in 5 phases: Discovery → Blueprint → Realization → Go-live prep → Support.' } ],
  e2e: [
    { es: '1. Entrevistas por área (ventas, compras, almacén, finanzas): 45 min × área con guion.', en: '1. Per-area interviews (sales, purchasing, warehouse, finance): 45 min each with a script.' },
    { es: '2. Cuantificar dolores en dinero/tiempo: "3 días de retraso" = X € de coste financiero.', en: '2. Quantify pains in money/time: "3-day delay" = X € financial cost.' },
    { es: '3. Priorizar por impacto: los 2 dolores altos justifican el proyecto entero.', en: '3. Prioritize by impact: the 2 high pains justify the whole project.' }
  ],
  war: { q: { es: 'Implementación "estándar" que nadie usa tras 6 meses.', en: '"Standard" implementation nobody uses after 6 months.' },
    sympt: [{ es: 'Usuarios manteniendo hojas Excel paralelas al ERP.', en: 'Users keeping Excel spreadsheets parallel to the ERP.' }],
    root: [{ es: 'Discovery saltado: se configuró el estándar sin mapear cómo trabaja ESTA empresa.', en: 'Skipped discovery: standard configured without mapping how THIS company works.' }],
    fix: [{ es: 'Re-discovery con usuarios clave + blueprint de brechas antes de reconfigurar.', en: 'Re-discovery with key users + gap blueprint before reconfiguring.' }] },
  bp: [
    { es: 'Discovery = escuchar antes de configurar. Cada hora de discovery ahorra diez de rework.', en: 'Discovery = listen before configuring. Every discovery hour saves ten of rework.' }
  ]
},
'SYN-SK-L5-02': {
  screen: { title: { es: 'Blueprint – mapa de brechas', en: 'Blueprint – gap map' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Proyecto', 'B1 Rollout Mittelstand', 'in'], ['Versión blueprint', '1.2', 'in']],
    cols: ['Requisito', 'Solución B1 estándar', 'Brecha', 'Abordaje'], rows: [
      ['Facturación electrónica DE (XRechnung)', 'Add-on estándar', 'Ninguna', 'Estándar'],
      ['Aprobación de pedidos >10k', 'Aprobaciones estándar', 'Ninguna', 'Estándar'],
      ['Cálculo de comisiones escalonadas', 'No estándar', 'Sí', 'UDT+query o add-on']
    ],
    status: ['Fase 2: Blueprint'],
    note: { es: 'Blueprint real: requisito → solución. Cada brecha se decide: estándar, customización, add-on o cambio de proceso.', en: 'Real blueprint: requirement → solution. Each gap is decided: standard, customization, add-on or process change.' } },
  cfg: [ { es: 'El blueprint congela el alcance: cada "sí se puede" de aquí es compromiso de realización.', en: 'The blueprint freezes scope: every "yes" here is a realization commitment.' } ],
  e2e: [
    { es: '1. Workshops por proceso: demo del estándar contra el requisito real.', en: '1. Per-process workshops: standard demo against real requirement.' },
    { es: '2. Cada brecha clasificada: estándar (0 coste), custom (desarrollo), add-on (licencia), proceso (cambio humano).', en: '2. Each gap classified: standard (0 cost), custom (dev), add-on (license), process (human change).' },
    { es: '3. Firma del blueprint: el alcance queda sellado. Los cambios posteriores son change requests.', en: '3. Blueprint sign-off: scope sealed. Later changes are change requests.' }
  ],
  war: { q: { es: 'El scope crece 40% durante la realización sin presupuesto nuevo.', en: 'Scope grows 40% during realization without new budget.' },
    sympt: [{ es: 'Requisitos "pequeños" que aparecen semana a semana y se acumulan.', en: '"Small" requirements appearing week by week and accumulating.' }],
    root: [{ es: 'Blueprint sin disciplina de change request: todo entra, nada se re-prioriza.', en: 'Blueprint without change-request discipline: everything enters, nothing re-prioritizes.' }],
    fix: [{ es: 'Todo cambio post-blueprint = change request con impacto (días, coste, riesgo) y aprobación explícita.', en: 'Every post-blueprint change = change request with impact (days, cost, risk) and explicit approval.' }] },
  bp: [
    { es: 'El blueprint es un contrato, no una sugerencia. Protege al cliente Y al consultor.', en: 'The blueprint is a contract, not a suggestion. It protects the client AND the consultant.' }
  ]
},
'SYN-SK-L5-03': {
  screen: { title: { es: 'Configuración de empresa', en: 'Company Configuration' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Nombre empresa', 'Mittelstand AG', 'in'], ['Moneda local', 'EUR', 'in'], ['País', 'DE', 'in']],
    cols: ['Parámetro', 'Valor', 'Impacto'], rows: [
      ['Plan de cuentas', 'SKR03 (datev)', 'Toda la contabilidad'],
      ['Esquema de numeración', 'Por año y tipo', 'Auditoría'],
      ['Método de valoración', 'Media móvil', 'Coste de stock'],
      ['Idioma documentos', 'DE + EN', 'Comunicación']
    ],
    status: ['Administración → Configuración de empresa'],
    note: { es: 'Configuración de empresa real: las decisiones de aquí condicionan TODO lo demás. Errar aquí es errar globalmente.', en: 'Real company configuration: decisions here condition EVERYTHING else. Wrong here is wrong globally.' } },
  cfg: [
    { es: 'Administración > Configuración de empresa: moneda, país, plan de cuentas, fiscalidad.', en: 'Administration > Company configuration: currency, country, chart of accounts, tax.' },
    { es: 'El plan de cuentas (SKR03 en DE) se elige UNA vez. Cambiarlo después es re-implementar.', en: 'The chart (SKR03 in DE) is chosen ONCE. Changing later is re-implementing.' }
  ],
  e2e: [
    { es: '1. Crear BD de empresa: nombre, moneda EUR, país DE.', en: '1. Create company DB: name, EUR currency, DE country.' },
    { es: '2. Seleccionar plan SKR03 + esquema fiscal alemán (IVA 19/7/0).', en: '2. Select SKR03 chart + German tax schema (VAT 19/7/0).' },
    { es: '3. Probar con una factura end-to-end antes de continuar configurando.', en: '3. Test with one end-to-end invoice before configuring further.' }
  ],
  war: { q: { es: 'La empresa usa cuentas "genéricas" y no SKR03: el asesor fiscal no puede leer el balance.', en: 'The company uses "generic" accounts, not SKR03: the tax advisor can\'t read the balance.' },
    sympt: [{ es: 'Cierre mensual requiere reclasificar a mano cada informe fiscal.', en: 'Monthly close requires hand-reclassifying every fiscal report.' }],
    root: [{ es: 'Plan de cuentas improvisado al instalar sin consultar al Steuerberater.', en: 'Improvised chart at install without consulting the tax advisor.' }],
    fix: [{ es: 'Migración a SKR03 en el arranque del ejercicio + mapeo de cuentas antiguas.', en: 'SKR03 migration at fiscal-year start + old-account mapping.' }] },
  bp: [
    { es: 'El plan de cuentas lo dicta el asesor fiscal del cliente, no el consultor. Pregunta primero.', en: 'The chart is dictated by the client\'s tax advisor, not the consultant. Ask first.' }
  ]
},
'SYN-SK-L5-04': {
  screen: { title: { es: 'Usuarios y grupos', en: 'Users and Groups' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Usuario', 'ventas01', 'in'], ['Nombre', 'Anna K.', 'in'], ['Grupo', 'Ventas', 'in']],
    cols: ['Grupo', 'Miembros', 'Permisos base'], rows: [
      ['Ventas', '8', 'Documentos O2C'],
      ['Compras', '4', 'Documentos P2P'],
      ['Almacén', '6', 'Movimientos stock'],
      ['Finanzas', '3', 'Asientos, bancos'],
      ['Admin', '2', 'Todo + configuración']
    ],
    status: ['Administración → Configuración → Usuarios'],
    note: { es: 'Grupos reales por función: los permisos se conceden al grupo, el usuario hereda. 5 grupos cubren una Mittelstand.', en: 'Real function-based groups: permissions granted to the group, users inherit. 5 groups cover a Mittelstand.' } },
  cfg: [ { es: 'Usuarios se crean por grupo con perfil heredado. Asignar permisos usuario a usuario no escala.', en: 'Users are created per group with inherited profile. Per-user permission assignment doesn\'t scale.' } ],
  e2e: [
    { es: '1. Crea 5 grupos funcionales (Ventas, Compras, Almacén, Finanzas, Admin).', en: '1. Create 5 functional groups (Sales, Purchasing, Warehouse, Finance, Admin).' },
    { es: '2. Asigna permisos por grupo: documentos, informes, autorizaciones de importe.', en: '2. Assign permissions per group: documents, reports, amount authorizations.' },
    { es: '3. Alta de usuarios dentro de su grupo. Baja = desactivar, nunca borrar (histórico).', en: '3. Create users inside their group. Offboarding = deactivate, never delete (history).' }
  ],
  war: { q: { es: 'Empleado despedido pero su usuario sigue activo una semana después.', en: 'Employee fired but their user stays active a week later.' },
    sympt: [{ es: 'Logins del usuario tras la fecha de salida.', en: 'User logins after the leave date.' }],
    root: [{ es: 'Offboarding sin checklist IT: el ERP queda fuera del proceso de salida.', en: 'Offboarding without IT checklist: the ERP stays outside the exit process.' }],
    fix: [{ es: 'Checklist de salida con paso obligatorio "desactivar usuario B1" firmado por IT.', en: 'Exit checklist with mandatory "deactivate B1 user" step signed by IT.' }] },
  bp: [
    { es: 'Usuarios se desactivan, jamás se borran: el histórico de documentos exige al autor.', en: 'Users are deactivated, never deleted: document history demands its author.' }
  ]
},
'SYN-SK-L5-05': {
  screen: { title: { es: 'Autorizaciones avanzadas', en: 'Advanced Authorizations' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Usuario', 'compras01', 'sys'], ['Documento', 'Pedido de compra', 'sys']],
    cols: ['Autorización', 'Lectura', 'Añadir', 'Importe máx.'], rows: [
      ['Pedido de compra', 'Sí', 'Sí', '25.000 EUR'],
      ['Factura de proveedor', 'Sí', 'Sí', '25.000 EUR'],
      ['Asiento manual', 'Sí', 'No', '—'],
      ['Configuración', 'No', 'No', '—']
    ],
    status: ['Administración → Autorizaciones'],
    note: { es: 'Matriz por usuario real: lectura/añadido/importe. El "No" en configuración para perfiles operativos es hardening básico.', en: 'Real per-user matrix: read/add/amount. "No" on configuration for operational profiles is basic hardening.' } },
  cfg: [
    { es: 'Autorizaciones generales + autorizaciones de importe por documento + propiedad de datos (ver solo sus clientes).', en: 'General authorizations + amount authorizations per document + data ownership (see only their customers).' }
  ],
  e2e: [
    { es: '1. compras01: pedidos hasta 25.000 sin aprobación.', en: '1. purchases01: orders up to 25,000 without approval.' },
    { es: '2. Pedido de 31.000: dispara aprobación al jefe de compras.', en: '2. Order of 31,000: triggers approval to purchasing manager.' },
    { es: '3. Propiedad de datos: ventas01 solo ve SUS clientes en informes.', en: '3. Data ownership: sales01 sees only THEIR customers in reports.' }
  ],
  war: { q: { es: 'Un comercial ve los precios de coste y los filtra a un cliente.', en: 'A salesperson sees cost prices and leaks them to a customer.' },
    sympt: [{ es: 'Cliente negocia exigiendo el margen exacto del proveedor.', en: 'Customer negotiates demanding the supplier\'s exact margin.' }],
    root: [{ es: 'Campo de coste visible para perfil comercial sin restricción de propiedad.', en: 'Cost field visible to sales profile without ownership restriction.' }],
    fix: [{ es: 'Ocultar coste por autorización de campo + formación sobre sensibilidad del dato.', en: 'Hide cost via field authorization + data-sensitivity training.' }] },
  bp: [
    { es: 'El principio de mínimo privilegio no es burocracia: es la línea entre un error y un incidente.', en: 'Least privilege isn\'t bureaucracy: it\'s the line between an error and an incident.' }
  ]
},
'SYN-SK-L5-06': {
  screen: { title: { es: 'Numeración de documentos', en: 'Document Numbering' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Serie', '2026', 'in'], ['Tipo', 'Factura de cliente', 'sys'], ['Primer nº', '1001', 'in']],
    cols: ['Tipo documento', 'Serie 2026', 'Prefijo', 'Estado'], rows: [
      ['Factura de cliente', '1001–4.802', '2026-', 'Abierta'],
      ['Entrega', '5001–7.120', '2026-', 'Abierta'],
      ['Pedido', '2001–3.940', '2026-', 'Abierta'],
      ['Factura 2025', '1001–4.780', '2025-', 'Cerrada']
    ],
    status: ['Administración → Numeración'],
    note: { es: 'Series anuales reales: 2025 cerrada y congelada, 2026 abierta. La numeración es la columna vertebral de la auditoría.', en: 'Real annual series: 2025 closed and frozen, 2026 open. Numbering is the audit backbone.' } },
  cfg: [ { es: 'Una serie por tipo y año. Cierre anual de series para congelar el pasado.', en: 'One series per type and year. Annual series close to freeze the past.' } ],
  e2e: [
    { es: '1. Enero 2026: cierra la serie 2025 de todos los tipos, abre 2026.', en: '1. January 2026: close 2025 series for all types, open 2026.' },
    { es: '2. Cada documento nuevo toma el siguiente número de SU serie anual.', en: '2. Each new document takes the next number from ITS annual series.' },
    { es: '3. Consulta de continuidad: huecos en la serie = cancelaciones (legítimas) o errores (revisar).', en: '3. Continuity query: series gaps = cancellations (legitimate) or errors (review).' }
  ],
  war: { q: { es: 'La serie de facturas 2025 tiene 17 huecos.', en: 'The 2025 invoice series has 17 gaps.' },
    sympt: [{ es: 'Facturas faltantes en la secuencia 1001–4.780.', en: 'Missing invoices in sequence 1001–4,780.' }],
    root: [{ es: '17 cancelaciones legítimas (errores de captura) SIN documento espejo visible en el informe estándar.', en: '17 legitimate cancellations (capture errors) WITHOUT visible mirror documents in the standard report.' }],
    fix: [{ es: 'Informe de cancelaciones con motivo: cada hueco debe tener su espejo y su razón documentada.', en: 'Cancellation report with reason: each gap must have its mirror and documented reason.' }] },
  bp: [
    { es: 'Cada hueco de serie cuenta una historia: cancelación (normal) o borrado (anomalía). Clasifícalos.', en: 'Every series gap tells a story: cancellation (normal) or deletion (anomaly). Classify them.' }
  ]
},
'SYN-SK-L5-07': {
  screen: { title: { es: 'Migración de datos', en: 'DTW (Data Transfer Workbench)' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Objeto', 'Artículos', 'in'], ['Fichero', 'items.csv', 'in'], ['Registros', '4.218', 'sys']],
    cols: ['Objeto', 'Registros', 'Cargados', 'Errores'], numeric: [1, 2, 3], rows: [
      ['Socios', '1.540', '1.538', '2 (NIF dup)'],
      ['Artículos', '4.218', '4.218', '0'],
      ['Saldos apertura', '312', '310', '2 (cuenta mal)'],
      ['Stock inicial', '1.847', '1.847', '0']
    ],
    status: ['DTW: Data Transfer Workbench'],
    note: { es: 'Cuadro real de migración DTW: cada objeto con sus errores. Los 4 errores requieren decisión, no reintento ciego.', en: 'Real DTW migration board: each object with its errors. The 4 errors need a decision, not blind retry.' } },
  cfg: [
    { es: 'DTW carga por plantillas CSV por objeto: socios, artículos, saldos, stock, documentos abiertos.', en: 'DTW loads via per-object CSV templates: partners, items, balances, stock, open documents.' },
    { es: 'Orden de carga: primero maestros (socios, artículos), luego saldos y stock, al final documentos abiertos.', en: 'Load order: masters first (partners, items), then balances and stock, finally open documents.' }
  ],
  e2e: [
    { es: '1. Prepara CSVs: socios y artículos limpios (NIF únicos, códigos coherentes).', en: '1. Prepare CSVs: clean partners and items (unique tax IDs, coherent codes).' },
    { es: '2. DTW: carga maestros → valida → corrige los 2 NIF duplicados → recarga.', en: '2. DTW: load masters → validate → fix the 2 duplicate tax IDs → reload.' },
    { es: '3. Saldos de apertura con fecha de corte + stock inicial valorizado. Conciliar contra el sistema antiguo.', en: '3. Opening balances at cutoff date + valued initial stock. Reconcile against the old system.' }
  ],
  war: { q: { es: 'Tras go-live: los saldos de apertura no cuadran con el sistema antiguo.', en: 'Post go-live: opening balances don\'t match the old system.' },
    sympt: [{ es: 'Diferencia de 3.412 € en Deudores entre sistema viejo y B1.', en: '3,412 € Debtors difference between old system and B1.' }],
    root: [{ es: 'Fecha de corte inconsistente: algunas facturas entraron con fecha posterior al corte y quedaron fuera.', en: 'Inconsistent cutoff date: some invoices entered post-cutoff and left out.' }],
    fix: [{ es: 'Reconciliación línea a línea del corte + reproceso de las facturas en limbo.', en: 'Line-by-line cutoff reconciliation + reprocessing of limbo invoices.' }] },
  bp: [
    { es: 'La migración se concilia o no existe: sin cuadre contra el sistema viejo, no hay go-live.', en: 'Migration reconciles or doesn\'t exist: no match against the old system, no go-live.' }
  ]
},
'SYN-SK-L5-08': {
  screen: { title: { es: 'UAT y cutover', en: 'UAT and Cutover' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Fase', 'UAT', 'in'], ['Escenarios', '42', 'sys'], ['Aprobación', 'Pendiente', 'sys']],
    cols: ['Escenario', 'Dueño', 'Resultado', 'Estado'], rows: [
      ['O2C completo con IVA', 'Ventas', 'OK', 'Aprobado'],
      ['P2P con aprobación', 'Compras', 'OK', 'Aprobado'],
      ['Cierre mensual', 'Finanzas', '2 defectos', 'Re-test'],
      ['Devolución parcial', 'Ventas', 'OK', 'Aprobado']
    ],
    status: ['Pre-go-live: UAT con usuarios clave'],
    note: { es: 'Matriz UAT real: escenarios con dueño humano y resultado. El go-live se decide sobre esta matriz, no sobre fechas.', en: 'Real UAT matrix: scenarios with human owner and result. Go-live is decided on this matrix, not on dates.' } },
  cfg: [ { es: 'UAT: escenarios end-to-end con datos reales, ejecutados por usuarios clave (no por consultores).', en: 'UAT: end-to-end scenarios with real data, run by key users (not consultants).' } ],
  e2e: [
    { es: '1. 42 escenarios UAT cubriendo los procesos del blueprint.', en: '1. 42 UAT scenarios covering blueprint processes.' },
    { es: '2. Usuarios clave ejecutan y firman. Los defectos se corrigen y se re-testean.', en: '2. Key users execute and sign. Defects are fixed and re-tested.' },
    { es: '3. Cutover: fin de semana, migración final, smoke test, go-live el lunes.', en: '3. Cutover: weekend, final migration, smoke test, Monday go-live.' }
  ],
  war: { q: { es: 'Go-live en fecha fijada de hace 6 meses con UAT al 60%.', en: 'Go-live on a date fixed 6 months ago with UAT at 60%.' },
    sympt: [{ es: 'Presión de dirección por la fecha, escenarios críticos sin aprobar.', en: 'Management pressure on the date, critical scenarios unapproved.' }],
    root: [{ es: 'Fecha simbólica (inicio de trimestre) tratada como constraint técnica.', en: 'Symbolic date (quarter start) treated as technical constraint.' }],
    fix: [{ es: 'La fecha se mueve o el alcance se recorta. Un go-live a medias es más caro que un retraso.', en: 'The date moves or scope is cut. A half go-live is costlier than a delay.' }] },
  bp: [
    { es: 'UAT lo firman usuarios, no consultores. La firma del consultor no cuenta como aceptación.', en: 'UAT is signed by users, not consultants. The consultant\'s signature doesn\'t count as acceptance.' }
  ]
}
};
