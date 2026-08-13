(() => {
  "use strict";

  const ATTRIBUTE = "data-note-dark-enabled";
  const SITE_ATTRIBUTE = "data-note-dark-site";
  const BACKGROUND_PROPERTY = "--note-dark-custom-bg";
  const DEFAULT_BACKGROUND = { red: 16, green: 19, blue: 21 };
  const root = document.documentElement;

  function clampChannel(value, fallback) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return fallback;
    }

    return Math.min(255, Math.max(0, Math.round(number)));
  }

  function normalizeBackground(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      red: clampChannel(source.red, DEFAULT_BACKGROUND.red),
      green: clampChannel(source.green, DEFAULT_BACKGROUND.green),
      blue: clampChannel(source.blue, DEFAULT_BACKGROUND.blue)
    };
  }

  function applyBackground(value) {
    const { red, green, blue } = normalizeBackground(value);
    root.style.setProperty(BACKGROUND_PROPERTY, `rgb(${red}, ${green}, ${blue})`);
  }

  function applyTheme(enabled) {
    if (enabled) {
      root.setAttribute(ATTRIBUTE, "true");
      return;
    }

    root.removeAttribute(ATTRIBUTE);
  }

  root.setAttribute(
    SITE_ATTRIBUTE,
    location.hostname === "editor.note.com" ? "editor" : "reader"
  );

  // Apply defaults synchronously to avoid a white flash while storage loads.
  applyBackground(DEFAULT_BACKGROUND);
  applyTheme(true);

  chrome.storage.local.get(
    { enabled: true, backgroundRgb: DEFAULT_BACKGROUND },
    ({ enabled, backgroundRgb }) => {
      applyBackground(backgroundRgb);
      applyTheme(enabled !== false);
    }
  );

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }

    if (changes.backgroundRgb) {
      applyBackground(changes.backgroundRgb.newValue);
    }

    if (changes.enabled) {
      applyTheme(changes.enabled.newValue !== false);
    }
  });
})();
