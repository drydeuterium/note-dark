(() => {
  "use strict";

  const DEFAULT_BACKGROUND = { red: 16, green: 19, blue: 21 };
  const toggle = document.querySelector("#enabled");
  const status = document.querySelector("#status");
  const rgbValue = document.querySelector("#rgb-value");
  const colorPreview = document.querySelector("#color-preview");
  const resetButton = document.querySelector("#reset-color");
  const inputs = {
    red: document.querySelector("#red"),
    green: document.querySelector("#green"),
    blue: document.querySelector("#blue")
  };

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

  function renderBackground(value, updateInputs = true) {
    const background = normalizeBackground(value);
    const color = `rgb(${background.red}, ${background.green}, ${background.blue})`;

    if (updateInputs) {
      inputs.red.value = String(background.red);
      inputs.green.value = String(background.green);
      inputs.blue.value = String(background.blue);
    }

    rgbValue.textContent = color;
    colorPreview.style.backgroundColor = color;
    return background;
  }

  function readBackground(useDefaults = false) {
    if (!useDefaults && Object.values(inputs).some((input) => input.value.trim() === "")) {
      return null;
    }

    return normalizeBackground({
      red: inputs.red.value.trim() === "" ? DEFAULT_BACKGROUND.red : inputs.red.value,
      green: inputs.green.value.trim() === "" ? DEFAULT_BACKGROUND.green : inputs.green.value,
      blue: inputs.blue.value.trim() === "" ? DEFAULT_BACKGROUND.blue : inputs.blue.value
    });
  }

  function renderEnabled(enabled) {
    toggle.checked = enabled;
    status.textContent = enabled
      ? "ダークモードはオン"
      : "ダークモードはオフ";
  }

  chrome.storage.local.get(
    { enabled: true, backgroundRgb: DEFAULT_BACKGROUND },
    ({ enabled, backgroundRgb }) => {
      renderEnabled(enabled !== false);
      renderBackground(backgroundRgb);
    }
  );

  Object.values(inputs).forEach((input) => {
    input.addEventListener("input", () => {
      const background = readBackground();

      if (!background) {
        return;
      }

      renderBackground(background);
      chrome.storage.local.set({ backgroundRgb: background });
    });

    input.addEventListener("change", () => {
      const background = renderBackground(readBackground(true));
      chrome.storage.local.set({ backgroundRgb: background });
    });
  });

  resetButton.addEventListener("click", () => {
    const background = renderBackground(DEFAULT_BACKGROUND);
    chrome.storage.local.set({ backgroundRgb: background });
  });

  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    renderEnabled(enabled);
    chrome.storage.local.set({ enabled });
  });
})();
