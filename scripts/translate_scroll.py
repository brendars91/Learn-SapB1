import sys
DOT = chr(46); SLASH = chr(47)
p = sys.argv[1]
s = open(p, encoding='utf-8').read()

# Target CTA: the lab app restored under lab/ (same Pages site)
UP2 = DOT + DOT + SLASH  # not used here; CTA is absolute path
CTA = SLASH + 'Learn-SapB1' + SLASH + 'lab' + SLASH

repl = [
 # head/title
 ('<title>Learn-SapB1 · Handbook of the Document Chain</title>', None),  # keep
 # portada
 ('SYN-Nordlicht Demo GmbH · Interne Schulungsunterlage · Ausgabe 10.0',
  'SYN-Nordlicht Demo GmbH · Internal Training Document · Edition 10.0'),
 ('Handbuch<br><span class="hb-title__sub">der Belegkette</span>',
  'Handbook<br><span class="hb-title__sub">of the Document Chain</span>'),
 ('Aprender SAP Business One siguiendo documentos,<br>no memorizando pantallas.',
  'Learn SAP Business One by following documents,<br>not by memorising screens.'),
 ('<div><dt>Stufen</dt><dd>9</dd></div>', '<div><dt>Levels</dt><dd>9</dd></div>'),
 ('<div><dt>Kompetenzen</dt><dd>72</dd></div>', '<div><dt>Skills</dt><dd>72</dd></div>'),
 ('<div><dt>Sprachen</dt><dd>ES · EN · DE</dd></div>', '<div><dt>Languages</dt><dd>ES · EN · DE</dd></div>'),
 ('<div><dt>Quellen</dt><dd>7 offizielle</dd></div>', '<div><dt>Sources</dt><dd>7 official</dd></div>'),
 ('>9 STUFEN<', '>9 LEVELS<'),
 ('Todos los datos de este manual son sintéticos y están marcados',
  'All data in this manual are synthetic and marked'),
 # kapitel 2
 ('Was es kostet, die Frage falsch zu stellen.',
  'What it costs to ask the wrong question.'),
 ('Cifras del material del propio laboratorio: el borrador de',
  'Figures from the lab itself: the draft from'),
 ('y la factura <code>1001-2026</code>.', 'and invoice <code>1001-2026</code>.'),
 # kapitel 3
 ('Kein Bildschirm. Ein Weg.', 'No screen. A path.'),
 ('aria-label="Diagrama: cada documento hereda del anterior y produce tres efectos"',
  'aria-label="Diagram: each document inherits from the previous one and produces three effects"'),
 ('Cada documento nace de otro y deja tres huellas: mueve stock, escribe un asiento, cambia el saldo del socio.',
  'Every document is born from another and leaves three footprints: it moves stock, writes a ledger entry, shifts the partner balance.'),
 ('Quien conoce esas tres huellas no necesita memorizar la pantalla. La lee.',
  'Whoever knows those three footprints never memorises the screen. They read it.'),
 # atem
 ('Ahora mire un documento de verdad.', 'Now look at a real document.'),
 # kapitel 4
 ('Die Kette baut sich, während Sie lesen.', 'The chain builds itself as you read.'),
 ('<li>Stock: reserviert</li>', '<li>Stock: reserved</li>'),
 ('<li>Ledger: Wareneinsatz</li>', '<li>Ledger: COGS</li>'),
 ('<li>Ledger: Debitor / Erlöse / USt</li>', '<li>Ledger: AR / Revenue / VAT</li>'),
 ('<li>Ledger: Bank / Debitor</li>', '<li>Ledger: Bank / Receivables</li>'),
 ('<li>Balance: +856,80</li>', '<li>Balance: +856.80</li>'),
 ('<li>Balance: 0,00</li>', '<li>Balance: 0.00</li>'),
 # ventana
 ('<span>Menge</span>', '<span>Quantity</span>'),
 ('<span>Preis</span>', '<span>Unit price</span>'),
 ('<span>USt</span>', '<span>VAT</span>'),
 ('<caption>Ledgerssatz · erzeugt beim Hinzufügen</caption>',
  '<caption>Ledger entry · generated on Add</caption>'),
 ('<tr><th scope="row">Debitor 120000</th>', '<tr><th scope="row">Receivables 120000</th>'),
 ('<tr><th scope="row">Erlöse 400000</th>', '<tr><th scope="row">Revenue 400000</th>'),
 ('<tr><th scope="row">USt 177600</th>', '<tr><th scope="row">VAT 177600</th>'),
 ('<td data-f-debit>714,00</td>', '<td data-f-debit>714.00</td>'),
 ('<td data-f-rev>600,00</td>', '<td data-f-rev>600.00</td>'),
 ('<td data-f-vatamt>114,00</td>', '<td data-f-vatamt>114.00</td>'),
 ('Cambie la cantidad y mire el asiento, el stock y el saldo moverse a la vez.',
  'Change the quantity and watch the ledger entry, the stock and the balance move together.'),
 # kapitel 5
 ('Neun Stufen, in Ihrem Tempo.', 'Nine levels. At your own pace.'),
 ('<h3>Mentales Modell</h3>', '<h3>Mental Model</h3>'),
 ('<h3>Stammdaten</h3>', '<h3>Master Data</h3>'),
 ('<h3>Kernlogistik</h3>', '<h3>Core Logistics</h3>'),
 ('<h3>Erweiterte Abläufe</h3>', '<h3>Advanced Flows</h3>'),
 ('<h3>Finanzen</h3>', '<h3>Finance</h3>'),
 ('<h3>Implementierung</h3>', '<h3>Implementation</h3>'),
 ('<h3>Web und Reporting</h3>', '<h3>Web &amp; Reporting</h3>'),
 ('<h3>KI und Vibecoding</h3>', '<h3>AI &amp; Vibecoding</h3>'),
 ('Cómo viaja un documento por los ocho módulos.', 'How a document travels through all eight modules.'),
 ('Socios, artículos, series, fechas: lo que decide todo lo demás.',
  'Business partners, items, series, dates — what decides everything else.'),
 ('Pedido, entrega, factura, cobro. La cadena completa.',
  'Order, delivery, invoice, payment. The full chain.'),
 ('Lotes, series, ubicaciones, producción, MRP.',
  'Batches, serial numbers, bins, production, MRP.'),
 ('Asientos, conciliación, activos, contabilidad de costes.',
  'Journal entries, reconciliation, assets, cost accounting.'),
 ('Discovery, blueprint, migración, UAT, go-live.',
  'Discovery, blueprint, migration, UAT, go-live.'),
 ('Crystal, consultas, alertas, cockpits.', 'Crystal Reports, queries, alerts, dashboards.'),
 ('Tablas, DI API, Service Layer, integración.', 'Tables, DI API, Service Layer, integration.'),
 ('Contrato de contexto, RAG con evidencia, gate humano.',
  'Context contracts, RAG with evidence, human gate.'),
 # colofón
 ('Debit und Credit', 'Debit and Credit'),
 ('Su libro mayor está a la espera del último asiento.',
  'Your ledger is waiting for its last entry.'),
 ('Este manual es la portada de un laboratorio con nueve niveles y setenta y dos competencias, en español, inglés y alemán, con siete fuentes oficiales de SAP fechadas. Funciona sin cuenta, sin servidor y sin conexión. Cuando quiera, <a class="hb-cta" href="#sap-b1-mastery-lab">abra el laboratorio</a> y empiece por el nivel cero.',
  'This manual is the front cover of a lab with nine levels and seventy-two skills, in Spanish, English and German, with seven dated official SAP sources. It runs with no account, no server and no connection. Whenever you are ready, <a class="hb-cta" href="' + CTA + '">open the lab</a> and start at level zero.'),
 ('SYN-Nordlicht Demo GmbH · Datos sintéticos marcados SYN · Learn-SapB1',
  'SYN-Nordlicht Demo GmbH · Synthetic data marked SYN · Learn-SapB1'),
 # folio sums a puntos ingleses
 ('<span data-ledger-debit>0,00</span>', '<span data-ledger-debit>0.00</span>'),
 ('<span data-ledger-credit>0,00</span>', '<span data-ledger-credit>0.00</span>'),
 # ledger specs con coma decimal → punto
 ('data-hb-ledger="Quotation|Quotation A-2026-0114|—|—"', None),
 ('data-hb-ledger="Invoice|Invoice 1001-2026|856,80|856,80"',
  'data-hb-ledger="Invoice|Invoice 1001-2026|856.80|856.80"'),
 ('data-hb-ledger="Payment|Payment 2301|856,80|856,80"',
  'data-hb-ledger="Payment|Payment 2301|856.80|856.80"'),
 ('<b>0,00</b>', '<b>0.00</b>'),
 ('<b>856,80</b>', '<b>856.80</b>'),
]

missed = []
for old, new in repl:
    if new is None:
        continue
    if old in s:
        s = s.replace(old, new)
    else:
        missed.append(old[:60])

open(p, 'w', encoding='utf-8').write(s)
print('missed:', len(missed))
for m in missed:
    print(' MISS:', m)
