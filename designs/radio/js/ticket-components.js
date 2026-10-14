// Variantes visuales de las tarjetas que salen del printer.
(() => {
  const fallbackAvatar = '../../assets/images/radio-mascot-wink.png';
  const SPECIAL_GIFT_MIN_COINS = 31;

  const field = (fragment, selector, value) => {
    fragment.querySelector(selector).textContent = value ?? '';
  };

  const renderMusic = (fragment, ticket) => {
    fragment.querySelector('.printed-ticket').classList.add('printed-ticket--music');
    field(fragment, '.printed-ticket__kind', 'MÚSICA EN COLA');
    field(fragment, '.printed-ticket__song', ticket.song || 'Pedido musical');
    field(fragment, '.printed-ticket__artist', `En cola · gracias, ${ticket.user || 'usuario'}`);
  };

  const renderGift = (fragment, ticket, special = false) => {
    const element = fragment.querySelector('.printed-ticket');
    element.classList.add('printed-ticket--gift');
    if (special) element.classList.add('printed-ticket--gift-special');
    field(fragment, '.printed-ticket__kind', special ? 'REGALO ESPECIAL' : 'REGALO RECIBIDO');
    field(fragment, '.printed-ticket__song', ticket.gift || 'Regalo especial');
    field(fragment, '.printed-ticket__artist', `de ${ticket.user || 'usuario'}`);
    const coins = Number(ticket.coins ?? 1);
    field(fragment, '.printed-ticket__wave', `✦ ${coins} moneda${coins === 1 ? '' : 's'} ✦`);
  };

  const renderJoin = (fragment, ticket) => {
    fragment.querySelector('.printed-ticket').classList.add('printed-ticket--join');
    field(fragment, '.printed-ticket__song', `WELCOME · ¡Bienvenido, ${ticket.user || 'usuario'}!`);
  };

  const renderFollow = (fragment, ticket) => {
    fragment.querySelector('.printed-ticket').classList.add('printed-ticket--join');
    field(fragment, '.printed-ticket__song', `Gracias por seguir, ${ticket.user || 'usuario'}`);
  };

  const renderers = Object.freeze({
    music: renderMusic,
    gift: (fragment, ticket) => renderGift(fragment, ticket),
    'gift-special': (fragment, ticket) => renderGift(fragment, ticket, true),
    join: renderJoin,
    follow: renderFollow
  });

  const resolveType = (ticket) => {
    if (ticket.type === 'gift') {
      const coins = Number(ticket.coins ?? 0);
      return coins >= SPECIAL_GIFT_MIN_COINS ? 'gift-special' : 'gift';
    }
    if (ticket.type === 'join') return 'join';
    if (ticket.type === 'follow') return 'follow';
    return 'music';
  };

  const render = (template, ticket = {}) => {
    const fragment = template.content.cloneNode(true);
    const element = fragment.querySelector('.printed-ticket');
    const type = resolveType(ticket);
    const avatar = fragment.querySelector('.printed-ticket__avatar');

    element.dataset.ticketType = type;
    avatar.src = ticket.avatar || fallbackAvatar;
    avatar.alt = ticket.user ? `Avatar de ${ticket.user}` : 'Avatar del usuario';
    renderers[type](fragment, ticket);
    return fragment;
  };

  window.radioTicketComponents = Object.freeze({ render, resolveType, renderers, SPECIAL_GIFT_MIN_COINS });
})();
