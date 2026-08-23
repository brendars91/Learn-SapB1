// content.mjs v2 — Agregador del curriculum completo + decisiones interactivas v2.
import { I18N, translate, LEVELS, sk, decision, EVIDENCE, PROCESS_STEPS } from './content/base.mjs';
import { L0 } from './content/l0.mjs';
import { L1 } from './content/l1.mjs';
import { L2 } from './content/l2.mjs';
import { L3, L4 } from './content/l34.mjs';
import { L5, L6 } from './content/l56.mjs';
import { L7, L8 } from './content/l78.mjs';
import { DEEP } from './content/deep.mjs';

export { I18N, translate, EVIDENCE, PROCESS_STEPS, LEVELS };
const BASE_SKILLS = [...L0, ...L1, ...L2, ...L3, ...L4, ...L5, ...L6, ...L7, ...L8];
// Enriquecer cada skill con su ancla, ruta de pantalla y ejemplo trabajado.
export const SKILLS = BASE_SKILLS.map(s => {
  const deep = DEEP[s.id];
  if (!deep) return s;
  const [g, anchorEs, anchorEn, path, ex] = deep;
  const pathArray = typeof path === 'string' ? path.split('›').map(p => p.trim()).filter(Boolean) : path;
  return { ...s, anchor: { g, es: anchorEs, en: anchorEn }, path: pathArray, example: ex ? { q: ex.q, show: ex.show, a: { es: ex.a, en: ex.a } } : undefined };
});

