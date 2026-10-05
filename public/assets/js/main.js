// Ponto de entrada: inicializa cada módulo. Cada módulo ignora a página
// quando os elementos de que precisa não existem nela.
import { initAccessibility } from "./modules/accessibility.js";
import { initNavigation } from "./modules/navigation.js";
import { initContactForm } from "./modules/contact-form.js";
import { initCookieConsent } from "./modules/cookie-consent.js";
import { initReveal } from "./modules/reveal.js";

function setCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = year;
  });
}

initAccessibility();
initNavigation();
initContactForm();
initCookieConsent();
initReveal();
setCurrentYear();
