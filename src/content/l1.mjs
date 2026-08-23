// Nivel 1 — Datos maestros (8 skills únicos). Los 3 primeros con autoría extendida.
import { sk } from './base.mjs';

export const L1 = [
  sk(1, 0, {
    t: { es: 'Socios de negocio', en: 'Business partners', de: 'Geschäftspartner' },
    o: { es: 'Gestionar clientes y proveedores como contenedores de riesgo y crédito.', en: 'Manage customers and suppliers as containers of risk and credit.', de: 'Kunden und Lieferanten als Risiko- und Kreditbehälter führen.' },
    c: { es: 'Un socio unifica datos comerciales (contacto, condiciones) y financieros (cuenta asociada, límite de crédito): un registro gobierna ventas y cobros.', en: 'A partner unifies commercial data (contact, terms) and financial data (control account, credit limit): one record governs sales and collections.', de: 'Ein Partner vereint Vertriebs- und Finanzdaten in einem Datensatz.' },
    m: { es: 'Cada socio es una línea de crédito viva: trátalo como riesgo, no como agenda.', en: 'Every partner is a living credit line: treat it as risk, not as an address book.' },
    p: { es: 'Crea el cliente SYN-BP-10 con las mínimas decisiones correctas (cuenta, término, límite).', en: 'Create customer SYN-BP-10 with the minimal correct decisions (account, term, limit).', de: 'Lege SYN-BP-10 mit minimalen korrekten Entscheidungen an.' },
    v: { es: 'Verifica cuenta asociada, condiciones de pago y límite antes de la primera venta.', en: 'Verify control account, payment terms, and limit before the first sale.', de: 'Prüfe Sammelkonto, Zahlungsbedingung und Limit vor dem ersten Verkauf.' },
    vs: [{ es: 'Confirma cuenta asociada correcta', en: 'Confirm correct control account' }, { es: 'Fija condiciones de pago', en: 'Set payment terms' }, { es: 'Define límite de crédito', en: 'Define credit limit' }],
    r: { es: 'Un socio sin límite de crédito ni verificación de duplicados abre deuda incobrable silenciosa.', en: 'A partner without credit limit or duplicate check opens silent uncollectible debt.', de: 'Ohne Kreditlimit und Dublettenprüfung entsteht stilles Ausfallrisiko.' },
    tips: { es: ['Activa la comprobación de duplicados por registro fiscal desde el día uno.', 'La cuenta asociada se hereda de la configuración: revísala por socio.'], en: ['Enable duplicate check by tax registration from day one.', 'The control account comes from configuration: review it per partner.'] },
    pf: { es: 'Crear un segundo socio para el mismo cliente «para no mezclar pedidos».', en: 'Creating a second partner for the same customer «to keep orders apart».' },
    d: { k: 'hub', cap: { es: 'Un socio: dos caras (comercial + financiera)', en: 'One partner: two faces (commercial + financial)' }, n: [{ t: 'Contacto/condiciones', s: 'comercial' }, { t: 'Cuenta asociada', s: 'financiera' }, { t: 'Límite de crédito', s: 'riesgo' }, { t: 'UN BP', s: 'centro' }] },
    a: {
      prompt: { es: 'Ventas quiere dar de alta un cliente SYN urgente «sin límite». ¿Qué exiges?', en: 'Sales wants to register a SYN customer urgently «without a limit». What do you require?', de: 'Der Verkauf will einen Kunden „ohne Limit“ anlegen. Was forderst du?' },
      opts: { es: ['Límite definido y cuenta asociada verificada antes de la primera factura', 'Darlo de alta ya y ajustar después', 'Rechazar el alta hasta fin de mes'], en: ['A defined limit and verified control account before the first invoice', 'Register now, adjust later', 'Reject registration until month-end'], de: ['Limit und geprüftes Sammelkonto vor der ersten Rechnung', 'Jetzt anlegen, später anpassen', 'Anlage bis Monatsende ablehnen'] },
      correct: 0,
      why: { es: 'El riesgo nace con la primera factura, no cuando te acuerdas: límite y cuenta se fijan en el alta.', en: 'Risk is born with the first invoice, not when remembered: limit and account are set at registration.', de: 'Risiko entsteht mit der ersten Rechnung: Limit und Konto gehören zur Anlage.' },
      prin: [{ es: 'El riesgo se controla en el alta', en: 'Risk is controlled at registration' }, { es: 'La urgencia justifica saltos', en: 'Urgency justifies shortcuts' }, { es: 'Bloquear siempre', en: 'Always block' }], prinOk: 0,
      senior: [{ es: 'Pregunta el modelo de riesgo del cliente antes del importe', en: 'Ask for the customer’s risk model before the amount' }, { es: 'Define quién puede subir el límite y con qué evidencia', en: 'Define who may raise the limit and with what evidence' }, { es: 'Registra el alta con responsable y fecha', en: 'Record the registration with owner and date' }],
      dwhy: { es: ['Alta sin límite = deuda ilimitada silenciosa hasta que la cobranza la descubre.', 'Bloquear el alta paraliza negocio innecesariamente: el punto es controlarla, no pararla.', 'La cuenta mal asignada contabiliza en el mayor equivocado desde el primer asiento.'], en: ['Registering without a limit = silent unlimited debt until collections discover it.', 'Blocking the registration freezes business unnecessarily: control it, don’t stop it.', 'A misassigned control account posts to the wrong G/L from entry one.'], de: ['Anlage ohne Limit = stille unbegrenzte Schuld.', 'Blockade stoppt Geschäft unnötig.', 'Falsches Sammelkonto bucht von Anfang an falsch.'] },
      hints: { es: '¿Cuándo se vuelve real el riesgo de este cliente?' }
    }
  }),
  sk(1, 1, {
    t: { es: 'Artículos', en: 'Items', de: 'Artikel' },
    o: { es: 'Elegir tipo de artículo y valoración con conciencia de sus efectos permanentes.', en: 'Choose item type and valuation aware of permanent effects.', de: 'Artikeltyp und Bewertung bewusst wählen.' },
    c: { es: 'Cada artículo es un contrato contable y logístico: tipo (almacenable, compra, no inventariable) y valoración (estándar, media móvil, FIFO) deciden cómo fluye su coste a P&L.', en: 'Each item is an accounting and logistics contract: type and valuation decide how its cost flows to P&L.', de: 'Typ und Bewertung bestimmen den Kostenfluss in die GuV.' },
    m: { es: 'La valoración que eliges hoy decide el margen que verás durante años.', en: 'The valuation you choose today decides the margin you will see for years.' },
    p: { es: 'Define el artículo SYN-IT-20 para compra-venta pura y razona cada campo.', en: 'Define item SYN-IT-20 for pure buy-sell and reason each field.', de: 'Definiere SYN-IT-20 für reinen Handel.' },
    v: { es: 'Verifica grupo de artículos, valoración e impuestos por localización.', en: 'Verify item group, valuation, and location-dependent taxes.', de: 'Prüfe Warengruppe, Bewertung und Steuern.' },
    vs: [{ es: 'Elige tipo de artículo', en: 'Choose item type' }, { es: 'Fija método de valoración', en: 'Set valuation method' }, { es: 'Verifica grupo e impuestos', en: 'Verify group and taxes' }],
    r: { es: 'Cambiar la valoración con movimientos históricos exige recálculo y cierre: no es un campo cualquiera.', en: 'Changing valuation with history requires recalculation and a close: not an ordinary field.', de: 'Bewertungswechsel mit Historie erfordert Neuberechnung.' },
    tips: { es: ['Media móvil suaviza precios irregulares; FIFO refleja mejor la inflación.', 'El grupo de artículos arrastra cuentas de determinación: elige por contabilidad.'], en: ['Moving average smooths irregular prices; FIFO tracks inflation better.', 'The item group drives determination accounts: choose by accounting.'] },
    pf: { es: 'Crear un artículo «no inventariable» y descubrir el agujero en COGS.', en: 'Creating a «non-inventory» item and discovering the COGS hole.' },
    d: { k: 'tree', cap: { es: 'Contrato del artículo', en: 'The item contract' }, n: [{ t: 'Tipo', s: 'qué mueve' }, { t: 'Valoración', s: 'qué cuesta' }, { t: 'Grupo', s: 'a qué cuenta' }] },
    a: {
      prompt: { es: 'SYN compra y vende el mismo producto físico. ¿Qué tipo de artículo modela?', en: 'SYN buys and resells the same physical product. Which item type?', de: 'SYN kauft und verkauft dasselbe Produkt. Welcher Typ?' },
      opts: { es: ['Almacenable con valoración elegida conscientemente', 'No inventariable «para simplificar»', 'De compra sin valoración'], en: ['Inventory item with consciously chosen valuation', 'Non-inventory «to simplify»', 'Purchase item without valuation'], de: ['Lagerartikel mit bewusster Bewertung', 'Nichtlager „zur Vereinfachung“', 'Einkauf ohne Bewertung'] },
      correct: 0,
      why: { es: 'Un producto físico que cruza tu almacén necesita stock y valoración: sin ellos no hay COGS fiable ni margen medible.', en: 'A physical product crossing your warehouse needs stock and valuation: otherwise no reliable COGS or margin.', de: 'Physische Produkte brauchen Bestand und Bewertung.' },
      prin: [{ es: 'El modelo sigue al flujo físico', en: 'The model follows the physical flow' }, { es: 'Simplificar el dato simplifica la verdad', en: 'Simplify the data, simplify the truth' }, { es: 'Sin stock, sin problema', en: 'No stock, no problem' }], prinOk: 0,
      senior: [{ es: 'Confirma el flujo físico real (¿cruza el almacén?)', en: 'Confirm the real physical flow' }, { es: 'Elige valoración según estabilidad de precios', en: 'Choose valuation per price stability' }, { es: 'Verifica el grupo que determina las cuentas', en: 'Verify the group driving accounts' }],
      dwhy: { es: ['No inventariable elimina el stock: el coste aparece sin trazabilidad y el margen miente.', 'Comprar sin valorar rompe el COGS en la venta.', 'El tipo almacenable refleja el hecho económico completo.'], en: ['Non-inventory removes stock: untracked cost, lying margin.', 'Buying unvalued breaks COGS at sale.', 'Inventory type reflects the full economic event.'], de: ['Nichtlager: Kosten ungetrackt.', 'Kaufen ohne Bewertung bricht COGS.', 'Nur Lagerartikel bildet vollständig ab.'] },
      hints: { es: '¿Qué pierdes si el sistema no ve el stock de este producto?' }
    }
  }),
  sk(1, 2, {
    t: { es: 'Almacenes', en: 'Warehouses', de: 'Lager' },
    o: { es: 'Diseñar la estructura de almacenes como mapa operativo y contable.', en: 'Design the warehouse structure as the operational and accounting map.', de: 'Lagerstruktur als Landkarte entwerfen.' },
    c: { es: 'El almacén separa stock físicamente y puede llevar cuentas propias (por proyecto o sucursal): su estructura decide qué informes pueden existir.', en: 'The warehouse separates stock physically and can carry its own accounts: structure decides which reports can exist.', de: 'Lager trennen physisch und können eigene Konten tragen.' },
    m: { es: 'Diseña almacenes por flujo físico real, no por organigrama.', en: 'Design warehouses by real physical flow, not by org chart.' },
    p: { es: 'Diseña los almacenes SYN: central, tránsito y punto de venta.', en: 'Design SYN warehouses: central, transit, point of sale.', de: 'Entwirf SYN-Lager: zentral, Transit, PoS.' },
    v: { es: 'Verifica que cada almacén necesario por reporting existe antes de cargar stock.', en: 'Verify every reporting-needed warehouse exists before loading stock.', de: 'Prüfe berichtsrelevante Lager vor Bestandsladung.' },
    vs: [{ es: 'Mapa el flujo físico real', en: 'Map the real physical flow' }, { es: 'Define almacén por razón de negocio', en: 'Define warehouse per business reason' }, { es: 'Valida cuentas y dimensiones', en: 'Validate accounts and dimensions' }],
    r: { es: 'Cargar stock sin la estructura completa obliga a re-etiquetar todo después.', en: 'Loading stock without the full structure forces re-labeling later.', de: 'Bestand ohne Struktur erzwingt Um-Etikettieren.' },
    tips: { es: ['Un almacén de tránsito hace visibles mermas que un almacén único esconde.', 'La cuenta por almacén habilita rentabilidad por ubicación.'], en: ['A transit warehouse surfaces shrinkage a single warehouse hides.', 'Per-warehouse accounts enable per-location profitability.'] },
    pf: { es: 'Un único almacén «GLOBAL» para todo y filtrar por proyecto después.', en: 'A single «GLOBAL» warehouse, filtering by project later.' },
    d: { k: 'matrix', cap: { es: 'Almacén = ubicación + cuentas posibles', en: 'Warehouse = location + possible accounts' }, n: [{ t: 'Central', s: 'stock + cuentas' }, { t: 'Tránsito', s: 'visibilidad mermas' }, { t: 'PoS', s: 'stock + ventas' }] },
    a: {
      prompt: { es: 'SYN detecta mermas que un almacén único no explica. ¿Qué estructura ayuda?', en: 'SYN detects shrinkage a single warehouse cannot explain. Which structure helps?', de: 'SYN sieht unerklärlichen Schwund. Welche Struktur hilft?' },
      opts: { es: ['Almacén de tránsito que haga visibles los movimientos intermedios', 'Más campos UDF en el artículo', 'Un informe mensual adicional'], en: ['A transit warehouse surfacing intermediate movements', 'More UDFs on the item', 'An extra monthly report'], de: ['Transitlager für Zwischenbewegungen', 'Mehr UDFs', 'Ein zusätzlicher Bericht'] },
      correct: 0,
      why: { es: 'Lo que no se mide por separado no existe para el sistema: el tránsito convierte las mermas en números visibles.', en: 'What is not measured separately does not exist for the system: transit turns shrinkage into numbers.', de: 'Getrennte Messung macht Schwund sichtbar.' },
      prin: [{ es: 'La estructura crea la visibilidad', en: 'Structure creates visibility' }, { es: 'Los informes lo arreglan todo', en: 'Reports fix everything' }, { es: 'Campos extra, verdad extra', en: 'Extra fields, extra truth' }], prinOk: 0,
      senior: [{ es: 'Cuantifica la merma antes de reestructurar', en: 'Quantify shrinkage before restructuring' }, { es: 'Diseña el tránsito con dueño y recuento periódico', en: 'Design transit with owner and periodic counting' }, { es: 'Pilota en una familia de artículos', en: 'Pilot on one item family' }],
      dwhy: { es: ['Los UDF pintan sobre el problema sin crear la medición que lo detecta.', 'Un informe extra no cambia la granularidad de origen.', 'El tránsito es medición estructural: el agujero se vuelve número.'], en: ['UDFs paint over the problem without creating the measurement.', 'An extra report does not change source granularity.', 'Transit is structural measurement: the hole becomes a number.'], de: ['UDFs messen nichts.', 'Berichte ändern Granularität nicht.', 'Transit macht das Loch zur Zahl.'] },
      hints: { es: '¿Qué movimiento físico es hoy invisible para el sistema?' }
    }
  }),
  sk(1, 3, {
    t: { es: 'Unidades de medida', en: 'Units of measure', de: 'Maßeinheiten' },
    o: { es: 'Definir UoM y factores de conversión sin romper valoración ni stock.', en: 'Define UoM and conversion factors without breaking valuation or stock.', de: 'ME und Faktoren ohne Bruch definieren.' },
    c: { es: 'Cada artículo compra/vende/almacena en unidades con factores de conversión entre ellas; el stock se lleva en la unidad de inventario y cada conversión multiplica el error si el factor está mal.', en: 'Items buy/sell/stock in units with conversion factors; inventory runs in the stocking UoM and every wrong factor multiplies error.', de: 'Bestand läuft in der Lager-ME; falsche Faktoren vervielfachen Fehler.' },
    m: { es: 'El factor de conversión es un contrato matemático: pégalo a la realidad física, no a la comodidad.', en: 'The conversion factor is a mathematical contract: pin it to physical reality, not convenience.' },
    p: { es: 'Modela SYN-IT-30 (cable por metro, vendido por rollo de 100 m).', en: 'Model SYN-IT-30 (cable by metre, sold in 100 m rolls).', de: 'Modelliere SYN-IT-30 (Kabel pro Meter, 100-m-Rolle).' },
    v: { es: 'Verifica que 1 rollo = 100 m en compra, venta y stock.', en: 'Verify 1 roll = 100 m across purchasing, sales, and stock.', de: 'Prüfe 1 Rolle = 100 m überall.' },
    vs: [{ es: 'Define unidad de inventario', en: 'Define inventory UoM' }, { es: 'Fija factores de compra y venta', en: 'Set purchase and sales factors' }, { es: 'Prueba una conversión real', en: 'Test a real conversion' }],
    r: { es: 'Un factor erróneo contamina stock, COGS y precio en cada documento que lo toca.', en: 'A wrong factor contaminates stock, COGS, and price in every document it touches.', de: 'Ein falscher Faktor vergiftet Bestand und COGS.' },
    tips: { es: ['Un decimal de más en el factor = 10× error silencioso en inventario.', 'Documenta la unidad de inventario elegida: cambiarla después requiere recálculo.'], en: ['One extra decimal in the factor = 10× silent inventory error.', 'Document the inventory UoM: changing it later requires recalculation.'] },
    pf: { es: 'Poner factor 1 en todo «por ahora» y corregir con facturas a mano.', en: 'Setting factor 1 everywhere «for now» and fixing invoices by hand.' },
    d: { k: 'gauge', cap: { es: 'Conversión: rollo ↔ metros', en: 'Conversion: roll ↔ metres' }, n: [{ t: '1 rollo', s: 'unidad venta' }, { t: '×100', s: 'factor' }, { t: '100 m', s: 'unidad stock' }] },
    a: {
      prompt: { es: 'SYN vende SYN-IT-30 por rollos pero compra por metros. El stock sale negativo en metros. ¿Causa más probable?', en: 'SYN sells SYN-IT-30 by rolls but buys by metres. Stock goes negative in metres. Most likely cause?', de: 'Bestand negativ in Metern. Wahrscheinlichste Ursache?' },
      opts: { es: ['Factor de conversión rollo→metros incorrecto o ausente', 'Falta de almacenes', 'Error de redondeo del precio'], en: ['Wrong or missing roll→metre conversion factor', 'Missing warehouses', 'Price rounding error'], de: ['Falscher Rollen-Meter-Faktor', 'Fehlende Lager', 'Rundungsfehler'] },
      correct: 0,
      why: { es: 'El stock vive en la unidad de inventario: si el factor no traduce el rollo vendido a metros, cada venta resta de más o de menos.', en: 'Stock lives in the inventory UoM: if the factor does not translate the sold roll into metres, every sale subtracts wrong.', de: 'Bestand lebt in der Lager-ME: falscher Faktor subtrahiert falsch.' },
      prin: [{ es: 'El stock habla una sola unidad', en: 'Stock speaks one UoM' }, { es: 'El stock se adapta al documento', en: 'Stock adapts to the document' }, { es: 'Negativo = bug del sistema', en: 'Negative = system bug' }], prinOk: 0,
      senior: [{ es: 'Identifica la unidad de inventario del artículo', en: 'Identify the item’s inventory UoM' }, { es: 'Recalcula una venta real a mano con el factor configurado', en: 'Recalculate one real sale by hand with the configured factor' }, { es: 'Corrige el factor y verifica el histórico afectado', en: 'Fix the factor and check affected history' }],
      dwhy: { es: ['Los almacenes no convierten unidades: el negativo aparece aunque existan veinte.', 'El redondeo del precio mueve céntimos, no metros.', 'El factor es la única palanca que explica magnitudes negativas.'], en: ['Warehouses do not convert units: negativity appears regardless of count.', 'Price rounding moves cents, not metres.', 'The factor is the only lever explaining negative magnitudes.'], de: ['Lager konvertieren nicht.', 'Rundung bewegt Cent.', 'Nur der Faktor erklärt Negativwerte.'] },
      hints: { es: '¿En qué unidad lleva el sistema el stock de ese artículo?' }
    }
  }),
  sk(1, 4, {
    t: { es: 'Listas de precios', en: 'Price lists', de: 'Preislisten' },
    o: { es: 'Estructurar listas y precios especiales sin degenerar el precio efectivo.', en: 'Structure lists and special prices without corrupting effective price.', de: 'Preislisten ohne beschädigten Effektivpreis strukturieren.' },
    c: { es: 'Las listas dan el precio base por artículo; los precios especiales (por cliente, cantidad, periodo) lo refinan; el precio efectivo de cada línea es el resultado de esa cascada más descuentos.', en: 'Lists give the base price; special prices (per customer, quantity, period) refine it; each line’s effective price is that cascade plus discounts.', de: 'Listen geben Basis, Sonderpreise verfeinern: die Kaskade ergibt den Effektivpreis.' },
    m: { es: 'El precio efectivo es un veredicto, no un número: entiende la cascada antes de tocarla.', en: 'Effective price is a verdict, not a number: understand the cascade before touching it.' },
    p: { es: 'Construye la cascada de SYN-BP-03 sobre SYN-IT-10: lista, especial, descuento.', en: 'Build SYN-BP-03’s cascade on SYN-IT-10: list, special, discount.', de: 'Baue die Kaskade für SYN-BP-03 auf.' },
    v: { es: 'Verifica el precio efectivo en una línea real antes de publicar cambios.', en: 'Verify effective price on a real line before publishing changes.', de: 'Prüfe den Effektivpreis an echter Position.' },
    vs: [{ es: 'Identifica lista base del artículo', en: 'Identify item base list' }, { es: 'Localiza especiales aplicables', en: 'Locate applicable specials' }, { es: 'Calcula efectivo con descuento', en: 'Compute effective with discount' }],
    r: { es: 'Precios especiales sin fecha de fin vencen para siempre: margen perforado silencioso.', en: 'Special prices without end date expire never: silently perforated margin.', de: 'Sonderpreise ohne Enddatum laufen ewig.' },
    tips: { es: ['Audita periódicamente especiales con fecha fin vacía.', 'Pocas listas bien pensadas > muchas listas que nadie mapea.'], en: ['Periodically audit specials with empty end dates.', 'Few well-designed lists > many lists nobody maps.'] },
    pf: { es: 'Crear una lista nueva por cada promoción y perder el mapa.', en: 'Creating a new list per promotion and losing the map.' },
    d: { k: 'layers', cap: { es: 'Cascada del precio efectivo', en: 'Effective price cascade' }, n: [{ t: 'Lista base', s: '100' }, { t: 'Especial cliente', s: '−10' }, { t: 'Descuento línea', s: '−5%' }, { t: 'Efectivo', s: 'veredicto' }] },
    a: {
      prompt: { es: 'El margen de SYN cayó sin causa aparente. ¿Qué revisas en precios?', en: 'SYN’s margin fell without apparent cause. What do you review in pricing?', de: 'Die Marge fiel ohne Grund. Was prüfst du?' },
      opts: { es: ['Especiales y descuentos con fecha fin vacía o periodo eterno', 'El nombre de las listas', 'El número de almacenes'], en: ['Specials and discounts with empty end dates or eternal periods', 'List names', 'Warehouse count'], de: ['Sonderpreise ohne Enddatum', 'Listennamen', 'Lageranzahl'] },
      correct: 0,
      why: { es: 'Los especiales olvidados siguen aplicando años después: cada línea perfora el margen sin rastro visible.', en: 'Forgotten specials keep applying years later: every line silently perforates margin.', de: 'Vergessene Sonderpreise laufen jahrelang weiter.' },
      prin: [{ es: 'Todo especial expira', en: 'Every special expires' }, { es: 'El nombre explica el margen', en: 'Names explain margin' }, { es: 'Más estructura, más margen', en: 'More structure, more margin' }], prinOk: 0,
      senior: [{ es: 'Extrae todos los especiales activos sin fecha fin', en: 'Extract all active specials without end date' }, { es: 'Cruza con volumen vendido para priorizar', en: 'Cross with sold volume to prioritise' }, { es: 'Pon fecha fin o elimina con aprobación comercial', en: 'End-date or remove with sales approval' }],
      dwhy: { es: ['Los nombres no mueven importes: la auditoría es de fechas, no de etiquetas.', 'El número de almacenes no toca el precio de línea.', 'La auditoría de vigencias es la única que encuentra dinero.'], en: ['Names move no amounts: audit dates, not labels.', 'Warehouse count does not touch line price.', 'Expiry auditing is the only one that finds money.'], de: ['Namen bewegen keine Beträge.', 'Lager berühren Preise nicht.', 'Nur Fristaudit findet Geld.'] },
      hints: { es: '¿Qué precio especial sigue vivo hoy sin que nadie lo recuerde?' }
    }
  }),
  sk(1, 5, {
    t: { es: 'Códigos fiscales: control de riesgo', en: 'Tax codes: risk control', de: 'Steuercodes: Risikokontrolle' },
    o: { es: 'Tratar los códigos fiscales como configuración de riesgo, no como relleno.', en: 'Treat tax codes as risk configuration, not filler.', de: 'Steuercodes als Risikokonfiguration behandeln.' },
    c: { es: 'El código fiscal define tipo, tasa y cuenta contable por localización y operación; asignarlo mal contamina el asiento y la declaración desde el primer documento.', en: 'The tax code defines type, rate, and G/L account per localisation and operation; a wrong one contaminates the entry and the return from document one.', de: 'Der Steuercode definiert Satz und Konto je Land und Vorgang.' },
    m: { es: 'Cada código fiscal es una promesa ante Hacienda: verifícala o no la firmes.', en: 'Every tax code is a promise to the tax authority: verify it or don’t sign it.' },
    p: { es: 'Clasifica los códigos SYN por operación y localización antes de usarlos.', en: 'Classify SYN codes by operation and localisation before use.', de: 'Klassifiziere SYN-Codes vor Verwendung.' },
    v: { es: 'Verifica tasa y cuenta contra la normativa de la localización activa.', en: 'Verify rate and account against the active localisation’s rules.', de: 'Prüfe Satz und Konto gegen die Lokalisierung.' },
    vs: [{ es: 'Identifica operación y localización', en: 'Identify operation and localisation' }, { es: 'Verifica tasa y cuenta', en: 'Verify rate and account' }, { es: 'Prueba en documento SYN', en: 'Test on a SYN document' }],
    r: { es: 'Deducir un código «por descripción parecida» genera declaraciones erróneas con intereses.', en: 'Inferring a code «by similar description» produces wrong returns with interest.', de: 'Analogeschlüsse erzeugen falsche Erklärungen.' },
    tips: { es: ['Un país, una tabla: nunca copies códigos entre localizaciones.', 'El código correcto depende de operación + localización + sujeto: las tres.'], en: ['One country, one table: never copy codes across localisations.', 'The right code depends on operation + localisation + subject: all three.'] },
    pf: { es: 'Elegir el código «que se usa siempre» sin validar la operación concreta.', en: 'Picking the «always used» code without validating the concrete operation.' },
    d: { k: 'matrix', cap: { es: 'Código = operación × localización × sujeto', en: 'Code = operation × localisation × subject' }, n: [{ t: 'Venta nacional', s: 'tasa A' }, { t: 'Venta UE', s: 'regla B' }, { t: 'Exportación', s: 'tasa C' }] },
    a: {
      prompt: { es: 'Una línea SYN exporta fuera de la UE. El comercial aplica el código nacional «de siempre». ¿Riesgo?', en: 'A SYN line exports outside the EU. Sales applies the usual national code. Risk?', de: 'Export außerhalb der EU mit nationalem Code. Risiko?' },
      opts: { es: ['Exención no declarada: declaración fiscal errónea con rectificación e intereses', 'Ninguno: el importe es el mismo', 'Solo cosmético en el PDF'], en: ['Undeclared exemption: wrong tax return with rectification and interest', 'None: same amount', 'Only cosmetic in the PDF'], de: ['Nicht erklärte Befreiung: falsche Erklärung mit Zinsen', 'Keiner: gleicher Betrag', 'Nur kosmetisch'] },
      correct: 0,
      why: { es: 'La exportación suele exonerarse pero debe declararse como tal: el código nacional la grava y declara mal.', en: 'Exports are typically exempt but must be declared as such: the national code taxes and declares it wrong.', de: 'Exporte sind befreit, müssen aber so erklärt werden.' },
      prin: [{ es: 'La operación manda, no la costumbre', en: 'The operation rules, not habit' }, { es: 'Mismo importe, mismo riesgo', en: 'Same amount, same risk' }, { es: 'El PDF es lo que cuenta', en: 'The PDF is what counts' }], prinOk: 0,
      senior: [{ es: 'Confirma destino y naturaleza de la operación', en: 'Confirm destination and operation nature' }, { es: 'Aplica el código de exportación de la localización activa', en: 'Apply the active localisation’s export code' }, { es: 'Documenta la evidencia (aduanera) de la exportación', en: 'Document the (customs) evidence' }],
      dwhy: { es: ['El importe puede coincidir y la declaración ser errónea: el riesgo es legal, no aritmético.', 'El PDF refleja el código: si el código miente, el PDF miente.', 'La rectificación tardía añade intereses y reputación.'], en: ['Amounts may match while the return is wrong: legal risk, not arithmetic.', 'The PDF mirrors the code: wrong code, wrong PDF.', 'Late rectification adds interest and reputation damage.'], de: ['Gleicher Betrag, falsche Erklärung.', 'Der PDF spiegelt den Code.', 'Spätkorrektur kostet Zinsen.'] },
      hints: { es: '¿Qué declaración presenta tu empresa con ese código?' }
    }
  }),
  sk(1, 6, {
    t: { es: 'Condiciones de pago', en: 'Payment terms', de: 'Zahlungsbedingungen' },
    o: { es: 'Dominar cómo las condiciones mueven vencimientos, descuentos y aging.', en: 'Master how terms move due dates, discounts, and aging.', de: 'Bedingungen steuern Fälligkeit und Aging.' },
    c: { es: 'La condición calcula la fecha de vencimiento de cada factura (y descuentos por pronto pago si existen); el aging y la presión de cobro se construyen sobre ese resultado.', en: 'Terms compute each invoice’s due date (and early-payment discounts if any); aging and collection pressure build on that result.', de: 'Bedingungen berechnen Fälligkeit; Aging baut darauf.' },
    m: { es: 'Cambiar una condición reprograma la cobranza de todo lo que venga: no es un campo inocente.', en: 'Changing a term reschedules collections for everything incoming: not an innocent field.' },
    p: { es: 'Compara SYN-BP-01 con 30 días vs 2/10 neto 30 en una factura de 10.000.', en: 'Compare SYN-BP-01 at 30 days vs 2/10 net 30 on a 10,000 invoice.', de: 'Vergleiche 30 Tage vs 2/10 netto 30.' },
    v: { es: 'Verifica vencimiento y descuento calculados en la factura real.', en: 'Verify computed due date and discount on the real invoice.', de: 'Prüfe Fälligkeit und Skonto an der Rechnung.' },
    vs: [{ es: 'Lee la condición del socio', en: 'Read the partner’s term' }, { es: 'Predice vencimiento y descuento', en: 'Predict due date and discount' }, { es: 'Confirma en el documento', en: 'Confirm on the document' }],
    r: { es: 'Una condición mal definida mueve todo el aging: la cobranza persigue fechas falsas.', en: 'A badly defined term shifts the whole aging: collections chase false dates.', de: 'Falsche Bedingungen verschieben das Aging.' },
    tips: { es: ['El descuento por pronto pago es coste financiero: midelo como tal.', 'Sincroniza la condición del maestro con los acuerdos reales firmados.'], en: ['Early-payment discount is financing cost: measure it as such.', 'Sync the master term with the actually signed agreements.'] },
    pf: { es: 'Dejar la condición por defecto «contado» en clientes de 60 días.', en: 'Leaving default term «immediate» on 60-day customers.' },
    d: { k: 'timeline', cap: { es: 'Condición → vencimiento → aging', en: 'Term → due date → aging' }, n: [{ t: 'Factura día 0', s: '10.000' }, { t: '2/10 neto 30', s: 'descuento o 30d' }, { t: 'Aging', s: 'por vencimiento' }] },
    a: {
      prompt: { es: 'SYN ofrece 2% descuento si pagan en 10 días (2/10 neto 30). ¿Cómo se lee?', en: 'SYN offers 2% discount for payment within 10 days (2/10 net 30). How to read it?', de: 'Wie ist 2/10 netto 30 zu lesen?' },
      opts: { es: ['Coste financiero del 2% por adelantar 20 días: compáralo con tu coste de capital', 'Un regalo al cliente sin efecto en mí', 'Un retraso encubierto del cobro'], en: ['A 2% financing cost for advancing 20 days: compare with your capital cost', 'A free gift to the customer', 'A hidden collection delay'], de: ['2% Finanzierungskosten für 20 Tage Vorziehung', 'Ein Geschenk', 'Verzögerter Zahlungseingang'] },
      correct: 0,
      why: { es: 'Adelantar el cobro 20 días cuesta el 2%: si tu coste de capital anual es menor, el descuento encarece el dinero.', en: 'Advancing collection 20 days costs the 2%: if your annual capital cost is lower, the discount makes money expensive.', de: '20 Tage Vorzug kosten 2%: vergleiche mit Kapitalkosten.' },
      prin: [{ es: 'El descuento es precio del dinero', en: 'Discount is the price of money' }, { es: 'Descuento = regalo', en: 'Discount = gift' }, { es: 'Descuento = retraso', en: 'Discount = delay' }], prinOk: 0,
      senior: [{ es: 'Anualiza el coste implícito del descuento', en: 'Annualise the discount’s implied cost' }, { es: 'Compara con la línea de crédito de la empresa', en: 'Compare with the company’s credit line' }, { es: 'Decide política por cliente, no por simpatía', en: 'Decide policy per customer, not sympathy' }],
      dwhy: { es: ['Regalar 2% sin análisis destruye margen equivalente a subir precio negativo.', 'No es retraso: el cliente decide adelantar o no; tú pagas por su decisión.', 'El análisis financiero es la única lectura profesional.'], en: ['Gifting 2% without analysis destroys margin like a negative price hike.', 'Not a delay: the customer chooses to advance; you pay for their choice.', 'Financial analysis is the only professional reading.'], de: ['2% ohne Analyse zerstört Marge.', 'Kein Verzug: der Kunde wählt.', 'Nur die Finanzsicht ist professionell.'] },
      hints: { es: '¿Cuánto pagas hoy por adelantar dinero 20 días?' }
    }
  }),
  sk(1, 7, {
    t: { es: 'Autorizaciones básicas', en: 'Basic authorizations', de: 'Grundberechtigungen' },
    o: { es: 'Aplicar el modelo de permisos por usuario con mínimo privilegio.', en: 'Apply the per-user permission model with least privilege.', de: 'Berechtigungen nach Minimalprinzip.' },
    c: { es: 'B1 autoriza por usuario sobre objetos y transacciones (con licencias como frontera dura); el mínimo privilegio reduce error y fraude a la vez.', en: 'B1 authorizes per user over objects and transactions (licenses as the hard boundary); least privilege cuts error and fraud together.', de: 'B1 berechtigt je Benutzer; Minimalprinzip senkt Fehler und Betrug.' },
    m: { es: 'Da el permiso mínimo que deja trabajar; ampliar es fácil, detectar el exceso es caro.', en: 'Grant the minimum that lets work flow; widening is easy, detecting excess is expensive.' },
    p: { es: 'Define el rol SYN «comercial junior»: qué sí, qué no, qué con límite.', en: 'Define the SYN «junior sales» role: yes, no, and capped.', de: 'Definiere Rolle „Junior-Vertrieb“.' },
    v: { es: 'Verifica el rol con un usuario real: puede trabajar, no puede dañar.', en: 'Verify the role with a real user: can work, cannot harm.', de: 'Prüfe mit realem Benutzer.' },
    vs: [{ es: 'Lista tareas reales del rol', en: 'List the role’s real tasks' }, { es: 'Mapea permisos mínimos', en: 'Map minimal permissions' }, { es: 'Prueba caso positivo y negativo', en: 'Test positive and negative case' }],
    r: { es: 'Usuarios con permisos «por si acaso» convierten errores personales en incidentes globales.', en: '«Just in case» permissions turn personal errors into global incidents.', de: '„Auf Vorrat“-Rechte machen Fehler global.' },
    tips: { es: ['Audita permisos con periodicidad: los roles derivan hacia el exceso solos.', 'El caso negativo (no puede) es tan importante como el positivo.'], en: ['Audit permissions periodically: roles drift to excess alone.', 'The negative case (cannot) matters as much as the positive.'] },
    pf: { es: 'Clonar el perfil del administrador «para que no molesten con permisos».', en: 'Cloning the administrator profile «so permissions never bother anyone».' },
    d: { k: 'tree', cap: { es: 'Mínimo privilegio por rol', en: 'Least privilege per role' }, n: [{ t: 'Junior', s: 'crear, no borrar' }, { t: 'Senior', s: 'crear + aprobar' }, { t: 'Admin', s: 'configurar' }] },
    a: {
      prompt: { es: 'Un comercial SYN junior necesita ver márgenes pero no cambiar precios. ¿Cómo se modela?', en: 'A SYN junior salesperson must see margins but not change prices. How to model it?', de: 'Junior soll Marge sehen, Preise nicht ändern. Wie?' },
      opts: { es: ['Permiso de lectura en precio, escritura denegada, con límite de descuento propio', 'Ver todo y confiar', 'Ocultar el campo precio de la pantalla'], en: ['Read permission on price, denied write, with own discount cap', 'See everything and trust', 'Hide the price field from the screen'], de: ['Lesen erlaubt, Schreiben verweigert, Rabattobergrenze', 'Alles sehen und vertrauen', 'Feld ausblenden'] },
      correct: 0,
      why: { es: 'El modelo de autorización distingue leer y escribir por objeto: es la herramienta exacta para este caso, más el límite de descuento.', en: 'The authorization model separates read from write per object: the exact tool here, plus the discount cap.', de: 'Das Modell trennt Lesen/Schreiben: exakt das Werkzeug.' },
      prin: [{ es: 'Permiso = mínimo que habilita', en: 'Permission = enabling minimum' }, { es: 'Confianza es control', en: 'Trust is control' }, { es: 'Ocultar = negar', en: 'Hiding = denying' }], prinOk: 0,
      senior: [{ es: 'Separa las tres necesidades: ver, crear, aprobar', en: 'Separate the three needs: see, create, approve' }, { es: 'Configura permisos por objeto y límite de descuento', en: 'Configure permissions by object and discount cap' }, { es: 'Prueba con usuario real ambos casos', en: 'Test both cases with a real user' }],
      dwhy: { es: ['Ver todo sin control traslada el riesgo al auditor interno: el fraude nace del exceso.', 'Ocultar el campo no niega el permiso: cualquier informe o export lo expone.', 'La combinación leer-sí/escribir-no es nativa y auditable.'], en: ['Seeing all without control moves risk to internal audit: fraud is born of excess.', 'Hiding the field does not deny permission: any report exposes it.', 'Read-yes/write-no is native and auditable.'], de: ['Alles sehen verlagert Risiko zum Audit.', 'Ausblenden verweigert nicht.', 'Lesen-ja/Schreiben-nein ist nativ.'] },
      hints: { es: '¿Qué diferencia hay entre no ver un dato y no poder cambiarlo?' }
    }
  })
];
