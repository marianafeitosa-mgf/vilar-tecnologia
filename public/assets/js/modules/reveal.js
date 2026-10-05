// Animação suave de entrada. Desativada para quem prefere movimento reduzido
// e sem efeito quando o JavaScript não carrega (o conteúdo fica sempre visível).
const SELECTOR = ".card, .process__step, .insight, .testimonial, .about__media, .faq__item";

export function initReveal() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  const elements = document.querySelectorAll(SELECTOR);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  elements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}
