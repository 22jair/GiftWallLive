// Tickets impresos: componente visual reutilizable para eventos reales.
(() => {
  const list = document.querySelector('[data-list="printed-items"]');
  const template = document.querySelector('#printed-ticket-template');
  const components = window.radioTicketComponents;
  if (!list || !template || !components) return;
  const printer = list.closest('.radio-printer');

  const demoTickets = [
    { user: 'LunaDream', song: 'Sueños de Medianoche', artist: 'Neon Luna', avatar: '../../assets/images/radio-mascot-wink.png' },
    { type: 'gift', user: 'Ariel12323x', gift: 'Rosa lunar', coins: 1, avatar: '../../assets/images/radio-mascot-mouth-open.png' },
    { type: 'gift', user: 'MikaMoon', gift: 'Cofre estelar', coins: 50, avatar: '../../assets/images/radio-mascot-wink.png' },
    { type: 'join', user: 'NovaVibes', avatar: '../../assets/images/radio-mascot-mouth-closed.png' },
    { user: 'Estrella.la', song: 'Levitating', artist: 'Dua Lipa', avatar: '../../assets/images/radio-mascot-mouth-closed.png' },
    { user: 'MikaMoon', song: 'A Sky Full of Stars', artist: 'Coldplay', avatar: '../../assets/images/radio-mascot-wink.png' }
  ];

  const createTicket = (ticket) => components.render(template, ticket);

  const render = (tickets) => list.replaceChildren(...tickets.map(createTicket));
  const addPrintedTicket = (ticket) => {
    const node = createTicket(ticket);
    const element = node.querySelector('.printed-ticket');
    element.classList.add('is-printing');
    list.prepend(node);

    if (printer) {
      printer.classList.add('is-printing');
      window.setTimeout(() => printer.classList.remove('is-printing'), 900);
    }
  };

  window.radioTickets = Object.freeze({ render, add: addPrintedTicket });

  if (window.radioSource !== 'dummy') return;

  let demoIndex = 0;
  const printNextDemo = () => {
    addPrintedTicket(demoTickets[demoIndex]);
    demoIndex = (demoIndex + 1) % demoTickets.length;
  };

  // Demo visual: una impresión nueva cada 4 segundos.
  printNextDemo();
  window.radioTicketsDemo = Object.freeze({
    start: () => setInterval(printNextDemo, 4000)
  });
  window.radioTicketsDemo.start();
})();
