import { SITE_CONFIG } from "../config.js";

const { a11yStorageKey, fontScale } = SITE_CONFIG;
const root = document.documentElement;

function readPreferences() {
  try {
    return JSON.parse(localStorage.getItem(a11yStorageKey)) ?? {};
  } catch {
    return {};
  }
}

function savePreferences(preferences) {
  try {
    localStorage.setItem(a11yStorageKey, JSON.stringify(preferences));
  } catch {
    // Navegação privada pode bloquear o armazenamento; o recurso continua funcionando na sessão.
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyFontScale(scale) {
  root.style.fontSize = `${scale * 100}%`;
}

function applyContrast(isHigh, button) {
  if (isHigh) root.dataset.contrast = "high";
  else delete root.dataset.contrast;
  button?.setAttribute("aria-pressed", String(isHigh));
}

function loadVLibras() {
  if (!SITE_CONFIG.enableVLibras || document.querySelector("[vw]")) return;

  const container = document.createElement("div");
  container.setAttribute("vw", "");
  container.className = "enabled";
  container.innerHTML =
    '<div vw-access-button class="active"></div>' +
    '<div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
  document.body.appendChild(container);

  const script = document.createElement("script");
  script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  script.async = true;
  script.onload = () => new window.VLibras.Widget("https://vlibras.gov.br/app");
  document.body.appendChild(script);
}

export function initAccessibility() {
  const preferences = { scale: fontScale.default, highContrast: false, ...readPreferences() };
  const contrastButton = document.querySelector('[data-a11y="contrast"]');

  applyFontScale(preferences.scale);
  applyContrast(preferences.highContrast, contrastButton);

  const actions = {
    "font-increase": () => { preferences.scale = clamp(preferences.scale + fontScale.step, fontScale.min, fontScale.max); applyFontScale(preferences.scale); },
    "font-decrease": () => { preferences.scale = clamp(preferences.scale - fontScale.step, fontScale.min, fontScale.max); applyFontScale(preferences.scale); },
    "font-reset": () => { preferences.scale = fontScale.default; applyFontScale(preferences.scale); },
    contrast: () => { preferences.highContrast = !preferences.highContrast; applyContrast(preferences.highContrast, contrastButton); },
  };

  document.querySelectorAll("[data-a11y]").forEach((button) => {
    button.addEventListener("click", () => {
      actions[button.dataset.a11y]?.();
      savePreferences(preferences);
    });
  });

  // Garante que o foco vá para o destino ao usar os atalhos "Ir para..."
  document.querySelectorAll('.a11y-bar__shortcuts a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    });
  });

  loadVLibras();
}
