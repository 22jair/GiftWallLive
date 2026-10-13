// Fuente de datos de la radio: demo explícito o LIVE vacío.
(() => {
  const source = new URLSearchParams(window.location.search).get('source');
  window.radioSource = source === 'dummy' ? 'dummy' : 'live';

  if (window.radioSource !== 'dummy') {
    document.querySelectorAll('[data-demo-only]').forEach((element) => element.hidden = true);
  }
})();
