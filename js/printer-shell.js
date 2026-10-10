// One shared layout for every design. Themes change presentation, not event logic.
document.body.insertAdjacentHTML("afterbegin", `    <main class="live-stage" aria-label="LIVE activity receipt">
      <div class="live-body">
        <aside class="gift-showcase" aria-labelledby="gift-showcase-title">
          <h2 id="gift-showcase-title" class="visually-hidden">Gift collection</h2>
          <ol id="gift-tier-list" class="gift-showcase__list" aria-label="Gift tiers" tabindex="0"></ol>
          <p class="gift-showcase__status"><span aria-hidden="true"></span><strong id="active-tier-label">Waiting for a gift</strong></p>
        </aside>
        <div class="printer-bay">
          <section class="printer" aria-labelledby="receipt-title">
            <header class="printer__slot">
              <div class="printer__lid" aria-hidden="true"><span class="printer__brand">GIFTWALL</span><span class="printer__vents"></span></div>
              <div class="printer__display"><span class="printer__led" aria-hidden="true"></span><h2 id="receipt-title">Now Printing</h2></div>
              <span class="printer__feed-control" aria-hidden="true">▴</span>
            </header>
            <div class="printer__output" aria-hidden="true"><span></span></div>
            <div class="receipt"><div id="activity-feed" class="receipt__feed" aria-live="polite"></div></div>
          </section>
        </div>
        <aside class="top-three" aria-labelledby="top-title">
          <h1 id="top-title" class="visually-hidden">Top gifts of the LIVE</h1>
          <div id="podium" class="top-three__list"></div>
        </aside>
      </div>
    </main>`);
if (window.GWLTheme?.title) document.querySelector("#receipt-title").textContent = window.GWLTheme.title;