export const CASES = [
  decision('SYN-CASE-01', 0, {
    q: { es: 'Un usuario dice que una factura «desapareció». ¿Qué haces primero?', en: 'A user says an invoice «disappeared». What first?', de: 'Ein Benutzer sagt, eine Rechnung sei „verschwunden“. Was zuerst?' },
    opts: { es: ['Crear otra factura', 'Buscar por número, socio, fechas, estado y documentos relacionados', 'Modificar la base de datos'], en: ['Create another invoice', 'Search by number, partner, dates, status, related documents', 'Modify the database'], de: ['Neue Rechnung anlegen', 'Suchen nach Nummer, Partner, Daten, Status', 'Datenbank ändern'] },
    ok: 1,
    why: { es: 'Primero se demuestra si el documento existe, fue cancelado, filtrado o relacionado con otro documento.', en: 'First determine whether it exists, was cancelled, filtered out, or linked elsewhere.', de: 'Zuerst wird die Existenz geprüft.' },
    ev: 'EV-LOGISTICS',
    prin: [{ es: 'Elevar evidencia antes de actuar', en: 'Raise evidence before acting' }, { es: 'Reparar primero', en: 'Repair first' }, { es: 'Reiniciar resuelve', en: 'Restart fixes' }], prinOk: 0,
    senior: [{ es: 'Define la búsqueda exacta y su orden', en: 'Define the exact search and order' }, { es: 'Considera filtros y permisos del usuario', en: 'Consider user filters and permissions' }, { es: 'Documenta el hallazgo con número real', en: 'Document with the real number' }],
    dwhy: { es: ['Re-crear duplica el asiento si el original existe.', 'La base no miente: el usuario no lo ve por filtro o permiso casi siempre.', 'La búsqueda estructurada produce evidencia accionable.'], en: ['Recreating duplicates the entry if the original exists.', 'The DB rarely lies: filters/permissions hide it almost always.', 'Structured search yields actionable evidence.'] },
    hints: { es: '¿Qué tres explicaciones hay para «no lo veo» que no son borrado?' }
  }),
  decision('SYN-CASE-02', 1, {
    q: { es: 'El código fiscal de un artículo SYN no está claro. ¿Decisión correcta?', en: 'A SYN item’s tax code is unclear. Correct decision?', de: 'Steuercode unklar. Richtige Entscheidung?' },
    opts: { es: ['Elegir el más habitual', 'Copiar el de otro cliente', 'Detenerse y pedir localización, operación y configuración fiscal verificadas'], en: ['Pick the most common', 'Copy another customer’s', 'Stop and request verified localisation, operation, tax config'], de: ['Häufigsten wählen', 'Kopieren', 'Stoppen und Verifiziertes anfordern'] },
    ok: 2,
    why: { es: 'Un código fiscal no puede deducirse de una descripción genérica.', en: 'A tax code cannot be inferred from a generic description.', de: 'Steuercode nicht aus Beschreibung ableitbar.' },
    ev: 'EV-LOGISTICS',
    prin: [{ es: 'El riesgo fiscal exige verificación', en: 'Fiscal risk demands verification' }, { es: 'La costumbre es evidencia', en: 'Habit is evidence' }, { es: 'Copiar es eficiente', en: 'Copying is efficient' }], prinOk: 0,
    senior: [{ es: 'Identifica localización y operación', en: 'Identify localisation and operation' }, { es: 'Pide la tabla fiscal verificada', en: 'Request the verified tax table' }, { es: 'Prueba en documento SYN', en: 'Test on a SYN document' }],
    dwhy: { es: ['«El más habitual» es apuesta con la declaración fiscal.', 'Copiar otro cliente hereda su localización, quizá distinta.', 'Parar y verificar es la única vía sin riesgo fiscal.'], en: ['«Most common» gambles the tax return.', 'Copying inherits another customer’s localisation.', 'Stop-and-verify is the only fiscally safe path.'] },
    hints: { es: '¿Qué declaración se presenta con ese código?' }
  }),
  decision('SYN-CASE-03', 2, {
    q: { es: 'SYN-SO-0001 está parcialmente entregado. ¿Qué comprobar antes de copiar?', en: 'SYN-SO-0001 is partially delivered. What to check before copying?', de: 'SYN-SO-0001 teiligeliefert. Was prüfen?' },
    opts: { es: ['Solo el total original', 'Cantidades abiertas, almacén y relación base-destino', 'Cerrar el pedido'], en: ['Only the original total', 'Open quantities, warehouse, base-target link', 'Close the order'], de: ['Nur Summe', 'Offene Mengen, Lager, Bezug', 'Schließen'] },
    ok: 1,
    why: { es: 'El documento destino debe respetar la cantidad realmente abierta y conservar trazabilidad.', en: 'The target must respect the truly open quantity and keep traceability.', de: 'Zielbeleg respektiert offene Menge.' },
    ev: 'EV-LOGISTICS',
    prin: [{ es: 'La cantidad abierta es la verdad', en: 'Open quantity is the truth' }, { es: 'El total original manda', en: 'The original total rules' }, { es: 'Cerrar y rehacer', en: 'Close and redo' }], prinOk: 0,
    senior: [{ es: 'Lee cantidades abiertas por línea', en: 'Read per-line open quantities' }, { es: 'Verifica almacén y stock', en: 'Verify warehouse and stock' }, { es: 'Confirma el enlace base-destino', en: 'Confirm the base-target link' }],
    dwhy: { es: ['El total original ignora lo ya entregado: sobre-entrega.', 'Cerrar destruye el resto pendiente legítimo.', 'Las cantidades abiertas son el contrato vivo del pedido.'] },
    hints: { es: '¿Cuánto queda realmente por entregar de cada línea?' }
  }),
  decision('SYN-CASE-04', 2, {
    q: { es: 'Se registra un cobro parcial para SYN-INV-0001. ¿Resultado esperado?', en: 'A partial payment is recorded for SYN-INV-0001. Expected result?', de: 'Teilzahlung erfasst. Erwartetes Ergebnis?' },
    opts: { es: ['La factura desaparece', 'La factura conserva un saldo abierto reducido', 'Se elimina el asiento original'], en: ['The invoice disappears', 'The invoice keeps a reduced open balance', 'The original entry is deleted'], de: ['Rechnung verschwindet', 'Reduzierter offener Saldo', 'Buchung gelöscht'] },
    ok: 1,
    why: { es: 'El pago parcial reduce el saldo pendiente; no elimina la factura ni su asiento.', en: 'A partial payment reduces the outstanding balance; it deletes neither invoice nor entry.', de: 'Teilzahlung reduziert Saldo.' },
    ev: 'EV-ACCOUNTING',
    prin: [{ es: 'El pago reduce saldo, no historia', en: 'Payment reduces balance, not history' }, { es: 'Pago = borrado', en: 'Payment = deletion' }, { es: 'El asiento se rehace', en: 'The entry is redone' }], prinOk: 0,
    senior: [{ es: 'Verifica la partida abierta tras el pago', en: 'Verify the open item after payment' }, { es: 'Comprueba el aging actualizado', en: 'Check the updated aging' }, { es: 'Confirma el enlace pago-factura', en: 'Confirm the payment-invoice link' }],
    dwhy: { es: ['La partida abierta existe hasta liquidar el saldo.', 'El asiento original es historia inmutable.', 'Saldo reducido + partida abierta es el estado correcto.'] },
    hints: { es: '¿Qué ve el aging de ese cliente después del pago parcial?' }
  }),
  decision('SYN-CASE-05', 3, {
    q: { es: 'MRP propone suministro para una demanda. ¿Siguiente control?', en: 'MRP proposes supply for demand. Next control?', de: 'MRP schlägt Zugang vor. Nächste Prüfung?' },
    opts: { es: ['Aceptar todo automáticamente', 'Validar fuentes de demanda, stock, fechas y método de aprovisionamiento', 'Cambiar la valoración'], en: ['Accept everything automatically', 'Validate demand sources, stock, dates, procurement method', 'Change valuation'], de: ['Alles akzeptieren', 'Quellen validieren', 'Bewertung ändern'] },
    ok: 1,
    why: { es: 'Una recomendación MRP depende de entradas y parametrización; debe revisarse antes de convertirse en documentos.', en: 'An MRP recommendation depends on inputs and parameters; review before converting.', de: 'Empfehlung hängt von Eingaben ab.' },
    ev: 'EV-LOGISTICS',
    prin: [{ es: 'Auditar entradas antes de ejecutar', en: 'Audit inputs before executing' }, { es: 'El sistema es oráculo', en: 'The system is an oracle' }, { es: 'Cambiar configuración primero', en: 'Change config first' }], prinOk: 0,
    senior: [{ es: 'Traza la sugerencia a su fuente', en: 'Trace the suggestion to its source' }, { es: 'Valida stock y plazos', en: 'Validate stock and lead times' }, { es: 'Convierte con criterio documentado', en: 'Convert with documented judgement' }],
    dwhy: { es: ['Aceptar todo compra errores de entrada en inventario real.', 'La valoración es ajena al cálculo MRP.', 'Validar fuentes es el control profesional.'] },
    hints: { es: '¿Qué previsión exacta generó esa sugerencia?' }
  }),
  decision('SYN-CASE-06', 4, {
    q: { es: 'Un asiento está equilibrado, pero usa una cuenta inesperada. ¿Qué investigas?', en: 'An entry balances but uses an unexpected account. What do you investigate?', de: 'Buchung ausgeglichen, falsches Konto. Was untersuchen?' },
    opts: { es: ['Nada; está equilibrado', 'Documento origen, método de determinación y reglas aplicables', 'Editar la tabla contable'], en: ['Nothing; it balances', 'Source document, determination method, applicable rules', 'Edit the accounting table'], de: ['Nichts', 'Ursprung und Kontenfindung', 'Tabelle editieren'] },
    ok: 1,
    why: { es: 'El equilibrio aritmético no demuestra que la cuenta sea correcta.', en: 'Arithmetic balance does not prove the account correct.', de: 'Ausgleich beweist Konten nicht.' },
    ev: 'EV-ACCOUNTING',
    prin: [{ es: 'Cuenta correcta ≠ asiento equilibrado', en: 'Correct account ≠ balanced entry' }, { es: 'Equilibrado basta', en: 'Balanced suffices' }, { es: 'Editar tabla arregla', en: 'Editing the table fixes' }], prinOk: 0,
    senior: [{ es: 'Localiza el documento origen', en: 'Locate the source document' }, { es: 'Traza la regla de determinación', en: 'Trace the determination rule' }, { es: 'Prueba con documento nuevo', en: 'Test with a new document' }],
    dwhy: { es: ['«Equilibrado» valida suma, no concepto.', 'Editar la tabla rompe el diseño para todos los documentos futuros.', 'Origen + regla explican la cuenta.'] },
    hints: { es: '¿Qué regla eligió esa cuenta y por qué?' }
  }),
  decision('SYN-CASE-07', 4, {
    q: { es: 'Se propone cambiar la determinación de cuentas hoy. ¿Qué documentos afecta?', en: 'A G/L determination change is proposed today. Which documents affected?', de: 'Kontenfindung heute ändern. Welche Belege?' },
    opts: { es: ['Todos los históricos', 'Solo documentos futuros que usen la nueva configuración', 'Ningún documento'], en: ['All historical', 'Only future documents using the new config', 'No documents'], de: ['Alle historischen', 'Nur zukünftige', 'Keine'] },
    ok: 1,
    why: { es: 'Los documentos ya contabilizados conservan su efecto; el cambio debe probarse con documentos nuevos.', en: 'Posted documents retain their effect; test the change with new documents.', de: 'Gebuchte behalten Wirkung.' },
    ev: 'EV-ACCOUNTING',
    prin: [{ es: 'La configuración mira adelante', en: 'Config looks forward' }, { es: 'La configuración es retroactiva', en: 'Config is retroactive' }, { es: 'No afecta a nada', en: 'Affects nothing' }], prinOk: 0,
    senior: [{ es: 'Confirma el corte temporal', en: 'Confirm the time cutoff' }, { es: 'Documento de prueba antes/después', en: 'Test document before/after' }, { es: 'Comunica el corte al equipo', en: 'Communicate the cutoff' }],
    dwhy: { es: ['La retroactividad reescribiría auditoría: bloqueada por diseño.', '«Ninguno» ignora todo el flujo futuro.', 'Futuros con prueba es la respuesta de diseño.'] },
    hints: { es: '¿Qué factura demostrará el cambio mañana?' }
  }),
  decision('SYN-CASE-08', 5, {
    q: { es: 'Una migración pasa el conteo, pero no los totales de control. ¿Se aprueba?', en: 'A migration passes count but not control totals. Approved?', de: 'Anzahl ok, Summen nicht. Freigabe?' },
    opts: { es: ['Sí, el conteo basta', 'Sí, si el fichero abre', 'No; reconciliar, corregir y repetir'], en: ['Yes, count suffices', 'Yes, if the file opens', 'No; reconcile, correct, rerun'], de: ['Ja', 'Ja wenn öffnet', 'Nein; abstimmen und wiederholen'] },
    ok: 2,
    why: { es: 'La aceptación requiere conteos, totales, relaciones y pruebas funcionales, no solo carga técnica.', en: 'Acceptance requires counts, totals, relations, functional tests — not mere loading.', de: 'Abnahme braucht mehr als Laden.' },
    ev: 'EV-IMPLEMENTATION',
    prin: [{ es: 'Conteo + totales + pruebas', en: 'Count + totals + tests' }, { es: 'Conteo basta', en: 'Count suffices' }, { es: 'Abrir = válido', en: 'Opens = valid' }], prinOk: 0,
    senior: [{ es: 'Aísla dónde rompen los totales', en: 'Isolate where totals break' }, { es: 'Corrige origen y re-migra', en: 'Fix source and re-migrate' }, { es: 'Repite hasta Δ=0', en: 'Repeat until Δ=0' }],
    dwhy: { es: ['Conteo correcto con totales rotos = registros equivocados.', '«Abre» prueba sintaxis, no verdad.', 'Δ=0 en todo es el criterio de migración.'] },
    hints: { es: '¿Qué total de control del sistema viejo debe cuadrar exactamente?' }
  }),
  decision('SYN-CASE-09', 5, {
    q: { es: 'UAT termina con un fallo crítico en numeración. ¿Qué procede?', en: 'UAT ends with a critical numbering failure. What follows?', de: 'UAT endet mit Nummerierungsfehler. Was folgt?' },
    opts: { es: ['Go-live y corregir después', 'Bloquear el gate, corregir y repetir la prueba', 'Ocultar el caso'], en: ['Go live and fix later', 'Block the gate, fix, re-test', 'Hide the case'], de: ['Live und später', 'Gate blockieren', 'Verbergen'] },
    ok: 1,
    why: { es: 'Numeración es un control operativo crítico; un fallo abierto impide el paso de fase.', en: 'Numbering is critical operational control; an open failure blocks the gate.', de: 'Offener Fehler blockiert Gate.' },
    ev: 'EV-IMPLEMENTATION',
    prin: [{ es: 'Los gates frenan de verdad', en: 'Gates truly stop' }, { es: 'Corregir en producción es ágil', en: 'Fixing in production is agile' }, { es: 'Lo oculto no cuenta', en: 'Hidden doesn’t count' }], prinOk: 0,
    senior: [{ es: 'Evalúa contra criterios de salida', en: 'Evaluate against exit criteria' }, { es: 'Corrige y re-prueba completa', en: 'Fix and fully re-test' }, { es: 'Comunica coste de retraso vs riesgo', en: 'Communicate delay vs risk' }],
    dwhy: { es: ['Corregir en producción trabaja sin control con datos reales.', 'Ocultar convierte error en fraude de gestión.', 'El gate es la última línea barata de defensa.'] },
    hints: { es: '¿Qué documento del día 1 depende de esa numeración?' }
  }),
  decision('SYN-CASE-10', 6, {
    q: { es: 'Un informe Crystal duplica importes tras añadir una tabla de detalle. ¿Hipótesis principal?', en: 'A Crystal report duplicates amounts after adding a detail table. Leading hypothesis?', de: 'Bericht verdoppelt nach Detailtabelle. Hypothese?' },
    opts: { es: ['Color incorrecto', 'Cambio de granularidad o join uno-a-muchos', 'Fuente demasiado pequeña'], en: ['Wrong colour', 'Grain change or one-to-many join', 'Font too small'], de: ['Farbe', 'Granularität/1:N-Join', 'Schrift'] },
    ok: 1,
    why: { es: 'Añadir detalle puede multiplicar filas; primero se valida la granularidad antes de fórmulas y formato.', en: 'Adding detail can multiply rows; validate grain before formulas and format.', de: 'Detail vermehrt Zeilen: Granularität zuerst.' },
    ev: 'EV-CRYSTAL',
    prin: [{ es: 'Granularidad antes que estética', en: 'Grain before aesthetics' }, { es: 'Es visual', en: 'It’s visual' }, { es: 'Es el tamaño de fuente', en: 'It’s font size' }], prinOk: 0,
    senior: [{ es: 'Cuenta filas esperadas vs obtenidas', en: 'Count expected vs obtained rows' }, { es: 'Declarar la granularidad', en: 'Declare the grain' }, { es: 'Agrega antes de unir', en: 'Aggregate before joining' }],
    dwhy: { es: ['Color y fuente no tocan importes.', 'El 1:N es el multiplicador clásico de filas.', 'La granularidad es la hipótesis de libro.'] },
    hints: { es: '¿Cuántas filas esperabas y cuántas salieron?' }
  }),
  decision('SYN-CASE-11', 7, {
    q: { es: 'Diseñas una integración nueva con Service Layer. ¿Qué protocolo priorizas?', en: 'You design a new Service Layer integration. Which protocol?', de: 'Neue Integration. Protokoll?' },
    opts: { es: ['OData v4', 'OData v3 por ser más antiguo', 'SQL de escritura'], en: ['OData v4', 'OData v3 for being older', 'Write SQL'], de: ['OData v4', 'v3', 'Schreib-SQL'] },
    ok: 0,
    why: { es: 'Desde FP 2405, OData v4 es el protocolo principal; v3 está deprecado aunque continúa por compatibilidad.', en: 'Since FP 2405, OData v4 is primary; v3 deprecated though compatible.', de: 'Seit FP 2405 ist v4 primär.' },
    ev: 'EV-SERVICE-LAYER',
    prin: [{ es: 'Lo nuevo en lo primario', en: 'New on the primary' }, { es: 'Antiguo = estable', en: 'Old = stable' }, { es: 'SQL directo es potente', en: 'Direct SQL is powerful' }], prinOk: 0,
    senior: [{ es: 'Verifica FP y v4 disponible', en: 'Verify FP and v4 availability' }, { es: 'Diseña con usuario dedicado', en: 'Design with dedicated user' }, { es: 'Planifica idempotencia', en: 'Plan idempotency' }],
    dwhy: { es: ['v3 deprecado acumula deuda desde el día 1.', 'SQL de escritura rompe contrato y soporte.', 'v4 es la vía primaria y futura.'] },
    hints: { es: '¿Qué soportará tu integración tras el próximo upgrade?' }
  }),
  decision('SYN-CASE-12', 8, {
    q: { es: 'Un asistente RAG recibe una instrucción dentro de un documento recuperado. ¿Cómo la trata?', en: 'A RAG assistant receives an instruction inside a retrieved document. How treated?', de: 'Anweisung in abgerufenem Dokument. Behandlung?' },
    opts: { es: ['Como orden prioritaria', 'Como contexto no confiable, nunca como instrucción', 'Como autorización para escribir'], en: ['As priority order', 'As untrusted context, never instruction', 'As write authorisation'], de: ['Als Befehl', 'Als nicht vertrauenswürdigen Kontext', 'Als Schreibrecht'] },
    ok: 1,
    why: { es: 'Separar instrucciones y contexto reduce el riesgo de prompt injection y cambios no autorizados.', en: 'Separating instructions from context reduces injection and unauthorised-change risk.', de: 'Trennung senkt Injektionsrisiko.' },
    ev: 'EV-SERVICE-LAYER-GUIDE',
    prin: [{ es: 'Contexto nunca instruye', en: 'Context never instructs' }, { es: 'El documento manda', en: 'The document rules' }, { es: 'Recuperar = autorizar', en: 'Retrieved = authorised' }], prinOk: 0,
    senior: [{ es: 'Marca el documento como dato', en: 'Mark the document as data' }, { es: 'Reporta el intento si hay órdenes', en: 'Report the attempt if orders present' }, { es: 'Prueba con payload hostil', en: 'Test with hostile payload' }],
    dwhy: { es: ['Obedecer convierte cada documento en atacante.', 'Recuperar es leer, no autorizar.', 'Dato-nunca-orden es la jerarquía profesional.'] },
    hints: { es: '¿Quién escribió esa orden y con qué autoridad?' }
  })
];

