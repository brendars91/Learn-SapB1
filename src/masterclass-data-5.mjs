// masterclass-data-5.mjs — Lote 5: L6-01..08 (web y reporting)
export const MC_BATCH5 = {
'SYN-SK-L6-01': {
  screen: { title: { es: 'Web Client – alcance', en: 'Web Client – scope' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Cliente', 'Web (browser)', 'sys'], ['Versión', '10.0', 'sys']],
    cols: ['Función', 'Web', 'Cliente grueso'], rows: [
      ['Pedidos/facturas', '✔', '✔'],
      ['Aprobaciones', '✔', '✔'],
      ['MRP', '—', '✔'],
      ['DTW migración', '—', '—'],
      ['Add-ons UI-API', '—', '✔']
    ],
    status: ['Web client: subconjunto del cliente completo'],
    note: { es: 'Alcance real del web client: cubre el 80% del día a día operacional, pero MRP y add-ons UI-API requieren el cliente grueso.', en: 'Real web client scope: covers 80% of daily operations, but MRP and UI-API add-ons need the fat client.' } },
  cfg: [ { es: 'El web client es un SUBCONJUNTO: verifica función por función antes de prometer "todo desde el browser".', en: 'The web client is a SUBSET: verify function by function before promising "everything from the browser".' } ],
  e2e: [
    { es: '1. Usuario de ventas trabaja 100% en web client: pedidos, ofertas, actividades.', en: '1. Sales user works 100% in web client: orders, quotes, activities.' },
    { es: '2. El planificador necesita cliente grueso para MRP semanal.', en: '2. The planner needs the fat client for weekly MRP.' },
    { es: '3. Decide por rol qué cliente usa cada quién. No es uno u otro: es por función.', en: '3. Decide per role which client each uses. Not either/or: per function.' }
  ],
  war: { q: { es: 'Cliente prometido "100% web" pero el MRP semanal no existe ahí.', en: 'Client promised "100% web" but weekly MRP doesn\'t exist there.' },
    sympt: [{ es: 'El planificador no puede ejecutar el run desde el browser.', en: 'The planner can\'t run MRP from the browser.' }],
    root: [{ es: 'Alcance del web client sobreestimado en la venta.', en: 'Overestimated web client scope at sale time.' }],
    fix: [{ es: 'Matriz función×cliente documentada + licencias de cliente grueso para roles que lo necesitan.', en: 'Function×client matrix documented + fat-client licenses for roles needing it.' }] },
  bp: [
    { es: 'Web para operación diaria, cliente grueso para planificación y add-ons. Matriz por rol.', en: 'Web for daily operation, fat client for planning and add-ons. Per-role matrix.' }
  ]
},
'SYN-SK-L6-02': {
  screen: { title: { es: 'Paneles y KPI', en: 'Dashboards and KPIs' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Panel', 'Dirección', 'in'], ['Refresco', 'Diario', 'in']],
    cols: ['KPI', 'Valor', 'Objetivo', 'Tendencia'], numeric: [1], rows: [
      ['Ventas mes', '412.000 €', '400.000 €', '↑'],
      ['DSO', '38 días', '35 días', '↓'],
      ['Mermas', '2,1%', '1,5%', '↑'],
      ['Pedidos pendientes', '64', '—', '→']
    ],
    status: ['Web client → Paneles'],
    note: { es: 'Panel real: 4 KPI con objetivo y tendencia. Un panel con 20 KPI no informa: decorrelaciona.', en: 'Real dashboard: 4 KPIs with target and trend. A 20-KPI dashboard doesn\'t inform: it decorrelates.' } },
  cfg: [ { es: 'Paneles por rol (dirección/ventas/compras) con 4-7 KPI máximo y objetivo visible.', en: 'Per-role dashboards (management/sales/purchasing) with 4-7 KPIs max and visible target.' } ],
  e2e: [
    { es: '1. Panel de dirección: ventas del mes vs objetivo, DSO, mermas, pendientes.', en: '1. Management dashboard: month sales vs target, DSO, shrinkage, pending.' },
    { es: '2. Cada KPI enlaza al informe de detalle (drilldown).', en: '2. Each KPI links to the detail report (drilldown).' },
    { es: '3. Revisión semanal de 15 min sobre el panel: acción por KPI fuera de objetivo.', en: '3. Weekly 15-min review on the dashboard: action per off-target KPI.' }
  ],
  war: { q: { es: 'Panel de 23 KPI que nadie mira.', en: 'A 23-KPI dashboard nobody looks at.' },
    sympt: [{ es: 'La dirección pide "un informe de verdad" para cada decisión.', en: 'Management asks for "a real report" for every decision.' }],
    root: [{ es: 'KPIs acumulados por consenso ("que estén todos") sin criterio de decisión.', en: 'KPIs accumulated by consensus ("everyone\'s in") without decision criteria.' }],
    fix: [{ es: 'Rediseño: 5 KPI con objetivo y dueño. El resto, a informes de detalle.', en: 'Redesign: 5 KPIs with target and owner. The rest to detail reports.' }] },
  bp: [
    { es: 'Un KPI sin objetivo ni dueño es decoración. Con ambos, es gestión.', en: 'A KPI without target or owner is decoration. With both, it\'s management.' }
  ]
},
'SYN-SK-L6-03': {
  screen: { title: { es: 'Generador de consultas', en: 'Query Generator' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Consulta', 'Q-ventas-grupo', 'in'], ['SQL', 'SELECT ...', 'in']],
    cols: ['Tabla', 'Alias', 'Join'], rows: [
      ['OINV (facturas)', 'I', '—'],
      ['INV1 (líneas)', 'L', 'I.DocEntry = L.DocEntry'],
      ['OITM (artículos)', 'IT', 'L.ItemCode = IT.ItemCode']
    ],
    status: ['Herramientas → Consultas → Generador'],
    note: { es: 'Query real con 3 tablas: OINV+INV1+OITM. El join por DocEntry es el patrón universal documento-línea.', en: 'Real query with 3 tables: OINV+INV1+OITM. The DocEntry join is the universal document-line pattern.' } },
  cfg: [
    { es: 'Herramientas > Consultas > Generador de consultas: SQL SELECT sobre tablas B1.', en: 'Tools > Queries > Query Generator: SQL SELECT over B1 tables.' },
    { es: 'Tablas de marketing: O + prefijo (ORDR pedidos, ODLN entregas, OINV facturas); líneas = sin O (RDR1, DLN1, INV1).', en: 'Marketing tables: O + prefix (ORDR orders, ODLN deliveries, OINV invoices); lines = no O (RDR1, DLN1, INV1).' }
  ],
  e2e: [
    { es: '1. Ventas por grupo de artículo: OINV+INV1 join OITM por ItemCode.', en: '1. Sales by item group: OINV+INV1 join OITM by ItemCode.' },
    { es: '2. Filtrar por año (YEAR(I.DocDate) = 2026) y agrupar por ItmsGrpNam.', en: '2. Filter by year (YEAR(I.DocDate) = 2026) and group by ItmsGrpNam.' },
    { es: '3. Guardar como consulta nombrada y colgarla en el menú del rol ventas.', en: '3. Save as named query and hang it in the sales role\'s menu.' }
  ],
  war: { q: { es: 'Consulta que mata el rendimiento del sistema en horas punta.', en: 'A query that kills system performance at peak hours.' },
    sympt: [{ es: 'SELECT sin WHERE sobre OINV completa (millones de filas).', en: 'SELECT without WHERE over full OINV (millions of rows).' }],
    root: [{ es: 'Consultas de usuario sin filtro de fecha ni límite, ejecutadas en producción.', en: 'User queries without date filter or limit, run in production.' }],
    fix: [{ es: 'Norma: toda query con WHERE de fecha + revisión de DBA antes de publicarla.', en: 'Standard: every query with date WHERE + DBA review before publishing.' }] },
  bp: [
    { es: 'O=cabecera, sin O=líneas, DocEntry=llave. Este patrón resuelve el 80% de los informes.', en: 'O=header, no-O=lines, DocEntry=key. This pattern solves 80% of reports.' }
  ]
},
'SYN-SK-L6-04': {
  screen: { title: { es: 'UDF/UDT/UDO', en: 'UDF/UDT/UDO' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Campo', 'U_CodigoObra', 'in'], ['Tabla', 'Datos maestros socios', 'sys']],
    cols: ['Objeto', 'Uso', 'Ejemplo'], rows: [
      ['UDF (campo)', 'Extender una ficha estándar', 'U_CodigoObra en socios'],
      ['UDT (tabla)', 'Datos propios', 'Tabla de obras con responsable'],
      ['UDO (objeto)', 'Objeto de negocio propio', 'Gestión de obras con flujo']
    ],
    status: ['Herramientas → Personalización de campos'],
    note: { es: 'La escalera real UDF→UDT→UDO: campo en ficha, tabla propia, objeto con lógica. Sube solo lo que el negocio exige.', en: 'The real UDF→UDT→UDO ladder: card field, own table, object with logic. Climb only as business demands.' } },
  cfg: [ { es: 'Herramientas > Personalización de campos: UDFs en fichas estándar. UDTs/UDOs para estructuras propias.', en: 'Tools > Customization: UDFs on standard cards. UDTs/UDOs for own structures.' } ],
  e2e: [
    { es: '1. UDF U_CodigoObra en facturas: obligatorio para constructoras.', en: '1. UDF U_CodigoObra on invoices: mandatory for construction.' },
    { es: '2. UDT de obras: código, nombre, responsable, estado.', en: '2. UDT of works: code, name, owner, status.' },
    { es: '3. UDO "Obra": convierte la UDT en objeto con formulario y flujo propios.', en: '3. UDO "Work": turns the UDT into an object with its own form and flow.' }
  ],
  war: { q: { es: '200 UDFs heredados de los que nadie sabe para qué sirven 150.', en: '200 inherited UDFs where nobody knows what 150 are for.' },
    sympt: [{ es: 'Fichas con pestañas de campos U_ desconocidos que nadie rellena.', en: 'Cards with U_ field tabs nobody fills.' }],
    root: [{ es: 'UDFs creados por exigencia puntual sin documento de propósito.', en: 'UDFs created per ad-hoc demand without purpose documentation.' }],
    fix: [{ es: 'Auditoría de UDFs: uso real (datos no nulos), propósito documentado o baja.', en: 'UDF audit: real usage (non-null data), documented purpose or retirement.' }] },
  bp: [
    { es: 'Cada UDF con dueño y propósito documentado. Sin eso, personalización = deuda.', en: 'Every UDF with owner and documented purpose. Without it, customization = debt.' }
  ]
},
'SYN-SK-L6-05': {
  screen: { title: { es: 'Alertas y aprobaciones', en: 'Alerts and Approvals' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Alerta', 'Stock bajo', 'in'], ['Frecuencia', 'Diaria 7:00', 'in']],
    cols: ['Alerta', 'Condición', 'Destinatario'], rows: [
      ['Stock bajo', 'Disponible < mínimo', 'Compras + planificador'],
      ['Factura vencida +7', 'Vencida una semana', 'Ventas + finanzas'],
      ['Pedido > 25k', 'Importe umbral', 'Dirección']
    ],
    status: ['Administración → Alertas'],
    note: { es: 'Alertas reales: condición → destinatario. La alerta que nadie procesa es ruido; cada una necesita dueño.', en: 'Real alerts: condition → recipient. An alert nobody processes is noise; each needs an owner.' } },
  cfg: [ { es: 'Administración > Alertas: por query o evento de documento, con destinatarios por usuario/grupo.', en: 'Administration > Alerts: by query or document event, with per-user/group recipients.' } ],
  e2e: [
    { es: '1. Alerta stock bajo: query disponible<mínimo, diaria a compras.', en: '1. Low-stock alert: available<min query, daily to purchasing.' },
    { es: '2. Aprobación de pedidos >25k: dispara flujo al director.', en: '2. Order approval >25k: triggers flow to the director.' },
    { es: '3. Alerta de factura vencida +7: impulso de cobranza.', en: '3. Invoice overdue +7 alert: collection nudge.' }
  ],
  war: { q: { es: 'Los usuarios borran las alertas sin leerlas.', en: 'Users delete alerts without reading them.' },
    sympt: [{ es: '42 alertas pendientes promedio por usuario.', en: '42 average pending alerts per user.' }],
    root: [{ es: 'Alertas masivas sin dueño ni acción definida: se convierten en spam interno.', en: 'Mass alerts without owner or defined action: they become internal spam.' }],
    fix: [{ es: 'Reducir a alertas con acción clara + KPI de procesamiento (cuántas se atienden).', en: 'Reduce to alerts with clear action + processing KPI (how many get attended).' }] },
  bp: [
    { es: 'Alerta sin acción definida = ruido. Cada alerta responde "¿y ahora qué hago?".', en: 'Alert without defined action = noise. Each alert answers "what do I do now?".' }
  ]
},
'SYN-SK-L6-06': {
  screen: { title: { es: 'Crystal Reports – parámetros', en: 'Crystal Reports – parameters' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Informe', 'Ventas por grupo', 'in'], ['Motor', 'Crystal', 'sys']],
    cols: ['Parámetro', 'Tipo', 'Obligatorio'], rows: [
      ['FechaDesde', 'Date', 'Sí'],
      ['FechaHasta', 'Date', 'Sí'],
      ['GrupoArticulo', 'String', 'No']
    ],
    status: ['Informes → Crystal Reports'],
    note: { es: 'Parámetros reales de informe: fechas obligatorias. Un informe sin rango de fechas no se publica en producción.', en: 'Real report parameters: mandatory dates. A report without date range doesn\'t get published to production.' } },
  cfg: [ { es: 'Crystal como motor estándar de informes en B1; los parámetros alimentan el WHERE.', en: 'Crystal as B1\'s standard report engine; parameters feed the WHERE.' } ],
  e2e: [
    { es: '1. Informe de ventas con parámetros FechaDesde/FechaHasta obligatorios.', en: '1. Sales report with mandatory FromDate/ToDate parameters.' },
    { es: '2. Publicar en B1: Informes y consultas > generador de informes.', en: '2. Publish into B1: Reports and queries > report generator.' },
    { es: '3. Colgar en menú del rol con permisos por usuario.', en: '3. Hang in role menu with per-user permissions.' }
  ],
  war: { q: { es: 'Informe Crystal que tarda 4 minutos en abrir.', en: 'A Crystal report taking 4 minutes to open.' },
    sympt: [{ es: 'Consultas sin índice sobre millones de líneas de factura.', en: 'Unindexed queries over millions of invoice lines.' }],
    root: [{ es: 'JOINs de tabla completa sin filtro de fecha en el WHERE maestro.', en: 'Full-table JOINs without date filter in the master WHERE.' }],
    fix: [{ es: 'Filtro de fecha obligatorio en el record selection + índices sobre DocDate.', en: 'Mandatory date filter in record selection + indexes on DocDate.' }] },
  bp: [
    { es: 'Todo informe con rango de fechas obligatorio. Sin excepciones en producción.', en: 'Every report with mandatory date range. No production exceptions.' }
  ]
},
'SYN-SK-L6-07': {
  screen: { title: { es: 'Joins y nulos', en: 'Joins and nulls' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Informe', 'Clientes sin compras', 'in']],
    cols: ['Patrón', 'SQL', 'Cuidado'], rows: [
      ['LEFT JOIN + IS NULL', 'C LEFT JOIN I ... WHERE I.Key IS NULL', 'Encuentra los SIN pareja'],
      ['INNER JOIN', 'C JOIN I ...', 'Excluye los SIN pareja silenciosamente'],
      ['COUNT(*) vs COUNT(x)', 'COUNT(x) ignora NULL', 'Diferencia silenciosa']
    ],
    status: ['SQL de informes'],
    note: { es: 'Los tres patrones que deciden si tu informe dice la verdad: LEFT+IS NULL encuentra ausencias, INNER las esconde.', en: 'The three patterns deciding whether your report tells the truth: LEFT+IS NULL finds absences, INNER hides them.' } },
  cfg: [ { es: 'Regla: si buscas "lo que NO tiene X", LEFT JOIN + WHERE X IS NULL. INNER JOIN mentiría por omisión.', en: 'Rule: seeking "what has NO X", LEFT JOIN + WHERE X IS NULL. INNER JOIN lies by omission.' } ],
  e2e: [
    { es: '1. Clientes sin compras 2026: OCRD LEFT JOIN OINV con YEAR filtro, WHERE OINV.DocEntry IS NULL.', en: '1. Customers without 2026 purchases: OCRD LEFT JOIN OINV with year filter, WHERE OINV.DocEntry IS NULL.' },
    { es: '2. Este informe alimenta la campaña de reactivación.', en: '2. This report feeds the reactivation campaign.' },
    { es: '3. La misma estructura sirve para artículos sin movimiento, socio sin actividad.', en: '3. The same structure serves for items without movement, partners without activity.' }
  ],
  war: { q: { es: 'El informe de "clientes activos" excluye silenciosamente a los nuevos sin compras.', en: 'The "active customers" report silently excludes new ones without purchases.' },
    sympt: [{ es: 'La suma de clientes activos + inactivos ≠ total de clientes.', en: 'Active + inactive customers ≠ total customers.' }],
    root: [{ es: 'INNER JOIN donde el negocio pedía población completa: la omisión es invisible en el resultado.', en: 'INNER JOIN where business asked for full population: omission invisible in the result.' }],
    fix: [{ es: 'LEFT JOIN + clasificación por CASE WHEN: activo/inactivo en una pasada, población completa.', en: 'LEFT JOIN + CASE WHEN classification: active/inactive in one pass, full population.' }] },
  bp: [
    { es: 'INNER JOIN excluye por diseño. Si no estás seguro, LEFT + CASE y clasifica después.', en: 'INNER JOIN excludes by design. Unsure? LEFT + CASE and classify after.' }
  ]
},
'SYN-SK-L6-08': {
  screen: { title: { es: 'Validación y exportación', en: 'Validation and Export' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Informe', 'Libro de IVA', 'in'], ['Validación', 'Cuadre con asientos', 'sys']],
    cols: ['Check', 'Regla', 'Resultado'], rows: [
      ['Suma líneas = total cabecera', 'SUM(INV1) = OINV.DocTotal', 'OK'],
      ['IVA por tipo = cuenta', 'Suma IVA19 = cuenta 1770', 'OK'],
      ['Continuidad de series', 'Sin huecos no explicados', 'OK']
    ],
    status: ['Validación pre-exportación'],
    note: { es: 'Validación real pre-export: el informe fiscal se cuadra contra asientos ANTES de salir del edificio.', en: 'Real pre-export validation: the fiscal report balances against journals BEFORE leaving the building.' } },
  cfg: [ { es: 'Export (Excel/PDF/CSV) solo tras validación: totales cuadran, series continuas, IVA por tipo.', en: 'Export (Excel/PDF/CSV) only after validation: totals balance, series continuous, VAT by type.' } ],
  e2e: [
    { es: '1. Libro de IVA trimestral: genera con rango de fechas.', en: '1. Quarterly VAT book: generate with date range.' },
    { es: '2. Validación: suma de líneas = asientos del periodo, por tipo de IVA.', en: '2. Validation: line sums = period journals, per VAT type.' },
    { es: '3. Export a CSV para el asesor fiscal (DATEV) con firma de validación.', en: '3. Export to CSV for the tax advisor (DATEV) with validation signature.' }
  ],
  war: { q: { es: 'El asesor fiscal devuelve el fichero: la suma no cuadra con el balance.', en: 'The tax advisor returns the file: the sum doesn\'t match the balance.' },
    sympt: [{ es: 'Diferencia de 47,60 € entre el libro exportado y la cuenta de IVA.', en: '47.60 € difference between the exported book and the VAT account.' }],
    root: [{ es: 'Un asiento manual directo a la cuenta de IVA fuera del flujo de documentos.', en: 'One manual journal directly to the VAT account outside the document flow.' }],
    fix: [{ es: 'Prohibir asientos manuales a cuentas fiscales + validación de cuadre en cada export.', en: 'Ban manual journals to tax accounts + balance validation on every export.' }] },
  bp: [
    { es: 'Todo informe fiscal se valida contra asientos antes de exportar. Si no cuadra, no sale.', en: 'Every fiscal report validates against journals before export. No match, no exit.' }
  ]
}
};
