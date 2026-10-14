import { EventEmitter } from "node:events";

// Lista editable de canciones populares para mantener la radio sonando.
export const DEFAULT_RADIO_TRACKS = Object.freeze([
  ["Dynamite", "BTS"],
  ["Butter", "BTS"],
  ["Boy With Luv", "BTS"],
  ["Permission to Dance", "BTS"],
  ["DDU-DU DDU-DU", "BLACKPINK"],
  ["How You Like That", "BLACKPINK"],
  ["Kill This Love", "BLACKPINK"],
  ["Pink Venom", "BLACKPINK"],
]);

export class SpotifyFallbackRadio extends EventEmitter {
  constructor({ spotifyClient, hasPendingRequests = () => false, tracks = DEFAULT_RADIO_TRACKS, intervalMs = 20_000 } = {}) {
    super();
    this.spotifyClient = spotifyClient;
    this.hasPendingRequests = hasPendingRequests;
    this.tracks = tracks;
    this.intervalMs = intervalMs;
    this.timer = null;
    this.lastIndex = -1;
    this.running = false;
  }

  start() {
    if (this.timer || this.running) return;
    this.running = true;
    void this.ensurePlaying();
    this.timer = setInterval(() => void this.ensurePlaying(), this.intervalMs);
    this.timer.unref?.();
  }

  stop() {
    this.running = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  async ensurePlaying() {
    if (!this.running || !this.spotifyClient?.isAuthenticated() || this.hasPendingRequests()) return null;

    try {
      const playback = await this.spotifyClient.getPlaybackState();
      if (playback?.is_playing) return playback;

      // Una pausa manual no debe iniciar otra canción. Solo continuamos cuando
      // no hay canción actual o cuando la actual ya llegó prácticamente al final.
      const current = playback?.item;
      if (current) {
        const progress = Number(playback.progress_ms);
        const duration = Number(current.duration_ms);
        const ended = Number.isFinite(progress) && Number.isFinite(duration) && progress >= duration - 1_500;
        if (!ended) return playback;
      }

      const queue = await this.spotifyClient.getQueue();
      if (Array.isArray(queue?.queue) && queue.queue.length > 0) return queue;

      const track = await this.pickTrack();
      if (!track) return null;
      await this.spotifyClient.startPlayback(track.uri);
      this.emit("started", track);
      return track;
    } catch (error) {
      // No hay dispositivo activo o Spotify aún no está listo: se reintentará en el siguiente ciclo.
      this.emit("error", error);
      return null;
    }
  }

  async pickTrack() {
    if (!this.tracks.length) return null;
    let index = Math.floor(Math.random() * this.tracks.length);
    if (this.tracks.length > 1 && index === this.lastIndex) index = (index + 1) % this.tracks.length;
    this.lastIndex = index;
    const [song, artist] = this.tracks[index];
    return this.spotifyClient.searchTrack({ song, artist });
  }
}