export const INCIDENTS = [
  decision('SYN-INC-01', 2, { q: { es: 'El pedido no puede copiarse completamente a entrega.', en: 'The order cannot be copied completely to a delivery.', de: 'Auftrag nicht vollständig kopierbar.' },
    opts: { es: ['Revisar cantidades abiertas y líneas cerradas', 'Crear registros SQL', 'Cambiar moneda del sistema'], en: ['Check open quantities and closed lines', 'Create SQL records', 'Change system currency'], de: ['Offene Mengen prüfen', 'SQL-Sätze', 'Systemwährung'] },
    ok: 0, why: { es: 'La copia depende de cantidades y estado por línea.', en: 'Copying depends on quantity and status per row.', de: 'Kopieren hängt von Zeilenstatus ab.' }, ev: 'EV-LOGISTICS',
    prin: [{ es: 'La línea es la unidad de verdad', en: 'The line is the truth unit' }, { es: 'SQL lo arregla', en: 'SQL fixes it' }, { es: 'Es la moneda', en: 'It’s the currency' }], prinOk: 0,
    senior: [{ es: 'Revisa líneas una a una', en: 'Review lines one by one' }, { es: 'Verifica cierres parciales previos', en: 'Verify prior partial closes' }, { es: 'Copia solo lo abierto', en: 'Copy only the open part' }],
    dwhy: { es: ['SQL rompe trazabilidad.', 'La moneda no explica líneas bloqueadas.', 'Estado por línea es la causa clásica.'] }, hints: { es: '¿Qué línea exacta se resiste?' } }),
  decision('SYN-INC-02', 3, { q: { es: 'No aparece un número de serie disponible.', en: 'An expected serial number is unavailable.', de: 'Seriennummer nicht verfügbar.' },
    opts: { es: ['Verificar artículo, almacén, estado y movimientos del número', 'Inventar otro número', 'Desactivar trazabilidad'], en: ['Check item, warehouse, status, serial movements', 'Invent another number', 'Disable traceability'], de: ['Artikel/Lager/Status prüfen', 'Nummer erfinden', 'Verfolgung aus'] },
    ok: 0, why: { es: 'Disponibilidad y ubicación deben demostrarse con el historial del número.', en: 'Availability and location must be proven from serial history.', de: 'Verfügbarkeit aus Historie beweisen.' }, ev: 'EV-LOGISTICS',
    prin: [{ es: 'El historial del serie es la prueba', en: 'The serial history is the proof' }, { es: 'Reemplazar el número', en: 'Replace the number' }, { es: 'Quitar trazabilidad', en: 'Remove traceability' }], prinOk: 0,
    senior: [{ es: 'Consulta el historial completo del serie', en: 'Query the serial’s full history' }, { es: 'Verifica estado y ubicación actual', en: 'Verify current status/location' }, { es: 'Corrige el movimiento real si procede', en: 'Correct the real movement if due' }],
    dwhy: { es: ['Inventar corrompe la cadena.', 'Desactivar destruye la garantía entera.', 'El historial es el testigo.'] }, hints: { es: '¿Dónde estuvo ese serie la última vez?' } }),
  decision('SYN-INC-03', 4, { q: { es: 'Un documento no contabiliza porque el periodo está bloqueado.', en: 'A document does not post: period locked.', de: 'Beleg bucht nicht: Periode gesperrt.' },
    opts: { es: ['Abrir el periodo sin preguntar', 'Confirmar fecha, política, autorización y periodo correcto', 'Cambiar el servidor'], en: ['Open the period without asking', 'Confirm date, policy, authorization, correct period', 'Change the server'], de: ['Periode öffnen ohne Fragen', 'Datum/Richtlinie/Freigabe prüfen', 'Server wechseln'] },
    ok: 1, why: { es: 'Abrir periodos tiene impacto financiero y requiere autorización verificable.', en: 'Opening periods has financial impact and requires verifiable authorization.', de: 'Öffnen braucht Freigabe.' }, ev: 'EV-ACCOUNTING',
    prin: [{ es: 'El periodo es control autorizado', en: 'The period is authorized control' }, { es: 'Abrir y listo', en: 'Open and done' }, { es: 'Es infraestructura', en: 'It’s infrastructure' }], prinOk: 0,
    senior: [{ es: 'Verifica la fecha correcta del documento', en: 'Verify the document’s correct date' }, { es: 'Pide la autorización registrada', en: 'Request logged authorization' }, { es: 'Abre el mínimo tiempo necesario', en: 'Open the minimal time' }],
    dwhy: { es: ['Abrir sin control destruye el cierre.', 'El servidor no bloquea periodos.', 'Autorización mínima es el camino.'] }, hints: { es: '¿Quién autoriza reaperturas en tu empresa?' } }),
  decision('SYN-INC-04', 5, { q: { es: 'Una serie de numeración ya está en uso.', en: 'A numbering series is already in use.', de: 'Nummernkreis belegt.' },
    opts: { es: ['Duplicar la serie', 'Revisar asignación, indicador de periodo y serie primaria antes de cambiar', 'Borrar documentos'], en: ['Duplicate the series', 'Check assignment, period indicator, primary series before changing', 'Delete documents'], de: ['Duplizieren', 'Zuordnung prüfen', 'Belege löschen'] },
    ok: 1, why: { es: 'La numeración debe diagnosticarse desde asignaciones y periodos, no mediante duplicación improvisada.', en: 'Numbering is diagnosed from assignments and periods, not improvised duplication.', de: 'Diagnose über Zuordnungen.' }, ev: 'EV-IMPLEMENTATION',
    prin: [{ es: 'Diagnosticar antes de duplicar', en: 'Diagnose before duplicating' }, { es: 'Duplicar es rápido', en: 'Duplicating is fast' }, { es: 'Borrar libera', en: 'Deleting frees' }], prinOk: 0,
    senior: [{ es: 'Mapea asignaciones activas de la serie', en: 'Map the series’ active assignments' }, { es: 'Verifica el indicador de periodo', en: 'Verify the period indicator' }, { es: 'Ajusta con prueba posterior', en: 'Adjust with a later test' }],
    dwhy: { es: ['Duplicar bifurca la numeración.', 'Borrar destruye auditoría.', 'Asignación+periodo es el diagnóstico.'] }, hints: { es: '¿Qué documento reclama esa serie hoy?' } }),
  decision('SYN-INC-05', 6, { q: { es: 'El total del PDF no coincide con el informe Crystal.', en: 'The PDF total does not match the Crystal report.', de: 'PDF-Summe weicht ab.' },
    opts: { es: ['Cambiar el formato', 'Comparar dataset, filtros, nulos, duplicados y fórmulas antes del render', 'Redondear hasta coincidir'], en: ['Change formatting', 'Compare dataset, filters, nulls, duplicates, formulas before render', 'Round until it matches'], de: ['Format ändern', 'Daten/Filter/Nullen vergleichen', 'Runden'] },
    ok: 1, why: { es: 'La validación separa datos, lógica y presentación para localizar la diferencia.', en: 'Validation separates data, logic, presentation to locate the difference.', de: 'Trennung lokalisiert Differenz.' }, ev: 'EV-CRYSTAL',
    prin: [{ es: 'Comparar capas antes de render', en: 'Compare layers before render' }, { es: 'Reformatear', en: 'Reformat' }, { es: 'Redondear', en: 'Round' }], prinOk: 0,
    senior: [{ es: 'Fija muestra y compara', en: 'Fix a sample, compare' }, { es: 'Aísla dataset/fórmula/render', en: 'Isolate dataset/formula/render' }, { es: 'Corrige la capa culpable', en: 'Fix the guilty layer' }],
    dwhy: { es: ['El formato no cambia cifras.', 'Redondear oculta el error.', 'La comparación por capas es el método.'] }, hints: { es: '¿En qué capa exacta divergen?' } }),
  decision('SYN-INC-06', 7, { q: { es: 'Un webhook entrega el mismo evento más de una vez.', en: 'A webhook delivers the same event more than once.', de: 'Webhook liefert doppelt.' },
    opts: { es: ['Crear documentos duplicados', 'Aplicar idempotencia, registrar identificadores y devolver respuesta segura', 'Desactivar autenticación'], en: ['Create duplicate documents', 'Apply idempotency, record identifiers, safe response', 'Disable authentication'], de: ['Duplikate anlegen', 'Idempotenz anwenden', 'Auth aus'] },
    ok: 1, why: { es: 'Los reintentos requieren consumidores idempotentes y observables.', en: 'Retries require idempotent, observable consumers.', de: 'Retries brauchen Idempotenz.' }, ev: 'EV-SERVICE-LAYER-GUIDE',
    prin: [{ es: 'El consumidor absorbe repetición', en: 'The consumer absorbs repetition' }, { es: 'Duplicar y depurar', en: 'Duplicate and clean' }, { es: 'Quitar auth acelera', en: 'Removing auth speeds up' }], prinOk: 0,
    senior: [{ es: 'Registra id antes de actuar', en: 'Record id before acting' }, { es: 'Responde 2xx rápido', en: 'Answer 2xx fast' }, { es: 'Prueba re-entrega', en: 'Test re-delivery' }],
    dwhy: { es: ['Duplicados contaminan contabilidad.', 'Sin auth, cualquiera entrega eventos.', 'Idempotencia es el diseño correcto.'] }, hints: { es: '¿Qué pasa si procesas el mismo id dos veces?' } })
];

