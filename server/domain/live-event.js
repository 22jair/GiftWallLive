const EVENT_VERSION = 1;

export function createLiveEvent({ id, type, occurredAt, user, gift = null, source }) {
  if (type !== "gift" && type !== "follow") {
    throw new Error(`Tipo de evento no soportado: ${type}`);
  }

  return {
    version: EVENT_VERSION,
    id: String(id),
    type,
    occurredAt: occurredAt || new Date().toISOString(),
    user,
    gift: type === "gift" ? gift : null,
    source,
  };
}
