// masterclass-data-2.mjs — Lote 2: L2-01..08 (procesos core)
export const MC_BATCH2 = {
'SYN-SK-L2-01': {
  screen: { title: { es: 'Pedido a cobro (O2C) – Ventana de factura con entrega', en: 'Order to Cash – Invoice with delivery' }, tabs: ['Contenido', 'Logística', 'Contabilidad'], activeTab: 0,
    header: [['Nº doc.', '1001-2026', 'sys'], ['Cliente', 'C20000', 'sys'], ['Fecha contable', '23.08.26', 'in'], ['Moneda', 'EUR', 'sys']],
    cols: ['Nº', 'Cód. artículo', 'Cant.', 'Precio', 'Total'], numeric: [2, 3, 4], rows: [
      ['1', 'A00001', '10', '60,00', '600,00'],
      ['2', 'A00002', '5', '24,00', '120,00']
    ],
    totals: [['Neto', '720,00'], ['IVA 19%', '136,80'], ['Total', '856,80']],
    status: ['Entrega 5001 integrada (copia líneas y almacén)'],
    note: { es: 'O2C completo en una ventana: pedido → entrega → factura. El asiento nace al añadir la factura: D Cliente 856,80 / H Ventas 720,00 + H IVA 136,80.', en: 'Full O2C in one window: order → delivery → invoice. The journal is born on invoice add: D Customer 856.80 / H Sales 720.00 + H VAT 136.80.' } },
  cfg: [
    { es: 'La cadena O2C: Pedido (reserva) → Entrega (mueve stock, coste) → Factura (contabiliza) → Cobro (cierra).', en: 'The O2C chain: Order (reserves) → Delivery (moves stock, cost) → Invoice (posts) → Payment (closes).' },
    { es: 'Factura de clientes directa, sin entrega base: para artículos de inventario puede contabilizar en un solo documento la salida de stock y coste, además de cliente, ingreso e impuesto. Es un flujo abreviado y no crea una entrega independiente.', en: 'Direct A/R invoice without a base delivery: for inventory items it can post stock and cost together with receivables, revenue, and tax in one document. It is an abbreviated flow and does not create a separate delivery.' }
  ],
  e2e: [
    { es: '1. Pedido 162: 10× LED + 5× PIR, total 720,00 neto.', en: '1. Order 162: 10× LED + 5× PIR, total 720.00 net.' },
    { es: '2. Entrega 5001: 10× LED + 5× PIR, neto 720,00. Coste de ventas contabilizado según la valoración configurada.', en: '2. Delivery 5001: 10× LED + 5× PIR, net 720.00. COGS posted according to the configured valuation.' },
    { es: '3. Factura 1001-2026: D Cliente 856,80 / H Ventas 720,00 / H IVA 136,80 (19% alemán).', en: '3. Invoice 1001-2026: D Customer 856.80 / H Sales 720.00 / H VAT 136.80 (19% German).' },
    { es: '4. Cobro entrante 856,80: D Banco / H Cliente. La factura queda cerrada.', en: '4. Incoming payment 856.80: D Bank / H Customer. Invoice closed.' }
  ],
  war: { q: { es: 'Ingresos agosto no cuadran con entregas agosto.', en: 'August revenue doesn\'t match August deliveries.' },
    sympt: [{ es: 'Δ sistemático entre OINV (facturas) y ODLN (entregas) del mismo mes: 11.000 € de ingreso sin entrega.', en: 'Systematic Δ between OINV (invoices) and ODLN (deliveries) same month: 11,000 € revenue without delivery.' }],
    root: [{ es: 'Facturas directas sin entrega: venden servicios, pero también algo de producto sin albarán.', en: 'Direct invoices without delivery: services sold, but also some product without delivery note.' }],
    fix: [{ es: 'Separar facturación de servicios (sin stock) de producto (con entrega) + query mensual OINV-ODLN como control de gestión.', en: 'Separate service invoicing (no stock) from product (with delivery) + monthly OINV-ODLN query as management control.' }] },
  bp: [
    { es: 'Entrega mueve stock y coste; factura contabiliza ingreso e IVA. Nunca mezclar los efectos.', en: 'Delivery moves stock and cost; invoice posts revenue and VAT. Never mix the effects.' },
    { es: 'Cobro cierra la factura pero no el derecho: el derecho nació en la factura.', en: 'Payment closes the invoice but not the right: the right was born at the invoice.' }
  ]
},
'SYN-SK-L2-02': {
  screen: { title: { es: 'Solicitud a pago (P2P)', en: 'Purchase to Pay (P2P)' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Doc', 'Solicitud → Pedido → Entrada → Factura', 'sys']],
    cols: ['Paso', 'Documento', 'Efecto'], rows: [
      ['1', 'Solicitud de compra', 'Demanda interna, sin stock ni contabilidad'],
      ['2', 'Pedido a proveedor', 'Compromiso de compra'],
      ['3', 'Entrada de mercancía', 'Stock + provision (GR/IR puente)'],
      ['4', 'Factura de proveedor', 'Reconoce deuda + IVA soportado + cierra GR/IR']
    ],
    status: ['Compras → cada documento en su menú'],
    note: { es: 'P2P en 4 documentos: el puente GR/IR (recibido no facturado) es la cuenta que reconcilia entradas y facturas.', en: 'P2P in 4 documents: the GR/IR bridge (goods received not invoiced) reconciles receipts and invoices.' } },
  cfg: [
    { es: 'Compras > Solicitud de compra: demanda interna. Puede nacer de MRP o manual.', en: 'Purchasing > Purchase Request: internal demand. Born from MRP or manual.' },
    { es: 'Entrada de mercancía: contabiliza D Stock / H GR-IR (recibido no facturado).', en: 'Goods receipt: posts D Stock / H GR-IR (goods received not invoiced).' },
    { es: 'Factura de proveedor: D GR-IR + D IVA soportado / H Proveedor. El puente queda a cero.', en: 'Vendor invoice: D GR-IR + D input VAT / H Vendor. The bridge zeroes out.' }
  ],
  e2e: [
    { asiento: true, es: '1. Entrada mercancía: D Stock 480,00 / H GR-IR 480,00.', en: '1. Goods receipt: D Stock 480.00 / H GR-IR 480.00.' },
    { asiento: true, es: '2. Factura proveedor: D GR-IR 480,00 + D IVA 91,20 / H Proveedor 571,20.', en: '2. Vendor invoice: D GR-IR 480.00 + D VAT 91.20 / H Vendor 571.20.' },
    { es: '3. La cuenta puente queda a 0: entradas = facturas. Si no, hay recibido-sin-facturar pendiente.', en: '3. The bridge is 0: receipts = invoices. Otherwise there\'s pending received-not-invoiced.' },
    { es: '4. Pago saliente: D Proveedor / H Banco. Cadena P2P cerrada.', en: '4. Outgoing payment: D Vendor / H Bank. P2P chain closed.' }
  ],
  war: { q: { es: 'La cuenta GR/IR lleva meses con saldo creciente.', en: 'The GR/IR account carries a growing balance for months.' },
    sympt: [{ es: 'La cuenta puente de mercancías recibidas no facturadas aumenta cada mes: hay entradas pendientes de factura desde hace más de 60 días.', en: 'The goods-received-not-invoiced clearing account rises monthly: some receipts have awaited invoices for more than 60 days.' }],
    root: [{ es: 'Facturas de proveedor que llegan tarde (o se pierden): la mercancía entra, la deuda no se reconoce.', en: 'Late (or lost) vendor invoices: goods enter, debt unrecognized.' }],
    fix: [{ es: 'Informe mensual GR/IR con antigüedad + contacto con proveedores. La cuenta puente es un KPI de proceso, no un error.', en: 'Monthly GR/IR aging report + supplier contact. The bridge is a process KPI, not an error.' }] },
  bp: [
    { es: 'La antigüedad y conciliación de la cuenta puente son indicadores del proceso P2P; un saldo no es automáticamente un error, pero sí exige explicar entradas, facturas y diferencias pendientes.', en: 'Clearing-account ageing and reconciliation are P2P indicators; a balance is not automatically an error, but pending receipts, invoices, and differences must be explained.' },
    { es: 'El 3-vías: pedido vs entrada vs factura. Cualquier diferencia es una excepción que gestionar.', en: 'The 3-way match: order vs receipt vs invoice. Any difference is an exception to manage.' }
  ]
},
'SYN-SK-L2-03': {
  screen: { title: { es: 'Actividades CRM', en: 'CRM Activities' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Tipo', 'Llamada', 'in'], ['Socio', 'C20000', 'in'], ['Estado', 'Abierta', 'in']],
    cols: ['Campo', 'Valor'], rows: [
      ['Asunto', 'Seguimiento oferta Q3'],
      ['Fecha inicio', '25.08.26 10:00'],
      ['Responsable', 'ventas01'],
      ['Notas', 'Cliente pide revisar precio mayorista']
    ],
    status: ['CRM → Actividades'],
    note: { es: 'Actividad CRM real: cada interacción con el socio queda registrada con responsable y estado.', en: 'Real CRM activity: each partner interaction recorded with owner and status.' } },
  cfg: [ { es: 'CRM > Actividades: tipos (llamada, reunión, tarea, nota). Cada actividad enlaza socio + usuario + estado.', en: 'CRM > Activities: types (call, meeting, task, note). Each links partner + user + status.' } ],
  e2e: [
    { es: '1. Actividad "Llamada" sobre C20000 con fecha y responsable.', en: '1. "Call" activity on C20000 with date and owner.' },
    { es: '2. La actividad puede nacer desde un documento (oferta/pedido) o del socio directamente.', en: '2. The activity can be born from a document (quote/order) or the partner directly.' },
    { es: '3. Informe de actividades abiertas por responsable: el pipeline de trabajo comercial.', en: '3. Open activities by owner report: the commercial work pipeline.' }
  ],
  war: { q: { es: 'El comercial estrella se va y nadie sabe qué había hablado con cada cliente.', en: 'The star salesperson leaves and nobody knows what was agreed with each client.' },
    sympt: [{ es: 'Sin historial de interacciones: cada cliente arranca de cero con el nuevo responsable.', en: 'No interaction history: each client starts from zero with the new owner.' }],
    root: [{ es: 'CRM opcional en la práctica: si no se exige registrar la actividad, no se registra.', en: 'CRM optional in practice: if logging the activity isn\'t enforced, it isn\'t logged.' }],
    fix: [{ es: 'Regla: ninguna llamada relevante sin actividad. La actividad es parte del proceso, no extra.', en: 'Rule: no relevant call without an activity. The activity is part of the process, not extra.' }] },
  bp: [
    { es: 'La ficha del socio es su expediente: actividades, documentos, saldo. Todo en un lugar.', en: 'The partner card is their file: activities, documents, balance. All in one place.' },
    { es: 'Actividades cerradas = memoria institucional. Abiertas = trabajo pendiente.', en: 'Closed activities = institutional memory. Open = pending work.' }
  ]
},
'SYN-SK-L2-04': { screen: { title: { es: 'Devolución y abono', en: 'Returns and Credit Memo' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Tipo', 'Devolución', 'sys'], ['Base', 'Factura 1001-2026', 'sys']],
    cols: ['Documento', 'Efecto stock', 'Efecto contable'], rows: [
      ['Devolución (returns)', 'Stock +', 'D Ventas / H Cliente (inverso)'],
      ['Abono (credit memo)', '—', 'D Ventas / H Cliente (inverso)'],
      ['Devolución + abono', 'Stock +', 'Inverso completo']
    ],
    status: ['Ventas → Devoluciones / Ventas → Abono'],
    note: { es: 'Devolución devuelve stock; abono solo corrige importe. La combinación "devolución con abono" es el inverso exacto de la factura.', en: 'Return brings stock back; credit memo only corrects amount. "Return + credit memo" is the invoice\'s exact inverse.' } },
  cfg: [
    { es: 'Ventas > Devolución: crea la devolución desde la entrega/factura original (drilldown inverso).', en: 'Sales > Return: create the return from the original delivery/invoice (inverse drilldown).' },
    { es: 'Ventas > Abono: corrige importes sin tocar stock.', en: 'Sales > Credit memo: corrects amounts without touching stock.' }
  ],
  e2e: [
    { es: '1. Cliente devuelve 2 lámparas de la factura 1001-2026 (2×60 + IVA).', en: '1. Customer returns 2 lamps from invoice 1001-2026 (2×60 + VAT).' },
    { es: ' desde la factura original: hereda líneas y precios.', en: ' from the original invoice: inherits lines and prices.' },
    { es: '3. Contabilización del abono: D Ventas 120,00 + D IVA 22,80 / H Cliente 142,80.', en: '3. Credit memo posting: D Sales 120.00 + D VAT 22.80 / H Customer 142.80.' }
  ],
  war: { q: { es: 'Cliente devuelve mercancía pero el abono no reduce su deuda.', en: 'Customer returns goods but the credit memo doesn\'t reduce their debt.' },
    sympt: [{ es: 'Devolución creada sin abono: el stock volvió, la deuda siguió.', en: 'Return created without credit memo: stock came back, debt stayed.' }],
    root: [{ es: 'Confusión devolución vs abono: la devolución mueve stock, el abono corrige deuda. Son dos actos distintos.', en: 'Return vs credit-memo confusion: return moves stock, memo corrects debt. Two distinct acts.' }],
    fix: [{ es: 'Flujo canónico: devolución → abono. Si hay stock, ambos; si solo importe, solo abono.', en: 'Canonical flow: return → credit memo. Stock present, both; amount-only, memo only.' }] },
  bp: [
    { es: 'Devolución devuelve stock; abono corrige importe. El inverso completo son los dos.', en: 'Return returns stock; memo corrects amount. The full inverse is both.' },
    { es: 'Siempre desde el documento original: el drilldown inverso mantiene la cadena.', en: 'Always from the original document: inverse drilldown keeps the chain.' }
  ]
},
'SYN-SK-L2-05': { screen: { title: { es: 'Cobro entrante', en: 'Incoming Payment' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Nº', '2301', 'sys'], ['Cliente', 'C20000', 'sys'], ['Fecha contable', '01.09.26', 'in']],
    cols: ['Factura', 'Importe factura', 'Asignado', 'Saldo'], numeric: [1, 2, 3], rows: [
      ['1001-2026', '856,80', '856,80', '0,00'],
      ['1002-2026', '1.425,00', '0,00', '1.425,00']
    ],
    totals: [['Total cobrado', '856,80']],
    status: ['Bancos → Cobros → Cobro entrante'],
    note: { es: 'Cobro con asignación interna: la factura 1001 queda cerrada, la 1002 sigue abierta. Esta asignación alimenta la conciliación.', en: 'Payment with internal assignment: invoice 1001 closed, 1002 stays open. This feeds reconciliation.' } },
  cfg: [
    { es: 'Bancos / Finanzas > Cobros > Cobro entrante: D Banco / H Cliente, con asignación a facturas concretas.', en: 'Finance > Incoming payment: D Bank / H Customer, assigned to specific invoices.' },
    { es: 'Sin asignación, el saldo del cliente baja pero ninguna factura se cierra: el aging se rompe.', en: 'Without assignment, the customer balance drops but no invoice closes: aging breaks.' }
  ],
  e2e: [
    { es: '1. Cobro 856,80 asignado a factura 1001-2026: D Banco / H Cliente.', en: '1. Payment 856.80 assigned to invoice 1001-2026: D Bank / H Customer.' },
    { es: '2. Extracto bancario: la línea del banco concilia contra el cobro registrado.', en: '2. Bank statement: the bank line reconciles against the registered payment.' },
    { es: '3. Conciliación interna: B1 iguala factura y cobro en el interior de la cuenta cliente.', en: '3. Internal reconciliation: B1 matches invoice and payment inside the customer account.' }
  ],
  war: { q: { es: 'El saldo del cliente es 0 pero el aging muestra facturas vencidas.', en: 'The customer balance is 0 but aging shows overdue invoices.' },
    sympt: [{ es: 'C20000 saldo 0 con facturas vencidas 3.000 € en el aging.', en: 'C20000 balance 0 with 3,000 € overdue invoices in aging.' }],
    root: [{ es: 'Cobros sin asignación a factura: el saldo global cuadra pero el detalle por factura no cierra.', en: 'Payments without invoice assignment: global balance matches but per-invoice detail doesn\'t.' }],
    fix: [{ es: 'Conciliación interna en la cuenta del cliente: emparejar cobros y facturas manualmente.', en: 'Internal reconciliation on the customer account: manually pair payments and invoices.' }] },
  bp: [
    { es: 'Cobro SIEMPRE con asignación a facturas: sin ella, el aging muere.', en: 'Payment ALWAYS assigned to invoices: without it, aging dies.' },
    { es: 'Residuo < umbral (p. ej. 1 €): cerrar por diferencia de redondeo documentada.', en: 'Residual under threshold (e.g. 1 €): close by documented rounding difference.' }
  ]
},
'SYN-SK-L2-06': {
  screen: { title: { es: 'Pago saliente', en: 'Outgoing Payment' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Nº', '1801', 'sys'], ['Proveedor', 'P-SYN-001', 'sys'], ['Fecha contable', '02.09.26', 'in']],
    cols: ['Factura', 'Importe', 'Asignado'], numeric: [1, 2], rows: [
      ['7001-2026', '571,20', '571,20']
    ],
    totals: [['Total pagado', '571,20', '']],
    status: ['Bancos → Pagos → Pago saliente'],
    note: { es: 'Pago saliente con asignación a factura de proveedor: D Proveedor / H Banco.', en: 'Outgoing payment assigned to vendor invoice: D Vendor / H Bank.' } },
  cfg: [ { es: 'Finanzas > Pagos > Pago saliente: D Proveedor / H Banco, asignado a facturas concretas.', en: 'Finanzas > Pagos > Pago saliente: D Vendor / H Bank, assigned to specific invoices.' } ],
  e2e: [
    { es: '1. Pago 571,20 asignado a la factura 7001-2026: D Proveedor / H Banco.', en: '1. Payment 571.20 assigned to invoice 7001-2026: D Vendor / H Bank.' },
    { es: '2. Factura de proveedor queda cerrada y el compromiso se libera.', en: '2. Vendor invoice closed and commitment released.' },
    { es: '3. Extracto bancario: la línea del extracto concilia contra este pago.', en: '3. Bank statement: the statement line reconciles against this payment.' }
  ],
  war: { q: { es: 'Pagos duplicados al mismo proveedor el mismo mes.', en: 'Duplicate payments to the same vendor in the same month.' },
    sympt: [{ es: 'Saldo proveedor en negativo (proveedor nos debe a nosotros) sin abonos que lo expliquen.', en: 'Vendor balance negative (vendor owes us) without credit memos explaining it.' }],
    root: [{ es: 'Pago manual sin asignación a factura + doble pago de la misma factura.', en: 'Manual payment without invoice assignment + double payment of the same invoice.' }],
    fix: [{ es: 'Siempre asignar el pago a facturas concretas + informe de saldos de proveedor en negativo (anomalía).', en: 'Always assign payments to invoices + negative vendor balance report (anomaly).' }] },
  bp: [
    { es: 'Proveedor con saldo negativo = alerta: te deben (pagado de más o abonos sin aplicar).', en: 'Negative vendor balance = alert: they owe you (overpaid or unapplied credit memos).' },
    { es: 'El extracto bancario es la verdad del dinero; B1 es la verdad del derecho.', en: 'The bank statement is the money\'s truth; B1 is the right\'s truth.' }
  ]
},
'SYN-SK-L2-07': {
  screen: { title: { es: 'Traspaso de stock', en: 'Stock Transfer' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Nº', '4511', 'sys'], ['De almacén', '01 Principal', 'in'], ['A almacén', '02 Norte', 'in']],
    cols: ['Artículo', 'Cantidad', 'Coste unit.', 'Total coste'], numeric: [1, 2, 3], rows: [
      ['A00001', '40', '4,00', '160,00']
    ],
    totals: [['Total', '160,00']],
    status: ['Existencias → Traspasos'],
    note: { es: 'Traspaso real: mueve 40 unidades de 01 a 02 a coste 4,00. Sin asiento si ambas cuentas de stock son la misma.', en: 'Real transfer: moves 40 units 01→02 at 4.00 cost. No journal if both stock accounts are the same.' } },
  cfg: [ { es: 'Existencias > Traspaso de stock: mueve stock entre almacenes a coste. Si la determinación contable usa cuentas de inventario distintas por almacén, genera el asiento entre esas cuentas.', en: 'Inventory > Stock Transfer: moves stock between warehouses at cost. If G/L account determination uses different inventory accounts by warehouse, it posts between those accounts.' } ],
  e2e: [
    { es: '1. Traspaso 40× A00001 de 01 a 02 a coste 4,00 = 160,00 de valor movido.', en: '1. Transfer 40× A00001 from 01 to 02 at 4.00 cost = 160.00 value moved.' },
    { es: '2. El stock físico cambia de almacén; el total global queda igual.', en: '2. Physical stock changes warehouse; global total stays equal.' },
    { es: '3. Con cuentas separadas por almacén: D Stock 02 160 / H Stock 01 160.', en: '3. With separate per-warehouse accounts: D Stock 02 160 / H Stock 01 160.' }
  ],
  war: { q: { es: 'Stock total cuadra pero la disponibilidad en 01 es cero.', en: 'Total stock balances but availability in 01 is zero.' },
    sympt: [{ es: 'Disponible 01 = 0 con comprometido alto: pedidos reservan 01, el físico está en 02.', en: 'Available 01 = 0 with high committed: orders reserve 01, physical sits in 02.' }],
    root: [{ es: 'Almacén de reserva mal configurado en pedidos (por defecto trae el del socio, no el operativo).', en: 'Reserve warehouse misconfigured on orders (defaults to the partner\'s, not the operational one).' }],
    fix: [{ es: 'Corregir almacén de reserva en pedidos abiertos + formación en selección de almacén en líneas.', en: 'Fix reserve warehouse on open orders + warehouse-selection training.' }] },
  bp: [
    { es: 'Disponible = En stock − Comprometido, POR ALMACÉN. La disponibilidad es local, no global.', en: 'Available = In stock − Committed, PER WAREHOUSE. Availability is local, not global.' }
  ]
},
'SYN-SK-L2-08': {
  screen: { title: { es: 'Precio efectivo con descuentos', en: 'Effective Price with Discounts' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Artículo', 'A00001', 'sys'], ['Precio lista', '60,00', 'sys'], ['Desc. grupo cliente', '5%', 'sys']],
    cols: ['Concepto', 'Valor'], numeric: [1], rows: [
      ['Precio lista', '60,00'],
      ['Dto. grupo cliente 5%', '-3,00'],
      ['Dto. línea 10%', '-5,70'],
      ['Precio efectivo', '51,30']
    ],
    totals: [['Descuento total', '14,50%']],
    status: ['Ventas → Pedidos → Condiciones'],
    note: { es: 'Precio efectivo real: 60 × 0,95 × 0,90 = 51,30. Los descuentos se encadenan multiplicativamente, no se suman.', en: 'Real effective price: 60 × 0.95 × 0.90 = 51.30. Discounts chain multiplicatively, not additively.' } },
  cfg: [ { es: 'Descuentos: ficha socio, grupo de socio, descuentos por artículo/grupo, descuentos por línea. Se encadenan multiplicativamente.', en: 'Discounts: partner card, partner group, item/group discounts, line discounts. Chained multiplicatively.' } ],
  e2e: [
    { es: '1. Precio lista 60,00; dto. grupo 5% → 57,00; dto. línea 10% → 51,30.', en: '1. List 60.00; group discount 5% → 57.00; line discount 10% → 51.30.' },
    { es: '2. El asiento lleva el ingreso a 51,30 × cantidad, no al precio de lista.', en: '2. The journal carries revenue at 51.30 × qty, not list price.' },
    { es: '3. Margen real: 51,30 − 40,00 (coste) = 11,30 (22% sobre venta).', en: '3. Real margin: 51.30 − 40.00 (cost) = 11.30 (22% on sales).' }
  ],
  war: { q: { es: 'Margen bruto informado 30% vs real 22%. Dirección pregunta por qué.', en: 'Reported gross margin 30% vs real 22%. Management asks why.' },
    sympt: [{ es: 'Los informes usan precio de lista; el asiento usa el efectivo. Δ = 8 puntos de margen fantasma.', en: 'Reports use list price; the journal uses effective. Δ = 8 ghost margin points.' }],
    root: [{ es: 'Descuentos encadenados no modelados en los informes: 5% + 10% ≠ 15% total (es 14,5%).', en: 'Chained discounts unmodeled in reports: 5% + 10% ≠ 15% total (it\'s 14.5%).' }],
    fix: [{ es: 'Reconstruir los informes sobre el precio efectivo de la línea (StockPrice/LineTotal), no sobre lista.', en: 'Rebuild reports on the line\'s effective price (StockPrice/LineTotal), not list.' }] },
  bp: [
    { es: 'Los descuentos se encadenan multiplicativamente: 5%+10% = 14,5%, no 15%. Modelízalo así o tus márgenes mienten.', en: 'Discounts chain multiplicatively: 5%+10% = 14.5%, not 15%. Model it this way or your margins lie.' },
    { es: 'El asiento siempre dice la verdad del ingreso: cuando dude del informe, lea el asiento.', en: 'The journal always tells revenue truth: when in doubt about a report, read the journal.' }
  ]
}
};
