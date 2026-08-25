// masterclass-data-1.mjs — Lote 1: L0-04..08, L1-01..08 (13 entradas)
// Añade al objeto MASTERCLASS. Formato idéntico a masterclass.mjs.
export const MC_BATCH1 = {
'SYN-SK-L0-04': {
  screen: { title: { es: 'Pedido de cliente – Documento', en: 'Sales Order – Document' }, tabs: ['Contenido', 'Logística', 'Contabilidad'], activeTab: 0,
    header: [['Nº doc.', '162', 'sys'], ['Cliente', 'C20000', 'sys'], ['Fecha contab.', '23.08.26', 'in'], ['Estado', 'Abierto', 'sys']],
    cols: ['Nº', 'Cód. artículo', 'Descripción', 'Cant.', 'Precio', 'Total'], numeric: [3, 4, 5], rows: [
      ['1', 'A00001', 'Lámpara LED 12W', '10', '60,00', '600,00'],
      ['2', 'A00002', 'Sensor PIR', '5', '24,00', '120,00']
    ],
    totals: [['Total antes de dto.', '720,00'], ['Dto. %', '0,00'], ['Total documento', '720,00']],
    status: ['Usuario: manager', 'Modo: OK'],
    note: { es: 'Pedido real en modo OK: la numeración es automática, la fecha contable editable (amarillo). El estado "Abierto" mantiene cantidades abiertas.', en: 'Real order in OK mode: numbering is automatic, posting date editable (yellow). "Open" status keeps open quantities.' } },
  cfg: [
    { es: 'Cada documento destino se crea desde su origen con "Crear factura ⟶ Cliente" o el botón de la barra de "drilldown": hereda socio, líneas y precios.', en: 'Each target document is created from its source via "Create invoice": inherits partner, lines and prices.' },
    { es: 'El pedido reserva stock (committed) sin mover el físico ni contabilizar nada.', en: 'The order reserves stock (committed) without moving physical or posting anything.' }
  ],
  e2e: [
    { es: '1. Ventas > Pedido de cliente: alta con 10× Lámpara LED a 60,00 = 600,00 + 5× Sensor PIR a 24,00 = 120,00. Total 720,00.', en: '1. Sales > Sales Order: create with 10× LED lamp @ 60.00 = 600.00 + 5× PIR sensor @ 24.00 = 120.00. Total 720.00.' },
    { es: '2. Botón "Crear entrega": hereda las líneas. Cantidad entregada reduce la cantidad abierta del pedido.', en: '2. "Create delivery" button: lines inherited. Delivered quantity reduces the order\'s open quantity.' },
    { es: '3. Desde la entrega, "Crear factura": el asiento contable nace AQUÍ (D Cliente / H Ventas + IVA).', en: '3. From delivery, "Create invoice": the journal entry is born HERE (D Customer / H Sales + VAT).' },
    { es: '4. La factura genera la obligación de cobro con fecha de vencimiento según condiciones de pago.', en: '4. The invoice generates the collection obligation with due date per payment terms.' }
  ],
  war: { q: { es: 'Contabilidad reporta: facturas sin entrega previa.', en: 'Accounting reports: invoices without prior delivery.' },
    sympt: [{ es: 'Detectado en cierre: facturas con cantidad entregada = 0 pero contabilizadas.', en: 'Detected at close: invoices with delivered qty = 0 but posted.' }],
    root: [{ es: 'Usuarios creando facturas directas desde cero (no desde entrega): se salta la cadena documental y la trazabilidad.', en: 'Users creating direct invoices from scratch (not from delivery): skips the document chain and traceability.' }],
    fix: [{ es: 'Autorización que bloquee factura directa salvo perfil supervisor + formación de 20 min al equipo.', en: 'Authorization blocking direct invoices except supervisor profile + 20-min team training.' }] },
  bp: [
    { es: 'La cadena es la prueba: pedido → entrega → factura → cobro. Cada eslabón hereda y enlaza.', en: 'The chain is the proof: order → delivery → invoice → payment. Each link inherits and links.' },
    { es: 'Cantidad abierta es la verdad del eslabón: no la cantidad original.', en: 'Open quantity is the link\'s truth: not the original quantity.' }
  ]
},
'SYN-SK-L0-05': {
  screen: { title: { es: 'Definir numeración de documentos', en: 'Define Document Numbering' }, menu: false, tabs: ['Series'], activeTab: 0,
    header: [['Serie', 'S-2026-01', 'sys'], ['Descripción', 'Facturas de venta 2026', 'in'], ['Periodo', '01.01.26–31.12.26', 'in']],
    cols: ['Objeto', 'Nombre', 'Primer nº', 'Sufijo'], numeric: [2], rows: [
      ['13', 'Factura de cliente', '1001', '2026'],
      ['15', 'Entrega', '5001', '2026'],
      ['17', 'Pedido de cliente', '2001', '2026']
    ],
    status: ['Administración > Definir > Numeración de documentos'],
    note: { es: 'Series por año y tipo: la auditoría puede reconstruir cualquier documento por su prefijo+número sin ambigüedad.', en: 'Series per year and type: audit can reconstruct any document by prefix+number without ambiguity.' } },
  cfg: [
    { es: 'Administración > Definir > Numeración de documentos > Inicializar series: una serie por tipo y año.', en: 'Administration > Define > Document numbering: one series per type and year.' },
    { cerrar: true, es: 'Al final de año, "Cerrar serie" congela la numeración del año cerrado y abre la nueva.', en: 'At year end, "Close series" freezes the closed year\'s numbering and opens the new one.' }
  ],
  e2e: [
    { es: '1. Define serie 2026 para factura de cliente: primer nº 1001, sufijo 2026 → documentos 1001..N-2026.', en: '1. Define 2026 series for customer invoice: first no. 1001, suffix 2026 → documents 1001..N-2026.' },
    { es: '2. Documento con prefijo 1001-2026: cualquier auditoría ubica año y tipo al verlo.', en: '2. A document with prefix 1001-2026: any audit locates year and type at sight.' },
    { es: '3. Cierre anual: cierra la serie 2025 y abre 2026 antes del primer documento del año.', en: '3. Year close: close the 2025 series and open 2026 before the year\'s first document.' }
  ],
  war: { q: { es: 'El asesor fiscal pide reconstruir la facturación de un mes concreto de 2024.', en: 'The tax advisor asks to reconstruct one month\'s 2024 invoicing.' },
    sympt: [{ es: 'Sin series por año, la única forma es filtrar por fechas en tablas de marketing documents — lento y error-prone.', en: 'Without per-year series, the only way is filtering by date in marketing document tables — slow and error-prone.' }],
    root: [{ es: 'Numeración continua desde 2019: prefijos sin año, auditoría no puede segmentar.', en: 'Continuous numbering since 2019: prefixes without year, audit cannot segment.' }],
    fix: [{ es: 'Introducir series anuales desde el ejercicio siguiente + informe Query de continuidad de series para detectar huecos.', en: 'Introduce annual series from next fiscal year + series-continuity query report to detect gaps.' }] },
  bp: [
    { es: 'Una serie por tipo de documento y año. Es lo primero que un auditor revisa.', en: 'One series per document type and year. It\'s the first thing an auditor reviews.' },
    { es: 'Cerrado deja visible con cantidad abierta 0; cancelado anula con documento espejo.', en: 'Closed keeps visible with open qty 0; cancelled voids with mirror document.' }
  ]
},
'SYN-SK-L0-06': {
  screen: { title: { es: 'Factura de cliente (ventana)', en: 'A/R Invoice (window)' }, tabs: ['Contenido', 'Logística', 'Contabilidad'], activeTab: 2,
    header: [['Nº doc.', '1001-2026', 'sys'], ['Cliente', 'C20000', 'sys'], ['Fecha contable', '23.08.26', 'in'], ['Moneda', 'EUR', 'sys']],
    cols: ['Cuenta', 'D/C', 'Débito', 'Crédito'], numeric: [2, 3], rows: [
      ['C20000 (Deudores)', 'D', '871,20', ''],
      ['400000 Ventas', '', '', '720,00'],
      ['477000 IVA repercutido 21%', '', '', '151,20']
    ],
    totals: [['Total asiento', '871,20']],
    status: ['Asiento generado automáticamente'],
    note: { es: 'Pestaña Contabilidad de la factura: el asiento que B1 genera automáticamente al añadir. D Cliente / H Ventas + IVA.', en: 'Invoice\'s Accounting tab: the journal B1 auto-generates on add. D Customer / H Sales + VAT.' } },
  cfg: [
    { es: 'Fecha de documento ≠ fecha contable ≠ fecha de entrega ≠ fecha de vencimiento: cuatro fechas, cuatro dueños distintos.', en: 'Document date ≠ posting date ≠ delivery date ≠ due date: four dates, four distinct owners.' },
    { es: 'Fecha de documento = comercial (cuándo se emite); fecha contable = contable (a qué periodo pertenece).', en: 'Document date = commercial (when issued); posting date = fiscal period ownership.' },
    { es: 'Fecha de vencimiento = condiciones de pago aplicadas a la fecha contable/base de la factura.', en: 'Due date = payment terms applied to the posting/invoice base date.' }
  ],
  factCard: {
    es: [ ['Fecha documento', 'Comercial: cuándo se emite. Informativa, no contable.'], ['Fecha contable', 'Contable: define periodo fiscal. La mueve quien cierra el ejercicio.'], ['Fecha entrega', 'Logística: cuándo salió la mercancía.'], ['Fecha vencimiento', 'Financiera: cuándo se espera el cobro. La mueve la condición de pago.'] ],
    en: [ ['Document date', 'Commercial: when issued. Informative, not accounting.'], ['Posting date', 'Accounting: defines fiscal period. Moved by whoever closes the year.'], ['Delivery date', 'Logistics: when goods left.'], ['Due date', 'Financial: when payment is expected. Set by payment terms.'] ]
  },
  e2e: [
    { es: '1. Factura del 28.08 con fecha contable 30.08: el ingreso pertenece al periodo de agosto aunque el documento diga 7.8.', en: '1. Invoice issued 28.08 with posting date 30.08: revenue belongs to August\'s period even though the document says 7.8.' },
    { es: '2. Aging report construido sobre fecha de vencimiento: moverla mueve la cobranza entre buckets.', en: '2. Aging report builds on due date: moving it moves collections between buckets.' },
    { asiento: true, es: '3. Asiento: D Cliente 871,20 / H Ventas 720,00 + H IVA repercutido 151,20. Cuadra al céntimo.', en: '3. Journal: D Customer 871.20 / H Sales 720.00 + H output VAT 151.20. Balances to the cent.' }
  ],
  war: { q: { es: 'Cierre de julio: un supervisor mueve la fecha contable de 20 facturas de agosto a julio para "cerrar objetivos".', en: 'July close: a supervisor moves 20 August invoices\' posting dates to July to "hit targets".' },
    sympt: [{ es: 'Julio sobre-cumple, agosto llega con ingresos que no cuadran con entregas.', en: 'July over-performs, August arrives with revenue not matching deliveries.' }],
    root: [{ es: 'Autorización para modificar la fecha contable concedida a demasiados perfiles, unida a presión por objetivos.', en: 'Posting-date authorization open to too many profiles + target pressure.' }],
    fix: [{ es: 'Periodo contable de julio bloqueado (status locking) tras el cierre + auditoría de cambios de fecha contable (change log).', en: 'July fiscal period locked after close + posting-date change audit (change log).' }] },
  bp: [
    { es: 'Nunca usar la fecha de entrega como fecha contable para "adelantar" ingresos.', en: 'Never use the delivery date as posting date to "accelerate" revenue.' },
    { es: 'Periodos cerrados solo se reabren con aprobación documentada.', en: 'Closed periods reopen only with documented approval.' }
  ]
},
'SYN-SK-L0-07': {
  screen: { title: { es: 'Flujo de documentos', en: 'Document Flow' }, menu: false, tabs: [], activeTab: 0,
    header: [['Documento base', 'Pedido 162', 'sys'], ['Estado', 'Entregado parcialmente', 'sys']],
    cols: ['Documento', 'Fecha', 'Cantidad', 'Estado'], numeric: [2], rows: [
      ['Pedido 162', '20.08.26', '10', 'Abierto'],
      ['Entrega 5001', '21.08.26', '6', 'Cerrado'],
      ['Factura 1001-2026', '23.08.26', '6', 'Abierto']
    ],
    status: ['Botón "Flujo de documentos" en cualquier documento'],
    note: { es: 'Pantalla de flujo real de B1: desde cualquier documento, el botón recorre toda su cadena madre-hijas.', en: 'Real B1 document flow screen: from any document, the button walks its whole mother-daughters chain.' } },
  cfg: [
    { es: 'El flujo de documentos (drilldown) conecta origen y destino: la cadena es la trazabilidad.', en: 'The document flow (drilldown) connects source and target: the chain is traceability.' },
    { es: 'Orphan documents (sin madre) son candidatos a revisión de proceso.', en: 'Orphan documents (no mother) are process-review candidates.' }
  ],
  e2e: [
    { es: '1. Abre Factura 1001-2026 → botón Flujo: ve Pedido 162 → Entrega 5001 → Factura.', en: '1. Open Invoice 1001-2026 → Flow button: see Order 162 → Delivery 5001 → Invoice.' },
    { es: '2. Cantidades abiertas: pedido 10, entregado 6, quedan 4 pendientes.', en: '2. Open quantities: order 10, delivered 6, 4 remain pending.' },
    { es: '3. La factura parcial (6) deja el pedido en estado "Abierto" hasta entregar las 4 restantes.', en: '3. The partial invoice (6) keeps the order "Open" until the remaining 4 are delivered.' }
  ],
  war: { q: { es: 'Soporte pregunta: ¿a qué pedido está vinculada la factura 1001-2026?', en: 'Support asks: which order does invoice 1001-2026 go with?' },
    sympt: [{ es: 'Sin botón de flujo, buscar a mano en tablas ORDR/ODLN/OINV por DocEntry enlazado.', en: 'Without the flow button, manually search ORDR/ODLN/OINV by linked DocEntry.' }],
    root: [{ es: 'Desconocimiento del drilldown: la función existe en TODOS los documentos de marketing.', en: 'Drilldown unawareness: the feature exists on ALL marketing documents.' }],
    fix: [{ es: 'Formación: el flujo de documentos es un clic. La cadena completa, en pantalla.', en: 'Training: document flow is one click. The full chain, on screen.' }] },
  bp: [
    { es: 'Antes de operar sobre un documento, abre su flujo completo: qué viene de dónde y a qué ha dado lugar.', en: 'Before operating on a document, open its full flow: what comes from where and what it led to.' },
    { es: 'La cantidad abierta es la verdad del eslabón: no la cantidad original.', en: 'Open quantity is the link\'s truth: not the original quantity.' }
  ]
},
'SYN-SK-L0-08': {
  screen: { title: { es: 'Asiento manual', en: 'Manual Journal Entry' }, tabs: ['Contenido'], activeTab:  0,
    header: [['Nº asiento', '842', 'sys'], ['Fecha contable', '23.08.26', 'in'], ['Referencia', 'Regularización agosto', 'in']],
    cols: ['Nº línea', 'Cuenta', 'Débito', 'Crédito'], numeric: [2, 3], rows: [
      ['1', '400000 Ventas', '', '5.000,00'],
      ['2', '572000 Bancos', '5.000, SK', '']
    ],
    totals: [['Total asiento', '5.000,00']],
    status: ['Modo: OK'],
    note: { es: 'Asiento con error de dedo: "5.000, SK" — una entrada no numérica imposible de validar.', en: 'Journal with typo: "5.000, SK" — a non-numeric entry impossible to validate.' } },
  cfg: [
    { es: 'Finanzas > Asiento: única vía para asientos manuales. Todo lo demás son asientos automáticos generados por documentos.', en: 'Finance > Journal Entry: the only path for manual journals. Everything else is auto-posted by documents.' },
    { es: 'Asientos automáticos de documentos NO se corrigen con asiento manual: se corrigen en el documento (o cancelando).', en: 'Auto-posted document journals are NOT fixed with a manual entry: fix the document (or cancel it).' }
  ],
  e2e: [
    { es: '1. Para averiguar si un asiento es manual o automático: campo "Trans Type" + "Base Ref" — si tiene documento origen, es automático.', en: '1. To tell manual from auto: "Trans Type" + "Base Ref" fields — if it has a source document, it\'s auto.' },
    { es: '2. Asientos manuales llevan Recurring = No, Origin = manual. Los automáticos Origin = document type.', en: '2. Manual journals have Recurring = No, Origin = manual. Auto ones Origin = document type.' },
    { asiento: true, es: '3. El asiento espejo de cancelación invierte CADA línea con importe negativo.', en: '3. The cancellation mirror entry inverts EACH line with negative amount.' }
  ],
  asientoCard: {
    es: [ ['Trans Type', 'Tipo de transacción (13=Factura, 30=Asiento...). Siempre visible en la cabecera.'], ['Base Ref', 'DocEntry del documento origen. Vacío = manual.'], ['Origen', 'Manual vs documento: la pregunta correcta antes de corregir.'] ],
    en: [ ['Trans Type', 'Transaction type (13=Invoice, 30=Journal...). Always visible in the header.'], ['Base Ref', 'DocEntry of the source document. Empty = manual.'], ['Origin', 'Manual vs document: the right question before fixing.'] ]
  },
  asientoNote: { es: 'Antes de corregir un asiento: ¿es manual o automático? Manual → asiento de corrección; automático → corregir el documento.', en: 'Before fixing a journal: manual or auto? Manual → correction entry; auto → fix the document.' },
  war: { q: { asiento: true, es: 'El asiento 842 no cuadra y no pasa validación.', en: 'Journal 842 doesn\'t balance and fails validation.' },
    sympt: [{ es: 'Total débito 5.000,00 vs crédito 5.000, SK — el sistema rechaza el añadido.', en: 'Total debit 5,000.00 vs credit 5,000, SK — the system rejects the add.' }],
    root: [{ es: 'Dedo resbalado en el importe: el usuario tecleó una coma donde iba un punto (formato alemán vs español).', en: 'Finger slip on the amount: user typed a comma where a point belongs (German vs Spanish format).' }],
    fix: [{ es: 'B1 valida y rechaza: no acepta asiento descuadrado. La cuadre es una invariant del sistema.', en: 'B1 validates and rejects: no unbalanced journal accepted. Balance is a system invariant.' }] },
  bp: [
    { es: 'Asiento descuadrado no existe en B1: si cuadra, fue validado por el sistema.', en: 'An unbalanced journal doesn\'t stock in B1: if it saved, the system validated it.' },
    { es: 'Antes de corregir: Trans Type + Base Ref te dicen de dónde viene el asiento.', en: 'Before fixing: Trans Type + Base Ref tell you where the journal came from.' }
  ]
},
'SYN-SK-L1-01': {
  screen: { title: { es: 'Socios de negocio – Alta', en: 'Business Partner – Create' }, tabs: ['General', 'Relaciones', 'Moneda', 'Pagos'], activeTab: 3,
    header: [['Código', '(auto)', 'lock'], ['Nombre', '', 'in'], ['Tipo', 'Cliente', 'in'], ['NIF', '', 'in']],
    cols: ['Campo', 'Valor', 'Tipo'], rows: [
      ['Condiciones de pago', '2% 10 Neto 30', 'in'],
      ['Lista de precios', 'Lista 1 (Base)', 'in'],
      ['Cuenta de mayor asociada', '(del grupo)', 'sys'],
      ['Banco IBAN', 'DE89 3704...', 'in']
    ],
    status: ['Modo: Añadir'],
    note: { es: 'Alta de socio en modo Añadir: código auto-asignado por serie, campos amarillos editables.', en: 'Partner create in Add mode: code auto-assigned by series, yellow fields editable.' } },
  cfg: [
    { es: 'Administración > Definir > Socios de negocio > Grupos: cada grupo define cuentas asociadas por defecto y comportamiento de cobro/pago.', en: 'Administration > Define > Business Partners > Groups: each group defines default linked accounts and collection/payment behaviour.' },
    { es: 'Condiciones de pago: Administración > Definir > Socios de negocio > Condiciones de pago. "2% 10 Neto 30" = 2% dto. si paga en 10 días, total a 30.', en: 'Payment terms: 2% 10 Net 30 = 2% discount if paid within 10 days, full at 30.' }
  ],
  e2e: [
    { es: '1. Alta de cliente: Nombre + NIF + Grupo + Condiciones de pago. La cuenta asociada la aporta el grupo.', en: '1. Customer create: Name + Tax ID + Group + Payment terms. The linked account comes from the group.' },
    { es: '2. Pestaña Pagos: IBAN + método de pago para domiciliación SEPA.', en: '2. Payments tab: IBAN + payment method for SEPA direct debit.' },
    {eterm: true, es: '3. Facturación: la factura hereda condiciones del socio → fecha de vencimiento automática.', en: '3. Invoicing: the invoice inherits the partner\'s terms → automatic due date.' }
  ],
  war: { q: { es: 'Un cliente nuevo facturado sin condiciones de pago.', en: 'A new customer invoiced without payment terms.' },
    sympt: [{ es: 'Facturas con vencimiento inmediato, aging distorsionado, cobros caóticos.', en: 'Invoices with immediate due, distorted aging, chaotic collections.' }],
    root: [{ es: 'Campo de condiciones vacío al alta (permitido por el sistema) + checklist de alta incompleto.', en: 'Empty terms field at create (allowed by the system) + incomplete create checklist.' }],

    fix: [{ es: 'Resolución: obligar el campo por validación (TransactionNotification) + regularización de facturas existentes.', en: 'Fix: make the field mandatory via transaction validation + regularize existing invoices.' }] },
  bp: [
    { es: 'Un socio = un NIF. Los duplicados rompen análisis y conciliación.', en: 'One partner = one tax ID. Duplicates break analysis and reconciliation.' },
    { es: 'Condiciones de pago obligatorias al alta: sin ellas, el aging se distorsiona desde el día uno.', en: 'Payment terms mandatory at create: without them, aging distorts from day one.' }
  ]
},
'SYN-SK-L1-02': {
  screen: { title: { es: 'Artículos – Alta (Planificación)', en: 'Items – Create (Planning)' }, tabs: ['General', 'Planificación', 'Pricing'], activeTab: 1,
    header: [['Código', '(auto)', 'lock'], ['Nombre', 'Lámpara LED 12W', 'in'], ['Grupo', 'Electrónica', 'in']],
    cols: ['Campo', 'Valor', 'Tipo'], rows: [
      ['Método de planificación', 'Método MRP', 'in'],
      ['Cant. pedido mínima', '20', 'in'],
      ['Múltiplos de pedido', '10',   'in'],
      ['Plazo de entrega (días)', '14', 'in']
    ],
    parNote: { es: 'Plazo 14 días + demanda semanal 35 → punto de pedido = 70. MRP propone pedidos cuando el disponible cae por debajo.', en: 'Lead time 14 days + weekly demand 35 → reorder point = 70. MRP proposes orders when available drops below.' },
    status: ['Modo: Añadir'],
    note: { es: 'Pestaña Planificación real: alimenta MRP (método, mínimos, múltiplos, plazos).', en: 'Real Planning tab: feeds MRP (method, minimums, multiples, lead times).' } },
  cfg: [
    { es: 'Administración > Definir > Artículos > Grupos: grupo → cuentas contables + funciones (lote/serie/almacén).', en: 'Administration > Define > Items > Groups: group → G/L accounts + features.' },
    { es: 'Método de planificación = MRP en la pestaña Planificación activa al artículo en el run de MRP.', en: 'Planning method = MRP on the Planning tab enrolls the item in the MRP run.' }
  ],
  e2e: [
    { es: '1. Alta con Planificación: MRP, mínimo 20, múltiplos 10, plazo 14 días.', en: '1. Create with Planning: MRP, min 20, multiples 10, lead 14 days.' },
    { es: '2. MRP run: Módulo MRP > MRP (o Compras > MRP): propone pedido cuando Disponible < punto de pedido.', en: '2. MRP run: proposes an order when Available < reorder point.' },
    { es: '3. Pedido generado → recibe → stock físico sube y committed baja.', en: '3. Order generated → received → physical stock rises and committed falls.' }
  ],
  war: { q: { es: 'MRP propone pedidos absurdos: 1 unidad de un componente.', en: 'MRP proposes absurd orders: 1 unit of a component.' },
    sympt: [{ es: 'Pedidos de compra con cantidades fragmentadas (1, 3, 2 unidades) del mismo artículo el mismo día.', en: 'Purchase orders with fragmented quantities (1, 3, 2 units) of the same item the same day.' }],
    root: [{ es: 'Cant. pedido mínima y múltiplos sin configurar: MRP cubre la demanda exacta, sin redondeos comerciales.', en: 'Min order qty and multiples unconfigured: MRP covers exact demand, no commercial rounding.' }],
    fix: [{ es: 'Configurar mínimos y múltiplos por artículo (o por grupo si son estándar del proveedor) y re-ejecutar MRP.', en: 'Configure minimums and multiples per item (or group-wide if supplier standard) and re-run MRP.' }] },
  bp: [
    { es: 'Plazo de entrega real del proveedor, no el comercial: MRP planifica con el que pongas.', en: 'Real supplier lead time, not the commercial one: MRP plans with what you enter.' },
    { es: 'Múltiplos de pedido = tamaño de caja o palé del proveedor.', en: 'Order multiples = supplier box or pallet size.' }
  ]
},
'SYN-SK-L1-03': {
  screen: { title: {  es: 'Definir almacenes', en: 'Define Warehouses' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Código', '01', 'sys'], ['Descripción', 'Principal', 'in'], ['Tipo', 'Activo', 'in']],
    cols: ['Código', 'Descripción', 'Substock', 'Cuenta asociada'], rows: [
      ['01', 'Principal', '—', '140000 Stock'],
      ['02', 'Norte', '—', '140000 Stock'],
      ['03', 'Consigna cliente', '—', '140050 Stock en consigna']
    ],
    status: ['Existencias > Definir > Almacén'],
    note: { es: 'Definición de almacenes real: cada uno es una dimensión de stock independiente con su cuenta (si el plan lo separa).', en: 'Real warehouse definition: each is an independent stock dimension with its account (if the chart splits it).' } },
  cfg: [ { es: 'Existencias > Definir > Almacén: código 2 caracteres + descripción + substock + cuenta asociada opcional.', en: 'Inventory > Define > Warehouse: 2-char code + description + substock + optional linked account.' } ],
  e2e: [
    { es: '1. Define almacenes 01 Principal, 02 Norte, 03 Consigna cliente.', en: '1. Define warehouses 01 Main, 02 North, 03 Customer consignment.' },
    { traspaso: true, es: '2. Traspaso de stock 01→02: mueve el físico sin asiento contable (si comparten cuenta).', en: '2. Stock transfer 01→02: moves physical without journal (if same account).' },
    { es: '3. Informe de stock por almacén: la foto del físico por dimensión.', en: '3. Stock report per warehouse: the physical photo per dimension.' }
  ],
  war: { q: { es: 'El stock total cuadra pero "no hay disponibilidad" en 01.', en: 'Total stock balances but "no availability" in 01.' },
    sympt: [{ es: 'Disponible = En stock − Comprometido. Comprometido en 01 dispara sin entregas visibles.', en: 'Available = In stock − Committed. Committed in 01 spikes without visible deliveries.' }],
    root: [{ es: 'Pedidos reservando 01 mientras el físico está en 02: almacén de reserva mal configurado en las líneas de pedido.', en: 'Orders reserving 01 while physical sits in 02: wrong reserve warehouse on order lines.' }],
    fix: [{ es: 'Corregir el almacén de reserva en pedidos abiertos + formation sobre selección de almacén en líneas.', en: 'Fix reserve warehouse on open orders + training on line-level warehouse selection.' }] },
  bp: [
    { es: 'Disponible = En stock − Comprometido. Siempre. Es la única cifra que importa para prometer fechas.', en: 'Available = In stock − Committed. Always. The only figure that matters for promising dates.' },
    { es: 'Stock en consigna en almacén separado: legalmente tuyo pero físicamente en cliente.', en: 'Consignment stock in a separate warehouse: legally yours, physically at the customer.' }
  ]
},
'SYN-SK-L1-04': {
  screen: { title: { es: 'Unidades de medida', en: 'Units of Measure' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['UdM', 'Stk', 'sys'], ['Descripción', 'Stück (pieza)', 'in'], ['Tipo', 'Unidad simple', 'sys']],
    cols: ['UdM grupo', 'UdM alternativa', 'Factor'], numeric: [2], rows: [
      ['Stk', 'Karton', '10'],
      ['Stk', 'Palette', '480']
    ],
    status: ['Administración > Definir > Artículos > Unidades de medida'],
    note: { es: 'Grupos UdM reales: 1 Karton = 10 Stk, 1 Palette = 480 Stk. Las líneas de documento pueden hablar Karton mientras el stock interno habla Stk.', en: 'Real UoM groups: 1 Carton = 10 pcs, 1 Pallet = 480 pcs. Document lines can speak Carton while internal stock speaks pcs.' } },
  cfg: [ { es: 'Administración > Definir > Artículos > Grupos de UdM: define conversiones (1 Karton = 10 Stk).', en: 'Administration > Define > Items > UoM groups: conversions (1 Carton = 10 pcs).' } ],
  e2e: [
    { es: '1. Crea grupo UdM "LED": Stk base, Karton = 10, Palette = 480.', en: '1. Create UoM group "LED": pcs base, Carton = 10, Palette = 480.' },
    { es: '2. Pedido en Karton: 6 Karton × 10 = 60 Stk comprometidos internamente.', en: '2. Order in Cartons: 6 Cartons × 10 = 60 pcs committed internally.' },
    { es: '3. Factura imprime Karton; asiento y stock en Stk (unidad base del inventario).', en: '3. Invoice prints Cartons; journal and stock in pcs (inventory base unit).' }
  ],
  war: { q: { es: 'Facturas correctas en importe pero stock descuadrado tras comprar en Palette.', en: 'Invoices correct in amount but stock off after purchasing in Pallets.' },
    sympt: [{ es: 'Stock en Stk no cuadra con albaranes: diferencias exactas de 470-479 unidades.', en: 'Stock in pcs doesn\'t match delivery notes: exact 470-479 unit differences.' }],
    root: [{ es: 'Grupo UdM del artículo mal asignado: Palette configurada como 10 (heredando Karton) en vez de 480.', en: 'Item\'s UoM group wrong: Pallet set to 10 (inheriting Carton) instead of 480.' }],
    fix: [{ es: 'Corregir el grupo UdM y regularizar stock con ajuste documentado.', en: 'Fix the UoM group and regularize stock with a documented adjustment.' }] },
  bp: [
    { es: 'La unidad base del inventario es una sola: las demás son traducciones comerciales.', en: 'The inventory base unit is one: the rest are commercial translations.' },
    { es: 'Verifica el grupo UdM al alta del artículo: es caro de descubrir tarde.', en: 'Verify UoM group at item creation: expensive to discover late.' }
  ]
},
'SYN-SK-L1-05': {
  screen: { title: { es: 'Listas de precios', en: 'Price Lists' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Lista', '1', 'sys'], ['Nombre', 'Base', 'in'], ['Moneda', 'EUR', 'in'], ['Factor', '1,00', 'in']],
    cols: ['Lista', 'Nombre', 'Moneda', 'Factor'], numeric: [3], rows: [
      ['1', 'Base', 'EUR', '1,00'],
      ['2', 'Mayorista', 'EUR', '0,85'],
      ['3', 'Export', 'USD', '1,00']
    ],
    status: ['Existencias > Definir > Listas de precios'],
    note: { es: 'Listas reales: la Mayorista = Base × 0,85. Los precios efectivos provienen de aquí + descuentos por socio/grupo.', en: 'Real price lists: Wholesale = Base × 0.85. Effective prices come from here + partner/group discounts.' } },
  cfg: [
    { es: 'Existencias > Definir > Listas de precios: cada lista tiene moneda y factor sobre la base.', en: 'Inventory > Define > Price lists: each list has currency and factor over the base.' },
    { es: 'Periodos de precios: precios con vigencia temporal (existentes > Definir > Periodos de precios).', en: 'Price periods: prices with temporal validity.' }
  ],
  e2e: [
    { es: '1. Crea Lista 2 Mayorista factor 0,85 sobre Base.', en: '1. Create List 2 Wholesale factor 0.85 over Base.' },
    { es: '2. Asigna Lista 2 al grupo de clientes "Mayoristas" (o al socio directamente).', en: '2. Assign List 2 to the "Wholesale" customer group (or the partner directly).' },
    { es: '3. Pedido de mayorista: precio automático 60,00 × 0,85 = 51,00.', en: '3. Wholesale order: automatic price 60.00 × 0.85 = 51.00.' }
  ],
  war: { q: { es: 'Ventas reporta: los mayoristas pagan Base price en algunos pedidos.', en: 'Sales reports: wholesalers pay Base price on some orders.' },
    sympt: [{ es: 'Pedidos del mismo grupo con precios distintos para el mismo artículo el mismo día.', en: 'Same-group orders with different prices for the same item the same day.' }],
    root: [{ es: 'La lista del socio (ficha) manda sobre la del grupo: socio con Lista 1 en ficha pese a ser mayorista.', en: 'The partner\'s card list overrides the group\'s: a wholesaler with List 1 on card.' }],
    fix: [{ es: 'Corregir la lista en las fichas afectadas + revisar que los descuentos de grupo estén activos.', en: 'Fix the list on affected cards + verify group discounts are active.' }] },
  bp: [
    { es: 'Jerarquía de precios: socio > grupo > lista por defecto. Quien está más cerca del documento manda.', en: 'Price hierarchy: partner > group > default list. Closest to the document wins.' },
    { es: 'Precio efectivo = lista × (1 − descuentos encadenados). Calcula SIEMPRE el efectivo en un pedido de prueba.', en: 'Effective price = list × (1 − chained discounts). ALWAYS compute the effective on a test order.' }
  ]
},
'SYN-SK-L1-06': {
  screen: { title: { es: 'Determinación de cuentas – Artículos', en: 'Account Determination – Items' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Orden', 'Grupo de artículos', 'sys'], ['Cuenta de ingresos', '(4x)', 'in']],
    cols: ['Grupo de artículos', 'Ingresos', 'Coste', 'Stock'], rows: [
      ['Electrónica', '400010', '640010', '140010'],
      ['Materiales', '400020', '640020', '140020']
    ],
    status: [ 'Administración > Definir > Determinación de cuentas'],
    note: { es: 'Matriz real de determinación: grupo de artículo × operación → cuenta. La contabilidad de B1 es determinística.', en: 'Real determination matrix: item group × operation → account. B1\'s accounting is deterministic.' } },
  cfg: [
    { es: 'Administración > Definir > Determinación de cuentas (ventana general): orden de resolución orden de compra > grupo de artículo > warehouse.', en: 'Administration > Define > G/L Account Determination: resolution order purchase order > item group > warehouse.' }
  ],
  e2e: [
    {  es: '1. Grupo Electrónica: ingresos 400010, coste 640010, stock 140010.', en: '1. Electronics group: revenue 400010, cost 640010, stock 140010.' },
    { es: '2. Factura de venta de A00001 (Electrónica): H 400010 Ventas, y el coste va a 640010.', en: '2. Sales invoice of A00001 (Electronics): H 400010 Sales, cost goes to 640010.' },
    { es: '3. Auditoría de cuentas: Query OINV+INV1 join OITM por ItmsGrpCod → siempre puedes reconstruir qué cuenta recibió qué.', en: '3. Account audit: OINV+INV1 join OITM by ItmsGrpCod → you can always reconstruct which account received what.' }
  ],
  war: { q: { es: 'Ingresos de Electrónica incluyen ventas de Materiales.', en: 'Electronics revenue includes Materials sales.' },
    sympt: [{ es: 'La cuenta 400010 recibe ventas de artículos cuyo grupo es Materiales.', en: 'Account 400010 receives sales of items whose group is Materials.' }],
    root: [{ es: 'Cuentas del grupo Materiales apuntando a las de Electrónica (error de configuración en la matriz).', en: 'Materials group accounts pointing to Electronics\' (matrix configuration error).' }],
    fix: [{ es: 'Corregir la matriz de determinación + asiento de reclasificación de las ventas ya contabilizadas.', en: 'Fix the determination matrix + reclassification journal for already-posted sales.' }] },
  bp: [
    { es: 'La determinación de cuentas es determinística: grupo × operación → cuenta. No hay magia.', en: 'Account determination is deterministic: group × operation → account. No magic.' },
    { es: 'Cuentas asociadas por nivel: orden > grupo > warehouse. Verifica por qué nivel aplica antes de cambiar.', en: 'Linked accounts by level: order > group > warehouse. Verify which level applies before changing.' }
  ]
},
'SYN-SK-L1-07': {
  screen: { title: { es: 'Condiciones de pago', en: 'Payment Terms' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Código', '2P10N30', 'sys'], ['Nombre', '2% 10 Neto 30', 'in']],
    cols: ['Condiciones', 'Condiciones de grupo', 'Meses/días', 'Porcentaje'], numeric: [2, 3], rows: [
      ['2% 10 Neto 30', '1', '10', '2,000'],
      ['', '2', '30', '100,000']
    ],
    status: ['Administración > Definir > Socios de negocio > Condiciones de pago'],
    note: { es: 'Condiciones reales: escalones de grupo con meses/días y porcentajes. "2% 10 Neto 30" = 2% si paga en 10 días, 100% a 30.', en: 'Real terms: group tiers with months/days and percentages. "2% 10 Net 30" = 2% within 10 days, 100% at 30.' } },
  cfg: [ { es: 'Administración >  Definir > Socios de negocio > Condiciones de pago: escalones (grupo 1 = 2%/10 días, grupo 2 = 100%/30 días).', en: 'Administration > Define > Business Partners > Payment terms: tiers (group 1 = 2%/10 days, group 2 = 100%/30 days).' } ],
  e2e: [
    { es: '1. Define 2P10N30: grupo 1 → 2% a 10 días; grupo 2 → 100% a 30 días.', en: '1. Define 2P10N30: tier 1 → 2% at 10 days; tier 2 → 100% at 30 days.' },
    { es: '2. Factura 1.000 € del 01.09: vencimiento 01.10, descuento válido hasta 11.09 (2% = 20 €).', en: '2. 1,000 € invoice dated 01.09: due 01.10, discount valid until 11.09 (2% = 20 €).' },
    { es: '3. Cobro el 05.09: el sistema aplica 980 € y cierra la factura por descuento pronto pago.', en: '3. Collection on 05.09: system applies 980 € and closes the invoice by early-payment discount.' }
  ],
  war: { q: { es: 'Cobros con descuentos que contabilidad no reconoce.', en: 'Collections with discounts accounting doesn\'t recognize.' },
    sympt: [{ es: 'Saldos residuales de 2% en facturas cobradas: la diferencia del pronto pago no va a su cuenta.', en: 'Residual 2% balances on collected invoices: the early-payment difference not going to its account.' }],
    root: [{ es: 'Cuenta de descuento pronto pago sin definir en la configuración de pagos (ER), o definida a una cuenta puente errónea.', en: 'Early-payment discount account undefined in payment settings, or pointed at a wrong clearing account.' }],
    fix: [{ es: 'Definir la cuenta de descuentos concedidos (6650 en SKR03) + recalcular saldos residuales.', en: 'Define the discounts-granted account (6650 in SKR03) + recalculate residual balances.' }] },
  bp: [
    { es: 'Sin condiciones de pago, no hay fecha de vencimiento → no hay aging → no hay cobranza gestionada.', en: 'No payment terms, no due date → no aging → no managed collections.' },
    { es: 'Es calone la cuenta de descuento pronto pago ANTES del primer cobro con descuento.', en: 'Isolate the early-payment discount account BEFORE the first discounted collection.' }
  ]
},
'SYN-SK-L1-08': {
  screen: { title: { es: 'Autorizaciones – General', en: 'Authorizations – General' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Usuario', 'ventas01', 'sys'], ['Superusuario', 'No', 'sys']],
    cols: ['Autorización', 'Permiso', 'Restricción máxima'], numeric: [2], rows: [
      ['Pedido de cliente – Añadir', 'Completo', '—'],
      ['Factura de cliente – Añadir', 'Completo', '50.000 EUR'],
      ['Asiento manual – Añadir', 'Solo lectura', '—']
  ],
    status: ['Administración > Autorizaciones > General'],
    note: { es: 'Matriz real de autorizaciones: usuario × permiso con límites de importe. El permiso "Solo lectura" sobre asientos manuales es un clásico de hardening.', en: 'Real authorization matrix: user × permission with amount limits. Read-only on manual journals is a hardening classic.' } },
  cfg: [
    { es: 'Administración > Autorizaciones > General: permisos por usuario y por documento, con límites de importe.', en: 'Administration > Authorizations > General: per-user, per-document permissions with amount limits.' },
    { es: "Administración > Inicialización de empresa > General: 'Permitir modificación de fecha contable' — ciérralo si tu cierre es estricto.", en: "Company detail: 'Allow posting date modification' — lock it for strict closes." }
  ],
  inicializacion: true,
  e2e: [
    { es: '1. Define autorización: ventas01 puede añadir pedidos sin límite, facturas hasta 50.000 EUR.', en: '1. Define authorization: sales01 can add orders unlimited, invoices up to 50,000 EUR.' },
    { es: '2. ventas01 intenta facturar 72.000: bloqueo con mensaje y solicitud de aprobación al jefe.', en: '2. sales01 tries to invoice 72,000: blocked with message and approval request to the manager.' },
    { es: '3. El jefe aprueba desde su bandeja de aprobaciones y el documento sigue.', en: '3. The manager approves from the approvals inbox and the document proceeds.' }
  ],
  war: { q: { es: 'Un comercial crea pedidos para un cliente con crédito bloqueado.', en: 'A salesperson creates orders for a credit-blocked customer.' },
    sympt: [{ es: 'Pedidos aceptados para un socio con límite de crédito 0 y bloqueo activo.', en: 'Orders accepted for a partner with credit limit 0 and active block.' }],
    root: [{ es: 'Autorización de pedidos sin verificar el bloqueo de crédito del socio (la validación existe pero estaba desactivada).', en: 'Order authorization without checking the partner\'s credit block (validation exists but was deactivated).' }],
    fix: [{ es: 'Activar la verificación de crédito en pedidos + límite de importe por perfil comercial.', en: 'Activate credit check on orders + amount limit per sales profile.' }] },
  bp: [
    { es: 'Autorización por defecto: denegar. Conceder por caso. Es el único orden seguro.', en: 'Default authorization: deny. Grant per case. The only safe order.' },
    { es: 'Límite de importe por documento y por usuario: el control de precio-valor antes del daño.', en: 'Amount limit per document and user: value control before damage.' }
  ]
}
};
