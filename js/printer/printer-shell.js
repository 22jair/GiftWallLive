// One shared layout for every design. Themes change presentation, not event logic.
document.body.insertAdjacentHTML("afterbegin", `    <main class="live-stage" aria-label="LIVE activity receipt">
      <div class="live-body">
        <aside class="gift-showcase" aria-labelledby="gift-showcase-title">
          <h2 id="gift-showcase-title" class="visually-hidden">Gift collection</h2>
          <ol id="gift-tier-list" class="gift-showcase__list" aria-label="Gift tiers" tabindex="0"></ol>
          <p class="gift-showcase__status"><span aria-hidden="true"></span><strong id="active-tier-label">Waiting for a gift</strong><small class="gift-showcase__hint">10+ coins → larger cards</small></p>
        </aside>
        <div class="printer-bay">
          <section class="printer" aria-labelledby="receipt-title">
            <header class="printer__slot">
              <div class="printer__lid" aria-hidden="true"><span class="printer__vents"></span></div>
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
          <p class="top-three__guide" aria-label="Gift display guide">
            <span class="top-three__guide-title">Gift guide</span>
            <span class="top-three__guide-line"><strong>Join</strong><em>Welcome banner</em></span>
            <span class="top-three__guide-line"><strong>1–9 coins</strong><em>Featured card</em></span>
            <span class="top-three__guide-line"><strong>10+ coins</strong><em>Full card</em></span>
          </p>
          <div class="gift-mascot" aria-label="Friendly printer mascot">
            <p class="gift-mascot__bubble"><span id="gift-mascot-greeting" aria-live="polite">Hello!</span></p>
            <div class="gift-mascot__printer">
              <i class="gift-mascot__ear gift-mascot__ear--left"></i><i class="gift-mascot__ear gift-mascot__ear--right"></i>
              <div class="gift-mascot__face"><i></i><i></i><b></b></div>
              <span class="gift-mascot__slot"></span>
              <i class="gift-mascot__arm gift-mascot__arm--left"></i><i class="gift-mascot__arm gift-mascot__arm--right"></i>
              <i class="gift-mascot__foot gift-mascot__foot--left"></i><i class="gift-mascot__foot gift-mascot__foot--right"></i>
            </div>
          </div>
        </aside>
      </div>
    </main>`);
if (window.GWLTheme?.title) document.querySelector("#receipt-title").textContent = window.GWLTheme.title;

