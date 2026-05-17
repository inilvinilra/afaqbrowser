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

function looksLikeAddress(value) {
  return (
    /^https?:\/\//i.test(value) ||
    (/^[^\s]+\.[^\s]{2,}/.test(value) && !value.includes(" "))
  );
}

function buildDestination(engineId, value) {
  if (!looksLikeAddress(value)) {
    return buildSearchURL(engineId, value);
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function updateEngineButtons(engineId) {
  for (const button of document.querySelectorAll("[data-engine]")) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.engine === engineId)
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const engineSelect = document.getElementById("engineSelect");

  updateEngineButtons(engineSelect.value);
  input.focus();

  engineSelect.addEventListener("change", () => {
    updateEngineButtons(engineSelect.value);
  });

  for (const button of document.querySelectorAll("[data-engine]")) {
    button.addEventListener("click", () => {
      engineSelect.value = button.dataset.engine;
      updateEngineButtons(engineSelect.value);
      input.focus();
    });
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      input.focus();
      return;
    }
    window.location.href = buildDestination(engineSelect.value, value);
  });
});
