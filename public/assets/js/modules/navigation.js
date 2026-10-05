const DESKTOP_QUERY = window.matchMedia("(min-width: 1024px)");

function setupMobileMenu(toggle, nav) {
  const label = toggle.querySelector(".sr-only");

  const setOpen = (isOpen) => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    nav.classList.toggle("is-open", isOpen);
    if (label) label.textContent = isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação";
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a") && !DESKTOP_QUERY.matches) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  DESKTOP_QUERY.addEventListener("change", () => setOpen(false));
}

function setupScrollShadow(header) {
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupActiveSection(nav) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

export function initNavigation() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (header) setupScrollShadow(header);
  if (toggle && nav) setupMobileMenu(toggle, nav);
  if (nav) setupActiveSection(nav);
}
