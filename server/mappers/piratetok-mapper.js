import { createLiveEvent } from "../domain/live-event.js";

function firstUrl(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return firstUrl(value[0]);
  return firstUrl(value.urlList || value.url_list || value.urls || value.uri);
}

function mapUser(data) {
  const user = data.user || {};
  const username = user.uniqueId || user.unique_id || data.uniqueId || data.unique_id || "usuario";

  return {
    id: String(user.userId || user.user_id || data.userId || data.user_id || username),
    username: String(username).replace(/^@/, ""),
    displayName: user.nickname || data.nickname || username,
    avatarUrl: firstUrl(
      user.profilePicture || user.profile_picture || user.avatarThumb || data.profilePictureUrl,
    ),
  };
}

function mapGift(data) {
  const gift = data.gift || data.extendedGiftInfo || data.giftDetails || {};
  const quantity = Number(data.repeatCount || data.repeat_count || 1);
  const coinsEach = Number(
    gift.diamondCount ?? gift.diamond_count ?? data.diamondCount ?? data.diamond_count ?? 0,
  );
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  const safeCoinsEach = Number.isFinite(coinsEach) && coinsEach >= 0 ? coinsEach : 0;

  return {
    id: String(gift.id || data.giftId || data.gift_id || "unknown"),
    name: gift.name || data.giftName || data.gift_name || "Gift",
    imageUrl: firstUrl(gift.image || gift.icon || gift.imageUrl || gift.image_url),
    quantity: safeQuantity,
    coinsEach: safeCoinsEach,
    totalCoins: safeQuantity * safeCoinsEach,
  };
}

export function mapPirateTokEvent({ type, data, sequence, roomId }) {
  const rawId = data.msgId || data.msg_id || data.eventId || data.event_id || sequence;

  return createLiveEvent({
    id: `piratetok:${rawId}`,
    type,
    user: mapUser(data),
    gift: type === "gift" ? mapGift(data) : null,
    source: {
      provider: "piratetok",
      roomId: roomId || null,
    },
  });
}
