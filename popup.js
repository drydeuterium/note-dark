(() => {
  "use strict";

  const toggle = document.querySelector("#enabled");
  const status = document.querySelector("#status");

  function render(enabled) {
    toggle.checked = enabled;
    status.textContent = enabled
      ? "ダークモードはオン"
      : "ダークモードはオフ";
  }

  chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
    render(enabled !== false);
  });

  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    render(enabled);
    chrome.storage.local.set({ enabled });
  });
})();
