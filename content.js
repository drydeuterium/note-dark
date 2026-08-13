(() => {
  "use strict";

  const ATTRIBUTE = "data-note-dark-enabled";
  const root = document.documentElement;

  function applyTheme(enabled) {
    if (enabled) {
      root.setAttribute(ATTRIBUTE, "true");
      return;
    }

    root.removeAttribute(ATTRIBUTE);
  }

  // The default is enabled. Applying it before reading storage avoids a white
  // flash for first-time users and for most normal page loads.
  applyTheme(true);

  chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
    applyTheme(enabled !== false);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.enabled) {
      applyTheme(changes.enabled.newValue !== false);
    }
  });
})();
