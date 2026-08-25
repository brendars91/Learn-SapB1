# Fingerprints

Every site you build with **scrollcraft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| handbuch | Chaptered editorial | Folio en el margen que además contabiliza | Portada tipográfica sobre papel, sin media | Papel ×3 · silencio · tinta (pico) · papel ×2 | Colofón con el libro mayor cuadrado y el CTA como línea de texto | El libro mayor de la visita: cada capítulo contabiliza su asiento y al final Soll = Haben | Manual técnico alemán, papel y tinta, 3D por CSS sin assets generados | 8 secciones · 13,2 vh |

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Chaptered editorial** con folio en el margen: tomado por `handbuch`.
- **El margen que contabiliza** (folio + libro mayor que cuadra al final): tomado. Un
  siguiente build no puede volver a usar un rail persistente que acumula líneas.
- **Cierre por cuadre contable** (la página termina cuando Debe = Haber): tomado.
- **Banda 8 secciones / 13,2 vh**: ocupada.
- **Mundo construido solo con CSS 3D y SVG, sin assets generados**: disponible para
  otros builds, pero combinado con lo anterior ya no distingue.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scrollcraft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