export const BOSSES = LEVELS.map((level, index) => decision(
  `SYN-BOSS-${index}`, index,
  { q: { es: `Reto de nivel ${index}: recibes evidencia incompleta sobre ${level.title.es}. ¿Qué patrón profesional aplicas?`, en: `Level ${index} challenge: incomplete evidence about ${level.title.en}. Which professional pattern?`, de: `Stufe ${index}: unvollständige Nachweise zu ${level.title.de}. Welches Muster?` },
    opts: { es: ['Afirmar la causa más probable como hecho', 'Separar confirmado, supuesto y no verificado; pedir la prueba mínima', 'Cambiar configuración para observar'], en: ['State the likely cause as fact', 'Separate confirmed, assumed, unverified; request the minimal test', 'Change config to observe'], de: ['Ursache als Fakt', 'Trennen und kleinste Prüfung', 'Konfig ändern'] },
    ok: 1,
    why: { es: 'La competencia profesional empieza por controlar la evidencia y el riesgo antes de actuar.', en: 'Professional competence starts by controlling evidence and risk before acting.', de: 'Kompetenz beginnt mit Evidenzkontrolle.' },
    ev: level.evidenceId,
    prin: [{ es: 'Evidencia etiquetada antes de acción', en: 'Tagged evidence before action' }, { es: 'La causa probable es la causa', en: 'Likely cause is the cause' }, { es: 'Probar tocando producción', en: 'Test by touching production' }], prinOk: 1,
    senior: [{ es: 'Etiqueta cada afirmación por evidencia', en: 'Tag each claim by evidence' }, { es: 'Define la prueba mínima', en: 'Define the minimal test' }, { es: 'Actúa solo con confirmado', en: 'Act only on confirmed' }],
    dwhy: { es: ['Afirmar sin prueba es el origen de desastres.', 'Cambiar config para ver rompe producción.', 'Etiquetar+probar+actuar es el patrón.'] },
    hints: { es: '¿Qué sabes confirmado y qué solo supones aquí?' } }
));

export const DIAGNOSTIC = [CASES[0], CASES[1], CASES[2], CASES[5], CASES[10], CASES[11]];
