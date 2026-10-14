// En dummy dejamos la mascota en reposo. Las acciones se disparan desde eventos LIVE.
(() => {
  if (window.radioSource !== 'dummy') return;
  if (!window.radioMascot) return;
  window.radioMascot.idle();
  window.radioMascotDemo = Object.freeze({
    idle: () => window.radioMascot.idle(),
    greeting: () => window.radioMascot.greeting(),
    listening: () => window.radioMascot.listening(),
    happy: () => window.radioMascot.happy(),
  });
})();
