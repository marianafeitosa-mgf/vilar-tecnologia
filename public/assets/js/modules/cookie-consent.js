import { SITE_CONFIG } from "../config.js";

const { consentStorageKey, consentVersion } = SITE_CONFIG;

export function getConsent() {
  try {
    const consent = JSON.parse(localStorage.getItem(consentStorageKey));
    return consent?.version === consentVersion ? consent : null;
  } catch {
    return null;
  }
}

function saveConsent(categories) {
  const consent = {
    version: consentVersion,
    date: new Date().toISOString(),
    categories: { necessary: true, ...categories },
  };
  try {
    localStorage.setItem(consentStorageKey, JSON.stringify(consent));
  } catch {
    // Sem armazenamento disponível: o banner reaparecerá na próxima visita.
  }
  document.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }));
  return consent;
}

// Carregue aqui scripts opcionais (Google Analytics, Meta Pixel etc.)
// SOMENTE quando a categoria correspondente tiver sido autorizada.
function applyConsent(consent) {
  if (consent?.categories.analytics) {
    // Ex.: loadScript("https://www.googletagmanager.com/gtag/js?id=G-XXXX");
  }
  if (consent?.categories.marketing) {
    // Ex.: carregar pixel de marketing.
  }
}

export function initCookieConsent() {
  const banner = document.querySelector("[data-cookie-banner]");
  if (!banner) return;

  const options = banner.querySelector("[data-cookie-options]");
  const customizeButton = banner.querySelector('[data-cookie-action="customize"]');
  const categoryInputs = [...banner.querySelectorAll("[data-cookie-category]")];

  const show = () => {
    const consent = getConsent();
    categoryInputs.forEach((input) => { input.checked = Boolean(consent?.categories[input.dataset.cookieCategory]); });
    banner.hidden = false;
  };

  const close = (consent) => {
    applyConsent(consent);
    banner.hidden = true;
    options.hidden = true;
    customizeButton.setAttribute("aria-expanded", "false");
    customizeButton.textContent = "Personalizar";
  };

  const selectedCategories = () =>
    Object.fromEntries(categoryInputs.map((input) => [input.dataset.cookieCategory, input.checked]));

  const actions = {
    accept: () => close(saveConsent({ analytics: true, marketing: true })),
    reject: () => close(saveConsent({ analytics: false, marketing: false })),
    customize: () => {
      if (options.hidden) {
        options.hidden = false;
        customizeButton.setAttribute("aria-expanded", "true");
        customizeButton.textContent = "Salvar preferências";
        categoryInputs[0]?.focus();
      } else {
        close(saveConsent(selectedCategories()));
      }
    },
  };

  banner.querySelectorAll("[data-cookie-action]").forEach((button) => {
    button.addEventListener("click", () => actions[button.dataset.cookieAction]());
  });

  document.querySelectorAll("[data-open-cookie-preferences]").forEach((button) => {
    button.addEventListener("click", () => {
      show();
      actions.customize();
    });
  });

  const consent = getConsent();
  if (consent) applyConsent(consent);
  else show();
}
