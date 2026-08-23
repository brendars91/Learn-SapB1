// masterclass-data-3.mjs — Lote 3: L3-01..08, L4-01..08 (16 entradas: inventario avanzado + finanzas)
export const MC_BATCH3 = {
'SYN-SK-L3-01': {
  screen: { title: { es: 'Gestión por lotes (detalle de línea)', en: 'Batch Management (line detail)' }, menu: false, tabs: ['Lotes'], activeTab: 0,
    header: [['Artículo', 'RM-Q1 (resina)', 'sys'], ['Almacén', '01', 'sys'], ['Entrada', '50 kg', 'in']],
    cols: ['Nº lote', 'Cant. asignada', 'Caducidad', 'Coste'], numeric: [1, 3], rows: [
      ['B-2026-08-01', '30 kg', '01.09.27', '4,10/kg'],
      ['B-2026-08-02', '20 kg', '15.09.27', '4,30/kg']
    ],
    status: ['Existencias → Gestión por lotes'],
    note: { es: 'Asignación real de lotes en una entrada: cada lote lleva caducidad y coste propio. El coste del consumo sale por FIFO del lote.', en: 'Real batch assignment on receipt: each batch carries expiry and its own cost. Consumption cost exits FIFO per batch.' } },
  cfg: [
    { es: 'Existencias > Definir > Grupos de artículos: "Gestionar artículos por lotes" activa el comportamiento.', en: 'Inventory > Define > Item groups: "Manage items by batches" enables behaviour.' },
    { es: 'Opciones de lote (release): automática en entrada/salida, obligatoria, liberación por caducidad FEFO.', en: 'Batch release options: automatic on receipt/issue, mandatory, FEFO expiry release.' }
  ],
  e2e: [
    { es: '1. Entrada 50 kg: lotes B-08-01 (30kg, 4,10) y B-08-02 (20kg, 4,30).', en: '1. Receipt 50 kg: batches B-08-01 (30kg, 4.10) and B-08-02 (20kg, 4.30).' },
    { es: '2. Consumo 40 kg con FEFO: 30 kg del lote 01 (4,10) + 10 kg del 02 (4,30).', en: '2. Consumption 40 kg FEFO: 30 kg from batch 01 (4.10) + 10 kg from 02 (4.30).' },
    { es: '3. Coste material = 30×4,10 + 10×4,30 = 166,00. Trazable a lote y proveedor.', en: '3. Material cost = 30×4.10 + 10×4.30 = 166.00. Traceable to batch and supplier.' }
  ],
  war: { q: { es: 'Retiro de producto del mercado: qué clientes recibieron el lote defectuoso.', en: 'Product recall: which customers received the defective batch.' },
    sympt: [{ es: 'QC detecta lote B-2026-08-02 defectuoso tras haber entregado a 4 clientes.', en: 'QC detects defective batch B-2026-08-02 after delivering to 4 customers.' }],
    root: [{ es: 'Sin gestión por lotes, la trazabilidad cliente-lote es imposible de reconstruir.', en: 'Without batch management, customer-batch traceability is impossible to reconstruct.' }],
    fix: [{ es: 'Consulta ODLN+IBT1 por lote: lista de entregas y clientes en minutos, no días.', en: 'Query ODLN+IBT1 by batch: list of deliveries and customers in minutes, not days.' }] },
  bp: [
    { es: 'Lotes = trazabilidad química/alimentaria. Series = trazabilidad electrónica. Ninguno = commodity.', en: 'Batches = chemical/food traceability. Serials = electronics. None = commodity.' },
    { es: 'FEFO para caducidad, FIFO para coste: configúralo según la naturaleza del producto.', en: 'FEFO for expiry, FIFO for cost: configure per product nature.' }
  ]
},
'SYN-SK-L3-02': {
  screen: { title: { es: 'Números de serie', en: 'Serial Numbers' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Artículo', 'PRJ-X9 (proyector)', 'sys'], ['Cantidad', '3', 'in']],
    cols: ['Nº serie', 'Estado', 'Estado sistema', 'Almacén'], rows: [
      ['SN-2026-0091', 'Disponible', 'A', '01'],
      ['SN-2026-0092', 'Disponible', 'A', '01'],
      ['SN-2026-0093', 'Comprometido', 'C', '01']
    ],
    status: ['Existencias → Números de serie'],
    note: { es: 'Series reales: cada unidad física tiene identidad propia con estado (A=disponible, C=comprometido).', en: 'Real serials: each physical unit has identity with state (A=available, C=committed).' } },
  cfg: [ { es: 'Grupo de artículos "Gestionar por nº de serie": asignación manual, automática o en cada transacción.', en: 'Item group "Manage by serial number": manual, automatic or per-transaction assignment.' } ],
  e2e: [
    { es: '1. Entrada 3 proyectores: series SN-0091/92/93 asignadas.', en: '1. Receipt 3 projectors: serials SN-0091/92/93 assigned.' },
    { es: '2. Pedido reserva SN-0093 (comprometido, estado C).', en: '2. Order reserves SN-0093 (committed, state C).' },
    { es: '3. Entrega lleva la serie al cliente: trazabilidad unitaria completa.', en: '3. Delivery carries the serial to the customer: full unit traceability.' }
  ],
  war: { q: { es: 'Garantía: ¿está aún en plazo el equipo SN-2026-0044?', en: 'Warranty: is unit SN-2026-0044 still in term?' },
    sympt: [{ es: 'Servicio técnico pregunta por fecha de venta de una unidad concreta.', en: 'Service asks for one unit\'s sale date.' }],
    root: [{ es: 'Sin series, la fecha de venta de UNA unidad no existe: solo la del lote de documentos.', en: 'Without serials, ONE unit\'s sale date doesn\'t exist: only the document batch\'s.' }],
    fix: [{ es: 'Consulta OSRN/OSRI por serie: fecha de entrega y cliente en un clic.', en: 'Query OSRN/OSRI by serial: delivery date and customer in one click.' }] },
  bp: [
    { es: 'Una serie = una unidad = una vida completa (entrada, entregas, servicio, garantía).', en: 'One serial = one unit = one full life (receipt, deliveries, service, warranty).' },
    { es: 'Series para electrónica y equipos; lotes para material a granel.', en: 'Serials for electronics and equipment; batches for bulk material.' }
  ]
},
'SYN-SK-L3-03': {
  screen: { title: { es: 'Ubicaciones (bin locations)', en: 'Bin Locations' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Almacén', '01', 'sys'], ['Subnivel', 'A-01-02', 'in']],
    cols: ['Código', 'Descripción', 'En stock'], numeric: [2], rows: [
      ['A-01-01', 'Pasillo A, estantería 1, nivel 1', '150'],
      ['A-01-02', 'Pasillo A, estantería 1, nivel 2', '80'],
      ['B-02-01', 'Pasillo B, estantería 2, nivel 1', '220']
    ],
    status: ['Existencias → Ubicaciones'],
    note: { es: 'Ubicaciones reales: el stock vive en coordenadas de almacén. El picking lee la ubicación.', en: 'Real bins: stock lives at warehouse coordinates. Picking reads the bin.' } },
  cfg: [ { es: 'Existencias > Definir > Ubicaciones: por almacén, con atributos (pickable, acceso).', en: 'Inventory > Define > Bin locations: per warehouse, with attributes (pickable, access).' } ],
  e2e: [
    { es: '1. Recibo en A-01-02: 80 unidades con ubicación exacta.', en: '1. Receipt into A-01-02: 80 units with exact bin.' },
    { es: '2. Lista de picking por pedido: B1 propone las ubicaciones pickables.', en: '2. Picking list per order: B1 proposes pickable bins.' },
    { es: '3. La entrega descuenta de la ubicación: el físico y el sistema cantan.', en: '3. Delivery deducts from the bin: physical and system sing.' }
  ],
  war: { q: { es: 'Los pickeadores tardan el triple en encontrar material.', en: 'Pickers take triple time finding material.' },
    sympt: [{ es: 'Stock correcto en cantidad, imposible de localizar físicamente.', en: 'Stock correct in quantity, impossible to locate physically.' }],
    root: [{ es: 'Sin ubicaciones, el stock es una cifra sin coordenadas.', en: 'Without bins, stock is a number without coordinates.' }],
    fix: [{ es: 'Implantar bins por pasillo/estantería/nivel + listas de picking por ubicación.', en: 'Implement bins by aisle/shelf/level + picking lists by bin.' }] },
  bp: [
    { es: 'Ubicaciones = coordenadas. Sin ellas, la eficiencia del almacén depende de la memoria del personal.', en: 'Bins = coordinates. Without them, warehouse efficiency depends on staff memory.' }
  ]
},
'SYN-SK-L3-04': {
  screen: { title: { es: 'Recuento de inventario', en: 'Inventory Counting' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Nº recuento', 'IC-2026-08', 'sys'], ['Almacén', '01', 'in'], ['Estado', 'Contado', 'sys']],
    cols: ['Artículo', 'En sistema', 'Contado', 'Δ'], numeric: [1, 2, 3], rows: [
      ['A00001', '120', '118', '-2'],
      ['A00002', '400', '400', '0'],
      ['A00003', '60', '63', '+3']
    ],
    status: ['Existencias → Recuento de inventario'],
    note: { es: 'Recuento real con diferencias: -2 y +3. Cada Δ genera su ajuste de stock valorizado.', en: 'Real count with differences: -2 and +3. Each Δ generates its valued stock adjustment.' } },
  cfg: [ { es: 'Existencias > Recuento de inventario: listas por almacén/grupo/artículo, congelación de stock durante el conteo.', en: 'Inventory counting: lists per warehouse/group/item, stock freeze during counting.' } ],
  e2e: [
    { es: '1. Genera lista de recuento del almacén 01, congela movimientos.', en: '1. Generate count list for warehouse 01, freeze movements.' },
    { es: '2. Conteo físico: 118/400/63 contra 120/400/60 del sistema.', en: '2. Physical count: 118/400/63 vs system 120/400/60.' },
    { es: '3. Diferencias: -2 (ajuste de salida valorizado a coste) y +3 (ajuste de entrada).', en: '3. Differences: -2 (valued outbound adjustment) and +3 (inbound adjustment).' }
  ],
  war: { q: { es: 'Mermas anuales de inventario del 4% sin explicación.', en: 'Annual inventory shrinkage of 4% unexplained.' },
    sympt: [{ es: 'Ajustes sistemáticos negativos en el mismo grupo de artículos.', en: 'Systematic negative adjustments in the same item group.' }],
    root: [{ es: 'Roturas sin registro + errores de picking sin control + (a veces) hurto interno.', en: 'Unrecorded breakage + uncontrolled picking errors + (sometimes) internal theft.' }],
    fix: [{ es: 'Recuentos cíclicos por ABC + análisis de causa de cada Δ > umbral.', en: 'Cycle counting by ABC + root-cause analysis of each Δ over threshold.' }] },
  bp: [
    { es: 'Recuentos cíclicos por ABC: lo A cada mes, lo C una vez al año.', en: 'Cycle counts by ABC: A monthly, C yearly.' },
    { es: 'Cada ajuste documentado con causa: sin causa, el ajuste es solo ruido contable.', en: 'Each adjustment documented with cause: no cause, the adjustment is just accounting noise.' }
  ]
},
'SYN-SK-L3-05': {
  screen: { title: { es: 'Lista de materiales (LDM)', en: 'Bill of Materials (BOM)' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Producto', 'KIT-LED-HOME', 'sys'], ['Tipo', 'Plantilla', 'in']],
    cols: ['Componente', 'Cant.', 'Coste unit.', 'Coste total'], numeric: [1, 2, 3], rows: [
      ['A00001 (Lámpara)', '2', '4,00', '8,00'],
      ['A00002 (Sensor)', '1', '9,00', '9,00'],
      ['A00004 (Cable)', '3 m', '0,80', '2,40']
    ],
    totals: [['Coste material kit', '19,40']],
    status: ['Producción → Listas de materiales'],
    note: { es: 'LDM tipo plantilla real: el kit se vende como conjunto y explota componentes al añadir al carrito del documento.', en: 'Real template BOM: the kit sells as a set and explodes components when added to a document.' } },
  cfg: [ { es: 'Producción > Listas de materiales: tipos plantilla (venta) y producción (fabricación).', en: 'Production > BOMs: template (sales) and production (manufacturing) types.' } ],
  e2e: [
    { es: '1. Kit vendido a 59,00 con coste de componentes 19,40 → margen 39,60 (67%).', en: '1. Kit sold at 59.00 with component cost 19.40 → margin 39.60 (67%).' },
    { es: '2. En el pedido, el kit explota: stock comprometido por componente.', en: '2. On the order, the kit explodes: stock committed per component.' },
    { es: '3. La entrega consume componentes, no el kit como artículo.', en: '3. Delivery consumes components, not the kit as an item.' }
  ],
  war: { q: { es: 'El kit se factura bien pero el stock de componentes se agota.', en: 'The kit invoices fine but component stock runs dry.' },
    sympt: [{ es: 'Quiebres de stock en componentes aunque el kit como tal "existe".', en: 'Component stock-outs although the kit as such "exists".' }],
    root: [{ es: 'LDM no considerada por MRP: la demanda del kit no explode en demanda de componentes.', en: 'BOM not considered by MRP: kit demand doesn\'t explode into component demand.' }],
    fix: [{ es: 'Planificar el kit como familia o planificar componentes directamente.', en: 'Plan the kit as a family or plan components directly.' }] },
  bp: [
    { es: 'Plantilla para vender conjuntos; producción para fabricar. Confundirlas rompe el stock.', en: 'Template for selling sets; production for manufacturing. Confusing them breaks stock.' }
  ]
},
'SYN-SK-L3-06': {
  screen: { title: { es: 'Orden de producción', en: 'Production Order' }, menu: false, tabs: ['General', 'Componentes', 'Operaciones'], activeTab: 1,
    header: [['Nº', 'WO-2026-041', 'sys'], ['Producto', 'KIT-LED-HOME', 'sys'], ['Cant.', '20', 'in'], ['Estado', 'Planificada', 'sys']],
    cols: ['Componente', 'Necesario', 'En stock', 'Falta'], numeric: [1, 2, 3], rows: [
      ['A00001', '40', '120', '0'],
      ['A00002', '20', '5', '15'],
      ['A00004', '60 m', '200 m', '0']
    ],
    status: ['Producción → Orden de producción'],
    note: { es: 'OP real: componentes necesarios vs disponibles. Falta 15 sensores → la orden no puede lanzarse sin compra previa.', en: 'Real production order: components needed vs available. 15 sensors short → order can\'t launch without prior purchase.' } },
  cfg: [ { es: 'Producción > Orden de producción: estados Planificada → Lanzada → En proceso → Completada.', en: 'Production order: Planned → Released → In process → Completed states.' } ],
  e2e: [
    { es: '1. OP de 20 kits: consume 40 lámparas + 20 sensores + 60m cable.', en: '1. Production order for 20 kits: consumes 40 lamps + 20 sensors + 60m cable.' },
    { es: '2. Emisión de componentes (issue): el stock de componentes baja.', en: '2. Component issue: component stock drops.' },
    { es: '3. Recepción desde OP: el stock de producto terminado sube. La diferencia valorada va a desviaciones de producción.', en: '3. Receipt from order: finished stock rises. Valued difference goes to production variances.' }
  ],
  war: { q: { es: 'Coste real de producción sistemáticamente 8% por encima del estándar.', en: 'Real production cost systematically 8% above standard.' },
    sympt: [{ es: 'La cuenta de desviaciones de producción acumula saldo mensual creciente.', en: 'The production variances account accumulates a growing monthly balance.' }],
    root: [{ es: 'LDM desactualizada: los costes estándar de componentes no reflejan compras recientes.', en: 'Outdated BOM: standard component costs don\'t reflect recent purchases.' }],
    fix: [{ es: 'Recalcular costes estándar de LDM trimestral + revisar mermas de proceso.', en: 'Recalculate BOM standard costs quarterly + review process scrap.' }] },
  bp: [
    { es: 'Desviaciones de producción = termómetro de tu LDM. Saldo creciente = estándares muertos.', en: 'Production variances = your BOM\'s thermometer. Growing balance = dead standards.' }
  ]
},
'SYN-SK-L3-07': {
  screen: { title: { es: 'MRP – Resultado del run', en: 'MRP – Run Result' }, menu: false, tabs: ['Recomendaciones'], activeTab: 0,
    header: [['Escenario', 'Principal', 'sys'], ['Horizonte', '28 días', 'in'], ['Fecha', '24.08.26', 'sys']],
    cols: ['Artículo', 'Faltante', 'Acción', 'Cant. propuesta'], numeric: [1, 3], rows: [
      ['A00002 (Sensor)', '15', 'Pedido de compra', '20'],
      ['A00001 (Lámpara)', '0', '—', '—'],
      ['KIT (ensamblar)', '5', 'Orden de producción', '5']
    ],
    status: ['MRP → Ejecutar MRP'],
    note: { es: 'Resultado real de MRP: propone compra de sensores (redondeada a múltiplos 20) y producción de 5 kits. Nada para lámparas.', en: 'Real MRP result: proposes sensor purchase (rounded to multiples of 20) and 5-kit production. Nothing for lamps.' } },
  cfg: [
    { es: 'MRP: fuente de demanda (pedidos, previsiones, pedidos de venta), horizonte, escenario.', en: 'MRP: demand source (orders, forecasts, sales orders), horizon, scenario.' },
    { es: 'Múltiplos y mínimos por artículo redondean las propuestas a cantidades comerciales.', en: 'Per-item multiples and minimums round proposals to commercial quantities.' }
  ],
  e2e: [
    { es: '1. Run MRP horizonte 28 días: detecta faltante de 15 sensores para la semana 3.', en: '1. MRP run horizon 28 days: detects 15-sensor shortage for week 3.' },
    { es: '2. Propone pedido de 20 (mínimo comercial) → pedido a proveedor con 1 clic.', en: '2. Proposes order of 20 (commercial min) → vendor order in 1 click.' },
    { es: '3. Los pedidos generados pasan al flujo de aprobaciones si el perfil lo exige.', en: '3. Generated orders go to the approval flow if the profile requires it.' }
  ],
  war: { q: { es: 'MRP corre pero nadie convierte recomendaciones en pedidos.', en: 'MRP runs but nobody converts recommendations into orders.' },
    sympt: [{ es: 'Faltantes recurrentes aunque MRP "funciona".', en: 'Recurrent shortages although MRP "works".' }],
    root: [{ es: 'MRP sin dueño: corre, imprime y nadie ejecuta sus propuestas.', en: 'Ownerless MRP: runs, prints, nobody executes its proposals.' }],
    fix: [{ es: 'Dueño del proceso MRP + revisión diaria de 15 min de recomendaciones.', en: 'MRP process owner + daily 15-min recommendation review.' }] },
  bp: [
    { es: 'MRP no planifica: propone. La decisión sigue siendo humana.', en: 'MRP doesn\'t plan: it proposes. The decision remains human.' }
  ]
},
'SYN-SK-L3-08': {
  screen: { title: { es: 'Contrato de servicio', en: 'Service Contract' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Nº', 'SC-2026-014', 'sys'], ['Cliente', 'C20000', 'sys'], ['Inicio', '01.01.26', 'in'], ['Fin', '31.12.26', 'in']],
    cols: ['Línea', 'Tipo', 'Cant.', 'Precio/año'], numeric: [2, 3], rows: [
      ['1', 'Mantenimiento preventivo', '4 visitas', '1.200,00'],
      ['2', 'Soporte remoto', 'Horas ilimitadas', '800,00']
    ],
    totals: [['Contrato anual', '2.000,00']],
    status: ['Servicio → Contratos'],
    note: { es: 'Contrato de servicio real: periodicidad, cobertura y renovación. Genera llamadas de servicio automáticas.', en: 'Real service contract: periodicity, coverage and renewal. Generates automatic service calls.' } },
  cfg: [ { es: 'Servicio > Contratos de servicio: plantillas, renovación automática, facturación periódica.', en: 'Service > Service contracts: templates, auto-renewal, periodic invoicing.' } ],
  e2e: [
    { es: '1. Contrato anual 2.000 €: 4 visitas preventivas + soporte.', en: '1. Annual contract 2,000 €: 4 preventive visits + support.' },
    { es: '2. Llamadas de servicio automáticas por calendario de visitas.', en: '2. Automatic service calls per visit calendar.' },
    { es: '3. Facturación periódica mensual (166,67) o anual (2.000).', en: '3. Periodic invoicing monthly (166.67) or annual (2,000).' }
  ],
  war: { q: { es: 'Contratos vencidos que siguen prestando servicio gratis.', en: 'Expired contracts still providing free service.' },
    sympt: [{ es: 'Llamadas de servicio atendidas sobre contratos con fecha fin pasada.', en: 'Service calls attended on contracts past their end date.' }],
    root: [{ es: 'Sin alerta de renovación, el vencimiento pasa desapercibido.', en: 'Without a renewal alert, expiry goes unnoticed.' }],
    fix: [{ es: 'Alerta automática 30 días antes del fin + informe de contratos por vencer.', en: 'Automatic alert 30 days before end + expiring-contracts report.' }] },
  bp: [
    { es: 'El contrato de servicio es ingreso recurrente: la renovación es el KPI, no la venta inicial.', en: 'The service contract is recurring revenue: renewal is the KPI, not the initial sale.' }
  ]
},
'SYN-SK-L4-01': {
  screen: { title: { es: 'Asiento contable (JE)', en: 'Journal Entry (JE)' }, menu: false, tabs: ['Contenido'], activeTab: 0,
    header: [['Nº asiento', '842', 'sys'], ['Fecha contable', '23.08.26', 'in'], ['Referencia', 'Ajuste provisión agosto', 'in']],
    cols: ['Nº', 'Cuenta', 'Débito', 'Crédito'], numeric: [2, 3], rows: [
      ['1', '490000 Provisión garantías', '2.500,00', ''],
      ['2', '219000 Proveedores servicios', '', '2.500,00']
    ],
    totals: [['Total asiento', '2.500,00']],
    status: ['Finanzas → Asiento'],
    note: { es: 'Asiento real de provisión: D gasto 2.500 / H provisión 2.500. Cuadra al céntimo — invariant del sistema.', en: 'Real provision journal: D expense 2,500 / H provision 2,500. Balances to the cent — a system invariant.' } },
  cfg: [
    { es: 'Finanzas > Asiento: asientos manuales. Origin = manual; los automáticos nacen de documentos.', en: 'Finance > Journal Entry: manual journals. Origin = manual; automatics are born from documents.' },
    { es: 'Asientos recurrentes: plantillas mensuales (alquileres, amortizaciones) generadas por lote.', en: 'Recurring journals: monthly templates (rent, depreciation) batch-generated.' }
  ],
  e2e: [
    { es: '1. Provisión de garantías: D 490000 2.500 / H 219000 2.500.', en: '1. Warranty provision: D 490000 2,500 / H 219000 2,500.' },
    { es: '2. Contrapartida automática del documento origen si fuera automático.', en: '2. Automatic counterposting from source document if automatic.' },
    { es: '3. Reversión en el periodo siguiente cuando llegue la factura real.', en: '3. Reversal next period when the real invoice arrives.' }
  ],
  war: { q: { es: 'Asientos de ajuste que contabilidad no reconoce en el cierre.', en: 'Adjustment journals accounting doesn\'t recognize at close.' },
    sympt: [{ es: 'Asientos manuales con Origin=manual sin referencia ni documento.', en: 'Manual journals with Origin=manual without reference or document.' }],
    root: [{ es: 'Campo Referencia libre y no obligatorio: asientos anónimos imposibles de auditar.', en: 'Free, optional Reference field: anonymous journals impossible to audit.' }],
    fix: [{ es: 'Norma: todo asiento manual con referencia descriptiva + validación (TransactionNotification) que la exija.', en: 'Standard: every manual journal with descriptive reference + validation enforcing it.' }] },
  bp: [
    { es: 'Todo asiento manual lleva referencia explicativa. Sin ella, es un asiento fantasma.', en: 'Every manual journal carries an explanatory reference. Without it, it\'s a ghost entry.' },
    { es: 'Asientos automáticos se corrigen en el documento, no con asientos manuales.', en: 'Automatic journals are fixed at the document, not with manual entries.' }
  ]
},
'SYN-SK-L4-02': {
  screen: { title: { es: 'Cuentas asociadas', en: 'Linked Accounts' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Nivel', 'Socios de negocio', 'sys']],
    cols: ['Concepto', 'Cuenta'], rows: [
      ['Clientes (A/R)', '120000 Deudores'],
      ['Proveedores (A/P)', '160000 Acreedores'],
      ['Descuento pronto pago', '473000 Skonti'],
      ['Diferencias de cambio', '465000 Währungsdiff']
    ],
    status: ['Administración → Financias → Cuentas asociadas'],
    note: { es: 'Cuentas asociadas reales del nivel socio: control accounts que agregan todos los clientes/proveedores.', en: 'Real partner-level linked accounts: control accounts aggregating all customers/vendors.' } },
  cfg: [
    { es: 'Administración > Finanzas > Cuentas asociadas: por socio, grupo, artículo, almacén, etapa de proceso.', en: 'Administration > Finance > G/L Account Determination > Linked accounts: per partner, group, item, warehouse, process stage.' },
    { es: 'Las cuentas de control A/R y A/P son únicas: todos los clientes caen en la misma cuenta con desglose interno por socio.', en: 'A/R and A/P control accounts are single: all customers fall in the same account with internal per-partner breakdown.' }
  ],
  e2e: [
    { es: '1. Factura a C20000: D 120000 (Deudores) — el desglose por socio es interno (OINV/OCR D).', en: '1. Invoice to C20000: D 120000 (Debtors) — per-partner breakdown is internal (OINV/OCR D).' },
    { es: '2. Saldo de C20000 = suma de sus documentos, no una cuenta propia.', en: '2. C20000\'s balance = sum of its documents, not a separate account.' },
    { es: '3. El plan de cuentas queda compacto; el detalle vive en los sublibros.', en: '3. The chart stays compact; detail lives in subledgers.' }
  ],
  war: { q: { es: 'El auditor pide el desglose del saldo de Deudores por cliente.', en: 'The auditor asks for the Debtors balance broken down by customer.' },
    sympt: [{ es: 'Saldo 120000 no cuadra con la suma de saldos de clientes del informe aging.', en: 'Account 120000 balance doesn\'t match the sum of customer balances in aging.' }],
    root: [{ es: 'Asientos manuales directos a la cuenta de control en vez de por documento: rompen la igualdad sublibro=libro.', en: 'Manual journals directly to the control account instead of via document: break subledger=ledger equality.' }],
    fix: [{ es: 'Prohibir asientos manuales directos a cuentas de control + conciliación mensual sublibro vs libro.', en: 'Ban manual journals directly to control accounts + monthly subledger-vs-ledger reconciliation.' }] },
  bp: [
    { es: 'Cuentas de control = territorio de documentos. Asientos manuales directos: prohibidos.', en: 'Control accounts = document territory. Direct manual journals: banned.' }
  ]
},
'SYN-SK-L4-03': {
  screen: { title: { es: 'Determinación de cuentas – venta', en: 'Account determination – sales' }, menu: false, tabs: ['Venta'], activeTab: 0,
    header: [['Orden', 'Grupo de artículos', 'sys']],
    cols: ['Grupo artículo', 'Ingresos', 'Coste ventas', 'Stock'], rows: [
      ['Electrónica', '400010', '640010', '140010'],
      ['Materiales', '400020', '640020', '140020']
    ],
    status: ['Administración → Determinación de cuentas'],
    note: { es: 'La misma matriz que viste en L1-06, ahora con perspectiva contable: cada operación busca SU cuenta por grupo.', en: 'The matrix from L1-06, now with accounting perspective: each operation finds ITS account by group.' } },
  cfg: [ { es: 'La determinación sigue el orden: artículo > grupo > almacén. La primera coincidencia gana.', en: 'Determination order: item > group > warehouse. First match wins.' } ],
  e2e: [
    { es: '1. Venta de A00001 (Electrónica): H 400010 / D 640010 (coste) / D Cliente.', en: '1. Sale of A00001 (Electronics): H 400010 / D 640010 (cost) / D Customer.' },
    { es: '2. El coste sale a valoración del artículo (media móvil o FIFO según grupo).', en: '2. Cost exits at item valuation (moving avg or FIFO per group).' },
    { es: '3. Auditoría completa: OINV→INV1→OITM→grupo→cuenta. Reconstruible al 100%.', en: '3. Full audit: OINV→INV1→OITM→group→account. 100% reconstructible.' }
  ],
  war: { q: { es: 'Ventas de un grupo contabilizadas en cuentas de otro.', en: 'One group\'s sales posted to another\'s accounts.' },
    sympt: [{ es: 'Cuentas de ingresos con mezcla de grupos: análisis por línea de negocio imposible.', en: 'Revenue accounts with mixed groups: line-of-business analysis impossible.' }],
    root: [{ es: 'Matriz de determinación con errores puntuales (cuenta copiada de la fila anterior).', en: 'Determination matrix with spot errors (account copied from the row above).' }],
    fix: [{ es: 'Revisión semestral de la matriz + query de control OINV vs cuenta esperada por grupo.', en: 'Semi-annual matrix review + control query OINV vs expected account per group.' }] },
  bp: [
    { es: 'La matriz grupo×operación es la constitución contable de B1: revísala como tal.', en: 'The group×operation matrix is B1\'s accounting constitution: review it as such.' }
  ]
},
'SYN-SK-L4-04': {
  screen: { title: { es: 'Periodos contables', en: 'Fiscal Periods' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Ejercicio', '2026', 'sys'], ['Periodo', '08 Agosto', 'sys']],
    cols: ['Periodo', 'Desde', 'Hasta', 'Estado'], rows: [
      ['07 Julio', '01.07.26', '31.07.26', 'Cerrado'],
      ['08 Agosto', '01.08.26', '31.08.26', 'Desbloqueado'],
      ['09 Septiembre', '01.09.26', '30.09.26', 'No publicado']
    ],
    status: ['Administración → Utilidades → Periodos'],
    note: { es: 'Estados reales de periodo: No publicado → Desbloqueado (solo lectura→apertura) → Cerrado. Julio cerrado bloquea su fecha contable.', en: 'Real period states: Unpublished → Unlocked → Closed. Closed July blocks its posting dates.' } },
  cfg: [
    { es: 'Administración > Utilidades > Periodos: ciclo No publicado → Desbloqueado → Cerrado.', en: 'Administration > Utilities > Periods: Unpublished → Unlocked → Closed cycle.' },
    { es: 'Cerrado = inmodificable salvo reapertura documentada.', en: 'Closed = unmodifiable except documented reopening.' }
  ],
  e2e: [
    { es: '1. Cierre de julio: periodo a Cerrado. Asientos con fecha contable julio rechazados.', en: '1. July close: period to Closed. July posting-date journals rejected.' },
    { es: '2. Agosto desbloqueado para operación normal.', en: '2. August unlocked for normal operation.' },
    {  es: '3. Reapertura excepcional: requiere aprobación y deja rastro (change log).', en: '3. Exceptional reopening: requires approval and leaves a trace (change log).' }
  ],
  war: { q: { es: 'Cierre anual: aparece un asiento de diciembre que nadie reconoce.', en: 'Year close: a December journal appears nobody recognizes.' },
    sympt: [{ es: 'Asiento diciembre con fecha contable dentro del periodo cerrado tras reapertura no documentada.', en: 'December journal with posting date inside the closed period after undocumented reopening.' }],
    root: [{ es: 'Reapertura de periodo sin control para "arreglar" algo, sin cerrar de nuevo.', en: 'Uncontrolled period reopening to "fix" something, never re-closed.' }],
    fix: [{ es: 'Cierre de nuevo + auditoría de reaperturas (change log) + norma de reapertura firmada.', en: 'Re-close + reopening audit (change log) + signed reopening standard.' }] },
  bp: [
    { es: 'Un periodo cerrado es historia: reabrirlo es cirugía con anestesia general (aprobación + rastro).', en: 'A closed period is history: reopening is surgery (approval + trail).' }
  ]
},
'SYN-SK-L4-05': {
  screen: { title: { es: 'Conciliación interna', en: 'Internal Reconciliation' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Cuenta', '120000 Deudores', 'sys'], ['Socio', 'C20000', 'in']],
    cols: ['Documento', 'Tipo', 'Importe', 'Estado'], numeric: [2], rows: [
      ['1001-2026', 'Factura', '+856,80', 'Abierta'],
      ['2301', 'Cobro', '-856,80', 'Abierta'],
      ['1002-2026', 'Factura', '+1.425,00', 'Abierta']
    ],
    totals: [['Neto sin conciliar', '1.425,00']],
    status: ['Finanzas → Conciliación interna'],
    note: { es: 'Conciliación real: factura 856,80 y cobro 856,80 se emparejan y cierran juntas. La 1002 sigue abierta.', en: 'Real reconciliation: invoice 856.80 and payment 856.80 pair and close together. 1002 stays open.' } },
  cfg: [ { es: 'Finanzas > Conciliación interna: empareja facturas y cobros/pagos dentro de la cuenta del socio.', en: 'Finance > Internal reconciliation: pairs invoices and payments within the partner account.' } ],
  e2e: [
    { es: '1. Selecciona factura 1001 + cobro 2301 → conciliar: ambas pasan a cerradas.', en: '1. Select invoice 1001 + payment 2301 → reconcile: both become closed.' },
    { es: '2. El saldo del socio baja 856,80 y el aging se limpia.', en: '2. Partner balance drops 856.80 and aging cleans up.' },
    { es: '3. Factura 1002 permanece abierta hasta su cobro.', en: '3. Invoice 1002 remains open until its payment.' }
  ],
  war: { q: { es: 'Aging vencido aunque el cliente ya pagó (transferencia recibida).', en: 'Overdue aging although the client already paid (transfer received).' },
    sympt: [{ es: 'Cobro a cuenta sin asignar + facturas vencidas por conciliar.', en: 'On-account payment unassigned + overdue invoices unreconciled.' }],
    root: [{ es: 'Cobros entrantes a cuenta (sin factura) sin conciliar contra facturas.', en: 'Incoming on-account payments (no invoice) not reconciled against invoices.' }],
    fix: [{ es: 'Proceso diario de conciliación: asignar cobros a cuenta → facturas concretas.', en: 'Daily reconciliation process: assign on-account payments → specific invoices.' }] },
  bp: [
    { es: 'El aging mide lo no conciliado: descuidar la conciliación distorsiona la cobranza.', en: 'Aging measures the unreconciled: neglecting reconciliation distorts collections.' }
  ]
},
'SYN-SK-L4-06': {
  screen: { title: { es: 'Procesos bancarios', en: 'Banking' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Cuenta', '572000 Banco XY', 'sys'], ['Fichero', 'MT940_0823.txt', 'in']],
    cols: ['Línea extracto', 'Importe', 'Match', 'Estado'], numeric: [1], rows: [
      ['Transferencia entrante', '+856,80', 'Cobro 2301', 'Conciliada'],
      ['Comisión bancaria', '-12,50', '—', 'Pendiente'],
      ['Transferencia saliente', '-571,20', 'Pago 1801', 'Conciliada']
    ],
    status: ['Bancos → Conciliación bancaria'],
    note: { es: 'Conciliación bancaria real: extracto MT940 importado, líneas emparejadas contra cobros/pagos. La comisión queda pendiente de contabilizar.', en: 'Real bank reconciliation: MT940 statement imported, lines matched to payments. The fee remains to be posted.' } },
  cfg: [ { es: 'Bancos > Conciliación: importación de extractos (MT940, formato electrónico), matching automático + manual.', en: 'Banks > Reconciliation: statement import (MT940), auto + manual matching.' } ],
  e2e: [
    { es: '1. Importa MT940 de agosto: 47 líneas.', en: '1. Import August MT940: 47 lines.' },
    { es: '2. Matching automático: 39 conciliadas (transferencias contra cobros/pagos).', en: '2. Auto-matching: 39 reconciled (transfers vs payments).' },
    { es: '3. Resto manual: comisiones −12,50 (asiento de gasto) e intereses +4,20.', en: '3. Manual rest: fees −12.50 (expense journal) and interest +4.20.' }
  ],
  war: { q: { es: 'Saldo banco en B1 ≠ saldo del extracto real.', en: 'B1 bank balance ≠ real statement balance.' },
    sympt: [{ es: 'Diferencia persistente de 24,70 € entre libro y extracto.', en: 'Persistent 24.70 € difference between book and statement.' }],
    root: [{ es: 'Comisiones e intereses del banco nunca contabilizadas en B1.', en: 'Bank fees and interest never posted in B1.' }],
    fix: [{ es: 'Conciliación mensual del extracto completo + asientos automáticos de comisiones/intereses.', en: 'Monthly full-statement reconciliation + automatic fee/interest journals.' }] },
  bp: [
    { es: 'El banco tiene la verdad del dinero; B1 la del derecho. La conciliación es el puente diario.', en: 'The bank has the money truth; B1 the right truth. Reconciliation is the daily bridge.' }
  ]
},
'SYN-SK-L4-07': {
  screen: { title: { es: 'Activos fijos', en: 'Fixed Assets' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Activo', 'FA-2026-011', 'sys'], ['Descripción', 'Carretilla elevadora', 'in'], ['Coste', '18.000,00', 'sys']],
    cols: ['Año', 'Coste inicio', 'Amortización', 'Valor neto'], numeric: [1, 2, 3], rows: [
      ['2026', '18.000,00', '4.500,00', '13.500,00'],
      ['2027', '13.500,00', '4.500,00', '9.000,00'],
      ['2028', '9.000,00', '4.500,00', '4.500,00']
    ],
    totals: [['Vida útil', '4 años lineal']],
    status: ['Activos fijos → Maestro'],
    note: { es: 'Amortización lineal real: 18.000/4 = 4.500/año. El asiento: D gasto amortización / H acumulada.', en: 'Real straight-line depreciation: 18,000/4 = 4,500/yr. Journal: D depreciation expense / H accumulated.' } },
  cfg: [ { es: 'Activos fijos: maestro con tabla de amortización, método (lineal, degresivo), vida útil.', en: 'Fixed assets: master with depreciation table, method (straight-line, declining), useful life.' } ],
  e2e: [
    { es: '1. Alta del activo 18.000 con vida útil 4 años lineal.', en: '1. Asset creation 18,000 with 4-year straight-line life.' },
    { asiento: true, es: '2. Amortización anual: D 660000 Gasto amortización 4.500 / H 152000 Amortización acumulada 4.500.', en: '2. Annual depreciation: D 660000 Depreciation expense 4,500 / H 152000 Accumulated depreciation 4,500.' },
    { es: '3. Baja al final: retirar con contra cuenta y posible pérdida/ganancia.', en: '3. Disposal at end: retire with counter account and possible loss/gain.' }
  ],
  war: { q: { es: 'Amortizaciones duplicadas en el cierre (dos runs el mismo mes).', en: 'Duplicated depreciation at close (two runs the same month).' },
    sympt: [{ es: 'Gasto de amortización del mes doble respecto al plan.', en: 'Month\'s depreciation expense double the plan.' }],
    root: [{ es: 'El run de amortización se ejecutó dos veces sin control de unicidad.', en: 'The depreciation run executed twice without uniqueness control.' }],
    fix: [{ es: 'Run de amortización con periodo bloqueado tras ejecución + control de duplicados.', en: 'Depreciation run with period lock after execution + duplicate control.' }] },
  bp: [
    { es: 'Amortizar es un proceso mensual fechado, no un asiento libre: usa el run, no asientos manuales.', en: 'Depreciation is a dated monthly process, not a free journal: use the run, not manual entries.' }
  ]
},
'SYN-SK-L4-08': {
  screen: { title: { es: 'Contabilidad de costes', en: 'Cost Accounting' }, menu: false, tabs: ['General'], activeTab: 0,
    header: [['Dimensión', 'Proyecto', 'in'], ['Centro', 'PROJ-ALPHA', 'in']],
    cols: ['Concepto', 'Importe', 'Dimensión'], numeric: [1], rows: [
      ['Ingresos proyecto', '120.000,00', 'PROJ-ALPHA'],
      ['Costes directos', '-48.000,00', 'PROJ-ALPHA'],
      ['Overheads asignados', '-22.000,00', 'PROJ-ALPHA']
    ],
    totals: [['Margen proyecto', '50.000,00']],
    status: ['Finanzas → Contabilidad de costes'],
    note: { es: 'Costing real por dimensión: el margen del proyecto emerge de los documentos dimensionados, no de hojas de cálculo.', en: 'Real costing by dimension: project margin emerges from dimensioned documents, not spreadsheets.' } },
  cfg: [ { es: 'Contabilidad de costes: dimensiones (centro de coste, proyecto, línea de negocio) en documentos y asientos.', en: 'Cost accounting: dimensions (cost center, project, business line) on documents and journals.' } ],
  e2e: [
    { es: '1. Todas las facturas y entregas del proyecto llevan dimensión PROJ-ALPHA.', en: '1. All project invoices and deliveries carry PROJ-ALPHA dimension.' },
    { es: '2. Informe de margen por dimensión: 120.000 − 48.000 − 22.000 = 50.000 (41,7%).', en: '2. Margin report by dimension: 120,000 − 48,000 − 22,000 = 50,000 (41.7%).' },
    { es: '3. Overheads repartidos por regla (p. ej. % de ingresos directos).', en: '3. Overheads allocated by rule (e.g. % of direct revenue).' }
  ],
  war: { q: { es: 'Dos proyectos con márgenes informados incompatibles con la contabilidad.', en: 'Two projects with margins incompatible with accounting.' },
    sympt: [{ es: 'Suma de márgenes por proyecto ≠ margen total del P&L.', en: 'Sum of per-project margins ≠ total P&L margin.' }],
    root: [{ es: 'Documentos sin dimensión: ingresos/costes "huérfanos" que no caen en ningún proyecto.', en: 'Undimensioned documents: "orphan" revenue/costs falling in no project.' }],
    fix: [{ es: 'Regla de dimensión obligatoria en documentos + informe de huérfanos por dimensión.', en: 'Mandatory dimension rule on documents + orphan-by-dimension report.' }] },
  bp: [
    { es: 'Sin dimensión no hay cost accounting: la dimensión es parte del documento, no un extra.', en: 'No dimension, no cost accounting: the dimension is part of the document, not an extra.' }
  ]
}
};
