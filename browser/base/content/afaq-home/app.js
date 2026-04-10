const engines = {
  startpage: {
    base: "https://www.startpage.com/sp/search",
    param: "query",
  },
  duckduckgo: {
    base: "https://duckduckgo.com/",
    param: "q",
  },
  privau: {
    base: "https://priv.au/search",
    param: "q",
  },
};

function buildSearchURL(engineId, query) {
  const engine = engines[engineId] || engines.startpage;
  const url = new URL(engine.base);
  url.searchParams.set(engine.param, query);
  return url.toString();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const engineSelect = document.getElementById("engineSelect");

  form.addEventListener("submit", event => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) {
      input.focus();
      return;
    }
    window.location.href = buildSearchURL(engineSelect.value, query);
  });
});
