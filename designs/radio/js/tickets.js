// Tickets impresos: componente visual reutilizable para eventos reales.
(() => {
  const list = document.querySelector('[data-list="printed-items"]');
  const template = document.querySelector('#printed-ticket-template');
  const components = window.radioTicketComponents;
  if (!list || !template || !components) return;
  const MAX_PRINTED_TICKETS = 10;
  const printer = list.closest('.radio-printer');

  const demoTickets = [
    { user: 'LunaDream', song: 'Sueños de Medianoche', artist: 'Neon Luna', avatar: '../../assets/images/radio-mascot-wink.png' },
    { type: 'gift', user: 'Ariel12323x', gift: 'Rosa lunar', quantity: 1, coins: 1, avatar: '../../assets/images/radio-mascot-mouth-open.png' },
    { type: 'gift', user: 'MikaMoon', gift: 'Cofre estelar', quantity: 3, coins: 50, avatar: '../../assets/images/radio-mascot-wink.png' },
    { type: 'follow', user: 'NovaVibes', avatar: '../../assets/images/radio-mascot-mouth-closed.png' },
    { user: 'Estrella.la', song: 'Levitating', artist: 'Dua Lipa', avatar: '../../assets/images/radio-mascot-mouth-closed.png' },
    { user: 'MikaMoon', song: 'A Sky Full of Stars', artist: 'Coldplay', avatar: '../../assets/images/radio-mascot-wink.png' }
  ];

  const createTicket = (ticket) => components.render(template, ticket);

  const trimPrintedTickets = () => {
    while (list.children.length > MAX_PRINTED_TICKETS) {
      list.lastElementChild?.remove();
    }
  };

  const render = (tickets) => {
    const visibleTickets = Array.isArray(tickets) ? tickets.slice(-MAX_PRINTED_TICKETS) : [];
    list.replaceChildren(...visibleTickets.map(createTicket));
  };

  const addPrintedTicket = (ticket) => {
    const node = createTicket(ticket);
    const element = node.querySelector('.printed-ticket');
    element.classList.add('is-printing');
    list.prepend(node);
    trimPrintedTickets();

    if (printer) {
      printer.classList.add('is-printing');
      window.setTimeout(() => printer.classList.remove('is-printing'), 900);
    }
  };

  window.radioTickets = Object.freeze({
    render,
    add: addPrintedTicket,
    maxItems: MAX_PRINTED_TICKETS
  });

  if (window.radioSource !== 'dummy') return;

  let demoIndex = 0;
  let demoMusicActive = false;
  let demoTimer = null;
  const printNextDemo = () => {
    const ticket = demoTickets[demoIndex];
    addPrintedTicket(ticket);
    if (ticket.song) {
      demoMusicActive = true;
      window.radioMascotDemo?.listening();
    } else if (ticket.type === 'follow') {
      window.radioMascotDemo?.greeting();
      if (demoMusicActive) window.setTimeout(() => window.radioMascotDemo?.listening(), 1800);
    } else if (ticket.type === 'gift') {
      window.radioMascotDemo?.happy();
      if (demoMusicActive) window.setTimeout(() => window.radioMascotDemo?.listening(), 1800);
    } else if (!demoMusicActive) {
      window.radioMascotDemo?.idle();
    }
    demoIndex = (demoIndex + 1) % demoTickets.length;
  };

  // Demo visual: una impresión nueva cada 4 segundos.
  printNextDemo();
  window.radioTicketsDemo = Object.freeze({
    start: () => {
      if (demoTimer) return demoTimer;
      demoTimer = setInterval(printNextDemo, 4000);
      return demoTimer;
    }
  });
  window.radioTicketsDemo.start();
})();
