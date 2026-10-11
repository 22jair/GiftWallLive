window.GWLLiveEvents = (() => {
  const DEFAULT_URL = "ws://127.0.0.1:8081/live";
  const RETRY_DELAY = 3000;

  function connect({ onEvent, onAvailability, url = DEFAULT_URL }) {
    let socket = null;
    let retryTimer = null;
    let stopped = false;

    function retry() {
      if (stopped || retryTimer) return;
      retryTimer = window.setTimeout(open, RETRY_DELAY);
    }

    function open() {
      retryTimer = null;
      socket = new WebSocket(url);

      socket.addEventListener("message", ({ data }) => {
        try {
          const message = JSON.parse(data);
          if (message.type === "status") {
            if (message.state === "connected") onAvailability(true);
            if (["offline", "error", "waiting", "disconnected"].includes(message.state)) {
              onAvailability(false);
            }
            return;
          }
          if (message.version === 1 && ["gift", "follow"].includes(message.type)) {
            onEvent(message);
          }
        } catch (error) {
          console.warn("[GiftWallLive] Evento WebSocket inválido", error);
        }
      });

      socket.addEventListener("close", () => {
        onAvailability(false);
        retry();
      });

      socket.addEventListener("error", () => socket.close());
    }

    open();

    return () => {
      stopped = true;
      window.clearTimeout(retryTimer);
      socket?.close();
    };
  }

  return Object.freeze({ connect });
})();
