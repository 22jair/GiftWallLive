const EVENT_VERSION = 1;

export function createLiveEvent({ id, type, occurredAt, user, gift = null, source }) {
  if (!["gift", "follow", "join", "chat"].includes(type)) {
    throw new Error(`Tipo de evento no soportado: ${type}`);
  }

  return {
    version: EVENT_VERSION,
    id: String(id),
    type,
    occurredAt: occurredAt || new Date().toISOString(),
    user,
    gift: type === "gift" ? gift : null,
    chat: type === "chat" ? source.chat || { text: "" } : null,
    source,
  };
}
