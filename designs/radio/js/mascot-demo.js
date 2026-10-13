// Demo local: recorre los estados sin depender de datos reales.
(() => {
  if (!window.radioMascot) return;
  const states = ['idle', 'greeting', 'listening', 'happy'];
  let index = 0;
  const runNext = () => { window.radioMascot[states[index]](); index = (index + 1) % states.length; };
  runNext();
  window.radioMascotDemo = Object.freeze({ start: () => { runNext(); return setInterval(runNext, 5000); } });
  window.radioMascotDemo.start();
})();
