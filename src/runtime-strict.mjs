import { mountSapB1Lab } from './app.mjs';

// Punto de montaje de GitHub Pages. El contenido y el chrome de las ventanas B1 ya se
// renderizan en el idioma elegido (src/i18n.mjs + src/content/i18n-terms.mjs), así que
// aquí solo queda lo que el render no puede fijar por sí mismo: el idioma del documento,
// que es lo que leen el navegador, los lectores de pantalla y los buscadores.
function enforce(root) {
  const locale = root.getAttribute('lang') || root.querySelector('[data-action="locale"]')?.value || 'es';
  document.documentElement.lang = locale;
}

export function mountStrictSapB1Lab(root) {
  const state = { scheduled: false };
  const schedule = () => {
    if (state.scheduled) return;
    state.scheduled = true;
    queueMicrotask(() => { state.scheduled = false; enforce(root); });
  };
  root.addEventListener('change', schedule, true);
  const controller = mountSapB1Lab(root);
  schedule();
  return controller;
}
