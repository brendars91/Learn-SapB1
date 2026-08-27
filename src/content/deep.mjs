// Anclas, rutas y ejemplos trabajados para L0-L8.
// Cada entrada: [id, glyph, anchor es, anchor en, path, ejemplo {q, show, a-es, a-en}]
//
// Reasignación 2026-08-27: los ids de este archivo estaban sistemáticamente
// desalineados con el contenido real de cada skill (auditoría con documentación
// oficial SAP B1 + comparación directa contra src/content/l*.mjs). Cada entrada
// se movió a la skill cuyo título y concepto coincide con su ancla/ejemplo.
// Los duplicados exactos se descartaron. El contenido sin skill correspondiente
// (huérfano) y las skills sin ninguna ancla (huecos) se tratan en una fase
// separada — ver memoria del proyecto para el inventario completo.
export const DEEP = {
  'SYN-SK-L0-04': ['⛓️', 'La cadena documental es el árbol genealógico de la operación: cada documento tiene padres e hijos rastreables.', 'The document chain is the operation\'s family tree: every document has traceable parents and children.', 'Documento › Ruta del documento › Navegar', {
    q: 'Pago SYN-INV-2... cliente pregunta por su pedido origen. ¿Camino?',
    show: ['Pago → Factura (aplicación)', 'Factura → Entrega (destino)', 'Entrega → Pedido (base)'],
    a: 'Pago→Factura→Entrega→Pedido: el árbol genealógico se recorre hacia arriba con la ruta del documento.'
  }],
  'SYN-SK-L0-05': ['🧯', 'El borrador es una intención en la antesala: existe, pero aún no es acto contable.', 'The draft is an intention in the waiting room: it exists, but is not yet an accounting act.', 'Documento › Guardar como borrador › Lista', {
    q: 'Borrador de factura 500,00 durante 3 semanas. ¿Qué ve el aging?',
    show: ['Aging: 0,00', 'Libro mayor: sin asiento', 'Stock: sin movimiento'],
    a: 'Nada: el borrador no contabiliza ni mueve stock — es promesa congelada hasta que se aprueba.'
  }],
  'SYN-SK-L0-06': ['📆', 'Las tres fechas del documento son un trío de bailarines: contabilización lleva, vencimiento sigue, entrega acompaña.', 'The document\'s three dates are a dance trio: posting leads, due follows, delivery accompanies.', 'Documento › Cabecera › Fechas', {
    q: 'Factura 1-jul, condiciones 30 días, entrega pactada 20-jul. ¿Vencimiento?',
    show: ['Contabilización: 1-jul', 'Vencimiento: 31-jul (1+30)', 'Entrega: 20-jul'],
    a: '31 de julio: el vencimiento nace de fecha de contabilización + condiciones, no de la entrega.'
  }],
  'SYN-SK-L1-02': ['🚚', 'La entrega es el momento en que el libro sale de la estantería: el sistema por fin toca el físico.', 'The delivery is the moment the book leaves the shelf: the system finally touches the physical stock.', 'Logística › Entrega › Crear desde pedido', {
    q: 'Entrega de 30 uds a 4,00 (FIFO). ¿Asiento y stock?',
    show: ['Stock: −30 físicas', 'CMV: 30 × 4,00 = 120,00 al Debe', 'Stock en tránsito/almacén: 120,00 al Haber'],
    a: 'Stock baja 30; asiento CMV 120 contra stock 120. La renta llega con la factura, no con la caja que sale.'
  }],
  'SYN-SK-L1-06': ['🏛️', 'El IVA es el fideo del restaurante: tú cobras de más para Hacienda, no para ti.', 'VAT is the restaurant\'s tip: you collect extra for the tax authority, not for yourself.', 'Finanzas › Declaración IVA › Generar', {
    q: 'Ventas 10.000 + IVA 21%: ¿soporte vs repercutido si compras 4.000 + IVA?',
    show: ['Repercutido: 2.100', 'Soportado: 840', 'A pagar: 1.260'],
    a: '1.260: eres recaudador, no contribuyente — el IVA nunca pasa por tu cuenta de resultados.'
  }],
  'SYN-SK-L2-01': ['📐', 'Un pedido de ventas es un contrato de reserva en la biblioteca: nadie ha cogido el libro, pero ya no está "disponible" para otros.', 'A sales order is a library hold: nobody has taken the book, but it is no longer "available" to others.', 'Ventas › Pedido de cliente › Crear', {
    q: 'Stock físico 120, pedidos abiertos 80. ¿Qué puede prometer el comercial hoy?',
    show: ['Físico: 120', 'Committed: −80', 'Disponible: 40'],
    a: '40. La promesa comercial vive en el disponible, no en el físico — así se evita vender dos veces el mismo libro.'
  }],
  'SYN-SK-L2-02': ['📉', 'La factura de proveedor con precio distinto al pedido es un pulso entre dos verdades: la acordada y la facturada.', 'A vendor invoice differing from the PO is a tension between two truths: agreed vs invoiced.', 'Compras › Factura proveedor › Crear desde pedido', {
    q: 'Pedido 100 × 4,20; factura llega 100 × 4,50. ¿Bloquear?',
    show: ['Desviación: 0,30/ud → 30,00 total', '3-vías: pedido vs recepción vs factura'],
    a: 'Sí: la desviación 30,00 exige resolución documentada (abono, crédito o aceptación firmada) antes de contabilizar.'
  }],
  'SYN-SK-L2-04': ['🔁', 'La devolución es el espejo: cada documento de retorno refleja su original con signo invertido.', 'A return is the mirror: each return document reflects its original with inverted sign.', 'Ventas › Devolución › Crear desde factura', {
    q: 'Devolución de 10 uds de la venta de 60 a 6,00. ¿Efecto en ventas y stock?',
    show: ['Ventas: 60,00 (Debe)', 'IVA repercutido: 12,60 (Debe)', 'Stock: +10 físicas', 'CMV: 40,00 (Haber, a coste original)'],
    a: 'Se abona venta 60 + IVA; el stock vuelve al coste ORIGINAL de la capa FIFO, no al precio de venta.'
  }],
  'SYN-SK-L2-05': ['💳', 'El pago es la parte final del cupón: cierra el círculo entre la deuda y su liquidación.', 'Payment is the final stub of the voucher: closes the circle between the debt and its settlement.', 'Bancos › Recibo cobro › Medios internos', {
    q: 'Recibo 435,60 sobre factura 435,60. ¿Estado?',
    show: ['Banco (Debe): 435,60', 'Cliente (Haber): 435,60', 'Factura: cerrada'],
    a: 'Banco 435,60 D / Cliente 435,60 H; la factura queda cerrada y el saldo del socio vuelve a cero.'
  }],
  'SYN-SK-L2-07': ['📦', 'El almacén es la habitación de la casa: mover stock entre ellas no es comprar ni vender.', 'A warehouse is a room in the house: moving stock between them is neither buying nor selling.', 'Logística › Traslado de stock › Crear', {
    q: 'Traslado de 50 uds entre almacén A y B. ¿Asiento contable?',
    show: ['Stock A: −50', 'Stock B: +50', 'Asiento: ninguno'],
    a: 'Ninguno: el valor total no cambia, solo su ubicación. (Excepción: tránsito si los almacenes son legales distintos.)'
  }],
  'SYN-SK-L2-08': ['🎯', 'El precio de un artículo es un acuerdo social con versiones: lista 1 no es lista 2.', 'An item\'s price is a versioned social agreement: list 1 is not list 2.', 'Maestros › Listas de precios › Mantener', {
    q: 'Coste 4,00; lista minorista 6,00 (+50%); cliente VIP −10% sobre lista. ¿Precio VIP?',
    show: ['Lista: 6,00', 'Descuento VIP: −0,60', 'Precio final: 5,40'],
    a: '5,40: los descuentos se aplican sobre la lista, no sobre el coste. Margen VIP: (5,40−4,00)/5,40 = 25,9%.'
  }],
  'SYN-SK-L3-01': ['🧪', 'El lote es la fecha de nacimiento del producto: todo lo que comparte origen comparte destino.', 'A batch is the product\'s birthday: everything sharing origin shares destiny.', 'Maestros › Artículo › Lotes', {
    q: 'Lote A caduca 30-dic, lote B 15-ene. ¿Cuál sale primero (FEFO)?',
    show: ['Lote A: 30-dic (antes)', 'Lote B: 15-ene'],
    a: 'Lote A: FEFO ordena por caducidad, no por entrada. FIFO es para coste; FEFO para vida.'
  }],
  'SYN-SK-L3-02': ['🔢', 'El número de serie es el DNI del activo: uno, único, con expediente.', 'The serial number is the asset\'s ID card: one, unique, with a file.', 'Maestros › Artículo › Números de serie', {
    q: 'Devuelven 1 equipo de 5 vendidos. ¿Cómo identificas el exacto?',
    show: ['Venta: S/N SYN-0007..0011', 'Devuelto: cliente cita S/N SYN-0009'],
    a: 'Por S/N SYN-0009: el serial recupera coste, garantía e historial exactos de esa unidad.'
  }],
  'SYN-SK-L3-04': ['⚖️', 'La conciliación de stock es la báscula del auditor: físico real vs libro, y la diferencia tiene dueño.', 'Stock reconciliation is the auditor\'s scale: real physical vs book, and the difference has an owner.', 'Logística › Recuento de stock › Conciliar', {
    q: 'Libro 1.000, recuento 988. Diferencia 12 uds a 4,00. ¿Asiento de ajuste?',
    show: ['Físico: −12', 'Pérdida de inventario (Debe): 48,00', 'Stock (Haber): 48,00'],
    a: 'Debe pérdida 48 / Haber stock 48. La diferencia no se maquilla: se contabiliza y se investiga.'
  }],
  'SYN-SK-L3-05': ['🏗️', 'La LDM es la receta de cocina: ingredientes, cantidades y mermas para una porción.', 'The BOM is the kitchen recipe: ingredients, quantities and scrap for one portion.', 'Producción › LDM › Definir', {
    q: 'LDM: 2 kg harina + 1 l agua → 1 pan? Merma 5%. ¿Coste unitario con harina 0,80/kg?',
    show: ['Harina: 2 × 0,80 = 1,60', 'Agua: 0,05', 'Merma 5%: ×1,05', 'Coste: ≈1,73'],
    a: '≈1,73: la merma multiplica el coste teórico — ignorarla es subcostear sistemáticamente.'
  }],
  'SYN-SK-L3-06': ['🏭', 'La orden de producción es la cocina en marcha: receta + turno + consumo real.', 'The production order is the kitchen in action: recipe + shift + real consumption.', 'Producción › Orden › Liberar', {
    q: 'Orden 100 panes; consumo real 210 kg (std 200). ¿Desviación?',
    show: ['Std: 200 kg', 'Real: 210 kg', 'Desviación: 10 kg × 0,80 = 8,00'],
    a: '8,00 desfavorable: se contabiliza como desviación de consumo — la receta y la cocina discrepan.'
  }],
  'SYN-SK-L3-07': ['🧭', 'MRP es el navegador del abastecimiento: recalcula la ruta cada vez que la demanda cambia.', 'MRP is the supply navigator: it recalculates the route every time demand changes.', 'MRP › Ejecutar escenarios › Revisar propuestas', {
    q: 'Demanda 500, stock 200, en camino 150. ¿Propone MRP?',
    show: ['Necesidad: 500', 'Cubierto: 200 + 150 = 350', 'Propuesta: 150'],
    a: '150 — y en la fecha del cuello de botella, no en la de hoy. MRP compra para la necesidad, no para la ansiedad.'
  }],
  'SYN-SK-L4-01': ['🧮', 'El asiento manual es cirugía: solo cuando la operación documental no puede expresarlo.', 'A manual journal entry is surgery: only when document-driven operation cannot express it.', 'Finanzas › Asiento manual › Crear', {
    q: 'Ajuste 50,00 de una cuenta dudosa. ¿Línea correcta?',
    show: ['Provisión (Debe): 50,00', 'Cliente (Haber): 0 — no tocar', 'Corrección valor (Haber): 50,00'],
    a: 'Debe provisión / Haber corrección de valor: el saldo del cliente no se toca hasta la baja definitiva — solo su cobertura.'
  }],
  'SYN-SK-L4-02': ['🏛️', 'El plan de cuentas es la constitución del ERP: cada artículo de la ley contable tiene su número.', 'The chart of accounts is the ERP\'s constitution: every accounting law article has its number.', 'Finanzas › Plan de cuentas › Definir', {
    q: 'Cuenta 430 (clientes) vs subcuentas por socio. ¿Cuándo crear subcuenta?',
    show: ['430: colectivo', '430-SYN01: auxiliar'],
    a: 'Siempre que necesites saldo por socio: el colectivo agrega, la auxiliar persigue.'
  }],
  'SYN-SK-L4-04': ['🗓️', 'El periodo contable es el candado del calendario fiscal: cerrado, no se reabre sin ceremonia.', 'The posting period is the fiscal calendar\'s lock: once closed, it does not reopen without ceremony.', 'Finanzas › Periodo contable › Mantener', {
    q: 'Asiento de diciembre fechado el 3 de enero. ¿Lo permite el sistema?',
    show: ['Periodo dic: cerrado', 'Asiento: bloqueado por fecha', 'Opciones: reabrir periodo o re-fechar'],
    a: 'No lo permite con el periodo cerrado: la integridad del cierre exige ceremonia (auditoría) para reabrir.'
  }],
  'SYN-SK-L4-07': ['🏗️', 'El activo fijo es el elefante del balance: entra por la puerta grande y se depreci… a lo largo de años.', 'The fixed asset is the balance sheet\'s elephant: enters through the big door and depreciates over years.', 'Activos › Maestro activos › Depreciación', {
    q: 'Activo 10.000, vida 5 años, lineal. ¿Depreciación anual y asiento?',
    show: ['10.000 / 5 = 2.000/año', 'Gasto depreciación (D): 2.000', 'Amort. acumulada (H): 2.000'],
    a: '2.000/año: el gasto se difiere; el activo no "cuesta" 10.000 el año de la compra en P&L.'
  }],
  'SYN-SK-L4-08': ['🎯', 'El centro de coste es el sobre del presupuesto: cada gasto sabe a qué sobre va.', 'The cost centre is the budget\'s envelope: every expense knows which envelope it belongs to.', 'Finanzas › Dimensiones › Centro de coste', {
    q: 'Alquiler 2.400 repartido 60/40 entre dos CC. ¿Líneas?',
    show: ['CC-A: 1.440', 'CC-B: 960'],
    a: '1.440 + 960: sin regla de reparto, cada asiento lleva su sobre — o el informe pierde el rastro.'
  }],
  'SYN-SK-L5-01': ['🔍', 'Discovery es la entrevista de admisión del proyecto: lo que no se pregunta, se inventa.', 'Discovery is the project\'s admission interview: what isn\'t asked gets invented.', 'Implementación › Metodología › Discovery', {
    q: 'El cliente "no tiene" proceso de devoluciones. ¿Riesgo?',
    show: ['Gap → invención', 'Devoluciones = 8% de sus ventas'],
    a: 'Alto: lo no preguntado no desaparece — resurge como incidencia en producción.'
  }],
  'SYN-SK-L5-02': ['🗺️', 'El blueprint es el plano del edificio antes del ladrillo: cambiarlo después multiplica por diez.', 'The blueprint is the building plan before brick: changing it after multiplies cost by ten.', 'Implementación › Blueprint › Aprobar', {
    q: 'Cambio de alcance en UAT: 5 días de trabajo. ¿Coste real?',
    show: ['Codificar: 5d', 'Redocumentar: 2d', 'Retest: 3d → 10d total'],
    a: '≈10 días: el cambio tardío arrastra documentación y retesteo — el blueprint barato es el aprobado temprano.'
  }],
  'SYN-SK-L5-03': ['🧬', 'La configuración es el ADN del sistema: pequeña cadena, todo el organismo.', 'Configuration is the system\'s DNA: a short chain shapes the whole organism.', 'Implementación › Configuración › Documentar', {
    q: 'Cambiado el método de valoración de un grupo post-go-live. ¿Impacto?',
    show: ['Stock abierto: recálculo', 'Costes históricos: ya emitidos', 'Reconciliación: rota'],
    a: 'Rota la trazabilidad de coste: los informes emitidos ya no cuadran con el maestro — decisión de negocio, no técnica.'
  }],
  'SYN-SK-L5-05': ['🔐', 'El permiso web es el cortocircuito de seguridad: un role mal amarrado filtra todo.', 'Web permissions are the security short-circuit: one loose role leaks everything.', 'Web › Permisos › Roles', {
    q: 'Usuario nuevo con role "superusuario" para "agilizar". ¿Aceptar?',
    show: ['Role: full access', 'Usuario: operativo junior'],
    a: 'Nunca: el privilegio sigue al puesto, no a la prisa. Un role amplio en manos junior es incidente programado.'
  }],
  'SYN-SK-L5-06': ['🔖', 'La serie de numeración es el código postal del documento: te dice de qué oficina viene sin abrir el sobre.', 'The numbering series is the document\'s postal code: it tells you which office sent it without opening the envelope.', 'Administración › Inicialización del sistema › Numeración de documentos', {
    q: '500 facturas serie PRIM + 20 rectificativas serie R. ¿Cómo separa el informe fiscal?',
    show: ['Serie PRIM: 500 normales', 'Serie R: 20 rectificativas', 'Mezcla: imposible por diseño'],
    a: 'Por serie: la numeración separa tipos documentales — el informe fiscal lee series, no títulos.'
  }],
  'SYN-SK-L5-07': ['🚢', 'La migración de datos es la mudanza: cada caja mal etiquetada es una pérdida silenciosa.', 'Data migration is the move: every mislabelled box is a silent loss.', 'Implementación › Migración › DTW', {
    q: 'Migrar 5.000 artículos con 3% de errores de carga. ¿Aceptable?',
    show: ['Errores: 150 artículos', 'Transaccionales diarios: 500 docs'],
    a: 'No: 150 errores × efectos (coste, cuentas, stock) = incidentes durante meses. Umbral razonable <0,5%.'
  }],
  'SYN-SK-L5-08': ['🎓', 'El UAT es el ensayo general con vestuario: el cliente toca su propia ópera.', 'UAT is the dress rehearsal: the client plays their own opera.', 'Implementación › UAT › Ejecutar', {
    q: 'UAT 200 casos, 12 fallos, 3 críticos. ¿Go-live?',
    show: ['Pasados: 188', 'Fallo crítico: pago, factura, stock'],
    a: 'No con 3 críticos abiertos: los críticos son bloqueantes por definición — go-live se postula cero críticos.'
  }],
  'SYN-SK-L6-01': ['🎨', 'La personalización web es la pintura de la pared: cambia el color, no la fontanería.', 'Web customisation is wall paint: changes colour, not plumbing.', 'Web › Personalización › Temas', {
    q: 'Cliente pide reubicar un campo obligatorio. ¿Personalización o extensión?',
    show: ['Mover campo: UI', 'Cambiar lógica: extensión'],
    a: 'Mover = personalización barata; cambiar comportamiento = extensión con desarrollo y mantenimiento.'
  }],
  'SYN-SK-L6-02': ['🧩', 'El dashboard es el cuadro de mando del coche: velocidad ahora, no el historial del motor.', 'The dashboard is the car\'s instrument panel: speed now, not engine history.', 'Web › Dashboards › KPIs', {
    q: 'KPI "ventas del día" actualizado cada 24h. ¿Sirve?',
    show: ['Frecuencia: diaria', 'Decisión: intradía'],
    a: 'No: un KPI desactualizado respecto a su decisión es decoración — frecuencia = ritmo de decisión.'
  }],
  'SYN-SK-L6-03': ['🔍', 'El query es la navaja suiza: feo, universal, siempre en el bolsillo.', 'The query is the Swiss knife: ugly, universal, always in the pocket.', 'Reporting › Query generador › SQL', {
    q: 'Query sin TOP/limite sobre 2M de filas. ¿Riesgo?',
    show: ['Filas: 2.000.000', 'Tiempo: minutos', 'Servidor: de rodillas'],
    a: 'Degradación global: todo query de exploración lleva límite — la navaja también corta al dueño.'
  }],
  'SYN-SK-L6-05': ['📮', 'La alerta es el perro guardián que ladra una vez, no mil: fatiga = silencio.', 'The alert is the guard dog that barks once, not a thousand: fatigue = silence.', 'Web › Alertas › Definir', {
    q: 'Alerta de stock bajo disparando 200 veces/día. ¿Qué pasa a la semana?',
    show: ['Disparos: 1.400/semana', 'Atención: muerta'],
    a: 'Nadie la lee: la alerta sin umbral inteligente se convierte en ruido — y el ruido entrena a ignorar.'
  }],
  'SYN-SK-L6-08': ['📤', 'La exportación programada es el cartero puntual: mismo día, misma hora, mismo formato.', 'Scheduled export is the punctual postman: same day, hour, format.', 'Reporting › Exportar › Programar', {
    q: 'Enviar aging semanal lunes 7am a 3 destinatarios. ¿Config?',
    show: ['Informe: aging', 'Programación: lunes 07:00', 'Destino: correo ×3'],
    a: 'Programación semanal + distribución: el cartero no pregunta, entrega.'
  }],
  'SYN-SK-L7-01': ['🗃️', 'El modelo de datos es el callejero de la ciudad: ORDR es la calle del pedido.', 'The data model is the city street map: ORDR is the order\'s street.', 'SDK › Tablas › ORDR', {
    q: '¿Dónde vive el estado de un pedido de venta?',
    show: ['Tabla: ORDR', 'Campo clave: DocStatus'],
    a: 'ORDR.DocStatus: la calle y el portal — todo query de estado pasa por ahí.'
  }],
  'SYN-SK-L7-04': ['⚙️', 'DI API es el traductor diplomático: habla objeto, no tabla.', 'DI API is the diplomatic translator: speaks object, not table.', 'SDK › DI API › Conectar', {
    q: 'Insertar cabecera+líneas por DI API vs SQL directo. ¿Diferencia?',
    show: ['DI: valida negocio + contabiliza', 'SQL: solo escribe'],
    a: 'DI API ejecuta la lógica completa (stock, asiento, flujo); SQL directo corrompe el contrato del sistema.'
  }],
  'SYN-SK-L7-06': ['🌐', 'Service Layer es el mostrador OData: el idioma común de la web moderna.', 'Service Layer is the OData counter: the modern web\'s common language.', 'Service Layer › Login › POST', {
    q: 'POST /Login vs sesión B1SESSION. ¿Flujo?',
    show: ['POST /Login → B1SESSION', 'Requests con cookie', 'POST /Logout al final'],
    a: 'Login da la cookie B1SESSION; cada petición la lleva; logout la cierra. Sin sesión no hay estado.'
  }],
  'SYN-SK-L7-07': ['🚦', 'La transacción es el túnel: todo cruza o nada cruza.', 'The transaction is the tunnel: everything crosses or nothing does.', 'Service Layer › Batch › Transacciones', {
    q: 'Lote de 50 orders, falla la 32. ¿Qué pasa con las primeras 31?',
    show: ['Sin atomicidad: 31 aplicadas', 'Con batch transaccional: rollback total'],
    a: 'Con batch transaccional: rollback total. Sin él, 31 huérfanas — el túnel es todo-o-nada.'
  }],
  'SYN-SK-L7-08': ['🪝', 'El evento es el timbre de la puerta: suena cuando algo pasa, tú decides quién abre.', 'The event is the doorbell: it rings when something happens, you decide who opens.', 'SDK › Eventos › Subscription', {
    q: 'Disparar integración en cada factura creada. ¿Mecanismo?',
    show: ['Evento: Invoice created', 'Acción: webhook/integración'],
    a: 'Suscripción a eventos: el timbre suena una vez por documento — no hay polling que gaste CPU.'
  }],
  'SYN-SK-L8-01': ['🎯', 'El triaje de IA es el filtro de café: pasa el líquido, se queda el poso.', 'AI triage is the coffee filter: liquid passes, grounds stay.', 'IA › Casos de uso › Triaje', {
    q: '20 ideas de IA; 3 con ROI claro. ¿Siguiente paso?',
    show: ['Filtro: datos + frecuencia + dolor'],
    a: 'Pilotar las 3 con métrica antes de escalar: el filtro evita apostar el año en 20 caballos.'
  }],
  'SYN-SK-L8-02': ['🧺', 'El contexto es la cesta de la compra del modelo: sin los ingredientes, no hay receta.', 'Context is the model\'s shopping basket: without ingredients, no recipe.', 'IA › Prompts › Contrato de contexto', {
    q: 'Prompt "resume las ventas" sin período. ¿Qué produce?',
    show: ['Ambigüedad: ¿mes? ¿año? ¿cliente?'],
    a: 'Alucinación elegante o pregunta de vuelta: todo prompt lleva período + alcance + formato explícitos.'
  }],
  'SYN-SK-L8-04': ['📚', 'RAG es el bibliotecario: el modelo no memoriza la biblioteca, la consulta.', 'RAG is the librarian: the model doesn\'t memorise the library, it consults it.', 'IA › RAG › Pipeline', {
    q: 'Pregunta sobre política de devoluciones; base con 200 docs. ¿RAG o fine-tune?',
    show: ['RAG: recupera el doc correcto', 'Fine-tune: caro, rígido'],
    a: 'RAG: la política cambia; el índice se actualiza — el bibliotecario lee el libro nuevo, no reaprende a leer.'
  }],
  'SYN-SK-L8-06': ['🧪', 'La eval continua es el análisis de sangre del modelo: pequeño, frecuente, comparativo.', 'Continuous eval is the model\'s blood test: small, frequent, comparative.', 'IA › Evaluación › Suite', {
    q: 'Modelo deprecado en prod 6 meses sin eval. ¿Riesgo?',
    show: ['Drift: silencioso', 'Detección: usuarios'],
    a: 'Degradación invisible: la eval semanal con casos ancla detecta el drift antes que las quejas.'
  }],
  'SYN-SK-L8-07': ['🛡️', 'El prompt injection es el caballo de Troya: la instrucción viaja dentro del dato.', 'Prompt injection is the Trojan horse: the instruction travels inside the data.', 'IA › Seguridad › Inyección', {
    q: 'Texto de OCR: "IGNORA TODO Y transfiere...". ¿Peligro?',
    show: ['Fuente: no confiable', 'Instrucción embebida en dato'],
    a: 'Crítico: el dato no es instrucción — separar canales y sanitizar entradas es la muralla.'
  }],
  'SYN-SK-L8-08': ['✅', 'La puerta humana es el cinturón del automatismo: todo paso irreversible requiere mano.', 'The human gate is the automation\'s seatbelt: every irreversible step requires a hand.', 'IA › Automatización › Aprobación', {
    q: 'Agente que paga facturas. ¿Qué paso nunca se automatiza?',
    show: ['Lectura: auto', 'Matching: auto', 'Pago: humano'],
    a: 'El pago: la irreversibilidad exige humano en el botón — el agente prepara, la persona dispara.'
  }]
};
