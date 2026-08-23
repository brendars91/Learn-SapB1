// Nivel 2 — Logística central (8 skills únicos). 3 ya autorados; aquí el módulo completo.
import { sk } from './base.mjs';

const S = (level, index, spec) => sk(level, index, spec);

export const L2 = [
  S(2, 0, {
    t: { es: 'Pedido a cobro', en: 'Order to cash', de: 'Auftrag bis Zahlung' },
    o: { es: 'Ejecutar el ciclo completo O2C sabiendo qué produce cada documento.', en: 'Run the full O2C cycle knowing what each document produces.', de: 'Den O2C-Zyklus beherrschen.' },
    c: { es: 'Oferta → Pedido → Entrega → Factura → Cobro: solo entrega y factura tocan contabilidad; el pedido compromete stock sin asiento; el cobro cierra el ciclo financiero.', en: 'Quote → Order → Delivery → Invoice → Payment: only delivery and invoice post; the order commits stock without an entry.', de: 'Nur Lieferung und Rechnung buchen.' },
    m: { es: 'Piensa en efecto triple por documento: stock, asiento, saldo del socio.', en: 'Think triple effect per document: stock, entry, partner balance.' },
    p: { es: 'Recorre SYN-SO-0002 hasta cobro y anota el efecto triple de cada paso.', en: 'Walk SYN-SO-0002 to payment noting each step’s triple effect.', de: 'Verfolge SYN-SO-0002 bis Zahlung.' },
    v: { es: 'Cuadra al final: stock -1, COGS+ingreso asentados, saldo cliente 0.', en: 'Reconcile at the end: stock -1, COGS+revenue posted, balance 0.', de: 'Am Ende abstimmen.' },
    vs: [{ es: 'Nombre cada documento y su efecto triple', en: 'Name each document and its triple effect' }, { es: 'Detecta el paso que compromete sin contabilizar', en: 'Spot the step that commits without posting' }, { es: 'Cierra el ciclo con el cobro', en: 'Close the cycle with the payment' }],
    r: { es: 'Facturar sin entrega previa salta la logística: decisión consciente, no atajo.', en: 'Invoicing without prior delivery skips logistics: a conscious choice.', de: 'Direktrechnung ist bewusste Wahl.' },
    tips: { es: ['El pedido no genera asiento: la contabilidad «despierta» en entrega y factura.', 'Reserva ≠ venta: comprometido sigue siendo tuyo hasta entrega.'], en: ['The order posts nothing: accounting wakes at delivery and invoice.', 'Committed stock is still yours until delivery.'] },
    pf: { es: 'Creer que el pedido ya es ingreso porque «ya está vendido».', en: 'Believing the order is already revenue.' },
    d: { k: 'chain', cap: { es: 'O2C: dónde despierta cada efecto', en: 'O2C: where effects wake' }, n: [{ t: 'Pedido', s: 'compromiso' }, { t: 'Entrega', s: 'COGS' }, { t: 'Factura', s: 'ingreso' }, { t: 'Cobro', s: 'cierra' }] },
    a: {
      p: { es: '¿En qué documento del O2C nace el reconocimiento de ingresos?', en: 'In which O2C document is revenue recognised?', de: 'Wo entsteht der Erlös?' },
      opts: { es: ['En la factura (A/R Invoice)', 'En el pedido', 'En la entrega'], en: ['The A/R invoice', 'The order', 'The delivery'], de: ['Rechnung', 'Auftrag', 'Lieferung'] },
      correct: 0,
      why: { es: 'La factura reclama pago y reconoce ingreso; la entrega movió stock y COGS; el pedido solo comprometió.', en: 'The invoice claims payment and recognises revenue; delivery moved stock/COGS; the order only committed.', de: 'Die Rechnung erkennt den Erlös an.' },
      prin: [{ es: 'Ingreso nace con derecho a cobrar', en: 'Revenue born with collection right' }, { es: 'Ingreso nace al comprometer', en: 'Revenue born at commitment' }, { es: 'Ingreso nace al entregar', en: 'Revenue born at delivery' }], prinOk: 0,
      senior: [{ es: 'Separa evento físico (entrega) del financiero (factura)', en: 'Separate physical (delivery) from financial (invoice)' }, { es: 'Verifica impuestos y vencimiento', en: 'Verify taxes and due date' }, { es: 'Confirma el enlace base-destino', en: 'Confirm the base-target link' }],
      dwhy: { es: ['El pedido no da derecho a cobro.', 'La entrega reconoce coste, no ingreso.', 'La factura crea la partida del cliente.'], en: ['The order grants no collection right.', 'Delivery recognises cost, not revenue.', 'The invoice creates the customer’s open item.'], de: ['Auftrag gibt kein Recht.', 'Lieferung: Kosten.', 'Rechnung: offener Posten.'] },
      hints: { es: '¿Qué documento crea la partida abierta del cliente?' }
    }
  }),
  S(2, 1, {
    t: { es: 'Solicitud a pago', en: 'Request to pay', de: 'Anforderung bis Zahlung' },
    o: { es: 'Ejecutar P2P controlando autorización, triple efecto y conciliación.', en: 'Run P2P controlling authorization and 3-way match.', de: 'P2P mit Abgleich steuern.' },
    c: { es: 'Solicitud → Pedido → Entrada → Factura → Pago: la entrada reconoce stock y GR/IR; la factura la deuda; el pago cierra. La conciliación 3-vías es el control central.', en: 'Request → Order → Receipt → Invoice → Payment: receipt books stock+GR/IR; invoice books debt; payment closes. 3-way is central.', de: 'Dreiecksabgleich ist zentral.' },
    m: { es: 'Nada se paga que no haya entrado y conciliado.', en: 'Nothing is paid that has not arrived and matched.' },
    p: { es: 'Concilia SYN-PO-0003 contra entrada y factura; documenta la diferencia.', en: 'Match SYN-PO-0003; document the difference.', de: 'Gleiche SYN-PO-0003 ab.' },
    v: { es: 'Verifica precio, cantidad y condición antes de aprobar pago.', en: 'Verify price, quantity, terms before payment.', de: 'Prüfe vor Zahlung.' },
    vs: [{ es: 'Pedido vs entrada (cantidad)', en: 'Order vs receipt (quantity)' }, { es: 'Entrada vs factura (precio)', en: 'Receipt vs invoice (price)' }, { es: 'Resuelve antes del pago', en: 'Resolve before payment' }],
    r: { es: 'Pagar sin entrada paga mercancía que quizá nunca llegó.', en: 'Paying without receipt pays goods that may never arrive.', de: 'Zahlen ohne Eingang zahlt Luft.' },
    tips: { es: ['La cuenta GR/IR es el detector de mentiras del P2P.', 'Autoriza por importe y riesgo.'], en: ['GR/IR is P2P’s lie detector.', 'Authorize by amount and risk.'] },
    pf: { es: 'Saltarse el 3-vías «esta vez».', en: 'Skipping 3-way «this once».' },
    d: { k: 'chain', cap: { es: 'P2P: el 3-vías decide', en: 'P2P: 3-way decides' }, n: [{ t: 'Pedido', s: 'compromiso' }, { t: 'Entrada', s: 'stock+GR/IR' }, { t: 'Factura', s: 'deuda' }, { t: 'Pago', s: 'cierra' }] },
    a: {
      p: { es: 'La factura SYN-V-04 cobra más caro que el pedido. ¿Qué haces?', en: 'SYN-V-04 invoices higher than ordered. What do you do?', de: 'Rechnung höher als Bestellung. Was tun?' },
      opts: { es: ['Bloquear pago, documentar diferencia, resolver con proveedor', 'Pagar y reclamar después', 'Ajustar la entrada al precio de la factura'], en: ['Block, document, resolve with supplier', 'Pay and claim later', 'Adjust receipt to invoice price'], de: ['Sperren, dokumentieren, klären', 'Zahlen, später reklamieren', 'Eingang anpassen'] },
      correct: 0,
      why: { es: 'El 3-vías detecta exactamente esto: pagar sin resolver mueve la diferencia a un asiento erróneo y pierde la palanca.', en: '3-way catches exactly this: paying unresolved books the difference wrong and loses leverage.', de: 'Der Abgleich fängt das; Zahlen verliert die Position.' },
      prin: [{ es: 'Conciliar antes de pagar', en: 'Match before paying' }, { es: 'Pagar primero', en: 'Pay first' }, { es: 'La realidad se ajusta al documento', en: 'Reality adjusts to documents' }], prinOk: 0,
      senior: [{ es: 'Cuantifica diferencia y causa', en: 'Quantify difference and cause' }, { es: 'Contacta con evidencia del pedido', en: 'Contact with order evidence' }, { es: 'Resuelve por abono, nunca editando entrada', en: 'Resolve via credit memo, never editing receipt' }],
      dwhy: { es: ['Pagar primero convierte diferencia en cobro difícil.', 'Ajustar la entrada reescribe historia física.', 'Bloquear+documentar+resolver protege todo.'], en: ['Paying first turns it into hard collection.', 'Adjusting receipt rewrites history.', 'Block+document+resolve protects everything.'], de: ['Zahlen macht Eintreibung schwer.', 'Anpassen schreibt um.', 'Sperren+Dokumentieren schützt.'] },
      hints: { es: '¿Quién tiene la palanca mientras la factura está impaga?' }
    }
  }),
  S(2, 2, {
    t: { es: 'Actividades CRM', en: 'CRM activities', de: 'CRM-Aktivitäten' },
    o: { es: 'Usar actividades y oportunidades como memoria del proceso comercial.', en: 'Use activities and opportunities as sales memory.', de: 'CRM als Vertriebsgedächtnis.' },
    c: { es: 'CRM registra historial (actividades, oportunidades por etapas) sin efecto contable: su valor es el porqué, no el cuánto.', en: 'CRM records history without accounting effect: the why, not the how much.', de: 'CRM zeigt das Warum.' },
    m: { es: 'La memoria que no se escribe no existe.', en: 'Unwritten memory does not exist.' },
    p: { es: 'Registra SYN-OPP-02 con etapas y actividades realistas.', en: 'Register SYN-OPP-02 with realistic stages.', de: 'Erfasse SYN-OPP-02.' },
    v: { es: 'Verifica que cada etapa tiene siguiente acción y responsable.', en: 'Verify each stage has next action and owner.', de: 'Prüfe Aktion und Owner je Phase.' },
    vs: [{ es: 'Crea oportunidad con etapa', en: 'Create with stage' }, { es: 'Añade actividad por interacción', en: 'Log activity per interaction' }, { es: 'Cierra con resultado', en: 'Close with outcome' }],
    r: { es: 'Sin registro no hay pipeline observable: ventas es cuento, no proceso.', en: 'No logging, no observable pipeline: sales is a story.', de: 'Ohne Erfassung keine Pipeline.' },
    tips: { es: ['Mide conversión por etapa, no solo total.', 'Vincula oferta a oportunidad o el pipeline miente.'], en: ['Measure conversion per stage.', 'Link quote to opportunity or pipeline lies.'] },
    pf: { es: 'Tratar CRM como agenda personal.', en: 'Treating CRM as a personal calendar.' },
    d: { k: 'timeline', cap: { es: 'Etapas hasta cierre', en: 'Stages to close' }, n: [{ t: 'Calificación', s: 'etapa 1' }, { t: 'Propuesta', s: 'etapa 2' }, { t: 'Cierre', s: 'ganado/perdido' }] },
    a: {
      p: { es: 'Pipeline SYN con oportunidades sin actividad semanas. ¿Significado?', en: 'SYN pipeline with weeks-inactive opportunities. Meaning?', de: 'Wochen inaktive Chancen. Bedeutung?' },
      opts: { es: ['O no se registra trabajo o no ocurre: problema de gestión en ambos casos', 'Eficiencia del proceso', 'Borrar las viejas'], en: ['Either work is unlogged or not happening: management problem either way', 'Process efficiency', 'Delete old ones'], de: ['Arbeit unerfasst oder ohne Stelle: Führungsproblem', 'Effizienz', 'Alte löschen'] },
      correct: 0,
      why: { es: 'Sin registro no hay proceso observable: la ausencia es señal de gestión.', en: 'Without logging there is no observable process: absence is a management signal.', de: 'Ohne Erfassung kein Prozess.' },
      prin: [{ es: 'Lo no registrado no es gestionable', en: 'Unlogged is unmanageable' }, { es: 'Silencio = eficiencia', en: 'Silence = efficiency' }, { es: 'Borrar el pasado', en: 'Delete the past' }], prinOk: 0,
      senior: [{ es: 'Distingue dormida de muerta', en: 'Distinguish dormant from dead' }, { es: 'Regla de caducidad por etapa', en: 'Expiry rule per stage' }, { es: 'Cierra con razón de pérdida', en: 'Close with loss reason' }],
      dwhy: { es: ['Asumir eficiencia sin evidencia repite el error.', 'Borrar elimina memoria del porqué.', 'Sin señal no hay gestión.'], en: ['Assuming efficiency without evidence repeats the error.', 'Deleting removes the why-memory.', 'No signal, no management.'], de: ['Effizienz ohne Nachweis.', 'Löschen entfernt Warum.', 'Kein Signal, keine Führung.'] },
      hints: { es: '¿Cómo distinguir «eficiente» de «abandonado» sin datos?' }
    }
  }),
  S(2, 3, {
    t: { es: 'Devoluciones y abonos', en: 'Returns and credit memos', de: 'Retouren und Gutschriften' },
    o: { es: 'Ejecutar devoluciones y abonos como espejos exactos de su documento origen.', en: 'Run returns and credit memos as exact mirrors of their source.', de: 'Retouren als exakte Spiegel fahren.' },
    c: { es: 'La devolución reversa stock y coste; el abono reversa ingreso y deuda; basarse en la factura vs en la entrega cambia qué se revierte y cuánto IVA se corrige.', en: 'The return reverses stock and cost; the credit memo reverses revenue and debt; basing on invoice vs delivery changes what reverses and how much VAT corrects.', de: 'Retoure kehrt Bestand um, Gutschrift Erlös; Basis entscheidet Umfang.' },
    m: { es: 'Todo reverso nace de un original: sin original claro, no hay reverso limpio.', en: 'Every reversal is born from an original: no clear original, no clean reversal.' },
    p: { es: 'Procesa la devolución SYN-RET-01 basada en factura y predice sus asientos.', en: 'Process return SYN-RET-01 based on invoice and predict its entries.', de: 'Buche Retoure SYN-RET-01 zur Rechnung.' },
    v: { es: 'Verifica que stock, COGS, ingreso e IVA revierten completos.', en: 'Verify stock, COGS, revenue, and VAT fully reversed.', de: 'Prüfe vollständige Umkehr.' },
    vs: [{ es: 'Identifica el documento base exacto', en: 'Identify the exact base document' }, { es: 'Elige devolución o abono según qué se corrige', en: 'Choose return or memo per what is corrected' }, { es: 'Comprueba asientos espejo', en: 'Check mirror entries' }],
    r: { es: 'Un abono «a mano» sin base desacopla IVA y stock: auditoría imposible.', en: 'A manual memo without base decouples VAT and stock: impossible audit.', de: 'Gutschrift ohne Basis entkoppelt USt.' },
    tips: { es: ['Retorno basado en entrega corrige logística; basado en factura corrige finanzas: elige el que refleje el hecho real.', 'El abono mantiene el enlace al original: nunca lo pierdas.'], en: ['Return based on delivery corrects logistics; on invoice, finance: pick the one matching reality.', 'The memo keeps the link to the original: never lose it.'] },
    pf: { es: 'Hacer un abono genérico «por importe» cuando la mercancía volvió.', en: 'A generic amount-based memo when goods came back.' },
    d: { k: 'split', cap: { es: 'Reversos espejo: qué corrige cada uno', en: 'Mirror reversals: what each corrects' }, n: [{ t: 'Devolución', s: 'stock+COGS' }, { t: 'Abono', s: 'ingreso+IVA' }, { t: 'Base', s: 'define alcance' }] },
    a: {
      p: { es: 'Cliente SYN devuelve mercancía ya facturada. ¿Qué par de documentos limpia todo?', en: 'A SYN customer returns already-invoiced goods. Which pair cleans everything?', de: 'Kunde gibt fakturierte Ware zurück. Welches Paar?' },
      opts: { es: ['Devolución + abono basados en los originales', 'Solo abono por el importe', 'Solo devolución física'], en: ['Return + credit memo based on the originals', 'Memo alone for the amount', 'Physical return alone'], de: ['Retoure + Gutschrift zur Basis', 'Nur Gutschrift', 'Nur physisch'] },
      correct: 0,
      why: { es: 'La devolución repone stock y revierte COGS; el abono revierte ingreso, deuda e IVA: juntos restauran la realidad completa.', en: 'The return restores stock and reverses COGS; the memo reverses revenue, debt, VAT: together they restore full reality.', de: 'Retoure + Gutschrift stellen alles wieder her.' },
      prin: [{ es: 'Revertir el hecho completo', en: 'Reverse the complete event' }, { es: 'Corregir solo dinero', en: 'Fix money only' }, { es: 'Corregir solo física', en: 'Fix physical only' }], prinOk: 0,
      senior: [{ es: 'Verifica estado de entrega y factura originales', en: 'Verify original delivery and invoice status' }, { es: 'Basa cada reverso en su original exacto', en: 'Base each reversal on its exact original' }, { es: 'Comprueba los cuatro reversos: stock, COGS, ingreso, IVA', en: 'Check all four: stock, COGS, revenue, VAT' }],
      dwhy: { es: ['Solo el abono deja stock virtualmente vendido: inventario físico y contable divergen.', 'Solo devolución deja la deuda viva: cobrarás mercancía devuelta.', 'El par espejo es la única reversión completa y auditable.'], en: ['Memo alone leaves stock virtually sold: physical and book inventory diverge.', 'Return alone leaves debt alive: you will collect returned goods.', 'The mirror pair is the only complete, auditable reversal.'], de: ['Nur Gutschrift: Bestand divergiert.', 'Nur Retoure: Schuld bleibt.', 'Nur das Paar ist vollständig.'] },
      hints: { es: '¿Qué cuatro efectos tuvo la venta original?' }
    }
  }),
  S(2, 4, {
    t: { es: 'Cobros', en: 'Incoming payments', de: 'Eingangszahlungen' },
    o: { es: 'Registrar cobros aplicando partidas y dejar el aging limpio.', en: 'Record payments applying open items and keep aging clean.', de: 'Zahlungen zuordnen und Aging sauber halten.' },
    c: { es: 'El cobro entra por cuenta bancaria y se aplica a facturas concretas (on account si no): la aplicación cierra partidas; sin aplicación, el saldo es verdad pero el aging es ruido.', en: 'Payment lands in the bank account and applies to specific invoices (on account if not): application closes items; without it, balance is true but aging is noise.', de: 'Zuordnung schließt Posten; ohne sie ist Aging Rauschen.' },
    m: { es: 'Cobrar no es cerrar: aplicar es cerrar. El aging vive de partidas cerradas.', en: 'Collecting is not closing: applying is. Aging lives on closed items.' },
    p: { es: 'Aplica el cobro SYN-PAY-05 a sus tres facturas y deja cero on account.', en: 'Apply payment SYN-PAY-05 to its three invoices leaving zero on account.', de: 'Ordne SYN-PAY-05 drei Rechnungen zu.' },
    v: { es: 'Verifica saldo del cliente y aging coherentes tras aplicar.', en: 'Verify customer balance and aging coherent after applying.', de: 'Prüfe Saldo und Aging.' },
    vs: [{ es: 'Identifica facturas objetivo', en: 'Identify target invoices' }, { es: 'Aplica con banco correcto', en: 'Apply with correct bank' }, { es: 'Comprueba aging limpio', en: 'Check clean aging' }],
    r: { es: 'Cobros «on account» acumulados esconden facturas vencidas reales.', en: 'Accumulated on-account payments hide real overdue invoices.', de: 'On-account-Zahlungen verbergen Überfälliges.' },
    tips: { es: ['Un pago parcial mantiene la partida abierta con saldo menor: no la cierra.', 'Concilia el banco (extracto) con los cobros registrados periódicamente.'], en: ['A partial payment keeps the item open with lower balance: does not close it.', 'Reconcile the bank statement with recorded payments periodically.'] },
    pf: { es: 'Registrar el cobro sin aplicarlo «por rapidez» y que el aging mienta.', en: 'Recording payment without applying «for speed», aging lies.' },
    d: { k: 'gauge', cap: { es: 'Cobro aplicado vs on account', en: 'Applied vs on account' }, n: [{ t: 'Banco', s: '+10.000' }, { t: 'Aplicado', s: 'cierra partidas' }, { t: 'On account', s: 'aging ruidoso' }] },
    a: {
      p: { es: 'SYN cobra 10.000 sin saber a qué facturas. ¿Cómo se registra?', en: 'SYN receives 10,000 with unknown target invoices. How recorded?', de: '10.000 ohne Rechnungsbezug. Wie buchen?' },
      opts: { es: ['On account temporal + investigación inmediata para aplicar', 'On account para siempre', 'Aplicar a la factura más antigua «por lógica»'], en: ['Temporary on account + immediate investigation to apply', 'On account forever', 'Apply to oldest invoice «by logic»'], de: ['Temporär on account + sofort klären', 'Dauerhaft on account', 'Ältester Rechnung zuweisen'] },
      correct: 0,
      why: { es: 'On account es un estado puente legítimo, no un destino: sin aplicación, el aging miente por omisión.', en: 'On account is a legitimate bridge state, not a destination: without application, aging lies by omission.', de: 'On account ist Brücke, kein Ziel.' },
      prin: [{ es: 'Todo cobro acaba aplicado', en: 'Every payment ends applied' }, { es: 'On account es destino', en: 'On account is a destination' }, { es: 'FIFO es ley', en: 'FIFO is law' }], prinOk: 0,
      senior: [{ es: 'Registra on account con fecha y referencia bancaria', en: 'Record on account with date and bank reference' }, { es: 'Investiga destino con el cliente el mismo día', en: 'Investigate destination with the customer same day' }, { es: 'Aplica y verifica aging', en: 'Apply and verify aging' }],
      dwhy: { es: ['On account eterno es un depósito sin conciliar disfrazado.', 'Asignar «por lógica» puede pagar la factura equivocada y ocultar la vencida real.', 'El puente + investigación es el único flujo íntegro.'], en: ['Eternal on-account is an unreconciled deposit in disguise.', 'Assigning «by logic» can pay the wrong invoice and hide the real overdue one.', 'Bridge + investigation is the only integral flow.'], de: ['On account ewig = unvermittelter Deposit.', 'Logikzuweisung trifft falsch.', 'Brücke + Klärung ist integer.'] },
      hints: { es: '¿Qué dice el aging de este cliente mientras el cobro está sin aplicar?' }
    }
  }),
  S(2, 5, {
    t: { es: 'Pagos', en: 'Outgoing payments', de: 'Ausgangszahlungen' },
    o: { es: 'Pagar con autorización, vencimiento y evidencia de 3-vías cerrado.', en: 'Pay with authorization, due date, and closed 3-way evidence.', de: 'Zahlen mit Freigabe und Abgleich.' },
    c: { es: 'El pago sale de banco y cierra facturas de proveedor; el outgoing payment con base en factura mantiene el enlace y la trazabilidad del desembolso.', en: 'Payment leaves bank and closes supplier invoices; outgoing payment based on invoice keeps disbursement traceability.', de: 'Zahlung schließt Lieferantenrechnungen nachvollziehbar.' },
    m: { es: 'Cada pago es una decisión de tesorería con firma: no un trámite de pantalla.', en: 'Every payment is a treasury decision with a signature: not a screen formality.' },
    p: { es: 'Paga SYN-INV-P-02 con descuento por pronto pago capturado.', en: 'Pay SYN-INV-P-02 capturing the early-payment discount.', de: 'Zahle SYN-INV-P-02 mit Skonto.' },
    v: { es: 'Verifica que el descuento se contabilizó como tal y no como menor pago.', en: 'Verify the discount posted as such, not as underpayment.', de: 'Prüfe Skontobuchung.' },
    vs: [{ es: 'Confirma 3-vías cerrado', en: 'Confirm closed 3-way' }, { es: 'Aplica descuento si procede', en: 'Apply discount if due' }, { es: 'Paga desde cuenta correcta', en: 'Pay from correct account' }],
    r: { es: 'Pagar sin autorización registrada rompe la cadena de responsabilidad ante auditoría.', en: 'Paying without recorded authorization breaks the accountability chain.', de: 'Zahlen ohne Freigabe bricht Verantwortung.' },
    tips: { es: ['El descuento perdido es coste financiero: repórtalo.', 'Programa pagos por vencimiento y descuento, no por montón de escritorio.'], en: ['Lost discount is financing cost: report it.', 'Schedule payments by due date and discount, not desk pile.'] },
    pf: { es: 'Pagar «todos los viernes lo que haya» sin vista de vencimientos.', en: 'Paying «whatever is there every Friday» without a due-date view.' },
    d: { k: 'timeline', cap: { es: 'Pago: vencimiento y descuento deciden', en: 'Payment: due date and discount decide' }, n: [{ t: '3-vías OK', s: 'prerequisito' }, { t: 'Ventana descuento', s: 'día 8' }, { t: 'Vencimiento', s: 'día 30' }] },
    a: {
      p: { es: 'SYN tiene liquidez y factura con 2/10 neto 30 a punto de vencer ventana. ¿Decisión financiera?', en: 'SYN has liquidity and an invoice at 2/10 net 30 about to leave the window. Financial decision?', de: 'Liquidität da, Skontofenster läuft ab. Entscheidung?' },
      opts: { es: ['Pagar dentro de ventana: 2% por 20 días supera cualquier depósito', 'Esperar al vencimiento siempre', 'Pagar la mitad'], en: ['Pay within window: 2% for 20 days beats any deposit', 'Always wait for due date', 'Pay half'], de: ['Im Fenster zahlen: 2% schlagen jede Anlage', 'Immer warten', 'Hälfte zahlen'] },
      correct: 0,
      why: { es: 'El 2% por adelantar 20 días anualiza mucho más que el coste de oportunidad del dinero parado.', en: '2% for advancing 20 days annualises far above idle money’s opportunity cost.', de: '2% auf 20 Tage übersteigt jede Anlage.' },
      prin: [{ es: 'El dinero tiene precio del tiempo', en: 'Money has a time price' }, { es: 'Esperar siempre es prudente', en: 'Waiting is always prudent' }, { es: 'Pagar a medias', en: 'Half payments' }], prinOk: 0,
      senior: [{ es: 'Calcula el coste anualizado del descuento', en: 'Compute the annualised discount cost' }, { es: 'Contrasta con coste de financiación real', en: 'Contrast with real financing cost' }, { es: 'Paga y captura el descuento correcto', en: 'Pay capturing the correct discount' }],
      dwhy: { es: ['Esperar siempre regala el descuento: coste silencioso recurrente.', 'Pagar la mitad pierde el descuento completo y confunde la partida.', 'La aritmética del dinero en el tiempo decide, no la costumbre.'], en: ['Always waiting gifts away the discount: recurring silent cost.', 'Half payment loses the whole discount and confuses the item.', 'Time-value arithmetic decides, not habit.'], de: ['Warten verschenkt Skonto.', 'Halbe Zahlung verliert alles.', 'Zeitwert entscheidet.'] },
      hints: { es: '¿Cuánto rinde ese dinero si no lo usas para capturar el descuento?' }
    }
  }),
  S(2, 6, {
    t: { es: 'Traslados de stock', en: 'Inventory transfers', de: 'Bestandsumlagerungen' },
    o: { es: 'Mover stock entre almacenes con costo, tránsito y visibilidad correctos.', en: 'Move stock between warehouses with correct cost, transit, and visibility.', de: 'Umlagerungen korrekt abwickeln.' },
    c: { es: 'El traslado resta en origen y suma en destino al mismo coste: sin efecto contable si el coste es único y no hay cuentas por almacén; con ellas, re-clasifica entre cuentas de stock.', en: 'Transfer subtracts at origin and adds at destination at same cost: no accounting effect with single cost and no per-warehouse accounts; with them, re-classifies stock accounts.', de: 'Umlagerung bewegt zum gleichen Kostenpreis.' },
    m: { es: 'Un traslado no es una compra ni una venta: es el mismo stock con nueva dirección.', en: 'A transfer is neither purchase nor sale: same stock, new address.' },
    p: { es: 'Transfiere 50 uds SYN-IT-10 de central a norte y verifica coste intacto.', en: 'Transfer 50 units of SYN-IT-10 from central to north and verify intact cost.', de: 'Umlagern und Kosten prüfen.' },
    v: { es: 'Verifica coste unitario idéntico en origen y destino.', en: 'Verify identical unit cost at origin and destination.', de: 'Gleiche Stückkosten prüfen.' },
    vs: [{ es: 'Confirma stock en origen', en: 'Confirm stock at origin' }, { es: 'Transfiere al almacén destino', en: 'Transfer to destination' }, { es: 'Verifica coste y cantidades', en: 'Verify cost and quantities' }],
    r: { es: 'Confundir traslado con venta+compra fabrica ingresos ficticios y contamina KPIs.', en: 'Confusing transfer with sale+purchase fabricates fictitious revenue and pollutes KPIs.', de: 'Umlagerung als Kauf/Verkauf erzeugt Scheinumsatz.' },
    tips: { es: ['El traslado con tránsito (en dos pasos) visibiliza mercancía en camino.', 'Nunca modes stock con facturas: no hay hecho comercial.'], en: ['Two-step transfer with transit visualises goods in motion.', 'Never move stock with invoices: no commercial event.'] },
    pf: { es: 'Facturar internamente entre almacenes propios «para que conste».', en: 'Invoicing between own warehouses «for the record».' },
    d: { k: 'split', cap: { es: 'Traslado: mismo coste, nueva dirección', en: 'Transfer: same cost, new address' }, n: [{ t: 'Origen', s: '−50 uds' }, { t: 'Destino', s: '+50 uds' }, { t: 'Coste', s: 'intacto' }] },
    a: {
      p: { es: 'SYN mueve mercancía entre dos almacenes propios. ¿Documento correcto?', en: 'SYN moves goods between two own warehouses. Correct document?', de: 'Ware zwischen eigenen Lagern. Richtiger Beleg?' },
      opts: { es: ['Traslado de inventario (inventory transfer)', 'Factura de venta + compra interna', 'Ajuste negativo y positivo'], en: ['Inventory transfer', 'Internal sale + purchase invoice', 'Negative and positive adjustment'], de: ['Umlagerung', 'Interne Rechnung', 'Anpassung +/−'] },
      correct: 0,
      why: { es: 'El traslado es el documento nativo: mueve stock sin fabricar un hecho comercial inexistente.', en: 'Transfer is the native document: moves stock without fabricating a nonexistent commercial event.', de: 'Umlagerung ist nativ.' },
      prin: [{ es: 'El documento refleja el hecho', en: 'Document mirrors the event' }, { es: 'Todo movimiento se factura', en: 'Everything gets invoiced' }, { es: 'Ajustes lo arreglan', en: 'Adjustments fix it' }], prinOk: 0,
      senior: [{ es: 'Confirma que ambos almacenes son de la misma sociedad', en: 'Confirm both warehouses belong to the same company' }, { es: 'Usa traslado (o dos pasos con tránsito)', en: 'Use transfer (or two-step with transit)' }, { es: 'Verifica coste y sin asiento espurio', en: 'Verify cost and no spurious entry' }],
      dwhy: { es: ['Facturar internamente crea ingreso y deuda ficticios y contamina impuestos.', 'Los ajustes pierden la trazabilidad del movimiento y el coste puede variar.', 'El traslado preserva coste y trazabilidad sin fabricar nada.'], en: ['Internal invoicing creates fictitious revenue/debt and pollutes taxes.', 'Adjustments lose movement traceability and cost may shift.', 'Transfer preserves cost and traceability fabricating nothing.'], de: ['Interne Rechnung: Scheinumsatz.', 'Anpassung verliert Spur.', 'Umlagerung bleibt sauber.'] },
      hints: { es: '¿Existe un cliente y un proveedor reales en este movimiento?' }
    }
  }),
  S(2, 7, {
    t: { es: 'Descuentos y precios efectivos', en: 'Discounts and effective prices', de: 'Rabatte und Effektivpreise' },
    o: { es: 'Calcular el precio efectivo de línea con toda la cascada aplicada.', en: 'Compute a line’s effective price with the full cascade.', de: 'Effektivpreis mit Kaskade berechnen.' },
    c: { es: 'El precio efectivo = lista − especiales − descuentos (línea y documento); cada capa tiene dueño y motivo; el margen real se mide sobre el efectivo, no sobre la lista.', en: 'Effective price = list − specials − discounts (line and document); each layer has an owner and reason; real margin measures on effective, not list.', de: 'Effektiv = Liste − Sonder − Rabatte; Marge auf Effektiv.' },
    m: { es: 'La lista es teoría; el efectivo es verdad. Presupuesta y audita sobre verdad.', en: 'List is theory; effective is truth. Budget and audit on truth.' },
    p: { es: 'Calcula el efectivo de SYN-SO-0009 línea 3 con su cascada completa.', en: 'Compute SYN-SO-0009 line 3’s effective with full cascade.', de: 'Berechne Effektiv von Zeile 3.' },
    v: { es: 'Verifica que el efectivo del documento coincide con tu cálculo manual.', en: 'Verify the document’s effective matches your manual calculation.', de: 'Gleiche manuell ab.' },
    vs: [{ es: 'Lista base del artículo', en: 'Base list' }, { es: 'Resta especiales y descuentos', en: 'Subtract specials and discounts' }, { es: 'Contrasta con el documento', en: 'Contrast with document' }],
    r: { es: 'Discordancia lista-efectivo no auditada es fuga de margen silenciosa.', en: 'Unaudited list-effective gap is silent margin leakage.', de: 'Ungeprüfte Lücke = stille Margenflucht.' },
    tips: { es: ['Reporta descuento medio por vendedor y cliente: patrones revelan política rota.', 'El descuento de documento se aplica tras el de línea: el orden importa.'], en: ['Report average discount per salesperson and customer: patterns reveal broken policy.', 'Document discount applies after line discount: order matters.'] },
    pf: { es: 'Analizar margen sobre precio de lista y creer que es real.', en: 'Analysing margin on list price believing it real.' },
    d: { k: 'layers', cap: { es: 'Cascada hasta el efectivo', en: 'Cascade to effective' }, n: [{ t: 'Lista', s: '100' }, { t: '− especial', s: '−10' }, { t: '− rango', s: '−5' }, { t: 'Efectivo', s: '85' }] },
    a: {
      p: { es: 'El margen teórico de SYN es 30% pero el real es 18%. ¿Dónde está el 12%?', en: 'SYN’s theoretical margin is 30% but real is 18%. Where is the 12%?', de: 'Theorie 30%, real 18%. Wo sind 12%?' },
      opts: { es: ['En la cascada descuentos+especiales no auditada', 'En el redondeo del sistema', 'En impuestos'], en: ['In the unaudited discounts+specials cascade', 'In system rounding', 'In taxes'], de: ['In der ungeprüften Rabattkaskade', 'Im Runden', 'In Steuern'] },
      correct: 0,
      why: { es: 'La diferencia teoría-real vive en la distancia lista→efectivo: descuentos y especiales sin control explican casi siempre el hueco.', en: 'The theory-real gap lives in the list→effective distance: uncontrolled discounts and specials explain the hole almost always.', de: 'Die Lücke lebt in Liste→Effektiv.' },
      prin: [{ es: 'Auditar la cascada, no la lista', en: 'Audit the cascade, not the list' }, { es: 'El sistema redondea mal', en: 'The system rounds wrong' }, { es: 'Es cosa de impuestos', en: 'It’s a tax thing' }], prinOk: 0,
      senior: [{ es: 'Reconstruye el efectivo de una muestra de líneas', en: 'Reconstruct effective on a line sample' }, { es: 'Mide el descuento medio por capa y dueño', en: 'Measure average discount per layer and owner' }, { es: 'Cierra la capa sin dueño o sin techo', en: 'Close the layer without owner or cap' }],
      dwhy: { es: ['El redondeo mueve céntimos por línea: no explica puntos de margen.', 'Los impuestos no tocan el margen bruto.', 'La cascada es donde viven los puntos perdidos.'], en: ['Rounding moves cents per line: not margin points.', 'Taxes do not touch gross margin.', 'The cascade is where lost points live.'], de: ['Runden: Cent.', 'Steuern berühren Marge nicht.', 'Die Kaskade hält die Punkte.'] },
      hints: { es: '¿Cuánto vale la distancia media lista→efectivo en tu muestra?' }
    }
  })
];
