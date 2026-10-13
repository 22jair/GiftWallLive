// Componente visual de la cola; luego puede recibir datos del socket.
(() => {
  const list = document.querySelector('[data-list="queue-items"]');
  const template = document.querySelector('#queue-item-template');
  if (!list || !template) return;
  const demoQueue = [
    { user: 'Estrella.la', request: 'Neon Luna · Sueños de Medianoche', avatar: '../../assets/images/radio-mascot-wink.png' },
    { user: 'Fede.T', request: 'Dua Lipa · Levitating', avatar: '../../assets/images/radio-mascot-mouth-open.png' },
    { user: 'MikaMoon', request: 'Coldplay · A Sky Full of Stars', avatar: '../../assets/images/radio-mascot-mouth-closed.png' },
    { user: 'LunaDream', request: 'The Weeknd · Blinding Lights', avatar: '../../assets/images/radio-mascot-mouth-open.png' },
    { user: 'NovaVibes', request: 'Billie Eilish · Birds of a Feather', avatar: '../../assets/images/radio-mascot-wink.png' }
  ];
  const render = (items) => list.replaceChildren(...items.map((item, index) => {
    const row = template.content.cloneNode(true);
    row.querySelector('.queue-item').classList.toggle('queue-item--active', index === 0);
    row.querySelector('.queue-position').textContent = index + 1;
    const avatar = row.querySelector('.queue-avatar'); avatar.src = item.avatar; avatar.alt = item.user;
    row.querySelector('.queue-copy strong').textContent = item.user;
    row.querySelector('.queue-copy small').textContent = item.request;
    return row;
  }));
  window.radioQueue = Object.freeze({ render });
  render(demoQueue);
})();
