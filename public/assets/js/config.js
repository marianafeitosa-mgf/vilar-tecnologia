// Configurações centrais do site. Altere aqui sem precisar mexer nos módulos.
export const SITE_CONFIG = {
  // Endereço que recebe o formulário de contato.
  // - Hospedagem com PHP: "/contato.php" (copie backend/contato.php para a raiz do site).
  // - Serviços externos (Formspree, Getform etc.): cole a URL fornecida.
  // - Vazio (""): modo demonstração, apenas simula o envio.
  formEndpoint: "",

  // Incremente quando a Política de Privacidade mudar, para pedir novo consentimento.
  consentVersion: "1.0",
  consentStorageKey: "vilar-cookie-consent",

  // Preferências de acessibilidade salvas no navegador (cookie estritamente necessário).
  a11yStorageKey: "vilar-a11y",
  fontScale: { min: 0.875, max: 1.5, step: 0.125, default: 1 },

  // Tradutor de Libras do Governo Federal.
  enableVLibras: true,
};
