// Keep existing LIVE Studio bookmarks working after introducing the gallery.
// New links point directly to a design. Preserve the complete query string.
if (new URLSearchParams(location.search).has("source")) {
  location.replace("designs/default/index.html" + location.search + location.hash);
}
