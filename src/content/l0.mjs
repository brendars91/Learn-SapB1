// Nivel 0 — Fundamentos (8 skills únicos) + anclas, rutas y ejemplos trabajados.
import { sk } from './base.mjs';

export const L0 = [
  sk(0, 0, {
    t: { es: 'El mapa completo', en: 'The complete map', de: 'Die komplette Landkarte' },
    an: { g: '🧭', es: 'Un SAP B1 es una ciudad: los módulos son barrios, los documentos son las calles que los conectan. Antes de moverte, mira el plano — no la guía de calles calle por calle.', en: 'A SAP B1 is a city: modules are neighbourhoods, documents are the streets connecting them. Look at the map first — not the street-by-street guide.' },
    pa: ['Inicio', 'Módulos', 'Identificar los 8 barrios'],
    ex: {
      q: 'Un pedido de cliente cruza 4 barrios. ¿Cuáles, en qué orden?',
      show: [
        'Ventas → pedido (entrada)',
        'Logística → entrega (stock)',
        'Finanzas → factura (libro mayor)',
        'Banco → pago (cobro)'
      ],
      a: { es: 'Venta → Stock → Libro mayor → Liquidez. Cada documento es la calle que une dos barrios.', en: 'Sale → Stock → Ledger → Liquidity. Each document is the street joining two neighbourhoods.' }
    },
    o: { es: 'Orientarse en los módulos y en cómo un documento viaja por el sistema.', en: 'Get oriented in the modules and how a document travels through the system.', de: 'Sich in den Modulen orientieren und den Weg eines Belegs verstehen.' },
    c: { es: 'SAP B1 organiza la operación en módulos (ventas, compras, logística, banco, finanzas, producción, recursos, CRM). Cada transacción es un documento numerado que pertenece a un barrio y afecta a los demás: el pedido reserva, la entrega mueve stock, la factura contabiliza, el pago liquida. Dominar B1 es dominar el itinerario de los documentos, no memorizar pantallas.', en: 'SAP B1 organizes operations into modules (sales, purchasing, logistics, banking, finance, production, resources, CRM). Every transaction is a numbered document belonging to one neighbourhood and affecting the others: the order reserves, the delivery moves stock, the invoice posts, the payment settles. Mastering B1 is mastering document itineraries, not memorising screens.', de: 'SAP B1 organisiert den Betrieb in Module (Verkauf, Einkauf, Logistik, Bank, Finanzen, Produktion, Ressourcen, CRM). Jede Transaktion ist ein nummerierter Beleg, der zu einem Viertel gehört und die anderen beeinflusst: der Auftrag reserviert, die Lieferung bewegt Bestand, die Rechnung bucht, die Zahlung löscht. B1 beherrschen heißt, Belegwege beherrschen — nicht Bildschirme auswendig lernen.' },
    m: { es: 'Piensa «itinerario del documento», no «pantalla suelta».', en: 'Think "document itinerary", not "standalone screen".', de: 'Denke „Belegweg“, nicht „Einzelbildschirm“.' },
    p: { es: 'Toma una venta típica y nómbrala: por qué módulos pasa, qué documento se crea en cada uno y qué efecto tiene.', en: 'Take a typical sale and name the modules it crosses, the document created in each, and its effect.', de: 'Nimm einen typischen Verkauf und nenne die Module, Belege und Wirkungen.' },
    v: { es: 'Puedes recitar el itinerario pedido→entrega→factura→pago y sus efectos.', en: 'You can recite the order→delivery→invoice→payment itinerary and its effects.', de: 'Du kannst den Weg Auftrag→Lieferung→Rechnung→Zahlung und seine Wirkungen aufsagen.' },
    vs: [
      { es: 'Dibujar el itinerario completo de una venta', en: 'Draw the complete itinerary of one sale' },
      { es: 'Señalar el documento de cada módulo', en: 'Name each module\'s document' },
      { es: 'Explicar el efecto de cada documento (reserva/stock/asiento/saldo)', en: 'Explain each document\'s effect (reserve/stock/journal/balance)' },
      { es: 'Localizar los módulos en el menú real', en: 'Locate the modules in the real menu' }
    ],
    r: { es: 'Bajo: riesgo operacional controlado en este paso.', en: 'Low: controlled operational risk at this step.', de: 'Niedrig: kontrolliertes operatives Risiko in diesem Schritt.' },
    tips: { es: ['El botón "Destino" de cada documento es tu brújula: muestra hacia dónde puede viajar.', 'Los documentos numerados con "borrador" aún no han salido de la estación.'], en: ['Each document\'s "Target" button is your compass: it shows where it can travel next.', 'Documents numbered as "draft" have not left the station yet.'], de: ['Der Ziel-Button jedes Belegs ist dein Kompass: er zeigt, wohin er reisen kann.', 'Belege mit „Entwurf“-Nummerierung haben den Bahnhof noch nicht verlassen.'] },
    pf: { es: 'El junior memoriza pantallas; el senior sigue documentos. Si no sabes qué documento creó este documento, aún no entiendes el barrio.', en: 'Juniors memorise screens; seniors follow documents. If you can\'t say which document created this one, you don\'t understand the neighbourhood yet.', de: 'Juniors lernen Bildschirme auswendig; Seniors folgen Belegen. Wenn du nicht sagen kannst, welcher Beleg diesen erzeugt hat, verstehst du das Viertel noch nicht.' },
    d: { k: 'hub', cap: { es: 'Los barrios y sus calles', en: 'Neighbourhoods and their streets' }, n: [{ t: 'Ventas', s: 'origen' }, { t: 'Logística', s: 'tránsito' }, { t: 'Finanzas', s: 'destino' }, { t: 'Banco', s: 'liquidación' }] },
    a: {
      p: { es: 'Un pedido entra por Ventas. ¿Qué efecto tiene ya, antes de la entrega?', en: 'An order arrives in Sales. What effect does it already have, before delivery?', de: 'Ein Auftrag kommt im Verkauf an. Welche Wirkung hat er schon vor der Lieferung?' },
      opts: { es: ['Reserva stock y compromiso, no movimiento contable', 'Contabiliza ingresos anticipados', 'Mueve stock físico'], en: ['Reserves stock and commitment — no accounting movement', 'Posts advance revenue', 'Moves physical stock'], de: ['Reserviert Bestand und Verpflichtung — keine Buchung', 'Bucht Vorauserlöse', 'Bewegt physischen Bestand'] },
      correct: 0,
      why: { es: 'El pedido es promesa: reserva (committed) y avisa a compras, pero el libro mayor espera a la factura.', en: 'The order is a promise: it reserves (committed) and alerts purchasing, but the ledger waits for the invoice.', de: 'Der Auftrag ist ein Versprechen: er reserviert und warnt den Einkauf, aber das Hauptbuch wartet auf die Rechnung.' },
      prin: [{ es: 'Promesa ≠ movimiento', en: 'Promise ≠ movement', de: 'Versprechen ≠ Bewegung' }, { es: 'El libro mayor espera a la factura', en: 'The ledger waits for the invoice', de: 'Das Hauptbuch wartet auf die Rechnung' }, { es: 'Reservar no es entregar', en: 'Reserving is not delivering', de: 'Reservieren ist nicht liefern' }],
      senior: [
        { es: '1. El pedido reduce "disponible" (committed) sin tocar el físico.', en: '1. The order reduces "available" (committed) without touching physical stock.', de: '1. Der Auftrag reduziert „verfügbar“ ohne den physischen Bestand zu berühren.' },
        { es: '2. MRP lo lee como demanda y puede proponer compra.', en: '2. MRP reads it as demand and may propose purchase.', de: '2. MRP liest ihn als Bedarf und kann Einkauf vorschlagen.' },
        { es: '3. Nada llega al libro mayor hasta la factura.', en: '3. Nothing reaches the ledger until the invoice.', de: '3. Nichts erreicht das Hauptbuch vor der Rechnung.' }
      ],
      dwhy: [{ es: 'No hay devengo: la prestación aún no ocurrió.', en: 'No accrual: the service hasn\'t happened yet.', de: 'Keine Abgrenzung: die Leistung ist noch nicht erbracht.' }, { es: 'Eso sería contabilizar la entrega/factura, no el pedido.', en: 'That would be posting the delivery/invoice, not the order.', de: 'Das wäre die Lieferung/Rechnung buchen, nicht den Auftrag.' }],
      hints: { es: ['¿Qué reconoce contablemente un pedido? Nada — es promesa.'], en: ['What does an order recognise in accounting? Nothing — it\'s a promise.'], de: ['Was erkennt ein Auftrag buchhalterisch an? Nichts — er ist ein Versprechen.'] }
    },
    ev: 'EV-LOGISTICS'
  }),

  sk(0, 1, {
    t: { es: 'Socios de negocio', en: 'Business partners', de: 'Geschäftspartner' },
    an: { g: '🪪', es: 'El maestro de socios es la agenda del sistema: cada contacto con DNI fiscal. Si la agenda tiene duplicados, nadie sabe a quién llama.', en: 'The partner master is the system\'s address book: every contact with a tax ID. If the book has duplicates, nobody knows who is being called.' },
    pa: ['Socios de negocio', 'Maestro de socios', 'Crear/Ver duplicados'],
    ex: {
      q: 'El mismo proveedor existe como P-SYN-001 y P-SYN-001-dup. Compras totales año: 48.000 y 12.000. ¿Qué ve el análisis?',
      show: [
        'P-SYN-001: 48.000',
        'P-SYN-001-dup: 12.000',
        'Volumen real: 60.000 — invisibles al ranking'
      ],
      a: { es: 'Dos historiales parten una relación de 60.000: negocias con datos a la baja y el aging se reparte entre dos fichas.', en: 'Two histories split a 60,000 relationship: you negotiate on understated data and aging splits across two cards.' }
    },
    o: { es: 'Gestionar clientes y proveedores como maestro único con control de duplicados.', en: 'Manage customers and vendors as a single master with duplicate control.', de: 'Kunden und Lieferanten als einheitliches Stammdatenobjekt mit Dublettenkontrolle verwalten.' },
    c: { es: 'Cada ficha de socio tiene un tipo —cliente, proveedor o lead— además de código, datos fiscales, condiciones de pago y cuenta asociada. Una misma entidad jurídica puede operar como cliente y proveedor, pero normalmente se representa mediante registros separados por tipo, gobernados para evitar duplicados accidentales. La cuenta asociada determina dónde se registran sus saldos.', en: 'Each business-partner master record has a type —customer, vendor, or lead— plus code, tax data, payment terms, and a linked account. The same legal entity may trade as both customer and vendor, but is normally represented by separate type-specific records governed to prevent accidental duplicates. The linked account determines where balances are posted.', de: 'Jeder Geschäftspartner-Stammsatz hat einen Typ —Kunde, Lieferant oder Interessent— sowie Code, Steuerdaten, Zahlungsbedingungen und Abstimmkonto. Dieselbe Rechtsperson kann Kunde und Lieferant sein, wird dafür jedoch normalerweise über getrennte typbezogene Stammsätze abgebildet.' },
    m: { es: 'Piensa «una ficha, un socio, un historial».', en: 'Think "one card, one partner, one history".', de: 'Denke „eine Karte, ein Partner, eine Historie“.' },
    p: { es: 'Revisa un maestro de socios real: busca duplicados por NIF y fusiona.', en: 'Audit a real partner master: hunt duplicates by tax ID and merge.', de: 'Prüfe echte Stammdaten: suche Dubletten per Steuer-ID und führe sie zusammen.' },
    v: { es: 'Puedes explicar qué rompe un duplicado (aging, ranking, conciliación).', en: 'You can explain what a duplicate breaks (aging, ranking, reconciliation).', de: 'Du kannst erklären, was eine Dublette zerstört (Aging, Ranking, Abstimmung).' },
    vs: [
      { es: 'Buscar duplicados por NIF, no por nombre', en: 'Hunt duplicates by tax ID, not name' },
      { es: 'Verificar condiciones de pago de la ficha', en: 'Verify the card\'s payment terms' },
      { es: 'Confirmar cuenta contable asociada', en: 'Confirm linked G/L account' },
      { es: 'Comprobar sincronización con la contabilidad', en: 'Check sync with accounting' }
    ],
    r: { es: 'Bajo: riesgo operacional controlado en este paso.', en: 'Low: controlled operational risk at this step.', de: 'Niedrig: kontrolliertes operatives Risiko in diesem Schritt.' },
    tips: { es: ['Busca duplicados por NIF: nombres mienten (S.L., Ltda., abreviaturas).', 'Un socio duplicado contamina ranking de compras y aging a la vez.'], en: ['Hunt duplicates by tax ID: names lie (Ltd, Inc, abbreviations).', 'A duplicated partner pollutes purchase ranking and aging simultaneously.'], de: ['Suche Dubletten per Steuer-ID: Namen lügen (GmbH, AG, Abkürzungen).', 'Ein duplizierter Partner verfälscht Einkaufsranking und Aging gleichzeitig.'] },
    pf: { es: 'Fusionar sin revisar transacciones abiertas: los saldos migran pero los documentos pendientes pueden quedar huérfanos si no usas la herramienta de fusión correcta.', en: 'Merging without reviewing open transactions: balances migrate but pending documents can be orphaned without the proper merge tool.', de: 'Zusammenführen ohne Prüfung offener Posten: Salden migrieren, aber offene Belege können verwaasen, wenn nicht das richtige Werkzeug genutzt wird.' },
    d: { k: 'tree', cap: { es: 'Una ficha, tres papeles', en: 'One card, three roles' }, n: [{ t: 'Socio', s: 'raíz' }, { t: 'Cliente', s: 'rol' }, { t: 'Proveedor', s: 'rol' }, { t: 'Lead CRM', s: 'rol' }] },
    a: {
      p: { es: '¿Por qué search duplicates por NIF y no por nombre?', en: 'Why search duplicates by tax ID rather than name?', de: 'Warum Dubletten per Steuer-ID statt nach Name suchen?' },
      opts: { es: ['El NIF es estable; los nombres cambian por abreviaturas y razones sociales', 'Los nombres son únicos legalmente', 'El NIF cambia cada año'], en: ['The tax ID is stable; names change with abbreviations and legal forms', 'Names are legally unique', 'Tax IDs change yearly'], de: ['Die Steuer-ID ist stabil; Namen ändern sich mit Abkürzungen und Rechtsformen', 'Namen sind rechtlich eindeutig', 'Steuer-IDs ändern sich jährlich'] },
      correct: 0,
      why: { es: 'La razón social muta (S.L.→S.A., fusiones); el identificador fiscal es la única clave estable.', en: 'Legal names mutate (Ltd→Inc, mergers); the tax identifier is the only stable key.', de: 'Firmennamen mutieren (GmbH→AG, Fusionen); die Steuer-ID ist der einzige stabile Schlüssel.' },
      prin: [{ es: 'Claves estables > claves convenientes', en: 'Stable keys over convenient keys', de: 'Stabile Schlüssel > bequeme Schlüssel' }, { es: 'El historial vive en la ficha', en: 'History lives on the card', de: 'Die Historie lebt auf der Karte' }, { es: 'Duplicado = análisis roto', en: 'Duplicate = broken analysis', de: 'Dublette = kaputte Analyse' }],
      senior: [
        { es: '1. Exporta el maestro y agrupa por NIF normalizado.', en: '1. Export the master and group by normalised tax ID.', de: '1. Exportiere die Stammdaten und gruppiere nach normalisierter Steuer-ID.' },
        { es: '2. Cada grupo >1 ficha es un candidato a fusión.', en: '2. Each group >1 card is a merge candidate.', de: '2. Jede Gruppe >1 Karte ist ein Zusammenführungskandidat.' },
        { es: '3. Fusiona hacia la ficha más antigua para conservar historial.', en: '3. Merge into the oldest card to preserve history.', de: '3. Führe zur ältesten Karte zusammen, um die Historie zu bewahren.' }
      ],
      dwhy: [{ es: 'Legalmente pueden coexistir nombres casi idénticos.', en: 'Legally near-identical names can coexist.', de: 'Rechtlich können fast identische Namen koexistieren.' }, { es: 'El NIF es invariante; es el nombre lo que deriva.', en: 'The tax ID is invariant; it\'s the name that drifts.', de: 'Die Steuer-ID ist invariant; der Name driftet.' }],
      hints: { es: ['¿Qué campo NO cambia cuando una empresa se transforma?'], en: ['Which field does NOT change when a company restructures?'], de: ['Welches Feld ändert sich NICHT, wenn sich ein Unternehmen umstrukturiert?'] }
    },
    ev: 'EV-LOGISTICS'
  }),

  sk(0, 2, {
    t: { es: 'Artículos', en: 'Items', de: 'Artikel' },
    an: { g: '🏷️', es: 'El maestro de artículos es un catálogo de librería: cada libro con su ficha única, ISBN, editorial y precio. Sin ISBN (código), cada cajero inventa el suyo.', en: 'The item master is a bookstore catalogue: each book with one card, ISBN, publisher, price. Without the ISBN (code), every cashier invents their own.' },
    pa: ['Artículos', 'Maestro de artículos', 'Definir grupo/método valoración'],
    ex: {
      q: 'Producto SYN-TEA-01 comprado 100 uds a 4,00. Método FIFO. Vende 60 a 6,00. ¿Margen bruto?',
      show: [
        'Compra: 100 × 4,00 = 400,00',
        'Venta: 60 × 6,00 = 360,00',
        'CMV FIFO: 60 × 4,00 = 240,00',
        'Margen: 360,00 − 240,00 = 120,00 (33,3%)'
      ],
      a: { es: '120,00 (33,3%). Con media móvil: mismo resultado aquí (una sola capa de coste); divergen con capas múltiples.', en: '120.00 (33.3%). Moving average gives the same here (single cost layer); they diverge with multiple layers.' }
    },
    o: { es: 'Gestionar el catálogo: tipos de artículo, valoración y datos de planificación.', en: 'Manage the catalogue: item types, valuation and planning data.', de: 'Den Katalog verwalten: Artikelarten, Bewertung und Planungsdaten.' },
    c: { es: 'Cada artículo tiene ficha única con grupo (contabilidad + físicas), método de valoración (FIFO, media móvil, estándar), y datos de planificación (lote, MRP, plazos). El grupo de artículos decide cuentas y comportamiento de stock.', en: 'Each item has one card with a group (accounting + physical behaviour), valuation method (FIFO, moving average, standard), and planning data (lot, MRP, lead times). The item group drives accounts and stock behaviour.', de: 'Jeder Artikel hat eine Karte mit Gruppe (Buchhaltung + physisches Verhalten), Bewertungsmethode (FIFO, gleitender Durchschnitt, Standard) und Planungsdaten (Los, MRP, Vorlaufzeiten). Die Artikelgruppe steuert Konten und Bestandsverhalten.' },
    m: { es: 'Piensa «una ficha, una identidad de coste».', en: 'Think "one card, one cost identity".', de: 'Denke „eine Karte, eine Kostenidentität“.' },
    p: { es: 'Crea un artículo completo: grupo, valoración, datos de planificación, y explica cada decisión.', en: 'Create a full item: group, valuation, planning data — and justify each choice.', de: 'Lege einen vollständigen Artikel an: Gruppe, Bewertung, Planungsdaten — und begründe jede Entscheidung.' },
    v: { es: 'Puedes predecir el coste de una venta según el método de valoración del artículo.', en: 'You can predict a sale\'s cost from the item\'s valuation method.', de: 'Du kannst die Kosten eines Verkaufs aus der Bewertungsmethode des Artikels vorhersagen.' },
    vs: [
      { es: 'Verificar grupo de artículo (contabilidad)', en: 'Verify item group (accounting)' },
      { es: 'Confirmar método de valoración', en: 'Confirm valuation method' },
      { es: 'Revisar datos MRP (lote, plazo)', en: 'Review MRP data (lot, lead time)' },
      { es: 'Comprobar unidades y conversión', en: 'Check units and conversion' }
    ],
    r: { es: 'Bajo: riesgo operacional controlado en este paso.', en: 'Low: controlled operational risk at this step.', de: 'Niedrig: kontrolliertes operatives Risiko in diesem Schritt.' },
    tips: { es: ['El grupo de artículos hereda cuentas: cámbialo y cambia tu contabilidad de stock.', 'FIFO respeta capas; media móvil las disuelve. Elegir método es elegir la historia que contar.'], en: ['The item group inherits accounts: change it and your stock accounting changes.', 'FIFO respects layers; moving average dissolves them. Choosing a method is choosing the story to tell.'], de: ['Die Artikelgruppe erbt Konten: ändere sie und deine Bestandsbuchhaltung ändert sich.', 'FIFO respektiert Schichten; gleitender Durchschnitt löst sie auf. Die Methodenwahl ist die Wahl der Geschichte.'] },
    pf: { es: 'Cambiar el método de valoración con stock abierto: el sistema exige cerrar el periodo y recalcular. Ignorarlo deja costes irreconciliables.', en: 'Changing valuation method with open stock forces period closing and recalculation. Ignoring it leaves irreconcilable costs.', de: 'Bewertungsmethode bei offenem Bestand ändern: Das System verlangt Periodenabschluss und Neuberechnung. Ignoriert man das, bleiben unreconcilierbare Kosten.' },
    d: { k: 'tree', cap: { es: 'La ficha del artículo', en: 'The item card' }, n: [{ t: 'Artículo', s: 'raíz' }, { t: 'Grupo', s: 'contabilidad' }, { t: 'Valoración', s: 'coste' }, { t: 'Planificación', s: 'operación' }] },
    a: {
      p: { es: '¿Qué decide el grupo de artículos?', en: 'What does the item group decide?', de: 'Was entscheidet die Artikelgruppe?' },
      opts: { es: ['Cuentas contables y comportamiento físico del stock', 'El precio de venta', 'El color de la ficha'], en: ['G/L accounts and stock\'s physical behaviour', 'The sales price', 'The card\'s colour'], de: ['Sachkonten und physisches Bestandsverhalten', 'Der Verkaufspreis', 'Die Farbe der Karte'] },
      correct: 0,
      why: { es: 'El grupo conecta el artículo con el plan de cuentas y activa/desactiva funciones (lote, serie, gestión por almacenes).', en: 'The group links the item to the chart of accounts and enables/disables features (batch, serial, warehouse management).', de: 'Die Gruppe verbindet den Artikel mit dem Kontenplan und aktiviert/deaktiviert Funktionen (Charge, Serie, Lagerverwaltung).' },
      prin: [{ es: 'El grupo es el puente artículo→contabilidad', en: 'The group is the item→accounting bridge', de: 'Die Gruppe ist die Brücke Artikel→Buchhaltung' }, { es: 'Las funciones siguen al grupo', en: 'Features follow the group', de: 'Funktionen folgen der Gruppe' }, { es: 'Decisiones tempranas, efectos largos', en: 'Early decisions, long effects', de: 'Frühe Entscheidungen, lange Wirkungen' }],
      senior: [
        { es: '1. Antes de crear artículos, define los grupos: son la silueta contable del catálogo.', en: '1. Before creating items, define groups: they are the catalogue\'s accounting silhouette.', de: '1. Vor dem Anlegen von Artikeln definiere die Gruppen: sie sind die buchhalterische Silhouette des Katalogs.' },
        {es: '2. El grupo decide lotes/series/almacenes — funciones caras de activar tarde.', en: '2. The group decides batch/serial/warehouse — expensive features to enable later.', de: '2. Die Gruppe entscheidet Chargen/Serien/Lager — teure Funktionen, wenn spät aktiviert.' },
        { es: '3. El método de valoración del grupo se hereda y es difícil de cambiar con stock.', en: '3. The group\'s valuation method is inherited and hard to change with open stock.', de: '3. Die Bewertungsmethode der Gruppe wird vererbt und ist bei offenem Bestand schwer änderbar.' }
      ],
      dwhy: [{ es: 'El precio vive en listas de precios, no en el grupo.', en: 'Price lives in price lists, not the group.', de: 'Der Preis lebt in Preislisten, nicht in der Gruppe.' }, { es: 'La estética no existe en el maestro.', en: 'Aesthetics don\'t exist in the master.', de: 'Ästhetik existiert nicht in den Stammdaten.' }],
      hints: { es: ['¿Dónde conecta el artículo con el plan de cuentas?'], en: ['Where does the item connect to the chart of accounts?'], de: ['Wo verbindet sich der Artikel mit dem Kontenplan?'] }
    },
    ev: 'EV-LOGISTICS'
  }),

  sk(0, 3, {
    t: { es: 'Documento origen-destino', en: 'Source-target document flow', de: 'Belegfluss Quelle-Ziel' },
    an: { g: '🔗', es: 'El flujo origen-destino es el rastro de papel de una auditoría: cada cupón remite al anterior. El hilo de Ariadna del documento perdido.', en: 'The source-target flow is an audit\'s paper trail: each slip points to the previous one. The Ariadne thread of the lost document.' },
    pa: ['Cualquier documento', 'Botón Destino', 'Ver cadena'],
    ex: {
      q: 'Factura SYN-INV-1042. ¿Cómo encontrar su pedido y su entrega en 30 segundos?',
      show: [
        'Abrir factura → ruta del documento (flecha)',
        'Pedido SYN-SO-0551 → Entrega SYN-DL-0917',
        'Estado de la entrega: cerrado (todo facturado)'
      ],
      a: { es: 'La ruta del documento hacia atrás: factura→entrega→pedido. Toda pregunta "¿de dónde viene?" se resuelve navegando el flujo, nunca buscando a ciegas.', en: 'Navigate the document path backwards: invoice→delivery→order. Every "where does this come from?" is answered by walking the flow, never blind search.' }
    },
    o: { es: 'Seguir y reparar el flujo origen-destino entre documentos.', en: 'Follow and repair the source-target flow between documents.', de: 'Den Belegfluss Quelle-Ziel verfolgen und reparieren.' },
    c: {             es: 'Cada documento apunta a su origen (base) y a su destino (siguiente). El botón "destino" lista los pasos legítimos; la ruta muestra la cadena completa. Documentos con destino cerrado están completos; los abiertos esperan el paso siguiente.', en: 'Every document points to its source (base) and target (next step). The "target" button lists legitimate next steps; the path shows the whole chain. Documents with a closed target are complete; open ones await the next step.', de: 'Jeder Beleg zeigt auf seine Quelle (Basis) und sein Ziel. Der Ziel-Button listet legitime Schritte; der Pfad zeigt die ganze Kette. Belege mit geschlossenem Ziel sind vollständig.' },
    m: { es: 'Piensa «todo documento tiene madre e hijos».', en: 'Think "every document has a mother and children".', de: 'Denke „jeder Beleg hat Mutter und Kinder“.' },
    p: { es: 'Abre una factura cualquiera y recupera su pedido completo usando solo la ruta del documento.', en: 'Open any invoice and retrieve its full order using only the document path.', de: 'Öffne eine beliebige Rechnung und finde ihren Auftrag nur über den Belegpfad.' },
    v: { es: 'Puedes reconstruir una cadena completa sin búsqueda ciega.', en: 'You can rebuild a whole chain without blind search.', de: 'Du kannst eine ganze Kette ohne blinde Suche rekonstruieren.' },
    vs: [
      { es: 'Abrir la ruta del documento (flecha de estado)', en: 'Open the document path (status arrow)' },
      {   es: 'Leer origen y destinos', en: 'Read source and targets' },
      { es: 'Identificar pasos pendientes (destino abierto)', en: 'Spot pending steps (open target)' },
      { es: 'Navegar la cadena completa', en: 'Walk the full chain' }
    ],
    r: { es: 'Bajo: riesgo operacional controlado en este paso.', en: 'Low: controlled operational risk at this step.', de: 'Niedrig: kontrolliertes operatives Risiko in diesem Schritt.' },
    tips: { es: ['La flecha de estado de cada línea es un semáforo: abierta/cerrada = pendiente/completa.', 'Un documento sin origen es sospechoso o manual: pregunta por qué.'], en: ['Each line\'s status arrow is a traffic light: open/closed = pending/complete.', 'A document without source is suspicious or manual: ask why.'], de: ['Der Statuspfeil jeder Zeile ist eine Ampel: offen/geschlossen = ausstehend/vollständig.', 'Ein Beleg ohne Quelle ist verdächtig oder manuell: frag warum.'] },
    pf: { es: 'Crear la entrega desde cero en vez de "crear desde pedido": rompe el flujo, pierdes la trazabilidad y duplicas trabajo.', en: 'Creating the delivery from scratch instead of "create from order": breaks the flow, loses traceability, duplicates work.', de: 'Die Lieferung von Null statt „aus Auftrag erstellen“: bricht den Fluss, verliert Traceability, verdoppelt Arbeit.' },
    d: { k: 'chain', cap: { es: 'La cadena madre-hijos', en: 'The mother-child chain' }, n: [{ t: 'Pedido', s: 'madre' }, { t: 'Entrega', s: 'hija' }, { t: 'Factura', s: 'nieta' }, { t: 'Pago', s: 'liquidación' }] },
    a: {
      p: { es: '¿Por qué crear siempre desde el origen?', en: 'Why always create from the source?', de: 'Warum immer aus der Quelle erstellen?' },
      opts: { es: ['Trazabilidad completa y datos heredados', 'Es más rápido', 'No hay razón'], en: ['Full traceability and inherited data', 'It\'s faster', 'No reason'], de: ['Vollständige Traceability und geerbte Daten', 'Es ist schneller', 'Kein Grund'] },
      correct: 0,
      why: { es: 'La creación desde origen hereda socio, artículos, precios y enlaza la cadena: cualquier auditoría posterior la recorre.', en: 'Creating from source inherits partner, items, prices and links the chain: any later audit walks it.', de: 'Die Erstellung aus der Quelle erbt Partner, Artikel, Preise und verknüpft die Kette: jede spätere Prüfung geht sie entlang.' },
      prin: [{ es: 'La cadena es la prueba', en: 'The chain is the proof', de: 'Die Kette ist der Beweis' }, { es: 'Heredar evita errores', en: 'Inheriting avoids errors', de: 'Erben vermeidet Fehler' }, { es: 'Sin origen, sin historia', en: 'No source, no history', de: 'Keine Quelle, keine Historie' }],
      senior: [
        { es: '1. "Crear desde" copia socio/líneas/precios: menos error humano.', en: '1. "Create from" copies partner/lines/prices: less human error.', de: '1. „Erstellen aus“ kopiert Partner/Zeilen/Preise: weniger menschlicher Fehler.' },
        { es: '2. El enlace origen-destino permite recorrer la auditoría completa.', en: '2. The source-target link lets you walk the complete audit.', de: '2. Die Quelle-Ziel-Verknüpfung erlaubt den kompletten Audit-Gang.' },
        { es: '3. Documentos huérfanos son candidatos a revisión.', en: '3. Orphan documents are review candidates.', de: '3. Verwaiste Belege sind Revisionskandidaten.' }
      ],
      dwhy: [{ es: 'A veces es igual de rápido, pero nunca más seguro.', en: 'Sometimes equally fast, never safer.', de: 'Manchmal gleich schnell, nie sicherer.' }, { es: 'La razón es la trazabilidad, no el clic.', en: 'The reason is traceability, not the click.', de: 'Der Grund ist Traceability, nicht der Klick.' }],
      hints: { es: ['¿Qué pierdes si el documento no tiene madre?'], en: ['What do you lose if the document has no mother?'], de: ['Was verlierst du, wenn der Beleg keine Mutter hat?'] }
    },
    ev: 'EV-LOGISTICS'
  }),
  sk(0, 4, {
    t: { es: 'Estados, series y trazabilidad', en: 'Statuses, series and traceability', de: 'Status, Serien und Nachvollziehbarkeit' },
    o: { es: 'Leer el ciclo de vida de un documento por sus estados y series sin abrirlo.', en: 'Read a document’s lifecycle from its statuses and series without opening it.', de: 'Den Lebenszyklus eines Belegs an Status und Nummernkreis lesen.' },
    c: { es: 'Cada documento avanza por estados (abierto, cerrado, cancelado) y pertenece a una serie de numeración que identifica su origen y periodo; la combinación estado+serie resume su historia.', en: 'Documents advance through statuses (open, closed, cancelled) and belong to a numbering series identifying origin and period; status+series summarizes its story.', de: 'Belege durchlaufen Status (offen, geschlossen, storniert) und gehören zu einem Nummernkreis.' },
    m: { es: 'Ante un documento desconocido: estado y serie primero, detalles después.', en: 'Facing an unknown document: status and series first, details later.', de: 'Bei unbekanntem Beleg: zuerst Status und Serie, dann Details.' },
    p: { es: 'Ordena cinco documentos SYN por estado y detecta el cancelado por su serie.', en: 'Order five SYN documents by status and spot the cancelled one by its series.', de: 'Sortiere fünf SYN-Belege nach Status und finde den stornierten am Nummernkreis.' },
    v: { es: 'Confirma que la serie corresponde al tipo y periodo declarados.', en: 'Confirm the series matches the declared type and period.', de: 'Bestätige, dass der Kreis zu Typ und Periode passt.' },
    vs: [{ es: 'Lee estado del documento', en: 'Read the document status' }, { es: 'Identifica serie y periodo', en: 'Identify series and period' }, { es: 'Contrasta con el proceso esperado', en: 'Contrast with the expected process' }],
    r: { es: 'Cerrar o cancelar sin entender la diferencia destruye datos operativos: cerrar ≠ cancelar.', en: 'Closing or cancelling without understanding the difference destroys operational data: closed ≠ cancelled.', de: 'Schließen ≠ Stornieren: Unwissentlich zerstört das Bestandsdaten.' },
    tips: { es: ['Cerrado deja el documento visible pero sin cantidad abierta; cancelado lo anula con documento espejo.', 'Una serie por tipo de documento y año simplifica auditorías.'], en: ['Closed keeps the document visible with zero open quantity; cancelled voids it with a mirror document.', 'One series per document type and year simplifies audits.'], de: ['Geschlossen lässt den Beleg sichtbar ohne offene Menge; storniert hebt ihn mit Spiegelbeleg auf.', 'Eine Serie pro Belegart und Jahr vereinfacht Audits.'] },
    pf: { es: 'Cancelar un pedido entregado parcialmente en vez de cerrarlo.', en: 'Cancelling a partially delivered order instead of closing it.', de: 'Einen teilweise gelieferten Auftrag stornieren statt schließen.' },
    d: { k: 'timeline', cap: { es: 'Vida de un documento: abierto → cerrado/cancelado', en: 'Document life: open → closed/cancelled' }, n: [{ t: 'Abierto', s: 'cantidad pendiente' }, { t: 'Cerrado', s: 'fin natural' }, { t: 'Cancelado', s: 'anulación espejo' }] },
    a: {
      prompt: { es: 'SYN-SO-0007 está entregado al 80% y el cliente cancela el resto. ¿Qué haces con el pedido?', en: 'SYN-SO-0007 is 80% delivered and the customer cancels the rest. What do you do with the order?', de: 'SYN-SO-0007 ist zu 80% geliefert, der Rest storniert. Was tun?' },
      opts: { es: ['Cerrar el pedido: deja lo entregado y libera el resto sin anular', 'Cancelar: anula también lo entregado', 'Dejarlo abierto para siempre'], en: ['Close the order: keeps deliveries and releases the rest without voiding', 'Cancel: voids the delivered part too', 'Leave it open forever'], de: ['Schließen: behält Lieferungen, gibt Rest frei', 'Stornieren: anulliert auch Lieferungen', 'Für immer offen lassen'] },
      correct: 0,
      why: { es: 'Cerrar respeta la parte ya entregada y su asiento; cancelar generaría un espejo que contradice la realidad física.', en: 'Closing respects the delivered part and its postings; cancelling would create a mirror contradicting physical reality.', de: 'Schließen respektiert Lieferung und Buchung; Storno widerspräche der Realität.' },
      prin: [{ es: 'Respetar lo ya sucedido', en: 'Respect what already happened' }, { es: 'Anular siempre es más limpio', en: 'Cancelling is always cleaner' }, { es: 'Congelar y olvidar', en: 'Freeze and forget' }], prinOk: 0,
      senior: [{ es: 'Verifica cantidades abiertas reales por línea', en: 'Verify real open quantities per line' }, { es: 'Comprueba que ningún documento destino pendiente enlaza al pedido', en: 'Check no pending target document links to the order' }, { es: 'Cierra y documenta la razón comercial', en: 'Close and record the business reason' }],
      dwhy: { es: ['Cancelar contradice las entregas ya contabilizadas y su COGS.', 'Dejarlo abierto mantiene stock comprometido fantasma que el MRP intentará servir.', 'Cerrar es la única acción coherente con la historia ya escrita.'], en: ['Cancelling contradicts deliveries already posted with their COGS.', 'Leaving it open keeps phantom committed stock that MRP will try to serve.', 'Closing is the only action consistent with history already written.'], de: ['Storno widerspricht gebuchten Lieferungen.', 'Offen lassen erzeugt Phantombestand für MRP.', 'Schließen passt zur bereits geschriebenen Geschichte.'] },
      hints: { es: '¿Qué pasa con el stock comprometido de las líneas no entregadas?' }
    }
  }),
  sk(0, 5, {
    t: { es: 'Fechas del documento', en: 'Document dates', de: 'Belegdaten' },
    o: { es: 'Dominar el trío de fechas (contabilización, vencimiento, entrega) y sus efectos.', en: 'Master the date trio (posting, due, delivery) and their effects.', de: 'Das Datumsdreieck (Buchung, Fälligkeit, Lieferung) beherrschen.' },
    c: { es: 'La fecha de contabilización decide periodo y asiento; la de vencimiento mueve la cobranza; la de entrega gobierna la logística: tres palancas distintas en cada documento.', en: 'The posting date drives period and entry; the due date drives collections; the delivery date drives logistics: three distinct levers per document.', de: 'Buchungsdatum steuert Periode, Fälligkeitsdatum Mahnung, Lieferdatum Logistik.' },
    m: { es: 'Cada fecha tiene un dueño distinto: contable, financiero, logístico. Nunca una por otra.', en: 'Each date has a different owner: accounting, finance, logistics. Never one for another.', de: 'Jedes Datum hat einen anderen Eigentümer: buchhalterisch, finanziell, logistisch. Nie eines für das andere.' },
    p: { es: 'En SYN-INV-0004, predice el efecto de mover cada fecha un mes.', en: 'On SYN-INV-0004, predict moving each date by one month.', de: 'Sage bei SYN-INV-0004 die Wirkung jeder Datumverschiebung voraus.' },
    v: { es: 'Comprueba periodo abierto y política antes de aceptar una fecha retroactiva.', en: 'Verify open period and policy before accepting a backdated date.', de: 'Prüfe offene Periode und Richtlinie für Rückdatierung.' },
    vs: [{ es: 'Identifica las tres fechas', en: 'Identify the three dates' }, { es: 'Asigna el efecto de cada una', en: 'Assign each one’s effect' }, { es: 'Valida periodo y política', en: 'Validate period and policy' }],
    r: { es: 'Fechar atrás para «arreglar» un cierre contable es fraude de periodo, no corrección.', en: 'Backdating to «fix» a closing is period fraud, not correction.', de: 'Rückdatierung für einen Abschluss ist Periodenbetrug.' },
    tips: { es: ['El informe de aging se construye sobre la fecha de vencimiento: moverla mueve la cobranza.', 'Document date ≠ posting date: la primera es comercial, la segunda contable.'], en: ['The aging report builds on the due date: moving it moves collections.', 'Document date ≠ posting date: the first is commercial, the second accounting.'], de: ['Das Aging-Bericht baut auf dem Fälligkeitsdatum: es zu verschieben verschiebt den Zahlungseingang.', 'Belegdatum ≠ Buchungsdatum: das erste ist kommerziell, das zweite buchhalterisch.'] },
    pf: { es: 'Usar la fecha de entrega como fecha contable para «adelantar» ingresos.', en: 'Using the delivery date as posting date to «accelerate» revenue.', de: 'Das Lieferdatum als Buchungsdatum nutzen, um Erlöse „vorzuziehen“.' },
    d: { k: 'layers', cap: { es: 'Tres fechas, tres dueños', en: 'Three dates, three owners' }, n: [{ t: 'Contabilización', s: 'periodo + asiento' }, { t: 'Vencimiento', s: 'aging + cobro' }, { t: 'Entrega', s: 'logística' }] },
    a: {
      prompt: { es: 'Un comercial SYN quiere facturar con fecha del mes pasado para cumplir cuota. ¿Aceptas?', en: 'A SYN salesperson wants to post an invoice dated last month to hit quota. Do you accept?', de: 'Ein Verkäufer will mit Vormonatsdatum fakturieren. Akzeptierst du?' },
      opts: { es: ['No: la fecha contable refleja el hecho real; la cuota se gestiona fuera del sistema', 'Sí, si el periodo sigue abierto', 'Sí, cambiando el periodo manualmente'], en: ['No: the posting date reflects the real event; quota is managed outside the system', 'Yes, if the period is still open', 'Yes, by forcing the period'], de: ['Nein: Das Buchungsdatum spiegelt das Ereignis; Quote ist außersystemisch', 'Ja, bei offener Periode', 'Ja, Periode erzwingen'] },
      correct: 0,
      why: { es: 'El periodo abierto es una condición técnica, no un permiso ético: el asiento debe fecharse cuando nace el hecho económico.', en: 'An open period is a technical condition, not an ethical licence: entries are dated when the economic event occurs.', de: 'Eine offene Periode ist keine ethische Erlaubnis: Buchung zum Ereigniszeitpunkt.' },
      prin: [{ es: 'La fecha sigue al hecho', en: 'The date follows the event' }, { es: 'Técnico habilita, negocio decide', en: 'Technical enables, business decides' }, { es: 'El sistema es flexible', en: 'The system is flexible' }], prinOk: 0,
      senior: [{ es: 'Separa el problema comercial (cuota) del contable (fecha)', en: 'Separate the commercial problem (quota) from the accounting one (date)' }, { es: 'Verifica política de periodos y autorizaciones', en: 'Verify period policy and authorizations' }, { es: 'Ofrece la vía correcta: corregir la previsión, no el asiento', en: 'Offer the right path: fix the forecast, not the entry' }],
      dwhy: { es: ['«Periodo abierto» confunde posibilidad técnica con corrección contable.', 'Forzar el periodo requiere romper un control diseñado para impedir exactamente esto.', 'La fecha del hecho es el ancla de toda la cadena posterior: vencimiento, aging, impuestos.'], en: ['«Open period» confuses technical possibility with accounting correctness.', 'Forcing the period breaks a control designed to prevent exactly this.', 'The event date anchors the whole downstream chain: due date, aging, taxes.'], de: ['Offene Periode ≠ Korrektheit.', 'Erzwungene Periode bricht eine Kontrolle, die genau das verhindern soll.', 'Das Ereignisdatum verankert Fälligkeit, Aging, Steuern.'] },
      hints: { es: '¿Qué problema real intenta resolver el comercial y por qué no es este el camino?' }
    }
  }),
  sk(0, 6, {
    t: { es: 'Cadena documental', en: 'Document chain', de: 'Belegkette' },
    o: { es: 'Reconstruir la cadena base-destino de cualquier proceso B1 en ambas direcciones.', en: 'Reconstruct the base-target chain of any B1 process in both directions.', de: 'Die Basis-Ziel-Kette jedes Prozesses in beide Richtungen rekonstruieren.' },
    c: { es: 'Los documentos se copian unos de otros mediante enlaces base-destino: el pedido engendra la entrega, ésta la factura; cada enlace conserva cantidades y trazabilidad.', en: 'Documents copy into each other via base-target links: order begets delivery, delivery begets invoice; each link keeps quantities and traceability.', de: 'Belege erzeugen sich über Basis-Ziel-Verweise: Auftrag → Lieferung → Rechnung.' },
    m: { es: 'Nunca juzgues un documento aislado: pregúntale por su padre y sus hijos.', en: 'Never judge a document in isolation: ask for its parent and its children.', de: 'Beurteile nie einen Beleg isoliert: frage nach Vater und Kindern.' },
    p: { es: 'Sigue SYN-SO-0001 hasta su cobro y dibuja la cadena con cantidades abiertas.', en: 'Follow SYN-SO-0001 to its payment and draw the chain with open quantities.', de: 'Verfolge SYN-SO-0001 bis zur Zahlung und zeichne die Kette.' },
    v: { es: 'Comprueba que las cantidades abiertas de cada eslabón cuadran con la realidad.', en: 'Verify each link’s open quantities match reality.', de: 'Prüfe, dass offene Mengen je Glied der Realität entsprechen.' },
    vs: [{ es: 'Localiza el documento origen', en: 'Locate the source document' }, { es: 'Lista hijos y padres', en: 'List children and parents' }, { es: 'Cuadra cantidades abiertas', en: 'Reconcile open quantities' }],
    r: { es: 'Romper un eslabón a mano (borrar destino) deja al padre con cantidades fantasma.', en: 'Breaking a link by hand (deleting a target) leaves the parent with phantom quantities.', de: 'Ein manuell gebrochenes Glied hinterlässt Phantommengen.' },
    tips: { es: ['El mapa de flujo documental es tu mejor herramienta de diagnóstico: píntalo antes de tocar.', 'La cantidad abierta es la verdad del eslabón: no la cantidad original.'], en: ['The document flow map is your best diagnostic tool: draw it before touching.', 'Open quantity is the link’s truth: not the original quantity.'], de: ['Die Belegflusskarte ist dein bestes Diagnosewerkzeug: zeichne sie vor dem Eingriff.', 'Die offene Menge ist die Wahrheit des Glieds: nicht die ursprüngliche Menge.'] },
    pf: { es: 'Mirar solo el último documento de la cadena y operar sobre él.', en: 'Looking only at the chain’s last document and operating on it.', de: 'Nur den letzten Beleg der Kette ansehen und darauf operieren.' },
    d: { k: 'chain', cap: { es: 'Oferta → Pedido → Entrega → Factura → Cobro', en: 'Quote → Order → Delivery → Invoice → Payment' }, n: [{ t: 'Pedido', s: '100 uds' }, { t: 'Entrega', s: '80 uds' }, { t: 'Factura', s: '80 uds' }, { t: 'Cobro', s: 'cierra' }] },
    a: {
      prompt: { es: 'SYN-INV-0009 muestra un total que no cuadra con lo entregado. ¿Dónde miras primero?', en: 'SYN-INV-0009 shows a total that does not match what was delivered. Where do you look first?', de: 'SYN-INV-0009 passt nicht zur Lieferung. Wohin schaust du zuerst?' },
      opts: { es: ['La cadena base-destino: qué entrega la originó y con qué cantidades', 'El total de la factura y lo recalculo', 'El maestro del cliente'], en: ['The base-target chain: which delivery originated it and with what quantities', 'The invoice total and recalculate it', 'The customer master'], de: ['Die Basis-Ziel-Kette: welche Lieferung, welche Mengen', 'Rechnungssumme nachrechnen', 'Kundenstammsatz'] },
      correct: 0,
      why: { es: 'El total hereda cantidades de la cadena: reconstruir el flujo revela si el problema nació aguas arriba.', en: 'The total inherits quantities from the chain: reconstructing the flow reveals whether the problem was born upstream.', de: 'Die Summe erbt Mengen aus der Kette: Flussrekonstruktion zeigt Ursprung.' },
      prin: [{ es: 'Río arriba antes que el delta', en: 'Upstream before the delta' }, { es: 'Aritmética primero', en: 'Arithmetic first' }, { es: 'Maestro primero', en: 'Master first' }], prinOk: 0,
      senior: [{ es: 'Abre el mapa de flujo del documento', en: 'Open the document flow map' }, { es: 'Compara cantidades por línea entre eslabones', en: 'Compare per-line quantities across links' }, { es: 'Localiza el primer eslabón donde el número deja de cuadrar', en: 'Locate the first link where the number stops matching' }],
      dwhy: { es: ['Recalcular el total solo valida la aritmética del último eslabón, no su origen.', 'El maestro del cliente no guarda cantidades de esta operación.', 'El primer desajuste de la cadena señala la causa raíz.'], en: ['Recalculating only validates the last link’s arithmetic, not its origin.', 'The customer master holds no quantities for this operation.', 'The chain’s first mismatch points at the root cause.'], de: ['Nachrechnen prüft nur das letzte Glied.', 'Der Stammsatz kennt keine Mengen.', 'Die erste Abweichung zeigt die Ursache.'] },
      hints: { es: '¿De dónde hereda sus cantidades esa factura?' }
    }
  }),
  sk(0, 7, {
    t: { es: 'Verificación basada en evidencia', en: 'Evidence-first verification', de: 'Nachweisbasierte Prüfung' },
    o: { es: 'Aplicar la disciplina de separar confirmado, probable, supuesto y no verificado antes de actuar.', en: 'Apply the discipline of separating confirmed, probable, assumed, and unverified before acting.', de: 'Bestätigt, wahrscheinlich, angenommen und ungeprüft trennen.' },
    c: { es: 'Toda afirmación sobre el sistema se clasifica por su evidencia: vista en pantalla, consultada en datos, reportada por otro, o supuesta; actuar exige subir de grado, no bajarlo.', en: 'Every system claim is graded by evidence: seen on screen, queried in data, reported by another, or assumed; acting requires moving up a grade, not down.', de: 'Jede Aussage wird nach Nachweis eingestuft; Handeln erfordert höhere Evidenz.' },
    m: { es: 'Cero conclusiones sin etiqueta de evidencia: es tu higiene profesional básica.', en: 'No conclusions without an evidence tag: your basic professional hygiene.', de: 'Keine Schlüsse ohne Beweismarke: das ist deine grundlegende Berufshygiene.' },
    p: { es: 'Toma una incidencia SYN y clasifica cada afirmación del ticket por grado de evidencia.', en: 'Take a SYN incident and grade every ticket claim by evidence level.', de: 'Stufe jede Aussage eines SYN-Tickets nach Evidenz ein.' },
    v: { es: 'Convierte cada supuesto en confirmado antes de proponer acción.', en: 'Convert every assumption into confirmed before proposing action.', de: 'Wandle jede Annahme in Bestätigung vor der Aktion.' },
    vs: [{ es: 'Lista las afirmaciones', en: 'List the claims' }, { es: 'Etiqueta cada una por evidencia', en: 'Tag each by evidence' }, { es: 'Decide la prueba mínima por supuesto', en: 'Decide the minimal test per assumption' }],
    r: { es: 'Presentar un supuesto como hecho en producción es la raíz de los desastres evitables.', en: 'Presenting an assumption as fact in production is the root of avoidable disasters.', de: 'Annahmen als Fakten sind die Wurzel vermeidbarer Katastrophen.' },
    tips: { es: ['Escribe el ticket con etiquetas: [Confirmado] [Probable] [Supuesto]. Cambia la conversación.', 'La prueba mínima vence a la prueba perfecta que nadie ejecuta.'], en: ['Write tickets with tags: [Confirmed] [Probable] [Assumed]. It changes the conversation.', 'The minimal test beats the perfect test nobody runs.'], de: ['Schreibe Tickets mit Markierungen: [Bestätigt] [Wahrscheinlich] [Angenommen]. Das verändert das Gespräch.', 'Der minimale Test schlägt den perfekten Test, den niemand ausführt.'] },
    pf: { es: '«Lo vi en un sistema parecido» como evidencia suficiente.', en: '«I saw it in a similar system» as sufficient evidence.', de: '„Ich habe es in einem ähnlichen System gesehen“ als ausreichender Beweis.' },
    d: { k: 'gauge', cap: { es: 'Escalera de evidencia: supuesto → confirmado', en: 'Evidence ladder: assumed → confirmed' }, n: [{ t: 'Supuesto', s: 'grado 0' }, { t: 'Reportado', s: 'grado 1' }, { t: 'Consultado', s: 'grado 2' }, { t: 'Confirmado', s: 'actuable' }] },
    a: {
      prompt: { es: 'El usuario SYN dice «la factura desapareció». ¿Cuál es tu siguiente movimiento?', en: 'A SYN user says «the invoice disappeared». What is your next move?', de: 'Ein Benutzer sagt „Rechnung verschwunden“. Nächster Schritt?' },
      opts: { es: ['Buscar por número, socio, fechas, estado y series antes de concluir algo', 'Concluir que fue borrada y re-crearla', 'Reiniciar el servicio de la base de datos'], en: ['Search by number, partner, dates, status, and series before concluding anything', 'Conclude it was deleted and recreate it', 'Restart the database service'], de: ['Suche nach Nummer, Partner, Daten, Status und Serien', 'Als gelöscht annehmen und neu anlegen', 'Datenbankdienst neu starten'] },
      correct: 0,
      why: { es: '«Desapareció» es un reporte, no un hecho: la búsqueda estructurada lo convierte en confirmado (existe filtrado, cancelado, u otro periodo).', en: '«Disappeared» is a report, not a fact: structured search converts it into confirmed (filtered, cancelled, or another period).', de: '„Verschwunden“ ist ein Bericht, kein Fakt: strukturierte Suche schafft Gewissheit.' },
      prin: [{ es: 'Primero elevar la evidencia', en: 'Raise the evidence first' }, { es: 'Actuar para aprender', en: 'Act to learn' }, { es: 'Reiniciar resuelve', en: 'Restart fixes' }], prinOk: 0,
      senior: [{ es: 'Define qué buscarías exactamente y en qué orden', en: 'Define exactly what you would search and in what order' }, { es: 'Considera filtros de usuario y permisos como causa frecuente', en: 'Consider user filters and permissions as frequent cause' }, { es: 'Documenta el hallazgo con el número real del documento', en: 'Document the finding with the real document number' }],
      dwhy: { es: ['Re-crear duplica el asiento y destruye la trazabilidad si el original existía.', 'Reiniciar la base no cambia los datos: es un martillo para un tornillo inexistente.', 'La búsqueda estructurada es la única vía que produce evidencia.'], en: ['Recreating duplicates the entry and destroys traceability if the original exists.', 'A database restart does not change data: a hammer for a nonexistent nail.', 'Structured search is the only path producing evidence.'], de: ['Neuanlegen dupliziert die Buchung.', 'Neustart ändert keine Daten.', 'Nur die Suche erzeugt Nachweis.'] },
      hints: { es: '¿Qué explicaciones alternativas hay para «no la veo»?' }
    }
  })
];
