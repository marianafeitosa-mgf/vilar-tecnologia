import { SITE_CONFIG } from "../config.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const VALIDATORS = {
  nome: (value) => (value.trim().length >= 3 ? "" : "Informe seu nome completo (mínimo de 3 caracteres)."),
  email: (value) => (EMAIL_PATTERN.test(value.trim()) ? "" : "Informe um e-mail válido, por exemplo: nome@empresa.com.br."),
  telefone: (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length === 0 || digits.length >= 10 ? "" : "Informe um telefone com DDD.";
  },
  assunto: (value) => (value ? "" : "Selecione o assunto da sua mensagem."),
  mensagem: (value) => (value.trim().length >= 10 ? "" : "Escreva sua mensagem (mínimo de 10 caracteres)."),
  consentimento: (_value, field) => (field.checked ? "" : "É necessário aceitar a Política de Privacidade para enviar."),
};

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function validateField(field) {
  const validator = VALIDATORS[field.name];
  if (!validator) return true;

  const message = validator(field.value, field);
  const errorElement = document.getElementById(`${field.id}-erro`);
  if (errorElement) errorElement.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

function setStatus(element, type, message) {
  element.className = `form__status is-${type}`;
  element.textContent = message;
}

async function sendForm(form) {
  if (!SITE_CONFIG.formEndpoint) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return;
  }

  const response = await fetch(SITE_CONFIG.formEndpoint, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new FormData(form),
  });
  if (!response.ok) throw new Error(`Falha no envio: ${response.status}`);
}

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector("[data-submit]");
  const submitLabel = form.querySelector("[data-submit-label]");
  const message = form.querySelector("#mensagem");
  const charCount = form.querySelector("[data-char-count]");
  const phone = form.querySelector("#telefone");
  const fields = [...form.querySelectorAll("input, select, textarea")].filter((field) => VALIDATORS[field.name]);

  phone?.addEventListener("input", () => { phone.value = formatPhone(phone.value); });
  message?.addEventListener("input", () => { if (charCount) charCount.textContent = String(message.value.length); });

  // Valida ao sair do campo e, depois de um erro, revalida enquanto o usuário digita.
  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => { if (field.getAttribute("aria-invalid") === "true") validateField(field); });
    field.addEventListener("change", () => { if (field.getAttribute("aria-invalid") === "true") validateField(field); });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((field) => !validateField(field));
    if (invalidFields.length) {
      setStatus(status, "error", `Revise ${invalidFields.length === 1 ? "o campo destacado" : `os ${invalidFields.length} campos destacados`} antes de enviar.`);
      invalidFields[0].focus();
      return;
    }

    // Robôs costumam preencher o campo oculto; descartamos silenciosamente.
    if (form.elements.website?.value) return;

    submitButton.disabled = true;
    submitLabel.textContent = "Enviando...";
    status.textContent = "";

    try {
      await sendForm(form);
      form.reset();
      if (charCount) charCount.textContent = "0";
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
      setStatus(status, "success", "Mensagem enviada com sucesso! Nossa equipe retornará em até 2 dias úteis.");
    } catch {
      setStatus(status, "error", "Não foi possível enviar agora. Tente novamente ou escreva para contato@vilartecnologia.com.br.");
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = "Enviar mensagem";
    }
  });
}
