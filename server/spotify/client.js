export class SpotifyApiError extends Error {
  constructor(message, { status = 0, details = null } = {}) {
    super(message);
    this.name = "SpotifyApiError";
    this.status = status;
    this.details = details;
  }
}

function formBody(values) {
  return new URLSearchParams(values).toString();
}

function expiresAtFromToken(token) {
  const expiresIn = Number(token.expires_in);
  return Date.now() + (Number.isFinite(expiresIn) ? Math.max(0, expiresIn - 60) * 1000 : 0);
}

export class SpotifyClient {
  constructor(config) {
    this.config = config;
    this.tokens = null;
  }

  get isConfigured() {
    return Boolean(this.config?.enabled && this.config.clientId);
  }

  isAuthenticated() {
    return Boolean(this.tokens?.accessToken);
  }

  status() {
    return {
      configured: this.isConfigured,
      authenticated: this.isAuthenticated(),
      expiresAt: this.tokens?.expiresAt || null,
      scopes: this.config?.scopes || [],
    };
  }

  setTokens(token) {
    if (!token?.access_token) throw new SpotifyApiError("Spotify no devolvió un access token.");

    this.tokens = {
      accessToken: token.access_token,
      refreshToken: token.refresh_token || this.tokens?.refreshToken || null,
      expiresAt: expiresAtFromToken(token),
      tokenType: token.token_type || "Bearer",
      scope: token.scope || this.config.scopes.join(" "),
    };
    return this.status();
  }

  async exchangeCode({ code, verifier }) {
    const response = await fetch(`${this.config.accountsBase}/api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({
        client_id: this.config.clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: this.config.redirectUri,
        code_verifier: verifier,
      }),
    });
    const payload = await parseResponse(response);
    if (!response.ok) {
      throw new SpotifyApiError("Spotify rechazó el código de autorización.", {
        status: response.status,
        details: payload,
      });
    }
    return this.setTokens(payload);
  }

  async refreshAccessToken() {
    if (!this.tokens?.refreshToken) {
      throw new SpotifyApiError("La sesión de Spotify necesita autorización.", { status: 401 });
    }

    const response = await fetch(`${this.config.accountsBase}/api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({
        client_id: this.config.clientId,
        grant_type: "refresh_token",
        refresh_token: this.tokens.refreshToken,
      }),
    });
    const payload = await parseResponse(response);
    if (!response.ok) {
      this.tokens = null;
      throw new SpotifyApiError("No se pudo renovar la sesión de Spotify.", {
        status: response.status,
        details: payload,
      });
    }
    return this.setTokens(payload);
  }

  async accessToken() {
    if (!this.tokens?.accessToken) {
      throw new SpotifyApiError("Spotify no está conectado.", { status: 401 });
    }
    if (Date.now() >= this.tokens.expiresAt) await this.refreshAccessToken();
    return this.tokens.accessToken;
  }

  async request(path, options = {}, { retry = true } = {}) {
    const token = await this.accessToken();
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `${this.tokens.tokenType} ${token}`);
    if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    const response = await fetch(`${this.config.apiBase}${path}`, { ...options, headers });
    if (response.status === 401 && retry && this.tokens?.refreshToken) {
      await this.refreshAccessToken();
      return this.request(path, options, { retry: false });
    }

    const payload = await parseResponse(response);
    if (!response.ok) {
      throw new SpotifyApiError(`Spotify API respondió ${response.status}.`, {
        status: response.status,
        details: payload,
      });
    }
    return payload;
  }

  async searchTrack({ song, artist }) {
    const searchText = artist ? `track:${song} artist:${artist}` : song;
    const query = encodeURIComponent(searchText);
    const payload = await this.request(`/search?type=track&limit=5&q=${query}`);
    const tracks = payload?.tracks?.items || [];
    const track = tracks[0];
    if (!track) return null;

    return {
      id: track.id,
      uri: track.uri,
      name: track.name,
      artist: track.artists?.map((item) => item.name).join(", ") || artist,
      album: track.album?.name || "",
      albumImageUrl: track.album?.images?.[0]?.url || "",
      externalUrl: track.external_urls?.spotify || "",
    };
  }

  addToQueue(uri) {
    return this.request(`/me/player/queue?uri=${encodeURIComponent(uri)}`, { method: "POST" });
  }

  getPlaybackState() {
    return this.request("/me/player");
  }

  getQueue() {
    return this.request("/me/player/queue");
  }
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
